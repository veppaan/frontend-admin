"use strict";
//Kollar token för sida
if(!localStorage.getItem("voff_token")){
    window.location.href = "login.html";
}