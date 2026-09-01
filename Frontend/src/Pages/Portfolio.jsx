import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import SEOTags from '../Components/SEOTags.jsx';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [clientLogos, setClientLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        setError('');

        const [projectsRes, clientLogosRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/public/projects`, {
            params: { page: 'portfolio' },
            withCredentials: true,
          }),
          axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/public/brand-assets`, {
            params: { page: 'portfolio', type: 'client-logo' },
            withCredentials: true,
          }),
        ]);

        if (projectsRes.data.success) {
          setProjects(projectsRes.data.data || []);
        } else {
          setError(projectsRes.data.message || 'Unable to load portfolio');
        }

        if (clientLogosRes.data.success) {
          setClientLogos(clientLogosRes.data.data || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load portfolio');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  const renderClientBrandSection = () => {
    const logosToShow = clientLogos.length > 0 ? clientLogos : [
      { _id: 'google', name: 'Google Fonts', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', altText: 'Google Fonts' },
      { _id: 'amazon', name: 'amazon', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', altText: 'Amazon' },
      { _id: 'microsoft', name: 'Microsoft', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', altText: 'Microsoft' },
      { _id: 'helpscout', name: 'HelpScout', imageUrl: 'https://help.com/wp-content/themes/HelpScout/images/logo.svg', altText: 'HelpScout' },
      { _id: 'optimizely', name: 'Optimizely', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Optimizely_logo.svg', altText: 'Optimizely' },
      { _id: 'breezy', name: 'breezy', imageUrl: 'https://www.breezy.hr/images/breezy-logo.svg', altText: 'Breezy' },
      { _id: 'attio', name: 'Attio', imageUrl: 'https://www.attio.com/_next/static/media/logo.4e57f0dc.svg', altText: 'Attio' },
      { _id: 'paypal', name: 'PayPal', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/39/PayPal_logo.svg', altText: 'PayPal' },
      { _id: 'particle', name: 'particle', imageUrl: 'https://www.particle.io/static/particle-logo.svg', altText: 'Particle' },
      { _id: 'hubspot', name: 'HubSpot', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/65/HubSpot_Logo.svg', altText: 'HubSpot' },
      { _id: 'miro', name: 'miro', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Miro_Logo.svg', altText: 'Miro' },
    ];

    return (
      <section style={{
        maxWidth: '1200px',
        margin: '2.5rem auto 0',
        background: '#f3f4f6',
        border: '1px solid #e5e7eb',
        borderRadius: '18px',
        padding: '2rem 1.5rem',
        boxShadow: '0 12px 32px rgba(15, 23, 42, 0.04)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <h2 style={{
            margin: '0 0 1.5rem',
            fontSize: 'clamp(2rem, 3vw, 3.2rem)',
            fontWeight: 700,
            letterSpacing: '-0.06em',
            color: '#0f172a',
          }}>
            Some of our valuable clients
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '1.1rem',
          marginTop: '1rem',
        }}>
          {logosToShow.map((logo, index) => (
            <div key={logo._id || index} style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '14px',
              minHeight: '110px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              boxShadow: '0 10px 22px rgba(15, 23, 42, 0.03)',
            }}>
              {logo.imageUrl ? (
                <img
                  src={logo.imageUrl}
                  alt={logo.altText || logo.name}
                  style={{
                    maxWidth: '90%',
                    maxHeight: '52px',
                    objectFit: 'contain',
                    filter: 'grayscale(0)',
                    opacity: 0.95,
                  }}
                />
              ) : (
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{logo.name}</span>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

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
        ) : (
          <>
            {renderClientBrandSection()}

            {projects.length === 0 ? (
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
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Portfolio;
