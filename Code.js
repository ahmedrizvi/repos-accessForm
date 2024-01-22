//var SPREADSHEET_FILE_ID = '1zIJKlwkODjoVbLOl3_PeopvBiXgdju7bAk8BaPi1caQ';
//var SHEET_NAME_TO_WRITE_DATA_TO = "Form Responses Test";
//var ADD_TIMESTAMP = true;

function doGet() {
  var template = HtmlService.createTemplateFromFile('index');

  // Build and return HTML in IFRAME sandbox mode.
  return template.evaluate()
    .setTitle('OTU Access Request Form')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
};

function searchBannerid(data){
  // Log the value for debugging
  console.log(data.bannerid);

  // Send data to the web service
  var options = {
    'method': 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify({bannerid: data.bannerid})
  };
  var response = UrlFetchApp.fetch('https://opossum-accurate-snake.ngrok-free.app/data', options);

  // Parse the JSON data retrieved from the web service
  var responseData = JSON.parse(response.getContentText());
  return responseData;
}

// handles form submission
function doPost(e) {
  // Get form data from the request parameters
  var formData = e.parameter;

  // Add timestamp for new submission
  if (ADD_TIMESTAMP) {
    formData.timestamp = new Date();
  }

  // Log the form data
  Logger.log(formData);

  // Send data to the web service
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(formData)
  };
  // Send data to the web service and capture response (Current URL for testing purposes)
  UrlFetchApp.fetch('https://opossum-accurate-snake.ngrok-free.app/data', options);

  // Write data to the spreadsheet
  //writeToSheet(formData);

  // Return a response to the user
  var formUrl = 'https://script.google.com/a/macros/ontariotechu.net/s/AKfycbwdvoGkB92U1rlLGOOx-EETkI2kXGzmHF7AXC_3UVQ/dev';
  var output = HtmlService.createHtmlOutput('<p>Form submitted successfully</p><button onclick="window.top.location.href=\'' + formUrl + '\'">Submit New Entry</button>');
  return output.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function writeToSheet(data) {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_FILE_ID);
  var targetSheet = sheet.getSheetByName(SHEET_NAME_TO_WRITE_DATA_TO);

  // Define the order of fields as they should appear in the spreadsheet
  var fields = ['timestamp', 'name', 'email', 'bannerid', 'issueReason', 'employeeStatus', 'positionTitle', 'proxNum', 'supervisorName', 'roomNumbers', 'roomType', 'activationDate', 'deactivationDate'];
  // Append the data to the sheet
  var values = fields.map(function (field) {
    // condition handles unvalidated fields
    return data[field] || '';
  });

  targetSheet.appendRow(values);
}