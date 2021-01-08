class LoginForm extends AsyncForm {
  onSubmit(options) {
    User.login(options.data, (err, response) => {
      if (response && response.success) {
        this.element.reset();
        App.setState('user-logged');
        App.getModal('login').close();
      } else {
        alert('Авторизация не удалась!');
      }
    });
  }
}
