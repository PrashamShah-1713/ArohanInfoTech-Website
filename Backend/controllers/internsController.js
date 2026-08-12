const Interns = require('../Models/Inters-students');

async function getAllInterns(req, res) {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.page) query.page = req.query.page;
    if (req.query.isPublished !== undefined) query.isPublished = req.query.isPublished === 'true';

    const interns = await Interns.find(query).sort({ internname: 1 });
    res.json({ success: true, data: interns });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to load interns' });
  }
}

async function getInternById(req, res) {
  try {
    const intern = await Interns.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ success: false, message: 'Intern not found' });
    }
    res.json({ success: true, data: intern });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to fetch intern' });
  }
}

async function createIntern(req, res) {
  try {
    const { internname, internemail, interncourse, interncollege, collegeEnrollmentNumber, userId, appliedInternshipId, appliedInternshipTitle, appliedInternshipDuration, appliedInternshipStartDate, status, page, isPublished } = req.body;

    const intern = await Interns.create({
      internname,
      internemail,
      interncourse,
      interncollege,
      collegeEnrollmentNumber,
      userId: userId || null,
      appliedInternshipId: appliedInternshipId || null,
      appliedInternshipTitle: appliedInternshipTitle || '',
      appliedInternshipDuration: appliedInternshipDuration || '',
      appliedInternshipStartDate: appliedInternshipStartDate || null,
      status: status || 'active',
      page: page || 'internships',
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    });
    res.status(201).json({ success: true, data: intern, message: 'Intern created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to create intern' });
  }
}

async function updateIntern(req, res) {
  try {
    const intern = await Interns.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!intern) {
      return res.status(404).json({ success: false, message: 'Intern not found' });
    }
    res.json({ success: true, data: intern, message: 'Intern updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to update intern' });
  }
}

async function deleteIntern(req, res) {
  try {
    const intern = await Interns.findByIdAndDelete(req.params.id);
    if (!intern) {
      return res.status(404).json({ success: false, message: 'Intern not found' });
    }
    res.json({ success: true, message: 'Intern deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to delete intern' });
  }
}

module.exports = {
  getAllInterns,
  getInternById,
  createIntern,
  updateIntern,
  deleteIntern,
};
