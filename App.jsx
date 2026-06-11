import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';
import axios from 'axios';
import { Utensils, Star, Phone, MapPin, Clock, ChefHat, Menu, X, ChevronUp } from 'lucide-react';
import './index.css';

const App = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const heroRef = useRef(null);

  useEffect(() => {
    // Fetch Menu Data
    const fetchMenu = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/menu');
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu. Is backend running?', error);
        // Fallback if backend absolutely fails completely
        setMenuItems([
          { name: 'Butter Chicken', description: 'Tender chicken simmered in a rich, creamy tomato and butter sauce.', price: 550, category: 'Main Course', imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800', tags: ['Non-Veg', 'Popular'], popular: true },
          { name: 'Paneer Tikka Masala', description: 'Cubes of marinated paneer baked in a tandoor and served in a spiced gravy.', price: 450, category: 'Main Course', imageUrl: '/images/paneer_tikka.jpeg', tags: ['Vegetarian', 'Classic'], popular: true },
          { name: 'Mutton Biryani', description: 'Aromatic basmati rice slowly cooked with tender mutton and authentic Awadhi spices.', price: 650, category: 'Main Course', imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=800', tags: ['Non-Veg', 'Premium'], popular: true },
          { name: 'Malai Kofta', description: 'Paneer and potato balls in a creamy, velvety tomato and cashew nut gravy.', price: 420, category: 'Main Course', imageUrl: '/images/malai_kofta.jpeg', tags: ['Vegetarian', 'Premium'], popular: false },
          { name: 'Dal Bati', description: 'Crispy, golden wheat dumplings served with a rich, spiced lentil curry, generously topped with melted ghee for a hearty and traditional Rajasthani delight.', price: 300, category: 'Main Course', imageUrl: '/images/dal_bati.jpeg', tags: ['Vegetarian', 'Classic'], popular: true },
          { name: 'Dal Tadka', description: 'Yellow lentils tempered with cumin, garlic, and red chilies.', price: 320, category: 'Main Course', imageUrl: '/images/dal_tadka.jpeg', tags: ['Vegetarian', 'Classic'], popular: false },
          
          { name: 'Samosa Chaat', description: 'Crushed crispy samosas topped with chole, yogurt, sweet chutney, and spices.', price: 180, category: 'Appetizer', imageUrl: '/images/samosa_chaat.jpeg', tags: ['Vegetarian', 'Street Food'], popular: false },
          { name: 'Veg Hara Bhara Kabab', description: 'Green patties made with spinach, peas, and potatoes, mildly spiced and pan-fried.', price: 280, category: 'Appetizer', imageUrl: '/images/hara_bhara_kabab.jpeg', tags: ['Vegetarian', 'Healthy'], popular: true },
          { name: 'Fish Amritsari', description: 'Deep-fried fish fillets marinated in gram flour and spices.', price: 450, category: 'Appetizer', imageUrl: '/images/fish_amritsari.jpeg', tags: ['Non-Veg', 'Crispy'], popular: false },
          { name: 'Chicken Lollipop', description: 'Chicken drumsticks tossed in a spicy, tangy Indo-Chinese sauce.', price: 380, category: 'Appetizer', imageUrl: '/images/chicken_lollipop.jpeg', tags: ['Non-Veg', 'Spicy'], popular: true },

          { name: 'Garlic Naan', description: 'Soft Indian flatbread topped with minced garlic and cilantro, baked in a tandoor.', price: 80, category: 'Breads', imageUrl: '/images/garlic_naan.jpeg', tags: ['Vegetarian', 'Bread'], popular: true },
          { name: 'Tandoori Roti', description: 'Whole wheat flatbread baked in a traditional clay oven.', price: 40, category: 'Breads', imageUrl: '/images/tandoori_roti.jpeg', tags: ['Vegetarian', 'Bread'], popular: false },
          { name: 'Laccha Paratha', description: 'Multi-layered, flaky whole wheat flatbread baked in tandoor.', price: 70, category: 'Breads', imageUrl: '/images/laccha_paratha.jpeg', tags: ['Vegetarian', 'Bread'], popular: false },

          { name: 'Gulab Jamun', description: 'Soft, milk dumplings deep-fried and soaked in flavored sugar syrup.', price: 150, category: 'Dessert', imageUrl: '/images/gulab_jamun.jpeg', tags: ['Vegetarian', 'Sweet'], popular: true },
          { name: 'Kheer', description: 'Traditional rice pudding made with milk, sugar, and cardamom.', price: 180, category: 'Dessert', imageUrl: '/images/kheer.jpeg', tags: ['Vegetarian', 'Classic'], popular: false },
          { name: 'Rasmalai', description: 'Soft paneer balls soaked in thick, saffron-flavored milk.', price: 200, category: 'Dessert', imageUrl: '/images/rasmalai.jpeg', tags: ['Vegetarian', 'Premium'], popular: true },

          { name: 'Mango Lassi', description: 'A creamy, yogurt-based drink sweetened with ripe mangoes.', price: 120, category: 'Beverage', imageUrl: '/images/mango_lassi.jpeg', tags: ['Vegetarian', 'Cold'], popular: true },
          { name: 'Masala Chai', description: 'Strong tea brewed with aromatic Indian spices and milk.', price: 50, category: 'Beverage', imageUrl: '/images/masala_chai.jpeg', tags: ['Hot', 'Classic'], popular: false },
          { name: 'Fresh Lime Soda', description: 'Refreshing drink made with fresh lime juice, salt, sugar, and soda.', price: 90, category: 'Beverage', imageUrl: '/images/fresh_lime_soda.jpeg', tags: ['Cold', 'Zesty'], popular: false }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenu();

    // jQuery Scroll Animation (Requirement: use jQuery)
    const handleScroll = () => {
      $('.jquery-hidden').each(function() {
        const topOfElement = $(this).offset().top;
        const bottomOfWindow = $(window).scrollTop() + $(window).height();
        
        if (bottomOfWindow > topOfElement + 50) {
          $(this).animate({ opacity: 1 }, 800, function() {
            // Remove transform slowly
            $(this).css({ transform: 'translateY(0)' });
          });
          $(this).removeClass('jquery-hidden');
        }
      });
    };

    $(window).on('scroll', handleScroll);
    // Trigger once on load
    handleScroll();
    
    // Header effect
    $(window).on('scroll', function() {
      if ($(window).scrollTop() > 50) {
        $('header').addClass('scrolled');
      } else {
        $('header').removeClass('scrolled');
      }
    });

    const handleScrollTopToggle = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScrollTopToggle);

    return () => {
      $(window).off('scroll');
      window.removeEventListener('scroll', handleScrollTopToggle);
    };
  }, []);

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  
  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="app-container">
      {/* Dynamic Header */}
      <header className="navbar">
        <div className="logo-container">
          <ChefHat color="#D4AF37" size={32} />
          <h1 className="logo-text">Social Colaba</h1>
        </div>
        
        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X color="#D4AF37" size={28} /> : <Menu color="#D4AF37" size={28} />}
        </button>

        <nav className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <a href="#home" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
          <a href="#menu" onClick={() => setIsMobileMenuOpen(false)}>Menu</a>
          <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</a>
          <a href="#reservations" onClick={() => setIsMobileMenuOpen(false)}>Reservations</a>
          <button className="btn-primary mobile-book-btn" onClick={() => { setIsMobileMenuOpen(false); document.getElementById('reservations').scrollIntoView({behavior: 'smooth'})}}>Book a Table</button>
        </nav>
        <button className="btn-primary desktop-btn" onClick={() => document.getElementById('reservations').scrollIntoView({behavior: 'smooth'})}>Book a Table</button>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero-section" ref={heroRef}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h2 className="hero-title">Experience Culinary<br/><span className="gold-text">Excellence</span></h2>
          <p className="hero-subtitle">A modern local favorite at the heart of Colaba.</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => document.getElementById('menu').scrollIntoView({behavior: 'smooth'})}>
              Explore Menu
            </button>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="menu-section jquery-hidden">
        <div className="section-header">
          <h3 className="section-title">Our <span className="gold-text">Menu</span></h3>
          <p className="section-subtitle">Exquisite flavors crafted with passion</p>
          <div className="category-filters">
            {categories.map((cat, idx) => (
              <button 
                key={idx} 
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loader">Loading Exquisite Menu...</div>
        ) : (
          <div className="menu-grid">
            {filteredItems.map((item, index) => (
              <div key={index} className="menu-card glass-panel jquery-hidden" style={{animationDelay: `${index * 100}ms`}}>
                <div className="menu-card-img" style={{ backgroundImage: `url(${item.imageUrl})` }}>
                  {item.popular && <span className="badge">⭐ Popular</span>}
                </div>
                <div className="menu-card-content">
                  <div className="menu-card-header">
                    <h4>{item.name}</h4>
                    <span className="price">₹{item.price}</span>
                  </div>
                  <p className="description">{item.description}</p>
                  <div className="tags">
                    {item.tags?.map((tag, tIdx) => (
                      <span key={tIdx} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reservations Section */}
      <section id="reservations" className="reservations-section jquery-hidden">
        <div className="section-header">
          <h3 className="section-title">Book a <span className="gold-text">Table</span></h3>
          <p className="section-subtitle">Reserve your spot at Social Colaba</p>
        </div>
        <div className="reservation-form-container glass-panel">
          <form className="reservation-form" onSubmit={(e) => { e.preventDefault(); alert("Your table has been successfully requested! We will call you shortly to confirm."); }}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input type="text" className="form-control" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" className="form-control" placeholder="Phone" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input type="date" className="form-control" required />
              </div>
              <div className="form-group">
                <label>Guests</label>
                <select className="form-control">
                  <option>1-2 People</option>
                  <option>3-4 People</option>
                  <option>5-6 People</option>
                  <option>7+ People</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '1rem'}}>Confirm Reservation</button>
          </form>
        </div>
      </section>

      {/* About/Info Section */}
      <section id="about" className="info-section jquery-hidden">
        <div className="info-grid">
          <div className="info-card glass-panel">
            <Clock color="#D4AF37" size={40} />
            <h4>Opening Hours</h4>
            <p>Mon - Fri: 11:00 AM - 10:00 PM</p>
            <p>Sat - Sun: 10:00 AM - 11:30 PM</p>
          </div>
          <div className="info-card glass-panel">
            <MapPin color="#D4AF37" size={40} />
            <h4>Location</h4>
            <p>24, Glen Rose Building, BK Boman Behram Marg</p>
            <p>Apollo Bandar, Colaba, Mumbai 400001</p>
          </div>
          <div className="info-card glass-panel">
            <Phone color="#D4AF37" size={40} />
            <h4>Contact</h4>
            <p>+91 75063 94239</p>
            <p>colaba@social.in</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <ChefHat color="#D4AF37" size={32} />
            <h2>Social Colaba</h2>
          </div>
          <div className="social-links">
            <span className="social-icon">Instagram</span>
            <span className="social-icon">Facebook</span>
            <span className="social-icon">Twitter</span>
          </div>
          <p className="copyright">&copy; {new Date().getFullYear()} Social Colaba Restaurant. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Scroll To Top Button */}
      {showScrollTop && (
        <button className="scroll-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  );
};

export default App;
