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
        
        var conString = `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`
        var pg = require('pg');
        var client = new pg.Client(conString);


        client.connect(function(err) {
                client.query("CREATE TABLE myboktransaction(aok text)", (err, res) => {
                    console.log(err, res);
                    pool.end();
                });

        });

    });


// pool.connect(function (err, client, done) {





// })


