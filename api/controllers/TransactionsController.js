const database = require('../models')
const transactions = require('../models/transactions')

class TransactionsController{

    constructor({id,value,datetime,sendTo,receiveFrom,currentCotation,currentcoin,coin_id,createdAt,updatedAt}){
        this.id = id
        this.value = value
        this.datetime = datetime
        this.sendTo = sendTo
        this.receiveFrom = receiveFrom
        this.currentCotation = currentCotation
        this.currentcoin = currentcoin
        this.coin_id = coin_id
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }

    static defineController(dados){
        this.value = dados.value
        this.sendTo = dados.sendTo
        this.receiveFrom = dados.receiveFrom
        this.currentCotation = dados.currentCotation
        this.currentcoin = dados.currentcoin
        this.coin_id = dados.coin_id
        this.adcdatetime()

        this.criarTransaction()
    }

    static async criarTransaction(){
        const criarTransaction = await database.transactions.create({
            value: this.value,
            datetime: this.datetime,
            sendTo : this.sendTo,
            receiveFrom : this.receiveFrom,
            currentCotation : this.currentCotation,
            currentcoin: this.currentcoin,
            coin_id: this.coin_id
        })
        this.id = criarTransaction.id
        this.createdAt = criarTransaction.createdAt
        this.updatedAt = criarTransaction.updatedAt

    }

    static adcdatetime(){
        this.datetime = Date()
    }
}

module.exports = TransactionsController