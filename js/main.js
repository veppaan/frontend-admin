//Variabler
const allMeals = document.getElementById("all-meals");
const startMeals = document.getElementById("start-meals");
const navMenu = document.getElementById("menu");
const editForm = document.getElementById("edit-form");
const addForm = document.getElementById("add-form")
const addBtn = document.getElementById("addMeal");
const allBookings = document.getElementById("bookings");


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
    if(allBookings){
        getBookings();
    }

    checkMenu();

    if(formLogin){
        formLogin.addEventListener("submit", login);
    }

    if(addForm){
        addForm.addEventListener("submit", addMeal);
    }

}

//Hämta måltider
async function getMeals() {
    //Hämtar data från url
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
    //Hämtar data från url
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
    //Utskrift för måltider för startsida
    meals.forEach(meal => {
        startMeals.innerHTML += `<section class="oneMeal">
        <h4>${meal.mealname}</h4>
        <p>${meal.ingredients.join(", ")}</p>
        <p><i>${meal.category}</i></p>
        </section>`
    });
}

//Visa och skriv ut alla måltider
async function showMeals(meals) {
    
document.querySelectorAll('input[name="meals"]').forEach(checked => {
    checked.addEventListener("change", (e) => {
        allMeals.innerHTML = "";
        const checkedRadio = e.target.value;

        let filteredMeals;
        if (checkedRadio === "all") {
            filteredMeals = meals;
        } else {
            filteredMeals = meals.filter(meal => meal.category === checkedRadio);
        }
        //Visar måltider från sortering
        filteredMeals.forEach(meal => {
            allMeals.innerHTML += `<section class="oneMeal">
            <h4>${meal.mealname}</h4>
            <p>${meal.ingredients.join(", ")}</p>
            <p><i>${meal.category}</i></p>
            <div class="mealbuttons">
            <a href="edit.html?id=${meal._id}"><button id="edit">Redigera</button></a>
            <button class="deleteBtn">Radera</button>
            </div>
            </section>`;
        });

        const deleteMealBtn = document.querySelectorAll(".deleteBtn");
        deleteMealBtn.forEach((btn, index) => {
            btn.addEventListener("click", () => deleteMeal(filteredMeals[index]));
        });
    });
});
    allMeals.innerHTML = "";

        meals.forEach(meal => {
        allMeals.innerHTML += `<section class="oneMeal">
        <h4>${meal.mealname}</h4>
        <p>${meal.ingredients.join(", ")}</p>
        <p><i>${meal.category}</i></p>
        <div class="mealbuttons">
        <a href="edit.html?id=${meal._id}"<button id="edit">Redigera</button></a>
        <button class="deleteBtn">Radera</button>
        </div>
        </section>`;
        })
        const deleteMealBtn = document.querySelectorAll(".deleteBtn");
            deleteMealBtn.forEach((btn, index) => {
                btn.addEventListener("click", () => deleteMeal(meals[index]))
            });

}
//Radera måltid
async function deleteMeal(meal){
    console.log(meal);

    const confirmDelete = confirm("Är du säker på att du vill ta bort måltiden?");
    if(!confirmDelete){
        return;
    }
//Hämtar data från url
    try {
        const response = await fetch(`https://backend-projekt-api-jxss.onrender.com/api/meals/${meal._id}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            }
        })
        if(response.ok){
            const data = await response.json();
            console.log(data);
            getMeals();
        } else {
            const err = await response.json();
            console.log(err);
        }
    } catch (error) {
        console.log("Error deleting meal")
    }
}
//Redigera måltid
async function editMeal() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const name = document.getElementById("name");
    const ingredients = document.getElementById("ingredients");
    const category = document.getElementById("category");
//Hämtar data från url
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
//Uppdatera måltiden med nya värden
async function updateMeal(e, id){
    e.preventDefault();
    const updatedValues = {
        mealname: document.getElementById("name").value,
        ingredients: document.getElementById("ingredients").value,
        category: document.getElementById("category").value
    }
    //Hämtar data från url
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
//Lägg till måltid
async function addMeal(e){
    e.preventDefault();
    const newMeal = {
        mealname: document.getElementById("new-name").value,
        ingredients: document.getElementById("new-ingredients").value,
        category: document.getElementById("new-category").value
    }
    //Hämtar data från url
    try {
        const response = await fetch("https://backend-projekt-api-jxss.onrender.com/api/meals", {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(newMeal)
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
        console.log("Error adding meal")
    }
}

//Kollar menyn
function checkMenu(){
//Visar olika menyer
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

    //Kollar om något fält är tomt
    if(!usernameValue || !passwordValue){
        console.log("Du måste fylla i alla fält!");
    }

    const admin = {
        username: usernameValue,
        password: passwordValue
    }
    const errorLogin = document.getElementById("errorLogin");
//Hämtar data från url
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
            localStorage.setItem("voff_token", loggedInAdmin.response.token);
            window.location.href = "admin.html";
        } else {
            //Skriver ut meddelanden från backend
            const error = await response.json();
            errorLogin.innerHTML = (error.message);
        }

    } catch (error) {
        errorLogin.innerHTML = ("Felaktigt användarnamn eller lösenord");
    }
}
//Hämta boknignar
async function getBookings(){
    //Hämtar data från url
    try{
        const response = await fetch("https://backend-bookings.onrender.com/bookings");

        if(response.ok){
            const data  = await response.json();
            showBookings(data);
        }

    } catch (error) {
        console.log("Error when fetching meals")
    }
}
//Visar bokningar
async function showBookings(bookings){
    console.log(bookings);
        
        allBookings.innerHTML = "";

        bookings.forEach(book => {
            const date = new Date(book.created);
            const time = date.toLocaleString('sv-SE', {
                hour: '2-digit',
                minute: '2-digit'
            });
            const dateToShow = date.toLocaleString('sv-SE', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            //Skapar element för varje bokning
            allBookings.innerHTML += `<section class="oneBooking">
            <p class="booking-time">${time} - ${dateToShow}</p>
            <p>${book.starter}</p>
            <p>${book.mainCourse}</p>
            <p><i>${book.dessert}</i></p>
            <h4>Kund:</h4>
            <p>${book.customer.firstname} ${book.customer.lastname}</p>
            <p>${book.customer.number}</p>
            <button class="deleteBookBtn">Radera</button>
            </section>`;
            });
            const deleteBookingBtn = document.querySelectorAll(".deleteBookBtn");
            deleteBookingBtn.forEach((btn, index) => {
                btn.addEventListener("click", () => {
                    deleteBooking(bookings[index])
                });
        });
}
//radera bokning
async function deleteBooking(booking){
    console.log(booking);

    const confirmDelete = confirm("Är du säker på att du vill ta bort bokningen?");
    if(!confirmDelete){
        return;
    }
//Hämtar data från url
    try {
        const response = await fetch(`https://backend-bookings.onrender.com/bookings/${booking._id}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            }
        })
        if(response.ok){
            const data = await response.json();
            console.log(data);
            getBookings();
        } else {
            const err = await response.json();
            console.log(err);
        }
    } catch (error) {
        console.log("Error deleting booking")
    }
}