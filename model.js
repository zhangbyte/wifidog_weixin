var mongoose = require('mongoose');
var uri = 'mongodb://username:password@hostname:port/databasename';
uri = "mongodb://localhost/wifi";

mongoose.connect(uri);

var UserSchema = new mongoose.Schema({
    mac: String,
    isGo: Boolean,
    count: Number
});

mongoose.model('User', UserSchema);
