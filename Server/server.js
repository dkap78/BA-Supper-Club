import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import multer from 'multer';
import nodemailer from 'nodemailer';
import PDFDocument from "pdfkit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'data', 'uploads', 'gallery'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Create uploads directory if it doesn't exist
const createUploadsDir = async () => {
  const uploadsDir = path.join(__dirname, 'data', 'uploads', 'gallery');
  try {
    await fs.access(uploadsDir);
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true });
  }
};

// Email configuration (you'll need to configure this with your email provider)
const createEmailTransporter = () => {
  // For development, you can use a service like Gmail or a test service like Ethereal
  // For production, use a proper email service like SendGrid, AWS SES, etc.
  return nodemailer.createTransporter({
    // Gmail configuration (you'll need to enable "Less secure app access" or use App Passwords)
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
    // Alternative: Use Ethereal for testing
    // host: 'smtp.ethereal.email',
    // port: 587,
    // auth: {
    //   user: 'ethereal.user@ethereal.email',
    //   pass: 'ethereal.pass'
    // }
  });
};

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'data', 'uploads')));

// Initialize uploads directory
createUploadsDir();

// API endpoint to get content.json
app.get('/api/get-content', async (req, res) => {
  try {
    const contentPath = path.join(__dirname, 'data', 'content.json');
    const data = await fs.readFile(contentPath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading content.json:', error);
    res.status(500).json({ success: false, message: 'Failed to read content.json' });
  }
});
// API endpoint to update content.json
app.post('/api/update-content', async (req, res) => {
  try {
    const contentPath = path.join(__dirname, 'data', 'content.json');
    await fs.writeFile(contentPath, JSON.stringify(req.body, null, 2));
    res.json({ success: true, message: 'Content updated successfully' });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ success: false, message: 'Failed to update content' });
  }
});

