const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const { existeOuErro, naoExisteOuErro, igualOuErro } = app.api.validation

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => { //esse metodo save vai servir para add um usuario ou alterar
        const user = { ...req.body } //como se tivesse clonando o body e pegado os dados do usuario
        if(req.params.id) user.id = req.params.id //se o id estiver setado, os parametros sao colocados dentro do user.id

        if(!req.originalUrl.startsWith('/users')) user.admin = false
        if(!req.user || !req.user.admin) user.admin = false //senao tiver setado ou admin=false, o usuário sera não será admin

        try {
            existeOuErro(user.name, 'Nome não informado')
            existeOuErro(user.email, 'E-mail não informado')
            existeOuErro(user.password, 'Senha não informada')
            existeOuErro(user.confirmPassword, 'Confirmação de senha inválida')
            igualOuErro(user.password, user.confirmPassword, 'Senhas não conferem')
            
            // dessa forma apenas a url users vai permitir um admin=true
            const userFromDB = await app.db('users') //vai acessar a tabela usuario, ONDE email == user.email
                .where({ email: user.email }).first() //como não quer pegar uma lista de usuario, usa o first para dar o primeiro usuario
                if(!user.id) {
                    naoExisteOuErro(userFromDB, 'Usuário já cadastrado')
                }
        } catch(msg) {
            return res.status(400).send(msg) //400 pq o erro foi do lado do cliente
        }

        user.password = encryptPassword(user.password) //criptografando a senha do usuário
        delete user.confirmPassword //deletar a confirmesenha pq nao vai ser inserido

        if(user.id) {              //esse id-else é a inserção no banco de dados
            app.db('users')
                .update(user)
                .where({ id: user.id })
                .whereNull('deletedAt')
                .then(_ => res.status(204).send()) //dizer q deu tudo certo e nao tem dado para retornar
                .catch(err => res.status(500).send(err)) //catch é o erro
        } else {
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')   //obtendo todos os usuários
            .whereNull('deletedAt')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')   //obtendo todos os usuários
            .where({ id: req.params.id })
            .whereNull('deletedAt')
            .first()
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            const articles = await app.db('articles')
                .where({ userId: req.params.id }) //pegando o id do usuário que veio nos parametros da requisição
            naoExisteOuErro(articles, "Usuário possui artigos.")

            const rowsUpdate = await app.db('users') //se a quantidade de linhas que foi atualizada no BD for 1, quer dizer que conseguiu atualizar o campo
                .update({ deletedAt: new Date() }) // se voltar 0, quer dizer que nao achou o usuário pelo id
                .where({ id: req.params.id })
            existeOuErro(rowsUpdate, "Usuário não foi encontrado.")

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    return { save, get, getById, remove }
}