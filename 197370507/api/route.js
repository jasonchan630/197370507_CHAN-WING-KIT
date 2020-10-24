const user = require('./user.js')
const article = require('./article.js')
const comment = require('./comment.js')
const collect = require('./collect.js')


module.exports = (app) => {
    app.use(user)
    app.use(article)
    app.use(comment)
    app.use(collect)
}
