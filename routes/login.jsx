const router = require('express').Router();
const knex = require("../database");
const encode = require( 'hashcode' ).hashCode;
const jwt = require('jsonwebtoken');

router.post('/', (req, res) => {
    //recebe do front os dados de 'login' e 'password' e checa no banco.
    //caso exista, retorna um token. Caso contrário, retorna um erro.
    knex('Users')
    .where({
        User: req.body.login
    })
    .select('*')
    .then(data => {
        var encodedPassword = encode().value(req.body.password); //aplica o hashcode
        if(data[0].Password == encodedPassword){ //compara as senhas
            const user_token = jwt.sign({ //gera o token
                Id_users: data[0].Id_users
            }, process.env.TOKEN_SECRET);

            res.status(200).json({ //envia o token
                token: user_token
            });
        } else {
            res.status(401).json({ //caso de senha incorreta
                err:'Usuário ou senha não encontrados!'
            });
        }
    })
    .catch(() => {
        res.status(401).json({ //caso de usuário não encontrado
            err: 'Usuário ou senha não encontrados!'
        });
    });
});

module.exports = router;