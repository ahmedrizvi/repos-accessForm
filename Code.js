var SPREADSHEET_FILE_ID = '1zIJKlwkODjoVbLOl3_PeopvBiXgdju7bAk8BaPi1caQ';
var SHEET_NAME_TO_WRITE_DATA_TO = "Form Responses Test";
var ADD_TIMESTAMP = true;

function doGet() {
  var template = HtmlService.createTemplateFromFile('index');

  // Build and return HTML in IFRAME sandbox mode.
  return template.evaluate()
      .setTitle('OTU Access Request Form')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
};

// handles form submission
function doPost(e){
  // Get form data from the request parameters
  var formData = e.parameter;

  // Check if termsCheck is not present or false
  if (formData.termsCheck === undefined || formData.termsCheck === 'false') {
    // Return a response indicating that terms need to be accepted
    return ContentService.createTextOutput("Form submission failed: You must accept the terms and conditions.");
  }

  // Add timestamp if required
  if (ADD_TIMESTAMP) {
    formData.timestamp = new Date();
  }

  // Write data to the spreadsheet
  writeToSheet(formData);

  // Return a response to the user
  return ContentService.createTextOutput("Form submitted successfully");
}

function writeToSheet(data){
  var sheet = SpreadsheetApp.openById(SPREADSHEET_FILE_ID);
  var targetSheet = sheet.getSheetByName(SHEET_NAME_TO_WRITE_DATA_TO);

  // Define the order of fields as they should appear in the spreadsheet
  var fields = ['timestamp', 'name', 'email', 'bannerid', 'issueReason', 'employeeStatus', 'positionTitle', 'existingUcard', 'roomNumbers', 'roomType', 'activationDate', 'deactivationDate'];
  // Append the data to the sheet
  var values = fields.map(function(field){
    // condition handles unvalidated fields
    return data[field] || '';
  });

  targetSheet.appendRow(values);
}

var LOG_GLOBAL = {};
