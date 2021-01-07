class AccountsWidget extends BaseWidget{
  constructor( element ) {
    super(element);
    this.update();
  }

  setDefaults() {
    this.currentAccountId = null;
  }

  registerEvents() {
    const createAccount = this.element.querySelector('.create-account ');
    createAccount.addEventListener('click', (e) => {
      e.preventDefault();
      let newAccount  = App.getModal('createAccount');
      newAccount.open();
    });

    this.element.addEventListener('click', (e) => {
      let item = e.target;
      if (item.closest('.account')) {
        this.onSelectAccount(item.closest('.account'));
      }
    });
  }

  update() {
    let user = User.current();

    if (user) {
      Account.list(user, (err, response) => {
        if (response.success) {
          this.clear();
          response.data.forEach((item) => this.renderItem(item));
        }
      });
    }
  }

  clear() {
    this.element.querySelectorAll('.account').forEach(item => item.remove());
  }

  onSelectAccount( element ) {
    if (this.currentAccountId) {
      let account = this.element.querySelector(`.account[data-id="${this.currentAccountId}"]`);
      if (account) {
        account.classList.remove('active');
      }
      else {
        this.currentAccountId = null;
      }
    }
    element.classList.add('active');
    this.currentAccountId = element.dataset.id;

    App.showPage( 'transactions', { account_id: this.currentAccountId});
  }

  getAccountHTML( item ) {
    return `<li class="account" data-id="${item.id}">
               <a href="#">
                 <span>${item.name}</span> /
                 <span>${item.sum} ₽</span>
               </a>
             </li>`;
  }

  renderItem( item ) {
    let accountHTML = this.getAccountHTML(item);
    this.element.insertAdjacentHTML('beforeEnd', accountHTML);
  }
}
