// Define UI Vars
const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');

// Target elements for state event listeners
const checkboxInput = document.querySelector("input[type=checkbox]");
const checkboxLabel = document.querySelector("label[for=checkbox]");
const checkboxContainer = document.querySelector("span.checkbox-container");

// TODO
// Add script for toggle "check box"
// and crossing out animation
// Add script for toggle "close box"

// Load all event listeners
loadEventListeners();

// Load all event listeners
function loadEventListeners() {
    // DOM Load event
    document.addEventListener('DOMContentLoaded', getTasks);
    // Add task event
    form.addEventListener('submit', addTask, false);
    // Remove task event
    taskList.addEventListener('click', removeTask);
    // Clear task event
    clearBtn.addEventListener('click', clearTasks);
    // Filter tasks event
    filter.addEventListener('keyup', filterTasks);
}

// Get Tasks from LS
function getTasks() {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(function (task) {

        console.log("Creating", task);

        // Create li element
        const li = document.createElement('li');

        const checkboxIcon = document.createElement('span');
        checkboxIcon.className = "checkbox-container";
        checkboxIcon.setAttribute("aria-hidden", "true");

        const checkboxInput = document.createElement('input');
        checkboxInput.setAttribute("id", "checkbox");
        checkboxInput.setAttribute("type", "checkbox");

        const label = document.createElement('label');
        label.setAttribute("for", "checkbox");

        const closeboxIcon = document.createElement('span');
        closeboxIcon.className = "closebox-container";
        // ! Possibility for tooltip or similar here...
        closeboxIcon.setAttribute("aria-hidden", "true");

        label.appendChild(document.createTextNode(task));

        li.appendChild(checkboxIcon);
        li.appendChild(checkboxInput);
        li.appendChild(label);
        li.appendChild(closeboxIcon);

        // add state
        checkboxInput.addEventListener('change', addState);
        checkboxLabel.addEventListener('change', addState);
        checkboxContainer.addEventListener('click', addStateByClick);

        // Append li to ul
        taskList.appendChild(li);
    });

    console.log("task retrieved");
}

// Add Task
function addTask(e) {
    if (taskInput.value === '') {
        alert('Add a task');
    }

    // Create li element
    const li = document.createElement('li');

    const checkboxIcon = document.createElement('span');
    checkboxIcon.className = "checkbox-container";
    checkboxIcon.setAttribute("aria-hidden", "true");

    const checkboxInput = document.createElement('input');
    checkboxInput.setAttribute("id", "checkbox");
    checkboxInput.setAttribute("type", "checkbox");

    const label = document.createElement('label');
    label.setAttribute("for", "checkbox");

    const closeboxIcon = document.createElement('span');
    closeboxIcon.className = "closebox-container";
    // ! Possibility for tooltip or similar here...
    closeboxIcon.setAttribute("aria-hidden", "true");

    label.appendChild(document.createTextNode(taskInput.value));

    li.appendChild(checkboxIcon);
    li.appendChild(checkboxInput);
    li.appendChild(label);
    li.appendChild(closeboxIcon);


    // Append li to ul
    taskList.appendChild(li);

    // add state
    checkboxInput.addEventListener('change', addState);
    checkboxLabel.addEventListener('change', addState);
    checkboxContainer.addEventListener('click', addStateByClick);

    // Store in LS
    storeTaskInLocalStorage(taskInput.value);

    // Clear input
    taskInput.value = '';

    e.preventDefault();

    console.log("task created");
}

// Store Task
function storeTaskInLocalStorage(task) {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasks));
}


// Remove Task
function removeTask(e) {
    if (e.target.classList.contains('closebox-container')) {
        if (confirm('Are You Sure?')) {
            e.target.parentElement.remove();

            // Remove from LS
            removeTaskFromLocalStorage(e.target.parentElement);
        }
    }
}

// Remove from LS
function removeTaskFromLocalStorage(taskItem) {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(function (task, index) {
        if (taskItem.textContent === task) {
            tasks.splice(index, 1);
        }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Clear Tasks
function clearTasks() {
    // taskList.innerHTML = '';

    // Faster
    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }

    // https://jsperf.com/innerhtml-vs-removechild

    // Clear from LS
    clearTasksFromLocalStorage();
}

// Clear Tasks from LS
function clearTasksFromLocalStorage() {
    localStorage.clear();
}

// Filter Tasks
function filterTasks(e) {
    const text = e.target.value.toLowerCase();

    document.querySelectorAll("label[for='checkbox']").forEach(function (task) {
        const item = task.textContent;
        if (item.toLowerCase().indexOf(text) != -1) {
            task.parentElement.style.display = 'block';
        } else {
            task.parentElement.style.display = 'none';
        }
    });
}

// # Toggle State of Input

// if state "change" add class "checked"
function addState() {
    if (this.checked) {
        console.log("Checked!");
        checkboxContainer.classList.add("checked");

    } else {
        console.log("Unchecked");
        checkboxContainer.classList.remove("checked");
    }
}

function addStateByClick() {
    if (!checkboxInput.checked) {
        console.log("Checked!");
        checkboxContainer.classList.add("checked");
        checkboxInput.checked = true;
    } else {
        console.log("Unchecked");
        checkboxContainer.classList.remove("checked");
        checkboxInput.checked = false;
    }
}