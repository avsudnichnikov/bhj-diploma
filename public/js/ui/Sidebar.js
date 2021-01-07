class Sidebar {
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  static initToggleButton() {
    const sidebarMini = document.querySelector('.sidebar-mini');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    sidebarToggle.addEventListener('click', (event) => {
      event.preventDefault();
      sidebarMini.classList.toggle('sidebar-open');
      sidebarMini.classList.toggle('sidebar-collapse');
    });
  }

  static initAuthLinks() {
    const registerBtn = document.querySelector('.menu-item_register');
    const loginBtn = document.querySelector('.menu-item_login');
    const logoutBtn = document.querySelector('.menu-item_logout');

    registerBtn.addEventListener('click', (event) => {
      event.preventDefault();
      App.getModal('register').open();
    });

    loginBtn.addEventListener('click', (event) => {
      event.preventDefault();
      App.getModal('login').open();
    });

    logoutBtn.addEventListener('click', (event) => {
      event.preventDefault();
      User.logout({}, (err, response) => {
        if (response && response.success) {
          App.setState('init');
        }
      });
    });
  }
}
