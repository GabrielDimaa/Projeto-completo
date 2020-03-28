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

        try {
            existeOuErro(user.name, 'Nome não informado')
            existeOuErro(user.email, 'E-mail não informado')
            existeOuErro(user.password, 'Senha não informada')
            existeOuErro(user.confirmPassword, 'Confirmação de senha inválida')
            igualOuErro(user.password, user.confirmPassword, 'Senhas não conferem')
            
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
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    return { save, get }
}