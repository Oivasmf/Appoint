const router = require('express').Router();
const knex = require("../database");
const encode = require('hashcode').hashCode;
const jwt = require('jsonwebtoken');

router.post('/', (req, res) => {
    /*recebe do front: 
    {"nome_paciente":"Marcelo Grande", "email_paciente":"marcelo@gmail.com", "senha_paciente":"cccc", "confirmacao_senha":"cccc", "cpf_paciente":"06359722912", "data_nascimento_paciente":"2001-08-20", "sexo":"M", "telefone":"","id_cidade":"10", "bairro":"Vargem Grande","nome_rua":"Estrada dos Testes", "numero":"2525", "complemento":"Casa 02"}

    Se o cpf constar no banco de dados, impede o registro. Senão, insere um registro na tabela Pacientes.*/
    knex('Pacientes')
        .where({
            cpf_paciente: req.body.cpf_paciente
        })
        .select('*')
        .then(data => {
            if (data[0]) { //caso de cpf já cadastrado
                res.status(401).json({
                    err: 'Um usuário com este CPF já consta no sistema.'
                });
            } else { //cadastro de usuário
                if (req.body.senha_paciente != req.body.confirmacao_senha) {
                    res.status(401).json({
                        err: 'Usuário não pôde ser cadastrado: senhas divergentes.'
                    });
                } else {

                    var encodedPassword = encode().value(req.body.senha_paciente); //aplica o hashcode para a senha

                    knex('Enderecos')
                        .insert({ 'bairro': req.body.bairro, 'nome_rua': req.body.nome_rua, 'numero': req.body.numero, 'complemento': req.body.complemento, 'Cidades_id_cidade': req.body.id_cidade })
                        .then(resposta_id_endereco => {
                            knex('Pacientes')
                                .insert({
                                    'nome_paciente': req.body.nome_paciente, 'email_paciente': req.body.email_paciente, 'senha_paciente': encodedPassword, 'cpf_paciente': req.body.cpf_paciente, 'data_nascimento_paciente': req.body.data_nascimento_paciente, 'sexo': req.body.sexo, 'telefone': req.body.telefone, 'Enderecos_id_endereco': resposta_id_endereco
                                })
                                .then(() => {
                                    res.status(200).json({ //sucesso
                                        msg: 'Usuário cadastrado com sucesso.'
                                    })
                                })
                                .catch(() => {
                                    knex('Enderecos')
                                        .where('id_endereco', resposta_id_endereco)
                                        .del()
                                    .then(() =>{
                                        res.status(401).json({ //caso de falha no registro | Dados pessoais
                                            err: 'Usuário não pôde ser cadastrado: dados pessoais inconsistentes.'
                                        })
                                    })
                                })
                        })
                        .catch(() => { //caso de falha no registro | Endereço
                            res.status(401).json({
                                err: 'Usuário não pôde ser cadastrado: informações de endereço inconsistentes.'
                            })
                        })
                }
            }
        })
        .catch(() => {
            res.status(500).json({
                err:'Erro na conexão com o banco de dados'
            })
        })
});

router.get('/estados', (req, res) => {
    knex.select('id_estado', 'estado').table('Estados')
    .then(estados =>{
        res.status(200).json({
            estados
        })
    })
    .catch(() => {
        res.status(500).json({
            err:'Erro na conexão com o banco de dados'
        })
    })
});

// router.get('/cidades', (req, res) => { //Lista estática de cidades
//     knex.select('id_cidade', 'cidade').table('Cidades')
//     .then(cidades =>{
//         res.status(200).json({
//             cidades
//         })
//     })
//     .catch(() => {
//         res.status(500).json({
//             err:'Erro na conexão com o banco de dados'
//         })
//     })
// });

router.post('/cidades', (req, res) => { //Lista de cidades com seleção de estado
    knex.select('id_cidade', 'cidade')
    .table('Cidades')
    .where({
        Estados_id_estado: req.body.id_estado
    })
    .then(cidades =>{
        res.status(200).json({
            cidades
        })
    })
    .catch(() => {
        res.status(500).json({
            err:'Erro na conexão com o banco de dados'
        })
    })
});

module.exports = router;