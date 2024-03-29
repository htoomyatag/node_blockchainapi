var apikey = 'e65b377a2b324ba545fa4ea02f62a4b0bfdc35d7568b89d7e2425da8ff01ed17'
var copyFrom = require('pg-copy-streams').from
var fs = require('fs')
var async = require('async')
var { Pool } = require('pg')
const yargs = require('yargs')
const args = require('yargs').argv;
const cc = require('cryptocompare')
const { config } = require("./config");
const request = require('request');
let options = {json: true};
var moment = require('moment');

    pool = new Pool({
        host: config.host,
        user: config.user,
        password: config.password,
        port: config.port
    });
       

// create database
function data_ready() {


    pool.query("CREATE DATABASE" +" "+ config.database + ";", (err) => {
        console.log("Data is importing....Please do not close");
   
        var conString = `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`
        var client = new pool.Client(conString);
    
        client.connect(function(err) {
            // create table
            client.query("CREATE TABLE transaction(timestamp BIGINT,transaction_type VARCHAR,token VARCHAR,amount DECIMAL)", (err, res) => {
                // copy data to table
                var stream = client.query(copyFrom("COPY transaction (timestamp,transaction_type,token,amount) FROM STDIN CSV HEADER"));
                var count_query = "SELECT count(*) from transaction";

                return new Promise(async (resolve, reject) => {
                    var fileStream = fs.createReadStream('transactions.csv')
                    fileStream.pipe(stream);
                    var count_query = "SELECT count(*) from transaction";
                    client.query(count_query).then(res => console.log("Sucessfully finish importing "+res.rows[0].count+" rows.You can start to use now."))
                })
    
            });
        });       
    });
}

myargs = yargs.parse()
switch (true) {
    // Given a token, return the latest portfolio value for that token in USD
    case myargs.token !== undefined && myargs.date === undefined:
        var question = "Latest portfolio value for that token in USD"
        var myquery = "with cte as(select SUM(CASE WHEN transaction_type='DEPOSIT' THEN amount ELSE 0 END) as deposit, SUM(CASE WHEN transaction_type='WITHDRAWAL' THEN amount ELSE 0 END) as withdrawl,token from transaction WHERE token = "+"'"+myargs.token.toUpperCase()+"'"+"group by token) select deposit-withdrawl as portfolio, token from cte";
        var mydate =  moment() / 1000;  
        data_retrieve();
        break;

    // Given a date, return the portfolio value per token in USD on that date
    case myargs.date !== undefined && myargs.token === undefined:
        var question = "Portfolio value per token in USD on that date"
        var dt = Date.parse(myargs.date);  
        var mydate =  dt / 1000;  
        var myquery = "with cte as(select SUM(CASE WHEN transaction_type='DEPOSIT' THEN amount ELSE 0 END) as deposit, SUM(CASE WHEN transaction_type='WITHDRAWAL' THEN amount ELSE 0 END) as withdrawl,token from transaction WHERE timestamp <= "+mydate+" group by token) select deposit-withdrawl as portfolio, token from cte";
        data_retrieve();
        break;

    // Given a date and a token, return the portfolio value of that token in USD on that date
    case myargs.token !== undefined && myargs.date !== undefined:
        var question = "Portfolio value of that token in USD on that date"
        var dt = Date.parse(myargs.date);  
        var mydate =  dt / 1000; 
        var myquery = "with cte as(select SUM(CASE WHEN transaction_type='DEPOSIT' THEN amount ELSE 0 END) as deposit, SUM(CASE WHEN transaction_type='WITHDRAWAL' THEN amount ELSE 0 END) as withdrawl,token from transaction WHERE timestamp <= "+mydate+" AND token ="+"'"+myargs.token.toUpperCase()+"'"+"group by token) select deposit-withdrawl as portfolio, token from cte";
        data_retrieve();
        break;

    // create database and importing data
    case myargs._[0] === "importdb":
       var conString = `postgres://${config.user}:${config.password}@${config.host}:${config.port}`
       var client = new pool.Client(conString);
       data_ready();
       break;
               
    //Given no parameters, return the latest portfolio value per token in USD
    default:
       var question = "Latest portfolio value per token in USD"
       var myquery = "with cte as(select SUM(CASE WHEN transaction_type='DEPOSIT' THEN amount ELSE 0 END) as deposit, SUM(CASE WHEN transaction_type='WITHDRAWAL' THEN amount ELSE 0 END) as withdrawl,token from transaction group by token) select deposit-withdrawl as portfolio, token from cte";
       var mydate =  moment() / 1000;  
       data_retrieve();
       break;
}

function data_retrieve() {

    pool = new Pool({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        port: config.port
    });
       

    pool.connect(function (err, client, done) {

        if (err) {
            console.log("Please run 'main.js importdb' command first");
        } else {   
            client.query(myquery, (err, result) => {
                console.log(question);
                for(var i=0;i< result.rows.length;i++) {
                    let portfolio = result.rows[i]['portfolio'];
                    let token_name = result.rows[i]['token'];
                    var url = "https://min-api.cryptocompare.com/data/pricehistorical?fsym="+token_name+"&tsyms=USD&ts="+mydate+"&api_key="+apikey+";"
                    request(url, options, (error, res, body) => {
                        var token_in_usd = res.body[token_name]['USD']  
                        var calc = token_in_usd * portfolio
                        console.log(token_name,calc); 
                    });
                }
            });
        }
    })
}