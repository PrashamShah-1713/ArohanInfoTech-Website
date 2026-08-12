const ArohanInfoTechTeam = require('../Models/Team');

async function getAllTeamMembers(req, res) {
  try {
    const team = await ArohanInfoTechTeam.find().sort({ memberjoiningdate: -1 });
    res.json({ success: true, data: team });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to load team members' });
  }
}

async function getTeamMemberById(req, res) {
  try {
    const member = await ArohanInfoTechTeam.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to fetch team member' });
  }
}

async function createTeamMember(req, res) {
  try {
    const { membername, memberemail, memberdesgination, memberjoiningdate, membersalary, page, isPublished } = req.body;

    const member = await ArohanInfoTechTeam.create({
      membername,
      memberemail,
      memberdesgination,
      memberjoiningdate: memberjoiningdate || undefined,
      membersalary,
      page: page || 'company',
      isPublished: isPublished !== undefined ? isPublished : true,
    });
    res.status(201).json({ success: true, data: member, message: 'Team member created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to create team member' });
  }
}

async function updateTeamMember(req, res) {
  try {
    const member = await ArohanInfoTechTeam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    res.json({ success: true, data: member, message: 'Team member updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to update team member' });
  }
}

async function deleteTeamMember(req, res) {
  try {
    const member = await ArohanInfoTechTeam.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    res.json({ success: true, message: 'Team member deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to delete team member' });
  }
}

module.exports = {
  getAllTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
};
