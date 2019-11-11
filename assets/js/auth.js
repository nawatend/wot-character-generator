// Your web app's Firebase configuration
let firebaseConfig = {
    apiKey: "AIzaSyCa8f1viZpeNPHjEPc5CyGP4Op4YipQxC4",
    authDomain: "wot-character-generator.firebaseapp.com",
    databaseURL: "https://wot-character-generator.firebaseio.com",
    projectId: "wot-character-generator",
    storageBucket: "wot-character-generator.appspot.com",
    messagingSenderId: "910406876987",
    appId: "1:910406876987:web:938894f688846fdac2411e",
    measurementId: "G-NWJJB9FD00"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);



let signIn = async () => {

    let email = document.getElementById("signin_email").value
    let password = document.getElementById("signin_password").value

    await firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
            return firebase.auth().signInWithEmailAndPassword(email, password)
        })
        .then(function (response) {
            console.log("success sign in " + response.user.uid)
            showContentGrid()
        })
        .catch((error) => {
            // Handle Errors here.
            let errorCode = error.code
            let errorMessage = error.message
            console.log(errorCode, errorMessage)
            document.getElementById("signin_error").innerText =
                errorCode + " - " + errorMessage;
        });



}

let isUserLoggedin = () => {
    let currentUser = firebase.auth().currentUser;

    if (currentUser) {
        // User is signed in.
        //redirect dashboard
    } else {
        // No user is signed in.
        // redirect login page
    }
}
let signUp = () => {

    let email = document.getElementById("signup_email").value
    let password = document.getElementById("signup_password").value

    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
            showContentGrid()
        })
        .catch((error) => {
            // Handle Errors here.
            let errorCode = error.code
            let errorMessage = error.message

            console.log(errorCode, errorMessage);
            document.getElementById("signup_error").innerHTML =
                errorCode + " - " + errorMessage;
        });
}

function signOut() {
    firebase
        .auth()
        .signOut()
        .then(() => {
            //sendNotification("You are sign out!");
            //document.getElementById("signin_password").value = "";
            showLoginForm()
        }).catch((error) => {
            console.error("Sign Out Error", error)

        })

}

let btnSignin = document.getElementById("btnSignin")
let btnRegister = document.getElementById("btnRegister")
let btnSignup = document.getElementById("btnSignup")
let btnSignout = document.getElementById("btnSignout")

if (btnSignin) {
    btnSignin.addEventListener("click", (e) => {
        e.preventDefault();

        signIn()

    })
}

if (btnRegister) {
    btnRegister.addEventListener("click", (e) => {
        e.preventDefault();

        showRegisterForm()

    })
}

if (btnSignup) {

    btnSignup.addEventListener("click", (e) => {
        e.preventDefault();

        signUp()
    })
}


if (btnSignout) {

    btnSignout.addEventListener("click", (e) => {
        e.preventDefault();

        signOut()
    })
}