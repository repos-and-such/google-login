const express = require('express')
const app = express()
const port = 3000
const axios = require('axios');
const {google} = require('googleapis');
const oauth2 = google.oauth2('v2');

app.use(express.json());

const oauth2Client = new google.auth.OAuth2(
    '511214198578-7vv5cpjef5sa0dipa606qbuugs00sj4b.apps.googleusercontent.com',
    'NYPTxupWNJG6AW3Hk2JFxK8n',
    'http://localhost:3000/oauthcallback'
);

const getLoginUrl = async () => {
    const scopes = 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
    const url = await oauth2Client.generateAuthUrl({    
        access_type: 'offline',
        scope: scopes
    });

    console.log('uuuurl', url);
    return url;
}

getLoginUrl();

app.get('/', async (req, res) => {
    const url = await getLoginUrl();
    res.send(`<a href="${url}">Login with Google</a>`);
});

app.get('/oauthcallback', async (req, res) => {
    console.log('cooode', req.query.code);
    const user = await getTokens(req.query.code);
    console.log('userinfo', user);
    res.send(user);
    axios
});

const getTokens = async (code) => {
    console.log('coooooode', code)
    const {tokens} = await oauth2Client.getToken(code);
    console.log('toookens', tokens)
    oauth2Client.setCredentials(tokens);
    const userInfo = await oauth2.userinfo.get({auth: oauth2Client });
    const user = userInfo.data;
    user.refreshToken = tokens.refresh_token;
    return user;
}

app.listen(port, () => {
    console.log(`App listening at port ${port}`)
})