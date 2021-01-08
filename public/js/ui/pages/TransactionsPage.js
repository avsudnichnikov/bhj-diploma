class TransactionsPage {
  constructor(element) {
    if (!element) {
      throw new Error('Не заданы обязательные аргументы');
    }
    this.element = element;
    this.registerEvents();
  }

  registerEvents() {
    this.element.addEventListener('click', (event) => {
      const removeAccountBtn = event.target.closest('.remove-account');
      if (removeAccountBtn) {
        this.removeAccount();
        event.preventDefault();
      }

      const transactionBtn = event.target.closest('.transaction__remove');
      if (transactionBtn) {
        const { id } = transactionBtn.dataset;
        this.removeTransaction(id);
        event.preventDefault();
      }
    });
  }

  render(options) {
    if (!options) {
      return;
    }
    this.lastOptions = options;
    Account.get(options.account_id, {}, (err, response) => {
      if (response && response.success) {
        this.renderTitle(response.data.name);
      } else {
        throw new Error(err);
      }
    });
    Transaction.list(options, (err, response) => {
      if (response && response.success) {
        this.renderTransactions(response.data);
      } else {
        throw new Error(err);
      }
    });
  }

  removeAccount() {
    if (!this.lastOptions) {
      return;
    }
    if (confirm('Вы действительно хотите удалить счёт?')) {
      Account.remove(this.lastOptions.account_id, {}, (err, response) => {
        if (response && response.success) {
          App.update();
        } else {
          throw new Error(err);
        }
      });
      this.clear();
    }
  }

  removeTransaction(id) {
    if (confirm('Вы действительно хотите удалить эту транзакцию?')) {
      Transaction.remove(id, {}, (err, response) => {
        if (response && response.success) {
          App.update();
        } else {
          throw new Error(err);
        }
      });
    }
  }

  update() {
    this.render(this.lastOptions);
  }

  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  }

  renderTitle(name) {
    this.element.querySelector('.content-title').textContent = name;
  }

  formatDate(date) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timezone: 'UTC',
    };
    return (new Date(date).toLocaleString('ru', options));
  }

  getTransactionHTML(item) {
    const itemDate = this.formatDate(item.created_at);
    return `<div class="transaction transaction_${item.type} row">
              <div class="col-md-7 transaction__details">
                <div class="transaction__icon">
                    <span class="fa fa-money fa-2x"></span>
                </div>
                <div class="transaction__info">
                    <h4 class="transaction__title">${item.name}</h4>
                    <div class="transaction__date">${itemDate}</div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="transaction__summ">
                    ${item.sum} <span class="currency">₽</span>
                </div>
              </div>
              <div class="col-md-2 transaction__controls">
                  <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                      <i class="fa fa-trash"></i>
                  </button>
              </div>
            </div>`;
  }

  renderTransactions(data) {
    const itemsHTML = data.reverse().map((item) => this.getTransactionHTML(item)).join('');

    const decorateTransactionsContent = (item) => `<div class="transactions-content">${item}</div>`;

    document.querySelector('.content').innerHTML = decorateTransactionsContent(itemsHTML);
  }
}
