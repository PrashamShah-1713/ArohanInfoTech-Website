const Internship = require('../Models/Interships');

async function getAllInternships(req, res) {
  try {
    console.log('[internshipController] getAllInternships called', { query: req.query });
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.page) query.page = req.query.page;
    if (req.query.isPublished !== undefined) query.isPublished = req.query.isPublished === 'true';

    console.log('[internshipController] Querying with:', query);
    const internships = await Internship.find(query).sort({ interstartdate: -1 });
    console.log('[internshipController] Found internships:', internships.length);
    res.json({ success: true, data: internships });
  } catch (err) {
    console.error('[internshipController] Error:', err.message);
    res.status(500).json({ success: false, message: 'Unable to load internships' });
  }
}

async function getInternshipById(req, res) {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    res.json({ success: true, data: internship });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to fetch internship' });
  }
}

async function createInternship(req, res) {
  try {
    const { internshiptitle, internshipdescription, internshipduration, internshipfees, internshipimage, interstartdate, status, page, isPublished } = req.body;

    const internship = await Internship.create({
      internshiptitle,
      internshipdescription,
      internshipduration,
      internshipfees: internshipfees !== undefined && internshipfees !== null ? Number(internshipfees) : 0,
      internshipimage,
      interstartdate,
      status: status || 'upcoming',
      page: page || 'internships',
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    });

    res.status(201).json({ success: true, data: internship, message: 'Internship created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to create internship' });
  }
}

async function updateInternship(req, res) {
  try {
    const internship = await Internship.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    res.json({ success: true, data: internship, message: 'Internship updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to update internship' });
  }
}

async function deleteInternship(req, res) {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    res.json({ success: true, message: 'Internship deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to delete internship' });
  }
}

module.exports = {
  getAllInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
};
