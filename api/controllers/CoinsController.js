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

    static async transferencia(corpo, idwallet){
        const moeda = corpo.quoteTo
        const moeda2 = corpo.currentCoin
        const fullnameCoin = Moedas.Moedas_name[moeda]
        this.validardados(corpo)
        this.validarTransferencia(corpo)
        const recebendo = corpo.receiveFrom

        
        const ObjEnvia = await database.wallet.findAll({
            where:{
                id:idwallet
            }
        })
        const ObjReceb = await database.wallet.findAll({
            where:{
                id:recebendo
            }
        })
        if(ObjEnvia.length === 0){
            throw new Error('Id não existe')
        }
        if(ObjReceb.length === 0){
            throw new Error('ReceiveFrom não existe')
        }
        const walletEnvia = this.procuraWallet(idwallet,moeda2)
        const walletRecebe = await this.procuraWallet(recebendo,moeda)
        const m1 = corpo.quoteTo
        const m2 = corpo.currentCoin
        const cotacao = await this.Cotacao(m1,m2)
        const valorinserido = corpo.value
        const amontcalc = this.calcCoin(valorinserido,cotacao)
        

       if(walletRecebe.length === 0){ 
           
        const moedaEnviada = await database.coins.findOne({
            where: {
                coin: corpo.currentCoin,
                wallet_id: idwallet
            }
        })
        const idcoinEnviada = moedaEnviada.id
        //aqui
        const valorAntes = moedaEnviada.amont
        await this.transfeteDesse(valorAntes,corpo.value,idcoinEnviada)
        const corpoEnviado = Object.assign({},corpo,{
            currentcoin:moeda2,
            sendTo:idwallet,
            receiveFrom: recebendo,
            coin_id:idcoinEnviada,
            
            currentCotation:cotacao
        })

        Transactions.defineController(corpoEnviado)


        const amontdeb = this.debitar(0,amontcalc)

          this.coin = moeda
          this.fullname = fullnameCoin
          this.amont = amontdeb
          this.wallet_id = recebendo
        
        const retorno = await this.criarCoin()
        const coinid = retorno.id

        const corpoATT = Object.assign({},corpo,{
            currentcoin:corpo.currentCoin,
            sendTo:idwallet,
            receiveFrom: recebendo,
            coin_id:coinid,
            
            currentCotation:cotacao
        })
        const newtransaction = Transactions.defineController(corpoATT)
        

        
        return corpoATT
       }else{

        const moedaEnviada = await database.coins.findOne({
            where: {
                coin: corpo.currentCoin,
                wallet_id: idwallet
            }
        })
        const idcoinEnviada = moedaEnviada.id
        const valorAntes = moedaEnviada.amont
        //aqui
    await this.transfeteDesse(valorAntes,corpo.value,idcoinEnviada)
        const corpoEnviado = Object.assign({},corpo,{
            currentcoin:moeda2,
            sendTo:idwallet,
            receiveFrom: recebendo,
            coin_id:idcoinEnviada,
            
            currentCotation:cotacao
        })

        Transactions.defineController(corpoEnviado)

        
            const ObjDB = await database.coins.findOne({
                where:{
                wallet_id: corpo.receiveFrom,
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

    static async procuraWallet(idwallet,moeda){
        const a = await database.coins.findAll({
           where:{
               wallet_id: idwallet,
                coin: moeda
           }
       })
       return a
    }

    static validarTransferencia(corpo){

        if(typeof corpo.receiveFrom !== 'number'){
            throw new Error('ReceiveFrom inválido')
        }
        if(corpo.value < 0){
            throw new Error('Value não pode ser negativo')
        }
    }

    static async transfeteDesse(valorAntes,valorDebitar,idaqui){
        const resultadoEnviado2 = valorAntes - valorDebitar
        if(resultadoEnviado2<0){
            throw new Error('Saldo insuficiente!')
        }
        const objetinho = Object.assign({},{amont:resultadoEnviado2})
        await database.coins.update(
            objetinho,{
            where:{
                id:idaqui
            }
        })
    }
}

module.exports = CoinsController