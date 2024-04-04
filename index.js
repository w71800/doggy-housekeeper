const express = require('express')
const app = express()
const port = 3001


//index.js
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

// 檢查TOKEN_PATH中是否存放refresh token
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

// 讀取CREDENTIALS_PATH中的Credentials進行驗證，產生refresh token並放進TOKEN_PATH中
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

// 驗證：如果有refresh token，就用refresh token驗證製作access token；如果沒有就先產生refresh token
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

// index.js
async function createSheet (auth, title) {
  try {
    const service = google.sheets({ version: 'v4', auth })
    const resource = {
      properties: {
        title
      }
    }

    const spreadsheet = await service.spreadsheets.create({
      resource,
      fields: 'spreadsheetId'
    })
    console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`)
    return spreadsheet.data.spreadsheetId
  } catch (error) {
    console.log(error)
  }
}

async function run () {
  try {
    const auth = await authorize()
    const sheetId = await createSheet(auth, 'test')
  } catch (err) { console.error(err) }
}

run()

app.listen(port, () => {
  console.log(`Express server is running on port ${port}`)
})