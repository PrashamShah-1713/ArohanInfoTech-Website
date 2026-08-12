import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import SEOTags from '../Components/SEOTags.jsx';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/public/projects`, {
          params: { page: 'portfolio' },
          withCredentials: true,
        });

        if (response.data.success) {
          setProjects(response.data.data || []);
        } else {
          setError(response.data.message || 'Unable to load portfolio');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load portfolio');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8fbff 0%, #eef4ff 42%, #f8fafc 100%)', color: '#0f172a' }}>
      <SEOTags
        title="Arohan InfoTech Portfolio | Case Studies & Project Examples"
        description="See Arohan InfoTech's portfolio of websites, apps, and digital transformation projects built for startups and growing companies."
        keywords="portfolio, case studies, software projects, web design portfolio, digital solutions"
        image="/Arohan Logo.png"
      />
      <Navbar />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem 5rem' }}>
        <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', color: '#2563eb', fontWeight: 700 }}>
          Portfolio
        </p>
        <h1 style={{ fontSize: '2.2rem', margin: '0.5rem 0 1rem' }}>Selected work and case studies</h1>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#334155', maxWidth: '760px' }}>
          Our portfolio highlights products shaped through collaboration, polished interfaces, and practical engineering.
        </p>

        {loading ? (
          <div style={{ marginTop: '2rem', color: '#475569', fontWeight: 600 }}>Loading portfolio...</div>
        ) : error ? (
          <div style={{ marginTop: '2rem', color: '#b91c1c', fontWeight: 600 }}>{error}</div>
        ) : projects.length === 0 ? (
          <div style={{ marginTop: '2rem', padding: '2rem', borderRadius: '16px', background: '#fff', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.06)' }}>
            No portfolio items available yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem', alignItems: 'stretch' }}>
            {projects.map((project) => (
              <article
                key={project._id}
                style={{
                  background: '#fff',
                  borderRadius: '22px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 28px rgba(15, 23, 42, 0.06)',
                  border: '1px solid #e2e8f0',
                  width: '100%',
                  maxWidth: '360px',
                  minHeight: '430px',
                  display: 'flex',
                  flexDirection: 'column',
                  margin: projects.length === 1 ? '0 auto' : '0',
                }}
              >
                {project.projectimage && (
                  <img
                    src={project.projectimage}
                    alt={project.projectname}
                    style={{ width: '100%', height: '210px', objectFit: 'cover', display: 'block' }}
                  />
                )}

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.65rem', fontSize: '1.35rem', color: '#0f172a' }}>{project.projectname}</h3>
                  <p style={{ margin: '0 0 1rem', color: '#475569', lineHeight: 1.7, flex: 1 }}>{project.projectdescription}</p>

                  {project.projectlink && (
                    <a
                      href={project.projectlink}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                        color: '#fff',
                        borderRadius: '12px',
                        padding: '0.8rem 1rem',
                        textDecoration: 'none',
                        fontWeight: 700,
                      }}
                    >
                      View Project
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Portfolio;
