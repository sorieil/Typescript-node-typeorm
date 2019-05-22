import * as admin from "firebase-admin";
const serviceAccount = require("./../../test-7beb1-firebase-adminsdk-4hjxw-a2ba89527d.json");
// const serviceAccount = require("./../../test-england-firebase-adminsdk-1p9z7-cb0c1060dd.json");
export let firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseAuthVariableOverride: {uid: "testAdmin"},
    databaseURL: "https://test-7beb1.firebaseio.com",
});
export let timestamp = admin.database.ServerValue.TIMESTAMP
