class User {
  static URL = '/user';

  static setCurrent(user) {
    localStorage.user = JSON.stringify(user);
  }

  static unsetCurrent() {
    localStorage.removeItem('user');
  }

  static current() {
    return JSON.parse(localStorage.getItem('user'));
  }

  static fetch(data, callback) {
    return createRequest({
      method: 'GET',
      url: this.URL + '/current',
      data,
      callback
    });
  }

  static login(data, callback) {
    return createRequest({
      method: 'POST',
      url: this.URL + '/login',
      data,
      callback: (err, response) => {
        if (response && response.success) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      }
    });
  }

  static register(data, callback) {
    return createRequest({
      method: 'POST',
      url: this.URL + '/register',
      data,
      callback: (err, response) => {
        if (response && response.success) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      }
    });
  }

  static logout(data, callback) {
    return createRequest({
      method: 'POST',
      url: this.URL + '/logout',
      data,
      callback: (err, response) => {
        if (response && response.success) {
          this.unsetCurrent();
        }
        callback(err, response);
      }
    });
  }
}
