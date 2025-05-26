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
        
        if (checkedRadio == "all"){
        meals.forEach(meal => {
            allMeals.innerHTML += `<section class="oneMeal">
            <h4>${meal.mealname}</h4>
            <p>${meal.ingredients.join(", ")}</p>
            <p><i>${meal.category}</i></p>
            <div class="mealbuttons">
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
        <div class="mealbuttons">
        <button id="edit">Redigera</button>
        <button class="deleteBtn">Radera</button>
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
        <div class="mealbuttons">
        <a href="edit.html?id=${meal._id}"<button id="edit">Redigera</button></a>
        <button class="deleteBtn">Radera</button>
        </div>
        </section>`;
            const deleteMealBtn = document.querySelectorAll(".deleteBtn");
            deleteMealBtn.forEach(btn => {
                btn.addEventListener("click", () => deleteMeal(meal._id))
            });
        })

}

async function deleteMeal(id){

    const confirmDelete = confirm("Är du säker på att du vill ta bort måltiden?");
    if(!confirmDelete){
        return;
    }

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
            getMeals();
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

async function addMeal(e){
    e.preventDefault();
    const newMeal = {
        mealname: document.getElementById("new-name").value,
        ingredients: document.getElementById("new-ingredients").value,
        category: document.getElementById("new-category").value
    }
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

async function getBookings(){
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
            allBookings.innerHTML += `<section class="oneBooking">
            <p class="booking-time">${time} - ${dateToShow}</p>
            <p>${book.starter}</p>
            <p>${book.mainCourse}</p>
            <p><i>${book.dessert}</i></p>
            <h5>Kund:</h5>
            <p>${book.customer.firstname} ${book.customer.lastname}</p>
            <p>${book.customer.number}</p>
            <button class="deleteBookBtn">Radera</button>
            </section>`;
            const deleteBookingBtn = document.querySelectorAll(".deleteBookBtn");
            deleteBookingBtn.forEach(btn => {
                btn.addEventListener("click", () => deleteBooking(book._id))
            });
        });
}
async function deleteBooking(id){

    const confirmDelete = confirm("Är du säker på att du vill ta bort bokningen?");
    if(!confirmDelete){
        return;
    }

    try {
        const response = await fetch(`https://backend-bookings.onrender.com/bookings/${id}`, {
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