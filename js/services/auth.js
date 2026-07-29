/**
 * SERVICIO DE AUTENTICACIÓN
 * Gestiona la lógica de login/logout y sesión de usuario
 */

class AuthService {
    constructor() {
        this.storageKey = '480_usuario';
        this.tokenKey = '480_token';
        this.listeners = [];
    }

    /**
     * Simula un login contra una API
     * @param {string} email
     * @param {string} password
     * @param {boolean} recordar
     * @returns {Promise<Object>}
     */
    async login(email, password, recordar = false) {
        if (!email || !password) {
            throw new Error('Email y contraseña son requeridos');
        }

        if (!this.validarEmail(email)) {
            throw new Error('El formato del email no es válido');
        }

        if (password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        // Simulación de llamada a API (mock)
        await this.simularDelay(600);

        // Usuario mock para demostración
        const usuarioMock = {
            id: 1,
            nombre: 'Juan',
            apellido: 'Pérez',
            email: email,
            avatar: null,
            telefono: '',
            fechaRegistro: new Date().toISOString()
        };

        const token = this.generarToken();

        this.guardarSesion(usuarioMock, token, recordar);
        this.notificarCambios(usuarioMock);

        return usuarioMock;
    }

    /**
     * Cierra la sesión del usuario
     */
    logout() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.tokenKey);
        sessionStorage.removeItem(this.storageKey);
        sessionStorage.removeItem(this.tokenKey);
        this.notificarCambios(null);
    }

    /**
     * Obtiene el usuario actualmente autenticado
     * @returns {Object|null}
     */
    obtenerUsuario() {
        try {
            const data = localStorage.getItem(this.storageKey) || sessionStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    }

    /**
     * Verifica si hay una sesión activa
     * @returns {boolean}
     */
    estaAutenticado() {
        const token = localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
        const usuario = this.obtenerUsuario();
        return !!(token && usuario);
    }

    /**
     * Actualiza los datos del perfil del usuario
     * @param {Object} datos
     */
    actualizarPerfil(datos) {
        const usuario = this.obtenerUsuario();
        if (!usuario) throw new Error('No hay sesión activa');

        const usuarioActualizado = { ...usuario, ...datos };

        if (localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify(usuarioActualizado));
        } else {
            sessionStorage.setItem(this.storageKey, JSON.stringify(usuarioActualizado));
        }

        this.notificarCambios(usuarioActualizado);
        return usuarioActualizado;
    }

    /**
     * Guarda la sesión en el storage correspondiente
     */
    guardarSesion(usuario, token, recordar) {
        const storage = recordar ? localStorage : sessionStorage;
        storage.setItem(this.storageKey, JSON.stringify(usuario));
        storage.setItem(this.tokenKey, token);
    }

    /**
     * Genera un token simulado
     * @returns {string}
     */
    generarToken() {
        return 'tok_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    /**
     * Valida formato de email
     * @param {string} email
     * @returns {boolean}
     */
    validarEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /**
     * Simula un delay de red
     * @param {number} ms
     * @returns {Promise}
     */
    simularDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Suscribe un listener a cambios de autenticación
     * @param {Function} callback
     */
    suscribirse(callback) {
        this.listeners.push(callback);
    }

    /**
     * Notifica a los listeners de cambios en la sesión
     * @param {Object|null} usuario
     */
    notificarCambios(usuario) {
        this.listeners.forEach(cb => {
            try { cb(usuario); } catch (e) { console.error('Error en listener auth:', e); }
        });
    }
}

// Instancia global
const authService = new AuthService();
