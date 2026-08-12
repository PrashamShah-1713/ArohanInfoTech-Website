const mongoose = require('mongoose');

const ArohanInfoTechTeamSchema = new mongoose.Schema({

    membername: {
        type: String,
    },

    memberemail: {
        type: String,
    },

    memberdesgination: {
        type: String,
    },

    memberjoiningdate: {
        type: Date,
    },

    membersalary: {
        type: Number,
    },

    page: {
        type: String,
        enum: ['company', 'home', 'all'],
        default: 'company',
    },

    isPublished: {
        type: Boolean,
        default: true,
    }

}, { timestamps: true });

const ArohanInfoTechTeam = mongoose.model('ArohanInfoTechTeam', ArohanInfoTechTeamSchema);
module.exports = ArohanInfoTechTeam;