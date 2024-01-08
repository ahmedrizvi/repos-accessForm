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


function ll(a,b,c) { //This is for debugging purposes only
try{
  var args,data,i,ss,sh,thisVal;
  if (!a) return;
  
  if (LOG_GLOBAL.a !== true) {
    ss=SpreadsheetApp.openById('');
    sh=ss.getSheetByName('Sheet1');
    
    LOG_GLOBAL.a = true;
    LOG_GLOBAL.sh = sh;
    sh.clearContents();
  }

  args = [a,b,c];
  data = [];
  for (i=0;i<3;i++) {
    thisVal = args[i];
    if (thisVal === undefined && i > 0) {
      break;
    }
    if (thisVal === null) {thisVal = 'NULLLL';}
    if (thisVal === false) {thisVal = 'FALZZE';}
    if (thisVal === true) {thisVal = 'TREWWW';}
    data.push(thisVal);
  }

  LOG_GLOBAL.sh.appendRow(data);
  SpreadsheetApp.flush();
}catch(e){};
    
};
