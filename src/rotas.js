const express = require('express')
const { cadastroUsuario } = require('./controladores/usuarios')
const rotas = express()

rotas.post('/usuario', cadastroUsuario)

module.exports = rotas