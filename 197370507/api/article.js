const express = require('express');
const router = express.Router()
var session = require('express-session');

let dbInstance = require('../database/db').initDb;
router.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: {maxAge: 6000000}}));


router.route('/articles/')
    .get(getArticleList)


router.route('/user/articles/:articleId')
    .get(loginAuth, getArticle)
    .post(loginAuth, addArticle)
    .put(loginAuth, updateArticle)
    .delete(loginAuth, deleteArticle)


router.get('/',renderAllArticlesIndex);
router.get('/index',renderAllArticlesIndex);
router.get('/all_article',loginAuth,renderAllArticles);
router.get('/list_article',loginAuth,renderActirles);
router.get('/post_article',loginAuth,renderPostArticle);
router.get('/update_article',loginAuth,renderUpdateArticle);
router.get('/edit_article/:aid',loginAuth,renderEditArticle);

function renderActirles(httpreq,httpres) {httpres.header("Content-Type", "text/html;charset=utf-8"); httpres.render("list_article");}
function renderAllArticlesIndex(httpreq,httpres) {httpres.header("Content-Type", "text/html;charset=utf-8"); httpres.render("index");}
function renderAllArticles(httpreq,httpres) {httpres.header("Content-Type", "text/html;charset=utf-8"); httpres.render("all_article");}
function renderPostArticle(httpreq,httpres) {httpres.header("Content-Type", "text/html;charset=utf-8");httpres.render("post_article");}
function renderUpdateArticle(httpreq,httpres) {httpres.header("Content-Type", "text/html;charset=utf-8");httpres.render("update_article");}


function renderEditArticle(httpreq,httpres) {
    httpres.header("Content-Type", "text/html;charset=utf-8");

    let aid =  httpreq.params.aid
    dbInstance.articleInfo(aid, function (err, info) {
        if (err) {
            httpres.status(200),
                httpres.json({
                    "success" : false,
                    "msg" : err
                })
        } else {
            console.log(info)
            httpres.render("edit_article",{info:info});
        }
    })

}

function getArticleList(httpreq,httpres)
{
    let uid =  httpreq.session.user_id
    console.log(uid,'uid')
    console.log(httpreq.session)
    dbInstance.articleList(function (err, dbRes) {
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
                    "data" : dbRes,
                    'now_uid':uid
                })
        }
    })
}


function getArticle(httpreq,httpres)
{
    let aid =  httpreq.query.aid  || 0
    dbInstance.myArticleList(httpreq.session.user_id, aid,function (err, dbRes) {
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
                    "data" : dbRes
                })
        }
    })
}


function addArticle(httpreq,httpres)
{
    let title = httpreq.body.title
    let description = httpreq.body.description
    let content = httpreq.body.content

    let params = {
        "title" : title,
        "description" : description,
        "content" : content,
        "uid" : httpreq.session.user_id,
        "create_time" : getTime()
    }

    console.log(params)

    dbInstance.addArticle(params, function (err, addRes) {
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


function updateArticle(httpreq,httpres) {
    let title = httpreq.body.title
    let description = httpreq.body.description
    let content = httpreq.body.content

    let aid = httpreq.params.articleId

    let params = {
        "title" : title,
        "description" : description,
        "content" : content,
    }

    console.log(aid)
    console.log(params)

    let updateData = { $set: {"title" : title, "description" : description, "content" : content,} }
    dbInstance.updateArticle(aid, updateData,function (err, addRes) {
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
                    "msg" : "update success",
                })
        }
    })
}

function deleteArticle(httpreq,httpres)
{
    let aid = httpreq.body.aid
    console.log(aid,'delete-aid')
    dbInstance.delArticle(aid, function (err, addRes) {
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

function getTime()
{
    return Date.parse( new Date());
}

module.exports = router;