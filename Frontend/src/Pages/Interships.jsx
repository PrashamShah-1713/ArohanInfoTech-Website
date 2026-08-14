import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import SEOTags from '../Components/SEOTags.jsx';
import Notification from '../Components/Notification.jsx';
import { AuthContext } from '../contexts/AuthContext.jsx';

const Internships = () => {
  const context = useContext(AuthContext);
  const { user, authToken: contextToken } = context || {};
  const authToken = contextToken || (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: 'info' });
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [applicationForm, setApplicationForm] = useState({
    internname: user?.username || user?.useremail || 'Applicant',
    internemail: user?.useremail || user?.email || '',
    interncourse: '',
    interncollege: '',
    collegeEnrollmentNumber: '',
  });
  const [applicationError, setApplicationError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/public/internships`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setInternships(response.data.data || []);
        } else {
          setError(response.data.message || 'Unable to load internships');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load internships');
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  const openApplicationForm = (internship) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setSelectedInternship(internship);
    setApplicationForm({
      internname: user.username || user.useremail || 'Applicant',
      internemail: user.useremail || user.email || '',
      interncourse: '',
      interncollege: '',
      collegeEnrollmentNumber: '',
    });
    setApplicationError('');
  };

  const closeApplicationForm = () => {
    setSelectedInternship(null);
    setApplicationError('');
  };

  const handleApplySubmit = async () => {
    if (!selectedInternship) return;

    if (!applicationForm.interncourse || !applicationForm.interncollege || !applicationForm.collegeEnrollmentNumber) {
      setApplicationError('Please provide course, college name, and enrollment number.');
      return;
    }

    try {
      const payload = {
        internname: applicationForm.internname,
        internemail: applicationForm.internemail,
        interncourse: applicationForm.interncourse,
        interncollege: applicationForm.interncollege,
        collegeEnrollmentNumber: applicationForm.collegeEnrollmentNumber,
        userId: user._id,
        appliedInternshipId: selectedInternship._id,
        appliedInternshipTitle: selectedInternship.internshiptitle,
        appliedInternshipDuration: selectedInternship.internshipduration,
        appliedInternshipStartDate: selectedInternship.interstartdate,
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/public/internships/enroll`, payload, {
        withCredentials: true,
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });

      if (response.data.success) {
        setNotification({ message: response.data.message || 'Enrollment successful', type: 'success' });
        closeApplicationForm();
      } else {
        setNotification({ message: response.data.message || 'Unable to apply', type: 'error' });
      }
    } catch (err) {
      setNotification({ message: err.response?.data?.message || 'Unable to apply right now', type: 'error' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}>
      <SEOTags
        title="Arohan InfoTech Internships | Learn by Building Real Products"
        description="Arohan InfoTech internships provide hands-on software development experience for learners who want to build real products and grow technical skills."
        keywords="internships, software internship, web development internship, coding internship, practical training"
        image="/Arohan Logo.png"
      />
      <Navbar />

      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '', type: 'info' })}
      />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem 5rem' }}>
        <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', color: '#2563eb', fontWeight: 700 }}>
          Internships
        </p>
        <h1 style={{ fontSize: '2.2rem', margin: '0.5rem 0 1rem' }}>Learn by building real products</h1>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#334155', maxWidth: '760px' }}>
          We welcome learners who are curious, energetic, and excited to grow through hands-on experience in modern web and software development.
        </p>

        {loading ? (
          <div style={{ marginTop: '2rem', color: '#475569', fontWeight: 600 }}>Loading internships...</div>
        ) : error ? (
          <div style={{ marginTop: '2rem', color: '#b91c1c', fontWeight: 600 }}>{error}</div>
        ) : internships.length === 0 ? (
          <div style={{ marginTop: '2rem', padding: '2rem', borderRadius: '16px', background: '#fff', boxShadow: '0 10px 25px rgba(15,23,42,0.06)' }}>
            No internship openings available right now.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem', alignItems: 'stretch' }}>
            {internships.map((item) => (
              <article
                key={item._id}
                style={{
                  background: '#fff',
                  borderRadius: '22px',
                  padding: '1.2rem',
                  boxShadow: '0 12px 28px rgba(15, 23, 42, 0.06)',
                  border: '1px solid #e2e8f0',
                  width: '100%',
                  maxWidth: item ? '360px' : '100%',
                  minHeight: '430px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  margin: internships.length === 1 ? '0 auto' : '0',
                }}
              >
                {item.internshipimage && (
                  <img
                    src={item.internshipimage}
                    alt={item.internshiptitle}
                    style={{ width: '100%', height: '190px', objectFit: 'cover', borderRadius: '14px', marginBottom: '1rem' }}
                  />
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginBottom: '0.8rem' }}>
                  <span
                    style={{
                      background: item.status === 'ongoing' ? '#dcfce7' : item.status === 'completed' ? '#e2e8f0' : '#e0f2fe',
                      color: item.status === 'ongoing' ? '#166534' : item.status === 'completed' ? '#334155' : '#075985',
                      borderRadius: '999px',
                      padding: '0.45rem 0.75rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'capitalize',
                    }}
                  >
                    {item.status || 'upcoming'}
                  </span>
                  <span style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>
                    {item.internshipduration}
                  </span>
                </div>

                <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.35rem', color: '#0f172a' }}>{item.internshiptitle}</h3>
                <p style={{ margin: '0 0 0.9rem', color: '#475569', lineHeight: 1.7, flex: 1 }}>{item.internshipdescription}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', fontSize: '0.82rem', color: '#64748b', marginBottom: '0.9rem' }}>
                  <span>Starts: {item.interstartdate ? new Date(item.interstartdate).toLocaleDateString() : 'Soon'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.75rem', fontWeight: 700 }}>
                  <span style={{ color: '#0f172a' }}>Fees</span>
                  <span style={{ color: '#2563eb' }}>₹{Number(item.internshipfees || 0).toLocaleString('en-IN')}</span>
                </div>

                <button
                  type="button"
                  onClick={() => openApplicationForm(item)}
                  style={{
                    width: '100%',
                    border: 'none',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    color: '#fff',
                    fontWeight: 700,
                    padding: '0.9rem 1rem',
                    cursor: 'pointer',
                  }}
                >
                  Apply Now
                </button>
              </article>
            ))}
          </div>
        )}
      </main>

      {selectedInternship && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '540px',
              background: '#fff',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 24px 60px rgba(15, 23, 42, 0.18)',
              position: 'relative',
            }}
          >
            <button
              type="button"
              onClick={closeApplicationForm}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '1.25rem',
                color: '#475569',
              }}
            >
              ×
            </button>
            <h2 style={{ margin: 0, fontSize: '1.85rem', color: '#0f172a' }}>Apply for {selectedInternship.internshiptitle}</h2>
            <p style={{ margin: '0.75rem 0 1.75rem', color: '#64748b', lineHeight: 1.75 }}>
              Enter your college and enrollment details so the admin can review your application properly.
            </p>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#334155', fontWeight: 600 }}>Course</label>
                <input
                  type="text"
                  value={applicationForm.interncourse}
                  onChange={(e) => setApplicationForm({ ...applicationForm, interncourse: e.target.value })}
                  placeholder="Course enrolled"
                  style={{ width: '100%', borderRadius: '16px', border: '1px solid #dbeafe', padding: '0.95rem 1rem', background: '#f8fbff', color: '#0f172a' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#334155', fontWeight: 600 }}>College Name</label>
                <input
                  type="text"
                  value={applicationForm.interncollege}
                  onChange={(e) => setApplicationForm({ ...applicationForm, interncollege: e.target.value })}
                  placeholder="College name"
                  style={{ width: '100%', borderRadius: '16px', border: '1px solid #dbeafe', padding: '0.95rem 1rem', background: '#f8fbff', color: '#0f172a' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#334155', fontWeight: 600 }}>College Enrollment Number</label>
                <input
                  type="text"
                  value={applicationForm.collegeEnrollmentNumber}
                  onChange={(e) => setApplicationForm({ ...applicationForm, collegeEnrollmentNumber: e.target.value })}
                  placeholder="Enrollment number"
                  style={{ width: '100%', borderRadius: '16px', border: '1px solid #dbeafe', padding: '0.95rem 1rem', background: '#f8fbff', color: '#0f172a' }}
                />
              </div>
              {applicationError && <div style={{ color: '#b91c1c', fontWeight: 600 }}>{applicationError}</div>}
              <button
                type="button"
                onClick={handleApplySubmit}
                style={{
                  width: '100%',
                  border: 'none',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#fff',
                  fontWeight: 700,
                  padding: '1rem',
                  cursor: 'pointer',
                }}
              >
                Submit Enrollment
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Internships;
