import React from "react";
import "../styling/Footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <h3 className="brand-name">Always Online</h3>
            <p className="brand-tagline">
              Your Trusted Partner for Government Updates
            </p>
            <div className="social-links">
              <a href="#" className="social-icon" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
              </a>
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="footer-section">
            <h4>Get in Touch</h4>
            <ul className="footer-list">
              <li>
                <span className="list-icon">📞</span>
                <a href="tel:+917000417423">+91 7000417423</a>
              </li>
              <li>
                <span className="list-icon">✉️</span>
                <a href="mailto:alwaysonline7000@gmail.com">alwaysonline7000@gmail.com</a>
              </li>
              <li>
                <span className="list-icon">💬</span>
                <a 
                  href="https://wa.me/917000417423?text=Hello%21%20I%20need%20assistance%20with%20government%20updates"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-link"
                >
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>

          {/* Location Section */}
          <div className="footer-section">
            <h4>Our Location</h4>
            <ul className="footer-list">
              <li>
                <span className="list-icon">📍</span>
                <span>Always Online</span>
              </li>
              <li>
                <span className="list-icon"></span>
                <span>Michael Chowk, Dhanpuri</span>
              </li>
              <li>
                <span className="list-icon"></span>
                <span>Dist. Shahdol, Madhya Pradesh</span>
              </li>
              <li>
                <span className="list-icon"></span>
                <span>PIN: 484114</span>
              </li>
              <li className="map-link-item">
                <span className="list-icon">🗺️</span>
                <a 
                  href="https://maps.google.com/?q=23.186395459984887, 81.55628724704354"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-link"
                >
                  View on Google Maps →
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-list">
              <li><a href="/about">About Us</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h4>Stay Updated</h4>
              <p>Subscribe to receive latest government updates and news</p>
            </div>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required
                aria-label="Email for newsletter"
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Always Online. All rights reserved.</p>
          <div className="bottom-links">
            <a href="/privacy">Privacy</a>
            <span className="separator">•</span>
            <a href="/terms">Terms</a>
            <span className="separator">•</span>
            <a href="/cookies">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};