const express = require("express");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const OpenAI = require("openai");

const Email = require("../models/Email");
const User = require("../models/User");

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Connect to Gmail
exports.connectGmail = async (req, res) => {
    try {
        const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
        );

        const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/gmail.readonly"],
        });

        res.json({ authUrl });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add this as a separate route handler
exports.handleOAuthCallback = async (req, res) => {
    const { code } = req.query;

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Save token to the database associated with the user
        const user = await User.findById(req.userId);
        user.googleTokens = tokens;
        await user.save();

        res.json({ message: "Gmail account connected successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Sync emails
exports.syncEmails = async (req, res) => {
  try {
    const { accessToken } = req.body;
    // Initialise oauth
    const oauth2Client = new google.auth.OAuth2();
    // Set token
    oauth2Client.setCredentials({ access_token: accessToken });
    const user = await User.findById(req.userId)
    if(user.googleTokens.expiry_date < Date.now()){
      const credentials = await oauth2Client.refreshToken(user.googleTokens.refresh_token)
      user.googleTokens = credentials
      await user.save()
  }
  
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const response = await gmail.users.messages.list({ userId: "me" });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// Get all emails for a user
exports.getEmails = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if(!user.googleTokens) throw new Error("Gmail not conected")

    oauth2Client.setCredentials(user.googleTokens)
    const gmail = google.gmail({version:"v1", auth:oauth2Client})

    const response = await gmail.users.messages.list({userId:"me"})
    res.json(response.data)

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new email
exports.createEmail = async (req, res) => {
  try {
    const { subject, body, priority } = req.body;
    const email = new Email({ userId: req.userId, subject, body, priority });
    await email.save();
    res.status(201).json(email);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.sendEmail = async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: oauth2Client
    });

    await transporter.sendMail({ to, subject, text: body });
    res.json({ message: "Email sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.generateResponse = async (req, res) => {
  try {
    const { emailContent, brandVoice } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Generate a response to this email in a ${brandVoice} tone. Email: ${emailContent}`
        }
      ],
      max_tokens: 150,
    });

    const generatedResponse = response.choices[0].message.content.trim();
    res.json({ generatedResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.classifyEmail = async (req, res) => {
  try {
    const { emailContent } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Classify this email into one of the following categories: product questions, shipping, returns, sizing, other. Email: ${emailContent}`
        }
      ],
      max_tokens: 10,
    });

    const category = response.choices[0].message.content.trim();
    res.json({ category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.analyzeSentiment = async (req, res) => {
  try {
    const { emailContent } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Analyze the sentiment of this email: ${emailContent}. Respond with "positive", "neutral", or "negative".`
        }
      ],
      max_tokens: 10,
    });
    const sentiment = response.choices[0].message.content.trim();
    res.json({ sentiment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const emailController = {
  connectGmail: exports.connectGmail,
  handleOAuthCallback: exports.handleOAuthCallback,
  syncEmails: exports.syncEmails,
  getEmails: exports.getEmails,
  createEmail: exports.createEmail,
  sendEmail: exports.sendEmail,
  generateResponse: exports.generateResponse,
  classifyEmail: exports.classifyEmail,
  analyzeSentiment: exports.analyzeSentiment
};

module.exports = emailController;










