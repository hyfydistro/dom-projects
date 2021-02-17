"use strict";

// =============
// Media Queries
// =============
const mainElement = document.querySelector("main");
const formTaskBtn = document.querySelector(".form-task__btn");
const h1Title = document.querySelector(".title"); // Re-Position h1 .title

const mq = window.matchMedia("(min-width: 600px)");

if (mq.matches) {
  // Move h1 .title element
  console.log("pass - is Large Screen");
  mainElement.insertAdjacentElement('afterbegin', h1Title);
}

function isLargeScreen() {
  if (window.innerWidth >= 600) {
    // Move h1 .title element
    console.log("pass - is Large Screen");
    mainElement.insertAdjacentElement('afterbegin', h1Title);
  } else {
    formTaskBtn.insertAdjacentElement('afterend', h1Title);
    console.log("pass - is Large Screen Flex");
  }
}

window.addEventListener("resize", isLargeScreen);
"use strict";

// Model - View - Controller (MVC) Pattern used + StorageCtrl with LocalStorage interactions
// todo
// Clean Code and comments
function getUniqueId() {
  if (window.crypto && window.crypto.getRandomValues) {
    return window.crypto.getRandomValues(new Uint32Array(1))[0];
  } else {
    return Math.random();
  }
} // ==================
// Storage Controller
// ==================
// - Local Storage
// NB: "item" may also be referred to data from LocalStorage


const Storage = function () {
  // Public methods
  return {
    addItem: function (newTaskData) {
      // ! Log
      // console.log("persisting to LS...")
      let items; // Check for available item in LS

      if (localStorage.getItem("tasks") === null) {
        items = []; // Push new item

        items.push(newTaskData); // ! Log
        // console.log("Creating new Storage 'tasks'");
        // Set LS

        localStorage.setItem("tasks", JSON.stringify(items));
      } else {
        // Get available item in LS
        items = JSON.parse(localStorage.getItem("tasks")); // ! Log
        // console.log("Getting available Storage: ", items);
        // Push new item

        items.push(newTaskData); // Re-Set LS

        localStorage.setItem("tasks", JSON.stringify(items));
      }
    },
    getItems: function () {
      let items;

      if (localStorage.getItem("tasks") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("tasks"));
      }

      return items;
    },
    updateItem: function (updateTaskData) {
      let items = JSON.parse(localStorage.getItem("tasks"));
      items.forEach(function (item, index) {
        if (updateTaskData.id == item.id) {
          items.splice(index, 1, updateTaskData);
        }
      });
      localStorage.setItem("tasks", JSON.stringify(items));
    },
    deleteItem: function (id) {
      let items = JSON.parse(localStorage.getItem("tasks"));
      items.forEach(function (item, index) {
        if (id == item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("tasks", JSON.stringify(items));
    },
    clearItems: function () {
      localStorage.removeItem("tasks");
    }
  };
}(); // =====
// Model
// =====
// - Local Data


const Model = function () {
  // Model Constructor
  const ModelConstructor = function (id = getUniqueId(), title, date = "", memo = "", pin = false, color = "none", completed = false) {
    this.id = id;
    this.title = title;
    this.date = date;
    this.memo = memo;
    this.pin = pin;
    this.color = color;
    this.completed = completed;
  }; // Data Structure
  // - state: "completed", "pin"


  const data = {
    // items: [
    //     {
    //         "id": getUniqueId(),
    //         "title": "Walk the dog",
    //         "memo": "Walk for half an hour",
    //         "date": "",
    //         "pin": false,
    //         "color": "none",
    //         "completed": false
    //     },
    //     {
    //         "id": getUniqueId(),
    //         "title": "Water the plant",
    //         "memo": "",
    //         "date": "01/01/20",
    //         "pin": false,
    //         "color": "red",
    //         "completed": false
    //     },
    //     {
    //         "id": getUniqueId(),
    //         "title": "Water the plant again",
    //         "memo": "",
    //         "date": "01/01/20",
    //         "pin": true,
    //         "color": "none",
    //         "completed": false
    //     },
    //     {
    //         "id": getUniqueId(),
    //         "title": "Do grocery",
    //         "memo": "",
    //         "date": "",
    //         "pin": true,
    //         "color": "none",
    //         "completed": true
    //     },
    //     {
    //         "id": getUniqueId(),
    //         "title": "Sing song",
    //         "memo": "",
    //         "date": "",
    //         "pin": false,
    //         "color": "none",
    //         "completed": true
    //     }
    // ],
    items: Storage.getItems(),
    currentItem: null
  }; // Public Methods

  return {
    logData: function () {
      return data;
    },
    getItems: function () {
      return data.items;
    },
    addQuickTask: function (quickTaskInput) {
      // ! Log
      // console.log(quickTaskInput);
      // Create new task
      const newTaskData = new ModelConstructor(undefined, quickTaskInput); // ! Log
      // console.log(newTaskData);
      // Add to items Array

      data.items.push(newTaskData);
      return newTaskData;
    },
    addFormTask: function (taskInput, dateInput, memoInput, pinBoolean, colorSelect) {
      // ! Log
      // console.log(taskInput, dateInput, memoInput, pinBoolean, colorSelect);
      // Create new task
      const newTaskData = new ModelConstructor(undefined, taskInput, dateInput, memoInput, pinBoolean, colorSelect); // ! Log
      // console.log(newTaskData);
      // Add to items Array

      data.items.push(newTaskData);
      return newTaskData;
    },
    getTaskById: function (id) {
      let targetTaskData = null; // Loop through items

      data.items.forEach(function (item) {
        if (item.id == id) {
          targetTaskData = item;
        }
      }); // ! Log
      // console.log("Fetching targeted item is", targetTaskData);

      return targetTaskData;
    },
    setCurrentTask: function (tasktoEditData) {
      data.currentItem = tasktoEditData;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    updateDataFromEditTask: function (taskInput, dateInput, memoInput, pinBoolean, colorSelect) {
      let targetTaskData = null;
      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          // Set new values
          item.title = taskInput;
          item.date = dateInput;
          item.memo = memoInput;
          item.pin = pinBoolean;
          item.color = colorSelect;
          targetTaskData = item;
        }
      });
      return targetTaskData;
    },
    updateCurrentTaskCheckedData: function (completedStatus) {
      let targetTaskData = null;
      data.items.forEach(function (item) {
        if (item.id == data.currentItem.id) {
          // Set property "completed" to `true`
          item.completed = completedStatus; // ! Log
          // console.log("Current task complete is", item.completed)

          targetTaskData = item;
        }
      });
      return targetTaskData;
    },
    deleteItem: function (id) {
      // ! Log
      // console.log("Deleting data...")
      // Get an Array of ids
      const ids = data.items.map(function (item) {
        return item.id;
      }); // Get index of target task component id

      const index = ids.indexOf(id); // Remove item

      data.items.splice(index, 1);
    }
  };
}(); // ====
// View
// ====
// - Anything to do with the UI


