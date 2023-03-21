const firebase = require('firebase');
const firebaseConfig = {
    apiKey: "AIzaSyAorrb7OewoG_r9g64jFA0Xzp-5U08J0Y0",
    authDomain: "collegeproject-b85f0.firebaseapp.com",
    databaseURL: "https://collegeproject-b85f0-default-rtdb.firebaseio.com",
    projectId: "collegeproject-b85f0",
    storageBucket: "collegeproject-b85f0.appspot.com",
    messagingSenderId: "442578180300",
    appId: "1:442578180300:web:90b77f69096aef20f00a69"
  };

firebase.initializeApp(firebaseConfig);
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      res.send('Logged in successfully');
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
