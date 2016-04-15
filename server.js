var express = require('express');
var moment = require('moment');
var session = require('express-session');

var app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*60*12
    }
}));

app.set('view engine', 'html');
app.engine('.html', require('ejs').__express);

app.get('/weixin', function(req, res) {
    // var mac = req.param('mac'); 
    // var url = req.param('url');

    var date = moment().format('YYYYMMDDhhmmss');
    var num = Math.floor(Math.random()*1000);
    var token = date+num;
    if (!req.session.token) {
        req.session.token = token;
    }
    var url = 'http://192.168.3.1:2060/wifidog/auth?token='+token;
    res.redirect(url);
});

app.get('/login', function(req, res) {
    res.render('index');
});

app.get('/ping', function(req, res) {
    res.end('Pong');
});

app.get('/auth', function(req, res) {
    // var mac = req.param('mac');
    // var token = req.param('token');
    if (true) {
        res.end("Auth: 1");
    }else{
        res.end("Auth: 0");
    }
});

app.get('/portal', function(req, res) {
    if (req.session.token) {
        res.render('success');
    }else{
        res.end("faild");
    }
});

app.listen(2367, function(req, res){
    console.log('Server running at http://127.0.0.1:2367/');
});
