const express     = require('express'),
      request     = require('superagent'),
      path        = require('path'),
      qs          = require('querystring'),
      config      = require('../config.json'),
      port        = process.env.PORT || config.port,
      redirectUri = process.env.URL || `http://localhost:${ port }/oauth/callback`,
      app         = express();

const scopes = [
    'playlist-modify-public',
    'playlist-modify-private',
    'user-library-modify',
    'user-read-email'
];

const spotifyParams = qs.stringify({
    client_id    : config.clientID,
    response_type: 'code',
    redirect_uri : redirectUri,
    scope        : scopes.join(' ')
});

const spotifyAccounts = 'https://accounts.spotify.com/',
      spotifyAuth     = spotifyAccounts + 'authorize?' + spotifyParams,
      spotifyToken    = spotifyAccounts + 'api/token'

function tokenRequest (data, end) {

    return request
        .post(spotifyToken)
        .type('form')
        .auth(config.clientID, config.clientSecret)
        .send(data)
        .end(end);
}

module.exports = dev => {

    if (dev) {

        dev(app);
    }

    app.use(express.static('web'));

    app.get('/oauth', (req, res) => res.redirect(spotifyAuth));

    app.get('/oauth/callback', (req, res) => {

        if (req.query.error) {

            res.redirect('/oauth/error');

        } else {

            tokenRequest({
                grant_type  : 'authorization_code',
                code        : req.query.code,
                redirect_uri: redirectUri
            }, (error, response) => res.redirect(error ? '/oauth/error' : '/login?' + qs.stringify(response.body)));
        }
    });

    app.post('/oauth/refresh', (req, res) => {

        tokenRequest({
            grant_type   : 'refresh_token',
            refresh_token: req.query.refresh_token
        }, (error, response) => res.send(response.body));
    });

    app.get('*', (req, res) => res.sendFile(path.join(__dirname, '..', 'web', 'index.html')));
    app.listen(port, () => console.log('server listening on', port));
};
