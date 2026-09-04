const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const authMiddleware = require('../Middlewares/middleware');
const { getAllInternships, createInternship, updateInternship, deleteInternship } = require('../controllers/internshipController');
const { getAllProjects, createProject, updateProject, deleteProject } = require('../controllers/ourWorkController');
const { getAllTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } = require('../controllers/teamController');
const { getAllInterns, createIntern, updateIntern, deleteIntern } = require('../controllers/internsController');

const imageStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    const uploadDirectory = path.join(__dirname, '..', 'uploads', 'projects');
    fs.mkdirSync(uploadDirectory, { recursive: true });
    callback(null, uploadDirectory);
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `project-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});

const uploadProjectImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    callback(null, /^image\/(jpeg|png|gif|webp|svg\+xml)$/.test(file.mimetype));
  },
});

router.use(authMiddleware);
router.use((req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const role = String(req.user.role || '').toLowerCase();
  if (role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }

  next();
});

router.get('/overview', async (req, res) => {
  try {
    const Internship = require('../Models/Interships');
    const OurProjects = require('../Models/OurWork');
    const Team = require('../Models/Team');
    const Interns = require('../Models/Inters-students');

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [internships, projects, team, interns] = await Promise.all([
      Internship.countDocuments(),
      OurProjects.countDocuments(),
      Team.countDocuments(),
      Interns.countDocuments(),
    ]);

    const [internshipsThisMonth, projectsThisMonth, teamThisMonth, internsThisMonth] = await Promise.all([
      Internship.countDocuments({ createdAt: { $gte: startOfMonth } }),
      OurProjects.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Team.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Interns.countDocuments({ createdAt: { $gte: startOfMonth } }),
    ]);

    res.json({
      success: true,
      data: {
        internships,
        projects,
        team,
        interns,
        internshipsThisMonth,
        projectsThisMonth,
        teamThisMonth,
        internsThisMonth,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to fetch summary' });
  }
});

router.get('/internships', getAllInternships);
router.post('/internships', createInternship);
router.put('/internships/:id', updateInternship);
router.delete('/internships/:id', deleteInternship);

router.get('/projects', getAllProjects);
router.post('/projects/upload-image', uploadProjectImage.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please choose a valid image (JPEG, PNG, GIF, WEBP, or SVG)' });
  }

  const imagePath = `/uploads/projects/${req.file.filename}`;
  res.status(201).json({ success: true, data: { url: `${req.protocol}://${req.get('host')}${imagePath}` } });
});
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

router.get('/team', getAllTeamMembers);
router.post('/team', createTeamMember);
router.put('/team/:id', updateTeamMember);
router.delete('/team/:id', deleteTeamMember);

router.get('/interns', getAllInterns);
router.post('/interns', createIntern);
router.put('/interns/:id', updateIntern);
router.delete('/interns/:id', deleteIntern);

module.exports = router;
