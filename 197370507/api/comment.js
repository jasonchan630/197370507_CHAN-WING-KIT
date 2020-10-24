const express = require('express');
const router = express.Router()
var session = require('express-session');

let dbInstance = require('../database/db').initDb;
router.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: {maxAge: 6000000}}));


router.route('/comments/:aid')
    .get(loginAuth, getCommentList)

router.route('/article/comments/:commentId')
    .get(loginAuth, getComment)
    .post(loginAuth, addComment)
    .put(loginAuth, updateComment)
    .delete(loginAuth, deleteComment)


router.get('/list_comment/:aid',loginAuth,function (httpreq,httpres) {
    let aid = httpreq.params.aid
    httpres.header("Content-Type", "text/html;charset=utf-8"); httpres.render("list_comment",{aid:aid});
});


function addComment(httpreq, httpres) {
    let aid = httpreq.body.aid
    let content = httpreq.body.content

    let params = {
        "aid" : aid,
        "username" : httpreq.session.username,
        "content" : content,
        "uid" : httpreq.session.user_id,
        "create_time" : getTime()
    }

    console.log(params,'addComment')

    dbInstance.addComment(params, function (err, addRes) {
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
                    "msg" : "add success",
                })
        }
    })
}

function deleteComment(httpreq, httpres) {
    let cid = httpreq.params.commentId
    console.log(cid,'deleteComment')
    dbInstance.delComment(cid, function (err, addRes) {
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

function getComment(httpreq,httpres) {
    let cid = httpreq.params.commentId
    console.log(cid,'getComment')
    dbInstance.getCommentDetail(cid,function (err, dbRes) {
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
                    "msg" : "option success",
                    "data" : dbRes
                })
        }
    })
}

function getCommentList(httpreq,httpres) {
    let aid = httpreq.params.aid
    console.log(aid,'getCommentList')
    dbInstance.getComment(aid,function (err, dbRes) {
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
                            // console.log(article)
                            out.push({"id":item._id,"uid":item.uid,"username":item.username,"article":article,'create_time':item.create_time,'content':item.content})
                        })

                        httpres.status(200),
                            httpres.json({
                                "success" : true,
                                "msg" : "option success",
                                "data" : out,
                                "now_id" : httpreq.session.user_id
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


function updateComment(httpreq,httpres) {
    let content = httpreq.body.content

    let cid = httpreq.params.commentId

    let updateData = { $set: {"content" : content,} }
    dbInstance.updateComment(cid, updateData,function (err, addRes) {
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
                    "msg" : "option success",
                })
        }
    })
}


function loginAuth(req,res,next)
{
    console.log(req.session.user_id,'session_uid');
    if (req.session.user_id != undefined && req.session.user_id != '') {
        return next()
    } else {
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