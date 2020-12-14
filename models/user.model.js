const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: {
        type: String,
        required: [true, 'Please enter username'],
        trim: true,
        minlength: [3, 'Username length min 3 characters'],

    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        lowercase: true,
        unique: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        minlength: [6, "please min 6 characters"],
        required: [true, 'Please enter a password'],
        type: String
    },
    bills: {
        type: [String],
        required: false
    }

})


UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next()
})
UserSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user
        }
        throw Error('incorrect password')
    }
    throw Error('No user registered with this email')
}

const User = mongoose.model('User', UserSchema);

module.exports = User;