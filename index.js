// essay subjects
const subjects = [
  "Dynamics",
  "Tempo, Metre and Rhythm",
  "Structure",
  "Melody",
  "Instruments and Sonority",
  "Texture",
  "Harmony",
];

// setwork artists and songs
const setWorks = {
  "Kate Bush": ["Cloudbusting", "And Dream Of Sheep", "Under Ice"],
  "The Beatles": [
    "Eleanor Rigby",
    "Here,There and Everywhere",
    "I Want To Tell You",
    "Tomorrow Never Knows",
  ],
  "Batman Returns": [
    "Birth of a Penguin pt-1",
    "Birth of a Penguin pt-2",
    "Batman VS the Circus",
  ],
  "Courtney Pine": [
    "Lady Day and John Coltrane",
    "Inner State Of Mind",
    "Love and Affection",
  ],
  Psycho: [
    "Prelude",
    "The City",
    "Marion",
    "The Murder",
    "The Toys",
    "The Cellar",
    "Discovery",
    "Finale",
  ],
};


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

//pick a random track from the setworks
function pickSong() {
  const artist = randomChoice(Object.keys(setWorks));
  const song = randomChoice(setWorks[artist]);
  return { artist, song };
}


//outputs

//generate output
function generate() {
  const output = document.getElementById("output"); //the output object
  output.innerHTML = "<p><strong>The random essay is:</strong></p>"; //title text

  const artists = randomSample(Object.keys(setWorks), 4); //pick 4 random artists 
  const artistSongs = artists.map(artist => {
    const song = randomChoice(setWorks[artist]); //pick 1 random song for each artist
    return { artist, song };
  })

  //foreach song, generate 3 subjects to write about and output
  artistSongs.forEach(({ artist, song }) => {
    const [s1, s2, s3] = randomSample(subjects, 3);
    output.innerHTML += `<p>Discuss ${artist}'s use of ${s1}, ${s2} and ${s3} in ${song}</p>`;
  })
}



//form handling

//add an artist  (event for clicking the add button)
document.getElementById("artistForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const artistName = document.getElementById("newArtist").value.trim();
  const songs = document.getElementById("newSongs").value.split(",").map(s => s.trim()).filter(Boolean);
  if (!artistName || songs.length === 0) return;

  setWorks[artistName] = songs;
  document.getElementById("newArtist").value = "";
  document.getElementById("newSongs").value = "";
  updateArtistList();
});

//remove an artist
function removeArtist(artist) {
  delete setWorks[artist];
  updateArtistList();
}

//remove a specific song 
function removeSong(artist, song) {
  setWorks[artist] = setWorks[artist].filter(s => s !== song); //remove the song from artists songs
  if (setWorks[artist].length === 0) delete setWorks[artist]; //delete artist if no songs left
  updateArtistList();
}



// Update the artist list on the right side
function updateArtistList() {
  const ul = document.getElementById("artistList");
  ul.innerHTML = "";
  for (let artist in setWorks) {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${artist}</strong>: ${setWorks[artist].join(", ")}
                    <button onclick="removeArtist('${artist}')">Remove Artist</button>`;
    // Add buttons for removing individual songs
    setWorks[artist].forEach(song => {
      const btn = document.createElement("button");
      btn.textContent = `Remove "${song}"`;
      btn.onclick = () => removeSong(artist, song);
      li.appendChild(btn);
    });
    ul.appendChild(li);
  }
}




// listener for the Generate Essay button click
document.querySelector("#generateBtn").addEventListener("click", generate);



updateArtistList();
