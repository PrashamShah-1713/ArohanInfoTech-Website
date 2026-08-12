import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../Styles/navbar.module.css";
import Notification from "../Components/Notification.jsx";
import ConfirmModal from "../Components/ConfirmModal.jsx";
import { AuthContext } from "../contexts/AuthContext.jsx";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ username: '', useremail: '' });
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, type: null, id: null });
  const { user, logout, deleteAccount, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setProfileOpen(false);
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const toggleProfile = () => {
    setMenuOpen(false);
    setProfileOpen((prev) => {
      const nextOpen = !prev;
      if (nextOpen) {
        setEditProfile(false);
        setProfileForm({ username: user?.username || '', useremail: user?.useremail || '' });
      }
      return nextOpen;
    });
  };

  const handleSaveProfile = async () => {
    if (!profileForm.username || !profileForm.useremail) {
      setNotification({ message: 'Both username and email are required.', type: 'error' });
      return;
    }

    const response = await updateProfile({
      username: profileForm.username.trim(),
      useremail: profileForm.useremail.trim().toLowerCase(),
    });

    if (response.success) {
      setNotification({ message: response.message || 'Profile updated successfully.', type: 'success' });
      setEditProfile(false);
    } else {
      setNotification({ message: response.message, type: 'error' });
    }
  };

  const profileRef = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }

    function handleEscape(e) {
      if (e.key === 'Escape') setProfileOpen(false);
    }

    if (profileOpen) {
      document.addEventListener('mousedown', handleOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [profileOpen]);

  return (
    <header className={styles.navbar}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <img src="/Arohan Insta Logo.png" alt="Arohan InfoTech logo" />
        </div>

        <div className={styles.companyName}>
          Arohan <span>InfoTech</span>
        </div>
      </div>

      <nav className={`${styles.navLinks} ${menuOpen ? styles.open : ""}`}>
        <NavLink to="/home" onClick={closeMenu} className={({ isActive }) => isActive ? `${styles.activeLink}` : ''}>Home</NavLink>
        <NavLink to="/company" onClick={closeMenu} className={({ isActive }) => isActive ? `${styles.activeLink}` : ''}>Company</NavLink>
        <NavLink to="/services" onClick={closeMenu} className={({ isActive }) => isActive ? `${styles.activeLink}` : ''}>Services</NavLink>
        <NavLink to="/technologies" onClick={closeMenu} className={({ isActive }) => isActive ? `${styles.activeLink}` : ''}>Technologies</NavLink>
        <NavLink to="/portfolio" onClick={closeMenu} className={({ isActive }) => isActive ? `${styles.activeLink}` : ''}>Portfolio</NavLink>
        <NavLink to="/internships" onClick={closeMenu} className={({ isActive }) => isActive ? `${styles.activeLink}` : ''}>Internships</NavLink>

        {!user && (
          <NavLink to="/login" onClick={closeMenu} className={({ isActive }) => `${styles.loginLink} ${isActive ? styles.activeLink : ''}`.trim()}>
            Login
          </NavLink>
        )}

        {user?.role?.toLowerCase() === 'admin' && (
          <NavLink to="/admin" onClick={closeMenu} className={({ isActive }) => `${styles.adminLink} ${isActive ? styles.activeLink : ''}`.trim()}>
            Admin Panel
          </NavLink>
        )}
      </nav>

      {user ? (
        <div className={styles.profileContainer} ref={profileRef}>
          <button
            type="button"
            className={styles.profileButton}
            onClick={toggleProfile}
            aria-expanded={profileOpen}
            aria-label="Open profile menu"
          >
            <span className={styles.profileIcon}>
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.username || 'avatar'} />
              ) : (
                (user.username && user.username.length > 0) ? user.username.charAt(0).toUpperCase() : 'U'
              )}
            </span>
            <span className={styles.profileButtonText}>
              {user.username || user.useremail || 'Profile'}
            </span>
          </button>

          <div className={`${styles.profileMenu} ${profileOpen ? styles.showMenu : ''}`}>
            <div className={styles.profileMenuHeader}>
              <div>
                <div className={styles.profileMenuTitle}>Hello, {user.username || 'User'}</div>
                <div className={styles.profileMenuSubtitle}>{user.useremail || user.email}</div>
              </div>
            </div>

            <div className={styles.profileMenuSection}>
              <div className={styles.profileMenuLabel}>Account</div>
              <div className={styles.profileMenuField}>
                <span>Name</span>
                <strong>{user.username || 'N/A'}</strong>
              </div>
              <div className={styles.profileMenuField}>
                <span>Email</span>
                <strong>{user.useremail || user.email || 'N/A'}</strong>
              </div>
            </div>

            <div className={styles.profileMenuSection}>
              <div className={styles.profileMenuLabel}>Edit profile</div>
              {editProfile ? (
                <div className={styles.profileForm}>
                  <label className={styles.profileFormField}>
                    <span>Name</span>
                    <input
                      type="text"
                      value={profileForm.username}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, username: e.target.value }))}
                      placeholder="Enter your name"
                    />
                  </label>
                  <label className={styles.profileFormField}>
                    <span>Email</span>
                    <input
                      type="email"
                      value={profileForm.useremail}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, useremail: e.target.value }))}
                      placeholder="Enter your email"
                    />
                  </label>
                  <div className={styles.profileFormActions}>
                    <button
                      type="button"
                      className={styles.profileActionButton}
                      onClick={handleSaveProfile}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className={`${styles.profileActionButton} ${styles.deleteAction}`}
                      onClick={() => setEditProfile(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className={`${styles.profileActionButton} ${styles.editAction}`}
                  onClick={() => setEditProfile(true)}
                >
                  Edit profile
                </button>
              )}
            </div>

            <div className={styles.profileMenuSection}>
              <div className={styles.profileMenuLabel}>Internship details</div>
              {user.internships && user.internships.length > 0 ? (
                <ul className={styles.profileList}>
                  {user.internships.map((item, index) => (
                    <li key={`${item.appliedInternshipId || index}-${item.status}`} className={styles.profileListItem}>
                      <div className={styles.profileListItemTitle}>{item.appliedInternshipTitle || 'Applied internship'}</div>
                      <div className={styles.profileListItemMeta}>
                        <span>{item.appliedInternshipDuration || 'Duration unknown'}</span>
                        <span className={styles.profileBadge}>{item.status || 'active'}</span>
                      </div>
                      {item.appliedInternshipStartDate && (
                        <div className={styles.profileListItemDate}>Start: {new Date(item.appliedInternshipStartDate).toLocaleDateString()}</div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={styles.profileMenuNote}>No internship enrollment found yet.</div>
              )}
            </div>

            <div className={styles.profileActions}>
              <button
                type="button"
                className={styles.profileActionButton}
                onClick={async () => {
                  await logout();
                  setProfileOpen(false);
                  navigate('/home');
                }}
              >
                Logout
              </button>
              <button
                type="button"
                className={`${styles.profileActionButton} ${styles.deleteAction}`}
                onClick={() => {
                  setProfileOpen(false);
                  setConfirmDelete({ open: true, type: 'account', id: null });
                }}
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '', type: 'success' })}
      />

      <ConfirmModal
        open={confirmDelete.open}
        title="Delete account"
        message="Are you sure you want to delete your account? This cannot be undone."
        onCancel={() => setConfirmDelete({ open: false, type: null, id: null })}
        onConfirm={async () => {
          setConfirmDelete({ open: false, type: null, id: null });
          const result = await deleteAccount();
          if (result.success) {
            setNotification({ message: result.message, type: 'success' });
            navigate('/home');
          } else {
            setNotification({ message: result.message, type: 'error' });
          }
        }}
        confirmLabel="Delete"
      />

      <button
        type="button"
        className={`${styles.menu} ${menuOpen ? styles.open : ""}`}
        onClick={toggleMenu}
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
      >
        {menuOpen ? (
          <span className={styles.arrow}>&larr;</span>
        ) : (
          <>
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </>
        )}
      </button>

      <div
        className={`${styles.backdrop} ${menuOpen ? styles.show : ""}`}
        onClick={closeMenu}
      />
    </header>
  );
};

export default Navbar;