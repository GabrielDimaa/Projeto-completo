module.exports = app => {
    app.route('/users')
        .post(app.api.user.save)
        .get(app.api.user.get)

    app.route('/users/:id') //esse parametro na url vai descobrir se está alterando ou inserindo
        .put(app.api.user.save)
}