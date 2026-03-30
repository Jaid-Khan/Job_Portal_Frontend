import React from "react";
import "../styling/Footer.css"

export const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Always Online</h3>
            <p className="tagline">
              Your Trusted Partner for Government Updates
            </p>
          </div>

          <div className="footer-section">
            <h4>Contact Us</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <a href="tel:+917000417423" className="contact-link">
                  +91 7000417423
                </a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <a
                  href="mailto:alwaysonline7000@gmail.com"
                  className="contact-link"
                >
                  alwaysonline7000@gmail.com
                </a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">💬</span>
                <a
                  href="https://wa.me/917000417423?text=Hello%21%20I%20need%20assistance%20with%20government%20updates"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link whatsapp"
                >
                  WhatsApp Chat
                </a>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4>Our Location</h4>
            <div className="address-info">
              <p>Always Online</p>
              <p>Michael Chowk, Dhanpuri</p>
              <p>Dist. Shahdol, Madhya Pradesh</p>
              <p>PIN: 484114</p>
              <a
                href="https://maps.google.com/?q=23.186416891561585,81.55644501043959"
                target="_blank"
                rel="noopener noreferrer"
                className="map-link"
              >
                📍 View on Google Maps
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="quick-links">
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
              <li>
                <a href="/privacy">Privacy Policy</a>
              </li>
              <li>
                <a href="/terms">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Always Online. All rights
            reserved.
          </p>
        </div>
      </footer>
    </>
  );
};
