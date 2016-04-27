import { Request as SuperAgent } from 'superagent';

let store;

export function setStore (s) {

    store = s;
}

export function trimSlashes (s) {

    return s.replace(/^\/|\/$/, '');
}

export function getUrl (path, root = 'https://api.spotify.com/v1') {

    return trimSlashes(root) + '/' + trimSlashes(path);
}

export default class Request extends SuperAgent {

    constructor (method, path) {

        super(method, getUrl(path));
    }

    go () {

        const { token } = store.getState();

        if (token.access) {

            this.set('Authorization', 'Bearer ' + token.access);
        }

        return new Promise((resolve, reject) => this.end((error, response) => {

            if (error) {

                reject(error);

            } else {

                resolve(response);
            }
        }));
    }
}

export function get (path) {

    return new Request('GET', path);
}

export function post (path) {

    return new Request('POST', path);
}

export function patch (path) {

    return new Request('PATCH', path);
}

export function put (path) {

    return new Request('PUT', path);
}

export function head (path) {

    return new Request('HEAD', path);
}

export function del (path) {

    return new Request('DELETE', path);
}
