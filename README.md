# Certificate Generator Backend

This is a Node.js backend that generates certificates and sends them via email. It is designed to work with Google Forms via Webhooks.

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Configure Environment**:
    - Rename `.env.example` to `.env`.
    - Fill in your Email credentials (e.g., Gmail App Password).
    ```env
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASS=your-app-password
    PORT=3000
    ```

3.  **Start Server**:
    ```bash
    npm start
    ```
    (You may need to add `"start": "ts-node src/server.ts"` to package.json scripts, or run `npx ts-node src/server.ts`)

## Usage

### 1. Google Form Integration
1.  Open your Google Form.
2.  Go to **Script Editor** (Extensions > Apps Script).
3.  Copy the content of `google-script.js` into the editor.
4.  Update the `url` variable in the script to point to your deployed server (e.g., `https://your-domain.com/webhook`).
5.  Set up a Trigger:
    - Click on the clock icon (Triggers).
    - Add Trigger -> `onSubmit` -> Head -> From form -> On form submit.
6.  Save.

### 2. Admin API
You can use Postman or Curl to manage the app.

-   **Update Email Template**:
    -   `PUT /admin/email`
    -   Body (JSON): `{ "subject": "New Subject", "body": "New Body {name}" }`

-   **Update Certificate Template**:
    -   `POST /admin/template`
    -   Body (Form-Data): `template` (File upload, must be PNG)

## Development
-   Run `npx ts-node src/create_template.ts` to reset the certificate template.
-   Run `npx ts-node test-webhook.ts` to test the flow locally.
