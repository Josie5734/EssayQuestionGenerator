//get the last commit time from the github repo and display it
async function loadLastCommit() {
  try {
    const response = await fetch(
      "https://api.github.com/repos/Josie5734/EssayQuestionGenerator/commits?per_page=1"
    ); //get commit data

    const data = await response.json(); //turn to json
    const date = new Date(data[0].commit.author.date); //get data

    document.getElementById("commit-time").textContent =
      date.toLocaleDateString("en-GB"); //format and put into page
  } catch { //catch error and just say unavailable
    document.getElementById("commit-time").textContent =
      "unavailable";
  }
}

loadLastCommit();
