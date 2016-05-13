if (process.env.NODE_ENV) {

    return;
}

const fs     = require('fs'),
      prompt = require('prompt'),
      path   = require('path'),
      file   = path.join(__dirname, 'local.json');

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

if (fs.existsSync(file)) {

    const current = require(file),
          props   = schema.properties;

    Object
        .keys(props)
        .forEach(name => {

            if (current.hasOwnProperty(name)) {

                props[name].default = current[name];
            }
        });
}

prompt.message = '';
prompt.start();
prompt.get(schema, (error, result) => {

    result.url = `http://localhost:${ result.port }/oauth/callback`;

    fs.writeFileSync(file, JSON.stringify(result, null, 4));
});