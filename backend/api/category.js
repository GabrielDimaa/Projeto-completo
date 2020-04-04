module.exports = app => {
    const { existeOuErro, naoExisteOuErro } = app.api.validation

    const save = (req, res) => {
        const category = { 
            id: req.body.id,
            name: req.body.name,
            parentId: req.body.parentId
        }

        if(req.params.id) category.id = req.params.id

        try {
            existeOuErro(category.name, "Nome não informado")
        } catch(msg) {
            return res.status(400).send(msg)
        }

        if(category.id) { //se id estiver setado, vou fazer um update
            app.db('categories')
                .update(category)
                .where({ id: category.id }) //selecionar a categoria pelo id
                .then(_ => res.status(204).send()) //se der tudo certo
                .catch(err => res.status(500).send(err)) //se der algum erro
        }
        else {
            app.db('categories')
                .insert(category)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            existeOuErro(req.params.id, "Código da categoria não informado.")

            const subcategory = await app.db('categories')
                .where({ parentId: req.params.id }) //"req.params.id" esse eu quero excluir. Então vejo se alguma subcategoria tem o mesmo id
            naoExisteOuErro(subcategory, "Categoria possui subcategorias.") 
            
            const articles = await app.db('articles')
                .where({ categoryId: req.params.id })
            naoExisteOuErro(articles, "Categoria possui artigos.")

            const rowsDeleted = await app.db('categories') // resultado que retorna a partir da exclusao
                .where({ id: req.params.id }).del()
            existeOuErro(rowsDeleted, "Categoria não foi encontrada.")

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    const comCaminho = categories => { //recebe um lista de categorias e retorna uma lista de categorias com um atributo a mais
        const getParent = (categories, parentId) => { 
            const parent = categories.filter(parent => parent.id === parentId)
            return parent.length ? parent[0] : null //se esse array for maior do que 0 retorna verdadeiro, e retorna 
        }                                           // indice 0 pq so vai retornar um parent, senao achar retorna null

        const categoriesComCaminho = categories.map(category => {
            let caminho = category.name
            let parent = getParent(categories, category.parentId)

            while(parent) {
                caminho = `${parent.name} > ${caminho}`
                parent = getParent(categories, parent.parentId) //se o resultado do parent retornar nulo, sai do while
            }

            return { ...category, caminho }
        })

        categoriesComCaminho.sort((categoria1, categoria2) => { 
            if(categoria1.caminho < categoria2.caminho) return -1
            if(categoria1.caminho > categoria2.caminho) return 1
            return 0
        })

        return categoriesComCaminho
    }

    const get = (req, res) => {
        app.db('categories') //nao precisa do select, isso e suficiente pra fazer um select
            .then(categories => res.json(comCaminho(categories))) //vai retornar um array
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('categories')
            .where({ id: req.params.id })
            .first()
            .then(category => res.json(category))
            .catch(err => res.status(500).send(err))
    }

    //transformar um array em uma arvore
    const toTree = (categories, tree) => { //PraArvore, vai receber uma árvore e um array de categorias
        if(!tree) tree = categories.filter(c => !c.parentId)  //se nao tiver setado vai pegar todas as categorias que nao tem o parentId setado 
        tree = tree.map(parentNode => {
            const isChild = node => node.parentId == parentNode.id
            parentNode.children = toTree(categories, categories.filter(isChild))
            return parentNode
        })
        return tree
    }

    const getTree = (req, res) => {
        app.db('categories')
            .then(categories => res.json(toTree(categories)))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getTree }
}