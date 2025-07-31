import React, { useState } from 'react';
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
  ChevronRight
  Send,
  MessageSquare,
  Camera,
  Quote
} from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentGalleryImage, setCurrentGalleryImage] = useState(0);
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    rating: 5,
    message: ''
  });

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Regular Guest from Jamnagar",
      content: "Ba's kitchen feels like home away from home. The warmth, the flavors, and Ba's personal touch make every meal special. It's like being invited to a dear friend's family dinner.",
      rating: 5,
      date: "December 2024"
    },
    {
      name: "Rajesh Patel",
      role: "Food Enthusiast",
      content: "I've never experienced such authentic, home-style cooking in a restaurant setting. Ba treats every guest like family, and you can taste the love in every dish.",
      rating: 5,
      date: "November 2024"
    },
    {
      name: "Meera Joshi",
      role: "Local Resident",
      content: "Ba's Kitchen has brought something truly special to Jamnagar. The intimate setting and Ba's personal care make you feel like you're dining at your grandmother's house.",
      rating: 5,
      date: "October 2024"
    },
    {
      name: "Amit Desai",
      role: "Business Owner",
      content: "The Mexican night was absolutely incredible! Ba's attention to detail and the authentic flavors transported us straight to Mexico. Can't wait for the next themed dinner.",
      rating: 5,
      date: "September 2024"
    },
    {
      name: "Kavita Singh",
      role: "Food Blogger",
      content: "Ba's Supper Club is a hidden gem in Jamnagar. The intimate atmosphere, exceptional food, and Ba's warm hospitality create an unforgettable dining experience.",
      rating: 5,
      date: "August 2024"
    }
  ];

  const galleryImages = [
    {
      url: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
      title: "Mexican Night - July 2024",
      description: "Our first Mexican themed dinner featuring authentic enchiladas and churros. 8 guests enjoyed an evening of flavors and conversation."
    },
    {
      url: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg",
      title: "Italian Evening - June 2024",
      description: "A cozy Italian dinner with homemade pasta and tiramisu. Ba's personal touch made every guest feel like family."
    },
    {
      url: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg",
      title: "Indian Fusion Night - May 2024",
      description: "Traditional Indian dishes with a modern twist. The intimate setting allowed for meaningful conversations over exceptional food."
    },
    {
      url: "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg",
      title: "Mediterranean Feast - April 2024",
      description: "Fresh Mediterranean flavors in Ba's warm dining room. Limited to 8 guests for the perfect intimate experience."
    },
    {
      url: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
      title: "Asian Fusion - March 2024",
      description: "An exploration of Asian flavors with Ba's signature home-style preparation. Every dish told a story."
    },
    {
      url: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg",
      title: "French Bistro Night - February 2024",
      description: "Classic French cuisine in an intimate setting. Ba's attention to detail created an authentic bistro experience at home."
    }
  ];
    }
  ];

  const menuHighlights = [
    {
      category: "Main Course",
      icon: <ChefHat className="w-6 h-6" />,
      items: [
        { name: "Enchiladas", description: "Rolled tortillas filled with vegies and cheese, topped with Ba's signature sauce", price: "₹420" },
        { name: "Mexican Rice and Beans", description: "Authentic Mexican rice served with seasoned black beans, fresh guacamole, sour cream, and various homemade salsas", price: "₹350" }
      ]
    },
    {
      category: "Desserts",
      icon: <Heart className="w-6 h-6" />,
      items: [
        { name: "Churros", description: "Golden fried dough sticks rolled in cinnamon sugar, served with chocolate dipping sauce", price: "₹160" }
      ]
    }
  ];

  const menuColumns = (menuHighlights.length > 3 ? 3 : menuHighlights.length);
  const menuGridColClassName = "lg:grid-cols-" + menuColumns;

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const nextGalleryImage = () => {
    setCurrentGalleryImage((prev) => (prev + 1) % galleryImages.length);
  };

  const prevGalleryImage = () => {
    setCurrentGalleryImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the feedback to a server
    alert(`Thank you ${feedbackForm.name}! Your feedback has been submitted. Ba will personally review your message.`);
    setFeedbackForm({ name: '', email: '', rating: 5, message: '' });
  };

  const handleFeedbackChange = (field: string, value: string | number) => {
    setFeedbackForm(prev => ({ ...prev, [field]: value }));
  };
  return (
    <div className="min-h-screen bg-gray-900">
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
              <div className="ml-10 flex items-baseline space-x-6">
                <a href="#home" className="text-amber-400 hover:text-amber-300 px-3 py-2 text-sm font-medium transition-colors">Home</a>
                <a href="#menu" className="text-gray-300 hover:text-amber-300 px-3 py-2 text-sm font-medium transition-colors">Menu</a>
                <a href="#experience" className="text-gray-300 hover:text-amber-300 px-3 py-2 text-sm font-medium transition-colors">Experience</a>
                <a href="#reviews" className="text-gray-300 hover:text-amber-300 px-3 py-2 text-sm font-medium transition-colors">Reviews</a>
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
              <a href="#reviews" className="text-gray-300 hover:text-amber-300 block px-3 py-2 text-base font-medium">Reviews</a>
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
                The primary purpose of my supper club is to create a unique, intimate, and social dining experience, 
                centered around high-quality food and meaningful conversation. It aims to foster a sense of community 
                and connection among guests, encouraging interaction and engagement throughout the evening.
              </p>
            </div>
            
            <div className="flex justify-center items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">Est. 2025</div>
                <div className="text-gray-400 text-sm">Home-style Dining</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">Max 8</div>
                <div className="text-gray-400 text-sm">Guests per Seating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Highlights Section */}
      <section id="menu" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Ba's Mexican Menu - July 27, 2025
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A special Mexican dining experience featuring authentic recipes that Ba has perfected over the years
            </p>
            <div className="mt-8 inline-block bg-gradient-to-r from-red-600 to-orange-500 rounded-xl px-8 py-4 border-2 border-yellow-400">
              <div className="text-yellow-200 text-sm font-medium uppercase tracking-wide">Special Event</div>
              <div className="text-2xl font-bold text-white">Sunday, July 27, 2025</div>
              <div className="text-3xl font-bold text-white">Complete Menu</div>
              <div className="text-4xl font-serif font-bold text-white">₹1,200</div>
              <div className="text-amber-100 text-sm">Per Person | All Items Included</div>
              <div className="mt-4">
                <a 
                  href="whatsapp-pamphlet.html" 
                  download="bas-supper-club-pamphlet.html"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  📱 Download WhatsApp Pamphlet
                </a>
              </div>
            </div>
          </div>

          <div className={'grid grid-cols-1 ' + menuGridColClassName + ' gap-8'}>
            {menuHighlights.map((category, index) => (
              <div key={index} className="bg-gray-900 rounded-xl p-8 border border-amber-600/20 hover:border-amber-600/40 transition-all">
                <div className="flex items-center mb-6">
                  <div className="text-amber-500 mr-3">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-serif font-semibold text-white">{category.category}</h3>
                </div>
                
                <div className="space-y-6">
                  {category.items.map((item, idx) => (
                    <div key={idx} className="border-b border-gray-700 pb-4 last:border-b-0">
                      <h4 className="text-lg font-medium text-amber-400 mb-2">{item.name}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <div className="bg-gray-900 rounded-xl p-6 border border-amber-600/20 inline-block">
              <p className="text-gray-300 text-lg mb-2">July 27th Mexican experience includes:</p>
              <p className="text-amber-400 font-medium">Enchiladas • Mexican Rice & Beans • Churros</p>
              <p className="text-gray-400 text-sm mt-2">Served with guacamole, sour cream, and various homemade salsas</p>
            </div>
          </div>
        </div>
      </section>

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
                    <div className="text-gray-400 text-sm">Maximum 8 guests</div>
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

      {/* Reviews Section */}
      <section id="reviews" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              What Our Guests Say
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Hear from our cherished guests about their unforgettable experiences at Ba's Supper Club
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-2xl p-8 md:p-12 border border-amber-600/20">
              <div className="flex items-center justify-center mb-8">
                <Quote className="w-12 h-12 text-amber-500" />
              </div>
              
              <div className="text-center mb-8">
                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-6 italic">
                  "{testimonials[currentTestimonial].content}"
                </p>
                
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-amber-400 fill-current" />
                  ))}
                </div>
                
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-white mb-1">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-amber-400 font-medium mb-1">
                    {testimonials[currentTestimonial].role}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {testimonials[currentTestimonial].date}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={prevTestimonial}
                  className="p-3 bg-amber-600 hover:bg-amber-700 rounded-full text-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentTestimonial ? 'bg-amber-500' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={nextTestimonial}
                  className="p-3 bg-amber-600 hover:bg-amber-700 rounded-full text-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-amber-600 to-orange-500 rounded-xl p-6 inline-block">
              <h4 className="text-white font-semibold text-lg mb-2">Average Rating</h4>
              <div className="flex items-center justify-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-white fill-current" />
                  ))}
                </div>
                <span className="text-white font-bold text-xl">5.0</span>
                <span className="text-amber-100">({testimonials.length} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Gallery of Memories
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Take a glimpse into our past events and the magical moments created at Ba's Supper Club
            </p>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-gray-800 rounded-2xl overflow-hidden border border-amber-600/20">
              <div className="relative h-96 md:h-[500px]">
                <img
                  src={galleryImages[currentGalleryImage].url}
                  alt={galleryImages[currentGalleryImage].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
                    {galleryImages[currentGalleryImage].title}
                  </h3>
                  <p className="text-gray-200 text-lg leading-relaxed">
                    {galleryImages[currentGalleryImage].description}
                  </p>
                </div>
                
                <button
                  onClick={prevGalleryImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors backdrop-blur-sm"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  onClick={nextGalleryImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors backdrop-blur-sm"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 bg-gray-800">
                <div className="flex justify-center items-center space-x-4 mb-4">
                  <Camera className="w-6 h-6 text-amber-500" />
                  <span className="text-gray-300">
                    {currentGalleryImage + 1} of {galleryImages.length}
                  </span>
                </div>
                
                <div className="flex justify-center space-x-2">
                  {galleryImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentGalleryImage(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentGalleryImage ? 'bg-amber-500' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentGalleryImage(index)}
                className={`relative h-24 rounded-lg overflow-hidden transition-all ${
                  index === currentGalleryImage 
                    ? 'ring-4 ring-amber-500 scale-105' 
                    : 'hover:scale-105 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section id="feedback" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Share Your Experience
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your feedback helps Ba create even more memorable dining experiences. Share your thoughts with us!
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-900 rounded-2xl p-8 md:p-12 border border-amber-600/20">
              <div className="flex items-center justify-center mb-8">
                <MessageSquare className="w-12 h-12 text-amber-500" />
              </div>
              
              <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={feedbackForm.name}
                      onChange={(e) => handleFeedbackChange('name', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={feedbackForm.email}
                      onChange={(e) => handleFeedbackChange('email', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Overall Rating *
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => handleFeedbackChange('rating', rating)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            rating <= feedbackForm.rating
                              ? 'text-amber-400 fill-current'
                              : 'text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-4 text-gray-300">
                      {feedbackForm.rating} star{feedbackForm.rating !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Feedback *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={feedbackForm.message}
                    onChange={(e) => handleFeedbackChange('message', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    placeholder="Tell us about your experience at Ba's Supper Club. What did you love? What could we improve?"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Submit Feedback</span>
                </button>
              </form>
              
              <div className="mt-8 p-6 bg-amber-50 rounded-lg border border-amber-200">
                <h4 className="text-lg font-semibold text-amber-800 mb-2">
                  📞 Prefer to call?
                </h4>
                <p className="text-amber-700 mb-2">
                  Ba personally reads every feedback and loves hearing from guests directly.
                </p>
                <div className="flex items-center text-amber-800 font-medium">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+91-99741 20608</span>
                </div>
              </div>
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
                    <div className="text-xl font-bold text-gray-900">+91-99741 20608</div>
                    <div className="text-amber-700 font-medium">(Bina Parekh)</div>
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
                  <p className="text-gray-700">Maximum 8 guests per evening</p>
                  <p className="text-gray-700">Children under 12 not permitted</p>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-amber-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Mexican Menu - July 27, 2025</h4>
                <p className="text-gray-700 mb-2">₹1,200 per person for the complete Mexican experience:</p>
                <p className="text-amber-700 font-medium">Enchiladas • Mexican Rice & Beans • Sopapillas • Churros</p>
                <p className="text-gray-600 text-sm mt-2">Served with guacamole, sour cream, and homemade salsas</p>
                <div className="mt-3 p-3 bg-red-100 rounded-lg border border-red-300">
                  <p className="text-red-800 font-semibold text-sm">📅 Special Event: Sunday, July 27, 2025</p>
                  <p className="text-red-700 text-sm">Limited seating - Book early to secure your spot!</p>
                </div>
              </div>
              
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
                    <p className="text-lg font-bold text-blue-900">+91-99741 20608</p>
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
                Home-style Mexican delicacies prepared with love by Ba, bringing authentic flavors to Jamnagar.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-serif font-semibold mb-4 text-amber-400">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+91-99741 20608 (Bina)</span>
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
                  <span>beenapparekh@gmail.com</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-serif font-semibold mb-4 text-amber-400">Experience</h4>
              <ul className="space-y-2 text-gray-400">
                <li>• Complete menu ₹1,200</li>
                <li>• Maximum 8 guests</li>
                <li>• Advance booking required</li>
                <li>• Children under 12 not permitted</li>
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