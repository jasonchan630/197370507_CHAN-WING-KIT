const express = require('express');
const router = express.Router()
var session = require('express-session');

let dbInstance = require('../database/db').initDb;
router.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: {maxAge: 6000000}}));


router.route('/article/collect/:cid')
    .post(loginAuth,colletArticle)
    .delete(loginAuth,delCollect)


router.get('/list_collect',loginAuth,function (httpreq,httpres) {
    httpres.header("Content-Type", "text/html;charset=utf-8"); httpres.render("list_collect");
});
router.get('/user/collect',loginAuth,getCollectList);


function colletArticle(httpreq,httpres) {
    let uid = httpreq.session.user_id
    let aid = httpreq.body.aid

    let params = {
        "uid":uid,
        "aid":aid,
        "create_time":getTime(),
    }
    
    dbInstance.isRepeatCollect(params, function (err,dbRes) {
        if (err) {
            httpres.status(200),
                httpres.json({
                    "success" : false,
                    "msg" : err
                })
        } else {
            if (JSON.stringify(dbRes) !== '[]') {
                httpres.status(200),
                    httpres.json({
                        "success" : true,
                        "msg" : "You have already collected",
                    })
                return false;
            } else {
                dbInstance.collectArticle(params,function (err, addRes) {
                    if (err) {
                        httpres.status(200),
                            httpres.json({
                                "success" : false,
                                "msg" : err
                            })
                    } else {
                        httpres.status(200),
                            httpres.json({
                                "success" : true,
                                "msg" : "collect success",
                            })
                    }
                })
            }

        }
    })

}

function delCollect(httpreq,httpres) {
    let cid = httpreq.body.cid
    console.log(cid,'delete-aid')
    dbInstance.delCollect(cid, function (err, addRes) {
        // console.log(err)
        // console.log(addRes)
        if (err) {
            httpres.status(200),
                httpres.json({
                    "success" : false,
                    "msg" : err
                })
        } else {
            httpres.status(200),
                httpres.json({
                    "success" : true,
                    "msg" : "delete success",
                })
        }
    })
}

function getCollectList(httpreq,httpres) {
    dbInstance.myCollectList(httpreq.session.user_id,function (err, dbRes) {
        if (err) {
            httpres.status(200),
                httpres.json({
                    "success" : false,
                    "msg" : err
                })
        } else {
            if (JSON.stringify(dbRes) !== '[]') {
                dbInstance.articleList(function (err, articleRes) {
                    if (err) {
                        httpres.status(200),
                            httpres.json({
                                "success" : false,
                                "msg" : err
                            })
                    } else {

                        var out = []
                    
                        dbRes.forEach(function (item) {
                            // console.log(item,'item')
                            let aid = item.aid
                            let article = matchArticle(articleRes,aid)
                            // console.log(aid)
                            console.log(article,'article')
                            out.push({"id":item._id,"uid":item.uid,"article":article,'create_time':item.create_time})
                        })

                        httpres.status(200),
                            httpres.json({
                                "success" : true,
                                "msg" : "option success",
                                "data" : out
                            })
                    }
                })
            } else {
                httpres.status(200),
                    httpres.json({
                        "success" : true,
                        "msg" : "option success",
                        "data" : dbRes
                    })
            }
        }
    })
}

function loginAuth(req,res,next)
{
    if (req.session.user_id != undefined && req.session.user_id != '') {
        return next()
    } else {
        // res.status(200),
        //     res.json({
        //         "success" : false,
        //         "msg" : "login first",
        //     })
        res.header("Content-Type", "text/html;charset=utf-8");
        res.render("login");
    }
}

function matchArticle(articleRes, aid)
{
    return articleRes.filter(function (item) {
        return item._id == aid
    })
}

function getTime()
{
    return Date.parse( new Date());
}

module.exports = router;