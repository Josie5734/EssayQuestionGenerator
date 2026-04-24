//globals
let SETWORKS = {};
let activeSetworks = {};

let SUBJECTS = {};
let activeSubjects = {};




//load the setworks from the json file into an array
async function loadSetworks() {
  const response = await fetch("data/setworks.json"); //get file with setworks  in it 
  const data = await response.json(); //load into data
  return data;
}

//load subjects from json to array
async function loadSubjects() {
  const response = await fetch("data/subjects.json"); //get subjects file 
  const data = await response.json(); //load to data 
  return data;
}




//generation tools

//randomly choose item from array
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// randomly pick n unique elements from array
function randomSample(arr, n) {
  const copy = [...arr]; //create copy of array
  const result = []; //output
  for (let i = 0; i < n; i++) { // for n times
    const index = Math.floor(Math.random() * copy.length); //pick random item from copy 
    result.push(copy.splice(index, 1)[0]); //remove it from copy and add to result
  }
  return result;
}

//pick the 4 songs to use 
function pickSongs(setWorks) {
  const artists = randomSample(Object.keys(setWorks), 4); //pick 4 artists 
  const artistSongs = artists.map(artist => {
    const song = randomChoice(setWorks[artist]); //pick random one of artists songs 
    return { artist, song };
  })
  return artistSongs; //return array of 4 { artist: song } objects
}

//pick 3 subjects to use
function pickSubjects(subjects) {
  return randomSample(subjects, 3); //pick 3 random subjects from list
}



//box content generation

//fill in questions box
function generateQuestionsBox(SETWORKS, SUBJECTS) {
  const box = document.getElementById("question-box"); //get box element
  let full_text = ""; //placeholder for full box of text

  const choices = pickSongs(SETWORKS); //get artist and song pairs in array of { artist, song }

  choices.forEach(({ artist, song }, index) => {
    const subjects = randomSample(SUBJECTS, 3) //get 3 subjects 
    const text = `Discuss ${artist}'s use of ${subjects[0]}, ${subjects[1]} and ${subjects[2]} in ${song}`; //text template
    full_text += text
    if (index !== choices.length - 1) {
      full_text += "\n\n"; //add newlines if not on the last item
    }
  });

  box.textContent = full_text; //set text
}

//fill in subjects box
function loadSubjectBox(subjects) {

  let subjectBoxHTML = "<p><strong>Check/Uncheck to Include or Not Include in questions</strong></p>"; //full html for the entire box (starting with just title)

  //generate html for each subject 
  subjectBoxHTML += subjects.map(subject => `<p>${subject} <input type="checkbox" class="subject-check" data-subject="${subject}" checked /> </p>`).join("");

  const box = document.getElementById("subject-box"); //get the subject-box 
  box.innerHTML = subjectBoxHTML; //add the html

  setupSubjectCheckboxListeners(); //setup the event listeners
}

//handle checkbox toggles 

//toggle function
function handleSubjectToggle(event) {
  const box = event.target; //get checkbox item

  const subject = box.dataset.subject //get subject

  if (!box.checked) { //if box unchecked 
    activeSubjects = activeSubjects.filter(s => s !== subject); //remove subject 
    console.log("deleted " + subject)
  } else { //else if box checked
    activeSubjects.push(subject); //add item to list
  }
}

//setup event listeners
function setupSubjectCheckboxListeners() {
  document.querySelectorAll(".subject-check").forEach(box => { //songs
    box.addEventListener("change", handleSubjectToggle);
  });
}

//fill in the artist box
function loadArtistBox(setWorks) {

  let artistBoxHTML = "<p><strong>Check/Uncheck to Include or Not Include in questions</strong></p>"; //full html for the entire box (starting with just title)

  Object.entries(setWorks).forEach(([artist, songs]) => { //loop through each artist in the setWorks
    const songHTML = songs.map(song => `<p>${song} <input type="checkbox" class="song-check" data-artist="${artist}" data-song="${song}" checked /> </p>`).join(""); //create a list of the songs 
    const artistHTML = `<details class="artist-item">
      <summary>
        ${artist}
        <input type="checkbox" class="artist-check" data-artist="${artist}" checked />
      </summary>
      ${songHTML}
    </details>`;  //create the full html item for the artist

    artistBoxHTML += artistHTML; //add it to the total
  })

  const box = document.getElementById("artist-box"); //get the box 
  box.innerHTML = artistBoxHTML; //add the html

  setupArtistCheckboxListeners(); //add event listeners to artist and song checkboxes
}

//handle checkboxes for artist-box 

//toggle songs on/off
function handleSongToggle(event) {
  const box = event.target; //get the checkbox 
  const artist = box.dataset.artist; //get artist and song linked to box 
  const song = box.dataset.song;

  if (!box.checked) { //if box not checked
    activeSetworks[artist] = activeSetworks[artist].filter(s => s !== song); //remove song 

    if (activeSetworks[artist].length === 0) { //remove artist if that was the last song
      delete activeSetworks[artist];
    }
  } else { //else if box checked 
    if (!activeSetworks[artist]) { //if artist doesnt exist 
      activeSetworks[artist] = []; //add it 
    }

    if (!activeSetworks[artist].includes(song)) { //if song doesnt exist 
      activeSetworks[artist].push(song); //add it 
    }
  }



  //get all song checkboxes for this songs artist
  const songBoxes = document.querySelectorAll(`.song-check[data-artist="${artist}"]`);

  //get the artists checkbox
  const artistBox = document.querySelector(`.artist-check[data-artist="${artist}"]`);

  //check the artist box if any of the songs are checked, else uncheck
  artistBox.checked = [...songBoxes].some(box => box.checked);
}


//toggle artists on/off
function handleArtistToggle(event) {
  const box = event.target; //get checkbox 
  const artist = box.dataset.artist; //get artist from checkbox

  const checked = box.checked; //state of artist checkbox

  //get all the song checkboxes for the artist
  const songBoxes = document.querySelectorAll(`.song-check[data-artist="${artist}"]`);

  //set them to the same state as the artist checkbox
  songBoxes.forEach(songBox => { songBox.checked = checked; });

  if (!checked) { //if unchecked 
    delete activeSetworks[artist]; //remove artist 
  } else { //else checked 
    activeSetworks[artist] = [...SETWORKS[artist]]; //add artist from main one
  }
}


//add event listeners to artist and song checkboxes
function setupArtistCheckboxListeners() {
  document.querySelectorAll(".song-check").forEach(box => { //songs
    box.addEventListener("change", handleSongToggle);
  });
  document.querySelectorAll(".artist-check").forEach(box => { //artists
    box.addEventListener("change", handleArtistToggle);
  });
}



//startup stuff 

//setup page with initial loads
function setup() {
  loadArtistBox(activeSetworks); //load the artist-box initially
  loadSubjectBox(activeSubjects); //load subject box

  //event listener on the generate button to generate questions
  document.getElementById("generate-btn").addEventListener("click", () => {
    generateQuestionsBox(activeSetworks, activeSubjects);
  });
}

//make sure data from json files has been retrieved first
async function loadData() {
  SETWORKS = await loadSetworks(); //load setworks from file
  SUBJECTS = await loadSubjects(); //load subjects from file

  activeSetworks = structuredClone(SETWORKS); //copy of setworks for use 
  activeSubjects = structuredClone(SUBJECTS); //copy of subjects for use

  setup()
}



//run startup
loadData();
