const admin = require("firebase-admin")

admin.initializeApp({
  credential: admin.credential.cert("./firebase-functions/data/serviceAccount.json"),
})

const uid = "VyzDR6nUwNb1srHN5INhVVJuwmQ2"


admin
  .auth()
  .setCustomUserClaims(uid, { manager: true })
  .then(() => {
    console.log(`Manager claim added to ${uid}`)
  });