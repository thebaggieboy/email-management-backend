const Email = require("../models/Email");


exports.getAnalytics = async (req, res) => {
    try {
      // Get all emails belonging to the user
      const emails = await Email.find({ userId: req.userId });
      // Loop through the email response time
      const responseTimes = emails.map((email) => email.responseTime);
      
      const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  
      res.json({
        totalEmails: emails.length,
        averageResponseTime,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };