class AsyncForm {
  constructor(element) {
    if (!element) {
      throw new Error('Не заданы обязательные аргументы');
    }
    this.element = element;
    this.registerEvents();
  }

  registerEvents() {
    this.element.addEventListener('submit', (event) => {
      event.preventDefault();
      this.submit();
    });
  }

  getData() {
    return Object.fromEntries(new FormData(this.element));
  }

  onSubmit(options) {

  }

  submit() {
    const data = this.getData();
    this.onSubmit({ data });
  }
}
