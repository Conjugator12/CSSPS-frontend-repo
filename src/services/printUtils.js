/**
 * Print utilities for generating PDFs
 * Uses HTML-to-print approach via window.print()
 * Can be extended with external library like jsPDF or html2pdf
 */

/**
 * Generate Placement Slip PDF
 * @param {Object} placement - Placement data from backend
 * @param {Object} user - User/student data
 */
export const generatePlacementSlipPDF = async (placement, user) => {
  if (!placement?.school_name) {
    throw new Error("No placement data available");
  }

  const htmlContent = generatePlacementSlipHTML(placement, user);

  // Open in new window for printing
  const printWindow = window.open("", "_blank");
  if (!printWindow) throw new Error("Could not open print window");

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for content to load then print
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
};

/**
 * Generate Enrolment Form PDF
 * @param {Object} placement - Placement data from backend
 * @param {Object} user - User/student data
 */
export const generateEnrolmentFormPDF = async (placement, user) => {
  if (!placement?.school_name) {
    throw new Error("No placement data available");
  }

  const htmlContent = generateEnrolmentFormHTML(placement, user);

  // Open in new window for printing
  const printWindow = window.open("", "_blank");
  if (!printWindow) throw new Error("Could not open print window");

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for content to load then print
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
};

/**
 * Generate HTML content for Placement Slip
 */
