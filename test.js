var pgtools = require("pgtools");
var copyFrom = require('pg-copy-streams').from
var fs = require('fs')
var async = require('async')
var { Pool } = require('pg')
const yargs = require('yargs')
const args = require('yargs').argv;
const cc = require('cryptocompare')
global.fetch = require('node-fetch')
const { config } = require("./config");

const request = require('request');
// var url = "https://min-api.cryptocompare.com/data/pricehistorical?";
// var apikey = "e65b377a2b324ba545fa4ea02f62a4b0bfdc35d7568b89d7e2425da8ff01ed17"
let options = {json: true};


   
    // create database

function data_ready() {

    var pool = new Pool({
       host: config.host,
       user: config.user,
       password: config.password,
       port: config.port
    });

     pool.query("CREATE DATABASE" +" "+ config.database + ";", (err) => {


         if (err) {
              console.log(err.message);
        } else {

        var conString = `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`
        var client = new pool.Client(conString);
    
        client.connect(function(err) {

            // create table
            client.query("CREATE TABLE transaction(timestamp BIGINT,transaction_type VARCHAR,token VARCHAR,amount DECIMAL)", (err, res) => {
            // copy data to table
            var stream = client.query(copyFrom("COPY transaction (timestamp,transaction_type,token,amount) FROM STDIN CSV HEADER"));
            var count_query = "SELECT count(*) from transaction";

               return new Promise(async (resolve, reject) => {

                    var fileStream = fs.createReadStream('../transactions.csv')
                    fileStream.pipe(stream);
                    var count_query = "SELECT count(*) from transaction";
                    client.query(count_query).then(res => console.log("Sucessfully finish importing "+res.rows[0].count+" rows."))


                })

                    
            });
        });
        }
        
       

    });

}


   



myargs = yargs.parse()

        switch (true) {


            case myargs.token !== undefined && myargs.date === undefined:
                var question = "Latest portfolio value for that token in USD"
                var myquery = "with cte as(select SUM(CASE WHEN transaction_type='DEPOSIT' THEN amount ELSE 0 END) as deposit, SUM(CASE WHEN transaction_type='WITHDRAWAL' THEN amount ELSE 0 END) as withdrawl,token from transaction WHERE token = "+"'"+myargs.token.toUpperCase()+"'"+"group by token) select deposit-withdrawl as portfolio, token from cte";
                data_retrieve();
                break;

            case myargs.date !== undefined && myargs.token === undefined:
                var question = "Portfolio value per token in USD on that date"
                var dt = Date.parse(myargs.date);  
                var mydate =  dt / 1000;  
                var myquery = "with cte as(select SUM(CASE WHEN transaction_type='DEPOSIT' THEN amount ELSE 0 END) as deposit, SUM(CASE WHEN transaction_type='WITHDRAWAL' THEN amount ELSE 0 END) as withdrawl,token from transaction WHERE timestamp <= "+mydate+" group by token) select deposit-withdrawl as portfolio, token from cte";
                data_retrieve();
                break;


            case myargs.token !== undefined && myargs.date !== undefined:
                var question = "Portfolio value of that token in USD on that date"
                var dt = Date.parse(myargs.date);  
                var mydate =  dt / 1000; 
                var myquery = "with cte as(select SUM(CASE WHEN transaction_type='DEPOSIT' THEN amount ELSE 0 END) as deposit, SUM(CASE WHEN transaction_type='WITHDRAWAL' THEN amount ELSE 0 END) as withdrawl,token from transaction WHERE timestamp <= "+mydate+" AND token ="+"'"+myargs.token.toUpperCase()+"'"+"group by token) select deposit-withdrawl as portfolio, token from cte";
                data_retrieve();
                break;

            case myargs._[0] === "importdb":
               data_ready();
               break;
               

            default:
               var question = "Latest portfolio value per token in USD"
               var myquery = "with cte as(select SUM(CASE WHEN transaction_type='DEPOSIT' THEN amount ELSE 0 END) as deposit, SUM(CASE WHEN transaction_type='WITHDRAWAL' THEN amount ELSE 0 END) as withdrawl,token from transaction group by token) select deposit-withdrawl as portfolio, token from cte";
               data_retrieve();
               break;
            }     
   










function data_retrieve() {

    var pool = new Pool({
       host: config.host,
       user: config.user,
       password: config.password,
       database: config.database,
       port: config.port
    });


    pool.connect(function (err, client, done) {


     client.query(myquery, (err, result) => {
            if (err) {
              console.log(err.stack);

            } else {
           
                    // console.log(question);
        
                    // var token = result.rows.map(obj => obj['token'])

                    // let ok = "https://min-api.cryptocompare.com/data/pricehistorical?fsym=BTC&tsyms=USD&ts=1650380293&api_key=e65b377a2b324ba545fa4ea02f62a4b0bfdc35d7568b89d7e2425da8ff01ed17";
                    // console.log(ok);

                    // request(url, options, (error, res, body) => {


                    //     for(var j=0;j < result.rows.length;j++) {
  
                               
                    //             var token_name = result.rows[j]['token']
                    //             var token_price_in_USD = res.body[token_name]['USD']
                    //             var token_portfolio = result.rows[j]['portfolio'] 

                    //             var calc = token_portfolio * token_price_in_USD 
                    //             console.log(token_name,calc);

                    //         }
   
                    // });

                    console.log(question);

               
                for(var i=0;i< result.rows.length;i++) {
                      
     // const arrayresult = [];
     let portfolio = result.rows[i]['portfolio'];
     let token_name = result.rows[i]['token'];
       var url = "https://min-api.cryptocompare.com/data/pricehistorical?fsym="+token_name+"&tsyms=USD&ts=1650380293&api_key=e65b377a2b324ba545fa4ea02f62a4b0bfdc35d7568b89d7e2425da8ff01ed17";
    
                  request(url, options, (error, res, body) => {
                              
                                // var keys = Object.keys(res.body);
                                // var ressingle = res.body[keys];
                                // keys.forEach(function(key){
                                //     arrayresult.push(res.body[key]);
                                // });
// var obj = JSON.parse(res.body);

var token_in_usd = res.body[token_name]['USD'] 
console.log(token_in_usd);
                            // glo = res.body;
                                
                                // console.log(result.rows[i]['token']);
console.log(portfolio);
console.log(token_name);
                
                        });
                // console.log(glo);
                    // var keys = Object.keys(res.body);
                    //             keys.forEach(function(key){
                    //                 arrayresult.push(res.body[key]);
                    //             });


                    // console.log(aok);

                    }


                // var x = [];
                // var y = [1,2,3,4]// see the change here
                    
                // var i;
                // for (i = 0; i < y.length; ++i) {
                //     x.push(y[i]); // push every element here
                // }
                // console.log(x);

            }
          });

})



}

















// main.js 


// main.js aok --token=btc
// main.js aok --date=12-06-1993
// main.js aok --date=12-06-1993 --token=btc





