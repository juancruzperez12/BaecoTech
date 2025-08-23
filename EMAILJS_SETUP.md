# Configuración de EmailJS para el Formulario de Contacto

## Pasos para configurar EmailJS:

### 1. Crear cuenta en EmailJS

1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Regístrate para obtener una cuenta gratuita
3. Confirma tu email

### 2. Configurar un servicio de email

1. En el dashboard de EmailJS, ve a "Email Services"
2. Haz clic en "Add New Service"
3. Selecciona tu proveedor de email (Gmail, Outlook, etc.)
4. Conecta tu cuenta de email
5. Guarda el servicio y copia el **Service ID**

### 3. Crear una plantilla de email

1. Ve a "Email Templates"
2. Haz clic en "Create New Template"
3. Usa esta plantilla como base:

```html
Nuevo mensaje de contacto desde BAECO.TECH Nombre: {{nombre}} Email: {{email}}
Asunto: {{asunto}} Mensaje: {{mensaje}} --- Este mensaje fue enviado desde el
formulario de contacto de BAECO.TECH
```

4. Guarda la plantilla y copia el **Template ID**

### 4. Obtener tu User ID

1. Ve a "Account" en el menú
2. Copia tu **User ID**

### 5. Actualizar el código

En el archivo `emailjs-config.js`, reemplaza los siguientes valores:

```javascript
// Línea 4: Reemplaza 'TU_USER_ID' con tu User ID real
emailjs.init("TU_USER_ID");

// Línea 35: Reemplaza 'TU_SERVICE_ID' y 'TU_TEMPLATE_ID' con tus IDs reales
emailjs.send("TU_SERVICE_ID", "TU_TEMPLATE_ID", formData);
```

### Ejemplo de configuración completa:

```javascript
emailjs.init("user_abc123def456");
emailjs.send("service_xyz789", "template_contact_form", formData);
```

## Funcionalidades implementadas:

✅ **Formulario funcional** con validación HTML5
✅ **Mensajes de éxito y error** con animaciones
✅ **Indicador de carga** en el botón de envío
✅ **Limpieza automática** del formulario después del envío
✅ **Estilos responsivos** para los mensajes
✅ **Prevención de envíos múltiples** durante el proceso

## Notas importantes:

- **Cuenta gratuita**: EmailJS permite 200 emails por mes en el plan gratuito
- **Seguridad**: Los datos se envían de forma segura a través de EmailJS
- **Personalización**: Puedes modificar la plantilla de email según tus necesidades
- **Testing**: Prueba el formulario con tu email personal antes de publicar

## Solución de problemas:

1. **Error "Service not found"**: Verifica que el Service ID sea correcto
2. **Error "Template not found"**: Verifica que el Template ID sea correcto
3. **Error "User not found"**: Verifica que el User ID sea correcto
4. **No se envían emails**: Revisa la consola del navegador para errores específicos

## Personalización adicional:

Puedes modificar los mensajes de éxito y error editando el HTML en `contacto.html`:

```html
<div id="successMessage" class="success-message" style="display: none;">
  <p>¡Mensaje enviado con éxito! Te responderemos pronto.</p>
</div>

<div id="errorMessage" class="error-message" style="display: none;">
  <p>Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.</p>
</div>
```
