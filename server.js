var express = require('express');
var moment = require('moment');
// var session = require('express-session');
//var crypto = require('crypto');
var mongoose = require('mongoose');
require('./model.js');

var User = mongoose.model('User');

var app = express();

// app.use(session({
//     secret: 'secret',
//     resave: true,
//     saveUninitialized: false,
//     cookie: {
//         maxAge: 1000*60*60*12
//     }
// }));

app.set('view engine', 'html');
app.engine('.html', require('ejs').__express);

app.use(express.static('./public'));

app.get('/tmp_pass', function(req, res) {

    var mac = req.param('mac');
    // console.log('weixin in');

    var date = moment().format('YYYYMMDDhhmmss');
    var num = Math.floor(Math.random()*1000);
    var token = date+num;
    // if (!req.session.token) {
    //     req.session.token = token;
    // }
    var url = 'http://192.168.3.1:2060/wifidog/auth?token='+token;
    //初始化用户信息并临时放行
    User.findOne({mac: mac}, function(err, doc){
        if(err) {
            console.log('err:', err);
            return;
        }
        if(doc){  //存在该用户则初始化信息
            doc.isGo = false;
            doc.count = 4;
            doc.save();
        }else{  //不存在则新建该用户信息
            var user = new User({
                mac: mac,
                isGo: false,
                count: 4
            });
            user.save(function(err){
                console.log('save status', err ? 'failed' : 'success');
            });
        }
    });
    //通知wifidog该用户临时放行
    res.redirect(url);
});

app.get('/login', function(req, res) {
    
//    var content = sign;
//    var md5 = crypto.createHash('md5');
//        md5.update(content);
//    sign = md5.digest('hex'); 

    var mac = req.param('mac');     
    //跳转到拦截页面
    res.render('intercept',{mac :mac});
});

app.get('/ping', function(req, res) {
    res.end('Pong');
});

app.get('/weixinAuth', function(req, res) {
    // console.log('weixinAuth in');
    var mac = req.param('mac');
    //对该mac地址永久放行
    User.findOne({mac: mac}, function(err, doc){
        if(err) {
            console.log('err:', err);
            return;
        }
        if(doc){
            doc.isGo = true;
            doc.count = 4;
            doc.save();
        }
    });
	
    res.end();
});

app.get('/auth', function(req, res) {
    var mac = req.param('mac');
    //var token = req.param('token');
    // if (true) {
    //     res.end("Auth: 1");
    // }else{
    //     res.end("Auth: 0");
    // }
    //验证用户是否被放行
    User.findOne({mac: mac}, function(err, doc){
        if(err) {
            console.log('err:', err);
            return;
        }
        // console.log('findOne result:', doc);
        if(doc){
            if(!doc.isGo){  //是否永久放行
                if(doc.count > 0){  //是否临时放行
	       doc.count = doc.count - 1;
	       doc.save();
	       //console.log(doc.count);
                    res.end("Auth: 1");
                }else{
                    res.end("Auth: 0");
    	   }
            }else{
                res.end("Auth: 1");
            }
        }else{
            res.end("Auth: 0");
        }
    });

});

app.get('/portal', function(req, res) {
    // if (req.session.token) {
    //     res.render('success');
    // }else{
    //     res.end("faild");
    // }
});

app.listen(2367, function(req, res){
    console.log('Server running at http://127.0.0.1:2367/');
});
