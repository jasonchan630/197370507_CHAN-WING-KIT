const express = require('express');
const router = express.Router();
var session = require('express-session');
let mongo = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
let MongoClient = mongo.MongoClient;
let db;
var globalConfig = require('../config');

let dbInstance = require('../database/db').initDb;

router.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: {maxAge: 6000000}}));

MongoClient.connect("mongodb://localhost:27017/",{ useNewUrlParser: true }, function(err, client) {
    if(err) throw err;
    db = client.db(globalConfig.db_name);
    // db.dropDatabase();
});


router.all('/register',function(req,httpres){

    if (req.method === 'GET') {
        httpres.header("Content-Type", "text/html;charset=utf-8");
        if (req.session.user_id) {
            httpres.render("index");
        } else {
            httpres.render("register");
        }
        return false;
    }

    let username = req.body.username;
    let password = req.body.password;

    let myobj = {
        "username" : username,
        "password" : password,
    };

    if(username == '' || password == '') {
        httpres.status(200),
            httpres.json({
                "success" : false,
                "msg" : "username or password cannot be null"
            })
    }

    let whereStr = {"username":username};  

    db.collection(globalConfig.table_user).find(whereStr).toArray(function(err, result) {
        if (err) throw err;
        if(JSON.stringify(result) == '[]') {
            db.collection(globalConfig.table_user).insertOne(myobj, function(err, res) {
                if (err) throw err;

                let userId = res.insertedId;

                httpres.status(200),
                    httpres.json({
                        "success" : true,
                        "msg" : "register success",
                        "data" : userId
                    })
            });
        } else {
            httpres.status(200),
                httpres.json({
                    "success" : false,
                    "msg" : "username exists"
                })
        }
    });
});


router.all('/login',function(req,httpres){

    if (req.method === 'GET') {
        httpres.header("Content-Type", "text/html;charset=utf-8");
        if (req.session.user_id) {
            httpres.render("index");
        } else {
            httpres.render("login");
        }
        return false;
    }

    let username = req.body.username;
    let password = req.body.password;

    if(username == '' || password == '') {
        httpres.status(200),
            httpres.json({
                "success" : false,
                "msg" : "username or password cannot be null"
            })
    }

    let whereStr = {"username":username,"password":password};  
console.log(whereStr)
    db.collection(globalConfig.table_user).find(whereStr).toArray(function(err, result) {
        if (err) throw err;
        if(JSON.stringify(result) == '[]') {
            httpres.status(200),
                httpres.json({
                    "success" : false,
                    "msg" : "login failed account not exists",
                    "data" : []
                })
        } else {
            req.session.user_id = result[0]._id
            req.session.username = result[0].username
            httpres.status(200),
                httpres.json({
                    "success" : true,
                    "msg" : "login success",
                    "data" : result[0]._id
                })
        }
    });
});


router.post('/logout',function (req,httpres) {
    console.log('logout')
    req.session.user_id = '';
    req.session.destroy(function(err) {
        if(err){
            httpres.status(200),
                httpres.json({
                "success" : false,
                "msg" : "logout failed",
            });
            return;
        } else {
            httpres.status(200),
                httpres.json({
                    "success" : true,
                    "msg" : "logout success",
                });
            return;
        }
        // httpres.redirect('/');
    });
})

router.get('/search',function(req,httpres){
    let keyword = req.query.keyword;
    console.log(keyword,'=========')
    if(keyword == '' || keyword == undefined) {
        httpres.status(404),
            httpres.json({
                "success" : false,
                "msg" : "not found"
            })
    } else {
        let whereStr = {
            "username" : eval("/"+keyword+"/i") ,
        };

        db.collection(globalConfig.table_user).find(whereStr).toArray(function(err, result) {
            if (err) throw err;
            if(JSON.stringify(result) == '[]') {
                httpres.status(200),
                    httpres.json({
                        "success" : false,
                        "msg" : "not found"
                    })
            } else {
                dbInstance.getFriendList(req.session.user_id,function (err, friends) {
                    httpres.status(200),
                        httpres.json({
                            "success" : true,
                            "msg" : "success",
                            "data" : result,
                            "friend" : friends
                        })
                })

            }
        });
    }

});

function loginAuth(req,res,next)
{
    if (req.session.user_id != undefined && req.session.user_id != '') {
        return next()
    } else {
        // res.status(200),
        //     res.json({
        //         "success" : true,
        //         "msg" : "login",
        //     })
        res.header("Content-Type", "text/html;charset=utf-8");
        res.render("login");
    }
}

module.exports = router;
