# Designs decisions

After I study the test, while downloading the (977.3 MB CSV files)
the first decision comes to my mind is
the command line program should be
fastest possible speed on data retrieving process.
So I try this program to not only work but also maintainable with
below ways.

The first way
I try with sqlite because it was the fastest database. 
I use node.js filestream feature and save into sqlite database line by line.
The second way
I try to import .sql files into mysql database.

Both ways take too long for the CSV importing process.
So I decided to use postgres because postgres has a copy command
which can copy large CSV files to the database within seconds.
It only takes 60 to 80 secs to import transactions.csv file.

Now I start to solve questions one by one.

Q1.Given no parameters, return the latest portfolio value per token in USD
To get the latest portfolio value we need to obtain balance by subtracting the sum of deposit and sum of withdrawal
to accomplish calculation within a single query we have to use CTE (common table expression) 
which can store data temporarily with group by clause.

Q2.Given a token, return the latest portfolio value for that token in USD
It is almost the same with Questition1's query. All i need to do is to check the condition with the given token name.

Q3.Given a date, return the portfolio value per token in USD on that date
First, a given date needs to convert to epoch format and pass it to
historical API from CryptoCompare to get USD rate for that date.
And multiply above USD rate with calculated portfolio value 
which we get by subtracting the sum of deposit and sum of withdrawal before
that given date.

Q4.Given a date and a token, return the portfolio value of that token in USD on that date
It is also the same with Questition3's query. I have to check the given token name with my query. 

# How to run

Add database name,user name and password in config.js file.

Run ***node main.js importdb*** to make data ready to use for the program.

Once successfully finish importing data, you can run

- main.js 
- main.js --token=BTC
- main.js --date=2018-03-14
- main.js --date=2018-03-14 --token=BTC

# Technology stack

- node.js v17.8.0
- postgres 
- pgtools for postgres database create
- pg-copy-streams for postgres copy command
- yargs for command line arguments
- request for API
- moment for date time format

# How to improve

The code need to be refactor.
