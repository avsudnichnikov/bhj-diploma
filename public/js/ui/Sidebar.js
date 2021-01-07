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
    })
  }

  static initAuthLinks() {
    let registerBtn = document.querySelector('a.menu-item_register');
    let loginBtn = document.querySelector('a.menu-item_login');
    let logoutBtn = document.querySelector('a.menu-item_logout');

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
          App.setState( 'init' );
        }
      });
    });
  }
}
