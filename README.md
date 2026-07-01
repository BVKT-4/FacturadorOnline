# FacturaPro — Generador de Facturas en PDF

Una aplicación web interactiva, moderna y completamente del lado del cliente (sin servidor) para generar facturas profesionales en PDF y descargarlas directamente desde tu navegador de forma segura.

## Características

- **Diseño Premium**: Interfaz visual de alta gama estilo dashboard con tipografía optimizada, bordes redondeados y micro-interacciones interactivas.
- **Previsualización en Tiempo Real**: Edita los datos del emisor, cliente, impuestos o conceptos y observa de inmediato los cambios en el lienzo del PDF.
- **Conceptos Dinámicos**: Agrega o elimina productos, servicios y conceptos con recálculos automáticos de subtotal, IVA configurable y total neto al instante.
- **Logotipo Corporativo Embebido**: Logotipo corporativo de Rodrigo Bucketbranch integrado en formato Base64 para evitar bloqueos por políticas CORS en ejecución local.
- **Exportación A4 Perfecta**: Generación y formateo exacto a tamaño A4 con márgenes de visualización consistentes en PDF, gracias al uso de `html2pdf.js`.
- **Ejecución Local Segura**: No requiere base de datos ni backend. Se ejecuta localmente haciendo doble clic en el archivo HTML.

## Tecnologías Utilizadas

- **HTML5** semántico y accesible.
- **CSS3** moderno con variables y grillas responsivas.
- **JavaScript ES6** para el control interactivo y cálculos.
- **html2pdf.js** para la renderización y descarga del PDF.

## Instalación y Uso

1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Abre el archivo `index.html` en tu navegador favorito.
3. Completa los campos del formulario y presiona **Descargar PDF** para guardar tu factura formateada.
