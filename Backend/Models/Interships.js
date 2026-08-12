const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({

    internshiptitle: {
        type: String,
        required: true,
    },

    internshipdescription: {
        type: String,
        required: true,
    },

    internshipduration: {
        type: String,
        required: true,
    },

    internshipfees: {
        type: Number,
        default: 0,
    },

    internshipimage: {
        type: String,
        required: true,
    },

    interstartdate: {
        type: Date,
        required: true,
    },

    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed'],
        default: 'upcoming',
    },

    page: {
        type: String,
        enum: ['internships', 'home', 'all'],
        default: 'internships',
    },

    isPublished: {
        type: Boolean,
        default: true,
    }

}, { timestamps: true });

const Internship = mongoose.model('Internship', internshipSchema);
module.exports = Internship;