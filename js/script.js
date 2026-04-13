console.log("script.js connected!");

let weatherDisplay = document.getElementById("weather_display");

function updateWeather() {
  if (weatherDisplay) {
    weatherDisplay.innerHTML = "🌤️ Weather: 72°F Sunny";
  }
}

updateWeather();

let selectedMood = "😊";
let moodBtns = document.querySelectorAll(".mood-btn");
let saveBtn = document.getElementById("save_entry_btn");
let journalText = document.getElementById("journal_text");
let entriesList = document.getElementById("entries_list");

if (moodBtns.length > 0) {
  for (let i = 0; i < moodBtns.length; i++) {
    moodBtns[i].addEventListener("click", function() {
      for (let j = 0; j < moodBtns.length; j++) {
        moodBtns[j].classList.remove("selected");
      }
      this.classList.add("selected");
      selectedMood = this.getAttribute("data-mood");
      console.log("Mood selected:", selectedMood);
    });
  }
}

if (saveBtn) {
  saveBtn.addEventListener("click", function() {
    let text = journalText.value.trim();
    
    if (text === "") {
      alert("Please write something before saving!");
      return;
    }
    
    let now = new Date();
    let dateStr = now.toLocaleDateString();
    let entryDiv = document.createElement("div");
    entryDiv.className = "entry-item";
    entryDiv.innerHTML = "<strong>" + dateStr + "</strong> " + selectedMood + " - " + text;
    
    if (entriesList.innerHTML.includes("No entries yet")) {
      entriesList.innerHTML = "";
    }
    entriesList.insertBefore(entryDiv, entriesList.firstChild);
    
    journalText.value = "";
    console.log("Journal entry saved!");
  });
}

let quoteDisplay = document.getElementById("quote_display");
let quoteAuthor = document.getElementById("quote_author");

function fetchQuote() {
  if (!quoteDisplay) return;
  
  fetch("https://zenquotes.io/api/random")
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        quoteDisplay.innerHTML = '"Success is the sum of small efforts repeated day in and day out."';
        if (quoteAuthor) quoteAuthor.innerHTML = "— Robert Collier";
      }
    })
    .then(function(data) {
      if (data && data[0]) {
        quoteDisplay.innerHTML = '"' + data[0].q + '"';
        if (quoteAuthor) quoteAuthor.innerHTML = "— " + data[0].a;
      }
    })
    .catch(function(error) {
      console.log("Quote API error:", error);
      quoteDisplay.innerHTML = '"Work hard in silence, let success make the noise."';
      if (quoteAuthor) quoteAuthor.innerHTML = "— Unknown";
    });
}

fetchQuote();

let newQuoteBtn = document.getElementById("new_quote_btn");
if (newQuoteBtn) {
  newQuoteBtn.addEventListener("click", function() {
    fetchQuote();
  });
}

let addTaskBtn = document.getElementById("add_task_btn");
let taskInput = document.getElementById("new_task_input");
let taskList = document.getElementById("task_list");
let progressCountSpan = document.getElementById("progress_count");
let progressBar = document.getElementById("progress_bar");

function updateProgress() {
  if (!taskList) return;
  let checkboxes = document.querySelectorAll("#task_list .task-checkbox");
  let total = checkboxes.length;
  let checked = 0;
  
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      checked = checked + 1;
    }
  }
  
  let percent = total === 0 ? 0 : Math.round((checked / total) * 100);
  
  if (progressCountSpan) progressCountSpan.textContent = checked;
  if (progressBar) {
    progressBar.style.width = percent + "%";
    progressBar.textContent = percent + "%";
  }
}

if (addTaskBtn) {
  addTaskBtn.addEventListener("click", function() {
    let taskName = taskInput.value.trim();
    if (taskName === "") {
      alert("Please enter a task name!");
      return;
    }
    
    let newLi = document.createElement("li");
    newLi.className = "task-item";
    newLi.innerHTML = '<input type="checkbox" class="task-checkbox"> ' + taskName + ' <span class="badge-secondary">new</span>';
    
    taskList.appendChild(newLi);
    taskInput.value = "";
    
    let newCheckbox = newLi.querySelector(".task-checkbox");
    newCheckbox.addEventListener("change", updateProgress);
    updateProgress();
    console.log("Task added:", taskName);
  });
}

let existingCheckboxes = document.querySelectorAll("#task_list .task-checkbox");
for (let i = 0; i < existingCheckboxes.length; i++) {
  existingCheckboxes[i].addEventListener("change", updateProgress);
}

updateProgress();

let joinStudyBtn = document.getElementById("join_study_btn");
if (joinStudyBtn) {
  joinStudyBtn.addEventListener("click", function() {
    alert("Study group feature coming in the final version!");
  });
}

let addClassBtn = document.getElementById("add_class_btn");
if (addClassBtn) {
  addClassBtn.addEventListener("click", function() {
    alert("Add class feature will be available in the final version. You'll be able to add your own classes!");
  });
}

let addStudyBtn = document.getElementById("add_study_btn");
if (addStudyBtn) {
  addStudyBtn.addEventListener("click", function() {
    alert("Add study block feature coming in the final version!");
  });
}

let filterBtns = document.querySelectorAll(".filter-btn");
for (let i = 0; i < filterBtns.length; i++) {
  filterBtns[i].addEventListener("click", function() {
    console.log("Filter clicked:", this.textContent);
    alert("Filter feature will work in the final version!");
  });
}

console.log("JavaScript loaded!");