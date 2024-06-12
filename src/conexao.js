// conexão com o banco de dados
const {Pool} = require('pg')

const pool = new Pool({
	host: 'localhost',
	port: 5432,
	user: 'postgres',
	password: '174029',
	database: 'catalogo_pokemons'
})

module.exports = pool