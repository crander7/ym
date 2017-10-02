const express = require('express');
const authControl = require('./../controllers/authController');
// let request = require('request');
// const tough = require('tough-cookie');
// const FileCookieStore = require('tough-cookie-filestore');
// const fs = require('fs');

// const Cookie = tough.Cookie;

const router = new express.Router();

router.get('/fb/callback', authControl.fbCallback);
router.get('/facebook', authControl.facebook);

router.get('/google/return', authControl.googleCb);
router.get('/google', authControl.google);

// router.get('/ig/callback', authControl.igCallback);
// router.get('/instagram', authControl.instagram);


// router.get('/lds', (req, res) => {
//     let options = {
//         url: 'https://signin.lds.org/login.html',
//         method: 'POST',
//         body: 'username=crander7&password=7Merrill1'
//     };
//     const cookiepath = 'cookies.json';

//     // create the json file if it does not exist
//     if (!fs.existsSync(cookiepath)) {
//         fs.closeSync(fs.openSync(cookiepath, 'w'));
//     }
//     const jar = request.jar();
//     request = request.defaults({ jar });
//     request.post(options, () => {
//         options = {
//             url: 'https://www.lds.org/mobiledirectory/services/v2/ldstools/current-user-detail',
//             method: 'GET'
//         };
//         request.get(options, (er, rs, body) => {
//             console.log(body);
//             res.json({ hello: 'from node' });
//         });
//     });
// });

router.post('/signup', authControl.localSignUp);
router.post('/login', authControl.localLogin);

module.exports = router;

// let cookies;
// if (resp.headers['set-cookie'] instanceof Array) cookies = resp.headers['set-cookie'].map(Cookie.parse);
// else cookies = [Cookie.parse(resp.headers['set-cookie'])];
// const cookiejar = new tough.CookieJar();
// cookiejar.setCookie(cookies, 'http://localhost:8086', (error, cookie) => {
//     console.log(error, cookie);
// });
// console.log(cookies);

// https://ident.familysearch.org/cis-web/oauth2/v3/authorization
// ?client_secret=Gu3v5smMdTnPcR7at7dIrGYDFM50wAgymem39%2FGIVwC5xJoHxSlBjxIVZMYE4MEZZq0bpxh3bdHJb0PZJ3KPbLgUdfRjmZ9b%2F9IXjKAZf3XV%2BYoHoKuUV%2Be9QHU%2Ffq2DpqtEBYw5ejtX1C0vgXTCqVYJWiCaFUv6kAoDMSFtRk8sCSSspKEh0y0PSZt4RYJiytlIYo3SDXAfMgC%2Bc0GQMuEPkL5U3r5mgUXqBpDTTKrB8C01IP%2B0CrvlkD9QfQfuHVn%2BmmaKn5v33GDft386ihkBeM0L7kM44fegy62Y4hhUxOwq9CuWsUuf17E7DyzemL%2B5MHubxE6cTEonPaq6IQ%3D%3D
// &response_type=code
// &redirect_uri=http%3A%2F%2Flocalhost:8086%2Fauth%2Ffamilysearch%2Fcallback
// &state=https%3A%2F%2Fwww.familysearch.org%2F
// &client_id=3Z3L-Z4GK-J7ZS-YT3Z-Q4KY-YN66-ZX5K-176R
