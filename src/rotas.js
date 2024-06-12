const express = require('express')
const { cadastroUsuario, login } = require('./controladores/usuarios')
const verificaLogin = require('./intermediario/autenticacao')
const { atualizarApelido, cadastrarPokemon, listarPokemons, excluirPokemon} = require('./controladores/pokemons')
const rotas = express()

rotas.post('/usuario', cadastroUsuario)
rotas.post('/login', login)

rotas.use(verificaLogin)

rotas.post('/pokemons', cadastrarPokemon)
rotas.patch('/pokemons/:id', atualizarApelido)
rotas.get('/pokemons', listarPokemons)
rotas.get('/pokemons/:id', listarPokemons)
rotas.delete('/pokemons/:id', excluirPokemon)


module.exports = rotas