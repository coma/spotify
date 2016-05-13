if (process.env.NODE_ENV === 'production') {

    module.exports = {
        url         : process.env.URL,
        port        : process.env.PORT,
        clientID    : process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    };

} else {

    module.exports = require('./local.json');
}