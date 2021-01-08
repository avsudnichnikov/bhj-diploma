class AccountsWidget extends BaseWidget {
  constructor(element) {
    super(element);
    this.update();
    this.currentAccountId = null;
  }

  registerEvents() {
    const createAccount = this.element.querySelector('.create-account ');

    createAccount.addEventListener('click', (event) => {
      event.preventDefault();
      App.getModal('createAccount').open();
    });

    this.element.addEventListener('click', (event) => {
      const item = event.target;
      if (item.closest('.account')) {
        this.onSelectAccount(item.closest('.account'));
      }
    });
  }

  update() {
    const user = User.current();
    if (user) {
      Account.list(user, (err, response) => {
        if (response && response.success) {
          this.clear();
          response.data.forEach((item) => this.renderItem(item));
        } else {
          throw new Error(err);
        }
      });
    }
  }

  clear() {
    this.currentAccountId = null;
    this.element.querySelectorAll('.account').forEach((item) => item.remove());
  }

  onSelectAccount(element) {
    if (this.currentAccountId) {
      const account = this.element.querySelector(`.account[data-id="${this.currentAccountId}"]`);
      account.classList.remove('active');
    }
    element.classList.add('active');
    this.currentAccountId = element.dataset.id;
    App.showPage('transactions', { account_id: this.currentAccountId });
  }

  getAccountHTML(item) {
    return `<li class="account" data-id="${item.id}">
               <a href="#">
                 <span>${item.name}</span> /
                 <span>${item.sum} ₽</span>
               </a>
             </li>`;
  }

  renderItem(item) {
    this.element.insertAdjacentHTML('beforeEnd', this.getAccountHTML(item));
  }
}
