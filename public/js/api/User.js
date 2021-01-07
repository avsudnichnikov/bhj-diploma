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
            callback
        });
    }

    static register(data, callback) {
        return createRequest({
            method: 'POST',
            url: this.URL + '/register',
            data,
            callback
        });
    }

    static logout(data, callback) {
        return createRequest({
            method: 'POST',
            url: this.URL + '/logout',
            data,
            callback
        });
    }
}
