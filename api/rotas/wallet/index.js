const router = require('express').Router()
const WalletController = require('../../controllers/WalletController')
const walletBD = require('../../controllers/ValidarWallet')

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

module.exports = router