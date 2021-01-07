class RegisterForm extends AsyncForm {
  onSubmit( options ) {
    User.register(options.data, (err, response) => {
      if (response && response.success) {
        this.element.reset();
        App.setState( 'user-logged' );
        App.getModal('register').close();
      }
    });
  }
}
