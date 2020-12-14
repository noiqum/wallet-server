const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const errorHandler = (error) => {
    let result = {};
    if (error.code === 11000) {
        return result = { email: 'this email is already in use' }
    }
    const fields = Object.keys(error.errors);
    fields.forEach((er) => {
        result[er] = error.errors[er].properties.message

    })
    return result;
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.word, { expiresIn: 24 * 60 * 60 })
}

module.exports = {
    save: function (req, res) {
        User.create(req.body)
            .then(
                newUser => {
                    const token = createToken(newUser._id)
                    res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
                    res.status(201).json({ id: newUser._id, email: newUser.email, userName: newUser.userName, token })
                }
            )
            .catch(
                err => {
                    const errorObj = errorHandler(err);
                    res.status(400).json({ errorObj });
                }
            );
    },
    get: function (req, res) {
        User.findById(req.params.id)
            .then(user => res.json(user))
            .catch(err => res.status(422).json(err));
    },
    login: async function (req, res) {
        const { email, password } = req.body;
        try {
            const user = await User.login(email, password);
            const token = createToken(user._id)
            res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
            if (user.bills) {
                res.status(200).json({ id: user._id, email: user.email, userName: user.userName, token, bills: [...user.bills] })
            } else {
                res.status(200).json({ id: user._id, email: user.email, userName: user.userName, token })
            }

        } catch (err) {

            if (err.message.includes('password')) {
                res.status(400).json({ password: err.message })
            } else {
                res.status(400).json({ email: err.message })
            }

        }
    },
    logout: (req, res) => {
        res.cookie('jwt', '', { maxAge: 1 })
        res.status(200).json('logout')
        console.log('logout')
    },
    check: (req, res) => {

        const token = req.body.token;
        if (token) {
            jwt.verify(token, process.env.word, (err, data) => {
                if (err) {
                    console.log(err)
                    res.send(err)
                } else {

                    res.send(data)
                }
            })
        }

    },
    addBill: async (req, res) => {
        try {
            User.updateOne({ _id: req.body.id }, { ...req.body.user }, (err, docs) => {
                if (err) {
                    res.status(404)
                    res.json(err)
                }
                res.send(docs)
            })
        } catch (error) {
            console.log(error)
        }
    }

}