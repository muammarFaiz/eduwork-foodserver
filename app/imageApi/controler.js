const path = require('path')

const sendImage = (req, res, next) => {
    const tosend = path.join(__dirname, '../..', 'images/food_eduwork', req.params.name)
    res.sendFile(tosend)
}

module.exports = {
    sendImage
}