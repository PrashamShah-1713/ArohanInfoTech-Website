const mongoose = require('mongoose');

const OurProjectsSchema = new mongoose.Schema({

    projectname: {
        type: String,
        required: true,
    },

    projectimage: {
        type: String,
        required: true,
    },

    projectdescription: {
        type: String,
        required: true,
    },

    projectlink: {
        type: String,
        required: true,
    },

    page: {
        type: String,
        enum: ['portfolio', 'home', 'all'],
        default: 'portfolio',
    },

    isPublished: {
        type: Boolean,
        default: true,
    }

}, { timestamps: true });

const OurProjects = mongoose.model('OurProjects', OurProjectsSchema);
module.exports = OurProjects;