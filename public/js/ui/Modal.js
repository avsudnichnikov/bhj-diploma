class Modal {
    constructor(element) {
        if (!element) {
            throw new Error('Не заданы обязательные аргументы');
        }
        this.element = element;
        this.registerEvents();
    }

    open() {
        this.element.style.display = 'block';

    }

    close() {
        this.element.style.display = '';
    }

    onClose() {
        return (event) => {
            event.preventDefault();
            this.close();
        }
    }

    registerEvents() {
        this.closeBtns = Array.from(this.element.querySelectorAll('button[data-dismiss="modal"]'));
        this.closeBtns.forEach((closeBtn) => {
            closeBtn.addEventListener('click', this.onClose());
        })
    }

    unregisterEvents() {
        this.closeBtns.forEach((closeBtn) => {
            closeBtn.removeEventListener('click', this.onClose());
        })
    }
}
