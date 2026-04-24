//toggle the darkmode class
function darkmodeToggle() {
  document.body.classList.toggle("darkmode"); //add/remove darkmode class

  const enabled = document.body.classList.contains("darkmode"); //bool if has darkmode class
  localStorage.setItem("darkmode", enabled); //store in local storage
}

//load settings on startup
function darkmodeLoad() {
  document.getElementById("darkmode-btn").addEventListener("click", darkmodeToggle); //add event listener to button

  const darkmode = localStorage.getItem("darkmode"); //get settings for darkmode
  if (darkmode === "true") { //if true, enabled darkmode
    document.body.classList.add("darkmode");
  }
}

darkmodeLoad();
