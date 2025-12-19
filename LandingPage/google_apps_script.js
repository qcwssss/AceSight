function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  // Create header row if empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Email', 'Will Pay', 'Feature Interest']);
  }
  
  sheet.appendRow([
    data.timestamp || new Date(),
    data.email,
    data.willPay === true ? 'Yes' : 'No',
    data.featureInterest || ''
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
