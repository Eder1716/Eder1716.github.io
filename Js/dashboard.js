// Ejecutar cuando el documento esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay un usuario en la sesión
    const usuarioActual = JSON.parse(sessionStorage.getItem('usuarioActual'));
    
    // Si no hay usuario, redirigir al login
    if (!usuarioActual) {
        alert('Debe iniciar sesión para acceder a esta página');
        window.location.href = 'index.html';
        return;
    }
    
    // Mostrar información del usuario
    const nombreUsuarioElement = document.getElementById('nombre-usuario');
    const codigoUsuarioElement = document.getElementById('codigo-usuario');
    
    if (nombreUsuarioElement && usuarioActual.nombre) {
        nombreUsuarioElement.textContent = usuarioActual.nombre;
    }
    
    if (codigoUsuarioElement && usuarioActual.codigo) {
        codigoUsuarioElement.textContent = usuarioActual.codigo;
    }
    
    // Funcionalidad para el botón de cerrar sesión
    const cerrarSesionBtn = document.getElementById('cerrar-sesion');
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', function() {
            // Limpiar datos de sesión
            sessionStorage.removeItem('usuarioActual');
            
            // Redirigir al login
            window.location.href = 'index.html';
        });
    }
    
    // Funcionalidad para solicitar salón
    const solicitarSalonBtn = document.getElementById('solicitar-salon');
    if (solicitarSalonBtn) {
        solicitarSalonBtn.addEventListener('click', function() {
            // Guardar en sessionStorage que estamos creando una nueva solicitud
            sessionStorage.setItem('accionActual', 'nuevaSolicitud');
            
            // Redirigir a la página de solicitud
            window.location.href = 'request.html';
        });
    }
    
    // Funcionalidad para ver mis solicitudes
    const misSolicitudesBtn = document.getElementById('mis-solicitudes');
    if (misSolicitudesBtn) {
        misSolicitudesBtn.addEventListener('click', function() {
            // Aquí puedes implementar la funcionalidad para ver las solicitudes
            // Por ahora, simplemente mostraremos un mensaje
            alert('Funcionalidad en desarrollo: Ver mis solicitudes');
            
            // Alternativa: redirigir a una página de solicitudes
            // window.location.href = 'mis-solicitudes.html';
        });
    }
    
    // Funcionalidad para ver disponibilidad
    const disponibilidadBtn = document.getElementById('disponibilidad');
    if (disponibilidadBtn) {
        disponibilidadBtn.addEventListener('click', function() {
            // Aquí puedes implementar la funcionalidad para ver la disponibilidad
            // Por ahora, simplemente mostraremos un mensaje
            alert('Funcionalidad en desarrollo: Ver disponibilidad de salones');
            
            // Alternativa: redirigir a una página de disponibilidad
            // window.location.href = 'disponibilidad.html';
        });
    }
    
    // Comprobar última actividad (para sesiones)
    const ultimaActividad = sessionStorage.getItem('ultimaActividad');
    const ahora = new Date().getTime();
    
    // Si han pasado más de 30 minutos (1800000 ms) desde la última actividad, cerrar sesión
    if (ultimaActividad && ahora - ultimaActividad > 1800000) {
        sessionStorage.removeItem('usuarioActual');
        sessionStorage.removeItem('ultimaActividad');
        alert('Su sesión ha expirado por inactividad');
        window.location.href = 'index.html';
    } else {
        // Actualizar el tiempo de última actividad
        sessionStorage.setItem('ultimaActividad', ahora);
    }
});

// Función para manejar solicitudes de salón (a implementar según tus necesidades)
function solicitarSalon() {
    window.location.href = 'request.html';
}