// ADVERTENCIA DE SEGURIDAD: Cargar credenciales directamente en el frontend es inseguro.
// Esto es solo para fines de demostración/prototipo.
// En una aplicación real, la autenticación debe manejarse en un backend seguro.

// Función asíncrona para manejar el inicio de sesión
async function handleLogin() {
    // Obtener valores de los campos
    const codigo = document.getElementById('codigo').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error-message');

    // Validar que ambos campos estén completos
    if (!codigo || !password) {
        errorMessage.textContent = "Por favor, ingrese su código y contraseña";
        animateError(errorMessage);
        return;
    }

    // Validar el formato del código (supongamos que debe ser numérico de 10 dígitos)
    if (!/^\d{10}$/.test(codigo)) {
        errorMessage.textContent = "El código debe tener 10 dígitos numéricos";
        animateError(errorMessage);
        return;
    }

    // --- Cargar y verificar usuarios desde JSON ---
    try {
        const response = await fetch('database/classrooms.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const usuarios = await response.json();

        // Buscar al usuario por código estudiantil
        const usuarioEncontrado = usuarios.find(user => user.codigoEstudiantil === codigo);

        // Verificar si el usuario existe
        if (!usuarioEncontrado) {
            errorMessage.textContent = "El código ingresado no existe en nuestro sistema";
            animateError(errorMessage);
            return;
        }

        // Verificar la contraseña
        if (usuarioEncontrado.contrasena !== password) {
            errorMessage.textContent = "La contraseña es incorrecta";
            animateError(errorMessage);
            return;
        }

        // Si llegamos aquí, el login es exitoso

        // Guardar información del usuario en sessionStorage (código y nombre)
        sessionStorage.setItem('usuarioActual', JSON.stringify({
            codigo: codigo,
            nombre: usuarioEncontrado.nombre, // Guardamos el nombre encontrado
            ultimoLogin: new Date().toISOString()
        }));

    } catch (error) {
        console.error("Error al cargar o procesar datos de usuarios:", error);
        errorMessage.textContent = "Error al intentar iniciar sesión. Intente más tarde.";
        animateError(errorMessage);
        return;
    }
    // --- Fin de carga y verificación desde JSON ---

    // Mostrar mensaje de éxito y redireccionar
    errorMessage.textContent = "Inicio de sesión exitoso, redirigiendo...";
    errorMessage.style.color = "#27ae60"; // Color verde para éxito

    // Simular carga antes de redireccionar
    const loginButton = document.querySelector('.login-button');
    loginButton.disabled = true;
    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';

    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 1500);
}

// Función para animar el mensaje de error
function animateError(element) {
    element.style.color = "#e74c3c"; // Color rojo para error
    element.style.animation = "shake 0.5s";
    setTimeout(() => {
        element.style.animation = "";
    }, 500);
}

// Detectar tecla Enter para iniciar sesión
document.addEventListener('DOMContentLoaded', function () {
    // Añadir listener para tecla Enter en los campos de input
    const inputs = document.querySelectorAll('.input-field');
    inputs.forEach(input => {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                handleLogin();
            }
        });
    });

    // Inicializar tooltips y popovers si estás usando Bootstrap
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Añadir animación CSS para el efecto de shake
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
});

// Función para mostrar/ocultar la contraseña
document.addEventListener('DOMContentLoaded', function () {
    const togglePassword = document.getElementById('toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', function () {
            const passwordInput = document.getElementById('password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Añadir funcionalidad a los enlaces adicionales
    const adminLogin = document.querySelector('.admin-login');
    if (adminLogin) {
        adminLogin.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = "LoginAdmin.html"; // Redirige a la página de inicio de sesión de administrador
        });
    }

    const guestView = document.querySelector('.guest-view');
    if (guestView) {
        guestView.addEventListener('click', function (e) {
            e.preventDefault();
            alert('Vista de disponibilidad pública en desarrollo. Por favor intente más tarde.');
        });
    }

    const forgotPassword = document.querySelector('.forgot-password');
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function (e) {
            e.preventDefault();
            alert('La recuperación de contraseña está en desarrollo. Por favor contacte a soporte técnico.');
        });
    }

    const helpLink = document.querySelector('.help-link');
    if (helpLink) {
        helpLink.addEventListener('click', function (e) {
            e.preventDefault();
            alert('El centro de ayuda está en desarrollo. Por favor contacte a soporte técnico.');
        });
    }
});
