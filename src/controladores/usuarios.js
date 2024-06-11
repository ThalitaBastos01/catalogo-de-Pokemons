const pool = require('../conexao')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhaJWT')

const cadastroUsuario = async (req, res) => {
    // pegando dados do usuario no corpo 
    const { nome, email, senha } = req.body

    // validação, autenticação e cadastro
    try {
        // senha do usuário deverá ser criptografada
        const senhaCriptografada = await bcrypt.hash(senha, 10)

        //verificação de nome, senha e  email
        if (!nome || !email || !senha) {
            return res.status(400).json({ mensagem: "Campo obrigatorio!" });
        }
        // buscando e adicionando novo usuario
        const novoUsuario = await pool.query('insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *', [nome, email, senhaCriptografada])

        return res.status(201).json(novoUsuario.rows[0])
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({mensagem: 'Erro'})
    }
}

const login = async (req, res) => {
    const { email, senha } = req.body

    try {
        //buscando no banco de dados se email existe
        const usuario = await pool.query('select * from usuarios where email = $1', [email])

        if (rowCount === 0) {
            return res.status(404).json({mensagem: 'Email ou senha invalida'})
        }

        const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha)

        if (!senhaValida) {
            return res.status(404).json({mensagem: 'Email ou Senha invalida'})
        }

        const token = jwt.sign(
            {id: usuario.rows[0].id}, 
            senhaJwt, 
            {expiresIn: '8h'}
        )

        const { _, ...usuarioLogado} = usuario.rows[0]

        return res.json({usuario: usuarioLogado, token})

    } catch (error) {
        return res.status(500).json({mensagem: 'Erro'})
    }
}

module.exports = {
    cadastroUsuario
}