// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import CORS
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const multer = require('multer');
const {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command
} = require('@aws-sdk/client-s3');
const { v4: uuid } = require('uuid');
const app = express();
const port = process.env.PORT || 5000;

const db = require('./db');

const allowedOrigins = [
  'https://hollywoodchase.github.io', // ✅ your GitHub Pages frontend
  'http://localhost:3000'             // ✅ optional: local dev
];
// —— Configure S3 & multer ———————————————————————————
const upload = multer();  // in‑memory storage for file uploads
const s3 = new S3Client({
  region: 'us-east-1', // <— hardcoded temporarily
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
// Increase limit to handle profile image in Base64 (e.g. 2MB)
// Parse JSON bodies (up to 5MB for images)
app.use(express.json({ limit: '5mb' }));

// ——— Updated: S3 file‑upload endpoint ———————————————————
// Now "userId" is optional—if provided, we prefix the key.
// Also accepts an optional "folder" field ("gallery" or "profile")
app.post('/api/upload', upload.single('file'), async (req, res) => {

  const userId = req.body.userId;
  const folder = req.body.folder;
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  // Build S3 key
  let prefix = '';
  if (userId) prefix += `${userId}/`;
  if (folder) prefix += `${folder}/`;
  const key = `${prefix}${uuid()}_${req.file.originalname}`;
  if (!process.env.S3_BUCKET || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('Missing AWS config:', {
      S3_BUCKET: process.env.S3_BUCKET,
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY
    });
    return res.status(500).json({ error: 'AWS configuration missing' });
  }
  try {
    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    }));

    const url = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`;

    // **Only** update profile_image if this was a profile upload**
    if (folder === 'profile') {
      const updateUserQuery = `
        UPDATE user_accounts
        SET profile_image = ?
        WHERE user_id = ?
      `;
      await db.query(updateUserQuery, [url, userId]);
    }

    return res.json({ url });
  } catch (err) {
    console.error('S3 upload error:', err.message, err);

    console.error('S3 upload error:', err);
    return res.status(500).json({ error: 'Upload to S3 failed' });
  }
});
// ————————————————————————————————————————————————————————

/* New: List a user’s gallery straight from S3 */
app.get('/api/gallery', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'No userId provided' });
  }

  try {
    const { Contents = [] } = await s3.send(new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET,
      Prefix: `${userId}/gallery/`
    }));

    const urls = Contents
      .filter(obj => obj.Key && !obj.Key.endsWith('/'))
      .map(obj => `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${obj.Key}`);

    res.json(urls);
  } catch (err) {
    console.error('Gallery list error:', err);
    res.status(500).json({ error: 'Failed to list gallery' });
  }
});



// Test Database Connection Endpoint
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    res.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Root Endpoint (for testing purposes)
app.get('/', (req, res) => {
  res.send('Backend is running');
});

/* Users Routes */
// Endpoint to get all user accounts
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM user_accounts');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Endpoint to create a new user (Signup)
app.post('/users', async (req, res) => {
  const { username, password, secret, fav_park, profile_image } = req.body;
  try {
    // Hash the password with a salt round of 10
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO user_accounts (username, password, secret, fav_park, profile_image) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, secret, fav_park, profile_image || null]
    );
    res.json({ message: 'User created successfully', userId: result[0].insertId });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
  
});

// New Login Endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body; // ✅ updated from email to username
  try {
    const normalizedUsername = username.trim().toLowerCase(); // optional: normalize case
    const [users] = await db.query(
      'SELECT * FROM user_accounts WHERE LOWER(username) = ?',
      [normalizedUsername]
    );
    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }
    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    res.json({ message: 'Login successful', userId: user.user_id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});


// NEW: Recover Account Endpoint
app.post('/recover', async (req, res) => {
  const { username, secretWord } = req.body; // ✅ updated from email to username
  try {
    const [users] = await db.query(
      'SELECT * FROM user_accounts WHERE username = ?',
      [username.trim()]
    );
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = users[0];
    if (user.secret.trim().toLowerCase() !== secretWord.trim().toLowerCase()) {
      return res.status(401).json({ error: 'Incorrect secret word' });
    }
    res.json({ message: 'Account recovery successful', userId: user.user_id });
  } catch (error) {
    console.error('Recovery error:', error);
    res.status(500).json({ error: 'Failed to recover account' });
  }
});


// NEW: Get Account Settings for a User by ID
app.get('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const [rows] = await db.query(
      'SELECT user_id, username, secret, fav_park, profile_image FROM user_accounts WHERE user_id = ?',
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ error: 'Failed to fetch user settings' });
  }
});

// NEW: Update Account Settings for a User by ID
app.put('/users/:id', async (req, res) => {
  const userId = req.params.id;
  // Fields to update: password, secret, fav_park, profile_image.
  const { password, secret, fav_park, profile_image } = req.body;
  try {
    // Fetch the existing user record
    const [users] = await db.query('SELECT * FROM user_accounts WHERE user_id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    let newPassword = users[0].password;
    if (password && password.trim().length > 0) {
      newPassword = await bcrypt.hash(password, 10);
    }
    await db.query(
      'UPDATE user_accounts SET password = ?, secret = ?, fav_park = ?, profile_image = ? WHERE user_id = ?',
      [
        newPassword,
        secret !== undefined ? secret : users[0].secret,
        fav_park !== undefined ? fav_park : users[0].fav_park,
        profile_image || users[0].profile_image, // Only update if new profile image URL is provided
        userId,
      ]
    );
    res.json({ message: 'User settings updated successfully' });
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(500).json({ error: 'Failed to update user settings' });
  }
});

/* Liked Parks Back-End Points
1. Get list of liked parks by userid
2. Adding a like for the user
3. Deleting previously like

*/
//Get list of liked parks by userid.
app.get('/liked-parks/:userId', async (req, res) => {
  const userId = req.params.userId;  // UserID will be contained within the URL. Retrieve it from there.

  try {
    const [rows] = await db.query(
      'SELECT liked_park FROM liked_parks WHERE user_ID = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No  liked parks found' });
    }

    res.json(rows);
  } catch (error) {
    console.error('Error fetching liked parks-backend:', error);
  }
});


//adding a like for the user
app.post('/liked-parks', async (req, res) => {
  const { userId, parkName } = req.body;  // Get userId and park names from request

  try {
    const [userRows] = await db.query(
      'SELECT * FROM user_accounts WHERE user_id = ?',
      [userId]
    );
    
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found-backend' });
    }

    // Check if the park is already liked by the user
    const [existingRows] = await db.query(
      'SELECT * FROM liked_parks WHERE user_id = ? AND liked_park = ?',
      [userId, parkName]
    );

    if (existingRows.length > 0) {
      return res.status(400).json({ error: 'Park already liked-backend' });
    }

    // Insert the new liked park into the liked_parks table
    await db.query(
      'INSERT INTO liked_parks (user_id, liked_park) VALUES (?, ?)',
      [userId, parkName]
    );

    res.status(200).json({ message: 'Park liked successfully-backend' });
  } catch (error) {
    console.error('Error adding liked park-backend:', error);
    res.status(500).json({ error: 'Failed to add liked park-backend' });
  }
});

// Remove a liked park for a user
app.delete('/liked-parks', async (req, res) => {
  const { userId, parkName } = req.body;  // Get userId and park names from the request

  try {
    const [userRows] = await db.query(
      'SELECT * FROM user_accounts WHERE user_id = ?',
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found-backend' });
    }

    // Delete the liked park from the liked_parks table
    const [result] = await db.query(
      'DELETE FROM liked_parks WHERE user_id = ? AND liked_park = ?',
      [userId, parkName]
    );

    res.status(200).json({ message: 'Park unliked successfully' });
  } catch (error) {
    console.error('Error removing liked park-backend:', error);
    res.status(500).json({ error: 'Failed to remove liked park-backend' });
  }
});




// Start the Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});