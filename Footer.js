import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import "./Footer.css"; // Assure-toi d'importer le style

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section contact">
          <p><FaMapMarkerAlt /> Route de Gabès, Kébili, Tunisie</p>
          <p><FaPhone /> +216 75 634 500</p>
          <p><FaEnvelope /> iset.kebili@iset.tn</p>
        </div>

        <div className="footer-section social">
          <div className="social-icons">
            <a href=""><FaFacebook /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedin /></a>
          </div>
        </div>
      
      
      <div>
    <h3>Notre emplacement</h3>
    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.2413756373453!2d8.98399407521179!3d33.733073434516896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12566e7437c3f29b%3A0xadf10fd53ac84753!2sHigher%20Institute%20of%20Technological%20Studies%20of%20Kebili!5e1!3m2!1sfr!2stn!4v1746630685107!5m2!1sfr!2stn" width="200" height="200" style={{ border: 0, borderRadius: '10px' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localisation"></iframe>
  </div>
  </div>
  <div className="footer-bottom">
        © 2025 ISET Kebili. Tous droits réservés.
      </div>
      
    </footer>
  );
};

export default Footer;
