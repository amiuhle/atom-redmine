'use babel';

// import fetch from 'node-fetch';
import {} from 'whatwg-fetch';
import querystring from 'querystring';

export default class Redmine {

  constructor(config) {
    this.baseUrl = `http://${config.host}`;
    this.apiKey = config.apiKey;
  }

  options(method='GET') {
    return {
      method: method,
      headers: this.headers()
    };
  }

  headers() {
    return {
      'X-Redmine-API-Key': this.apiKey
    };
  }

  fetch(path, params={}, method='GET') {
    console.log('fetch', path, params, method);
    return fetch(`${this.baseUrl}${path}?${querystring.stringify(params)}`, this.options(method));
  }

  getIssues(params={}) {
    return this.fetch('/issues.json', params);
  }

}
