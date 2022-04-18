var pgtools = require("pgtools");
var copyFrom = require('pg-copy-streams').from
var fs = require('fs')
var async = require('async')
var { Pool } = require('pg')
const yargs = require('yargs')
const args = require('yargs').argv;
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
     
        switch (true) {


            case args.token !== undefined && args.date === undefined:
                console.log('question2');
                break;

            case args.date !== undefined && args.token === undefined:
                console.log('question3');
                break;


            case args.token !== undefined && args.date !== undefined:
                console.log('question4');
                break;

            default:
               console.log('question1');
               break;

      
                        
        }



    }
})


yargs.parse()






// main.js 


// main.js aok --token=btc
// main.js aok --date=12-06-1993
// main.js aok --date=12-06-1993 --token=btc





