'use babel';

import fetch, {Headers, Request, Response} from 'node-fetch';
// import {} from 'whatwg-fetch';
import querystring from 'querystring';

export default class Redmine {

  constructor(config) {
    this.baseUrl = `http://${config.host}`;
    this.apiKey = config.apiKey;
  }

  options(method='GET') {
    return {
      // mode: 'no-cors',
      method: method,
      headers: this.headers()
    };
  }

  headers() {
    return new Headers({
      'X-Redmine-API-Key': this.apiKey
    });
  }

  fetch(path, params={}, method='GET') {
    var url = `${this.baseUrl}${path}?${querystring.stringify(params)}`,
      options = this.options(method);
    console.log('fetch', url, options);
    return fetch(url, options);
  }

  getIssues(params={}) {
    return this.fetch('/issues.json', params);
  }

}
