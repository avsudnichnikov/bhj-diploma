class CreateAccountForm extends AsyncForm {
  onSubmit(options) {
    Account.create(options.data, (err, response) => {
      if (response && response.success) {
        this.element.reset();
        App.getModal('createAccount').close();
        App.update();
      } else {
        throw new Error(err);
      }
    });
  }
}
