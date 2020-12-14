const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers['x-auth-token'];
    if (token) {
        jwt.verify(token, process.env.word, (err, decodedToken) => {
            if (err) {
                console.log(err)
                res.send(err)
                // {
                //     "name": "JsonWebTokenError",
                //     "message": "invalid token"
                // }
            } else {

                //{ id: '5f98417fa066fa6150967ade', iat: 1604654232, exp: 1604740632 }
                req.body.user = decodedToken.id;
                next()
            }
        })
    } else {
        res.status(404)
        res.send('access denied')
        console.log('error')
    }

}

module.exports = authMiddleware;