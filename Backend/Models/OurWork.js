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

    projectnameColor: {
        type: String,
        default: '#0f172a',
    },

    projectnameFontFamily: {
        type: String,
        default: 'Arial',
    },

    projectnameFontSize: {
        type: Number,
        default: 1.2,
        min: 0.8,
        max: 3,
    },

    projectnameBold: {
        type: Boolean,
        default: false,
    },

    projectnameItalic: {
        type: Boolean,
        default: false,
    },

    projectnameUnderline: {
        type: Boolean,
        default: false,
    },

    projectdescription: {
        type: String,
        default: '',
    },

    projectlink: {
        type: String,
        default: '',
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