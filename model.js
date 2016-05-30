var mongoose = require('mongoose');
var uri = 'mongodb://username:password@hostname:port/databasename';
uri = "mongodb://localhost/wifi";

mongoose.connect(uri);

var UserSchema = new mongoose.Schema({
    mac: String,  //用户设备mac地址
    isGo: Boolean,  //用户是否永久放行
    count: Number  //用户临时放行计数器
});

mongoose.model('User', UserSchema);
