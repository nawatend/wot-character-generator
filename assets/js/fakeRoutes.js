let contentGrid = document.getElementById("content")
let loginForm = document.getElementById("form__login")
let registerForm = document.getElementById("form__register")


let showContentGrid = () => {
    //render grid
    loginForm.classList.add("remove")
    registerForm.classList.add("remove")
    contentGrid.classList.remove("remove")
}

let showLoginForm = () => {
    //render login
    loginForm.classList.remove("remove")
    registerForm.classList.add("remove")
    contentGrid.classList.add("remove")
}

let showRegisterForm = () => {
    //render register
    loginForm.classList.add("remove")
    registerForm.classList.remove("remove")
    contentGrid.classList.add("remove")
}