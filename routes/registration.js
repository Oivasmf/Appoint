const router = require('express').Router();
const knex = require("../database");
const encode = require( 'hashcode' ).hashCode;
const jwt = require('jsonwebtoken');

router.post('/', (req, res) => {
    /*recebe do front: 
    {"nome_paciente":"aaaa", "email_paciente":"bbbb", "senha_paciente":"cccc", "confirmacao_senha":c2c2", "cpf_paciente":"dddd", "data_nascimento_paciente":"yyyy-mm-dd", "sexo":"x", "telefone"(opcional):"eeee","nome_rua":"ffff", "numero":"gggg", "complemento":"hhhh", //DEFINIR BAIRRO}

    Se o cpf constar no banco de dados, impede o registro. Senão, insere um registro na tabela Pacientes.*/
    knex('pacientes')
    .where({
        cpf_paciente: req.body.cpf_paciente
    })
    .select('*')
    .then(data => {
        res.status(401).json({ //caso de cpf já cadastrado
            err:'Um usuário com este CPF já consta no sistema.'
        });
    })
    .catch(() => {
        if(req.body.senha_paciente != req.body.confimacao_senha){
            req.status(401).json({
                err:'Usuário não pôde ser cadastrado: senhas divergentes.'
            });
        } else{
            var encodedPassword = encode().value(req.body.senha_paciente); //aplica o hashcode para a senha
            /*if(req.body.telefone){
                knex('pacientes') //TESTAR
                .insert({"nome_paciente":"req.body.nome_paciente", "email_paciente":"req.body.email_paciente", "senha_paciente":encodedPassword, "cpf_paciente":"req.body.cpf_paciente", "data_nascimento_paciente":"req.body.data_nascimento_paciente", "sexo":"req.body.sexo", "telefone"(opcional):"req.body.telefone","nome_rua":"req.body.nome_rua", "numero":"req.body.numero", "complemento":"req.body.complemento", //DEFINIR BAIRRO})
                .then(TESTAR RESPOSTA PARA SUCESSO / FALHA)
            } else {
                knex('pacientes') //TESTAR
                .insert({"nome_paciente":"req.body.nome_paciente", "email_paciente":"req.body.email_paciente", "senha_paciente":encodedPassword, "cpf_paciente":"req.body.cpf_paciente", "data_nascimento_paciente":"req.body.data_nascimento_paciente", "sexo":"req.body.sexo","nome_rua":"req.body.nome_rua", "numero":"req.body.numero", "complemento":"req.body.complemento", //DEFINIR BAIRRO})
                .then(TESTAR RESPOSTA PARA SUCESSO / FALHA)
            }
            
            res.status(200).json({ 
                msg: 'Usuário cadastrado com sucesso.' //Redireciona para a tela de login
            });
            */
        }
    })
});

module.exports = router;