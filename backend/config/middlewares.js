const bodyParser = require('body-parser')
const cors = require('cors')

module.exports = app => { //padrao para usar o consign lá no package.json
    app.use(bodyParser.json())
    app.use(cors())
}