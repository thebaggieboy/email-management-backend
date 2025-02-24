const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const emailController = require("../controllers/emailController");

const templateController = require("../controllers/templateController");
const auth = require("../middleware/auth");

router.post("/register", authController.register);





/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *               password:
 *                 type: string
 *                 description: The user's password
 *             example:
 *               email: "user@example.com"
 *               password: "securepassword123"
 *     responses:
 *       200:
 *         description: A JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The JWT token
 *               example:
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /api/emails/connect:
 *   post:
 *     summary: Connect to Gmail
 *     tags: [Emails]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Redirects to Google OAuth consent screen
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/emails/connect", auth, emailController.connectGmail);
 
/**
 * @swagger
 * /api/emails/list:
 *   get:
 *     summary: Fetch a list of emails
 *     tags: [Emails]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of emails
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Email'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/emails/list", auth, emailController.getEmails);
 
/**
 * @swagger
 * /api/emails/send:
 *   post:
 *     summary: Send an email
 *     tags: [Emails]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: The recipient's email address
 *               subject:
 *                 type: string
 *                 description: The subject of the email
 *               body:
 *                 type: string
 *                 description: The content of the email
 *             example:
 *               to: "customer@example.com"
 *               subject: "Order Confirmation"
 *               body: "Thank you for your order!"
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/emails/send", auth, emailController.sendEmail);

/**
 * @swagger
 * /api/emails/sync:
 *   post:
 *     summary: Sync emails from Gmail
 *     tags: [Emails]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Emails synced successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
 
router.post("/emails/sync", auth, emailController.syncEmails);

/**
 * @swagger
 * /api/emails/classify:
 *   post:
 *     summary: Classify an email into a category
 *     tags: [Emails]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailContent:
 *                 type: string
 *                 description: The content of the email
 *             example:
 *               emailContent: "Hi, I want to return my order. How do I proceed?"
 *     responses:
 *       200:
 *         description: The category of the email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   type: string
 *                   description: The category of the email
 *               example:
 *                 category: "returns"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/emails/classify", auth, emailController.classifyEmail);






module.exports = router;