if (process.env.NODE_ENV) {

    return;
}

const fs     = require('fs'),
      prompt = require('prompt');

const schema = {
    properties: {
        port        : {
            description: 'local site port',
            type       : 'integer',
            default    : 5000
        },
        clientID    : {
            description: 'Spotify Client ID',
            message    : 'Copy it from https://developer.spotify.com/my-applications/#!/applications',
            required   : true
        },
        clientSecret: {
            description: 'Spotify Client Secret',
            message    : 'Copy it from https://developer.spotify.com/my-applications/#!/applications',
            required   : true
        }
    }
};

prompt.message = '';
prompt.start();
prompt.get(schema, (error, result) => {

    fs.writeFileSync('config.json', JSON.stringify(result, null, 4));
});