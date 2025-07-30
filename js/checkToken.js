"use strict";

//Kollar om det finns tokne och dess gilitghet
async function checkToken(){

if(!localStorage.getItem("voff_token")){
    window.location.href = "login.html";
} else {
    const token = localStorage.getItem("voff_token");
    try {
        const resp = await fetch("https://backend-projekt-admin.onrender.com/admin/secret", {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ` + token
            }
        })

        if(resp.ok) {
            const data = await resp.json();
            console.log(data);
        }else{
            console.log(data);
            //localStorage.removeItem("voff_token");
            window.location.href = "login.html";
        }
    } catch (error) {
        console.log("Det blev något fel med token-autentisering!");
    }
}
}
checkToken();