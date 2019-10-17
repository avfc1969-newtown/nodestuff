//Simple api node app David Fennell
const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const path = require('path');
const request = require('request');
const bodyParser = require('body-parser');

require('dotenv').config();
const PORT = process.env.PORT || 5000;


// body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));


//API Key EIX_TOKEN this is held in the .env (git ignore -- even though this is usinga public key best practise not to push to github, please see readme)
// api call function
function api_call(dataloadedAPI, ticker_find){
    request('https://cloud.iexapis.com/stable/stock/' + ticker_find + '/quote?token=' + process.env.EIX_TOKEN, {json: true }, (err, res, body) => {
        if(err) {return console.log(err);}
        if (res.statusCode === 200){
            //console.log(body);
            dataloadedAPI(body);
        };
    });
};






//Set Handlebars Middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//const otherstuff = "hello there, this is more stuff";


// Set handlebar app GET routes
app.get('/', function (req, res) {
    api_call(function(completedAPI) {
            res.render('home', {
            ticker : completedAPI
        });
    }, "goog");
});

// Set handlebar app POST routes
app.post('/', function (req, res) {
    api_call(function(completedAPI) {
            //posted_ticker = req.body.market_ticker;
            res.render('home', {
            ticker : completedAPI
            

        });
    }, req.body.market_ticker);
});





// Set handlebar about route
app.get('/about.html', function (req, res) {
    res.render('about');
});




// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log('Server Listening on port ' + PORT));