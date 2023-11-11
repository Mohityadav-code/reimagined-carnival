const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    data: {
        required: true,
        type: Object,
    },
}, { timestamps: true }
);
mongoose.pluralize(null);
module.exports = mongoose.model('nifty_data', dataSchema);