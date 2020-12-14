

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    frequency: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }

})

const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;