// Paste this entire script into Google Apps Script (Extensions → Apps Script)
// Then click Deploy → New Deployment → Web App
// Set "Execute as" = Me, "Who has access" = Anyone
// Copy the Web App URL and set it as APPS_SCRIPT_URL in Vercel env vars

const SHEET_NAME = 'Sheet1';

const HEADERS = [
  'Submitted At',
  'Full Name',
  'Email',
  'Phone',
  'Date of Birth',
  'City',
  'State',
  'Country',
  'Gender',
  'LinkedIn URL',
  'Portfolio URL',
  'Qualification',
  'Degree / Course',
  'College / University',
  'Year of Study',
  'Graduation Year',
  'Primary Role',
  'Second Role Preference',
  'Why Desgnea',
  'Why This Role',
  'Career Goals',
  'Communication Skills (1-10)',
  'Problem Solving (1-10)',
  'Teamwork (1-10)',
  'What Makes You Different',
  'Previous Internship',
  'Worked with Clients',
  'Freelanced',
  'Worked Remotely',
  'Previous Experience',
  'Project Links',
  'Daily Hours Available',
  'Available 8 Weeks',
  'Start Date',
  'Preferred Working Hours',
  'Role Q1',
  'Role Q2',
  'Role Q3',
  'Role Q4',
  'Assessment Answer',
  'Why Select You',
  'Internship Expectations',
  'Skills to Develop',
  'Comfortable with Feedback',
  'Comfortable with Meetings',
  'Anything Else',
];

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();

    // Write header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      // Bold the header row
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    const data = JSON.parse(e.postData.contents);

    const row = [
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      data.fullName || '',
      data.email || '',
      data.phone || '',
      data.dob || '',
      data.city || '',
      data.state || '',
      data.country || '',
      data.gender || '',
      data.linkedin || '',
      data.portfolio || '',
      data.qualification || '',
      data.degree || '',
      data.college || '',
      data.yearOfStudy || '',
      data.graduationYear || '',
      data.primaryRole || '',
      data.secondRole || '',
      data.whyDesgnea || '',
      data.whyRole || '',
      data.careerGoals || '',
      data.commSkills || '',
      data.problemSolving || '',
      data.teamwork || '',
      data.whatMakesDifferent || '',
      data.prevInternship || '',
      data.workedClients || '',
      data.freelanced || '',
      data.workedRemotely || '',
      data.prevExperience || '',
      data.projectLinks || '',
      data.dailyHours || '',
      data.available8Weeks || '',
      data.startDate || '',
      data.preferredHours || '',
      data.roleQ1 || '',
      data.roleQ2 || '',
      data.roleQ3 || '',
      data.roleQ4 || '',
      data.assessmentAnswer || '',
      data.whySelectYou || '',
      data.internshipExpectations || '',
      data.skillsToDevelop || '',
      data.comfortableFeedback || '',
      data.comfortableMeetings || '',
      data.anythingElse || '',
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test this function manually in Apps Script to verify the sheet connection
function testConnection() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();
  Logger.log('Connected to sheet: ' + sheet.getName());
  Logger.log('Current rows: ' + sheet.getLastRow());
}
