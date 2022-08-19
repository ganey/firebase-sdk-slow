const start = Date.now();

const functions = require('@google-cloud/functions-framework');

const admin = require("firebase-admin");

const serviceAccount = require("../credentials/serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

functions.http('helloHttp', async (req, res) => {

    const user = await admin.auth().getUserByEmail('slow@example.com')
        .then((userRecord) => {
            return admin.auth().updateUser(userRecord.uid, {
                password: 'test123!',
            })
        })
        .catch(() => {
            return admin.auth().createUser({
                email: 'slow@example.com',
                password: 'test123!',
            });
        });

    const doc = await admin.firestore().doc(`users/${user.uid}`).get();
    console.log('Doc is: ', doc ? doc.data() : {});

    await admin.firestore().doc(`users/${user.uid}`).set({
        testData: start,
    });

    const end = Date.now();
    res.send( 'Finished: ' + ((end - start) / 1000).toFixed(2) );
});
