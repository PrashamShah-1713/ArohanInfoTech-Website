import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../Styles/footer.module.css'

const SocialIcons = {
  whatsapp: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.52 3.48A11.87 11.87 0 0 0 12.01.03 11.97 11.97 0 0 0 .46 12.11a11.78 11.78 0 0 0 1.74 5.91L.03 24l5.28-1.38a11.85 11.85 0 0 0 5.45 1.41h.02a11.96 11.96 0 0 0 8.32-20.55ZM12.01 21.75a9.66 9.66 0 0 1-4.92-1.32l-.35-.21-3.13.82.84-3.07-.23-.36A9.71 9.71 0 1 1 12.01 21.75Zm5.27-6.34c-.29-.15-1.72-.85-1.98-.95-.26-.1-.45-.15-.64.15-.18.29-.7.95-.86 1.14-.18.2-.36.22-.66.07-.29-.15-1.22-.45-2.33-1.38-.86-.77-1.45-1.72-1.62-2-.17-.29-.02-.44.12-.58.13-.13.31-.3.46-.46.15-.16.21-.27.31-.45.1-.18.05-.34-.02-.49-.07-.16-.5-1.2-.72-1.75-.22-.58-.43-.5-.62-.51-.18-.01-.38-.01-.58-.01-.2 0-.46.07-.7.35-.24.29-.92.99-.92 2.42 0 1.43 1.03 2.82 1.18 3 .15.18 2.02 3.09 4.85 4.33.68.29 1.25.46 1.67.59.7.22 1.34.19 1.85.12.56-.08 1.72-.7 1.96-1.38.23-.68.23-1.27.16-1.39-.07-.13-.26-.2-.54-.34Z" />
    </svg>
  ),
  instagram: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.204 0-3.584-.012-4.849-.069-3.259-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.756 0 8.331.012 7.052.07 2.696.272.273 2.69.07 7.052.012 8.331 0 8.756 0 12c0 3.244.012 3.669.07 4.948.202 4.358 2.621 6.78 6.982 6.98C8.331 23.988 8.756 24 12 24c3.244 0 3.668-.012 4.948-.072 4.354-.2 6.782-2.617 6.979-6.98.059-1.28.072-1.704.072-4.948 0-3.243-.013-3.668-.072-4.948-.196-4.363-2.625-6.78-6.979-6.98C15.668.012 15.244 0 12 0z" />
      <path d="M5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8z" />
      <circle cx="18.406" cy="5.594" r="1.44" />
    </svg>
  ),
  linkedin: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
    </svg>
  )
}

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerTop}>
          <div className={styles.brandSection}>
            <div className={styles.logoBlock}>
              <img src="/Arohan Logo.png" alt="Arohan Infotech" className={styles.logo} />
              <div>
                <h3>Arohan Infotech</h3>
                <p>We create powerful digital solutions that help businesses establish a strong online presence and achieve real growth.</p>
              </div>
            </div>
          </div>

          <div className={styles.quickLinks}>
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/company">Company</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/technologies">Technologies</Link></li>
              <li><Link to="/portfolio">Portfolio</Link></li>
              <li><Link to="/internships">Internships</Link></li>
            </ul>
          </div>

          <div className={styles.servicesLinks}>
            <h4>Services</h4>
            <ul>
              <li><a href="#services">Business Website</a></li>
              <li><a href="#services">E-Commerce</a></li>
              <li><a href="#services">Custom Applications</a></li>
              <li><a href="#services">Website Maintenance</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.contactInfo}>
            <p><strong>Email:</strong> <a href="mailto:arohaninfotech1719@gmail.com">arohaninfotech1719@gmail.com</a></p>
            <p><strong>Phone:</strong> <a href="tel:+918460200521">+91 84602 00521</a> | <a href="tel:+918866091010">+91 88660 91010</a></p>
          </div>
          <div className={styles.socialLinks}>
            <a 
              href="https://wa.me/918460200521" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="WhatsApp" 
              title="WhatsApp"
              className={styles.whatsappLink}
            >
              {SocialIcons.whatsapp}
            </a>
            <a 
              href="https://www.instagram.com/arohan_infotech?igsh=MXF3ZWNpaThyZnZhNg==" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram" 
              title="Instagram"
              className={styles.instagramLink}
            >
              {SocialIcons.instagram}
            </a>

          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <span>© 2026 Arohan Infotech. All rights reserved.</span>
      </div>
    </footer>
  )
}

export default Footer