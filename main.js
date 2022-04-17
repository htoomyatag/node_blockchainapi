var pgtools = require("pgtools");
var copyFrom = require('pg-copy-streams').from
var fs = require('fs')
var async = require('async')
var { Pool } = require('pg')
const { config } = require("./config");


    var pool = new Pool({
       host: config.host,
       user: config.user,
       password: config.password,
       port: config.port
    });


    pool.query("CREATE DATABASE" +" "+ config.database + ";", (err, res) => {
        console.log(err, res);

        pool.query("CREATE TABLE myboktransaction(aok text)", (err, res) => {
            console.log(err, res);
            pool.end();
        });
        
    });


// pool.connect(function (err, client, done) {





// })


