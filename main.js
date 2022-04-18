var pgtools = require("pgtools");
var copyFrom = require('pg-copy-streams').from
var fs = require('fs')
var async = require('async')
var { Pool } = require('pg')
const yargs = require('yargs')
const args = require('yargs').argv;
const cc = require('cryptocompare')
cc.setApiKey('e65b377a2b324ba545fa4ea02f62a4b0bfdc35d7568b89d7e2425da8ff01ed17')
global.fetch = require('node-fetch')
const { config } = require("./config");



    var pool = new Pool({
       host: config.host,
       user: config.user,
       password: config.password,
       port: config.port
    });

   
    // create database
    // pool.query("CREATE DATABASE" +" "+ config.database + ";", (err) => {


    //      if (err) {
    //           console.log(err.message);
    //     } else {

    //              var conString = `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`
    //     var client = new pool.Client(conString);
    
    //     client.connect(function(err) {

    //         // create table
    //         client.query("CREATE TABLE transaction(timestamp BIGINT,transaction_type VARCHAR,token VARCHAR,amount DECIMAL)", (err, res) => {
    //         // copy data to table
    //         var stream = client.query(copyFrom("COPY transaction (timestamp,transaction_type,token,amount) FROM STDIN CSV HEADER"));
          
    //            return new Promise(async (resolve, reject) => {

    //                 var fileStream = fs.createReadStream('../transactions.csv')
    //                 fileStream.pipe(stream);

    //             })

                    
    //         });
    //     });
    //     }
        
       

    // });



yargs.command({
    command: 'GetPortfolioBy',
    handler: ()=>{
     

    }
})

myargs = yargs.parse()

        switch (true) {


            case myargs.token !== undefined && myargs.date === undefined:
                console.log('question2');
                var question = "Latest portfolio value for that token in USD"
                var myquery = "with cte as(select SUM(CASE WHEN transaction_type='DEPOSIT' THEN amount ELSE 0 END) as deposit, SUM(CASE WHEN transaction_type='WITHDRAWAL' THEN amount ELSE 0 END) as withdrawl,token from transaction WHERE token = "+"'"+myargs.token.toUpperCase()+"'"+"group by token) select deposit-withdrawl as portfolio, token from cte";
                break;

            case myargs.date !== undefined && myargs.token === undefined:
                console.log('question3');
                var question = "Portfolio value per token in USD on that date"
                var dt = Date.parse(myargs.date);  
                var mydate =  dt / 1000;  
                var myquery = "with cte as(select SUM(CASE WHEN transaction_type='DEPOSIT' THEN amount ELSE 0 END) as deposit, SUM(CASE WHEN transaction_type='WITHDRAWAL' THEN amount ELSE 0 END) as withdrawl,token from transaction WHERE timestamp <= "+mydate+" group by token) select deposit-withdrawl as portfolio, token from cte";
                break;


            case myargs.token !== undefined && myargs.date !== undefined:
                console.log('question4');
                var question = "Portfolio value of that token in USD on that date"
                var dt = Date.parse(myargs.date);  
                var mydate =  dt / 1000; 
                var myquery = "with cte as(select SUM(CASE WHEN transaction_type='DEPOSIT' THEN amount ELSE 0 END) as deposit, SUM(CASE WHEN transaction_type='WITHDRAWAL' THEN amount ELSE 0 END) as withdrawl,token from transaction WHERE timestamp <= "+mydate+" AND token ="+"'"+myargs.token.toUpperCase()+"'"+"group by token) select deposit-withdrawl as portfolio, token from cte";
                break;

            default:
               console.log('Question1'); 
               var question = "Latest portfolio value per token in USD"
               var myquery = "with cte as(select SUM(CASE WHEN transaction_type='DEPOSIT' THEN amount ELSE 0 END) as deposit, SUM(CASE WHEN transaction_type='WITHDRAWAL' THEN amount ELSE 0 END) as withdrawl,token from transaction group by token) select deposit-withdrawl as portfolio, token from cte";
               break;
                  
        }






    var pool = new Pool({
      host: "localhost",
      user: "postgres",
      database: "postgres",
      password: "password",
      port: 5432
    });



pool.connect(function (err, client, done) {


     client.query(myquery, (err, res) => {
            if (err) {
              console.log(err.stack);
            } else {
           
                   
                    var token = res.rows.map(obj => obj['token'])
                    cc.priceMulti(token, ['USD'])
                    .then(prices => {
                   
                     console.log(question);
                        for(var j=0;j< token.length;j++) {
                               
                                var token_name = res.rows[j]['token']
                                var calc = res.rows[j]['portfolio'] * prices[token_name]['USD']     
                                console.log(token_name,calc);

                            }
                    process.exit();

                    })
                    .catch(console.error)



            }
          });

})















// main.js 


// main.js aok --token=btc
// main.js aok --date=12-06-1993
// main.js aok --date=12-06-1993 --token=btc





