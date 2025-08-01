
import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ArrowRight, 
  Star, 
  Clock, 
  MapPin, 
  Phone,
  Mail,
  ChefHat,
  Wine,
  Utensils,
  Calendar,
  Users,
  Award,
  Heart,
  ChevronLeft,
  ChevronRight,
  Settings,
  Lock
} from 'lucide-react';
import AdminDashboard from './components/AdminDashboard';

interface ContentData {
  home: {
    summary: string;
  };
  menus: Array<{
    id: string;
    date: string;
    title: string;
    pricePerPerson: number;
    maxPersons: number;
    childrenAllowed: boolean;
    categories: {
      mainCourse: Array<{ name: string; description: string; }>;
      desserts: Array<{ name: string; description: string; }>;
    };
  }>;
  feedback: {
    adminEmail: string;
  };
  reviews: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    content: string;
    rating: number;
    date: string;
    status: string;
  }>;
  gallery: Array<{
    id: string;
    name: string;
    description: string;
    date: string;
    photos: string[];
  }>;
  reservation: {
    phoneNumber: string;
    gpayNumber: string;
    contactPerson: string;
  };
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    rating: 0,
    content: '',
    recommend: ''
  });

  useEffect(() => {
    loadContentData();
    
    // Check if admin route is accessed
    const currentPath = window.location.pathname;
    if (currentPath.endsWith('/adashb')) {
      setShowAdminLogin(true);
      // Replace the URL without the admin path to hide it
      window.history.replaceState({}, '', window.location.pathname.replace('/adashb', ''));
    }
  }, []);

  const loadContentData = async () => {
    try {
      const response = await fetch('/data/content.json');
      const data = await response.json();
      setContentData(data);
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    
    try {
      const response = await fetch('/data/admin.json');
      const adminData = await response.json();
      
      // Simple bcrypt-like comparison (in production, use proper bcrypt)
      const isValidPassword = await verifyPassword(adminPassword, adminData.password);
      
      if (isValidPassword) {
        setIsAdminAuthenticated(true);
        setShowAdminLogin(false);
        setShowAdminDashboard(true);
        setAdminPassword('');
      } else {
        setAdminError('Invalid password. Please try again.');
      }
    } catch (error) {
      console.error('Error authenticating admin:', error);
      setAdminError('Authentication failed. Please try again.');
    }
  };

  const verifyPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    // Simple password verification (in production, use proper bcrypt)
    // For demo purposes, the hashed password represents "admin123"
    const newHashedPassword = `$2b$10$${btoa(plainPassword).substring(0, 53)}`
    return newHashedPassword === hashedPassword;
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setShowAdminDashboard(false);
    setShowAdminLogin(false);
    setAdminPassword('');
    setAdminError('');
  };

  if (!contentData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Get latest menu
  const latestMenu = contentData.menus
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  // Get active reviews
  const activeReviews = contentData.reviews
    .filter(review => review.status === 'active')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Get gallery albums sorted by date
  const galleryAlbums = contentData.gallery
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % activeReviews.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + activeReviews.length) % activeReviews.length);
  };

  const nextGallerySlide = () => {
    setCurrentGalleryIndex((prev) => 
      prev + 4 >= galleryAlbums.length ? 0 : prev + 4
    );
  };

  const prevGallerySlide = () => {
    setCurrentGalleryIndex((prev) => 
      prev - 4 < 0 ? Math.max(0, galleryAlbums.length - 4) : prev - 4
    );
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const feedbackData = {
      id: `feedback-${Date.now()}`,
      ...feedbackForm,
      date: new Date().toISOString().split('T')[0]
    };

    try {
      // Save feedback locally (in real app, this would be sent to backend)
      console.log('Saving feedback:', feedbackData);
      
      // Send email to admin (in real app, this would be handled by backend)
      console.log('Sending email to admin:', contentData.feedback.adminEmail);
      
      alert('Thank you for your feedback! We have received your submission.');
      setFeedbackForm({
        name: '',
        email: '',
        rating: 0,
        content: '',
        recommend: ''
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    }
  };

  const generateWhatsAppPamphlet = () => {
    if (!latestMenu) return;
    
    const pamphletContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Ba's Supper Club - ${latestMenu.title}</title>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; color: #f59e0b; }
        .menu-item { margin: 10px 0; }
        .price { font-size: 24px; font-weight: bold; color: #d97706; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Ba's Supper Club</h1>
        <h2>${latestMenu.title}</h2>
        <h3>${new Date(latestMenu.date).toLocaleDateString()}</h3>
    </div>
    
    <div class="price">₹${latestMenu.pricePerPerson} per person</div>
    
    <h3>Main Course:</h3>
    ${latestMenu.categories.mainCourse.map(item => 
      `<div class="menu-item"><strong>${item.name}</strong>: ${item.description}</div>`
    ).join('')}
    
    <h3>Desserts:</h3>
    ${latestMenu.categories.desserts.map(item => 
      `<div class="menu-item"><strong>${item.name}</strong>: ${item.description}</div>`
    ).join('')}
    
    <p><strong>Reservation:</strong> ${contentData.reservation.phoneNumber} (${contentData.reservation.contactPerson})</p>
    <p><strong>Max Guests:</strong> ${latestMenu.maxPersons}</p>
    <p><strong>Children:</strong> ${latestMenu.childrenAllowed ? 'Allowed' : 'Not permitted'}</p>
</body>
</html>
    `;
    
    const blob = new Blob([pamphletContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bas-supper-club-${latestMenu.date}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const displayedGalleryAlbums = galleryAlbums.slice(currentGalleryIndex, currentGalleryIndex + 4);

  return (
    <div className="min-h-screen bg-gray-900">
      

      {/* Admin Login Modal */}
      {showAdminLogin && !isAdminAuthenticated && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Admin Access</h2>
              <p className="text-gray-600 mt-2">Enter admin password to continue</p>
            </div>
            
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              
              {adminError && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {adminError}
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminLogin(false);
                    setAdminPassword('');
                    setAdminError('');
                  }}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Dashboard */}
      {showAdminDashboard && isAdminAuthenticated && (
        <AdminDashboard onClose={handleAdminLogout} />
      )}

      {/* Album Viewer Modal */}
      {selectedAlbum && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-semibold">{selectedAlbum.name}</h3>
                <p className="text-gray-600">{selectedAlbum.date}</p>
              </div>
              <button
                onClick={() => setSelectedAlbum(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-700 mb-4">{selectedAlbum.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {selectedAlbum.photos.map((photo: string, index: number) => (
                <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">{photo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-amber-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-orange-500 rounded-full flex items-center justify-center">
                    <Utensils className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-serif font-bold text-amber-400">Ba's Supper Club</span>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#home" className="text-amber-400 hover:text-amber-300 px-3 py-2 text-sm font-medium transition-colors">Home</a>
                <a href="#menu" className="text-gray-300 hover:text-amber-300 px-3 py-2 text-sm font-medium transition-colors">Menu</a>
                <a href="#experience" className="text-gray-300 hover:text-amber-300 px-3 py-2 text-sm font-medium transition-colors">Experience</a>
                <a href="#testimonials" className="text-gray-300 hover:text-amber-300 px-3 py-2 text-sm font-medium transition-colors">Reviews</a>
                <a href="#gallery" className="text-gray-300 hover:text-amber-300 px-3 py-2 text-sm font-medium transition-colors">Gallery</a>
                <a href="#feedback" className="text-gray-300 hover:text-amber-300 px-3 py-2 text-sm font-medium transition-colors">Feedback</a>
                <a href="#reservations" className="text-gray-300 hover:text-amber-300 px-3 py-2 text-sm font-medium transition-colors">Reservations</a>
              </div>
            </div>
            
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-amber-300 focus:outline-none"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900/95 border-t border-amber-600/20">
              <a href="#home" className="text-amber-400 hover:text-amber-300 block px-3 py-2 text-base font-medium">Home</a>
              <a href="#menu" className="text-gray-300 hover:text-amber-300 block px-3 py-2 text-base font-medium">Menu</a>
              <a href="#experience" className="text-gray-300 hover:text-amber-300 block px-3 py-2 text-base font-medium">Experience</a>
              <a href="#testimonials" className="text-gray-300 hover:text-amber-300 block px-3 py-2 text-base font-medium">Reviews</a>
              <a href="#gallery" className="text-gray-300 hover:text-amber-300 block px-3 py-2 text-base font-medium">Gallery</a>
              <a href="#feedback" className="text-gray-300 hover:text-amber-300 block px-3 py-2 text-base font-medium">Feedback</a>
              <a href="#reservations" className="text-gray-300 hover:text-amber-300 block px-3 py-2 text-base font-medium">Reservations</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg')] bg-cover bg-center opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-serif font-bold text-white leading-tight">
                Ba's
                <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Supper Club
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
                {contentData.home.summary}
              </p>
            </div>
            
            <div className="flex justify-center items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">Est. 2025</div>
                <div className="text-gray-400 text-sm">Home-style Dining</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">Max {latestMenu?.maxPersons || 8}</div>
                <div className="text-gray-400 text-sm">Guests per Seating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Highlights Section */}
      {latestMenu && (
        <section id="menu" className="py-20 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                {latestMenu.title} - {new Date(latestMenu.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                A special dining experience featuring authentic recipes that Ba has perfected over the years
              </p>
              <div className="mt-8 inline-block bg-gradient-to-r from-red-600 to-orange-500 rounded-xl px-8 py-4 border-2 border-yellow-400">
                <div className="text-yellow-200 text-sm font-medium uppercase tracking-wide">Special Event</div>
                <div className="text-2xl font-bold text-white">{new Date(latestMenu.date).toLocaleDateString()}</div>
                <div className="text-3xl font-bold text-white">Complete Menu</div>
                <div className="text-4xl font-serif font-bold text-white">₹{latestMenu.pricePerPerson}</div>
                <div className="text-amber-100 text-sm">Per Person | All Items Included</div>
                <div className="mt-4">
                  <button 
                    onClick={generateWhatsAppPamphlet}
                    className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    📱 Download WhatsApp Pamphlet
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-900 rounded-xl p-8 border border-amber-600/20 hover:border-amber-600/40 transition-all">
                <div className="flex items-center mb-6">
                  <div className="text-amber-500 mr-3">
                    <ChefHat className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-serif font-semibold text-white">Main Course</h3>
                </div>
                
                <div className="space-y-6">
                  {latestMenu.categories.mainCourse.map((item, idx) => (
                    <div key={idx} className="border-b border-gray-700 pb-4 last:border-b-0">
                      <h4 className="text-lg font-medium text-amber-400 mb-2">{item.name}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-8 border border-amber-600/20 hover:border-amber-600/40 transition-all">
                <div className="flex items-center mb-6">
                  <div className="text-amber-500 mr-3">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-serif font-semibold text-white">Desserts</h3>
                </div>
                
                <div className="space-y-6">
                  {latestMenu.categories.desserts.map((item, idx) => (
                    <div key={idx} className="border-b border-gray-700 pb-4 last:border-b-0">
                      <h4 className="text-lg font-medium text-amber-400 mb-2">{item.name}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <div className="bg-gray-900 rounded-xl p-6 border border-amber-600/20 inline-block">
                <p className="text-gray-300 text-lg mb-2">{new Date(latestMenu.date).toLocaleDateString()} experience includes:</p>
                <p className="text-amber-400 font-medium">
                  {latestMenu.categories.mainCourse.map(item => item.name).join(' • ')} • {latestMenu.categories.desserts.map(item => item.name).join(' • ')}
                </p>
                <p className="text-gray-400 text-sm mt-2">Served with guacamole, sour cream, and various homemade salsas</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Experience Section */}
      <section id="experience" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                Ba's Vision & Purpose
              </h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                The cozy setting and communal dining style offer a more relaxed and personal atmosphere than a traditional restaurant, 
                allowing for deeper connections with my guests. Through this supper club, I also hope to share my culinary vision by 
                presenting a variety of cuisines and dishes that are rarely found in the restaurants of Jamnagar.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center">
                  <Heart className="w-8 h-8 text-amber-500 mr-3" />
                  <div>
                    <div className="text-white font-semibold">Made with Love</div>
                    <div className="text-gray-400 text-sm">Every dish prepared with care</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-amber-500 mr-3" />
                  <div>
                    <div className="text-white font-semibold">Intimate Setting</div>
                    <div className="text-gray-400 text-sm">Maximum {latestMenu?.maxPersons || 8} guests</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <ChefHat className="w-8 h-8 text-amber-500 mr-3" />
                  <div>
                    <div className="text-white font-semibold">Ba's Personal Touch</div>
                    <div className="text-gray-400 text-sm">Personal care for every guest</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-8 h-8 text-amber-500 mr-3" />
                  <div>
                    <div className="text-white font-semibold">Jamnagar's Gem</div>
                    <div className="text-gray-400 text-sm">Authentic home-style dining</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-amber-600 to-orange-500 rounded-2xl p-8 text-white">
                <h4 className="text-lg font-semibold text-white mb-3">Dining Guidelines</h4>
                <div className="space-y-4">
                  <p className="text-amber-100 leading-relaxed">
                    Bina Parekh, fondly known as 'Ba' in the family (no relation to her age), has always had a passion for cooking. 
                    Her love for creating delicious meals and sharing them with others led her to open Ba's Supper Club.
                  </p>
                  <p className="text-amber-100 leading-relaxed">
                    Ba wanted to bring the authentic taste of her home delicacies to the people of Jamnagar. 
                    The homely atmosphere, personal care, and intimate dining experience with limited guests 
                    will take you to a place you have never experienced before.
                  </p>
                  <p className="text-amber-100 leading-relaxed">
                    Every dish is prepared with the same love and attention Ba gives to her own family meals, 
                    ensuring an authentic home-style dining experience that brings comfort and joy to every guest.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {activeReviews.length > 0 && (
        <section id="testimonials" className="py-20 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                What Our Guests Say
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Hear from the people who have experienced Ba's warmth and authentic home-style cooking
              </p>
            </div>
            
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gray-900 rounded-2xl p-8 md:p-12 border border-amber-600/20">
                <div className="flex justify-center mb-6">
                  {[...Array(activeReviews[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-amber-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-lg md:text-xl text-gray-300 text-center mb-8 leading-relaxed">
                  "{activeReviews[currentTestimonial].content}"
                </blockquote>
                
                <div className="text-center">
                  <div className="text-white font-semibold text-lg">
                    {activeReviews[currentTestimonial].name}
                  </div>
                  <div className="text-amber-400 text-sm">
                    {activeReviews[currentTestimonial].role}
                  </div>
                </div>
              </div>
              
              {activeReviews.length > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-4">
                  <button
                    onClick={prevTestimonial}
                    className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full border border-amber-600/20 hover:border-amber-600/40 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 text-amber-400" />
                  </button>
                  
                  <div className="flex space-x-2">
                    {activeReviews.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentTestimonial ? 'bg-amber-400' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={nextTestimonial}
                    className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full border border-amber-600/20 hover:border-amber-600/40 transition-all"
                  >
                    <ChevronRight className="w-5 h-5 text-amber-400" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Feedback Section */}
      <section id="feedback" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Share Your Experience
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your feedback helps Ba improve and create even more memorable dining experiences
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800 rounded-2xl p-8 md:p-12 border border-amber-600/20">
              <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-amber-400 font-medium mb-2">Your Name</label>
                    <input
                      type="text"
                      required
                      value={feedbackForm.name}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-400 font-medium mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={feedbackForm.email}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-amber-400 font-medium mb-2">Rating</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFeedbackForm({ ...feedbackForm, rating })}
                        className={`transition-colors ${
                          rating <= feedbackForm.rating ? 'text-amber-400' : 'text-gray-500 hover:text-amber-400'
                        }`}
                      >
                        <Star className="w-8 h-8 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-amber-400 font-medium mb-2">Your Experience</label>
                  <textarea
                    rows={5}
                    required
                    value={feedbackForm.content}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, content: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="Tell us about your experience at Ba's Supper Club..."
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-amber-400 font-medium mb-2">Would you recommend Ba's to others?</label>
                  <div className="flex space-x-6">
                    {['yes', 'maybe', 'no'].map((option) => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input 
                          type="radio" 
                          name="recommend" 
                          value={option}
                          checked={feedbackForm.recommend === option}
                          onChange={(e) => setFeedbackForm({ ...feedbackForm, recommend: e.target.value })}
                          className="sr-only" 
                        />
                        <div className={`w-4 h-4 border-2 rounded-full mr-2 ${
                          feedbackForm.recommend === option ? 'bg-amber-400 border-amber-400' : 'border-gray-600'
                        }`}></div>
                        <span className="text-white capitalize">
                          {option === 'yes' ? 'Yes, absolutely!' : option === 'maybe' ? 'Maybe' : 'Not really'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-105"
                >
                  Submit Feedback
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Memories from Ba's Kitchen
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Glimpses of our past events, the joy of our guests, and the warmth of Ba's hospitality
            </p>
          </div>
          
          <div className="relative">
            {galleryAlbums.length > 4 && (
              <div className="flex justify-between items-center mb-8">
                <button
                  onClick={prevGallerySlide}
                  className="p-3 bg-gray-900 hover:bg-gray-700 rounded-full border border-amber-600/20 hover:border-amber-600/40 transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-amber-400" />
                </button>
                <button
                  onClick={nextGallerySlide}
                  className="p-3 bg-gray-900 hover:bg-gray-700 rounded-full border border-amber-600/20 hover:border-amber-600/40 transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-amber-400" />
                </button>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayedGalleryAlbums.map((album) => (
                <div 
                  key={album.id} 
                  className="bg-gray-900 rounded-xl overflow-hidden border border-amber-600/20 hover:border-amber-600/40 transition-all group cursor-pointer"
                  onClick={() => setSelectedAlbum(album)}
                >
                  <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <ChefHat className="w-16 h-16 text-white opacity-60" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-semibold text-white mb-2">
                      {album.name}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                      {album.description}
                    </p>
                    <div className="text-amber-400 text-xs font-medium">
                      {new Date(album.date).toLocaleDateString()} • {album.photos.length} Photos
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-12">
            <div className="bg-gray-900 rounded-xl p-6 border border-amber-600/20 inline-block">
              <p className="text-gray-300 text-lg mb-2">Want to create your own memories?</p>
              <p className="text-amber-400 font-medium">Book your intimate dining experience today!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reservations Section */}
      <section id="reservations" className="py-20 bg-gradient-to-r from-amber-600 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Reserve Your Experience
            </h2>
            <p className="text-xl text-amber-100 max-w-3xl mx-auto">
              Secure your table at Ba's intimate dining destination. Advance reservations are required due to limited seating.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 md:p-12 text-center">
              <h3 className="text-3xl font-serif font-bold text-gray-900 mb-8">Make Your Reservation</h3>
              
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 mb-8">
                <h4 className="text-2xl font-semibold text-gray-900 mb-6">For reservation please call:</h4>
                <div className="flex items-center justify-center">
                  <Phone className="w-6 h-6 text-amber-600 mr-3" />
                  <div className="text-left">
                    <div className="text-xl font-bold text-gray-900">{contentData.reservation.phoneNumber}</div>
                    <div className="text-amber-700 font-medium">({contentData.reservation.contactPerson})</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Clock className="w-5 h-5 text-amber-600 mr-2" />
                    Dining Hours
                  </h4>
                  <p className="text-gray-700">Evening service only</p>
                  <p className="text-gray-700">Advance booking required</p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Users className="w-5 h-5 text-amber-600 mr-2" />
                    Seating Information
                  </h4>
                  <p className="text-gray-700">Maximum {latestMenu?.maxPersons || 8} guests per evening</p>
                  <p className="text-gray-700">Children under 12 {latestMenu?.childrenAllowed ? 'permitted' : 'not permitted'}</p>
                </div>
              </div>
              
              {latestMenu && (
                <div className="mt-8 p-6 bg-amber-50 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">{latestMenu.title} - {new Date(latestMenu.date).toLocaleDateString()}</h4>
                  <p className="text-gray-700 mb-2">₹{latestMenu.pricePerPerson} per person for the complete experience:</p>
                  <p className="text-amber-700 font-medium">
                    {latestMenu.categories.mainCourse.map(item => item.name).join(' • ')} • {latestMenu.categories.desserts.map(item => item.name).join(' • ')}
                  </p>
                  <p className="text-gray-600 text-sm mt-2">Served with guacamole, sour cream, and homemade salsas</p>
                  <div className="mt-3 p-3 bg-red-100 rounded-lg border border-red-300">
                    <p className="text-red-800 font-semibold text-sm">📅 Special Event: {new Date(latestMenu.date).toLocaleDateString()}</p>
                    <p className="text-red-700 text-sm">Limited seating - Book early to secure your spot!</p>
                  </div>
                </div>
              )}
              
              <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Utensils className="w-5 h-5 text-blue-600 mr-2" />
                  Payment Methods
                </h4>
                <div className="text-gray-700">
                  <p className="font-medium">We accept:</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Cash</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">GPay</span>
                  </div>
                  <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">GPay Number:</p>
                    <p className="text-lg font-bold text-blue-900">{contentData.reservation.gpayNumber}</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Advance payment is required to secure your reservation. We accept cash or Google Pay to the number above.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-6 bg-red-50 rounded-lg border border-red-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Calendar className="w-5 h-5 text-red-600 mr-2" />
                  Cancellation Policy
                </h4>
                <div className="text-gray-700 space-y-2">
                  <p className="font-medium text-green-700">• Full refund: Cancel 48 hours in advance</p>
                  <p className="font-medium text-red-700">• No refund: Cancellations within 48 hours</p>
                  <p className="text-sm text-gray-600 mt-3">
                    Due to our intimate setting and limited seating, we require advance notice for cancellations to accommodate other guests.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-orange-500 rounded-full flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-serif font-bold text-amber-400">Ba's Supper Club</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                {latestMenu ? `Home-style ${latestMenu.title.toLowerCase()} delicacies` : 'Home-style delicacies'} prepared with love by Ba, bringing authentic flavors to Jamnagar.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-serif font-semibold mb-4 text-amber-400">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{contentData.reservation.phoneNumber} ({contentData.reservation.contactPerson})</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                  <div>
                    <div>B-10, Vision Towers</div>
                    <div>Opp. Satya Sai School</div>
                    <div>Palace Road, Jamnagar - 361 008</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{contentData.feedback.adminEmail}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-serif font-semibold mb-4 text-amber-400">Experience</h4>
              <ul className="space-y-2 text-gray-400">
                <li>• Complete menu ₹{latestMenu?.pricePerPerson || 1200}</li>
                <li>• Maximum {latestMenu?.maxPersons || 8} guests</li>
                <li>• Advance booking required</li>
                <li>• Children under 12 {latestMenu?.childrenAllowed ? 'permitted' : 'not permitted'}</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Ba's Supper Club. All rights reserved. | Reservations Required</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
