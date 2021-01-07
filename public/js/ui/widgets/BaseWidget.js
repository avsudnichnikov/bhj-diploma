class BaseWidget {
  constructor( element ) {
    if (!element) {
      throw new Error('Не заданы обязательные аргументы');
    }
    this.element = element;
    this.registerEvents();
  }

  registerEvents() {

  }
}
