const mongoose = require('mongoose');

const internsSchema = new mongoose.Schema({

    internname: {
        type: String,
        required: true,
    },

    internemail: {
        type: String,
        required: true,
    },

    interncourse: {
        type: String,
        required: true,
    },

    interncollege: {
        type: String,
        required: true,
    },

    collegeEnrollmentNumber: {
        type: String,
        required: true,
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },

    appliedInternshipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Internship',
        default: null,
    },

    appliedInternshipTitle: {
        type: String,
        default: '',
    },

    appliedInternshipDuration: {
        type: String,
        default: '',
    },

    appliedInternshipStartDate: {
        type: Date,
        default: null,
    },

    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active',
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

const Interns = mongoose.model('Interns', internsSchema);
module.exports = Interns;