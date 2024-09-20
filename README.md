# 📝 Notas-Crub - Extensión de Navegador

## Índice

1. [Descripción](#descripción)
2. [Características](#características)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Instalación](#instalación)
5. [Uso](#uso)
    - [Notas](#notas)
    - [Recordatorios](#recordatorios)
    - [Temas](#temas)
    - [Calculadora](#calculadora)
6. [Licencia](#licencia)
7. [Contribución de IA](#contribución-de-ia)

## Descripción

**Notas-Crub** es una extensión de navegador diseñada para facilitar la toma de notas, recordatorios y pequeñas tareas diarias con una interfaz amigable y simple. La extensión permite al usuario crear, gestionar y almacenar notas, establecer recordatorios con alertas sonoras, y organizar su información de forma intuitiva.

Esta herramienta fue desarrollada con la ayuda de inteligencia artificial 🤖, aprovechando capacidades automáticas para generar la mayoría del código, lo que ha permitido un proceso de desarrollo eficiente y rápido. Es una muestra de cómo la colaboración entre humanos y máquinas puede generar productos funcionales y útiles en el ámbito de la productividad digital.

## ✨ Características

- 📝 **Toma de notas**: Crea, edita y elimina notas de forma sencilla.
- ⏰ **Recordatorios**: Programa recordatorios que te notificarán mediante alertas visuales y sonoras.
- 🎨 **Temas personalizables**: Cambia la apariencia de la extensión con diferentes temas.
- 💾 **Gestión local**: Almacena tus notas y recordatorios directamente en el navegador sin necesidad de una conexión a internet.
- ➕ **Calculadora integrada**: Función para realizar cálculos rápidos sin salir de la aplicación.

## 📁 Estructura del Proyecto

La estructura del proyecto se organiza de la siguiente manera:

```
notas-crub/
│
├── css/
│   ├── alert.css
│   └── styles.css
│
├── icons/
│   ├── icon128.png
│   ├── icon16.png
│   └── icon64.png
│
├── images/
│   └── campana.png
│
├── js/
│   ├── calculator.js
│   ├── file-handler.js
│   ├── main.js
│   ├── notes.js
│   ├── reminder-alert.js
│   ├── reminders.js
│   ├── storage.js
│   ├── tabs.js
│   └── theme.js
│
├── alarm.mp3
├── manifest.json
├── popup.html
├── README.md
└── reminder-alert.html
```

## 🚀 Instalación

1. Clona o descarga este repositorio.
2. Ve a la página de **Extensiones** en tu navegador (normalmente: `chrome://extensions` o `about:addons`).
3. Activa el **modo de desarrollador** (si es necesario).
4. Haz clic en **Cargar extensión sin empaquetar** y selecciona la carpeta del proyecto.
5. ¡La extensión estará lista para usarse! 🎉

## 📚 Uso

### Notas

Abre la ventana emergente de la extensión para escribir, editar y gestionar tus notas.

### Recordatorios

Configura recordatorios en la ventana emergente de la extensión. Cuando se alcance la hora configurada, recibirás una alerta visual y sonora (incluida en `alarm.mp3`).

### Temas

Modifica el estilo visual de la extensión utilizando el archivo `theme.js` para ajustar el tema a tu preferencia.

### Calculadora

La extensión incluye una **calculadora integrada** que permite realizar operaciones básicas sin necesidad de salir de la ventana emergente. Solo ingresa tus operaciones directamente y obtén resultados al instante.

## 📄 Licencia

Este proyecto está licenciado bajo la licencia [MIT](https://opensource.org/licenses/MIT).

## 🤖 Contribución de IA

El desarrollo de esta extensión fue posible gracias a la colaboración de inteligencia artificial para generar un 90% del código. Esta herramienta muestra el potencial de la IA para acelerar el desarrollo y ofrecer soluciones prácticas.