const View = function () {
  // UI selectors' name
  const UISelectors = {
    wholeLists: ".list__wrapper",
    listComponent: ".list-component",
    // Quick "Add Task" Selectors
    quickTaskInput: ".add-task__input",
    quickTaskBtn: ".add-task__btn",
    // Lists Selectors
    mainList: ".main-list",
    completedList: ".completed-list",
    // Form Selectors
    addFormOpenbtn: ".form-task__btn",
    addForm: ".form-task__wrapper",
    editForm: ".edit-task__wrapper",
    overlay: ".overlay__module",
    // Clear List Selectors
    clearListMenu: ".delete-confirmation__module",
    deleteCancelBtn: ".delete-confirmation-cancel__btn",
    deleteConfirmBtn: ".delete-confirmation-confirm__btn",
    openClearListMenuBtn: ".clear-list__btn"
  }; // UI element

  const UIElements = {
    // "Form Task" Form
    addFormCancelBtn: document.querySelector(".form-task__module").children[0].firstElementChild,
    addFormTaskInput: document.querySelector(".form-task__module").children[1].children[0].lastElementChild,
    addFormDateInput: document.querySelector(".form-task__module").children[1].children[1].lastElementChild,
    addFormMemoInput: document.querySelector(".form-task__module").children[1].children[2].lastElementChild,
    addFormPinInput: document.querySelector(".form-task__module").children[1].children[3].lastElementChild.firstElementChild,
    addFormColorInputRed: document.querySelector(".form-task__module").children[1].children[4].children[1].children[0],
    addFormColorInputYellow: document.querySelector(".form-task__module").children[1].children[4].children[1].children[2],
    addFormColorInputBlue: document.querySelector(".form-task__module").children[1].children[4].children[1].children[4],
    addFormColorInputGreen: document.querySelector(".form-task__module").children[1].children[4].children[1].children[6],
    addFormColorInputNone: document.querySelector(".form-task__module").children[1].children[4].children[1].children[8],
    addFormSubmitBtn: document.querySelector(".form-task__module").children[1].children[4].children[2],
    // "Edit Task" Form
    editFormCancelBtn: document.querySelector(".edit-task__module").children[0].firstElementChild,
    editFormUpdateBtn: document.querySelector(".edit-task__module").children[0].lastElementChild,
    editFormTaskInput: document.querySelector(".edit-task__module").children[1].children[0].lastElementChild,
    editFormDateInput: document.querySelector(".edit-task__module").children[1].children[1].lastElementChild,
    editFormMemoInput: document.querySelector(".edit-task__module").children[1].children[2].lastElementChild,
    editFormPinInput: document.querySelector(".edit-task__module").children[1].children[3].lastElementChild.firstElementChild,
    editFormColorInputRed: document.querySelector(".edit-task__module").children[1].children[4].children[1].children[0],
    editFormColorInputYellow: document.querySelector(".edit-task__module").children[1].children[4].children[1].children[2],
    editFormColorInputBlue: document.querySelector(".edit-task__module").children[1].children[4].children[1].children[4],
    editFormColorInputGreen: document.querySelector(".edit-task__module").children[1].children[4].children[1].children[6],
    editFormColorInputNone: document.querySelector(".edit-task__module").children[1].children[4].children[1].children[8],
    editFormDeleteBtn: document.querySelector(".edit-task__module").children[1].children[4].children[2]
  };

  const render = function (taskData) {
    const listComponent = document.createElement("div");
    listComponent.classList.add("list-component"); // Add Unique ID

    listComponent.id = taskData["id"]; // ! Log
    // console.log(listComponent.id);
    // List Component - First Block

    const listComponentFirstBlock = document.createElement("div");
    listComponentFirstBlock.classList.add("list-component__first-block"); // List Component - First Block - Components
    // Pin to the Top

    const pinComponent = document.createElement("div");
    pinComponent.classList.add("pin__wrapper");
    const pinIcon = document.createElement("i");
    pinIcon.classList.add("fa", "fa-thumb-tack");

    if (!taskData["pin"]) {
      pinIcon.classList.add("invisible");
    }

    pinIcon.setAttribute("aria-hidden", "true");
    pinComponent.appendChild(pinIcon); // Checkbox

    const checkboxComponent = document.createElement("label");
    checkboxComponent.classList.add("checkbox"); // checkboxComponent.setAttribute("for", "check");
    // Checkbox - Icon

    const checkboxIcon = document.createElement("input");
    checkboxIcon.id = "check";
    checkboxIcon.type = "checkbox";
    checkboxIcon.checked = taskData["completed"];
    checkboxIcon.classList.add("check"); // ! Log
    // console.log("CheckboxIcon", checkboxIcon.checked);
    // Checkbox - Label

    const checkboxLabel = document.createElement("span");
    checkboxLabel.classList.add("text-label"); // Checkbox - Label - Create TextNode

    const checkboxLabelText = document.createTextNode(taskData["title"]);
    checkboxLabel.append(checkboxLabelText); // ! Log
    // console.log("rendering label:", checkboxLabel);
    // console.log("rendering label text:", checkboxLabelText);
    // console.log("rendering label text data:", taskData["title"]);

    checkboxComponent.appendChild(checkboxIcon);
    checkboxComponent.appendChild(checkboxLabel); // Due Date

    const dueDateComponent = document.createElement("div");
    dueDateComponent.classList.add("due-date"); // Due Date - Span Element

    const dueDateSpan = document.createElement("span");
    dueDateSpan.classList.add("text-date");

    if (taskData["date"]) {
      // Due Date - Create TextNode
      const dueDateText = document.createTextNode(taskData["date"]);
      dueDateSpan.append(dueDateText);
    }

    dueDateComponent.appendChild(dueDateSpan); // Ellipses

    const ellipsisComponent = document.createElement("div");
    ellipsisComponent.classList.add("ellipses__wrapper"); // Ellipses - Icon

    const ellipsisIcon = document.createElement("i");
    ellipsisIcon.classList.add("fa", "fa-ellipsis-h");
    ellipsisIcon.setAttribute("aria-hidden", "true");
    ellipsisComponent.appendChild(ellipsisIcon); // Stick Color

    const stickyColorComponent = document.createElement("div");
    stickyColorComponent.classList.add("sticky-color"); // ! Log
    // console.log("Rendering Sticky Color:", taskData["color"]);

    if (taskData["color"] != "none") {
      // ! Log
      // console.log("Adding class Sticky Color:", taskData["color"]);
      stickyColorComponent.classList.add(taskData["color"]);
    } else {
      // ! Log
      // console.log("Rendering Sticky Color: ", "none");
      stickyColorComponent.classList.add("none");
    } // List Component - Second Block


    const listComponentSecondBlock = document.createElement("div");
    listComponentSecondBlock.classList.add("list-component__second-block"); // Memo

    const memoSpan = document.createElement("span");
    memoSpan.classList.add("text-memo");

    if (taskData["memo"]) {
      // Memo - Create TextNode
      const memoText = document.createTextNode(taskData["memo"]);
      memoSpan.append(memoText);
    } else {
      listComponentSecondBlock.classList.add("hidden");
    }

    listComponentSecondBlock.appendChild(memoSpan); // Putting it all together...

    listComponentFirstBlock.append(pinComponent, checkboxComponent, dueDateComponent, ellipsisComponent, stickyColorComponent);
    listComponent.appendChild(listComponentFirstBlock);
    listComponent.appendChild(listComponentSecondBlock); // ! Log
    // console.log(listComponent);

    return listComponent;
  }; // Public Methods


  return {
    populateList: function (items, completedStatus) {
      // ! Log
      // console.log("The Completed Status is", completedStatus);
      // If completed status is available,
      // populate for BOTH Main List and Completed List
      // If not, populate for Main List ONLY
      if (completedStatus) {
        // Show Completed List
        View.showCompletedList();
        items.forEach(function (item) {
          let task = render(item); // ! Log
          // console.log("populating:", task);
          // Filter Main List and Completed List

          if (item.completed === false) {
            // ! Log
            // console.log("populatin Main list...")
            if (item.pin) {
              document.querySelector(UISelectors.mainList).insertAdjacentElement("afterbegin", task);
            } else {
              document.querySelector(UISelectors.mainList).append(task);
            }
          } else {
            // ! Log
            // console.log("populating Completed list...")
            // Append to Completed List
            if (item.pin) {
              document.querySelector(UISelectors.completedList).firstElementChild.insertAdjacentElement("afterend", task);
            } else {
              document.querySelector(UISelectors.completedList).append(task);
            }
          }
        });
      } else {
        View.hideCompletedList(); // ! Log
        // console.log("No Completed List, populatin Main list...")

        items.forEach(function (item) {
          let task = render(item);

          if (item.pin) {
            document.querySelector(UISelectors.mainList).insertAdjacentElement("afterbegin", task);
          } else {
            document.querySelector(UISelectors.mainList).append(task);
          }
        });
      }
    },
    getSelectors: function () {
      return UISelectors;
    },
    getElements: function () {
      return UIElements;
    },
    getQuickTaskInput: function () {
      return document.querySelector(UISelectors.quickTaskInput).value;
    },
    addTaskToMainList: function (newTaskData) {
      // Create elements
      const newTask = render(newTaskData); // Insert new list component to DOM

      document.querySelector(UISelectors.mainList).insertAdjacentElement('beforeend', newTask);
    },
    addTaskToMainListPinned: function (newTaskData) {
      // Create elements
      const newTask = render(newTaskData); // Insert new list component to DOM

      document.querySelector(UISelectors.mainList).insertAdjacentElement('afterbegin', newTask);
    },
    clearQuickAddTaskInput: function () {
      document.querySelector(UISelectors.quickTaskInput).value = "";
    },
    hideCompletedList: function () {
      document.querySelector(UISelectors.completedList).style.display = "none";
    },
    showCompletedList: function () {
      document.querySelector(UISelectors.completedList).style.display = "block";
    },
    openFormTask: function () {
      // ! Log
      // console.log("open Form Task");
      document.querySelector(UISelectors.overlay).classList.remove("hidden");
      document.querySelector(UISelectors.addForm).classList.remove("hidden");
    },
    closeFormTask: function () {
      // ! Log
      // console.log("Close Form Task");
      document.querySelector(UISelectors.overlay).classList.add("hidden");
      document.querySelector(UISelectors.addForm).classList.add("hidden");
    },
    getFormTaskTaskInput: function () {
      return UIElements.addFormTaskInput.value;
    },
    getFormTaskDateInput: function () {
      let formatDate = UIElements.addFormDateInput.value.replaceAll("-", "/"); // ! Log
      // console.log("date format", formatDate);

      return formatDate;
    },
    getFormTaskMemoInput: function () {
      return UIElements.addFormMemoInput.value;
    },
    getFormTaskPinBoolean: function () {
      return UIElements.addFormPinInput.checked;
    },
    getFormTaskColorSelect: function () {
      let colorValue; // ! Log
      // console.log("color Red is", UIElements.addFormColorInputRed.checked);
      // console.log("color Yellow is", UIElements.addFormColorInputYellow.checked);
      // console.log("color Blue is", UIElements.addFormColorInputBlue.checked);
      // console.log("color Green is", UIElements.addFormColorInputGreen.checked);
      // console.log("color None is", UIElements.addFormColorInputNone.checked);
      // Find Value

      if (UIElements.addFormColorInputRed.checked || UIElements.addFormColorInputYellow.checked || UIElements.addFormColorInputBlue.checked || UIElements.addFormColorInputGreen.checked || UIElements.addFormColorInputNone.checked) {
        if (UIElements.addFormColorInputRed.checked) {
          // ! Log
          // console.log("If - red");
          colorValue = UIElements.addFormColorInputRed.value;
        }

        if (UIElements.addFormColorInputYellow.checked) {
          // ! Log
          // console.log("If - yellow");
          colorValue = UIElements.addFormColorInputYellow.value;
        }

        if (UIElements.addFormColorInputBlue.checked) {
          // ! Log
          // console.log("If - yellow");
          colorValue = UIElements.addFormColorInputBlue.value;
        }

        if (UIElements.addFormColorInputGreen.checked) {
          // ! Log
          // console.log("If - yellow");
          colorValue = UIElements.addFormColorInputGreen.value;
        }

        if (UIElements.addFormColorInputNone.checked) {
          // ! Log
          // console.log("If - none");
          colorValue = UIElements.addFormColorInputNone.value;
        }
      } else {
        colorValue = UIElements.addFormColorInputNone.value;
      } // ! Log
      // console.log("color", colorValue);


      return colorValue;
    },
    clearFormTaskFields: function () {
      UIElements.addFormTaskInput.value = "";
      UIElements.addFormDateInput.value = "";
      UIElements.addFormMemoInput.value = "";
      UIElements.addFormPinInput.checked = false;
      UIElements.addFormColorInputRed.checked = false;
      UIElements.addFormColorInputYellow.checked = false;
      UIElements.addFormColorInputBlue.checked = false;
      UIElements.addFormColorInputGreen.checked = false;
      UIElements.addFormColorInputNone.checked = false;
    },
    addItemtoEditTask: function () {
      // Set current task component's values to "Edit Task" module
      UIElements.editFormTaskInput.value = Model.getCurrentItem().title;
      UIElements.editFormDateInput.value = Model.getCurrentItem().date;
      UIElements.editFormMemoInput.value = Model.getCurrentItem().memo;
      UIElements.editFormPinInput.checked = Model.getCurrentItem().pin; // Set color from selection

      switch (Model.getCurrentItem().color) {
        case "red":
          UIElements.editFormColorInputRed.checked = true;
          break;

        case "yellow":
          UIElements.editFormColorInputYellow.checked = true;
          break;

        case "blue":
          UIElements.editFormColorInputBlue.checked = true;
          break;

        case "green":
          UIElements.editFormColorInputGreen.checked = true;
          break;

        default:
          UIElements.editFormColorInputNone.checked = true;
      }

      View.openEditTask();
    },
    openEditTask: function () {
      // ! Log
      // console.log("open Edit Task");
      document.querySelector(UISelectors.overlay).classList.remove("hidden");
      document.querySelector(UISelectors.editForm).classList.remove("hidden");
    },
    closeEditTask: function () {
      // ! Log
      // console.log("Close Edit Task");
      document.querySelector(UISelectors.overlay).classList.add("hidden");
      document.querySelector(UISelectors.editForm).classList.add("hidden");
    },
    getEditTaskTaskInput: function () {
      return UIElements.editFormTaskInput.value;
    },
    getEditTaskDateInput: function () {
      let formatDate = UIElements.editFormDateInput.value.replaceAll("-", "/"); // ! Log
      // console.log("date format in Edit Task", formatDate);

      return formatDate;
    },
    getEditTaskMemoInput: function () {
      return UIElements.editFormMemoInput.value;
    },
    getEditTaskPinBoolean: function () {
      return UIElements.editFormPinInput.checked;
    },
    getEditTaskColorSelect: function () {
      let colorValue; // ! Log
      // console.log("Checking in Edit Task...")
      // console.log("Checking in Edit Task...")
      // console.log("color Red is", UIElements.editFormColorInputRed.checked);
      // console.log("color Yellow is", UIElements.editFormColorInputYellow.checked);
      // console.log("color Blue is", UIElements.editFormColorInputBlue.checked);
      // console.log("color Green is", UIElements.addFormColorInputGreen.checked);
      // console.log("color None is", UIElements.addFormColorInputNone.checked);
      // Find Value

      switch (UIElements.editFormColorInputRed.checked || UIElements.editFormColorInputYellow.checked || UIElements.editFormColorInputBlue.checked || UIElements.editFormColorInputGreen.checked || UIElements.editFormColorInputNone.checked) {
        case UIElements.editFormColorInputRed.checked:
          // ! Log
          // console.log("Switch - red");
          colorValue = UIElements.editFormColorInputRed.value;
          break;

        case UIElements.editFormColorInputYellow.checked:
          // ! Log
          // console.log("Switch - yellow");
          colorValue = UIElements.editFormColorInputYellow.value;
          break;

        case UIElements.editFormColorInputBlue.checked:
          colorValue = UIElements.editFormColorInputBlue.value;
          break;

        case UIElements.editFormColorInputGreen.checked:
          // ! Log
          // console.log("Switch - green");
          colorValue = UIElements.editFormColorInputGreen.value;
          break;

        default:
          // ! Log
          // console.log("Switch - default none");
          colorValue = UIElements.editFormColorInputNone.value;
      } // ! Log


      console.log("color", colorValue);
      return colorValue;
    },
    updateTaskDisplayFromEditTask: function (updateTaskData) {
      // Search for targeted list component
      let taskComponents = document.querySelectorAll(UISelectors.listComponent); // ! Log
      // console.log("Looping:", taskComponents);
      // Turn Node list into array

      taskComponents = Array.from(taskComponents);
      taskComponents.forEach(taskComponent => {
        const taskId = taskComponent.id; // ! Log
        // console.log("pass id", taskId);

        if (taskId == updateTaskData.id) {
          // Update UI
          const currentTaskComponentUI = document.getElementById("".concat(taskId)); // ! Log
          // console.log(currentTaskComponentUI);
          // ! Log
          // console.log("using data", updateTaskData);

          let newDisplayTaskComponent = render(updateTaskData); // Check if new task is completed

          if (updateTaskData.completed == true) {
            // Check if completed task is pinned
            if (updateTaskData.pin == true) {
              // Add new and update task component
              document.querySelector(UISelectors.completedList).insertAdjacentElement("afterbegin", newDisplayTaskComponent); // Remove old task component

              currentTaskComponentUI.remove();
            } else {
              // Add new and update task component
              currentTaskComponentUI.parentNode.replaceChild(newDisplayTaskComponent, currentTaskComponentUI);
            }
          } else {
            // Check if uncompleted task is true
            if (updateTaskData.pin == true) {
              // Check if uncompleted task is pinned
              document.querySelector(UISelectors.mainList).insertAdjacentElement("afterbegin", newDisplayTaskComponent); // Remove old task component

              currentTaskComponentUI.remove();
            } else {
              // Add new and update task component
              currentTaskComponentUI.parentNode.replaceChild(newDisplayTaskComponent, currentTaskComponentUI);
            }
          }

          View.closeEditTask();
        }
      });
    },
    deleteTaskDisplayFromEditTask: function (id) {
      document.getElementById(id).remove();
      View.closeEditTask();
    },
    openClearListMenu: function () {
      document.querySelector(UISelectors.overlay).classList.remove("hidden");
      document.querySelector(UISelectors.clearListMenu).classList.remove("hidden");
    },
    closeClearListMenu: function () {
      document.querySelector(UISelectors.overlay).classList.add("hidden");
      document.querySelector(UISelectors.clearListMenu).classList.add("hidden");
    },
    clearLists: function () {
      let mainList = document.querySelector(UISelectors.mainList);
      const completedList = document.querySelector(UISelectors.completedList);

      while (mainList.firstChild) {
        mainList.removeChild(mainList.firstChild);
      }

      while (completedList.firstChild) {
        completedList.removeChild(completedList.firstChild);
      }
    }
  };
}(); // ==========
// Controller
// ==========
// - main controller
// - Where everything will meet
// - initial event listeners
// - init function


const Controller = function (Model, View, Storage) {
  // Load Event Listeners
  const loadEventListeners = function () {
    // Get UI selectors
    const UISelectors = View.getSelectors();
    const UIElements = View.getElements(); // Add Quick "Add Task" event - Submit input

    document.querySelector(UISelectors.quickTaskBtn).addEventListener("click", quickAddTaskSubmit); // Add "Form Task" event - Open "Form Task" module

    document.querySelector(UISelectors.addFormOpenbtn).addEventListener("click", View.openFormTask); // Add "Form Task" Cancel button event - Close "Form Task" module

    UIElements.addFormCancelBtn.addEventListener("click", View.closeFormTask); // Add "Form Task" event - Submit inputs

    UIElements.addFormSubmitBtn.addEventListener("click", formTaskSubmit); // Add task component ellipsis - Open "Edit Task" module

    document.querySelector(UISelectors.wholeLists).addEventListener("click", clickedEditTask); // Add "Edit Task" Update button event - Submit inputs

    UIElements.editFormUpdateBtn.addEventListener("click", editTaskSubmit); // Add "Edit Task" Cancel button event - Close "Edit Task" module

    UIElements.editFormCancelBtn.addEventListener("click", View.closeEditTask); // Add "Edit Task" Delete button event - Delete task component

    UIElements.editFormDeleteBtn.addEventListener("click", editTaskDeleteSubmit); // Add checkbox event - Update data when checked or unchecked

    document.querySelector(UISelectors.wholeLists).addEventListener("click", checkedTaskAndUpateData); // Add "Clear List" event - Open "Clear List" Menu

    document.querySelector(UISelectors.openClearListMenuBtn).addEventListener("click", View.openClearListMenu); // Add "Clear List" event - Close "Clear List" Menu

    document.querySelector(UISelectors.deleteCancelBtn).addEventListener("click", View.closeClearListMenu); // Add "Clear List" event - Clear Main and Completed List

    document.querySelector(UISelectors.deleteConfirmBtn).addEventListener("click", clearLists); // ? Feature - yes, no, yes, no?
    // Disable submit on "Enter" key for "Form Task" and "Edit Task" Inputs
    // Otherwise, catastrophe may follow
    // document.addEventListener("keypress", function(e) {
    //     if (e.keyCode === 13 || e.which === 13) {
    //         e.preventDefault();
    //         return false;
    //     }
    // });
  }; // Add Quick "Add Task" submit


  const quickAddTaskSubmit = function (e) {
    // ! Log
    // console.log("Quick Add Task")
    // Get input value
    const input = View.getQuickTaskInput(); // Validate
    // ? Suggestions: Use RegExp

    if (input !== "") {
      // ! Log
      // console.log("Quick Add Task: Validating")
      // Add input value to Data, and
      // Get default data setup for UI
      const newTaskData = Model.addQuickTask(input); // Add new task to UI list

      View.addTaskToMainList(newTaskData); // Add to LS

      Storage.addItem(newTaskData); // Clear input field

      View.clearQuickAddTaskInput();
    } // ! Log
    // console.log(input);


    e.preventDefault();
  }; // Add "Form Task" Submit


  const formTaskSubmit = function (e) {
    // ! Log
    // console.log("Form Task - Add Customised Task");
    // Get Values
    const taskInput = View.getFormTaskTaskInput();
    const dateInput = View.getFormTaskDateInput();
    const memoInput = View.getFormTaskMemoInput();
    const pinBoolean = View.getFormTaskPinBoolean();
    const colorSelect = View.getFormTaskColorSelect(); // Validate
    // ? Suggestions: Use RegExp

    if (taskInput !== "") {
      // ! Log
      // console.log("Form Task: Validating")
      // Add input value to Data, and
      // Get default data setup for UI
      const newTaskData = Model.addFormTask(taskInput, dateInput, memoInput, pinBoolean, colorSelect); // Add new task to UI list
      // If pinBoolean is true, Pin to the Top

      if (pinBoolean) {
        View.addTaskToMainListPinned(newTaskData);
      } else {
        View.addTaskToMainList(newTaskData);
      } // Add to LS


      Storage.addItem(newTaskData); // Clear all "Form Task" fields

      View.clearFormTaskFields(); // Close "Form Task" module

      View.closeFormTask();
    }

    e.preventDefault();
  }; // Open and set "Edit Task" module


  const clickedEditTask = function (e) {
    // use event delegation via `e.target` to find element
    if (e.target.classList.contains("ellipses__wrapper")) {
      // ! Log
      // console.log("Edit Clicked!");
      // Get task component id
      const currentTaskId = e.target.parentNode.parentNode.id; // ! Log
      // console.log("current task ID", currentTaskId);
      // Get task component id from Data

      const TasktoEditData = Model.getTaskById(currentTaskId); // ! Log
      // console.log(TasktoEditData);
      // Set task component as "currentItem" i.e. makes locating it easier and etc.
      // ... and editing purpose

      Model.setCurrentTask(TasktoEditData); // Add current task component data to "Edit Task" Form to display

      View.addItemtoEditTask();
    }
  }; // Update "Edit Task" Submit


  const editTaskSubmit = function (e) {
    e.preventDefault(); // ! Log
    // console.log("Updating!");
    // Get Edit Task Inputs and Values

    const taskInput = View.getEditTaskTaskInput();
    const dateInput = View.getEditTaskDateInput();
    const memoInput = View.getEditTaskMemoInput();
    const pinBoolean = View.getEditTaskPinBoolean();
    const colorSelect = View.getEditTaskColorSelect(); // Update component task in data

    const updateTaskData = Model.updateDataFromEditTask(taskInput, dateInput, memoInput, pinBoolean, colorSelect); // ! Log
    // console.log("new Update data applied to database", updateTaskData)
    // Update item LS

    Storage.updateItem(updateTaskData); // Update UI

    View.updateTaskDisplayFromEditTask(updateTaskData);
    e.preventDefault();
  }; // Delete button of "Edit Task" module


  const editTaskDeleteSubmit = function (e) {
    // Get current task component
    const currentTask = Model.getCurrentItem(); // ! Log
    // console.log("Attempting to delete", currentTask);
    // Delete from data structure

    Model.deleteItem(currentTask.id); // Delete item LS

    Storage.deleteItem(currentTask.id); // Delete from UI

    View.deleteTaskDisplayFromEditTask(currentTask.id);
    e.preventDefault();
  }; // If a task is UNCHECK, update data and UI


  const checkedTaskAndUpateData = function (e) {
    if (e.target.classList.contains("check")) {
      let completedStatus = e.target.checked;
      console.log(completedStatus); // Get task component id

      const currentTaskId = e.target.parentNode.parentNode.parentNode.id; // ! Log
      // console.log("current task ID", currentTaskId);
      // Get task component id from Data

      const TasktoEditData = Model.getTaskById(currentTaskId); // ! Log
      // console.log(TasktoEditData);

      Model.setCurrentTask(TasktoEditData);
      const updateTaskData = Model.updateCurrentTaskCheckedData(completedStatus); // Update item LS

      Storage.updateItem(updateTaskData);

      if (completedStatus == true) {
        console.log("task data change to COMPLETE..."); // Do NOT update UI

        return;
      } else {
        console.log("task data change to UNCOMPLETE..."); // Fetch items from data structure

        const items = Model.getItems(); // Check if there is any "completed" task equal 'true'

        let completedStatus = findCompletedStatus(items); // Clear UI

        View.clearLists(); // Repopulate UI with update data

        View.populateList(items, completedStatus);
      }
    }
  }; // Clear Lists Data and UI


  const clearLists = function () {
    // Clear LS
    Storage.clearItems(); // Clear Lists UI

    View.clearLists();
    View.closeClearListMenu();
  }; // Find if any task component data (item) is Completed


  const findCompletedStatus = function (items) {
    for (const item of items) {
      // ! Log
      // console.log("The current property status is", item["completed"]);
      if (item["completed"]) {
        return true;
      }
    }

    return false;
  }; // Public Methods


  return {
    init: function () {
      // ! Log
      // console.log("Initialising App...")
      // Fetch items from data structure
      const items = Model.getItems(); // Check if there is any "completed" task equal 'true'

      let completedStatus = findCompletedStatus(items); // Populate List

      View.populateList(items, completedStatus); // Load event listeners

      loadEventListeners();
    }
  };
}(Model, View, Storage); // Initialise App


