document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const form = document.getElementById('invoice-form');
  const btnAddProduct = document.getElementById('btn-add-product');
  const productRowsContainer = document.getElementById('product-rows-container');

  // Input Fields to monitor
  const emisorNombre = document.getElementById('emisor-nombre');
  const emisorDireccion = document.getElementById('emisor-direccion');
  const emisorEmail = document.getElementById('emisor-email');
  const emisorTelefono = document.getElementById('emisor-telefono');

  const clienteNombre = document.getElementById('cliente-nombre');
  const clienteDireccion = document.getElementById('cliente-direccion');
  const clienteEmail = document.getElementById('cliente-email');

  const invoiceNumero = document.getElementById('invoice-numero');
  const invoiceFecha = document.getElementById('invoice-fecha');
  const invoiceTax = document.getElementById('invoice-tax');

  // PDF Preview elements
  const pdfEmisorNombre = document.getElementById('pdf-emisor-nombre');
  const pdfEmisorDireccion = document.getElementById('pdf-emisor-direccion');
  const pdfEmisorContact = document.getElementById('pdf-emisor-contact');

  const pdfInvoiceNumero = document.getElementById('pdf-invoice-numero');
  const pdfInvoiceFecha = document.getElementById('pdf-invoice-fecha');

  const pdfClienteNombre = document.getElementById('pdf-cliente-nombre');
  const pdfClienteDireccion = document.getElementById('pdf-cliente-direccion');
  const pdfClienteEmail = document.getElementById('pdf-cliente-email');

  const pdfItemsContainer = document.getElementById('pdf-items-container');
  const pdfSubtotal = document.getElementById('pdf-subtotal');
  const pdfTaxLabel = document.getElementById('pdf-tax-label');
  const pdfTaxValue = document.getElementById('pdf-tax-value');
  const pdfTotal = document.getElementById('pdf-total');

  // Set default date to today
  const today = new Date().toISOString().split('T')[0];
  invoiceFecha.value = today;

  // Counter to generate unique IDs for input rows
  let rowCounter = 0;

  // Helper to format currency
  function formatCurrency(value) {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  }

  // Helper to format date Spanish style
  function formatDate(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  // Create new product row in editor
  function createProductRow(name = '', quantity = 1, price = 0) {
    const rowId = `product-row-${rowCounter++}`;
    const rowDiv = document.createElement('div');
    rowDiv.className = 'product-row';
    rowDiv.id = rowId;

    rowDiv.innerHTML = `
      <div class="form-group" style="margin-bottom: 0;">
        <label for="${rowId}-name">Descripción</label>
        <input type="text" id="${rowId}-name" class="input-prod-name" placeholder="Ej. Diseño Web" value="${name}" required>
      </div>
      <div class="form-group" style="margin-bottom: 0;">
        <label for="${rowId}-qty">Cant.</label>
        <input type="number" id="${rowId}-qty" class="input-prod-qty" min="1" step="1" value="${quantity}" required>
      </div>
      <div class="form-group" style="margin-bottom: 0;">
        <label for="${rowId}-price">Precio (€)</label>
        <input type="number" id="${rowId}-price" class="input-prod-price" min="0" step="0.01" value="${price}" required>
      </div>
      <button type="button" class="btn-remove" title="Eliminar Concepto">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    `;

    // Add remove event
    rowDiv.querySelector('.btn-remove').addEventListener('click', () => {
      rowDiv.remove();
      updateInvoiceCalculations();
    });

    // Listen to changes inside the row inputs
    rowDiv.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', updateInvoiceCalculations);
    });

    productRowsContainer.appendChild(rowDiv);
    updateInvoiceCalculations();
  }

  // Update preview fields
  function updatePreviewFields() {
    pdfEmisorNombre.textContent = emisorNombre.value || 'Tu Empresa o Nombre';
    pdfEmisorDireccion.textContent = emisorDireccion.value || 'Dirección de Emisión';
    
    let contactInfo = [];
    if (emisorEmail.value) contactInfo.push(emisorEmail.value);
    if (emisorTelefono.value) contactInfo.push(emisorTelefono.value);
    pdfEmisorContact.textContent = contactInfo.join(' | ');

    pdfClienteNombre.textContent = clienteNombre.value || 'Nombre del Cliente';
    pdfClienteDireccion.textContent = clienteDireccion.value || 'Dirección del Cliente';
    pdfClienteEmail.textContent = clienteEmail.value || 'cliente@correo.com';

    pdfInvoiceNumero.textContent = invoiceNumero.value || 'N/A';
    pdfInvoiceFecha.textContent = formatDate(invoiceFecha.value);
  }

  // Calculate invoice sums and update preview table
  function updateInvoiceCalculations() {
    updatePreviewFields();

    // Clear previous rows in the PDF table
    pdfItemsContainer.innerHTML = '';

    const rows = productRowsContainer.querySelectorAll('.product-row');
    let subtotal = 0;

    rows.forEach(row => {
      const name = row.querySelector('.input-prod-name').value || 'Concepto sin nombre';
      const qty = parseInt(row.querySelector('.input-prod-qty').value) || 0;
      const price = parseFloat(row.querySelector('.input-prod-price').value) || 0;

      const itemTotal = qty * price;
      subtotal += itemTotal;

      // Add row to PDF table preview
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="col-desc">${escapeHTML(name)}</td>
        <td class="col-qty">${qty}</td>
        <td class="col-price">${formatCurrency(price)}</td>
        <td class="col-total">${formatCurrency(itemTotal)}</td>
      `;
      pdfItemsContainer.appendChild(tr);
    });

    // If table is empty, show a placeholder row
    if (rows.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td colspan="4" style="text-align: center; color: #94a3b8; font-style: italic; padding: 2rem 1rem;">
          Añade conceptos en el panel de la izquierda
        </td>
      `;
      pdfItemsContainer.appendChild(tr);
    }

    // Calculations
    const taxRate = parseFloat(invoiceTax.value) || 0;
    const taxValue = subtotal * (taxRate / 100);
    const totalValue = subtotal + taxValue;

    // Update summary values
    pdfSubtotal.textContent = formatCurrency(subtotal);
    pdfTaxLabel.textContent = `I.V.A. (${taxRate}%):`;
    pdfTaxValue.textContent = formatCurrency(taxValue);
    pdfTotal.textContent = formatCurrency(totalValue);
  }

  // Helper function to escape HTML string
  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Event Listeners for Live Preview updating
  const liveInputs = [
    emisorNombre, emisorDireccion, emisorEmail, emisorTelefono,
    clienteNombre, clienteDireccion, clienteEmail,
    invoiceNumero, invoiceFecha, invoiceTax
  ];

  liveInputs.forEach(input => {
    input.addEventListener('input', updateInvoiceCalculations);
  });

  btnAddProduct.addEventListener('click', () => {
    createProductRow('', 1, 0);
  });

  // Handle Form Submission and Generate PDF
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Browser native validation
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Additional validation: check if at least one product row exists and is valid
    const productRows = productRowsContainer.querySelectorAll('.product-row');
    if (productRows.length === 0) {
      alert('Debes añadir al menos un concepto en la factura.');
      return;
    }

    // Generate and Download PDF using html2pdf
    const element = document.getElementById('invoice-pdf-template');
    const filename = `${invoiceNumero.value || 'factura'}.pdf`;

    // html2pdf options
    const opt = {
      margin:       0,
      filename:     filename,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, scrollY: 0, scrollX: 0 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Execute PDF conversion
    html2pdf().set(opt).from(element).save();
  });

  // Initialize with some default products
  createProductRow('Servicio de Consultoría de Marca', 1, 450.00);
  createProductRow('Diseño y maquetación de Landing Page', 1, 850.00);
  createProductRow('Configuración de Dominio y Servidor Cloud', 2, 75.00);

});
