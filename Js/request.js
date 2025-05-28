// request.js - Script para el formulario de solicitud de salón con EmailJS
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar EmailJS - REEMPLAZA "tu_user_id" con tu User ID real de EmailJS
    emailjs.init("oSfuUepL4f-rRbESq");
    
    // Referencias a elementos del DOM
    const requestForm = document.getElementById('request-form');
    const btnCancelar = document.getElementById('btn-cancelar');
    const btnEnviar = document.getElementById('btn-enviar');
    const nombreInput = document.getElementById('nombre');
    const codigoInput = document.getElementById('codigo');
    const emailInput = document.getElementById('email');
    const espacioSelect = document.getElementById('espacio');
    const fechaInput = document.getElementById('fecha');
    const horarioSelect = document.getElementById('horario');
    const motivoSelect = document.getElementById('motivo');
    const participantesInput = document.getElementById('participantes');
    const detallesTextarea = document.getElementById('detalles');
    const terminosCheckbox = document.getElementById('terminos');

    // Configurar fecha mínima (hoy)
    const today = new Date();
    const formatDate = date => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    fechaInput.min = formatDate(today);

    // Validación del correo electrónico institucional
    function validarCorreoInstitucional(email) {
        return email.endsWith('@unimagdalena.edu.co');
    }

    // Validación del código estudiantil
    function validarCodigoEstudiantil(codigo) {
        // El código debe ser numérico y tener 10 dígitos
        return /^\d{10}$/.test(codigo);
    }

    // Función para mostrar mensajes de error
    function mostrarError(elemento, mensaje) {
        // Eliminar mensaje de error anterior si existe
        const errorAnterior = elemento.parentElement.querySelector('.error-message');
        if (errorAnterior) {
            errorAnterior.remove();
        }

        // Crear y añadir nuevo mensaje de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = mensaje;
        elemento.parentElement.appendChild(errorDiv);
        
        // Añadir clase de error al input
        elemento.classList.add('input-error');
    }

    // Función para eliminar mensajes de error
    function eliminarError(elemento) {
        const errorMsg = elemento.parentElement.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
        elemento.classList.remove('input-error');
    }

    // Validar formulario completo
    function validarFormulario() {
        let esValido = true;

        // Validar nombre
        if (nombreInput.value.trim() === '') {
            mostrarError(nombreInput, 'Por favor ingrese su nombre completo');
            esValido = false;
        } else {
            eliminarError(nombreInput);
        }

        // Validar código estudiantil
        if (!validarCodigoEstudiantil(codigoInput.value)) {
            mostrarError(codigoInput, 'El código estudiantil debe tener 10 dígitos');
            esValido = false;
        } else {
            eliminarError(codigoInput);
        }

        // Validar email
        if (!validarCorreoInstitucional(emailInput.value)) {
            mostrarError(emailInput, 'Debe usar un correo institucional (@unimagdalena.edu.co)');
            esValido = false;
        } else {
            eliminarError(emailInput);
        }

        // Validar selección de espacio
        if (espacioSelect.value === '') {
            mostrarError(espacioSelect, 'Seleccione un tipo de espacio');
            esValido = false;
        } else {
            eliminarError(espacioSelect);
        }

        // Validar fecha
        if (fechaInput.value === '') {
            mostrarError(fechaInput, 'Seleccione una fecha');
            esValido = false;
        } else {
            const fechaSeleccionada = new Date(fechaInput.value);
            if (fechaSeleccionada < today) {
                mostrarError(fechaInput, 'La fecha no puede ser anterior a hoy');
                esValido = false;
            } else {
                eliminarError(fechaInput);
            }
        }

        // Validar horario
        if (horarioSelect.value === '') {
            mostrarError(horarioSelect, 'Seleccione un horario');
            esValido = false;
        } else {
            eliminarError(horarioSelect);
        }

        // Validar motivo
        if (motivoSelect.value === '') {
            mostrarError(motivoSelect, 'Seleccione un motivo');
            esValido = false;
        } else {
            eliminarError(motivoSelect);
        }

        // Validar número de participantes
        if (participantesInput.value === '' || parseInt(participantesInput.value) < 1) {
            mostrarError(participantesInput, 'Ingrese un número válido de participantes');
            esValido = false;
        } else {
            eliminarError(participantesInput);
        }

        // Validar términos y condiciones
        if (!terminosCheckbox.checked) {
            mostrarError(terminosCheckbox, 'Debe aceptar los términos y condiciones');
            esValido = false;
        } else {
            eliminarError(terminosCheckbox);
        }

        return esValido;
    }

    // Event listeners para el formulario
    requestForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validarFormulario()) {
            // Mostrar indicador de carga
            btnEnviar.disabled = true;
            btnEnviar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            
            // Obtener los valores de texto de los select (no solo el value)
            const espacioTexto = espacioSelect.options[espacioSelect.selectedIndex].text;
            const horarioTexto = horarioSelect.options[horarioSelect.selectedIndex].text;
            const motivoTexto = motivoSelect.options[motivoSelect.selectedIndex].text;
            
            // Formatear la fecha para mejor legibilidad
            const fechaObj = new Date(fechaInput.value);
            const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
            });
            
            // Preparar los datos para el correo
            const templateParams = {
                nombre: nombreInput.value,
                codigo: codigoInput.value,
                email: emailInput.value,
                espacio: espacioTexto,
                fecha: fechaFormateada,
                horario: horarioTexto,
                motivo: motivoTexto,
                participantes: participantesInput.value,
                detalles: detallesTextarea.value || "No se proporcionaron detalles adicionales"
            };
            
            // Enviar el correo utilizando EmailJS
            emailjs.send('service_5xern2n', 'template_wu4b3en', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    mostrarMensajeExito('Solicitud enviada correctamente. Recibirá confirmación en su correo institucional.');
                    requestForm.reset();
                })
                .catch(function(error) {
                    console.error('FAILED...', error);
                    // Cambio implementado aquí: crear un div de error directamente
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'error-message';
                    errorDiv.textContent = 'Error al enviar la solicitud. Por favor intente nuevamente.';
                    btnEnviar.parentElement.appendChild(errorDiv);
                    
                    // Eliminar el mensaje después de 5 segundos
                    setTimeout(() => {
                        errorDiv.remove();
                    }, 5000);
                })
                .finally(function() {
                    // Restaurar el botón
                    btnEnviar.disabled = false;
                    btnEnviar.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Solicitud';
                });
        }
    });

    btnCancelar.addEventListener('click', function() {
        // Mostrar confirmación antes de cancelar
        if (confirm('¿Está seguro que desea cancelar la solicitud? Los datos ingresados se perderán.')) {
            // Redirigir a la página de inicio
            window.location.href = 'index.html';
        }
    });

    // Validación en tiempo real para campos específicos
    emailInput.addEventListener('blur', function() {
        if (this.value && !validarCorreoInstitucional(this.value)) {
            mostrarError(this, 'Debe usar un correo institucional (@unimagdalena.edu.co)');
        } else if (this.value) {
            eliminarError(this);
        }
    });

    codigoInput.addEventListener('blur', function() {
        if (this.value && !validarCodigoEstudiantil(this.value)) {
            mostrarError(this, 'El código estudiantil debe tener 10 dígitos');
        } else if (this.value) {
            eliminarError(this);
        }
    });

    participantesInput.addEventListener('input', function() {
        // Asegurar que el valor no exceda el máximo
        if (parseInt(this.value) > 200) {
            this.value = 200;
        }
    });

    // Función para mostrar mensaje de éxito
    function mostrarMensajeExito(mensaje) {
        // Crear elemento para el mensaje
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success';
        alertDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${mensaje}`;
        
        // Insertar antes del formulario
        requestForm.parentElement.insertBefore(alertDiv, requestForm);
        
        // Desplazarse hacia arriba para ver el mensaje
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Eliminar mensaje después de 5 segundos
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
});