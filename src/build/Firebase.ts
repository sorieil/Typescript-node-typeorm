import * as admin from "firebase-admin";
const serviceAccount = require("../../../firebase-admin-config.json");
export let firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseAuthVariableOverride: {uid: "test"},
    databaseURL: "https://test.firebaseio.com",
});
