// Configuración de usuarios administrativos (anteriormente estudiantes)
const usuariosAdministrativos = {
    // Formato: código: {password: "contraseña", nombre: "Nombre Completo"}
    "admin1": { password: "admin1", nombre: "Administrador 1" },
    "admin2": { password: "admin2", nombre: "Administrador 2" },
    "admin3": { password: "admin3", nombre: "Administrador 3" }
};

// Configuración de usuarios estudiantes (anteriormente administrativos)
const usuariosEstudiantes = {
    // Formato: código: {password: "contraseña", nombre: "Nombre Completo"}
    "2021116019": { password: "6019", nombre: "Dana Baquero" },
    "2021119013": { password: "9013", nombre: "Simanca Manca" },
    "2021116060": { password: "1234", nombre: "Eder Aguirre" }
};

// Función para manejar el inicio de sesión
function handleLogin() {
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

    // Validar el formato del código (puedes ajustar esto según tus necesidades)
    // Aquí puedes añadir validaciones específicas para códigos de administrador o estudiante

    // Verificar si el usuario es un administrador
    if (usuariosAdministrativos[codigo]) {
        if (usuariosAdministrativos[codigo].password === password) {
            // Inicio de sesión de administrador exitoso
            sessionStorage.setItem('usuarioActual', JSON.stringify({
                codigo: codigo,
                nombre: usuariosAdministrativos[codigo].nombre,
                rol: 'administrador',
                ultimoLogin: new Date().toISOString()
            }));
            redireccionarDashboard();
            return;
        }
    }

    // Verificar si el usuario es un estudiante
    if (usuariosEstudiantes[codigo]) {
        if (usuariosEstudiantes[codigo].password === password) {
            // Inicio de sesión de estudiante exitoso
            sessionStorage.setItem('usuarioActual', JSON.stringify({
                codigo: codigo,
                nombre: usuariosEstudiantes[codigo].nombre,
                rol: 'estudiante',
                ultimoLogin: new Date().toISOString()
            }));
            redireccionarDashboard();
            return;
        }
    }

    // Si llegamos aquí, el usuario no existe o la contraseña es incorrecta
    errorMessage.textContent = "Código o contraseña incorrectos";
    animateError(errorMessage);
}

// Función para redireccionar al dashboard según el rol
function redireccionarDashboard() {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = "Inicio de sesión exitoso, redirigiendo...";
    errorMessage.style.color = "#27ae60"; // Color verde para éxito

    const loginButton = document.querySelector('.login-button');
    loginButton.disabled = true;
    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';

    setTimeout(() => {
        const usuarioActual = JSON.parse(sessionStorage.getItem('usuarioActual'));
        if (usuarioActual && usuarioActual.rol === 'administrador') {
            window.location.href = "admin_dashboard.html"; // Redirige a dashboard de administrador
        } else {
            window.location.href = "dashboard.html"; // Redirige a dashboard de estudiante
        }
    }, 1500);
}

// ... (resto del código: animateError, listeners, etc.)

document.addEventListener('DOMContentLoaded', function () {
    // ... (listeners para inputs, tooltips, etc.)

    // Redirección del botón de acceso administrativo
    const adminLogin = document.querySelector('.admin-login');
    if (adminLogin) {
        adminLogin.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = "index.html"; // Redirige a index.html
        });
    }

    // ... (listeners para guestView, forgotPassword, helpLink)
});