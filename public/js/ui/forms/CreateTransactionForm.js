class CreateTransactionForm extends AsyncForm {
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  renderAccountsList() {
    const select = this.element.querySelector('.accounts-select');
    const user = User.current();
    if (user) {
      Account.list(user, (err, response) => {
        if (response && response.data) {
          const decorateAccount = (item) => `<option value="${item.id}">${item.name}</option>`;
          select.innerHTML = response.data.reduce((a, item) => a + decorateAccount(item), '');
        } else {
          throw new Error(err);
        }
      });
    }
  }

  onSubmit(options) {
    Transaction.create(options.data, (err, response) => {
      if (response && response.success) {
        const modal = this.element.closest('#modal-new-income') ? 'newIncome' : 'newExpense';
        this.element.reset();
        App.getModal(modal).close();
        App.update();
      } else {
        throw new Error(err);
      }
    });
  }
}
