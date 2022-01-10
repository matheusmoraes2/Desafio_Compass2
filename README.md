# Desafio Compass 2
## Carteira de Criptomoedas 💰 

### Funcionalidades 
- Criar uma carteira para armazenar moedas
- Listar todas as carteiras, moedas e suas transações
- Listar cada carteira individualmente 
- Adicionar Fundos em uma carteira
- Transferir fundos de uma carteira para outra
- Listar todas as transações feitas por uma carteira 

### Executando o projeto

1. **Para clonar o projeto execute:**

```
git clone https://github.com/matheusmoraes2/Desafio_Compass.git
```
2. **Conexão com o banco de dados:**
- Crie uma database chamada criptomoedas, com o comando:
```
CREATE DATABASE IF NOT EXISTS criptomoedas;
```
- Entre na pasta config, abra o arquivo config.json e altere o "username" e "password" 
para o usuario e senha do seu banco de dados.

**Instale as dependencias usando:** 

```
npm i
```

**Execute o comando a seguir para criar as tabelas:**

```
 npx sequelize-cli db:migrate
 ```
 
 **Execute a aplicação usando:** 

```
npm run start
```


#### Obsevações
- A rota de delete apresenta erro ao tentar deletar uma wallet, pois eu não consegui terminar a tempo 😓 

