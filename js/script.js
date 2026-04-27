console.log("script.js connected!");

let weatherDisplay = document.getElementById("weather_display");

function updateWeather() {
  if (!weatherDisplay) return;
  
  let lat = 41.88;
  let lon = -87.63;
  let url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current_weather=true&temperature_unit=fahrenheit";
  
  fetch(url)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        weatherDisplay.innerHTML = "🌤️ Chicago: 52°F";
      }
    })
    .then(function(data) {
      if (data && data.current_weather) {
        let temp = Math.round(data.current_weather.temperature);
        weatherDisplay.innerHTML = "🌤️ Chicago: " + temp + "°F";
      }
    })
    .catch(function(error) {
      console.log("Weather error:", error);
      weatherDisplay.innerHTML = "🌤️ Chicago: 52°F";
    });
}

updateWeather();

let selectedMood = "😊";
let moodBtns = document.querySelectorAll(".mood-btn");
let saveBtn = document.getElementById("save_entry_btn");
let journalText = document.getElementById("journal_text");
let entriesList = document.getElementById("entries_list");

function loadEntries() {
    let savedEntries = localStorage.getItem("journalEntries");
    if (savedEntries) {
        let entries = JSON.parse(savedEntries);
        entriesList.innerHTML = "";
        for (let i = 0; i < entries.length; i++) {
            let entryDiv = document.createElement("div");
            entryDiv.className = "entry-item";
            entryDiv.innerHTML = "<strong>" + entries[i].date + "</strong> " + entries[i].mood + " - " + entries[i].text;
            entriesList.appendChild(entryDiv);
        }
    }
}

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
        
        let entries = JSON.parse(localStorage.getItem("journalEntries")) || [];
        
        entries.unshift({ date: dateStr, mood: selectedMood, text: text });
        
        localStorage.setItem("journalEntries", JSON.stringify(entries));
        
        loadEntries();
        
        journalText.value = "";
        
        console.log("Journal entry saved!");
    });
}

loadEntries();

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

function loadTasks() {
    let savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        let tasks = JSON.parse(savedTasks);
        taskList.innerHTML = "";
        for (let i = 0; i < tasks.length; i++) {
            let newLi = document.createElement("li");
            newLi.className = "task-item";
            let checkedAttr = tasks[i].checked ? 'checked' : '';
            newLi.innerHTML = '<input type="checkbox" class="task-checkbox" ' + checkedAttr + '> ' + tasks[i].name + ' <span class="badge-secondary">' + tasks[i].date + '</span>';
            taskList.appendChild(newLi);
        }
        updateProgress();
        attachCheckboxListeners();
    }
}

function attachCheckboxListeners() {
    let checkboxes = document.querySelectorAll("#task_list .task-checkbox");
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener("change", function() {
            updateProgress();
            saveTasksToLocal();
        });
    }
}

function saveTasksToLocal() {
    let tasks = [];
    let taskItems = document.querySelectorAll("#task_list .task-item");
    for (let i = 0; i < taskItems.length; i++) {
        let checkbox = taskItems[i].querySelector(".task-checkbox");
        let name = taskItems[i].childNodes[2].nodeValue.trim();
        tasks.push({ 
            name: name, 
            checked: checkbox.checked, 
            date: "pending"
        });
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

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
    
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ name: taskName, checked: false, date: "new" });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    
    loadTasks();
    taskInput.value = "";
    console.log("Task added:", taskName);
  });
}

if (taskList) {
    loadTasks();
}

let joinStudyBtn = document.getElementById("join_study_btn");
if (joinStudyBtn) {
  joinStudyBtn.addEventListener("click", function() {
    alert("Study group feature coming in the final version!");
  });
}

let addClassBtn = document.getElementById("add_class_btn");
if (addClassBtn) {
  addClassBtn.addEventListener("click", function() {
    alert("Add class feature will be available in the final version.");
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