import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import AdminStatCard from '../Components/AdminStatCard.jsx';
import SEOTags from '../Components/SEOTags.jsx';
import Notification from '../Components/Notification.jsx';
import ConfirmModal from '../Components/ConfirmModal.jsx';
import { AuthContext } from '../contexts/AuthContext.jsx';
import styles from '../Styles/admin.module.css';

const API = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api`;

const initialInternship = {
  internshiptitle: '',
  internshipdescription: '',
  internshipduration: '',
  internshipfees: 0,
  internshipimage: '',
  interstartdate: '',
  status: 'upcoming',
  page: 'internships',
  isPublished: true,
};

const initialProject = {
  projectname: '',
  projectimage: '',
  projectnameColor: '#0f172a',
  projectnameFontFamily: 'Arial',
  projectnameFontSize: 1.2,
  projectnameBold: false,
  projectnameItalic: false,
  projectnameUnderline: false,
  page: 'portfolio',
  isPublished: true,
};

const initialTeamMember = {
  membername: '',
  memberemail: '',
  memberdesgination: '',
  memberjoiningdate: '',
  membersalary: '',
  page: 'company',
  isPublished: true,
};

const initialIntern = {
  internname: '',
  internemail: '',
  interncourse: '',
  interncollege: '',
  collegeEnrollmentNumber: '',
  status: 'active',
  page: 'internships',
  isPublished: true,
};

const Admin = () => {
  const { authToken } = useContext(AuthContext);
  const [stats, setStats] = useState({
    internships: 0,
    interns: 0,
    team: 0,
    projects: 0,
    internshipsThisMonth: 0,
    internsThisMonth: 0,
    teamThisMonth: 0,
    projectsThisMonth: 0,
  });
  const [internships, setInternships] = useState([]);
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('internships');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formMode, setFormMode] = useState({ type: null, id: null });
  const [internshipForm, setInternshipForm] = useState(initialInternship);
  const [projectForm, setProjectForm] = useState(initialProject);
  const [teamForm, setTeamForm] = useState(initialTeamMember);
  const [internForm, setInternForm] = useState(initialIntern);
  const [notification, setNotification] = useState({ message: '', type: 'info' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, type: null, id: null });

  useEffect(() => {
    console.log('Admin authToken:', authToken ? 'Present' : 'Missing');
  }, [authToken]);

  const getHeaders = () => ({
    withCredentials: true,
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
  });

  const actionConfig = useMemo(
    () => ({
      internships: { title: 'Internship Management', subtitle: 'Manage all internship opportunities.' },
      students: { title: 'Student Management', subtitle: 'Manage students and interns.' },
      portfolio: { title: 'Portfolio Management', subtitle: 'Manage work and client projects.' },
      team: { title: 'Team Management', subtitle: 'Manage team members and profiles.' },
    }),
    []
  );

  const fetchData = async (nextStatus = statusFilter) => {
    try {
      setLoading(true);
      setError('');

      const query = nextStatus && nextStatus !== 'all' ? `?status=${nextStatus}` : '';
      const headers = getHeaders();

      const [overviewRes, internshipsRes, projectsRes, teamRes, internsRes] = await Promise.all([
        axios.get(`${API}/admin/overview`, headers),
        axios.get(`${API}/admin/internships${query}`, headers),
        axios.get(`${API}/admin/projects`, headers),
        axios.get(`${API}/admin/team`, headers),
        axios.get(`${API}/admin/interns${query}`, headers),
      ]);

      if (overviewRes.data.success) {
        setStats(overviewRes.data.data);
      }

      setInternships(internshipsRes.data.data || []);
      setProjects(projectsRes.data.data || []);
      setTeam(teamRes.data.data || []);
      setInterns(internsRes.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForms = () => {
    setFormMode({ type: null, id: null });
    setInternshipForm(initialInternship);
    setProjectForm(initialProject);
    setTeamForm(initialTeamMember);
    setInternForm(initialIntern);
  };

  const handleCreateOrUpdate = async (type) => {
    try {
      let payload = null;
      let url = '';
      let method = 'post';

      if (type === 'internship') {
        payload = internshipForm;
        url = `${API}/admin/internships`;
        method = formMode.type === 'internship' && formMode.id ? 'put' : 'post';
        if (formMode.type === 'internship' && formMode.id) url = `${url}/${formMode.id}`;
      }

      if (type === 'project') {
        payload = projectForm;
        url = `${API}/admin/projects`;
        method = formMode.type === 'project' && formMode.id ? 'put' : 'post';
        if (formMode.type === 'project' && formMode.id) url = `${url}/${formMode.id}`;
      }

      if (type === 'team') {
        payload = teamForm;
        url = `${API}/admin/team`;
        method = formMode.type === 'team' && formMode.id ? 'put' : 'post';
        if (formMode.type === 'team' && formMode.id) url = `${url}/${formMode.id}`;
      }

      if (type === 'intern') {
        payload = internForm;
        url = `${API}/admin/interns`;
        method = formMode.type === 'intern' && formMode.id ? 'put' : 'post';
        if (formMode.type === 'intern' && formMode.id) url = `${url}/${formMode.id}`;
      }

      const response = await axios({
        method,
        url,
        data: payload,
        ...getHeaders(),
      });

      if (response.data.success) {
        resetForms();
        await fetchData();
        setNotification({ message: response.data.message || 'Saved successfully', type: 'success' });
      }
    } catch (err) {
      setNotification({ message: err.response?.data?.message || 'Operation failed', type: 'error' });
    }
  };

  const handleProjectImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    try {
      setUploadingImage(true);
      const response = await axios.post(`${API}/admin/projects/upload-image`, formData, getHeaders());
      setProjectForm((current) => ({ ...current, projectimage: response.data.data.url }));
      setNotification({ message: 'Project image uploaded', type: 'success' });
    } catch (err) {
      setNotification({ message: err.response?.data?.message || 'Image upload failed', type: 'error' });
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  const handleDelete = async (type, id) => {
    try {
      let url = '';
      if (type === 'internship') url = `${API}/admin/internships/${id}`;
      if (type === 'project') url = `${API}/admin/projects/${id}`;
      if (type === 'team') url = `${API}/admin/team/${id}`;
      if (type === 'intern') url = `${API}/admin/interns/${id}`;

      const response = await axios.delete(url, getHeaders());
      if (response.data.success) {
        await fetchData();
        setNotification({ message: response.data.message || 'Deleted successfully', type: 'success' });
      }
    } catch (err) {
      setNotification({ message: err.response?.data?.message || 'Delete failed', type: 'error' });
    }
  };

  const requestDelete = (type, id) => {
    setConfirmDelete({ open: true, type, id });
  };

  const openEdit = (type, item) => {
    setActiveSection(type === 'internship' ? 'internships' : type === 'project' ? 'portfolio' : type === 'team' ? 'team' : 'students');

    if (type === 'internship') {
      setFormMode({ type: 'internship', id: item._id });
      setInternshipForm({
        internshiptitle: item.internshiptitle,
        internshipdescription: item.internshipdescription,
        internshipduration: item.internshipduration,
        internshipfees: item.internshipfees || 0,
        internshipimage: item.internshipimage,
        interstartdate: item.interstartdate ? new Date(item.interstartdate).toISOString().slice(0, 10) : '',
        status: item.status || 'upcoming',
        page: item.page || 'internships',
        isPublished: item.isPublished !== undefined ? item.isPublished : true,
      });
    }

    if (type === 'project') {
      setFormMode({ type: 'project', id: item._id });
      setProjectForm({
        projectname: item.projectname,
        projectimage: item.projectimage,
        projectnameColor: item.projectnameColor || '#0f172a',
        projectnameFontFamily: item.projectnameFontFamily || 'Arial',
        projectnameFontSize: item.projectnameFontSize || 1.2,
        projectnameBold: item.projectnameBold || false,
        projectnameItalic: item.projectnameItalic || false,
        projectnameUnderline: item.projectnameUnderline || false,
        page: item.page || 'portfolio',
        isPublished: item.isPublished !== undefined ? item.isPublished : true,
      });
    }

    if (type === 'team') {
      setFormMode({ type: 'team', id: item._id });
      setTeamForm({
        membername: item.membername,
        memberemail: item.memberemail,
        memberdesgination: item.memberdesgination,
        memberjoiningdate: item.memberjoiningdate ? new Date(item.memberjoiningdate).toISOString().slice(0, 10) : '',
        membersalary: item.membersalary,
        page: item.page || 'company',
        isPublished: item.isPublished !== undefined ? item.isPublished : true,
      });
    }

    if (type === 'intern') {
      setFormMode({ type: 'intern', id: item._id });
      setInternForm({
        internname: item.internname,
        internemail: item.internemail,
        interncourse: item.interncourse,
        interncollege: item.interncollege,
        collegeEnrollmentNumber: item.collegeEnrollmentNumber || '',
        status: item.status || 'active',
        page: item.page || 'internships',
        isPublished: item.isPublished !== undefined ? item.isPublished : true,
      });
    }
  };

  const renderForm = () => {
    if (activeSection === 'internships') {
      return (
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h3>{formMode.type === 'internship' ? 'Edit Internship' : 'Add Internship'}</h3>
          </div>

          <div className={styles.formGrid}>
            <input value={internshipForm.internshiptitle} onChange={(e) => setInternshipForm({ ...internshipForm, internshiptitle: e.target.value })} placeholder="Internship title" />
            <input value={internshipForm.internshipduration} onChange={(e) => setInternshipForm({ ...internshipForm, internshipduration: e.target.value })} placeholder="Duration" />
            <input value={internshipForm.interstartdate} type="date" onChange={(e) => setInternshipForm({ ...internshipForm, interstartdate: e.target.value })} />
            <input value={internshipForm.internshipimage} onChange={(e) => setInternshipForm({ ...internshipForm, internshipimage: e.target.value })} placeholder="Image URL" />
            <input value={internshipForm.internshipfees || ''} type="number" min="0" onChange={(e) => setInternshipForm({ ...internshipForm, internshipfees: e.target.value })} placeholder="Fees (₹)" />
            <select value={internshipForm.status} onChange={(e) => setInternshipForm({ ...internshipForm, status: e.target.value })}>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
            <select value={internshipForm.page} onChange={(e) => setInternshipForm({ ...internshipForm, page: e.target.value })}>
              <option value="internships">Internships</option>
              <option value="home">Home</option>
              <option value="all">All</option>
            </select>
            <textarea value={internshipForm.internshipdescription} onChange={(e) => setInternshipForm({ ...internshipForm, internshipdescription: e.target.value })} placeholder="Internship description" rows="4" className={styles.fullWidth} />
          </div>

          <div className={styles.formActions}>
            <button className={styles.successButton} onClick={() => handleCreateOrUpdate('internship')}>{formMode.type === 'internship' ? 'Update Internship' : 'Add Internship'}</button>
            {formMode.type && <button className={styles.secondaryButton} onClick={resetForms}>Cancel</button>}
          </div>
        </div>
      );
    }

    if (activeSection === 'portfolio') {
      return (
        <div className={styles.formCard}>
          <div className={styles.formHeader}><h3>{formMode.type === 'project' ? 'Edit Project' : 'Add Project'}</h3></div>
          <div className={styles.formGrid}>
            <input
              value={projectForm.projectname}
              onChange={(e) => setProjectForm({ ...projectForm, projectname: e.target.value })}
              placeholder="Project name / Client brand name"
              className={styles.fullWidth}
            />
            <input
              value={projectForm.projectimage}
              onChange={(e) => setProjectForm({ ...projectForm, projectimage: e.target.value })}
              placeholder="Project image URL"
              className={styles.fullWidth}
            />
            <div className={`${styles.fullWidth} ${styles.uploadRow}`}>
              <input
                value={projectForm.projectimage}
                onChange={(e) => setProjectForm({ ...projectForm, projectimage: e.target.value })}
                placeholder="Project image URL"
              />
              <label className={styles.fileButton}>
                {uploadingImage ? 'Uploading...' : 'Choose local image'}
                <input type="file" accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml" onChange={handleProjectImageUpload} disabled={uploadingImage} />
              </label>
            </div>
            <div className={`${styles.styleControls} ${styles.fullWidth}`}>
              <select value={projectForm.projectnameFontFamily} onChange={(e) => setProjectForm({ ...projectForm, projectnameFontFamily: e.target.value })} aria-label="Project name font">
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Trebuchet MS">Trebuchet MS</option>
                <option value="Courier New">Courier New</option>
              </select>
              <input type="number" min="0.8" max="3" step="0.1" value={projectForm.projectnameFontSize} onChange={(e) => setProjectForm({ ...projectForm, projectnameFontSize: e.target.value })} aria-label="Project name size" />
              <label className={styles.colorControl}>Color <input type="color" value={projectForm.projectnameColor} onChange={(e) => setProjectForm({ ...projectForm, projectnameColor: e.target.value })} /></label>
              <label><input type="checkbox" checked={projectForm.projectnameBold} onChange={(e) => setProjectForm({ ...projectForm, projectnameBold: e.target.checked })} /> Bold</label>
              <label><input type="checkbox" checked={projectForm.projectnameItalic} onChange={(e) => setProjectForm({ ...projectForm, projectnameItalic: e.target.checked })} /> Italic</label>
              <label><input type="checkbox" checked={projectForm.projectnameUnderline} onChange={(e) => setProjectForm({ ...projectForm, projectnameUnderline: e.target.checked })} /> Underline</label>
            </div>
          </div>
          <div className={styles.formActions}>
            <button className={styles.successButton} onClick={() => handleCreateOrUpdate('project')}>{formMode.type === 'project' ? 'Update Project' : 'Add Project'}</button>
            {formMode.type && <button className={styles.secondaryButton} onClick={resetForms}>Cancel</button>}
          </div>
        </div>
      );
    }

    if (activeSection === 'team') {
      return (
        <div className={styles.formCard}>
          <div className={styles.formHeader}><h3>{formMode.type === 'team' ? 'Edit Member' : 'Add Member'}</h3></div>
          <div className={styles.formGrid}>
            <input value={teamForm.membername} onChange={(e) => setTeamForm({ ...teamForm, membername: e.target.value })} placeholder="Member name" />
            <input value={teamForm.memberemail} onChange={(e) => setTeamForm({ ...teamForm, memberemail: e.target.value })} placeholder="Email" />
            <input value={teamForm.memberdesgination} onChange={(e) => setTeamForm({ ...teamForm, memberdesgination: e.target.value })} placeholder="Designation" />
            <input value={teamForm.membersalary} type="number" onChange={(e) => setTeamForm({ ...teamForm, membersalary: e.target.value })} placeholder="Salary" />
            <input value={teamForm.memberjoiningdate} type="date" onChange={(e) => setTeamForm({ ...teamForm, memberjoiningdate: e.target.value })} placeholder="Join date" />
            <select value={teamForm.page} onChange={(e) => setTeamForm({ ...teamForm, page: e.target.value })}>
              <option value="company">Company</option>
              <option value="home">Home</option>
              <option value="all">All</option>
            </select>
          </div>
          <div className={styles.formActions}>
            <button className={styles.successButton} onClick={() => handleCreateOrUpdate('team')}>{formMode.type === 'team' ? 'Update Member' : 'Add Member'}</button>
            {formMode.type && <button className={styles.secondaryButton} onClick={resetForms}>Cancel</button>}
          </div>
        </div>
      );
    }

    return (
      <div className={styles.formCard}>
        <div className={styles.formHeader}><h3>{formMode.type === 'intern' ? 'Edit Intern' : 'Add Intern'}</h3></div>
        <div className={styles.formGrid}>
          <input value={internForm.internname} onChange={(e) => setInternForm({ ...internForm, internname: e.target.value })} placeholder="Student name" />
          <input value={internForm.internemail} onChange={(e) => setInternForm({ ...internForm, internemail: e.target.value })} placeholder="Email" />
          <input value={internForm.interncourse} onChange={(e) => setInternForm({ ...internForm, interncourse: e.target.value })} placeholder="Course" />
          <input value={internForm.interncollege} onChange={(e) => setInternForm({ ...internForm, interncollege: e.target.value })} placeholder="College" />
          <input value={internForm.collegeEnrollmentNumber} onChange={(e) => setInternForm({ ...internForm, collegeEnrollmentNumber: e.target.value })} placeholder="College Enrollment Number" />
          <select value={internForm.status} onChange={(e) => setInternForm({ ...internForm, status: e.target.value })}>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <select value={internForm.page} onChange={(e) => setInternForm({ ...internForm, page: e.target.value })}>
            <option value="internships">Internships</option>
            <option value="home">Home</option>
            <option value="all">All</option>
          </select>
        </div>
        <div className={styles.formActions}>
          <button className={styles.successButton} onClick={() => handleCreateOrUpdate('intern')}>{formMode.type === 'intern' ? 'Update Intern' : 'Add Intern'}</button>
          {formMode.type && <button className={styles.secondaryButton} onClick={resetForms}>Cancel</button>}
        </div>
      </div>
    );
  };

  const renderList = () => {
    if (activeSection === 'internships') {
      return (
        <div className={styles.listTableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Duration</th>
                <th>Start Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {internships.length ? internships.map((item) => (
                <tr key={item._id}>
                  <td>{item.internshiptitle}</td>
                  <td>{item.internshipduration}</td>
                  <td>{item.interstartdate ? new Date(item.interstartdate).toLocaleDateString() : '-'}</td>
                  <td className={styles.actionCell}>
                    <button className={styles.tableEdit} onClick={() => openEdit('internship', item)}>Edit</button>
                    <button className={styles.tableDelete} onClick={() => requestDelete('internship', item._id)}>Delete</button>
                  </td>
                </tr>
              )) : <tr><td colSpan="4" className={styles.emptyState}>No internships found.</td></tr>}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeSection === 'portfolio') {
      return (
        <div className={styles.listTableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Project</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length ? projects.map((item) => (
                <tr key={item._id}>
                  <td>{item.projectname}</td>
                  <td>{item.projectimage ? 'Added' : 'Missing'}</td>
                  <td className={styles.actionCell}>
                    <button className={styles.tableEdit} onClick={() => openEdit('project', item)}>Edit</button>
                    <button className={styles.tableDelete} onClick={() => requestDelete('project', item._id)}>Delete</button>
                  </td>
                </tr>
              )) : <tr><td colSpan="3" className={styles.emptyState}>No projects found.</td></tr>}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeSection === 'team') {
      return (
        <div className={styles.listTableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {team.length ? team.map((item) => (
                <tr key={item._id}>
                  <td>{item.membername}</td>
                  <td>{item.memberdesgination}</td>
                  <td>{item.membersalary}</td>
                  <td className={styles.actionCell}>
                    <button className={styles.tableEdit} onClick={() => openEdit('team', item)}>Edit</button>
                    <button className={styles.tableDelete} onClick={() => requestDelete('team', item._id)}>Delete</button>
                  </td>
                </tr>
              )) : <tr><td colSpan="4" className={styles.emptyState}>No team members found.</td></tr>}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className={styles.listTableWrapper}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Course</th>
              <th>College</th>
              <th>Enrollment No.</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {interns.length ? interns.map((item) => (
              <tr key={item._id}>
                <td>{item.internname}</td>
                <td>{item.interncourse}</td>
                <td>{item.interncollege}</td>
                <td>{item.collegeEnrollmentNumber || '-'}</td>
                <td className={styles.actionCell}>
                  <button className={styles.tableEdit} onClick={() => openEdit('intern', item)}>Edit</button>
                  <button className={styles.tableDelete} onClick={() => requestDelete('intern', item._id)}>Delete</button>
                </td>
              </tr>
            )) : <tr><td colSpan="6" className={styles.emptyState}>No students found.</td></tr>}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <Navbar />

      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '', type: 'info' })}
      />

      <ConfirmModal
        open={confirmDelete.open}
        title="Delete item"
        message="Are you sure you want to delete this item?"
        onCancel={() => setConfirmDelete({ open: false, type: null, id: null })}
        onConfirm={() => {
          setConfirmDelete({ open: false, type: null, id: null });
          handleDelete(confirmDelete.type, confirmDelete.id);
        }}
        confirmLabel="Delete"
      />

      <div className={styles.dashboardShell}>
        <header className={styles.topbar}>
          <div>
            <h1>Namaste, Admin 👋</h1>
            <p>Manage internships, students, website content and settings from one place.</p>
          </div>

          <div className={styles.topbarRight}>
            <button type="button" className={styles.iconButton}>🔔</button>
            <div className={styles.adminBadge}>
              <div className={styles.avatar}>A</div>
              <div>
                <strong>Admin</strong>
                <span>Administrator</span>
              </div>
            </div>
          </div>
        </header>

        <section className={styles.summaryRow}>
          <AdminStatCard label="Total Internships" value={stats.internships} trend={`↑ ${stats.internshipsThisMonth || 0} this month`} tone="blue" icon="💼" />
          <AdminStatCard label="Students" value={stats.interns} trend={`↑ ${stats.internsThisMonth || 0} this month`} tone="green" icon="👥" />
          <AdminStatCard label="Team Members" value={stats.team} trend={`↑ ${stats.teamThisMonth || 0} this month`} tone="purple" icon="👨‍💼" />
          <AdminStatCard label="Projects" value={stats.projects} trend={`↑ ${stats.projectsThisMonth || 0} this month`} tone="orange" icon="📦" />
        </section>

        <section className={styles.mainGrid}>
          <div className={styles.managementPanel}>
            <div className={styles.panelHeaderBlock}>
              <div className={styles.panelTitleIcon}>📘</div>
              <div>
                <h2>{actionConfig[activeSection]?.title}</h2>
                <p>{actionConfig[activeSection]?.subtitle}</p>
              </div>
            </div>

            <div className={styles.quickActions}>
              <button type="button" className={activeSection === 'internships' ? styles.selectedTab : ''} onClick={() => setActiveSection('internships')}>Internships</button>
              <button type="button" className={activeSection === 'students' ? styles.selectedTab : ''} onClick={() => setActiveSection('students')}>Students</button>
              <button type="button" className={activeSection === 'portfolio' ? styles.selectedTab : ''} onClick={() => setActiveSection('portfolio')}>Portfolio</button>
              <button type="button" className={activeSection === 'team' ? styles.selectedTab : ''} onClick={() => setActiveSection('team')}>Team</button>
            </div>

            <div className={styles.filterRow}>
              <span>View:</span>
              <button type="button" className={statusFilter === 'all' ? styles.filterActive : ''} onClick={() => { setStatusFilter('all'); fetchData('all'); }}>All</button>
              <button type="button" className={statusFilter === 'upcoming' ? styles.filterActive : ''} onClick={() => { setStatusFilter('upcoming'); fetchData('upcoming'); }}>Upcoming</button>
              <button type="button" className={statusFilter === 'ongoing' ? styles.filterActive : ''} onClick={() => { setStatusFilter('ongoing'); fetchData('ongoing'); }}>Ongoing</button>
              <button type="button" className={statusFilter === 'completed' ? styles.filterActive : ''} onClick={() => { setStatusFilter('completed'); fetchData('completed'); }}>Completed</button>
            </div>

            {loading ? <div className={styles.emptyState}>Loading admin data...</div> : error ? <div className={styles.emptyState}>{error}</div> : renderForm()}
            {renderList()}
          </div>
        </section>
      </div>
    </>
  );
};

export default Admin;