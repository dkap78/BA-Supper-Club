# Ba's Supper Club Website

## Features
A complete website solution for Ba's Supper Club featuring:
### Frontend
- Responsive React website with Tailwind CSS
- Interactive gallery with image viewing
- Customer feedback form
- Admin dashboard for content management
- Home-style dining experience showcase
### Backend
- Express.js server with file upload support
- Email notifications for feedback submissions
- Image upload and management for gallery
- JSON-based data storage
- Admin authentication
- Menu management with admin dashboard
## Setup Instructions
- Customer feedback system with email notifications
### 1. Install Dependencies
```bash
npm install
```
### 2. Environment Configuration
Copy `.env.example` to `.env` and configure your email settings:
```bash
cp .env.example .env
```
Edit `.env` with your email provider settings:
- For Gmail: Enable 2FA and create an App Password
- For other providers: Configure SMTP settings accordingly

### 3. Start the Development Server
```bash
# Start the frontend
npm run dev
# Start the backend server (in another terminal)
node server.js
```
### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Admin Dashboard: Add `/adashb` to the URL and use password: `admin123`
## File Structure
```
├── src/
│   ├── components/
│   │   └── AdminDashboard.tsx    # Admin interface
│   ├── App.tsx                   # Main application
│   └── main.tsx                  # Entry point
├── public/
│   ├── data/                     # JSON data files
│   └── uploads/gallery/          # Uploaded images
├── server.js                     # Backend server
└── package.json                  # Dependencies
```
## Admin Features
### Content Management
- Edit home page summary
- Manage menus with categories (starter, main course, desserts)
- Configure reservation settings
- Manage customer reviews
### Gallery Management
- Upload multiple images per album
- Reorder images with drag controls
- Delete unwanted images
- Create and edit photo albums
### Feedback System
- View all customer feedback
- Automatic email notifications to admin and customers
- Export feedback data
## Email Configuration
The system supports multiple email providers:
### Gmail Setup
1. Enable 2-factor authentication on your Google account
2. Generate an App Password for the application
3. Use your Gmail address and App Password in `.env`
### Other Providers
Configure SMTP settings in `server.js` for providers like:
- SendGrid
- AWS SES
- Mailgun
- Custom SMTP servers
## Image Upload
- Supports common image formats (JPG, PNG, GIF, WebP)
- Maximum file size: 5MB per image
- Images are stored in `public/uploads/gallery/`
- Automatic thumbnail generation and optimization
## Security Features
- Admin password protection
- File upload validation
- CORS configuration
- Input sanitization
## Deployment
### Frontend Deployment
```bash
npm run build
```
Deploy the `dist` folder to your hosting provider.
### Backend Deployment
Ensure your hosting provider supports:
- Node.js runtime
- File upload capabilities
- Environment variables
- Email sending (SMTP)
## Troubleshooting
### Email Issues
- Check your email provider's SMTP settings
- Verify App Password for Gmail
- Check firewall/security settings
### Image Upload Issues
- Ensure `public/uploads/gallery/` directory exists
- Check file permissions
- Verify file size limits
### Admin Access
- Default password: `admin123`
- Access via: `yoursite.com/adashb`
- Change password in Admin Dashboard > Password tab
## Support
For technical support or customization requests, please contact the development team.