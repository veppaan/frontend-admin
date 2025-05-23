//Variabler
const allMeals = document.getElementById("all-meals");
const navMenu = document.getElementById("menu");

//Logga in
const formLogin = document.getElementById("form-login");

window.onload = init;

function init(){
    //Kolla om listan har värden
    if(allMeals){
        getMeals();
    }
    checkMenu();
    if(formLogin){
        formLogin.addEventListener("submit", login);
    }
}

//Hämta måltider
async function getMeals() {
    try{
        const response = await fetch("https://backend-projekt-api-jxss.onrender.com/api/meals");

        if(response.ok){
            const data  = await response.json();
            showMeals(data);
        }

    } catch (error) {
        console.log("Error when fetching meals")
    }
}

//Visa och skriv ut alla måltider
async function showMeals(meals) {
    allMeals.innerHTML = "";
    meals.forEach(meal => {
        allMeals.innerHTML += `<section class="oneMeal">
        <h4>${meal.mealname}</h4>
        <p>${meal.ingredients.join(", ")}</p>
        <p>${meal.category}</p>
        <div id="mealButtons">
        <button id="edit">Redigera</button>
        <button id="delete">Radera</button>
        </div>
        </section>`
    });
}

//Kollar menyn
function checkMenu(){

    //localStorage.setItem("voff-token", "hejsan");

    if(localStorage.getItem("voff_token")){
        navMenu.innerHTML=`
        <a href="index.html">Startsida</a>
        <a href="bookings.html">Bokningar</a>
        <a href="admin.html">Admin</a>
        <button id="logoutBtn">Logga ut</button>`
    }else{
        navMenu.innerHTML=`
        <a href="index.html">Startsida</a>
        <a href="login.html">Logga in</a>`
    }
    const logoutBtn = document.getElementById("logoutBtn");

    if(logoutBtn){
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("voff_token");
            window.location.href = "login.html";
        })
    }
}

async function login(e){
    e.preventDefault();

    //Hämtar in värden från formulär
    const usernameValue = document.getElementById("username").value;
    let passwordValue = document.getElementById("password").value;

    if(!usernameValue || !passwordValue){
        console.log("Du måste fylla i alla fält!");
    }

    const admin = {
        username: usernameValue,
        password: passwordValue
    }

    try {
        const response = await fetch("https://backend-projekt-admin.onrender.com/admin/login", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(admin)
        })
        if(response.ok){
            const loggedInAdmin = await response.json();
            localStorage.setItem("voff_token", loggedInAdmin.token);
            window.location.href = "admin.html";
        } else {
            const error = await response.json();
            console.log("Meddelande från server: " + error.errors );
        }

    } catch (error) {
        console.log("Felaktigt användarnamn eller lösenord");
    }
}