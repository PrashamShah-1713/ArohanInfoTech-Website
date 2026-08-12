import React from 'react'
import showusername from '../Components/showusername.jsx'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import SEOTags from '../Components/SEOTags.jsx'

const Companydetails = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}>
      <SEOTags
        title="About Arohan InfoTech | Software Development Company"
        description="Arohan InfoTech delivers reliable software products and digital transformation services with a team-first approach for growth-focused businesses."
        keywords="software development company, digital transformation, business applications, website development"
        image="/Arohan Logo.png"
      />
      <Navbar />
        
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '4rem 1.5rem 5rem' }}>
        <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', color: '#2563eb', fontWeight: 700 }}>
          About us
        </p>
        <h1 style={{ fontSize: '2.2rem', margin: '0.5rem 0 1rem' }}>We build thoughtful digital products</h1>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#334155' }}>
          Arohan InfoTech is a software and digital transformation partner focused on helping businesses build reliable,
          modern experiences that scale with growth. Our team combines strategy, development, and support to turn ideas
          into solutions that create measurable value.
        </p>
      </main>

      <Footer />
    </div>
  )
}

export default Companydetails
