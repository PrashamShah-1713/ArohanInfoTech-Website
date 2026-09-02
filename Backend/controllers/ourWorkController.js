const OurProjects = require('../Models/OurWork');

async function getAllProjects(req, res) {
  try {
    const query = {};
    if (req.query.page) query.page = req.query.page;
    if (req.query.isPublished !== undefined) query.isPublished = req.query.isPublished === 'true';

    const projects = await OurProjects.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to load projects' });
  }
}

async function getProjectById(req, res) {
  try {
    const project = await OurProjects.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to fetch project' });
  }
}

async function createProject(req, res) {
  try {
    const { projectname, projectimage, page, isPublished } = req.body;
    if (!projectname || !projectimage) {
      return res.status(400).json({ success: false, message: 'Project name and image are required' });
    }

    const project = await OurProjects.create({
      projectname,
      projectimage,
      projectdescription: req.body.projectdescription || '',
      projectlink: req.body.projectlink || '',
      page: page || 'portfolio',
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    });
    res.status(201).json({ success: true, data: project, message: 'Product created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to create product' });
  }
}

async function updateProject(req, res) {
  try {
    const project = await OurProjects.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: project, message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to update product' });
  }
}

async function deleteProject(req, res) {
  try {
    const project = await OurProjects.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to delete product' });
  }
}

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
