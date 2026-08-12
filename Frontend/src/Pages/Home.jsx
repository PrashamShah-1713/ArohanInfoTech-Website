import React from 'react'
import { ArrowRight, BadgeCheck, Cpu, Globe2, Headphones, ShieldCheck, Sparkles } from 'lucide-react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import SEOTags from '../Components/SEOTags.jsx'
import styles from '../Styles/home.module.css'

const services = [
  {
    icon: <Cpu size={20} />,
    title: 'Custom Software Development',
    description: 'Scalable web and mobile solutions built around your business goals.'
  },
  {
    icon: <Globe2 size={20} />,
    title: 'Digital Transformation',
    description: 'Modernize your operations with robust cloud and automation strategies.'
  },
  {
    icon: <ShieldCheck size={20} />,
    title: 'Secure Digital Products',
    description: 'Reliable systems with strong security practices and long-term support.'
  },
  {
    icon: <Headphones size={20} />,
    title: 'Dedicated Support',
    description: 'A trusted partner for maintenance, upgrades, and business growth.'
  }
]

const Home = () => {
  return (
    <div className={styles.page}>
      <SEOTags
        title="Arohan InfoTech | Software Development, Web Design & Digital Transformation"
        description="Arohan InfoTech builds modern websites, custom applications, and digital transformation solutions for startups and growing businesses."
        keywords="software development, web development, digital transformation, UI UX design, custom applications"
        image="/Arohan Logo.png"
      />
      <Navbar />

      <main>
        <section className={styles.heroSection}>
          

          <div className={styles.heroVisual}>
            <div className={styles.heroImageCard}>
              <img src="/Arohan Infotech Home page img.png" alt="Arohan Infotech team working on digital solutions" />
            </div>
          </div>
        </section>

        <section id="services" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Our expertise</span>
            <h2>End-to-end solutions for your digital future</h2>
            <p>From concept to launch, we combine strategy, design, and technology to create products that turn heads and drive results.</p>
          </div>

          <div className={styles.servicesGrid}>
            {services.map((service) => (
              <article key={service.title} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className={styles.aboutSection}>
          <div className={styles.aboutText}>
            <span className={styles.sectionTag}>Why Arohan</span>
            <h2>Professional execution with a people-first approach</h2>
            <p>
              We partner with startups and growing businesses to create intuitive websites, powerful applications,
              and smooth customer journeys that feel effortless from day one.
            </p>

            <ul className={styles.featureList}>
              <li><BadgeCheck size={18} /> Tailored solutions shaped around your business needs</li>
              <li><BadgeCheck size={18} /> Modern UI/UX that reflects your brand and converts visitors</li>
              <li><BadgeCheck size={18} /> Secure, responsive, and performance-focused development</li>
            </ul>
          </div>

         
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home