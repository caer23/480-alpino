/**
 * COMPONENTE: AUTENTICACIÓN
 * Maneja el formulario de login y la UI de autenticación
 */

class AuthComponent {
    constructor() {
        this.form = document.getElementById('loginForm');
        if (!this.form) return;
        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupFormSubmit();
        this.setupLinks();

        // Si ya está autenticado, redirigir al perfil
        if (typeof authService !== 'undefined' && authService.estaAutenticado()) {
            window.location.href = 'user-profile.html';
        }
    }

    setupFormValidation() {
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');

        if (emailInput) {
            emailInput.addEventListener('blur', () => this.validarEmail(emailInput));
            emailInput.addEventListener('input', () => this.limpiarError(emailInput, 'emailError'));
        }

        if (passwordInput) {
            passwordInput.addEventListener('blur', () => this.validarPassword(passwordInput));
            passwordInput.addEventListener('input', () => this.limpiarError(passwordInput, 'passwordError'));
        }
    }

    setupFormSubmit() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });
    }

    setupLinks() {
        const forgotLink = document.getElementById('forgotLink');
        if (forgotLink) {
            forgotLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.mostrarAlerta('Te enviaremos las instrucciones a tu email. (Funcionalidad próximamente)', 'success');
            });
        }

        const registerLink = document.getElementById('registerLink');
        if (registerLink) {
            registerLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.mostrarAlerta('El registro estará disponible próximamente. Por ahora podés ingresar con cualquier email y contraseña (mín. 6 caracteres).', 'success');
            });
        }
    }

    async handleLogin() {
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        const rememberInput = document.getElementById('rememberMe');
        const btn = document.getElementById('loginBtn');

        // Limpiar estado anterior
        this.ocultarAlerta();

        const emailOk = this.validarEmail(emailInput);
        const passOk = this.validarPassword(passwordInput);
        if (!emailOk || !passOk) return;

        // Mostrar loading
        btn.classList.add('loading');
        btn.disabled = true;

        try {
            await authService.login(
                emailInput.value.trim(),
                passwordInput.value,
                rememberInput ? rememberInput.checked : false
            );
            // Redirigir a perfil
            window.location.href = 'user-profile.html';
        } catch (error) {
            this.mostrarAlerta(error.message || 'Error al iniciar sesión. Verificá tus datos.', 'error');
        } finally {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    }

    validarEmail(input) {
        if (!input) return false;
        const val = input.value.trim();
        const errorEl = document.getElementById('emailError');

        if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            input.classList.add('error');
            if (errorEl) errorEl.classList.add('visible');
            return false;
        }
        input.classList.remove('error');
        if (errorEl) errorEl.classList.remove('visible');
        return true;
    }

    validarPassword(input) {
        if (!input) return false;
        const val = input.value;
        const errorEl = document.getElementById('passwordError');

        if (!val || val.length < 6) {
            input.classList.add('error');
            if (errorEl) errorEl.classList.add('visible');
            return false;
        }
        input.classList.remove('error');
        if (errorEl) errorEl.classList.remove('visible');
        return true;
    }

    limpiarError(input, errorId) {
        if (input) input.classList.remove('error');
        const errorEl = document.getElementById(errorId);
        if (errorEl) errorEl.classList.remove('visible');
    }

    mostrarAlerta(mensaje, tipo = 'error') {
        const alert = document.getElementById('loginAlert');
        if (!alert) return;
        alert.textContent = mensaje;
        alert.className = `auth-alert ${tipo} visible`;
    }

    ocultarAlerta() {
        const alert = document.getElementById('loginAlert');
        if (alert) {
            alert.className = 'auth-alert error';
            alert.textContent = '';
        }
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AuthComponent();
    });
} else {
    new AuthComponent();
}
