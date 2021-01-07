class TransactionsWidget extends BaseWidget{
  registerEvents() {
    const newIncomeBtn = document.querySelector('.create-income-button');
    const newExpenseBtn = document.querySelector('.create-expense-button');

    newIncomeBtn.addEventListener('click', (event) => {
      event.preventDefault();
      App.getModal('newIncome').open();
    });

    newExpenseBtn.addEventListener('click', (event) => {
      event.preventDefault();
      App.getModal('newExpense').open();
    });
  }
}
