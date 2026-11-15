const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
        const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-expanded', String(!isExpanded));
        menuButton.setAttribute('aria-label', isExpanded ? 'Abrir menú' : 'Cerrar menú');
        navigation.classList.toggle('is-open', !isExpanded);
    });

    navigation.addEventListener('click', (event) => {
        if (event.target.closest('a')) {
            menuButton.setAttribute('aria-expanded', 'false');
            menuButton.setAttribute('aria-label', 'Abrir menú');
            navigation.classList.remove('is-open');
        }
    });
}

const form = document.querySelector('#talent-form');

if (form) {
    const errorSummary = document.querySelector('#form-errors');
    const errorList = errorSummary.querySelector('ul');
    const successMessage = document.querySelector('#form-success');
    const commentsField = form.elements.comments;
    const commentsCount = document.querySelector('#comments-count');
    const clearButton = form.querySelector('#clear-form');
    const resetStatus = document.querySelector('#form-reset-status');
    const fieldErrors = {
        fullName: 'full-name-error',
        email: 'email-error',
        phone: 'phone-error',
        country: 'country-error',
        experience: 'experience-error',
        sector: 'sector-error',
        english: 'english-error',
        availability: 'availability-error',
        linkedin: 'linkedin-error',
        comments: 'comments-error',
        consent: 'consent-error'
    };

    function validateField(name) {
        const control = form.elements[name];
        const errorElement = document.getElementById(fieldErrors[name]);
        let message = '';

        switch (name) {
            case 'fullName': {
                const words = control.value.trim().split(/\s+/).filter((word) => /\p{L}/u.test(word));
                if (words.length < 2) message = 'El nombre debe contener al menos nombre y apellido';
                break;
            }
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(control.value.trim()) || control.validity.typeMismatch) {
                    message = 'Ingresa un email válido (ejemplo: nombre@empresa.com)';
                }
                break;
            case 'phone':
                if (!/^\+[1-9]\d{7,14}$/.test(control.value.trim().replace(/[\s()-]/g, ''))) {
                    message = 'El teléfono debe incluir código de país (ejemplo: +34 612 345 678)';
                }
                break;
            case 'country':
                if (!control.value) message = 'Selecciona tu país de residencia';
                break;
            case 'experience': {
                const years = control.value;
                if (years === '' || !Number.isInteger(Number(years)) || Number(years) < 0 || Number(years) > 50) {
                    message = 'Los años de experiencia deben estar entre 0 y 50';
                }
                break;
            }
            case 'sector':
                if (!control.value) message = 'Selecciona el sector de tu interés';
                break;
            case 'english':
                if (!control.value) message = 'Indica tu nivel de inglés';
                break;
            case 'availability':
                if (!form.querySelector('input[name="availability"]:checked')) message = 'Selecciona tu disponibilidad';
                break;
            case 'linkedin':
                if (control.value.trim()) {
                    try {
                        const profileUrl = new URL(control.value.trim());
                        if (!['http:', 'https:'].includes(profileUrl.protocol)) {
                            message = 'Si incluyes LinkedIn, debe ser una URL válida';
                        }
                    } catch {
                        message = 'Si incluyes LinkedIn, debe ser una URL válida';
                    }
                }
                break;
            case 'comments':
                if (control.value.length > 500) {
                    message = `Los comentarios no pueden exceder 500 caracteres (quedan ${control.value.length - 500})`;
                }
                break;
            case 'consent':
                if (!control.checked) message = 'Debes aceptar la política de tratamiento de datos para continuar';
                break;
        }

        errorElement.textContent = message;
        if (name === 'availability') {
            form.querySelector('fieldset[aria-describedby="availability-error"]').setAttribute('aria-invalid', String(Boolean(message)));
        } else {
            control.setAttribute('aria-invalid', String(Boolean(message)));
        }
        return message;
    }

    function updateErrorSummary() {
        const invalidFields = Object.entries(fieldErrors)
            .map(([name, errorId]) => ({ name, message: document.getElementById(errorId).textContent }))
            .filter((field) => field.message);

        errorList.replaceChildren(...invalidFields.map(({ name, message }) => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            const targetId = name === 'fullName' ? 'full-name' : name;
            link.href = `#${targetId}`;
            link.textContent = message;
            item.append(link);
            return item;
        }));
        errorSummary.hidden = invalidFields.length === 0;
    }

    function updateCommentsCount() {
        const remaining = 500 - commentsField.value.length;
        commentsCount.textContent = remaining >= 0 ? `${remaining} caracteres restantes` : `${Math.abs(remaining)} caracteres excedidos`;
        commentsCount.classList.toggle('character-count--limit', remaining < 0);
    }

    clearButton.addEventListener('click', () => {
        form.reset();
        Object.values(fieldErrors).forEach((errorId) => {
            document.getElementById(errorId).textContent = '';
        });
        form.querySelectorAll('[aria-invalid]').forEach((control) => control.removeAttribute('aria-invalid'));
        errorList.replaceChildren();
        errorSummary.hidden = true;
        updateCommentsCount();
        resetStatus.textContent = 'Formulario limpiado.';
    });

    form.addEventListener('input', (event) => {
        const name = event.target.name;
        if (fieldErrors[name] && (event.target.getAttribute('aria-invalid') === 'true' || !errorSummary.hidden)) {
            validateField(name);
            updateErrorSummary();
        }
        if (event.target === commentsField) updateCommentsCount();
    });

    form.addEventListener('change', (event) => {
        const name = event.target.name;
        if (fieldErrors[name] && (event.target.getAttribute('aria-invalid') === 'true' || !errorSummary.hidden)) {
            validateField(name);
            updateErrorSummary();
        }
    });

    form.addEventListener('blur', (event) => {
        const name = event.target.name;
        if (fieldErrors[name] && event.target.getAttribute('aria-invalid') === 'true') {
            validateField(name);
            updateErrorSummary();
        }
    }, true);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const invalidEntries = Object.keys(fieldErrors)
            .map((name) => ({ name, message: validateField(name) }))
            .filter((field) => field.message);

        updateErrorSummary();
        if (invalidEntries.length > 0) {
            errorSummary.focus();
            return;
        }

        // Simulación local: no se envían ni persisten los datos del formulario.
        form.hidden = true;
        successMessage.hidden = false;
        successMessage.focus();
    });

    errorList.addEventListener('click', (event) => {
        const link = event.target.closest('a');
        if (!link) return;
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            event.preventDefault();
            target.focus();
        }
    });

    updateCommentsCount();
}