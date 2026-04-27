console.log("script.js connected");

let weatherDisplay = document.getElementById("weather_display");

function updateWeather() {
  if (!weatherDisplay) return;
  
  weatherDisplay.innerHTML = "🌤️ Loading weather...";
  
  let lat = 41.88;
  let lon = -87.63;
  let url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current_weather=true&temperature_unit=fahrenheit";
  
  fetch(url)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Weather API failed");
      }
    })
    .then(function(data) {
      if (data && data.current_weather) {
        let temp = Math.round(data.current_weather.temperature);
        weatherDisplay.innerHTML = "🌤️ Chicago: " + temp + "°F";
      } else {
        weatherDisplay.innerHTML = "🌤️ Chicago: 52°F";
      }
    })
    .catch(function(error) {
      console.log("Weather error:", error);
      weatherDisplay.innerHTML = "🌤️ Chicago: 52°F";
    });
}

updateWeather();

let entriesList = document.getElementById("entries_list");

if (entriesList) {
  let selectedMood = "😊";
  let moodBtns = document.querySelectorAll(".mood-btn");
  let saveBtn = document.getElementById("save_entry_btn");
  let journalText = document.getElementById("journal_text");

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
    });
  }

  loadEntries();
}

let quoteDisplay = document.getElementById("quote_display");

if (quoteDisplay) {
  let quoteAuthor = document.getElementById("quote_author");

  function fetchQuote() {
    fetch("https://zenquotes.io/api/random")
      .then(function(response) {
        if (response.ok) {
          return response.json();
        } else {
          quoteDisplay.innerHTML = '"Success is the sum of small efforts."';
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
        console.log("Quote error:", error);
        quoteDisplay.innerHTML = '"Work hard in silence."';
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
}

let addTaskBtn = document.getElementById("add_task_btn");

if (addTaskBtn) {
  let taskInput = document.getElementById("new_task_input");
  let taskList = document.getElementById("task_list");
  let progressCountSpan = document.getElementById("progress_count");
  let progressBar = document.getElementById("progress_bar");
  let totalTasksSpan = document.getElementById("total_tasks");

  function updateProgress() {
    let checkboxes = document.querySelectorAll(".task-checkbox");
    let total = checkboxes.length;
    let checked = 0;
    
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        checked = checked + 1;
      }
    }
    
    let percent = total === 0 ? 0 : Math.round((checked / total) * 100);
    
    if (progressCountSpan) progressCountSpan.textContent = checked;
    if (totalTasksSpan) totalTasksSpan.textContent = total;
    if (progressBar) {
      progressBar.style.width = percent + "%";
      progressBar.textContent = percent + "%";
    }
  }

  function setupCheckboxes() {
    let checkboxes = document.querySelectorAll(".task-checkbox");
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].addEventListener("change", updateProgress);
    }
  }

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
  });

  setupCheckboxes();
  updateProgress();
}

let joinStudyBtn = document.getElementById("join_study_btn");
if (joinStudyBtn) {
  joinStudyBtn.addEventListener("click", function() {
    alert("Coming soon!");
  });
}

let addClassBtn = document.getElementById("add_class_btn");
if (addClassBtn) {
  addClassBtn.addEventListener("click", function() {
    alert("Coming soon!");
  });
}

let addStudyBtn = document.getElementById("add_study_btn");
if (addStudyBtn) {
  addStudyBtn.addEventListener("click", function() {
    alert("Coming soon!");
  });
}


console.log("JavaScript loaded");