const database = require('../models')
const transactions = require('../models/transactions')
const wallet = require('../models/wallet')
const coins = require('../models/coins')

class WalletController{

    constructor({id, name, cpf, birthdate, createdAt, updatedAt}){
        this.id = id
        this.name = name
        this.cpf = cpf
        this.birthdate = birthdate
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }

    async AdcionaWallet() {
            this.validarName()
            this.validarCpf()
            this.validarBirthdate()
            const criarWallet = await database.wallet.create({
                name : this.name,
                cpf : this.cpf,
                birthdate : this.birthdate
            })
            this.id = criarWallet.id
            this.createdAt = criarWallet.createdAt
            this.updatedAt = criarWallet.updatedAd
        
    }

    static pegartudo(busca){
        
            return database.wallet.findAll({
                where:busca,
                attributes: { exclude: ['createdAt','updatedAt'] },
                include: [{
                    model: database.coins,
                    
                    attributes: { exclude: ['createdAt','updatedAt','wallet_id','id'] },
                    include:{
                        model: database.transactions
                    }
                }],
            })     
    }

    validarName(){
        const names = this.name
      if(names.length < 7){
           throw new error('nome deve ter mais de 7 caracteres')
      }
    }

    validarCpf(){
        const cpfs = this.cpf
        const formatadoCPF = String(cpfs).replace(/[^\d]/g, '')
        if(formatadoCPF.length !== 11){
            throw new error()
        }
    }

    validarBirthdate(){
        const birthdates = this.birthdate
        const nascimentoform = new Date(birthdates)
        const data = new Date()
        const nascY = nascimentoform.getFullYear()
        const nascM = nascimentoform.getMonth()
        const nascD = nascimentoform.getDate()
        const dataY = data.getFullYear()
        const dataM = data.getMonth()
        const dataD = data.getDate()
        const anoDiff = dataY - nascY
        const mesDiff = dataM - nascM
        const diaDiff = dataD - nascD
        if ((anoDiff < 18) || (anoDiff === 18 && mesDiff < 0 ) || (anoDiff === 18 && mesDiff === 0 && diaDiff < 0)){
            throw new error()
        }
    }
}

module.exports = WalletController