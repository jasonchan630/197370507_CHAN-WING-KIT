let table_prefix = 'myrestful_';
module.exports.db_name = 'restful_demo';

module.exports.table_user = table_prefix + 'user';// username password
module.exports.table_user_article = table_prefix + 'user_article';//uid aid
module.exports.table_user_comment = table_prefix + 'user_comment';//uid cid
module.exports.table_user_collect = table_prefix + 'user_collect';//uid aid
module.exports.table_article = table_prefix + 'acticle';//title description content create_time
module.exports.table_comment = table_prefix + 'comment';//content create_time

