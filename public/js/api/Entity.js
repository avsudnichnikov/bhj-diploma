class Entity {
  static URL = '';

  static list(data, callback) {
    return createRequest({
      method: 'GET',
      url: this.URL,
      data,
      callback
    });
  }

  static get(id, data, callback) {
    return createRequest({
      method: 'GET',
      url: `${this.URL}/${id || ''}`,
      data,
      callback
    });
  }

  static create(data, callback) {
    return createRequest({
      method: 'POST',
      url: this.URL,
      data: {...data, _method: 'PUT'},
      callback
    });
  }

  static remove(id, data, callback) {
    return createRequest({
      method: 'POST',
      url: `${this.URL}/${id || ''}`,
      data: {...data, _method: 'DELETE'},
      callback
    });
  }
}
