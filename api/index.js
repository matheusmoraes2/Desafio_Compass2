const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())

const router = require('./rotas/wallet')
app.use('/api/v1/wallet', router)

app.listen(3000, () => console.log('Servidor rodando na porta 3000'))

module.exports = app