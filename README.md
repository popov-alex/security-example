# Google Auth Example

This is a basic Node.js app demonstrating Google OAuth 2.0 authentication, using Express.js, Passport.js, and cookie-session.

## Setup

You need [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/).

1. **Clone the repository**:

```bash
git clone https://github.com/popov-alex/repo.git
cd repo

2. **Install the dependencies**:

npm install

3. **Create a .env file in the root directory of your project. Add the following environment variables**:

```bash
CLIENT_ID=<your google client id>
CLIENT_SECRET=<your google client secret>
COOKIE_KEY1=<your first cookie key>
COOKIE_KEY2=<your second cookie key>

4. **Start the server**:

npm start


The server runs on port 3000.

## Usage

Open your browser and navigate to http://localhost:3000.

Click on "Log in" and authenticate using your Google account.

Once logged in, you can access your personal secret by clicking "here is your secret".

To log out, click "Log out".

Important Note

This project uses HTTPS for secure communication. You will need to generate a self-signed certificate and key or use your own. The filenames should be server.cert and server.key, respectively. DO NOT commit these files to your repository. These should be securely transferred to the server through other means.
