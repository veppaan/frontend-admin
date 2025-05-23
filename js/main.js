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
        <p>${meal.ingredients}</p>
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

    localStorage.setItem("voff-token", "hejsan");

    if(localStorage.getItem("voff-token")){
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
}