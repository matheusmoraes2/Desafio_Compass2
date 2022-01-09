const database = require('../models')
const coins = require('../models/coins')
const transactions = require('../models/transactions')
const Moedas = require('./Moedas.json')
const Transactions = require('./TransactionsController')
const axios = require('axios')
const { json } = require('body-parser')

class CoinsController{

    constructor({id,coin,fullname,amont,wallet_id,createdAt,updateAt}){
        this.id = id
        this.coin = coin
        this.fullname = fullname
        this.amont = amont
        this.wallet_id = wallet_id
        this.createdAt = createdAt
        this.updateAt = updateAt
    }

    static async upcoin(corpo,idwallet){

        this.validardados(corpo)

        const objDados = await database.wallet.findAll({
            where:{
                id:idwallet
            }
        })
        if(objDados.length === 0){
            throw new Error('Id não existe')
        }

        const moeda = corpo.quoteTo
        const fullnameCoin = Moedas.Moedas_name[moeda]
        const a = await database.coins.findAll({
           where:{
               wallet_id: idwallet,
                coin: moeda
           }
       })
        const m1 =corpo.quoteTo
        const m2 = corpo.currentCoin
        const cotacao = await this.Cotacao(m1,m2)
        const valorinserido = corpo.value
        const amontcalc = this.calcCoin(valorinserido,cotacao)
        

       if(a.length === 0){  
        const amontdeb = this.debitar(0,amontcalc)

          this.coin = moeda
          this.fullname = fullnameCoin
          this.amont = amontdeb
          this.wallet_id = idwallet
        
        const retorno = await this.criarCoin()
        const coinid = retorno.id

        const corpoATT = Object.assign({},corpo,{
            currentcoin:corpo.currentCoin,
            sendTo:idwallet,
            receiveFrom:idwallet,
            coin_id:coinid,
            
            currentCotation:cotacao
        })
        const newtransaction = Transactions.defineController(corpoATT)
        return corpoATT
       }else{
            const ObjDB = await database.coins.findOne({
                where:{
                wallet_id: idwallet,
                 coin: moeda
            }})
            const valorReturn = ObjDB.amont
            const amontdeb = this.debitar(valorReturn,amontcalc)
            const dadosATT = Object.assign({},{amont:amontdeb})
            const idbusc = ObjDB.id
            const Updatemoeda = await database.coins.update(dadosATT,{
                where:{
                    id:idbusc
                }
            })
            const corpoATT = Object.assign({},corpo,{
                currentcoin:corpo.currentCoin,
                sendTo:idwallet,
                receiveFrom:idwallet,
                coin_id:idbusc,
                currentCotation:cotacao
            })
            const newtransaction = Transactions.defineController(corpoATT)

            return corpoATT
        }
       
   }

    static async criarCoin(){
        const criarCoin = await database.coins.create({
            wallet_id: this.wallet_id,
            coin: this.coin,
            fullname: this.fullname,
            amont: this.amont
        })
        this.id = criarCoin.id
        this.createdAt = criarCoin.createdAt
        this.updateAt = criarCoin.updateAt
        
        return criarCoin
    }
    static async Cotacao(n1,n2){
        const moeda1= n1
        const moeda2=n2
        const cotacao = await axios.get(`https://economia.awesomeapi.com.br/last/${moeda2}-${moeda1}`) 

        const juntando = [`${moeda2}${moeda1}`]
        
        const resultado = cotacao.data
        const resultado2 = resultado[juntando] 
        const resultado3 = resultado2.bid
        
        return parseFloat(resultado3)
    }

    static debitar(value,valuedeb){
        const result = value + (valuedeb)
        if (result < 0){
            throw new Error('Você não tem saldo suficiente!')
        }else{
            return result
        }

    }
    static calcCoin(value,cotacao){
        const result = value * cotacao

        return result

    }

    static validardados(corpo){
        if(typeof corpo.quoteTo !== 'string'){
            throw new Error('Campo quoteTo inválido!')
        }
        if(typeof corpo.currentCoin !== 'string'){
            throw new Error('Campo currentCoin inválido!')
        }
        if(typeof corpo.value !== 'number'){
            throw new Error('Campo value inválido!')
        }
    }

    static async idExiste(idw){
        const objDados = await database.wallet.findAll({
            where:{
                id:idw
            }
        })
        if(objDados.length === 0){
            throw new Error('Id não existe')
        }
    }
}

module.exports = CoinsController