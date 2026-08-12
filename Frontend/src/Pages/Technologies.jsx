import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import SEOTags from "../Components/SEOTags.jsx";
import styles from "../Styles/technologies.module.css";

const technologies = [
  { name: "React JS", image: "/reactjs.png" },
  { name: "Angular", image: "/angularjs.png" },
  { name: "Node JS", image: "/nodejs.png" },
  { name: ".NET", image: "/aspdotnetcore.png" },
  { name: "Python", image: "/python.png" },
  { name: "Django", image: "/django.png" },
  { name: "MongoDB", image: "/mongodb.png" },
  { name: "SQL", image: "/sqldb.png" },
];

const Technologies = () => {
  return (
    <>
      <SEOTags
        title="Arohan InfoTech Technologies | React, Node, Django, .NET & More"
        description="Arohan InfoTech works with React, Node.js, Django, .NET, MongoDB, and modern cloud technologies to deliver scalable digital solutions."
        keywords="React, Node.js, Django, .NET, MongoDB, web technologies, software development"
        image="/Arohan Logo.png"
      />
      <Navbar />

      <section className={styles.technologiesContainer}>
        <div className={styles.heading}>
          <h1>Technologies We Work With</h1>
          <p>
            We use modern technologies to build secure, scalable and
            high-performance digital solutions.
          </p>
        </div>

        <div className={styles.techGrid}>
          {technologies.map((tech) => (
            <div className={styles.techCard} key={tech.name}>
              <img src={tech.image} alt={tech.name} />
              <h3>{tech.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Technologies;