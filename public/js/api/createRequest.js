const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.responseType = options.responseType || 'json';

  const callback = (options.callback) ? options.callback : (f) => f;

  let body = null;
  let { url } = options;

  if (options.method === 'GET') {
    url += '?';
    for (const key in options.data) {
      url += `${key}=${options.data[key]}&`;
    }
    url = url.slice(0, -1);
  } else {
    body = new FormData();
    for (const key in options.data) {
      body.append(key, options.data[key]);
    }
  }

  try {
    xhr.open(options.method, url, true);
    xhr.send(body);
  } catch (e) {
    callback(e);
  }

  xhr.addEventListener('readystatechange', () => {
    if (xhr.readyState === xhr.DONE && xhr.status === 200) {
      callback(null, xhr.response);
    }
  });

  return xhr;
};
