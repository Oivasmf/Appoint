const router = require('express').Router();
const knex = require("../database");
const encode = require( 'hashcode' ).hashCode;
const jwt = require('jsonwebtoken');

router.post('/', (req, res) => {
    /*recebe do front: 
    {"email_paciente":"aaaa","senha_paciente":"bbbb"}

    Se o email constar no banco de dados, criptografa a senha e compara com a cadastrada. Se a senha não coincidir ou se o email não constar no banco, retora a mesma mensagem de erro por segurança.*/
    knex('Pacientes')
    .where({
        email_paciente: req.body.email_paciente
    })
    .select('*')
    .then(data => {
        var encodedPassword = encode().value(req.body.senha_paciente); //aplica o hashcode
        console.log(encodedPassword);
        if(data[0].senha_paciente == encodedPassword){ //compara as senhas
            const user_token = jwt.sign({ //gera o token
                Id_user: data[0].email_paciente
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