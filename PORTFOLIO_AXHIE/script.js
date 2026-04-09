const MY_CLIENT_ID = "556226911506-s859prkmlvqe54slrcfek6cdlga1csen.apps.googleusercontent.com";

function checkAuth() {
    const path = window.location.pathname;
    const page = path.split("/").pop() || "index.html"; 
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    const privatePages = ["home.html", "about.html", "portfolio.html", "contact.html"];
    const publicPages = ["index.html", "login.html"]; 

    if (privatePages.includes(page) && isLoggedIn !== "true") {
        window.location.href = "login.html";
    }

    if (publicPages.includes(page) && isLoggedIn === "true") {
        window.location.href = "home.html";
    }
}
checkAuth();

window.onload = function () {
    google.accounts.id.initialize({
        client_id: MY_CLIENT_ID,
        callback: handleCredentialResponse
    });

    const googleBtnDiv = document.getElementById("googleBtn");
    if (googleBtnDiv) {
        google.accounts.id.renderButton(
            googleBtnDiv,
            { theme: "outline", size: "large", width: "100%", shape: "pill" } 
        );
    }
};

function handleCredentialResponse(response) {
    const responsePayload = parseJwt(response.credential);
    const googleUser = {
        fullname: responsePayload.name,
        email: responsePayload.email,
        password: "google-auth-user"
    };
    localStorage.setItem("userAccount", JSON.stringify(googleUser));
    localStorage.setItem("isLoggedIn", "true");

    const fullNameInput = document.getElementById('fullname');
    if (fullNameInput) {
        fullNameInput.value = responsePayload.name;
        document.getElementById('email').value = responsePayload.email;
    } else {
        window.location.href = "home.html";
    }
}

document.getElementById("loginForm")?.addEventListener("submit", function(e){
    e.preventDefault();
    const emailInput = document.getElementById("loginUser")?.value || document.getElementById("username")?.value;
    const passInput = document.getElementById("loginPass")?.value || document.getElementById("password")?.value;
    const storedUser = JSON.parse(localStorage.getItem("userAccount"));

    if (!storedUser) {
        alert("No account found. Please register first.");
    } else if (emailInput === storedUser.email && passInput === storedUser.password) {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "home.html";
    } else {
        alert("Invalid email or password.");
    }
});

document.getElementById("registerForm")?.addEventListener("submit", function(e){
    e.preventDefault();
    const fullName = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const pass = document.getElementById("regPassword").value;

    if (pass.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    const newUser = {
        fullname: fullName,
        email: email,
        password: pass
    };
    localStorage.setItem("userAccount", JSON.stringify(newUser));
    alert("Registration successful! Please login.");
    window.location.href = "login.html"; 
});

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

function logout() {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "index.html";
}