class UserWidget extends BaseWidget{
  update() {
    const user = User.current();
    if (user) {
      this.element.querySelector('.user-name').textContent = user.name;
    }
  }
}