Controller.init();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJtdmMuanMiXSwibmFtZXMiOlsibWFpbkVsZW1lbnQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJmb3JtVGFza0J0biIsImgxVGl0bGUiLCJtcSIsIndpbmRvdyIsIm1hdGNoTWVkaWEiLCJtYXRjaGVzIiwiY29uc29sZSIsImxvZyIsImluc2VydEFkamFjZW50RWxlbWVudCIsImlzTGFyZ2VTY3JlZW4iLCJpbm5lcldpZHRoIiwiYWRkRXZlbnRMaXN0ZW5lciIsImdldFVuaXF1ZUlkIiwiY3J5cHRvIiwiZ2V0UmFuZG9tVmFsdWVzIiwiVWludDMyQXJyYXkiLCJNYXRoIiwicmFuZG9tIiwiU3RvcmFnZSIsImFkZEl0ZW0iLCJuZXdUYXNrRGF0YSIsIml0ZW1zIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInB1c2giLCJzZXRJdGVtIiwiSlNPTiIsInN0cmluZ2lmeSIsInBhcnNlIiwiZ2V0SXRlbXMiLCJ1cGRhdGVJdGVtIiwidXBkYXRlVGFza0RhdGEiLCJmb3JFYWNoIiwiaXRlbSIsImluZGV4IiwiaWQiLCJzcGxpY2UiLCJkZWxldGVJdGVtIiwiY2xlYXJJdGVtcyIsInJlbW92ZUl0ZW0iLCJNb2RlbCIsIk1vZGVsQ29uc3RydWN0b3IiLCJ0aXRsZSIsImRhdGUiLCJtZW1vIiwicGluIiwiY29sb3IiLCJjb21wbGV0ZWQiLCJkYXRhIiwiY3VycmVudEl0ZW0iLCJsb2dEYXRhIiwiYWRkUXVpY2tUYXNrIiwicXVpY2tUYXNrSW5wdXQiLCJ1bmRlZmluZWQiLCJhZGRGb3JtVGFzayIsInRhc2tJbnB1dCIsImRhdGVJbnB1dCIsIm1lbW9JbnB1dCIsInBpbkJvb2xlYW4iLCJjb2xvclNlbGVjdCIsImdldFRhc2tCeUlkIiwidGFyZ2V0VGFza0RhdGEiLCJzZXRDdXJyZW50VGFzayIsInRhc2t0b0VkaXREYXRhIiwiZ2V0Q3VycmVudEl0ZW0iLCJ1cGRhdGVEYXRhRnJvbUVkaXRUYXNrIiwidXBkYXRlQ3VycmVudFRhc2tDaGVja2VkRGF0YSIsImNvbXBsZXRlZFN0YXR1cyIsImlkcyIsIm1hcCIsImluZGV4T2YiLCJWaWV3IiwiVUlTZWxlY3RvcnMiLCJ3aG9sZUxpc3RzIiwibGlzdENvbXBvbmVudCIsInF1aWNrVGFza0J0biIsIm1haW5MaXN0IiwiY29tcGxldGVkTGlzdCIsImFkZEZvcm1PcGVuYnRuIiwiYWRkRm9ybSIsImVkaXRGb3JtIiwib3ZlcmxheSIsImNsZWFyTGlzdE1lbnUiLCJkZWxldGVDYW5jZWxCdG4iLCJkZWxldGVDb25maXJtQnRuIiwib3BlbkNsZWFyTGlzdE1lbnVCdG4iLCJVSUVsZW1lbnRzIiwiYWRkRm9ybUNhbmNlbEJ0biIsImNoaWxkcmVuIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJhZGRGb3JtVGFza0lucHV0IiwibGFzdEVsZW1lbnRDaGlsZCIsImFkZEZvcm1EYXRlSW5wdXQiLCJhZGRGb3JtTWVtb0lucHV0IiwiYWRkRm9ybVBpbklucHV0IiwiYWRkRm9ybUNvbG9ySW5wdXRSZWQiLCJhZGRGb3JtQ29sb3JJbnB1dFllbGxvdyIsImFkZEZvcm1Db2xvcklucHV0Qmx1ZSIsImFkZEZvcm1Db2xvcklucHV0R3JlZW4iLCJhZGRGb3JtQ29sb3JJbnB1dE5vbmUiLCJhZGRGb3JtU3VibWl0QnRuIiwiZWRpdEZvcm1DYW5jZWxCdG4iLCJlZGl0Rm9ybVVwZGF0ZUJ0biIsImVkaXRGb3JtVGFza0lucHV0IiwiZWRpdEZvcm1EYXRlSW5wdXQiLCJlZGl0Rm9ybU1lbW9JbnB1dCIsImVkaXRGb3JtUGluSW5wdXQiLCJlZGl0Rm9ybUNvbG9ySW5wdXRSZWQiLCJlZGl0Rm9ybUNvbG9ySW5wdXRZZWxsb3ciLCJlZGl0Rm9ybUNvbG9ySW5wdXRCbHVlIiwiZWRpdEZvcm1Db2xvcklucHV0R3JlZW4iLCJlZGl0Rm9ybUNvbG9ySW5wdXROb25lIiwiZWRpdEZvcm1EZWxldGVCdG4iLCJyZW5kZXIiLCJ0YXNrRGF0YSIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJsaXN0Q29tcG9uZW50Rmlyc3RCbG9jayIsInBpbkNvbXBvbmVudCIsInBpbkljb24iLCJzZXRBdHRyaWJ1dGUiLCJhcHBlbmRDaGlsZCIsImNoZWNrYm94Q29tcG9uZW50IiwiY2hlY2tib3hJY29uIiwidHlwZSIsImNoZWNrZWQiLCJjaGVja2JveExhYmVsIiwiY2hlY2tib3hMYWJlbFRleHQiLCJjcmVhdGVUZXh0Tm9kZSIsImFwcGVuZCIsImR1ZURhdGVDb21wb25lbnQiLCJkdWVEYXRlU3BhbiIsImR1ZURhdGVUZXh0IiwiZWxsaXBzaXNDb21wb25lbnQiLCJlbGxpcHNpc0ljb24iLCJzdGlja3lDb2xvckNvbXBvbmVudCIsImxpc3RDb21wb25lbnRTZWNvbmRCbG9jayIsIm1lbW9TcGFuIiwibWVtb1RleHQiLCJwb3B1bGF0ZUxpc3QiLCJzaG93Q29tcGxldGVkTGlzdCIsInRhc2siLCJoaWRlQ29tcGxldGVkTGlzdCIsImdldFNlbGVjdG9ycyIsImdldEVsZW1lbnRzIiwiZ2V0UXVpY2tUYXNrSW5wdXQiLCJ2YWx1ZSIsImFkZFRhc2tUb01haW5MaXN0IiwibmV3VGFzayIsImFkZFRhc2tUb01haW5MaXN0UGlubmVkIiwiY2xlYXJRdWlja0FkZFRhc2tJbnB1dCIsInN0eWxlIiwiZGlzcGxheSIsIm9wZW5Gb3JtVGFzayIsInJlbW92ZSIsImNsb3NlRm9ybVRhc2siLCJnZXRGb3JtVGFza1Rhc2tJbnB1dCIsImdldEZvcm1UYXNrRGF0ZUlucHV0IiwiZm9ybWF0RGF0ZSIsInJlcGxhY2VBbGwiLCJnZXRGb3JtVGFza01lbW9JbnB1dCIsImdldEZvcm1UYXNrUGluQm9vbGVhbiIsImdldEZvcm1UYXNrQ29sb3JTZWxlY3QiLCJjb2xvclZhbHVlIiwiY2xlYXJGb3JtVGFza0ZpZWxkcyIsImFkZEl0ZW10b0VkaXRUYXNrIiwib3BlbkVkaXRUYXNrIiwiY2xvc2VFZGl0VGFzayIsImdldEVkaXRUYXNrVGFza0lucHV0IiwiZ2V0RWRpdFRhc2tEYXRlSW5wdXQiLCJnZXRFZGl0VGFza01lbW9JbnB1dCIsImdldEVkaXRUYXNrUGluQm9vbGVhbiIsImdldEVkaXRUYXNrQ29sb3JTZWxlY3QiLCJ1cGRhdGVUYXNrRGlzcGxheUZyb21FZGl0VGFzayIsInRhc2tDb21wb25lbnRzIiwicXVlcnlTZWxlY3RvckFsbCIsIkFycmF5IiwiZnJvbSIsInRhc2tDb21wb25lbnQiLCJ0YXNrSWQiLCJjdXJyZW50VGFza0NvbXBvbmVudFVJIiwiZ2V0RWxlbWVudEJ5SWQiLCJuZXdEaXNwbGF5VGFza0NvbXBvbmVudCIsInBhcmVudE5vZGUiLCJyZXBsYWNlQ2hpbGQiLCJkZWxldGVUYXNrRGlzcGxheUZyb21FZGl0VGFzayIsIm9wZW5DbGVhckxpc3RNZW51IiwiY2xvc2VDbGVhckxpc3RNZW51IiwiY2xlYXJMaXN0cyIsImZpcnN0Q2hpbGQiLCJyZW1vdmVDaGlsZCIsIkNvbnRyb2xsZXIiLCJsb2FkRXZlbnRMaXN0ZW5lcnMiLCJxdWlja0FkZFRhc2tTdWJtaXQiLCJmb3JtVGFza1N1Ym1pdCIsImNsaWNrZWRFZGl0VGFzayIsImVkaXRUYXNrU3VibWl0IiwiZWRpdFRhc2tEZWxldGVTdWJtaXQiLCJjaGVja2VkVGFza0FuZFVwYXRlRGF0YSIsImUiLCJpbnB1dCIsInByZXZlbnREZWZhdWx0IiwidGFyZ2V0IiwiY29udGFpbnMiLCJjdXJyZW50VGFza0lkIiwiVGFza3RvRWRpdERhdGEiLCJjdXJyZW50VGFzayIsImZpbmRDb21wbGV0ZWRTdGF0dXMiLCJpbml0Il0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUVBLE1BQU1BLFdBQVcsR0FBR0MsUUFBUSxDQUFDQyxhQUFULENBQXVCLE1BQXZCLENBQXBCO0FBQ0EsTUFBTUMsV0FBVyxHQUFHRixRQUFRLENBQUNDLGFBQVQsQ0FBdUIsaUJBQXZCLENBQXBCO0FBQ0EsTUFBTUUsT0FBTyxHQUFHSCxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBaEIsQyxDQUVBOztBQUNBLE1BQU1HLEVBQUUsR0FBR0MsTUFBTSxDQUFDQyxVQUFQLENBQWtCLG9CQUFsQixDQUFYOztB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QkgsQ0EvU2tCLENBK1NoQnpKLEtBL1NnQixFQStTVCtCLElBL1NTLEVBK1NIckQsT0EvU0csQ0FBbkIsQyxDQWlUQTs7O0FBQ0E4SyxVQUFVLENBQUNpQixJQUFYIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vID09PT09PT09PT09PT1cclxuLy8gTWVkaWEgUXVlcmllc1xyXG4vLyA9PT09PT09PT09PT09XHJcblxyXG5jb25zdCBtYWluRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtYWluXCIpO1xyXG5jb25zdCBmb3JtVGFza0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybS10YXNrX19idG5cIik7XHJcbmNvbnN0IGgxVGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRpdGxlXCIpO1xyXG5cclxuLy8gUmUtUG9zaXRpb24gaDEgLnRpdGxlXHJcbmNvbnN0IG1xID0gd2luZG93Lm1hdGNoTWVkaWEoXCIobWluLXdpZHRoOiA2MDBweClcIik7XHJcblxyXG5pZiAobXEubWF0Y2hlcykge1xyXG4gICAgLy8gTW92ZSBoMSAudGl0bGUgZWxlbWVudFxyXG4gICAgY29uc29sZS5sb2coXCJwYXNzIC0gaXMgTGFyZ2UgU2NyZWVuXCIpO1xyXG4gICAgbWFpbkVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCdhZnRlcmJlZ2luJywgaDFUaXRsZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzTGFyZ2VTY3JlZW4oKSB7XHJcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPj0gNjAwKSB7XHJcbiAgICAgICAgLy8gTW92ZSBoMSAudGl0bGUgZWxlbWVudFxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicGFzcyAtIGlzIExhcmdlIFNjcmVlblwiKTtcclxuICAgICAgICBtYWluRWxlbWVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2FmdGVyYmVnaW4nLCBoMVRpdGxlKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZvcm1UYXNrQnRuLmluc2VydEFkamFjZW50RWxlbWVudCgnYWZ0ZXJlbmQnLCBoMVRpdGxlKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInBhc3MgLSBpcyBMYXJnZSBTY3JlZW4gRmxleFwiKTtcclxuICAgIH1cclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgaXNMYXJnZVNjcmVlbik7XHJcbiIsIi8vIE1vZGVsIC0gVmlldyAtIENvbnRyb2xsZXIgKE1WQykgUGF0dGVybiB1c2VkICsgU3RvcmFnZUN0cmwgd2l0aCBMb2NhbFN0b3JhZ2UgaW50ZXJhY3Rpb25zXHJcblxyXG4vLyB0b2RvXHJcbi8vIENsZWFuIENvZGUgYW5kIGNvbW1lbnRzXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0VW5pcXVlSWQoKSB7XHJcbiAgICBpZiAod2luZG93LmNyeXB0byAmJiB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcykge1xyXG4gICAgICAgIHJldHVybiB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDMyQXJyYXkoMSkpWzBdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8gPT09PT09PT09PT09PT09PT09XHJcbi8vIFN0b3JhZ2UgQ29udHJvbGxlclxyXG4vLyA9PT09PT09PT09PT09PT09PT1cclxuLy8gLSBMb2NhbCBTdG9yYWdlXHJcbi8vIE5COiBcIml0ZW1cIiBtYXkgYWxzbyBiZSByZWZlcnJlZCB0byBkYXRhIGZyb20gTG9jYWxTdG9yYWdlXHJcbmNvbnN0IFN0b3JhZ2UgPSAoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIC8vIFB1YmxpYyBtZXRob2RzXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGFkZEl0ZW06IGZ1bmN0aW9uIChuZXdUYXNrRGF0YSkge1xyXG4gICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInBlcnNpc3RpbmcgdG8gTFMuLi5cIilcclxuICAgICAgICAgICAgbGV0IGl0ZW1zO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIGF2YWlsYWJsZSBpdGVtIGluIExTXHJcbiAgICAgICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRhc2tzXCIpID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFB1c2ggbmV3IGl0ZW1cclxuICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2gobmV3VGFza0RhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIG5ldyBTdG9yYWdlICd0YXNrcydcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU2V0IExTXHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRhc2tzXCIsIEpTT04uc3RyaW5naWZ5KGl0ZW1zKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBHZXQgYXZhaWxhYmxlIGl0ZW0gaW4gTFNcclxuICAgICAgICAgICAgICAgIGl0ZW1zID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRhc2tzXCIpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJHZXR0aW5nIGF2YWlsYWJsZSBTdG9yYWdlOiBcIiwgaXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFB1c2ggbmV3IGl0ZW1cclxuICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2gobmV3VGFza0RhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFJlLVNldCBMU1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0YXNrc1wiLCBKU09OLnN0cmluZ2lmeShpdGVtcykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRJdGVtczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsZXQgaXRlbXM7XHJcblxyXG4gICAgICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0YXNrc1wiKSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgaXRlbXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0YXNrc1wiKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtcztcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVwZGF0ZUl0ZW06IGZ1bmN0aW9uICh1cGRhdGVUYXNrRGF0YSkge1xyXG4gICAgICAgICAgICBsZXQgaXRlbXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidGFza3NcIikpO1xyXG5cclxuICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh1cGRhdGVUYXNrRGF0YS5pZCA9PSBpdGVtLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMuc3BsaWNlKGluZGV4LCAxLCB1cGRhdGVUYXNrRGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRhc2tzXCIsIEpTT04uc3RyaW5naWZ5KGl0ZW1zKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWxldGVJdGVtOiBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW1zID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRhc2tzXCIpKTtcclxuXHJcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaWQgPT0gaXRlbS5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0YXNrc1wiLCBKU09OLnN0cmluZ2lmeShpdGVtcykpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xlYXJJdGVtczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInRhc2tzXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTtcclxuXHJcblxyXG4vLyA9PT09PVxyXG4vLyBNb2RlbFxyXG4vLyA9PT09PVxyXG4vLyAtIExvY2FsIERhdGFcclxuY29uc3QgTW9kZWwgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gTW9kZWwgQ29uc3RydWN0b3JcclxuICAgIGNvbnN0IE1vZGVsQ29uc3RydWN0b3IgPSBmdW5jdGlvbiAoaWQgPSBnZXRVbmlxdWVJZCgpLCB0aXRsZSwgZGF0ZSA9IFwiXCIsIG1lbW8gPSBcIlwiLCBwaW4gPSBmYWxzZSwgY29sb3IgPSBcIm5vbmVcIiwgY29tcGxldGVkID0gZmFsc2UpIHtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgIHRoaXMuZGF0ZSA9IGRhdGU7XHJcbiAgICAgICAgdGhpcy5tZW1vID0gbWVtbztcclxuICAgICAgICB0aGlzLnBpbiA9IHBpbjtcclxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICAgICAgdGhpcy5jb21wbGV0ZWQgPSBjb21wbGV0ZWQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIERhdGEgU3RydWN0dXJlXHJcbiAgICAvLyAtIHN0YXRlOiBcImNvbXBsZXRlZFwiLCBcInBpblwiXHJcbiAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICAgIC8vIGl0ZW1zOiBbXHJcbiAgICAgICAgLy8gICAgIHtcclxuICAgICAgICAvLyAgICAgICAgIFwiaWRcIjogZ2V0VW5pcXVlSWQoKSxcclxuICAgICAgICAvLyAgICAgICAgIFwidGl0bGVcIjogXCJXYWxrIHRoZSBkb2dcIixcclxuICAgICAgICAvLyAgICAgICAgIFwibWVtb1wiOiBcIldhbGsgZm9yIGhhbGYgYW4gaG91clwiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJkYXRlXCI6IFwiXCIsXHJcbiAgICAgICAgLy8gICAgICAgICBcInBpblwiOiBmYWxzZSxcclxuICAgICAgICAvLyAgICAgICAgIFwiY29sb3JcIjogXCJub25lXCIsXHJcbiAgICAgICAgLy8gICAgICAgICBcImNvbXBsZXRlZFwiOiBmYWxzZVxyXG4gICAgICAgIC8vICAgICB9LFxyXG4gICAgICAgIC8vICAgICB7XHJcbiAgICAgICAgLy8gICAgICAgICBcImlkXCI6IGdldFVuaXF1ZUlkKCksXHJcbiAgICAgICAgLy8gICAgICAgICBcInRpdGxlXCI6IFwiV2F0ZXIgdGhlIHBsYW50XCIsXHJcbiAgICAgICAgLy8gICAgICAgICBcIm1lbW9cIjogXCJcIixcclxuICAgICAgICAvLyAgICAgICAgIFwiZGF0ZVwiOiBcIjAxLzAxLzIwXCIsXHJcbiAgICAgICAgLy8gICAgICAgICBcInBpblwiOiBmYWxzZSxcclxuICAgICAgICAvLyAgICAgICAgIFwiY29sb3JcIjogXCJyZWRcIixcclxuICAgICAgICAvLyAgICAgICAgIFwiY29tcGxldGVkXCI6IGZhbHNlXHJcbiAgICAgICAgLy8gICAgIH0sXHJcbiAgICAgICAgLy8gICAgIHtcclxuICAgICAgICAvLyAgICAgICAgIFwiaWRcIjogZ2V0VW5pcXVlSWQoKSxcclxuICAgICAgICAvLyAgICAgICAgIFwidGl0bGVcIjogXCJXYXRlciB0aGUgcGxhbnQgYWdhaW5cIixcclxuICAgICAgICAvLyAgICAgICAgIFwibWVtb1wiOiBcIlwiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJkYXRlXCI6IFwiMDEvMDEvMjBcIixcclxuICAgICAgICAvLyAgICAgICAgIFwicGluXCI6IHRydWUsXHJcbiAgICAgICAgLy8gICAgICAgICBcImNvbG9yXCI6IFwibm9uZVwiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJjb21wbGV0ZWRcIjogZmFsc2VcclxuICAgICAgICAvLyAgICAgfSxcclxuICAgICAgICAvLyAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgXCJpZFwiOiBnZXRVbmlxdWVJZCgpLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJ0aXRsZVwiOiBcIkRvIGdyb2NlcnlcIixcclxuICAgICAgICAvLyAgICAgICAgIFwibWVtb1wiOiBcIlwiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJkYXRlXCI6IFwiXCIsXHJcbiAgICAgICAgLy8gICAgICAgICBcInBpblwiOiB0cnVlLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJjb2xvclwiOiBcIm5vbmVcIixcclxuICAgICAgICAvLyAgICAgICAgIFwiY29tcGxldGVkXCI6IHRydWVcclxuICAgICAgICAvLyAgICAgfSxcclxuICAgICAgICAvLyAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgXCJpZFwiOiBnZXRVbmlxdWVJZCgpLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJ0aXRsZVwiOiBcIlNpbmcgc29uZ1wiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJtZW1vXCI6IFwiXCIsXHJcbiAgICAgICAgLy8gICAgICAgICBcImRhdGVcIjogXCJcIixcclxuICAgICAgICAvLyAgICAgICAgIFwicGluXCI6IGZhbHNlLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJjb2xvclwiOiBcIm5vbmVcIixcclxuICAgICAgICAvLyAgICAgICAgIFwiY29tcGxldGVkXCI6IHRydWVcclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vIF0sXHJcbiAgICAgICAgaXRlbXM6IFN0b3JhZ2UuZ2V0SXRlbXMoKSxcclxuICAgICAgICBjdXJyZW50SXRlbTogbnVsbCxcclxuICAgIH1cclxuXHJcbiAgICAvLyBQdWJsaWMgTWV0aG9kc1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBsb2dEYXRhOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0SXRlbXM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGEuaXRlbXM7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZGRRdWlja1Rhc2s6IGZ1bmN0aW9uIChxdWlja1Rhc2tJbnB1dCkge1xyXG4gICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhxdWlja1Rhc2tJbnB1dCk7XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgbmV3IHRhc2tcclxuICAgICAgICAgICAgY29uc3QgbmV3VGFza0RhdGEgPSBuZXcgTW9kZWxDb25zdHJ1Y3Rvcih1bmRlZmluZWQsIHF1aWNrVGFza0lucHV0KTtcclxuXHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG5ld1Rhc2tEYXRhKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCB0byBpdGVtcyBBcnJheVxyXG4gICAgICAgICAgICBkYXRhLml0ZW1zLnB1c2gobmV3VGFza0RhdGEpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ld1Rhc2tEYXRhO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYWRkRm9ybVRhc2s6IGZ1bmN0aW9uICh0YXNrSW5wdXQsIGRhdGVJbnB1dCwgbWVtb0lucHV0LCBwaW5Cb29sZWFuLCBjb2xvclNlbGVjdCkge1xyXG4gICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0YXNrSW5wdXQsIGRhdGVJbnB1dCwgbWVtb0lucHV0LCBwaW5Cb29sZWFuLCBjb2xvclNlbGVjdCk7XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgbmV3IHRhc2tcclxuICAgICAgICAgICAgY29uc3QgbmV3VGFza0RhdGEgPSBuZXcgTW9kZWxDb25zdHJ1Y3Rvcih1bmRlZmluZWQsIHRhc2tJbnB1dCwgZGF0ZUlucHV0LCBtZW1vSW5wdXQsIHBpbkJvb2xlYW4sIGNvbG9yU2VsZWN0KTtcclxuXHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG5ld1Rhc2tEYXRhKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCB0byBpdGVtcyBBcnJheVxyXG4gICAgICAgICAgICBkYXRhLml0ZW1zLnB1c2gobmV3VGFza0RhdGEpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ld1Rhc2tEYXRhO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0VGFza0J5SWQ6IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgICAgICBsZXQgdGFyZ2V0VGFza0RhdGEgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgLy8gTG9vcCB0aHJvdWdoIGl0ZW1zXHJcbiAgICAgICAgICAgIGRhdGEuaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT0gaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUYXNrRGF0YSA9IGl0ZW07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJGZXRjaGluZyB0YXJnZXRlZCBpdGVtIGlzXCIsIHRhcmdldFRhc2tEYXRhKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRUYXNrRGF0YTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldEN1cnJlbnRUYXNrOiBmdW5jdGlvbiAodGFza3RvRWRpdERhdGEpIHtcclxuICAgICAgICAgICAgZGF0YS5jdXJyZW50SXRlbSA9IHRhc2t0b0VkaXREYXRhO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0Q3VycmVudEl0ZW06IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGEuY3VycmVudEl0ZW07XHJcbiAgICAgICAgfSxcclxuICAgICAgICB1cGRhdGVEYXRhRnJvbUVkaXRUYXNrOiBmdW5jdGlvbiAodGFza0lucHV0LCBkYXRlSW5wdXQsIG1lbW9JbnB1dCwgcGluQm9vbGVhbiwgY29sb3JTZWxlY3QpIHtcclxuICAgICAgICAgICAgbGV0IHRhcmdldFRhc2tEYXRhID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGRhdGEuaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT09IGRhdGEuY3VycmVudEl0ZW0uaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBTZXQgbmV3IHZhbHVlc1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udGl0bGUgPSB0YXNrSW5wdXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5kYXRlID0gZGF0ZUlucHV0O1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ubWVtbyA9IG1lbW9JbnB1dDtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnBpbiA9IHBpbkJvb2xlYW47XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5jb2xvciA9IGNvbG9yU2VsZWN0O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUYXNrRGF0YSA9IGl0ZW07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0VGFza0RhdGE7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB1cGRhdGVDdXJyZW50VGFza0NoZWNrZWREYXRhOiBmdW5jdGlvbiAoY29tcGxldGVkU3RhdHVzKSB7XHJcbiAgICAgICAgICAgIGxldCB0YXJnZXRUYXNrRGF0YSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBkYXRhLml0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLmlkID09IGRhdGEuY3VycmVudEl0ZW0uaWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gU2V0IHByb3BlcnR5IFwiY29tcGxldGVkXCIgdG8gYHRydWVgXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5jb21wbGV0ZWQgPSBjb21wbGV0ZWRTdGF0dXM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJDdXJyZW50IHRhc2sgY29tcGxldGUgaXNcIiwgaXRlbS5jb21wbGV0ZWQpXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRhc2tEYXRhID0gaXRlbTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRUYXNrRGF0YTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlbGV0ZUl0ZW06IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkRlbGV0aW5nIGRhdGEuLi5cIilcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCBhbiBBcnJheSBvZiBpZHNcclxuICAgICAgICAgICAgY29uc3QgaWRzID0gZGF0YS5pdGVtcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmlkO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCBpbmRleCBvZiB0YXJnZXQgdGFzayBjb21wb25lbnQgaWRcclxuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBpZHMuaW5kZXhPZihpZCk7XHJcblxyXG4gICAgICAgICAgICAvLyBSZW1vdmUgaXRlbVxyXG4gICAgICAgICAgICBkYXRhLml0ZW1zLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuXHJcbi8vID09PT1cclxuLy8gVmlld1xyXG4vLyA9PT09XHJcbi8vIC0gQW55dGhpbmcgdG8gZG8gd2l0aCB0aGUgVUlcclxuY29uc3QgVmlldyA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBVSSBzZWxlY3RvcnMnIG5hbWVcclxuICAgIGNvbnN0IFVJU2VsZWN0b3JzID0ge1xyXG4gICAgICAgIHdob2xlTGlzdHM6IFwiLmxpc3RfX3dyYXBwZXJcIixcclxuICAgICAgICBsaXN0Q29tcG9uZW50OiBcIi5saXN0LWNvbXBvbmVudFwiLFxyXG4gICAgICAgIC8vIFF1aWNrIFwiQWRkIFRhc2tcIiBTZWxlY3RvcnNcclxuICAgICAgICBxdWlja1Rhc2tJbnB1dDogXCIuYWRkLXRhc2tfX2lucHV0XCIsXHJcbiAgICAgICAgcXVpY2tUYXNrQnRuOiBcIi5hZGQtdGFza19fYnRuXCIsXHJcbiAgICAgICAgLy8gTGlzdHMgU2VsZWN0b3JzXHJcbiAgICAgICAgbWFpbkxpc3Q6IFwiLm1haW4tbGlzdFwiLFxyXG4gICAgICAgIGNvbXBsZXRlZExpc3Q6IFwiLmNvbXBsZXRlZC1saXN0XCIsXHJcbiAgICAgICAgLy8gRm9ybSBTZWxlY3RvcnNcclxuICAgICAgICBhZGRGb3JtT3BlbmJ0bjogXCIuZm9ybS10YXNrX19idG5cIixcclxuICAgICAgICBhZGRGb3JtOiBcIi5mb3JtLXRhc2tfX3dyYXBwZXJcIixcclxuICAgICAgICBlZGl0Rm9ybTogXCIuZWRpdC10YXNrX193cmFwcGVyXCIsXHJcbiAgICAgICAgb3ZlcmxheTogXCIub3ZlcmxheV9fbW9kdWxlXCIsXHJcbiAgICAgICAgLy8gQ2xlYXIgTGlzdCBTZWxlY3RvcnNcclxuICAgICAgICBjbGVhckxpc3RNZW51OiBcIi5kZWxldGUtY29uZmlybWF0aW9uX19tb2R1bGVcIixcclxuICAgICAgICBkZWxldGVDYW5jZWxCdG46IFwiLmRlbGV0ZS1jb25maXJtYXRpb24tY2FuY2VsX19idG5cIixcclxuICAgICAgICBkZWxldGVDb25maXJtQnRuOiBcIi5kZWxldGUtY29uZmlybWF0aW9uLWNvbmZpcm1fX2J0blwiLFxyXG4gICAgICAgIG9wZW5DbGVhckxpc3RNZW51QnRuOiBcIi5jbGVhci1saXN0X19idG5cIlxyXG4gICAgfVxyXG5cclxuICAgIC8vIFVJIGVsZW1lbnRcclxuICAgIGNvbnN0IFVJRWxlbWVudHMgPSB7XHJcbiAgICAgICAgLy8gXCJGb3JtIFRhc2tcIiBGb3JtXHJcbiAgICAgICAgYWRkRm9ybUNhbmNlbEJ0bjogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mb3JtLXRhc2tfX21vZHVsZVwiKS5jaGlsZHJlblswXS5maXJzdEVsZW1lbnRDaGlsZCxcclxuICAgICAgICBhZGRGb3JtVGFza0lucHV0OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZvcm0tdGFza19fbW9kdWxlXCIpLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzBdLmxhc3RFbGVtZW50Q2hpbGQsXHJcbiAgICAgICAgYWRkRm9ybURhdGVJbnB1dDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mb3JtLXRhc2tfX21vZHVsZVwiKS5jaGlsZHJlblsxXS5jaGlsZHJlblsxXS5sYXN0RWxlbWVudENoaWxkLFxyXG4gICAgICAgIGFkZEZvcm1NZW1vSW5wdXQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybS10YXNrX19tb2R1bGVcIikuY2hpbGRyZW5bMV0uY2hpbGRyZW5bMl0ubGFzdEVsZW1lbnRDaGlsZCxcclxuICAgICAgICBhZGRGb3JtUGluSW5wdXQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybS10YXNrX19tb2R1bGVcIikuY2hpbGRyZW5bMV0uY2hpbGRyZW5bM10ubGFzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZCxcclxuICAgICAgICBhZGRGb3JtQ29sb3JJbnB1dFJlZDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mb3JtLXRhc2tfX21vZHVsZVwiKS5jaGlsZHJlblsxXS5jaGlsZHJlbls0XS5jaGlsZHJlblsxXS5jaGlsZHJlblswXSxcclxuICAgICAgICBhZGRGb3JtQ29sb3JJbnB1dFllbGxvdzogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mb3JtLXRhc2tfX21vZHVsZVwiKS5jaGlsZHJlblsxXS5jaGlsZHJlbls0XS5jaGlsZHJlblsxXS5jaGlsZHJlblsyXSxcclxuICAgICAgICBhZGRGb3JtQ29sb3JJbnB1dEJsdWU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybS10YXNrX19tb2R1bGVcIikuY2hpbGRyZW5bMV0uY2hpbGRyZW5bNF0uY2hpbGRyZW5bMV0uY2hpbGRyZW5bNF0sXHJcbiAgICAgICAgYWRkRm9ybUNvbG9ySW5wdXRHcmVlbjogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mb3JtLXRhc2tfX21vZHVsZVwiKS5jaGlsZHJlblsxXS5jaGlsZHJlbls0XS5jaGlsZHJlblsxXS5jaGlsZHJlbls2XSxcclxuICAgICAgICBhZGRGb3JtQ29sb3JJbnB1dE5vbmU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybS10YXNrX19tb2R1bGVcIikuY2hpbGRyZW5bMV0uY2hpbGRyZW5bNF0uY2hpbGRyZW5bMV0uY2hpbGRyZW5bOF0sXHJcbiAgICAgICAgYWRkRm9ybVN1Ym1pdEJ0bjogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mb3JtLXRhc2tfX21vZHVsZVwiKS5jaGlsZHJlblsxXS5jaGlsZHJlbls0XS5jaGlsZHJlblsyXSxcclxuICAgICAgICAvLyBcIkVkaXQgVGFza1wiIEZvcm1cclxuICAgICAgICBlZGl0Rm9ybUNhbmNlbEJ0bjogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lZGl0LXRhc2tfX21vZHVsZVwiKS5jaGlsZHJlblswXS5maXJzdEVsZW1lbnRDaGlsZCxcclxuICAgICAgICBlZGl0Rm9ybVVwZGF0ZUJ0bjogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lZGl0LXRhc2tfX21vZHVsZVwiKS5jaGlsZHJlblswXS5sYXN0RWxlbWVudENoaWxkLFxyXG4gICAgICAgIGVkaXRGb3JtVGFza0lucHV0OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXQtdGFza19fbW9kdWxlXCIpLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzBdLmxhc3RFbGVtZW50Q2hpbGQsXHJcbiAgICAgICAgZWRpdEZvcm1EYXRlSW5wdXQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZWRpdC10YXNrX19tb2R1bGVcIikuY2hpbGRyZW5bMV0uY2hpbGRyZW5bMV0ubGFzdEVsZW1lbnRDaGlsZCxcclxuICAgICAgICBlZGl0Rm9ybU1lbW9JbnB1dDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lZGl0LXRhc2tfX21vZHVsZVwiKS5jaGlsZHJlblsxXS5jaGlsZHJlblsyXS5sYXN0RWxlbWVudENoaWxkLFxyXG4gICAgICAgIGVkaXRGb3JtUGluSW5wdXQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZWRpdC10YXNrX19tb2R1bGVcIikuY2hpbGRyZW5bMV0uY2hpbGRyZW5bM10ubGFzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZCxcclxuICAgICAgICBlZGl0Rm9ybUNvbG9ySW5wdXRSZWQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZWRpdC10YXNrX19tb2R1bGVcIikuY2hpbGRyZW5bMV0uY2hpbGRyZW5bNF0uY2hpbGRyZW5bMV0uY2hpbGRyZW5bMF0sXHJcbiAgICAgICAgZWRpdEZvcm1Db2xvcklucHV0WWVsbG93OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXQtdGFza19fbW9kdWxlXCIpLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzJdLFxyXG4gICAgICAgIGVkaXRGb3JtQ29sb3JJbnB1dEJsdWU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZWRpdC10YXNrX19tb2R1bGVcIikuY2hpbGRyZW5bMV0uY2hpbGRyZW5bNF0uY2hpbGRyZW5bMV0uY2hpbGRyZW5bNF0sXHJcbiAgICAgICAgZWRpdEZvcm1Db2xvcklucHV0R3JlZW46IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZWRpdC10YXNrX19tb2R1bGVcIikuY2hpbGRyZW5bMV0uY2hpbGRyZW5bNF0uY2hpbGRyZW5bMV0uY2hpbGRyZW5bNl0sXHJcbiAgICAgICAgZWRpdEZvcm1Db2xvcklucHV0Tm9uZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lZGl0LXRhc2tfX21vZHVsZVwiKS5jaGlsZHJlblsxXS5jaGlsZHJlbls0XS5jaGlsZHJlblsxXS5jaGlsZHJlbls4XSxcclxuICAgICAgICBlZGl0Rm9ybURlbGV0ZUJ0bjogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lZGl0LXRhc2tfX21vZHVsZVwiKS5jaGlsZHJlblsxXS5jaGlsZHJlbls0XS5jaGlsZHJlblsyXVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJlbmRlciA9IGZ1bmN0aW9uICh0YXNrRGF0YSkge1xyXG4gICAgICAgIGNvbnN0IGxpc3RDb21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGxpc3RDb21wb25lbnQuY2xhc3NMaXN0LmFkZChcImxpc3QtY29tcG9uZW50XCIpO1xyXG5cclxuICAgICAgICAvLyBBZGQgVW5pcXVlIElEXHJcbiAgICAgICAgbGlzdENvbXBvbmVudC5pZCA9IHRhc2tEYXRhW1wiaWRcIl07XHJcblxyXG4gICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cobGlzdENvbXBvbmVudC5pZCk7XHJcblxyXG4gICAgICAgIC8vIExpc3QgQ29tcG9uZW50IC0gRmlyc3QgQmxvY2tcclxuICAgICAgICBjb25zdCBsaXN0Q29tcG9uZW50Rmlyc3RCbG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgbGlzdENvbXBvbmVudEZpcnN0QmxvY2suY2xhc3NMaXN0LmFkZChcImxpc3QtY29tcG9uZW50X19maXJzdC1ibG9ja1wiKTtcclxuXHJcbiAgICAgICAgLy8gTGlzdCBDb21wb25lbnQgLSBGaXJzdCBCbG9jayAtIENvbXBvbmVudHNcclxuICAgICAgICAvLyBQaW4gdG8gdGhlIFRvcFxyXG4gICAgICAgIGNvbnN0IHBpbkNvbXBvbmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgcGluQ29tcG9uZW50LmNsYXNzTGlzdC5hZGQoXCJwaW5fX3dyYXBwZXJcIik7XHJcbiAgICAgICAgY29uc3QgcGluSWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpXCIpO1xyXG4gICAgICAgIHBpbkljb24uY2xhc3NMaXN0LmFkZChcImZhXCIsIFwiZmEtdGh1bWItdGFja1wiKTtcclxuXHJcbiAgICAgICAgaWYgKCF0YXNrRGF0YVtcInBpblwiXSkge1xyXG4gICAgICAgICAgICBwaW5JY29uLmNsYXNzTGlzdC5hZGQoXCJpbnZpc2libGVcIilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBpbkljb24uc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJ0cnVlXCIpO1xyXG5cclxuICAgICAgICBwaW5Db21wb25lbnQuYXBwZW5kQ2hpbGQocGluSWNvbik7XHJcblxyXG4gICAgICAgIC8vIENoZWNrYm94XHJcbiAgICAgICAgY29uc3QgY2hlY2tib3hDb21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICAgICAgY2hlY2tib3hDb21wb25lbnQuY2xhc3NMaXN0LmFkZChcImNoZWNrYm94XCIpO1xyXG4gICAgICAgIC8vIGNoZWNrYm94Q29tcG9uZW50LnNldEF0dHJpYnV0ZShcImZvclwiLCBcImNoZWNrXCIpO1xyXG5cclxuICAgICAgICAvLyBDaGVja2JveCAtIEljb25cclxuICAgICAgICBjb25zdCBjaGVja2JveEljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgY2hlY2tib3hJY29uLmlkID0gXCJjaGVja1wiO1xyXG4gICAgICAgIGNoZWNrYm94SWNvbi50eXBlID0gXCJjaGVja2JveFwiO1xyXG4gICAgICAgIGNoZWNrYm94SWNvbi5jaGVja2VkID0gdGFza0RhdGFbXCJjb21wbGV0ZWRcIl07XHJcbiAgICAgICAgY2hlY2tib3hJY29uLmNsYXNzTGlzdC5hZGQoXCJjaGVja1wiKTtcclxuXHJcbiAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkNoZWNrYm94SWNvblwiLCBjaGVja2JveEljb24uY2hlY2tlZCk7XHJcblxyXG4gICAgICAgIC8vIENoZWNrYm94IC0gTGFiZWxcclxuICAgICAgICBjb25zdCBjaGVja2JveExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgY2hlY2tib3hMYWJlbC5jbGFzc0xpc3QuYWRkKFwidGV4dC1sYWJlbFwiKTtcclxuXHJcbiAgICAgICAgLy8gQ2hlY2tib3ggLSBMYWJlbCAtIENyZWF0ZSBUZXh0Tm9kZVxyXG4gICAgICAgIGNvbnN0IGNoZWNrYm94TGFiZWxUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGFza0RhdGFbXCJ0aXRsZVwiXSk7XHJcbiAgICAgICAgY2hlY2tib3hMYWJlbC5hcHBlbmQoY2hlY2tib3hMYWJlbFRleHQpO1xyXG5cclxuICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicmVuZGVyaW5nIGxhYmVsOlwiLCBjaGVja2JveExhYmVsKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInJlbmRlcmluZyBsYWJlbCB0ZXh0OlwiLCBjaGVja2JveExhYmVsVGV4dCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJyZW5kZXJpbmcgbGFiZWwgdGV4dCBkYXRhOlwiLCB0YXNrRGF0YVtcInRpdGxlXCJdKTtcclxuXHJcbiAgICAgICAgY2hlY2tib3hDb21wb25lbnQuYXBwZW5kQ2hpbGQoY2hlY2tib3hJY29uKTtcclxuICAgICAgICBjaGVja2JveENvbXBvbmVudC5hcHBlbmRDaGlsZChjaGVja2JveExhYmVsKTtcclxuXHJcbiAgICAgICAgLy8gRHVlIERhdGVcclxuICAgICAgICBjb25zdCBkdWVEYXRlQ29tcG9uZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkdWVEYXRlQ29tcG9uZW50LmNsYXNzTGlzdC5hZGQoXCJkdWUtZGF0ZVwiKTtcclxuXHJcbiAgICAgICAgLy8gRHVlIERhdGUgLSBTcGFuIEVsZW1lbnRcclxuICAgICAgICBjb25zdCBkdWVEYXRlU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIGR1ZURhdGVTcGFuLmNsYXNzTGlzdC5hZGQoXCJ0ZXh0LWRhdGVcIik7XHJcblxyXG4gICAgICAgIGlmICh0YXNrRGF0YVtcImRhdGVcIl0pIHtcclxuICAgICAgICAgICAgLy8gRHVlIERhdGUgLSBDcmVhdGUgVGV4dE5vZGVcclxuICAgICAgICAgICAgY29uc3QgZHVlRGF0ZVRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0YXNrRGF0YVtcImRhdGVcIl0pO1xyXG4gICAgICAgICAgICBkdWVEYXRlU3Bhbi5hcHBlbmQoZHVlRGF0ZVRleHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZHVlRGF0ZUNvbXBvbmVudC5hcHBlbmRDaGlsZChkdWVEYXRlU3Bhbik7XHJcblxyXG4gICAgICAgIC8vIEVsbGlwc2VzXHJcbiAgICAgICAgY29uc3QgZWxsaXBzaXNDb21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGVsbGlwc2lzQ29tcG9uZW50LmNsYXNzTGlzdC5hZGQoXCJlbGxpcHNlc19fd3JhcHBlclwiKTtcclxuXHJcbiAgICAgICAgLy8gRWxsaXBzZXMgLSBJY29uXHJcbiAgICAgICAgY29uc3QgZWxsaXBzaXNJY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlcIik7XHJcbiAgICAgICAgZWxsaXBzaXNJY29uLmNsYXNzTGlzdC5hZGQoXCJmYVwiLCBcImZhLWVsbGlwc2lzLWhcIik7XHJcbiAgICAgICAgZWxsaXBzaXNJY29uLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcclxuXHJcbiAgICAgICAgZWxsaXBzaXNDb21wb25lbnQuYXBwZW5kQ2hpbGQoZWxsaXBzaXNJY29uKTtcclxuXHJcbiAgICAgICAgLy8gU3RpY2sgQ29sb3JcclxuICAgICAgICBjb25zdCBzdGlja3lDb2xvckNvbXBvbmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgc3RpY2t5Q29sb3JDb21wb25lbnQuY2xhc3NMaXN0LmFkZChcInN0aWNreS1jb2xvclwiKTtcclxuXHJcbiAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlJlbmRlcmluZyBTdGlja3kgQ29sb3I6XCIsIHRhc2tEYXRhW1wiY29sb3JcIl0pO1xyXG5cclxuICAgICAgICBpZiAodGFza0RhdGFbXCJjb2xvclwiXSAhPSBcIm5vbmVcIikge1xyXG4gICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkFkZGluZyBjbGFzcyBTdGlja3kgQ29sb3I6XCIsIHRhc2tEYXRhW1wiY29sb3JcIl0pO1xyXG5cclxuICAgICAgICAgICAgc3RpY2t5Q29sb3JDb21wb25lbnQuY2xhc3NMaXN0LmFkZCh0YXNrRGF0YVtcImNvbG9yXCJdKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlJlbmRlcmluZyBTdGlja3kgQ29sb3I6IFwiLCBcIm5vbmVcIik7XHJcblxyXG4gICAgICAgICAgICBzdGlja3lDb2xvckNvbXBvbmVudC5jbGFzc0xpc3QuYWRkKFwibm9uZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIExpc3QgQ29tcG9uZW50IC0gU2Vjb25kIEJsb2NrXHJcbiAgICAgICAgY29uc3QgbGlzdENvbXBvbmVudFNlY29uZEJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBsaXN0Q29tcG9uZW50U2Vjb25kQmxvY2suY2xhc3NMaXN0LmFkZChcImxpc3QtY29tcG9uZW50X19zZWNvbmQtYmxvY2tcIik7XHJcblxyXG4gICAgICAgIC8vIE1lbW9cclxuICAgICAgICBjb25zdCBtZW1vU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIG1lbW9TcGFuLmNsYXNzTGlzdC5hZGQoXCJ0ZXh0LW1lbW9cIik7XHJcblxyXG4gICAgICAgIGlmICh0YXNrRGF0YVtcIm1lbW9cIl0pIHtcclxuICAgICAgICAgICAgLy8gTWVtbyAtIENyZWF0ZSBUZXh0Tm9kZVxyXG4gICAgICAgICAgICBjb25zdCBtZW1vVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRhc2tEYXRhW1wibWVtb1wiXSk7XHJcbiAgICAgICAgICAgIG1lbW9TcGFuLmFwcGVuZChtZW1vVGV4dCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGlzdENvbXBvbmVudFNlY29uZEJsb2NrLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsaXN0Q29tcG9uZW50U2Vjb25kQmxvY2suYXBwZW5kQ2hpbGQobWVtb1NwYW4pO1xyXG5cclxuICAgICAgICAvLyBQdXR0aW5nIGl0IGFsbCB0b2dldGhlci4uLlxyXG4gICAgICAgIGxpc3RDb21wb25lbnRGaXJzdEJsb2NrLmFwcGVuZChwaW5Db21wb25lbnQsIGNoZWNrYm94Q29tcG9uZW50LCBkdWVEYXRlQ29tcG9uZW50LCBlbGxpcHNpc0NvbXBvbmVudCwgc3RpY2t5Q29sb3JDb21wb25lbnQpO1xyXG5cclxuICAgICAgICBsaXN0Q29tcG9uZW50LmFwcGVuZENoaWxkKGxpc3RDb21wb25lbnRGaXJzdEJsb2NrKTtcclxuICAgICAgICBsaXN0Q29tcG9uZW50LmFwcGVuZENoaWxkKGxpc3RDb21wb25lbnRTZWNvbmRCbG9jayk7XHJcblxyXG4gICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cobGlzdENvbXBvbmVudCk7XHJcblxyXG4gICAgICAgIHJldHVybiBsaXN0Q29tcG9uZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFB1YmxpYyBNZXRob2RzXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHBvcHVsYXRlTGlzdDogZnVuY3Rpb24gKGl0ZW1zLCBjb21wbGV0ZWRTdGF0dXMpIHtcclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJUaGUgQ29tcGxldGVkIFN0YXR1cyBpc1wiLCBjb21wbGV0ZWRTdGF0dXMpO1xyXG5cclxuICAgICAgICAgICAgLy8gSWYgY29tcGxldGVkIHN0YXR1cyBpcyBhdmFpbGFibGUsXHJcbiAgICAgICAgICAgIC8vIHBvcHVsYXRlIGZvciBCT1RIIE1haW4gTGlzdCBhbmQgQ29tcGxldGVkIExpc3RcclxuICAgICAgICAgICAgLy8gSWYgbm90LCBwb3B1bGF0ZSBmb3IgTWFpbiBMaXN0IE9OTFlcclxuICAgICAgICAgICAgaWYgKGNvbXBsZXRlZFN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgLy8gU2hvdyBDb21wbGV0ZWQgTGlzdFxyXG4gICAgICAgICAgICAgICAgVmlldy5zaG93Q29tcGxldGVkTGlzdCgpO1xyXG4gICAgICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0YXNrID0gcmVuZGVyKGl0ZW0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwicG9wdWxhdGluZzpcIiwgdGFzayk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEZpbHRlciBNYWluIExpc3QgYW5kIENvbXBsZXRlZCBMaXN0XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uY29tcGxldGVkID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInBvcHVsYXRpbiBNYWluIGxpc3QuLi5cIilcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnBpbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5tYWluTGlzdCkuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYWZ0ZXJiZWdpblwiLCB0YXNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMubWFpbkxpc3QpLmFwcGVuZCh0YXNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwicG9wdWxhdGluZyBDb21wbGV0ZWQgbGlzdC4uLlwiKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXBwZW5kIHRvIENvbXBsZXRlZCBMaXN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnBpbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5jb21wbGV0ZWRMaXN0KS5maXJzdEVsZW1lbnRDaGlsZC5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmVuZFwiLCB0YXNrKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5jb21wbGV0ZWRMaXN0KS5hcHBlbmQodGFzayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIFZpZXcuaGlkZUNvbXBsZXRlZExpc3QoKTtcclxuICAgICAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk5vIENvbXBsZXRlZCBMaXN0LCBwb3B1bGF0aW4gTWFpbiBsaXN0Li4uXCIpXHJcblxyXG4gICAgICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0YXNrID0gcmVuZGVyKGl0ZW0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5waW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5tYWluTGlzdCkuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYWZ0ZXJiZWdpblwiLCB0YXNrKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLm1haW5MaXN0KS5hcHBlbmQodGFzayk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldFNlbGVjdG9yczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gVUlTZWxlY3RvcnM7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRFbGVtZW50czogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gVUlFbGVtZW50cztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldFF1aWNrVGFza0lucHV0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLnF1aWNrVGFza0lucHV0KS52YWx1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFkZFRhc2tUb01haW5MaXN0OiBmdW5jdGlvbiAobmV3VGFza0RhdGEpIHtcclxuICAgICAgICAgICAgLy8gQ3JlYXRlIGVsZW1lbnRzXHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1Rhc2sgPSByZW5kZXIobmV3VGFza0RhdGEpO1xyXG5cclxuICAgICAgICAgICAgLy8gSW5zZXJ0IG5ldyBsaXN0IGNvbXBvbmVudCB0byBET01cclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5tYWluTGlzdCkuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCdiZWZvcmVlbmQnLCBuZXdUYXNrKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFkZFRhc2tUb01haW5MaXN0UGlubmVkOiBmdW5jdGlvbiAobmV3VGFza0RhdGEpIHtcclxuICAgICAgICAgICAgLy8gQ3JlYXRlIGVsZW1lbnRzXHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1Rhc2sgPSByZW5kZXIobmV3VGFza0RhdGEpO1xyXG5cclxuICAgICAgICAgICAgLy8gSW5zZXJ0IG5ldyBsaXN0IGNvbXBvbmVudCB0byBET01cclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5tYWluTGlzdCkuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCdhZnRlcmJlZ2luJywgbmV3VGFzayk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbGVhclF1aWNrQWRkVGFza0lucHV0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMucXVpY2tUYXNrSW5wdXQpLnZhbHVlID0gXCJcIjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGhpZGVDb21wbGV0ZWRMaXN0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMuY29tcGxldGVkTGlzdCkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2hvd0NvbXBsZXRlZExpc3Q6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5jb21wbGV0ZWRMaXN0KS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb3BlbkZvcm1UYXNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwib3BlbiBGb3JtIFRhc2tcIik7XHJcblxyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLm92ZXJsYXkpLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMuYWRkRm9ybSkuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsb3NlRm9ybVRhc2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJDbG9zZSBGb3JtIFRhc2tcIik7XHJcblxyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLm92ZXJsYXkpLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMuYWRkRm9ybSkuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldEZvcm1UYXNrVGFza0lucHV0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBVSUVsZW1lbnRzLmFkZEZvcm1UYXNrSW5wdXQudmFsdWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRGb3JtVGFza0RhdGVJbnB1dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsZXQgZm9ybWF0RGF0ZSA9IFVJRWxlbWVudHMuYWRkRm9ybURhdGVJbnB1dC52YWx1ZS5yZXBsYWNlQWxsKFwiLVwiLCBcIi9cIik7XHJcblxyXG4gICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImRhdGUgZm9ybWF0XCIsIGZvcm1hdERhdGUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZvcm1hdERhdGU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRGb3JtVGFza01lbW9JbnB1dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gVUlFbGVtZW50cy5hZGRGb3JtTWVtb0lucHV0LnZhbHVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0Rm9ybVRhc2tQaW5Cb29sZWFuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBVSUVsZW1lbnRzLmFkZEZvcm1QaW5JbnB1dC5jaGVja2VkO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0Rm9ybVRhc2tDb2xvclNlbGVjdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsZXQgY29sb3JWYWx1ZTtcclxuXHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiY29sb3IgUmVkIGlzXCIsIFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXRSZWQuY2hlY2tlZCk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiY29sb3IgWWVsbG93IGlzXCIsIFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXRZZWxsb3cuY2hlY2tlZCk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiY29sb3IgQmx1ZSBpc1wiLCBVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0Qmx1ZS5jaGVja2VkKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJjb2xvciBHcmVlbiBpc1wiLCBVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0R3JlZW4uY2hlY2tlZCk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiY29sb3IgTm9uZSBpc1wiLCBVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0Tm9uZS5jaGVja2VkKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEZpbmQgVmFsdWVcclxuICAgICAgICAgICAgaWYgKFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXRSZWQuY2hlY2tlZCB8fCBVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0WWVsbG93LmNoZWNrZWQgfHwgVUlFbGVtZW50cy5hZGRGb3JtQ29sb3JJbnB1dEJsdWUuY2hlY2tlZCB8fCBVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0R3JlZW4uY2hlY2tlZCB8fCBVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0Tm9uZS5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoVUlFbGVtZW50cy5hZGRGb3JtQ29sb3JJbnB1dFJlZC5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIklmIC0gcmVkXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb2xvclZhbHVlID0gVUlFbGVtZW50cy5hZGRGb3JtQ29sb3JJbnB1dFJlZC52YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoVUlFbGVtZW50cy5hZGRGb3JtQ29sb3JJbnB1dFllbGxvdy5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIklmIC0geWVsbG93XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb2xvclZhbHVlID0gVUlFbGVtZW50cy5hZGRGb3JtQ29sb3JJbnB1dFllbGxvdy52YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoVUlFbGVtZW50cy5hZGRGb3JtQ29sb3JJbnB1dEJsdWUuY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJJZiAtIHllbGxvd1wiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3JWYWx1ZSA9IFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXRCbHVlLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0R3JlZW4uY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJJZiAtIHllbGxvd1wiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3JWYWx1ZSA9IFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXRHcmVlbi52YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoVUlFbGVtZW50cy5hZGRGb3JtQ29sb3JJbnB1dE5vbmUuY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJJZiAtIG5vbmVcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yVmFsdWUgPSBVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0Tm9uZS52YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbG9yVmFsdWUgPSBVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0Tm9uZS52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJjb2xvclwiLCBjb2xvclZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb2xvclZhbHVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xlYXJGb3JtVGFza0ZpZWxkczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBVSUVsZW1lbnRzLmFkZEZvcm1UYXNrSW5wdXQudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgICBVSUVsZW1lbnRzLmFkZEZvcm1EYXRlSW5wdXQudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgICBVSUVsZW1lbnRzLmFkZEZvcm1NZW1vSW5wdXQudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgICBVSUVsZW1lbnRzLmFkZEZvcm1QaW5JbnB1dC5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXRSZWQuY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0WWVsbG93LmNoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgVUlFbGVtZW50cy5hZGRGb3JtQ29sb3JJbnB1dEJsdWUuY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0R3JlZW4uY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0Tm9uZS5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZGRJdGVtdG9FZGl0VGFzazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyBTZXQgY3VycmVudCB0YXNrIGNvbXBvbmVudCdzIHZhbHVlcyB0byBcIkVkaXQgVGFza1wiIG1vZHVsZVxyXG4gICAgICAgICAgICBVSUVsZW1lbnRzLmVkaXRGb3JtVGFza0lucHV0LnZhbHVlID0gTW9kZWwuZ2V0Q3VycmVudEl0ZW0oKS50aXRsZTtcclxuICAgICAgICAgICAgVUlFbGVtZW50cy5lZGl0Rm9ybURhdGVJbnB1dC52YWx1ZSA9IE1vZGVsLmdldEN1cnJlbnRJdGVtKCkuZGF0ZTtcclxuICAgICAgICAgICAgVUlFbGVtZW50cy5lZGl0Rm9ybU1lbW9JbnB1dC52YWx1ZSA9IE1vZGVsLmdldEN1cnJlbnRJdGVtKCkubWVtbztcclxuICAgICAgICAgICAgVUlFbGVtZW50cy5lZGl0Rm9ybVBpbklucHV0LmNoZWNrZWQgPSBNb2RlbC5nZXRDdXJyZW50SXRlbSgpLnBpbjtcclxuXHJcbiAgICAgICAgICAgIC8vIFNldCBjb2xvciBmcm9tIHNlbGVjdGlvblxyXG4gICAgICAgICAgICBzd2l0Y2ggKE1vZGVsLmdldEN1cnJlbnRJdGVtKCkuY29sb3IpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJyZWRcIjpcclxuICAgICAgICAgICAgICAgICAgICBVSUVsZW1lbnRzLmVkaXRGb3JtQ29sb3JJbnB1dFJlZC5jaGVja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJ5ZWxsb3dcIjpcclxuICAgICAgICAgICAgICAgICAgICBVSUVsZW1lbnRzLmVkaXRGb3JtQ29sb3JJbnB1dFllbGxvdy5jaGVja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJibHVlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXRCbHVlLmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImdyZWVuXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXRHcmVlbi5jaGVja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXROb25lLmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBWaWV3Lm9wZW5FZGl0VGFzaygpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb3BlbkVkaXRUYXNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwib3BlbiBFZGl0IFRhc2tcIik7XHJcblxyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLm92ZXJsYXkpLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMuZWRpdEZvcm0pLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbG9zZUVkaXRUYXNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQ2xvc2UgRWRpdCBUYXNrXCIpO1xyXG5cclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5vdmVybGF5KS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLmVkaXRGb3JtKS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xyXG5cclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldEVkaXRUYXNrVGFza0lucHV0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBVSUVsZW1lbnRzLmVkaXRGb3JtVGFza0lucHV0LnZhbHVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0RWRpdFRhc2tEYXRlSW5wdXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IGZvcm1hdERhdGUgPSBVSUVsZW1lbnRzLmVkaXRGb3JtRGF0ZUlucHV0LnZhbHVlLnJlcGxhY2VBbGwoXCItXCIsIFwiL1wiKTtcclxuXHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZGF0ZSBmb3JtYXQgaW4gRWRpdCBUYXNrXCIsIGZvcm1hdERhdGUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZvcm1hdERhdGU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRFZGl0VGFza01lbW9JbnB1dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gVUlFbGVtZW50cy5lZGl0Rm9ybU1lbW9JbnB1dC52YWx1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldEVkaXRUYXNrUGluQm9vbGVhbjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gVUlFbGVtZW50cy5lZGl0Rm9ybVBpbklucHV0LmNoZWNrZWQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRFZGl0VGFza0NvbG9yU2VsZWN0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBjb2xvclZhbHVlO1xyXG5cclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJDaGVja2luZyBpbiBFZGl0IFRhc2suLi5cIilcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJDaGVja2luZyBpbiBFZGl0IFRhc2suLi5cIilcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJjb2xvciBSZWQgaXNcIiwgVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXRSZWQuY2hlY2tlZCk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiY29sb3IgWWVsbG93IGlzXCIsIFVJRWxlbWVudHMuZWRpdEZvcm1Db2xvcklucHV0WWVsbG93LmNoZWNrZWQpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImNvbG9yIEJsdWUgaXNcIiwgVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXRCbHVlLmNoZWNrZWQpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImNvbG9yIEdyZWVuIGlzXCIsIFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXRHcmVlbi5jaGVja2VkKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJjb2xvciBOb25lIGlzXCIsIFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXROb25lLmNoZWNrZWQpO1xyXG5cclxuICAgICAgICAgICAgLy8gRmluZCBWYWx1ZVxyXG4gICAgICAgICAgICBzd2l0Y2ggKFVJRWxlbWVudHMuZWRpdEZvcm1Db2xvcklucHV0UmVkLmNoZWNrZWQgfHwgVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXRZZWxsb3cuY2hlY2tlZCB8fCBVSUVsZW1lbnRzLmVkaXRGb3JtQ29sb3JJbnB1dEJsdWUuY2hlY2tlZCB8fCBVSUVsZW1lbnRzLmVkaXRGb3JtQ29sb3JJbnB1dEdyZWVuLmNoZWNrZWQgfHwgVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXROb25lLmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXRSZWQuY2hlY2tlZDpcclxuICAgICAgICAgICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU3dpdGNoIC0gcmVkXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb2xvclZhbHVlID0gVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXRSZWQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFVJRWxlbWVudHMuZWRpdEZvcm1Db2xvcklucHV0WWVsbG93LmNoZWNrZWQ6XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlN3aXRjaCAtIHllbGxvd1wiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3JWYWx1ZSA9IFVJRWxlbWVudHMuZWRpdEZvcm1Db2xvcklucHV0WWVsbG93LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBVSUVsZW1lbnRzLmVkaXRGb3JtQ29sb3JJbnB1dEJsdWUuY2hlY2tlZDpcclxuICAgICAgICAgICAgICAgICAgICBjb2xvclZhbHVlID0gVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXRCbHVlLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBVSUVsZW1lbnRzLmVkaXRGb3JtQ29sb3JJbnB1dEdyZWVuLmNoZWNrZWQ6XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlN3aXRjaCAtIGdyZWVuXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb2xvclZhbHVlID0gVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXRHcmVlbi52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlN3aXRjaCAtIGRlZmF1bHQgbm9uZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3JWYWx1ZSA9IFVJRWxlbWVudHMuZWRpdEZvcm1Db2xvcklucHV0Tm9uZS52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29sb3JcIiwgY29sb3JWYWx1ZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY29sb3JWYWx1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVwZGF0ZVRhc2tEaXNwbGF5RnJvbUVkaXRUYXNrOiBmdW5jdGlvbiAodXBkYXRlVGFza0RhdGEpIHtcclxuICAgICAgICAgICAgLy8gU2VhcmNoIGZvciB0YXJnZXRlZCBsaXN0IGNvbXBvbmVudFxyXG4gICAgICAgICAgICBsZXQgdGFza0NvbXBvbmVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFVJU2VsZWN0b3JzLmxpc3RDb21wb25lbnQpO1xyXG5cclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJMb29waW5nOlwiLCB0YXNrQ29tcG9uZW50cyk7XHJcblxyXG4gICAgICAgICAgICAvLyBUdXJuIE5vZGUgbGlzdCBpbnRvIGFycmF5XHJcbiAgICAgICAgICAgIHRhc2tDb21wb25lbnRzID0gQXJyYXkuZnJvbSh0YXNrQ29tcG9uZW50cyk7XHJcblxyXG4gICAgICAgICAgICB0YXNrQ29tcG9uZW50cy5mb3JFYWNoKCh0YXNrQ29tcG9uZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0YXNrSWQgPSB0YXNrQ29tcG9uZW50LmlkO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInBhc3MgaWRcIiwgdGFza0lkKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGFza0lkID09IHVwZGF0ZVRhc2tEYXRhLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlIFVJXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFRhc2tDb21wb25lbnRVSSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke3Rhc2tJZH1gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjdXJyZW50VGFza0NvbXBvbmVudFVJKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInVzaW5nIGRhdGFcIiwgdXBkYXRlVGFza0RhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3RGlzcGxheVRhc2tDb21wb25lbnQgPSByZW5kZXIodXBkYXRlVGFza0RhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBuZXcgdGFzayBpcyBjb21wbGV0ZWRcclxuICAgICAgICAgICAgICAgICAgICBpZiAodXBkYXRlVGFza0RhdGEuY29tcGxldGVkID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgY29tcGxldGVkIHRhc2sgaXMgcGlubmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1cGRhdGVUYXNrRGF0YS5waW4gPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWRkIG5ldyBhbmQgdXBkYXRlIHRhc2sgY29tcG9uZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLmNvbXBsZXRlZExpc3QpLmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyYmVnaW5cIiwgbmV3RGlzcGxheVRhc2tDb21wb25lbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBvbGQgdGFzayBjb21wb25lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUYXNrQ29tcG9uZW50VUkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBZGQgbmV3IGFuZCB1cGRhdGUgdGFzayBjb21wb25lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUYXNrQ29tcG9uZW50VUkucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3RGlzcGxheVRhc2tDb21wb25lbnQsIGN1cnJlbnRUYXNrQ29tcG9uZW50VUkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdW5jb21wbGV0ZWQgdGFzayBpcyB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1cGRhdGVUYXNrRGF0YS5waW4gPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdW5jb21wbGV0ZWQgdGFzayBpcyBwaW5uZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMubWFpbkxpc3QpLmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyYmVnaW5cIiwgbmV3RGlzcGxheVRhc2tDb21wb25lbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBvbGQgdGFzayBjb21wb25lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUYXNrQ29tcG9uZW50VUkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBZGQgbmV3IGFuZCB1cGRhdGUgdGFzayBjb21wb25lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUYXNrQ29tcG9uZW50VUkucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3RGlzcGxheVRhc2tDb21wb25lbnQsIGN1cnJlbnRUYXNrQ29tcG9uZW50VUkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBWaWV3LmNsb3NlRWRpdFRhc2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlbGV0ZVRhc2tEaXNwbGF5RnJvbUVkaXRUYXNrOiBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgVmlldy5jbG9zZUVkaXRUYXNrKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvcGVuQ2xlYXJMaXN0TWVudTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLm92ZXJsYXkpLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMuY2xlYXJMaXN0TWVudSkuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsb3NlQ2xlYXJMaXN0TWVudTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLm92ZXJsYXkpLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMuY2xlYXJMaXN0TWVudSkuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsZWFyTGlzdHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IG1haW5MaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5tYWluTGlzdCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbXBsZXRlZExpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLmNvbXBsZXRlZExpc3QpO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKG1haW5MaXN0LmZpcnN0Q2hpbGQpIHtcclxuICAgICAgICAgICAgICAgIG1haW5MaXN0LnJlbW92ZUNoaWxkKG1haW5MaXN0LmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoY29tcGxldGVkTGlzdC5maXJzdENoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZWRMaXN0LnJlbW92ZUNoaWxkKGNvbXBsZXRlZExpc3QuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG5cclxuLy8gPT09PT09PT09PVxyXG4vLyBDb250cm9sbGVyXHJcbi8vID09PT09PT09PT1cclxuLy8gLSBtYWluIGNvbnRyb2xsZXJcclxuLy8gLSBXaGVyZSBldmVyeXRoaW5nIHdpbGwgbWVldFxyXG4vLyAtIGluaXRpYWwgZXZlbnQgbGlzdGVuZXJzXHJcbi8vIC0gaW5pdCBmdW5jdGlvblxyXG5jb25zdCBDb250cm9sbGVyID0gKGZ1bmN0aW9uIChNb2RlbCwgVmlldywgU3RvcmFnZSkge1xyXG4gICAgLy8gTG9hZCBFdmVudCBMaXN0ZW5lcnNcclxuICAgIGNvbnN0IGxvYWRFdmVudExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyBHZXQgVUkgc2VsZWN0b3JzXHJcbiAgICAgICAgY29uc3QgVUlTZWxlY3RvcnMgPSBWaWV3LmdldFNlbGVjdG9ycygpO1xyXG4gICAgICAgIGNvbnN0IFVJRWxlbWVudHMgPSBWaWV3LmdldEVsZW1lbnRzKCk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBRdWljayBcIkFkZCBUYXNrXCIgZXZlbnQgLSBTdWJtaXQgaW5wdXRcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLnF1aWNrVGFza0J0bikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHF1aWNrQWRkVGFza1N1Ym1pdCk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBcIkZvcm0gVGFza1wiIGV2ZW50IC0gT3BlbiBcIkZvcm0gVGFza1wiIG1vZHVsZVxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMuYWRkRm9ybU9wZW5idG4pLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBWaWV3Lm9wZW5Gb3JtVGFzayk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBcIkZvcm0gVGFza1wiIENhbmNlbCBidXR0b24gZXZlbnQgLSBDbG9zZSBcIkZvcm0gVGFza1wiIG1vZHVsZVxyXG4gICAgICAgIFVJRWxlbWVudHMuYWRkRm9ybUNhbmNlbEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgVmlldy5jbG9zZUZvcm1UYXNrKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIFwiRm9ybSBUYXNrXCIgZXZlbnQgLSBTdWJtaXQgaW5wdXRzXHJcbiAgICAgICAgVUlFbGVtZW50cy5hZGRGb3JtU3VibWl0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmb3JtVGFza1N1Ym1pdCk7XHJcblxyXG4gICAgICAgIC8vIEFkZCB0YXNrIGNvbXBvbmVudCBlbGxpcHNpcyAtIE9wZW4gXCJFZGl0IFRhc2tcIiBtb2R1bGVcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLndob2xlTGlzdHMpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGlja2VkRWRpdFRhc2spO1xyXG5cclxuICAgICAgICAvLyBBZGQgXCJFZGl0IFRhc2tcIiBVcGRhdGUgYnV0dG9uIGV2ZW50IC0gU3VibWl0IGlucHV0c1xyXG4gICAgICAgIFVJRWxlbWVudHMuZWRpdEZvcm1VcGRhdGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGVkaXRUYXNrU3VibWl0KTtcclxuXHJcbiAgICAgICAgLy8gQWRkIFwiRWRpdCBUYXNrXCIgQ2FuY2VsIGJ1dHRvbiBldmVudCAtIENsb3NlIFwiRWRpdCBUYXNrXCIgbW9kdWxlXHJcbiAgICAgICAgVUlFbGVtZW50cy5lZGl0Rm9ybUNhbmNlbEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgVmlldy5jbG9zZUVkaXRUYXNrKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIFwiRWRpdCBUYXNrXCIgRGVsZXRlIGJ1dHRvbiBldmVudCAtIERlbGV0ZSB0YXNrIGNvbXBvbmVudFxyXG4gICAgICAgIFVJRWxlbWVudHMuZWRpdEZvcm1EZWxldGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGVkaXRUYXNrRGVsZXRlU3VibWl0KTtcclxuXHJcbiAgICAgICAgLy8gQWRkIGNoZWNrYm94IGV2ZW50IC0gVXBkYXRlIGRhdGEgd2hlbiBjaGVja2VkIG9yIHVuY2hlY2tlZFxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMud2hvbGVMaXN0cykuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNoZWNrZWRUYXNrQW5kVXBhdGVEYXRhKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIFwiQ2xlYXIgTGlzdFwiIGV2ZW50IC0gT3BlbiBcIkNsZWFyIExpc3RcIiBNZW51XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5vcGVuQ2xlYXJMaXN0TWVudUJ0bikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIFZpZXcub3BlbkNsZWFyTGlzdE1lbnUpO1xyXG5cclxuICAgICAgICAvLyBBZGQgXCJDbGVhciBMaXN0XCIgZXZlbnQgLSBDbG9zZSBcIkNsZWFyIExpc3RcIiBNZW51XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5kZWxldGVDYW5jZWxCdG4pLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBWaWV3LmNsb3NlQ2xlYXJMaXN0TWVudSk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBcIkNsZWFyIExpc3RcIiBldmVudCAtIENsZWFyIE1haW4gYW5kIENvbXBsZXRlZCBMaXN0XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5kZWxldGVDb25maXJtQnRuKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xlYXJMaXN0cyk7XHJcblxyXG5cclxuICAgICAgICAvLyA/IEZlYXR1cmUgLSB5ZXMsIG5vLCB5ZXMsIG5vP1xyXG4gICAgICAgIC8vIERpc2FibGUgc3VibWl0IG9uIFwiRW50ZXJcIiBrZXkgZm9yIFwiRm9ybSBUYXNrXCIgYW5kIFwiRWRpdCBUYXNrXCIgSW5wdXRzXHJcbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBjYXRhc3Ryb3BoZSBtYXkgZm9sbG93XHJcbiAgICAgICAgLy8gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAvLyAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMgfHwgZS53aGljaCA9PT0gMTMpIHtcclxuICAgICAgICAvLyAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgLy8gICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9KTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEFkZCBRdWljayBcIkFkZCBUYXNrXCIgc3VibWl0XHJcbiAgICBjb25zdCBxdWlja0FkZFRhc2tTdWJtaXQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJRdWljayBBZGQgVGFza1wiKVxyXG5cclxuICAgICAgICAvLyBHZXQgaW5wdXQgdmFsdWVcclxuICAgICAgICBjb25zdCBpbnB1dCA9IFZpZXcuZ2V0UXVpY2tUYXNrSW5wdXQoKTtcclxuXHJcbiAgICAgICAgLy8gVmFsaWRhdGVcclxuICAgICAgICAvLyA/IFN1Z2dlc3Rpb25zOiBVc2UgUmVnRXhwXHJcbiAgICAgICAgaWYgKGlucHV0ICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUXVpY2sgQWRkIFRhc2s6IFZhbGlkYXRpbmdcIilcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBpbnB1dCB2YWx1ZSB0byBEYXRhLCBhbmRcclxuICAgICAgICAgICAgLy8gR2V0IGRlZmF1bHQgZGF0YSBzZXR1cCBmb3IgVUlcclxuICAgICAgICAgICAgY29uc3QgbmV3VGFza0RhdGEgPSBNb2RlbC5hZGRRdWlja1Rhc2soaW5wdXQpO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIG5ldyB0YXNrIHRvIFVJIGxpc3RcclxuICAgICAgICAgICAgVmlldy5hZGRUYXNrVG9NYWluTGlzdChuZXdUYXNrRGF0YSk7XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgdG8gTFNcclxuICAgICAgICAgICAgU3RvcmFnZS5hZGRJdGVtKG5ld1Rhc2tEYXRhKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENsZWFyIGlucHV0IGZpZWxkXHJcbiAgICAgICAgICAgIFZpZXcuY2xlYXJRdWlja0FkZFRhc2tJbnB1dCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhpbnB1dCk7XHJcblxyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gQWRkIFwiRm9ybSBUYXNrXCIgU3VibWl0XHJcbiAgICBjb25zdCBmb3JtVGFza1N1Ym1pdCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkZvcm0gVGFzayAtIEFkZCBDdXN0b21pc2VkIFRhc2tcIik7XHJcblxyXG4gICAgICAgIC8vIEdldCBWYWx1ZXNcclxuICAgICAgICBjb25zdCB0YXNrSW5wdXQgPSBWaWV3LmdldEZvcm1UYXNrVGFza0lucHV0KCk7XHJcbiAgICAgICAgY29uc3QgZGF0ZUlucHV0ID0gVmlldy5nZXRGb3JtVGFza0RhdGVJbnB1dCgpO1xyXG4gICAgICAgIGNvbnN0IG1lbW9JbnB1dCA9IFZpZXcuZ2V0Rm9ybVRhc2tNZW1vSW5wdXQoKTtcclxuICAgICAgICBjb25zdCBwaW5Cb29sZWFuID0gVmlldy5nZXRGb3JtVGFza1BpbkJvb2xlYW4oKTtcclxuICAgICAgICBjb25zdCBjb2xvclNlbGVjdCA9IFZpZXcuZ2V0Rm9ybVRhc2tDb2xvclNlbGVjdCgpO1xyXG5cclxuXHJcbiAgICAgICAgLy8gVmFsaWRhdGVcclxuICAgICAgICAvLyA/IFN1Z2dlc3Rpb25zOiBVc2UgUmVnRXhwXHJcbiAgICAgICAgaWYgKHRhc2tJbnB1dCAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkZvcm0gVGFzazogVmFsaWRhdGluZ1wiKVxyXG5cclxuICAgICAgICAgICAgLy8gQWRkIGlucHV0IHZhbHVlIHRvIERhdGEsIGFuZFxyXG4gICAgICAgICAgICAvLyBHZXQgZGVmYXVsdCBkYXRhIHNldHVwIGZvciBVSVxyXG4gICAgICAgICAgICBjb25zdCBuZXdUYXNrRGF0YSA9IE1vZGVsLmFkZEZvcm1UYXNrKHRhc2tJbnB1dCwgZGF0ZUlucHV0LCBtZW1vSW5wdXQsIHBpbkJvb2xlYW4sIGNvbG9yU2VsZWN0KTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBuZXcgdGFzayB0byBVSSBsaXN0XHJcbiAgICAgICAgICAgIC8vIElmIHBpbkJvb2xlYW4gaXMgdHJ1ZSwgUGluIHRvIHRoZSBUb3BcclxuICAgICAgICAgICAgaWYgKHBpbkJvb2xlYW4pIHtcclxuICAgICAgICAgICAgICAgIFZpZXcuYWRkVGFza1RvTWFpbkxpc3RQaW5uZWQobmV3VGFza0RhdGEpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgVmlldy5hZGRUYXNrVG9NYWluTGlzdChuZXdUYXNrRGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCB0byBMU1xyXG4gICAgICAgICAgICBTdG9yYWdlLmFkZEl0ZW0obmV3VGFza0RhdGEpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2xlYXIgYWxsIFwiRm9ybSBUYXNrXCIgZmllbGRzXHJcbiAgICAgICAgICAgIFZpZXcuY2xlYXJGb3JtVGFza0ZpZWxkcygpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2xvc2UgXCJGb3JtIFRhc2tcIiBtb2R1bGVcclxuICAgICAgICAgICAgVmlldy5jbG9zZUZvcm1UYXNrKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIE9wZW4gYW5kIHNldCBcIkVkaXQgVGFza1wiIG1vZHVsZVxyXG4gICAgY29uc3QgY2xpY2tlZEVkaXRUYXNrID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAvLyB1c2UgZXZlbnQgZGVsZWdhdGlvbiB2aWEgYGUudGFyZ2V0YCB0byBmaW5kIGVsZW1lbnRcclxuICAgICAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZWxsaXBzZXNfX3dyYXBwZXJcIikpIHtcclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFZGl0IENsaWNrZWQhXCIpO1xyXG5cclxuICAgICAgICAgICAgLy8gR2V0IHRhc2sgY29tcG9uZW50IGlkXHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUYXNrSWQgPSBlLnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUuaWQ7XHJcblxyXG4gICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImN1cnJlbnQgdGFzayBJRFwiLCBjdXJyZW50VGFza0lkKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0YXNrIGNvbXBvbmVudCBpZCBmcm9tIERhdGFcclxuICAgICAgICAgICAgY29uc3QgVGFza3RvRWRpdERhdGEgPSBNb2RlbC5nZXRUYXNrQnlJZChjdXJyZW50VGFza0lkKTtcclxuXHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFRhc2t0b0VkaXREYXRhKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFNldCB0YXNrIGNvbXBvbmVudCBhcyBcImN1cnJlbnRJdGVtXCIgaS5lLiBtYWtlcyBsb2NhdGluZyBpdCBlYXNpZXIgYW5kIGV0Yy5cclxuICAgICAgICAgICAgLy8gLi4uIGFuZCBlZGl0aW5nIHB1cnBvc2VcclxuICAgICAgICAgICAgTW9kZWwuc2V0Q3VycmVudFRhc2soVGFza3RvRWRpdERhdGEpO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIGN1cnJlbnQgdGFzayBjb21wb25lbnQgZGF0YSB0byBcIkVkaXQgVGFza1wiIEZvcm0gdG8gZGlzcGxheVxyXG4gICAgICAgICAgICBWaWV3LmFkZEl0ZW10b0VkaXRUYXNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBVcGRhdGUgXCJFZGl0IFRhc2tcIiBTdWJtaXRcclxuICAgIGNvbnN0IGVkaXRUYXNrU3VibWl0ID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJVcGRhdGluZyFcIik7XHJcblxyXG4gICAgICAgIC8vIEdldCBFZGl0IFRhc2sgSW5wdXRzIGFuZCBWYWx1ZXNcclxuICAgICAgICBjb25zdCB0YXNrSW5wdXQgPSBWaWV3LmdldEVkaXRUYXNrVGFza0lucHV0KCk7XHJcbiAgICAgICAgY29uc3QgZGF0ZUlucHV0ID0gVmlldy5nZXRFZGl0VGFza0RhdGVJbnB1dCgpO1xyXG4gICAgICAgIGNvbnN0IG1lbW9JbnB1dCA9IFZpZXcuZ2V0RWRpdFRhc2tNZW1vSW5wdXQoKTtcclxuICAgICAgICBjb25zdCBwaW5Cb29sZWFuID0gVmlldy5nZXRFZGl0VGFza1BpbkJvb2xlYW4oKTtcclxuICAgICAgICBjb25zdCBjb2xvclNlbGVjdCA9IFZpZXcuZ2V0RWRpdFRhc2tDb2xvclNlbGVjdCgpO1xyXG5cclxuICAgICAgICAvLyBVcGRhdGUgY29tcG9uZW50IHRhc2sgaW4gZGF0YVxyXG4gICAgICAgIGNvbnN0IHVwZGF0ZVRhc2tEYXRhID0gTW9kZWwudXBkYXRlRGF0YUZyb21FZGl0VGFzayh0YXNrSW5wdXQsIGRhdGVJbnB1dCwgbWVtb0lucHV0LCBwaW5Cb29sZWFuLCBjb2xvclNlbGVjdCk7XHJcblxyXG4gICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJuZXcgVXBkYXRlIGRhdGEgYXBwbGllZCB0byBkYXRhYmFzZVwiLCB1cGRhdGVUYXNrRGF0YSlcclxuXHJcbiAgICAgICAgLy8gVXBkYXRlIGl0ZW0gTFNcclxuICAgICAgICBTdG9yYWdlLnVwZGF0ZUl0ZW0odXBkYXRlVGFza0RhdGEpO1xyXG5cclxuICAgICAgICAvLyBVcGRhdGUgVUlcclxuICAgICAgICBWaWV3LnVwZGF0ZVRhc2tEaXNwbGF5RnJvbUVkaXRUYXNrKHVwZGF0ZVRhc2tEYXRhKTtcclxuXHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBEZWxldGUgYnV0dG9uIG9mIFwiRWRpdCBUYXNrXCIgbW9kdWxlXHJcbiAgICBjb25zdCBlZGl0VGFza0RlbGV0ZVN1Ym1pdCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgLy8gR2V0IGN1cnJlbnQgdGFzayBjb21wb25lbnRcclxuICAgICAgICBjb25zdCBjdXJyZW50VGFzayA9IE1vZGVsLmdldEN1cnJlbnRJdGVtKCk7XHJcblxyXG4gICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJBdHRlbXB0aW5nIHRvIGRlbGV0ZVwiLCBjdXJyZW50VGFzayk7XHJcblxyXG4gICAgICAgIC8vIERlbGV0ZSBmcm9tIGRhdGEgc3RydWN0dXJlXHJcbiAgICAgICAgTW9kZWwuZGVsZXRlSXRlbShjdXJyZW50VGFzay5pZCk7XHJcblxyXG4gICAgICAgIC8vIERlbGV0ZSBpdGVtIExTXHJcbiAgICAgICAgU3RvcmFnZS5kZWxldGVJdGVtKGN1cnJlbnRUYXNrLmlkKTtcclxuXHJcbiAgICAgICAgLy8gRGVsZXRlIGZyb20gVUlcclxuICAgICAgICBWaWV3LmRlbGV0ZVRhc2tEaXNwbGF5RnJvbUVkaXRUYXNrKGN1cnJlbnRUYXNrLmlkKTtcclxuXHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIElmIGEgdGFzayBpcyBVTkNIRUNLLCB1cGRhdGUgZGF0YSBhbmQgVUlcclxuICAgIGNvbnN0IGNoZWNrZWRUYXNrQW5kVXBhdGVEYXRhID0gZnVuY3Rpb24gKGUpIHtcclxuXHJcbiAgICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImNoZWNrXCIpKSB7XHJcbiAgICAgICAgICAgIGxldCBjb21wbGV0ZWRTdGF0dXMgPSBlLnRhcmdldC5jaGVja2VkO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjb21wbGV0ZWRTdGF0dXMpO1xyXG5cclxuICAgICAgICAgICAgLy8gR2V0IHRhc2sgY29tcG9uZW50IGlkXHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUYXNrSWQgPSBlLnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5pZDtcclxuXHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiY3VycmVudCB0YXNrIElEXCIsIGN1cnJlbnRUYXNrSWQpO1xyXG5cclxuICAgICAgICAgICAgLy8gR2V0IHRhc2sgY29tcG9uZW50IGlkIGZyb20gRGF0YVxyXG4gICAgICAgICAgICBjb25zdCBUYXNrdG9FZGl0RGF0YSA9IE1vZGVsLmdldFRhc2tCeUlkKGN1cnJlbnRUYXNrSWQpO1xyXG5cclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coVGFza3RvRWRpdERhdGEpO1xyXG5cclxuICAgICAgICAgICAgTW9kZWwuc2V0Q3VycmVudFRhc2soVGFza3RvRWRpdERhdGEpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdXBkYXRlVGFza0RhdGEgPSBNb2RlbC51cGRhdGVDdXJyZW50VGFza0NoZWNrZWREYXRhKGNvbXBsZXRlZFN0YXR1cyk7XHJcblxyXG4gICAgICAgICAgICAvLyBVcGRhdGUgaXRlbSBMU1xyXG4gICAgICAgICAgICBTdG9yYWdlLnVwZGF0ZUl0ZW0odXBkYXRlVGFza0RhdGEpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbXBsZXRlZFN0YXR1cyA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInRhc2sgZGF0YSBjaGFuZ2UgdG8gQ09NUExFVEUuLi5cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gRG8gTk9UIHVwZGF0ZSBVSVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0YXNrIGRhdGEgY2hhbmdlIHRvIFVOQ09NUExFVEUuLi5cIik7XHJcbiAgICAgICAgICAgICAgICAvLyBGZXRjaCBpdGVtcyBmcm9tIGRhdGEgc3RydWN0dXJlXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtcyA9IE1vZGVsLmdldEl0ZW1zKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlcmUgaXMgYW55IFwiY29tcGxldGVkXCIgdGFzayBlcXVhbCAndHJ1ZSdcclxuICAgICAgICAgICAgICAgIGxldCBjb21wbGV0ZWRTdGF0dXMgPSBmaW5kQ29tcGxldGVkU3RhdHVzKGl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDbGVhciBVSVxyXG4gICAgICAgICAgICAgICAgVmlldy5jbGVhckxpc3RzKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUmVwb3B1bGF0ZSBVSSB3aXRoIHVwZGF0ZSBkYXRhXHJcbiAgICAgICAgICAgICAgICBWaWV3LnBvcHVsYXRlTGlzdChpdGVtcywgY29tcGxldGVkU3RhdHVzKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIENsZWFyIExpc3RzIERhdGEgYW5kIFVJXHJcbiAgICBjb25zdCBjbGVhckxpc3RzID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAvLyBDbGVhciBMU1xyXG4gICAgICAgIFN0b3JhZ2UuY2xlYXJJdGVtcygpO1xyXG5cclxuICAgICAgICAvLyBDbGVhciBMaXN0cyBVSVxyXG4gICAgICAgIFZpZXcuY2xlYXJMaXN0cygpO1xyXG4gICAgICAgIFZpZXcuY2xvc2VDbGVhckxpc3RNZW51KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRmluZCBpZiBhbnkgdGFzayBjb21wb25lbnQgZGF0YSAoaXRlbSkgaXMgQ29tcGxldGVkXHJcbiAgICBjb25zdCBmaW5kQ29tcGxldGVkU3RhdHVzID0gZnVuY3Rpb24gKGl0ZW1zKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVGhlIGN1cnJlbnQgcHJvcGVydHkgc3RhdHVzIGlzXCIsIGl0ZW1bXCJjb21wbGV0ZWRcIl0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKGl0ZW1bXCJjb21wbGV0ZWRcIl0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQdWJsaWMgTWV0aG9kc1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiSW5pdGlhbGlzaW5nIEFwcC4uLlwiKVxyXG5cclxuICAgICAgICAgICAgLy8gRmV0Y2ggaXRlbXMgZnJvbSBkYXRhIHN0cnVjdHVyZVxyXG4gICAgICAgICAgICBjb25zdCBpdGVtcyA9IE1vZGVsLmdldEl0ZW1zKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGVyZSBpcyBhbnkgXCJjb21wbGV0ZWRcIiB0YXNrIGVxdWFsICd0cnVlJ1xyXG4gICAgICAgICAgICBsZXQgY29tcGxldGVkU3RhdHVzID0gZmluZENvbXBsZXRlZFN0YXR1cyhpdGVtcyk7XHJcblxyXG4gICAgICAgICAgICAvLyBQb3B1bGF0ZSBMaXN0XHJcbiAgICAgICAgICAgIFZpZXcucG9wdWxhdGVMaXN0KGl0ZW1zLCBjb21wbGV0ZWRTdGF0dXMpO1xyXG5cclxuICAgICAgICAgICAgLy8gTG9hZCBldmVudCBsaXN0ZW5lcnNcclxuICAgICAgICAgICAgbG9hZEV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KShNb2RlbCwgVmlldywgU3RvcmFnZSk7XHJcblxyXG4vLyBJbml0aWFsaXNlIEFwcFxyXG5Db250cm9sbGVyLmluaXQoKTtcclxuIl19
