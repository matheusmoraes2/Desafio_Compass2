const router = require('express').Router()
const WalletController = require('../../controllers/WalletController')
const TransactionsController = require('../../controllers/TransactionsController')
const CoinsController = require('../../controllers/CoinsController')

router.post('/', async (req,res,proximo)=>{
    try{
        const dadosRecebidos = req.body
        const dadosCriados = new WalletController(dadosRecebidos)
        await dadosCriados.AdcionaWallet()
         res.status(201).json(dadosCriados)
    }catch(error){
        res.status(500).json(error.message)
    }
})

router.get('', async (req,res) => {
        const busca = req.query
        const resultados = await WalletController.pegartudo(busca)
        res.status(200)
        res.json(resultados)
   
})

router.get('/:id', async (req , res, proximo) =>{
    try{
    const buscaID = req.params.id
    const resultados = await WalletController.pegarporid(buscaID)
    res.status(200)
    res.json(resultados)
    }catch(error){
        res.status(404).json(error.message)
    }
})

router.put('/:id' ,async (req,res) =>{
    try{
        const idwallet = req.params.id
        const corpo = req.body
        const transaction = await CoinsController.upcoin(corpo,idwallet)
        res.status(200).json(transaction)
    }catch(error){
        res.status(500).json(error.message)
    }
})

module.exports = router