var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');

const route = require('./api/route.js')
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

const port = 3000;

app.set('port', port)
route(app)

app.listen(app.get('port'),'0.0.0.0')

console.log('listen on port =>' + port)


app.use(express.static(__dirname+"/public"));

app.set("views","./public/views");

app.set("view cache",true);

app.engine('.html',ejs.__express);

app.set("view engine","html");


