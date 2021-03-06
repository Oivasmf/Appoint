const router = require('express').Router();
const knex = require("../database");
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {

    const jwt = require('jsonwebtoken');
    let token = req.headers['authorization'];
    token = token.split(' ').pop();
    var decoded = jwt.decode(token, process.env.TOKEN_SECRET, true); //Captura a informação recebida do token vindo do front-end
    

    knex
    .select(
        'id_consulta',
        'm.nome_medico',
        'e.especialidade',
        'fp.formaPagamento',
        'end.nome_rua',
        'cid.cidade',
        'con.fim_consulta',
        'con.inicio_consulta'
    )
    .from('Consultas as con')
    .leftJoin('Medicos AS m', 'm.id_medico', 'con.id_medico')
    .leftJoin('FormasDePagamento AS fp', 'fp.id_FormasDePagamento', 'con.id_FormasDePagamento')
    .leftJoin('Especialidades AS e', 'e.id_especialidade', 'con.id_especialidade')
    .leftJoin('Enderecos AS end', 'end.id_endereco', 'con.id_endereco')
    .leftJoin('Clinicas AS c', 'c.id_clinica', 'con.id_clinicas')
    .leftJoin('Cidades AS cid', 'cid.id_cidade', 'end.Cidades_id_cidade')
    .where('con.id_paciente', '=', decoded) 
    .then(consultas =>{
        res.status(200).json({
            consultas
        })
    })
    .catch(() => {
        res.status(501).json({ //Caso ocorra alguém problema no servidor.
            err: 'Erro no servidor!',
        });
    })

});

router.post('/', (req, res) => {
    knex('Consultas')
    .where('Consultas.id_consulta', req.body.id_consulta)
    .del()

    .then(data => {
        res.status(200).json({ 
            acerto: 'Deletado a consulta!'
        });
    })

    .catch(() => {
        res.status(501).json({ //Caso ocorra alguém problema no servidor.
            err: 'Erro no servidor!',
        });
    })

});
module.exports = router;