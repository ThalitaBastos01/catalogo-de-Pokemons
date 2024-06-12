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

        //verificação de campos obrigatorio
        if (!nome || !email || !senha) {
            return res.status(400).json({ mensagem: "Campo obrigatorio!" });
        }

        //validação se email ja existe por ser campo unico
        const emailExiste = await pool.query('select * from usuarios where email = $1', [email])

        if (emailExiste.rowCount > 0) {
            return res.status(400).json({mensagem: 'Email ja existe'})
        }


        const query = `insert into usuarios (nome, email, senha)values ($1, $2, $3) returning *`

        // buscando e adicionando novo usuario 
        // aqui pode ocorrer da resposta ser passada no corpo para o usuario, por isso a dessestruturação para me voltar somente os dados de usuario
        const {rows} = await pool.query(query, [nome, email, senhaCriptografada])

        const { _, ...usuario} = rows[0]

        return res.status(201).json(usuario)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({mensagem: 'Erro'})
    }
}

const login = async (req, res) => {
    const { email, senha } = req.body

    try {
        //buscando no banco de dados se email existe
        const {rows, rowCount} = await pool.query('select * from usuarios where email = $1', [email])

        if (rowCount === 0) {
            return res.status(404).json({mensagem: 'Email ou senha invalida'})
        }

        const {senha: senhaUsuario, ...usuario} = rows[0]

        const senhaValida = await bcrypt.compare(senha, senhaUsuario)

        if (!senhaValida) {
            return res.status(404).json({mensagem: 'Email ou Senha invalida'})
        }

        //1º argumento passado é o usuario que foi desestruturado la do banco de dados
        //2º senha jwt - jsonwebtoken // 3º é o tempo que aquele token é valido
        const token = jwt.sign(
            {id: usuario.id}, 
            senhaJwt, 
            {expiresIn: '8h'}
        )

        return res.json({usuario, token})

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({mensagem: 'Erro'})
    }
}

module.exports = {
    cadastroUsuario,
    login
}