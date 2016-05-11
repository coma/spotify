import { Request as SuperAgent } from 'superagent';

export default class Request extends SuperAgent {

    constructor (method, path) {

        super(method, Request.getUrl(path));
    }

    go () {

        const { token } = Request.getState();

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

    static getState () {

        return {
            token: {}
        };
    }

    static setGetState (getState) {

        Request.getState = getState;
    }

    static trimSlashes (s) {

        return s.replace(/^\/|\/$/g, '');
    }

    static getUrl (path, root = 'https://api.spotify.com/v1') {

        return Request.trimSlashes(root) + '/' + Request.trimSlashes(path);
    }

    static get (path) {

        return new Request('GET', path);
    }

    static post (path) {

        return new Request('POST', path);
    }

    static patch (path) {

        return new Request('PATCH', path);
    }

    static put (path) {

        return new Request('PUT', path);
    }

    static head (path) {

        return new Request('HEAD', path);
    }

    static delete (path) {

        return new Request('DELETE', path);
    }
}
