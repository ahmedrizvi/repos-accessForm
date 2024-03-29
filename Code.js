///CONSTANTS///
const ADD_TIMESTAMP = true;

// Function to pass in an object with bannerid
function searchBannerid(data) {
  // Logging for debugging
  console.log('server side searchBannerid function was called');
  console.log('bannerid in the passed data object\n', data.bannerid);

  // Send data to the web service
  var options = {
    'method': 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify({ bannerid: data.bannerid })
  };
  try {
    var response = UrlFetchApp.fetch('https://opossum-accurate-snake.ngrok-free.app/data', options);
    var statusCode = response.getResponseCode();
    var responseData = JSON.parse(response.getContentText());

    if (statusCode == 200) {
      console.log('here is the response data\n', responseData);
      return responseData;
    } else {
      console.log('An error occurred: ' + statusCode);
      return 'An error occurred: ' + statusCode;
    }
  } catch (error) {
    if (error.message.includes('404')) {
      return 'Not found';
    }
    else {
      console.log('Request failed: ' + error.message);
    }
  }
}

// Function to build the HTML form
function doGet() {
  var template = HtmlService.createTemplateFromFile('index');

  // Build and return HTML in IFRAME sandbox mode.
  return template.evaluate()
    .setTitle('OTU Access Request Form')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
};

// handles form submission
function doPost(e) {
  // Get form data from the request parameters
  var formData = e.parameter;

  // Add timestamp for new submission
  if (ADD_TIMESTAMP) {
    formData.timestamp = new Date();
  }

  // Log the form data (Logger is specific to Google Apps Script)
  console.log(formData);

  // Send data to the web service
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(formData)
  };
  // Send data to the web service and capture response (Current URL for testing purposes)
  UrlFetchApp.fetch('https://opossum-accurate-snake.ngrok-free.app/data', options);

  // Post success message and allow return to form for new entries
  var formUrl = 'https://script.google.com/a/macros/ontariotechu.net/s/AKfycbwdvoGkB92U1rlLGOOx-EETkI2kXGzmHF7AXC_3UVQ/dev';
  var output = HtmlService.createHtmlOutput('<p>Form submitted successfully</p><button onclick="window.top.location.href=\'' + formUrl + '\'">Submit New Entry</button>');
  return output.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}