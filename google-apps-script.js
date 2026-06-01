// Paste this entire script into Google Apps Script (Extensions → Apps Script)
// Then click Deploy → New Deployment → Web App
// Set "Execute as" = Me, "Who has access" = Anyone
// Copy the Web App URL and set it as APPS_SCRIPT_URL in Vercel env vars
//
// This single script handles two actions:
//   action = "upload" → saves file to Google Drive, returns the file URL
//   action = "submit" (default) → appends form data row to Google Sheet

const SHEET_NAME = 'Sheet1';

// Name of the Google Drive folder where CVs and design files will be saved.
// The folder will be created automatically if it doesn't exist.
const DRIVE_FOLDER_NAME = 'Desgnea Applications 2026';

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
  'Resume / CV (Drive Link)',
  'Design File (Drive Link)',
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

// ─── Main entry point ────────────────────────────────────────────────────────

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.action === 'upload') {
      return handleFileUpload(data);
    } else {
      return handleFormSubmit(data);
    }
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

// ─── File upload handler ──────────────────────────────────────────────────────

function handleFileUpload(data) {
  // data.fileName  — original file name
  // data.mimeType  — e.g. "application/pdf"
  // data.fileData  — base64-encoded file content

  if (!data.fileData || !data.fileName) {
    return jsonResponse({ success: false, error: 'Missing file data.' });
  }

  const folder = getOrCreateFolder(DRIVE_FOLDER_NAME);

  const blob = Utilities.newBlob(
    Utilities.base64Decode(data.fileData),
    data.mimeType || 'application/octet-stream',
    data.fileName
  );

  const file = folder.createFile(blob);

  // Make the file viewable by anyone with the link
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return jsonResponse({ success: true, fileUrl: file.getUrl(), fileId: file.getId() });
}

// ─── Form submit handler ──────────────────────────────────────────────────────

function handleFormSubmit(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();

  // Write header row if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

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
    data.resumeUrl || '',        // Google Drive link
    data.designFileUrl || '',    // Google Drive link (design role only)
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

  return jsonResponse({ success: true });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getOrCreateFolder(name) {
  const folders = DriveApp.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(name);
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Run this manually in Apps Script editor to verify everything is connected
function testConnection() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();
  Logger.log('Sheet: ' + sheet.getName() + ' | Rows: ' + sheet.getLastRow());
  const folder = getOrCreateFolder(DRIVE_FOLDER_NAME);
  Logger.log('Drive folder: ' + folder.getName() + ' | URL: ' + folder.getUrl());
}
