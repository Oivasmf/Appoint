const router = require('express').Router();
const knex = require("../database");
const encode = require('hashcode').hashCode;
const jwt = require('jsonwebtoken');

router.post('/', (req, res) => {
    /*recebe do front: 
    {"id_medico":"int","id_especialidade":"int","id_paciente":"int","id_clinicas":"int","id_FormasDePagamento":"int","inicio_consulta":"datetime"}

    Adiciona uma consulta com as informações selecionadas.*/
    knex('Consultas')
        .insert({
            "id_medico":req.body.id_medico,"id_especialidade":req.body.id_especialidade,"id_paciente":req.body.id_paciente,"id_clinicas":req.body.id_clinicas,"id_FormasDePagamento":req.body.id_FormasDePagamento,"inicio_consulta":req.body.inicio_consulta
        })
        .then(() => {
            res.status(200).json({
                msg:'Consulta adicionada com sucesso!'
            })
        })
        .catch(() => {
            res.status(500).json({
                err:'Não foi possível adicionar a consulta!'
            })
        });
});


router.get('/especialidades', (req, res) => {
    knex.select('id_especialidade', 'especialidade').table('Especialidades')
    .then(especialidades =>{
        res.status(200).json({
            especialidades
        })
    })
    .catch(() => {
        res.status(500).json({
            err:'Erro ao consultar lista de especialidades.'
        })
    })
});

router.get('/clinicas', (req, res) => {
    knex.select('id_clinicas', 'nome_clinica').table('Clinicas')
    .then(clinicas =>{
        res.status(200).json({
            clinicas
        })
    })
    .catch(() => {
        res.status(500).json({
            err:'Erro ao consultar lista de clínicas.'
        })
    })
});

router.get('/formasdepagamento', (req, res) => {
    knex.select('id_FormasDePagamento', 'formaPagamento').table('Formasdepagamento')
    .then(formasDePagamento =>{
        res.status(200).json({
            formasDePagamento
        })
    })
    .catch(() => {
        res.status(500).json({
            err:'Erro ao consultar lista de formas de pagamento.'
        })
    })
});

router.get('/medicos', (req, res) => {
    knex.select('id_medico', 'nome_medico').table('Medicos')
    .then(medicos =>{
        res.status(200).json({
            medicos
        })
    })
    .catch(() => {
        res.status(500).json({
            err:'Erro ao consultar lista de médicos.'
        })
    })
});



module.exports = router;