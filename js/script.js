// confirms if js is connected
console.log("script.js connected");

// Gets current weather for Chicago from Open-Meteo

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

// Checks if entries_list exists to determine if we're on the home page

let entriesList = document.getElementById("entries_list");

if (entriesList) {
  let selectedMood = "😊";
  let moodBtns = document.querySelectorAll(".mood-btn");
  let saveBtn = document.getElementById("save_entry_btn");
  let journalText = document.getElementById("journal_text");

  // Load saved journal entries from localStorage
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

  // Add click listeners to mood buttons so its working
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

  // Save new journal entry to localStorage
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
  
  // Load UNCHECKED tasks from localStorage and display on Home page
  function loadTasksOnHome() {
    let deadlinesList = document.getElementById("deadlines_list");
    if (!deadlinesList) return;
    
    let savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      let tasks = JSON.parse(savedTasks);
      deadlinesList.innerHTML = "";
      
      // Only show tasks that are NOT checked (incomplete tasks)
      let incompleteTasks = [];
      for (let i = 0; i < tasks.length; i++) {
        if (!tasks[i].checked) {
          incompleteTasks.push(tasks[i]);
        }
      }
      
      let tasksToShow = incompleteTasks.slice(0, 3);
      
      for (let i = 0; i < tasksToShow.length; i++) {
        let taskLi = document.createElement("li");
        taskLi.innerHTML = tasksToShow[i].name;
        deadlinesList.appendChild(taskLi);
      }
      
      if (tasksToShow.length === 0) {
        deadlinesList.innerHTML = "<li>No pending tasks. Great job!</li>";
      }
    } else {
      deadlinesList.innerHTML = "<li>No tasks yet. Add some on Tasks page!</li>";
    }
  }
  
  loadTasksOnHome();
}

// Fetches random motivational quotes from ZenQuotes API

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

  // New quote button fetches another random quote
  let newQuoteBtn = document.getElementById("new_quote_btn");
  if (newQuoteBtn) {
    newQuoteBtn.addEventListener("click", function() {
      fetchQuote();
    });
  }
}

// Checks if add_task_btn exists 

let addTaskBtn = document.getElementById("add_task_btn");

if (addTaskBtn) {
  let taskInput = document.getElementById("new_task_input");
  let taskList = document.getElementById("task_list");
  let progressCountSpan = document.getElementById("progress_count");
  let progressBar = document.getElementById("progress_bar");
  let totalTasksSpan = document.getElementById("total_tasks");

  // Update progress bar based on how many tasks are checked
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
    
    saveTasksToLocal();
    
    // Update the Home page deadlines if we're on the Home page
    let deadlinesList = document.getElementById("deadlines_list");
    if (deadlinesList) {
      loadTasksOnHome();
    }
  }

  // Add change listeners to all checkboxes
  function setupCheckboxes() {
    let checkboxes = document.querySelectorAll(".task-checkbox");
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].addEventListener("change", updateProgress);
    }
  }

  // Save tasks to localStorage using a simple array
  function saveTasksToLocal() {
    let tasks = [];
    let taskItems = document.querySelectorAll(".task-item");
    
    for (let i = 0; i < taskItems.length; i++) {
      let checkbox = taskItems[i].querySelector(".task-checkbox");
      let span = taskItems[i].querySelector("span");
      let taskText = "";
      
      if (span) {
        taskText = span.previousSibling.nodeValue.trim();
      } else {
        taskText = taskItems[i].innerText.replace("new", "").trim();
      }
      
      tasks.push({
        name: taskText,
        checked: checkbox ? checkbox.checked : false
      });
    }
    
    localStorage.setItem("tasks", JSON.stringify(tasks));
    console.log("Tasks saved:", tasks);
  }

  // Function to reload tasks on Home page (made global so Home page can call it)
  window.loadTasksOnHome = function() {
    let deadlinesList = document.getElementById("deadlines_list");
    if (!deadlinesList) return;
    
    let savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      let tasks = JSON.parse(savedTasks);
      deadlinesList.innerHTML = "";
      
      // Only show tasks that are NOT checked (incomplete tasks)
      let incompleteTasks = [];
      for (let i = 0; i < tasks.length; i++) {
        if (!tasks[i].checked) {
          incompleteTasks.push(tasks[i]);
        }
      }
      
      let tasksToShow = incompleteTasks.slice(0, 3);
      
      for (let i = 0; i < tasksToShow.length; i++) {
        let taskLi = document.createElement("li");
        taskLi.innerHTML = tasksToShow[i].name;
        deadlinesList.appendChild(taskLi);
      }
      
      if (tasksToShow.length === 0) {
        deadlinesList.innerHTML = "<li>No pending tasks. Great job!</li>";
      }
    } else {
      deadlinesList.innerHTML = "<li>No tasks yet. Add some on Tasks page!</li>";
    }
  };

  // Load tasks from localStorage
  function loadTasksFromLocal() {
    let savedTasks = localStorage.getItem("tasks");
    console.log("Loading tasks from localStorage:", savedTasks);
    
    if (savedTasks && taskList) {
      let tasks = JSON.parse(savedTasks);
      taskList.innerHTML = "";
      
      for (let i = 0; i < tasks.length; i++) {
        let newLi = document.createElement("li");
        newLi.className = "task-item";
        let checkedAttr = tasks[i].checked ? 'checked' : '';
        newLi.innerHTML = '<input type="checkbox" class="task-checkbox" ' + checkedAttr + '> ' + tasks[i].name + ' <span class="badge-secondary">task</span>';
        taskList.appendChild(newLi);
      }
      
      setupCheckboxes();
      updateProgress();
    }
  }

  // Add a new task to the list
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
    
    saveTasksToLocal();
    updateProgress();
    
    console.log("Task added:", taskName);
  });

  setupCheckboxes();
  loadTasksFromLocal();
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