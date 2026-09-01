const express = require('express');
const router = express.Router();
const Interns = require('../Models/Inters-students');
const authMiddleware = require('../Middlewares/middleware');
const { getAllInternships } = require('../controllers/internshipController');
const { getAllProjects } = require('../controllers/ourWorkController');
const { getAllTeamMembers } = require('../controllers/teamController');
const { getAllBrandAssets } = require('../controllers/brandAssetController');
const { sendInternshipEnrollmentEmail } = require('../utils/emailService');

// Logging middleware
router.use((req, res, next) => {
  console.log(`[PublicRoutes] ${req.method} ${req.path}`);
  next();
});

router.get('/internships', (req, res, next) => {
  console.log('[PublicRoutes] Processing GET /internships request');
  req.query.isPublished = 'true';
  if (!req.query.page) {
    req.query.page = 'internships';
  }
  return getAllInternships(req, res, next);
});

router.get('/projects', (req, res, next) => {
  req.query.isPublished = 'true';
  return getAllProjects(req, res, next);
});

router.get('/team', (req, res, next) => {
  req.query.isPublished = 'true';
  return getAllTeamMembers(req, res, next);
});

router.get('/brand-assets', (req, res, next) => {
  req.query.isActive = 'true';
  return getAllBrandAssets(req, res, next);
});

router.post('/internships/enroll', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required to enroll' });
    }

    const {
      internname,
      internemail,
      interncourse,
      interncollege,
      collegeEnrollmentNumber,
      userId,
      appliedInternshipId,
      appliedInternshipTitle,
      appliedInternshipDuration,
      appliedInternshipStartDate,
    } = req.body;

    if (!internname || !internemail || !interncourse || !interncollege || !collegeEnrollmentNumber) {
      return res.status(400).json({ success: false, message: 'Name, email, course, college and enrollment number are required' });
    }

    const entry = await Interns.create({
      internname,
      internemail,
      interncourse,
      interncollege,
      collegeEnrollmentNumber,
      userId: userId || req.user._id,
      appliedInternshipId: appliedInternshipId || null,
      appliedInternshipTitle: appliedInternshipTitle || '',
      appliedInternshipDuration: appliedInternshipDuration || '',
      appliedInternshipStartDate: appliedInternshipStartDate || null,
      status: 'active',
      page: 'internships',
      isPublished: true,
    });

    // Send enrollment email asynchronously without blocking response
    sendInternshipEnrollmentEmail({
      to: internemail,
      username: internname,
      internshipTitle: appliedInternshipTitle || 'Arohan Internship',
      internshipDuration: appliedInternshipDuration || 'As per schedule',
      startDate: appliedInternshipStartDate || null,
      userDetails: {
        name: internname,
        email: internemail,
        course: interncourse,
        college: interncollege,
        userId: userId || req.user._id,
      },
    })
      .then((emailResult) => {
        if (emailResult.success) {
          console.log('[ENROLL] Confirmation email sent successfully to:', internemail);
        } else if (emailResult.skipped) {
          console.log('[ENROLL] Email notification skipped:', emailResult.message);
        } else {
          console.warn('[ENROLL] Email sending returned failure:', emailResult.message);
        }
      })
      .catch((emailError) => {
        console.error('[ENROLL] Email sending failed:', emailError.message || emailError);
      });

    res.status(201).json({
      success: true,
      message: 'Enrollment successful. A confirmation email will be sent to your email address.',
      data: entry,
    });
  } catch (error) {
    console.error('[ENROLL] Error:', error.message);
    res.status(500).json({ success: false, message: 'Unable to complete enrollment' });
  }
});

module.exports = router;
