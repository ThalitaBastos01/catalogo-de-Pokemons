const pool = require('../conexao')
const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhaJWT')

const verificaLogin = async (req, res, next) => {
    const {authorization} = req.headers

    if (!authorization) {
        return res.status(401).json({mensagem: 'Não autorizado'})
    }
    // aqui estou quebrando o bearer e o token, ou seja cada um vai ser um elemento, quebra no (' ') = espaço 
    const token = authorization.split(' ')[1]

    try {
        const {id} = jwt.verify(token, senhaJwt)

        const {rows, rowCount} = await pool.query('select * from usuarios where id = $1', [id])

        if (rowCount === 0) {
            return res.status(401).json({mensagem: 'Não autorizado'})
        }

        // sempre que precisarmos de alguma informação dentro do banco o proprio midwere vai buscar
        const {senha, ...usuario} = rows[0]

        req.usuario = usuario

        next()
    } catch (error) {
        return res.status(401).json({mensagem: 'Não autorizado'})
    }
}

module.exports = verificaLogin