// API endpoint to get feedbacks.json
app.get('/api/get-feedbacks', async (req, res) => {
  try {
    const feedbacksPath = path.join(__dirname, 'data', 'feedbacks.json');
    const data = await fs.readFile(feedbacksPath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading feedbacks.json:', error);
    res.status(500).json({ success: false, message: 'Failed to read feedbacks.json' });
  }
});
// API endpoint to update feedbacks.json
app.post('/api/update-feedbacks', async (req, res) => {
  try {
    const feedbacksPath = path.join(__dirname, 'data', 'feedbacks.json');
    await fs.writeFile(feedbacksPath, JSON.stringify(req.body, null, 2));
    res.json({ success: true, message: 'Feedbacks updated successfully' });
  } catch (error) {
    console.error('Error updating feedbacks:', error);
    res.status(500).json({ success: false, message: 'Failed to update feedbacks' });
  }
});

// API endpoint to get club-pamphlet.html
app.get('/api/get-club-pamphlet', async (req, res) => {
  try {
    const pamphletPath = path.join(__dirname, 'data', 'club-pamphlet.html');
    const data = await fs.readFile(pamphletPath, 'utf8');
    res.type('text/html').send(data);  // send raw HTML as response
  } catch (error) {
    console.error('Error reading club pamphlet.html:', error);
    res.status(500).json({ success: false, message: 'Failed to read club pamphlet.hml' });
  }
});

// API endpoint to get club-pamphlet.html
app.get('/api/get-catering-pamphlet', async (req, res) => {
  try {
    const pamphletPath = path.join(__dirname, 'data', 'catering-pamphlet.html');
    const data = await fs.readFile(pamphletPath, 'utf8');
    res.type('text/html').send(data);  // send raw HTML as response
  } catch (error) {
    console.error('Error reading catering pamphlet.html:', error);
    res.status(500).json({ success: false, message: 'Failed to read catering pamphlet.hml' });
  }
});

// API endpoint to get admin.json
app.get('/api/get-admin', async (req, res) => {
  try {
    const feedbacksPath = path.join(__dirname, 'data', 'admin.json');
    const data = await fs.readFile(feedbacksPath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading admin.json:', error);
    res.status(500).json({ success: false, message: 'Failed to read admin.json' });
  }
});
// API endpoint to update admin.json
app.post('/api/update-admin', async (req, res) => {
  try {
    const adminPath = path.join(__dirname, 'data', 'admin.json');
    await fs.writeFile(adminPath, JSON.stringify(req.body, null, 2));
    res.json({ success: true, message: 'Admin data updated successfully' });
  } catch (error) {
    console.error('Error updating admin data:', error);
    res.status(500).json({ success: false, message: 'Failed to update admin data' });
  }
});

// API endpoint to get catering.json
app.get('/api/get-catering', async (req, res) => {
  try {
    const cateringFile = path.join(__dirname, 'data', 'catering.json');
    const data = await fs.readFile(cateringFile, 'utf-8');
    res.json(JSON.parse(data));
  } catch {
    console.error('Error reading catering.json:', error);
    res.status(500).json({ message: 'Failed to load catering data' });
  }
});
// API endpoint to update catering.json
app.post('/api/update-catering', async (req, res) => {
  try {
    const cateringFile  = path.join(__dirname, 'data', 'catering.json');
    const { description, mealTypeOrder, menus, notes } = req.body;

    await fs.writeFile(
      cateringFile,
      JSON.stringify({ description, mealTypeOrder, menus, notes }, null, 2)
    );

    res.json({ success: true, message: 'Catering data updated successfully' });
  } catch(error) {
    console.error('Error updating catering data:', error);
    res.status(500).json({ message: 'Failed to save catering data' });
  }
});
// API endpoint to download catering PDF
app.get('/api/download-catering-menu', async (req, res) => {
  try {
    const cateringFile = path.join(__dirname, 'data', 'catering.json');
    const data = await fs.readFile(cateringFile, 'utf-8');
  } catch {
    console.error('Error reading catering.json:', error);
    res.status(500).json({ message: 'Failed to load catering data' });
  }

  try 
  {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=catering-menu.pdf');
    doc.pipe(res);

    doc.fontSize(20).text('Catering Menu', { align: "center" });
    doc.moveDown();

    doc.fontSize(11).text(data.description || "");
    doc.moveDown(2);

    // Group by meal type
    const grouped = {};
    (catering.menus || []).forEach(i => {
      grouped[i.mealType] = grouped[i.mealType] || [];
      grouped[i.mealType].push(i);
    });

    Object.keys(grouped).forEach(type => {
      doc.fontSize(14).text(type, { underline: true });
      doc.moveDown(0.5);

      grouped[type].forEach(item => {
        doc.fontSize(11).text(
          `${item.name}  (${item.qty} ${item.qtyUnit})  -  ₹${item.price}`
        );
      });

      doc.moveDown();
    });

    // Notes
    if (catering.notes?.length) {
      doc.moveDown();
      doc.fontSize(13).text("Notes", { underline: true });
      catering.notes.forEach(n => doc.text(`• ${n.note}`));
    }

    // Footer
    doc.moveDown(3);
    doc.fontSize(11).text("BA’s Supper Club Catering");
    doc.text("Jamnagar, Gujarat, India");
    doc.text("Phone: +91 99741 20608");

    doc.end();
  } catch (err) {
    console.error("Error while generating Catering PDF: ", error);
    res.status(500).send("Failed to generate PDF.");
  }
});

// API endpoint to submit feedback
app.post('/api/submit-feedback', async (req, res) => {
  try {
    const feedbackData = {
      id: `feedback-${Date.now()}`,
      ...req.body,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };

    // Read existing feedbacks
    const feedbacksPath = path.join(__dirname, 'data', 'feedbacks.json');
    let feedbacks = [];
    try {
      const existingData = await fs.readFile(feedbacksPath, 'utf8');
      feedbacks = JSON.parse(existingData);
    } catch (error) {
      // File doesn't exist or is empty, start with empty array
      feedbacks = [];
    }

    // Add new feedback
    feedbacks.push(feedbackData);

    // Save updated feedbacks
    await fs.writeFile(feedbacksPath, JSON.stringify(feedbacks, null, 2));

    // Send email notifications
    try {
      const transporter = createEmailTransporter();
      
      // Read admin email from content.json
      const contentPath = path.join(__dirname, 'data', 'content.json');
      const contentData = JSON.parse(await fs.readFile(contentPath, 'utf8'));
      const adminEmail = contentData.feedback.adminEmail;

      // Email to admin
      const adminMailOptions = {
        from: process.env.EMAIL_USER || 'noreply@basupperclub.com',
        to: adminEmail,
        subject: `New Feedback from ${feedbackData.name} - Ba's Supper Club`,
        html: `
          <h2>New Feedback Received</h2>
          <p><strong>Name:</strong> ${feedbackData.name}</p>
          <p><strong>Email:</strong> ${feedbackData.email}</p>
          <p><strong>Rating:</strong> ${feedbackData.rating}/5 stars</p>
          <p><strong>Would Recommend:</strong> ${feedbackData.recommend}</p>
          <p><strong>Date:</strong> ${feedbackData.date}</p>
          <h3>Feedback:</h3>
          <p>${feedbackData.content}</p>
          <hr>
          <p><em>This feedback was submitted through the Ba's Supper Club website.</em></p>
        `
      };

      // Email to customer (confirmation)
      const customerMailOptions = {
        from: process.env.EMAIL_USER || 'noreply@basupperclub.com',
        to: feedbackData.email,
        subject: 'Thank you for your feedback - Ba\'s Supper Club',
        html: `
          <h2>Thank you for your feedback!</h2>
          <p>Dear ${feedbackData.name},</p>
          <p>Thank you for taking the time to share your experience with Ba's Supper Club. Your feedback is very important to us and helps us continue to improve our service.</p>
          <h3>Your Feedback Summary:</h3>
          <p><strong>Rating:</strong> ${feedbackData.rating}/5 stars</p>
          <p><strong>Would Recommend:</strong> ${feedbackData.recommend}</p>
          <p><strong>Your Comments:</strong></p>
          <p>${feedbackData.content}</p>
          <p>We truly appreciate your support and look forward to welcoming you back to Ba's Supper Club soon!</p>
          <p>Warm regards,<br>Ba's Supper Club Team</p>
          <hr>
          <p><em>Ba's Supper Club - Home-style dining in Jamnagar</em></p>
        `
      };

      // Send emails
      await transporter.sendMail(adminMailOptions);
      await transporter.sendMail(customerMailOptions);
      
      console.log('Feedback emails sent successfully');
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      // Don't fail the request if email fails
    }

    res.json({ 
      success: true, 
      message: 'Feedback submitted successfully! Thank you for your feedback.',
      feedbackId: feedbackData.id
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit feedback. Please try again.' 
    });
  }
});

// API endpoint to upload gallery images
app.post('/api/upload-gallery-images', upload.array('images', 10), async (req, res) => {
  try {
    const { albumId } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    // Get uploaded file names
    const uploadedFiles = req.files.map(file => file.filename);

    res.json({ 
      success: true, 
      message: 'Images uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload images' 
    });
  }
});

// API endpoint to delete gallery image
app.delete('/api/delete-gallery-image/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'data', 'uploads', 'gallery', filename);
    
    await fs.unlink(filePath);
    
    res.json({ 
      success: true, 
      message: 'Image deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete image' 
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
