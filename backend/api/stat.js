module.exports = app => {
    const Stat = app.mongoose.model('Stat', {
        users: Number,
        categories: Number,
        articles: Number,
        createdAt: Date //criado em:
    })
                //trabalhar com promise
    const get = (req, res) => {
        Stat.findOne({}, {}, { sort: { 'createdAt': -1 } }) //findOne = pegar um //nao filtrar nada = {} //nao selecionar nada = {}
            .then(stat => {
                const defaultStat = {
                    users: 0,
                    categories: 0,
                    articles: 0
                }
                res.json(stat || defaultStat)
            })                    //'createdAt': -1 vai pegar de forma decrescente, pegando a ultima estatistica
    }        
    
    return { Stat, get }
}               