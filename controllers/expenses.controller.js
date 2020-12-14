const Expense = require('../models/expense.model');

module.exports = {
    save: function (req, res) {
        Expense.create(req.body)
            .then(expense => res.json(expense))
            .catch(err => res.status(422).json(err));

    },
    delete: async function (req, res) {

        try {
            Expense.deleteOne({ _id: req.body.id }, (err, response) => {
                if (err) {
                    console.log(err)
                } else {
                    res.send(response)
                }
            })

        } catch (error) {
            console.log(error)
        }
    },
    findById: function (req, res) {
        Expense.findById(req.params.id)
            .then(expense => res.json(expense))
            .catch(err => res.status(422).json(err));
    },
    find: function (req, res) {
        Expense.find({ user: req.body.user }, (err, docs) => {
            if (err) { console.log('err', err) }

            res.send(docs)
        })
    },
    update: async function (req, res) {

        try {
            await Expense.updateOne({ _id: req.body.id }, { ...req.body.expense }, (err, docs) => {
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