class FormField extends HTMLElement {
    static get observedAttributes() {
        return ['label', 'name', 'type', 'shape', 'required'];
    }
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        // Se clona el template que se creó en la propiedad estatica y se añade al shadow DOM.
        // Esto se hace una sola vez para evitar re-renderizados innecesarios.
        this.shadowRoot.appendChild(FormField.template.content.cloneNode(true));

        // Referencias únicas (solo se hacen una vez)
        this.$label = this.shadowRoot.querySelector('label');
        this.$input = this.shadowRoot.querySelector('input');
        this.$error = this.shadowRoot.querySelector('#error');
        this.$style = this.shadowRoot.querySelector('style');
    }

    connectedCallback() {
        this.update(); // Inicializa valores
        this.$input.addEventListener('blur', () => this.validar()); //Validacion al perder el foco.
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        this.updateAttr(name, newValue);
    }

    // Actualiza todo de una vez cuando se monta
    update() {
        this.updateAttr('label', this.getAttribute('label') || 'Nombre');
        this.updateAttr('name', this.getAttribute('name') || 'nombre');
        this.updateAttr('type', this.getAttribute('type') || 'text');
        this.updateAttr('shape', this.getAttribute('shape') || '0');
    }

    // Actualiza un atributo específico sin re-renderizar todo
    updateAttr(name, value) {
        switch (name) {
            case 'label':
                this.$label.textContent = value;
                this.$label.setAttribute('for', this.formatId(value));
                this.$input.id = this.formatId(value);
                break;
            case 'name':
                this.$input.name = value;
                break;
            case 'type':
                this.$input.type = value;
                break;
            case 'shape':
                this.$style.textContent = this.styles(parseInt(value));
                break;
            case 'required':
                if (this.hasAttribute('required')) {
                    this.$input.setAttribute('required', '');
                } else {
                    this.$input.removeAttribute('required');
                }
                break;
        }
    }
    // Formatea el ID del input basado en el label
    formatId(label) {
        return label.split(' ').join('_').toLowerCase().trim();
    }

    styles(shape) {
        const base = /* css */ `
            *,
            *::before,
            *::after {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
                font: inherit;
            }
            .form-field {
                display: flex;
                flex-wrap: wrap;
                gap: 0.125rem;
            }
            #error {
                text-align: end;
                color: hsl(0, 100%, 74%);
            }
        `;
        // Dependiendo del shape se aplican ciertos estilos
        return shape === 0
            ? base + `.form-field label { flex: 1; } .form-field input { inline-size: 100%; } #error { flex: 1; }`
            : base + `.form-field {flex-wrap: nowrap} #error { order: 3; }`;
    }

    validar() {
        const valor = this.$input.value.trim();
        if (this.hasAttribute('required') && !valor) {
            this.$error.textContent = `Valid ${this.$input.name} required`;
            return false;
        }
        this.$error.textContent = '';
        return true;
    }

    get valor() {
        return this.$input.value.trim();
    }
}

// Se asigna una propiedad estatica al componente para el template.
FormField.template = document.createElement('template');
// Se accede a la propiedad estatica anteriormente creada y se le asigna el contenido HTML.
FormField.template.innerHTML = /* html */ `
    <style></style>
    <p class="form-field">
        <label></label>
        <span id="error"></span>
        <input autocomplete="on">
    </p>
`;

customElements.define('form-field', FormField);


/* --------------- Pruebas ----------------------- */
/* const $formField = document.createElement('form-field');

$formField.setAttribute('label', 'Email');
$formField.setAttribute('name', 'email');
$formField.setAttribute('type', 'email');
$formField.setAttribute('required', '');

document.body.appendChild($formField); */

/* $formField.setAttribute('label', 'Telefono');
$formField.setAttribute('name', 'Telefono');
$formField.setAttribute('type', 'number');
$formField.setAttribute('shape', '0'); */


// console.log($formField.getAttribute('label'))