function generatePlacementSlipHTML(placement, user) {
  const today = new Date().toLocaleDateString();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Placement Slip</title>
      <style>
        ${getPrintStyles()}
        .slip-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          background: white;
          border: 2px solid #333;
          page-break-after: always;
        }
        .slip-header {
          text-align: center;
          margin-bottom: 32px;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }
        .slip-header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
        }
        .slip-header p {
          margin: 4px 0 0 0;
          font-size: 12px;
          color: #666;
        }
        .slip-body {
          margin-top: 20px;
        }
        .slip-section {
          margin-bottom: 24px;
        }
        .slip-section h3 {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          color: #333;
          margin: 0 0 12px 0;
          border-bottom: 1px solid #ddd;
          padding-bottom: 8px;
        }
        .slip-row {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 20px;
          margin-bottom: 10px;
          font-size: 13px;
        }
        .slip-label {
          font-weight: 600;
          color: #333;
        }
        .slip-value {
          color: #666;
        }
        .slip-footer {
          margin-top: 40px;
          border-top: 2px solid #333;
          padding-top: 20px;
          text-align: center;
          font-size: 11px;
          color: #666;
        }
        .print-date {
          text-align: right;
          font-size: 11px;
          color: #999;
          margin-top: 20px;
        }
        @media print {
          body { margin: 0; padding: 0; }
          .slip-container { border: none; padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="slip-container">
        <div class="slip-header">
          <h1>CSSPS PLACEMENT SLIP</h1>
          <p>Computerised Schools Selection And Placement System</p>
        </div>
        
        <div class="slip-body">
          <div class="slip-section">
            <h3>Candidate Information</h3>
            <div class="slip-row">
              <span class="slip-label">Name:</span>
              <span class="slip-value">${user?.name || "—"}</span>
            </div>
            <div class="slip-row">
              <span class="slip-label">Index Number:</span>
              <span class="slip-value">${placement?.index_number || user?.index_number || "—"}</span>
            </div>
            <div class="slip-row">
              <span class="slip-label">Date of Birth:</span>
              <span class="slip-value">${user?.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : "—"}</span>
            </div>
          </div>

          <div class="slip-section">
            <h3>Placement Details</h3>
            <div class="slip-row">
              <span class="slip-label">Senior High School:</span>
              <span class="slip-value">${placement?.school_name || "—"}</span>
            </div>
            <div class="slip-row">
              <span class="slip-label">School Code:</span>
              <span class="slip-value">${placement?.school_code || "—"}</span>
            </div>
            <div class="slip-row">
              <span class="slip-label">Programme:</span>
              <span class="slip-value">${placement?.program || "—"}</span>
            </div>
            <div class="slip-row">
              <span class="slip-label">Choice Given:</span>
              <span class="slip-value">${placement?.choice_given ? "Choice " + placement.choice_given : "—"}</span>
            </div>
            <div class="slip-row">
              <span class="slip-label">Placement Year:</span>
              <span class="slip-value">${placement?.placement_year || "—"}</span>
            </div>
            <div class="slip-row">
              <span class="slip-label">Status:</span>
              <span class="slip-value">${placement?.status || "PLACED"}</span>
            </div>
          </div>

          <div class="slip-footer">
            <p style="margin: 0;">This is an official placement document. Please keep it safe and present it at your school.</p>
            <p style="margin: 8px 0 0 0;">For inquiries, contact the CSSPS helpline: 020 733 7515</p>
          </div>

          <div class="print-date">
            <strong>Printed on:</strong> ${today}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate HTML content for Enrolment Form
 */
function generateEnrolmentFormHTML(placement, user) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Enrolment Form</title>
      <style>
        ${getPrintStyles()}
        .form-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px;
          background: white;
          font-size: 12px;
          line-height: 1.6;
        }
        .form-header {
          text-align: center;
          margin-bottom: 32px;
          border-bottom: 3px solid #333;
          padding-bottom: 20px;
        }
        .form-header h1 {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
        }
        .form-header p {
          margin: 4px 0 0 0;
          font-size: 11px;
          color: #666;
        }
        .form-section {
          margin-bottom: 28px;
          border: 1px solid #ddd;
          padding: 16px;
          border-radius: 4px;
        }
        .form-section h3 {
          margin: 0 0 16px 0;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          color: #333;
          border-bottom: 2px solid #ddd;
          padding-bottom: 8px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 14px;
        }
        .form-row.full {
          grid-template-columns: 1fr;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .form-label {
          font-weight: 600;
          margin-bottom: 4px;
          color: #333;
          font-size: 11px;
          text-transform: uppercase;
        }
        .form-input {
          border: 1px solid #999;
          padding: 8px;
          font-size: 11px;
          min-height: 20px;
          font-family: Arial, sans-serif;
        }
        .form-input.tall {
          min-height: 60px;
          vertical-align: top;
        }
        .checkbox-group {
          display: flex;
          gap: 16px;
        }
        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
        }
        .checkbox-item input[type="checkbox"] {
          width: 14px;
          height: 14px;
        }
        .signature-line {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
          margin-top: 32px;
        }
        .signature-box {
          border-top: 1px solid #333;
          padding-top: 8px;
          text-align: center;
        }
        .signature-label {
          font-size: 10px;
          font-weight: 600;
        }
        @media print {
          body { margin: 0; padding: 0; }
          .form-container { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="form-container">
        <div class="form-header">
          <h1>CSSPS Student Enrolment Form</h1>
          <p>Computerised Schools Selection And Placement System</p>
        </div>

        <div class="form-section">
          <h3>Student Information</h3>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <div class="form-input">${user?.name || ""}</div>
            </div>
            <div class="form-group">
              <label class="form-label">Index Number</label>
              <div class="form-input">${placement?.index_number || user?.index_number || ""}</div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Date of Birth</label>
              <div class="form-input">${user?.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : ""}</div>
            </div>
            <div class="form-group">
              <label class="form-label">Gender</label>
              <div class="form-input">${user?.gender || ""}</div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Placement Details</h3>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Senior High School</label>
              <div class="form-input">${placement?.school_name || ""}</div>
            </div>
            <div class="form-group">
              <label class="form-label">School Code</label>
              <div class="form-input">${placement?.school_code || ""}</div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Programme</label>
              <div class="form-input">${placement?.program || ""}</div>
            </div>
            <div class="form-group">
              <label class="form-label">Choice Given</label>
              <div class="form-input">${placement?.choice_given ? "Choice " + placement.choice_given : ""}</div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Declaration</h3>
          <div class="form-row full">
            <div class="form-group">
              <label class="form-label">I hereby acknowledge that I will enrol at the above-mentioned school</label>
              <div style="margin-top: 12px;">
                <div class="checkbox-item">
                  <input type="checkbox">
                  <span>I agree to the terms and conditions of enrolment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Official Use Only</h3>
          <div class="form-row full">
            <div class="form-group">
              <label class="form-label">Notes/Remarks</label>
              <div class="form-input tall"></div>
            </div>
          </div>
        </div>

        <div class="signature-line">
          <div class="signature-box">
            <div style="height: 40px;"></div>
            <div class="signature-label">Student Signature</div>
            <div style="font-size: 10px; margin-top: 4px;">Date: ___________</div>
          </div>
          <div class="signature-box">
            <div style="height: 40px;"></div>
            <div class="signature-label">Parent/Guardian</div>
            <div style="font-size: 10px; margin-top: 4px;">Date: ___________</div>
          </div>
          <div class="signature-box">
            <div style="height: 40px;"></div>
            <div class="signature-label">School Official</div>
            <div style="font-size: 10px; margin-top: 4px;">Date: ___________</div>
          </div>
        </div>

        <div style="margin-top: 32px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ddd; padding-top: 16px;">
          <p style="margin: 0;">
            For inquiries: CSSPS Helpline - Tel: 020 733 7515<br>
            Official Document - Please keep a copy for your records
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Open in new window for printing
  const printWindow = window.open("", "_blank");
  if (!printWindow) throw new Error("Could not open print window");

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for content to load then print
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}
/**
 * Common print styles
 */
function getPrintStyles() {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html, body {
      font-family: Arial, 'Helvetica Neue', sans-serif;
      color: #333;
      background: white;
    }
    @media print {
      body {
        margin: 0;
        padding: 0;
      }
    }
  `;
}
