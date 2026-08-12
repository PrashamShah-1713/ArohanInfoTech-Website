import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import SEOTags from "../Components/SEOTags.jsx";
import styles from "../Styles/service.module.css";

const services = [
  {
    title: "Web Development",
    image: "/servicewebdevelopment.png",
    description:
      "Modern, responsive and high-performance websites tailored to your business.",
    details:
      "We build fast, secure web applications with responsive layouts, SEO-friendly structure, integrated analytics, and reliable deployment workflows.",
  },
  {
    title: "Website Maintenance",
    image: "/websitemaintance.png",
    description:
      "Regular updates, security monitoring and performance optimization.",
    details:
      "Our maintenance plans include updates, backups, uptime monitoring, performance tuning, and proactive issue resolution to keep your site running smoothly.",
  },
  {
    title: "Custom Software Development",
    image: "/customwebdevelopment.png",
    description:
      "Scalable software solutions designed to automate and grow your business.",
    details:
      "From process automation to custom integrations, we deliver software that solves business challenges, improves workflows, and scales with your needs.",
  },
  {
    title: "UI / UX Design",
    image: "/services-uiux.png",
    description:
      "Creative, user-friendly and conversion-focused interface designs.",
    details:
      "We design intuitive user experiences with polished visual systems, accessibility best practices, rapid prototyping, and customer-focused workflows.",
  },
];

const ServicesProvided = () => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpanded = (title) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <>
      <SEOTags
        title="Arohan InfoTech Services | Web Development, UX Design & Maintenance"
        description="Explore Arohan InfoTech's web development, UI/UX design, custom software, and website maintenance services for growing businesses."
        keywords="web development services, UI/UX design, website maintenance, custom software solutions"
        image="/Arohan Logo.png"
      />
      <Navbar />

      <section className={styles.servicesSection}>
        <div className={styles.heading}>
          <p>OUR SERVICES</p>

          <h1>Dedicated Website Management & Design Services</h1>

          <span>
            We help businesses establish a powerful online presence through
            modern web technologies, custom software solutions and continuous
            support.
          </span>
        </div>

        <div className={styles.serviceGrid}>
          {services.map((service) => {
            const isExpanded = !!expandedItems[service.title];

            return (
              <div className={styles.card} key={service.title}>
                <div className={styles.cardContent}>
                  <img src={service.image} alt={service.title} />

                  <h3>{service.title}</h3>

                  <p>{service.description}</p>

                  {isExpanded && <p className={styles.details}>{service.details}</p>}
                </div>

                <button onClick={() => toggleExpanded(service.title)}>
                  {isExpanded ? "Show Less" : "Learn More →"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ServicesProvided;