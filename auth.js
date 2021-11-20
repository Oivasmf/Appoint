const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
    let token = req.headers['authorization'];

    if(!token) {
        return res.status(401).json({
            err: 'Acesso negado. Por favor, faça o login.'
        });
    }

    token = token.split(' ').pop();
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                err: 'Acesso negado. Por favor, faça o login.'
            });
        }
        next();
    });
}

module.exports=auth;