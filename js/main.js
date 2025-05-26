//Variabler
const allMeals = document.getElementById("all-meals");
const startMeals = document.getElementById("start-meals");
const navMenu = document.getElementById("menu");
const editForm = document.getElementById("edit-form");


//Logga in
const formLogin = document.getElementById("form-login");

window.onload = init;

function init(){
    //Kolla om listan har värden
    if(allMeals){
        getMeals();
    }
    if(startMeals){
        getStartMeals();
    }
    if(editForm){
        editMeal();
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
async function getStartMeals() {
    try{
        const response = await fetch("https://backend-projekt-api-jxss.onrender.com/api/meals");

        if(response.ok){
            const data  = await response.json();
            showStartMeals(data);
        }

    } catch (error) {
        console.log("Error when fetching meals")
    }
}

async function showStartMeals(meals) {
    startMeals.innerHTML = "";
    meals.forEach(meal => {
        startMeals.innerHTML += `<section class="oneMeal">
        <h4>${meal.mealname}</h4>
        <p>${meal.ingredients.join(", ")}</p>
        <p>${meal.category}</p>
        </section>`
    });
}

//Visa och skriv ut alla måltider
async function showMeals(meals) {
    
    document.querySelectorAll('input[name="meals"]').forEach(checked => {
        checked.addEventListener("change", (e) => {
        
        allMeals.innerHTML = "";
            
        const checkedRadio = e.target.value;
        
        if (checkedRadio == "all"){
        meals.forEach(meal => {
            allMeals.innerHTML += `<section class="oneMeal">
            <h4>${meal.mealname}</h4>
            <p>${meal.ingredients.join(", ")}</p>
            <p><i>${meal.category}</i></p>
            <div id="mealButtons">
            <button id="edit">Redigera</button>
            <button class="deleteBtn">Radera</button>
            </div>
            </section>`;
            const deleteMealBtn = document.querySelectorAll(".deleteBtn");
            deleteMealBtn.forEach(btn => {
                btn.addEventListener("click", () => deleteMeal(meal._id))
            });
        });
    }else {
        allMeals.innerHTML = "";
        const categoryMeals = meals.filter(meal => meal.category === checkedRadio);
        console.log(categoryMeals);

        categoryMeals.forEach(meal => {
        allMeals.innerHTML += `<section class="oneMeal">
        <h4>${meal.mealname}</h4>
        <p>${meal.ingredients.join(", ")}</p>
        <p><i>${meal.category}</i></p>
        <div id="mealButtons">
        <button id="edit">Redigera</button>
        <button id="deleteBtn">Radera</button>
        </div>
        </section>`;
        const deleteMealBtn = document.querySelectorAll(".deleteBtn");
        deleteMealBtn.forEach(btn => {
            btn.addEventListener("click", () => deleteMeal(meal._id))
        });
    });
    }
})
    });
    allMeals.innerHTML = "";

        meals.forEach(meal => {
        allMeals.innerHTML += `<section class="oneMeal">
        <h4>${meal.mealname}</h4>
        <p>${meal.ingredients.join(", ")}</p>
        <p><i>${meal.category}</i></p>
        <div id="mealButtons">
        <a href="edit.html?id=${meal._id}"<button id="edit">Redigera</button></a>
        <button id="deleteBtn">Radera</button>
        </div>
        </section>`;
            const deleteMealBtn = document.querySelectorAll(".deleteBtn");
            deleteMealBtn.forEach(btn => {
                btn.addEventListener("click", () => deleteMeal(meal._id))
            });
        })

}

async function deleteMeal(id){

    console.log("Radera");

    try {
        const response = await fetch(`https://backend-projekt-api-jxss.onrender.com/api/meals/${id}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            }
        })
        if(response.ok){
            const data = await response.json();
            console.log(data);
        } else {
            const err = await response.json();
            console.log(err);
        }
    } catch (error) {
        console.log("Error deleting meal")
    }
}

async function editMeal() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const name = document.getElementById("name");
    const ingredients = document.getElementById("ingredients");
    const category = document.getElementById("category");

    try{
        const response = await fetch(`https://backend-projekt-api-jxss.onrender.com/api/meals/${id}`);

        if(response.ok){
            const data  = await response.json();
            name.value = data.message.mealname;
            ingredients.value = data.message.ingredients.join(", ");
            category.value = data.message.category;
            console.log(data);
        }
        editForm.addEventListener("submit", (e) => updateMeal(e, id));

    } catch (error) {
        console.log("Error when fetching specific meal")
    }
}

async function updateMeal(e, id){
    e.preventDefault();
    const updatedValues = {
        mealname: document.getElementById("name").value,
        ingredients: document.getElementById("ingredients").value,
        category: document.getElementById("category").value
    }
    try {
        const response = await fetch(`https://backend-projekt-api-jxss.onrender.com/api/meals/${id}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(updatedValues)
        })
        if(response.ok){
            const data = await response.json();
            console.log(data);
            window.location.href="admin.html";
        } else {
            const err = await response.json();
            console.log(err);
        }
    } catch (error) {
        console.log("Error updating meal")
    }

}

//Kollar menyn
function checkMenu(){

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
            //Skriver ut meddelanden från backend
            const error = await response.json();
            console.log("Meddelande från server: ", error );
        }

    } catch (error) {
        console.log("Felaktigt användarnamn eller lösenord");
    }
}