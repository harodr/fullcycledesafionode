const mysql      = require('mysql');
const connection = mysql.createPool({
    connectionLimit: 10,
    host: 'dados',
    user: 'root',
    password: 'root',
    database: 'nodedb',
    ports: "3307:3306"
});


const express = require('express');
const port = 3000;
const server = express();


async function  handleQuery(sql){
    return new Promise((resolve,reject) =>{
        connection.query(sql,function (error, results, fields){
            if (error){
                console.log(error);
                if(error.code =="ECONNREFUSED")
                    return reject(new Error('Aguardando Conexão Com Bando de Dados! Tente novamente mais tarde'));
                return reject(new Error("Erro ao acessar banco de dados!"));
            }
            return resolve(results);
        });

    });

}

server.get('/',async (req,res)=>{
    const sql = `Select * from desafio`; 
    try{
        const pessoas = await handleQuery(sql);
        const listaPessoas = pessoas.map(p =>`
            <li>${p.name}</li>
        `);
        const fullcycle = `<h1>Full Cycle Rocks!</h1>`;
        const response = `${fullcycle}
        <ul>${listaPessoas.map(p=>p).join(' ')} <ul>
        `
        return  res.send(response);
    }catch(error){
        res.status(500).send({error : error.message});
    }    
});


server.listen(port, ()=>{
    console.log(`server listening in port ${port}`)
});