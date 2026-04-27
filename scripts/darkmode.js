//toggle the darkmode class
function darkmodeToggle() {
  document.body.classList.toggle("darkmode"); //add/remove darkmode class

  const enabled = document.body.classList.contains("darkmode"); //bool if has darkmode class
  localStorage.setItem("darkmode", enabled); //store in local storage

  console.log("darkmode toggle")
}

//load settings on startup
function darkmodeLoad() {
  document.getElementById("darkmode-btn").addEventListener("click", darkmodeToggle); //add event listener to button

  const darkmode = localStorage.getItem("darkmode"); //get settings for darkmode
  if (darkmode === "true") { //if true, enabled darkmode
    document.body.classList.add("darkmode");
  } else if (darkmode === "false") { //if false, disable darkmode 
    document.body.classList.remove("darkmode");
  } else { //else enable darkmode if browser preferences set to dark mode
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("darkmode");
    }
  }
}

darkmodeLoad();
