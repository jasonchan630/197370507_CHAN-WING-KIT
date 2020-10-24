let mongo = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
let MongoClient = mongo.MongoClient;
let db;
var globalConfig = require('../config');

let singleInstance = {};

MongoClient.connect("mongodb://localhost:27017/",{ useNewUrlParser: true }, function(err, client) {
    if(err) throw err;
    db = client.db(globalConfig.db_name);
});


singleInstance.addArticle = function (obj, callback)
{
    db.collection(globalConfig.table_article).insertOne(obj, callback);
}


singleInstance.addComment = function(obj, callback)
{
    db.collection(globalConfig.table_comment).insertOne(obj, callback);
}


singleInstance.updateArticle = function(aid, updateData, callback)
{
    let query = { "_id": ObjectId(aid)}
    db.collection(globalConfig.table_article).updateOne(query,updateData, callback);
}


singleInstance.updateComment = function(cid,updateData, callback)
{
    let query = { "_id": ObjectId(cid)}
    db.collection(globalConfig.table_comment).updateOne(query,updateData, callback);
}


singleInstance.getComment = function(aid, callback)
{
    db.collection(globalConfig.table_comment).find({"aid":""+aid+""}).toArray(callback);
}


singleInstance.getCommentDetail = function(cid, callback)
{
    db.collection(globalConfig.table_comment).find({"_id":ObjectId(cid)}).toArray(callback);
}


singleInstance.collectArticle = function (obj, callback)
{
    db.collection(globalConfig.table_user_collect).insertOne(obj, callback);
}

singleInstance.isRepeatCollect = function(obj,callback)
{
    //"uid":uid,
    //         "aid":aid,
    let whereStr = {"uid":""+ObjectId(obj.uid)+"","aid":""+ObjectId(obj.aid)+""};
    console.log(whereStr)
    db.collection(globalConfig.table_user_collect).find(whereStr).toArray(callback);
}

singleInstance.myArticleList = function(uid, aid, callback) {
    let whereStr;
    if (aid) {
        whereStr = {"uid":""+ObjectId(uid)+"","_id":""+ObjectId(aid)+""};
    } else {
        whereStr = {"uid":""+ObjectId(uid)+""};
    }
    console.log(whereStr);
    db.collection(globalConfig.table_article).find(whereStr).toArray(callback);
}

singleInstance.myCollectList = function(uid, callback)
{
    let whereStr = {"uid":""+ObjectId(uid)+""};
    db.collection(globalConfig.table_user_collect).find(whereStr).toArray(callback);
}


singleInstance.articleList = function(callback) {
    db.collection(globalConfig.table_article).find().toArray(callback);
}

singleInstance.articleInfo = function(aid,callback) {
    db.collection(globalConfig.table_article).find({"_id":ObjectId(aid)}).toArray(callback);
}


singleInstance.delArticle = function(aid, callback)
{
    db.collection(globalConfig.table_article).deleteOne({"_id":ObjectId(aid)}, callback);
}

singleInstance.delCollect = function(cid,callback)
{
    db.collection(globalConfig.table_user_collect).deleteOne({"_id":ObjectId(cid)}, callback);
}


singleInstance.delComment = function(cid, callback)
{
    db.collection(globalConfig.table_comment).deleteOne({"_id":ObjectId(cid)}, callback);
}


exports.initDb = singleInstance;