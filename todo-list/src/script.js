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
  // console.log("pass - is Large Screen");
  mainElement.insertAdjacentElement('afterbegin', h1Title);
}

function isLargeScreen() {
  if (window.innerWidth >= 600) {
    // Move h1 .title element
    // console.log("pass - is Large Screen");
    mainElement.insertAdjacentElement('afterbegin', h1Title);
  } else {
    formTaskBtn.insertAdjacentElement('afterend', h1Title); // console.log("pass - is Large Screen Flex");
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJtdmMuanMiXSwibmFtZXMiOlsibWFpbkVsZW1lbnQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJmb3JtVGFza0J0biIsImgxVGl0bGUiLCJtcSIsIndpbmRvdyIsIm1hdGNoTWVkaWEiLCJtYXRjaGVzIiwiaW5zZXJ0QWRqYWNlbnRFbGVtZW50IiwiaXNMYXJnZVNjcmVlbiIsImlubmVyV2lkdGgiLCJhZGRFdmVudExpc3RlbmVyIiwiZ2V0VW5pcXVlSWQiLCJjcnlwdG8iLCJnZXRSYW5kb21WYWx1ZXMiLCJVaW50MzJBcnJheSIsIk1hdGgiLCJyYW5kb20iLCJTdG9yYWdlIiwiYWRkSXRlbSIsIm5ld1Rhc2tEYXRhIiwiaXRlbXMiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwicHVzaCIsInNldEl0ZW0iLCJKU09OIiwic3RyaW5naWZ5IiwicGFyc2UiLCJnZXRJdGVtcyIsInVwZGF0ZUl0ZW0iLCJ1cGRhdGVUYXNrRGF0YSIsImZvckVhY2giLCJpdGVtIiwiaW5kZXgiLCJpZCIsInNwbGljZSIsImRlbGV0ZUl0ZW0iLCJjbGVhckl0ZW1zIiwicmVtb3ZlSXRlbSIsIk1vZGVsIiwiTW9kZWxDb25zdHJ1Y3RvciIsInRpdGxlIiwiZGF0ZSIsIm1lbW8iLCJwaW4iLCJjb2xvciIsImNvbXBsZXRlZCIsImRhdGEiLCJjdXJyZW50SXRlbSIsImxvZ0RhdGEiLCJhZGRRdWlja1Rhc2siLCJxdWlja1Rhc2tJbnB1dCIsInVuZGVmaW5lZCIsImFkZEZvcm1UYXNrIiwidGFza0lucHV0IiwiZGF0ZUlucHV0IiwibWVtb0lucHV0IiwicGluQm9vbGVhbiIsImNvbG9yU2VsZWN0IiwiZ2V0VGFza0J5SWQiLCJ0YXJnZXRUYXNrRGF0YSIsInNldEN1cnJlbnRUYXNrIiwidGFza3RvRWRpdERhdGEiLCJnZXRDdXJyZW50SXRlbSIsInVwZGF0ZURhdGFGcm9tRWRpdFRhc2siLCJ1cGRhdGVDdXJyZW50VGFza0NoZWNrZWREYXRhIiwiY29tcGxldGVkU3RhdHVzIiwiaWRzIiwibWFwIiwiaW5kZXhPZiIsIlZpZXciLCJVSVNlbGVjdG9ycyIsIndob2xlTGlzdHMiLCJsaXN0Q29tcG9uZW50IiwicXVpY2tUYXNrQnRuIiwibWFpbkxpc3QiLCJjb21wbGV0ZWRMaXN0IiwiYWRkRm9ybU9wZW5idG4iLCJhZGRGb3JtIiwiZWRpdEZvcm0iLCJvdmVybGF5IiwiY2xlYXJMaXN0TWVudSIsImRlbGV0ZUNhbmNlbEJ0biIsImRlbGV0ZUNvbmZpcm1CdG4iLCJvcGVuQ2xlYXJMaXN0TWVudUJ0biIsIlVJRWxlbWVudHMiLCJhZGRGb3JtQ2FuY2VsQnRuIiwiY2hpbGRyZW4iLCJmaXJzdEVsZW1lbnRDaGlsZCIsImFkZEZvcm1UYXNrSW5wdXQiLCJsYXN0RWxlbWVudENoaWxkIiwiYWRkRm9ybURhdGVJbnB1dCIsImFkZEZvcm1NZW1vSW5wdXQiLCJhZGRGb3JtUGluSW5wdXQiLCJhZGRGb3JtQ29sb3JJbnB1dFJlZCIsImFkZEZvcm1Db2xvcklucHV0WWVsbG93IiwiYWRkRm9ybUNvbG9ySW5wdXRCbHVlIiwiYWRkRm9ybUNvbG9ySW5wdXRHcmVlbiIsImFkZEZvcm1Db2xvcklucHV0Tm9uZSIsImFkZEZvcm1TdWJtaXRCdG4iLCJlZGl0Rm9ybUNhbmNlbEJ0biIsImVkaXRGb3JtVXBkYXRlQnRuIiwiZWRpdEZvcm1UYXNrSW5wdXQiLCJlZGl0Rm9ybURhdGVJbnB1dCIsImVkaXRGb3JtTWVtb0lucHV0IiwiZWRpdEZvcm1QaW5JbnB1dCIsImVkaXRGb3JtQ29sb3JJbnB1dFJlZCIsImVkaXRGb3JtQ29sb3JJbnB1dFllbGxvdyIsImVkaXRGb3JtQ29sb3JJbnB1dEJsdWUiLCJlZGl0Rm9ybUNvbG9ySW5wdXRHcmVlbiIsImVkaXRGb3JtQ29sb3JJbnB1dE5vbmUiLCJlZGl0Rm9ybURlbGV0ZUJ0biIsInJlbmRlciIsInRhc2tEYXRhIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsImxpc3RDb21wb25lbnRGaXJzdEJsb2NrIiwicGluQ29tcG9uZW50IiwicGluSWNvbiIsInNldEF0dHJpYnV0ZSIsImFwcGVuZENoaWxkIiwiY2hlY2tib3hDb21wb25lbnQiLCJjaGVja2JveEljb24iLCJ0eXBlIiwiY2hlY2tlZCIsImNoZWNrYm94TGFiZWwiLCJjaGVja2JveExhYmVsVGV4dCIsImNyZWF0ZVRleHROb2RlIiwiYXBwZW5kIiwiZHVlRGF0ZUNvbXBvbmVudCIsImR1ZURhdGVTcGFuIiwiZHVlRGF0ZVRleHQiLCJlbGxpcHNpc0NvbXBvbmVudCIsImVsbGlwc2lzSWNvbiIsInN0aWNreUNvbG9yQ29tcG9uZW50IiwibGlzdENvbXBvbmVudFNlY29uZEJsb2NrIiwibWVtb1NwYW4iLCJtZW1vVGV4dCIsInBvcHVsYXRlTGlzdCIsInNob3dDb21wbGV0ZWRMaXN0IiwidGFzayIsImhpZGVDb21wbGV0ZWRMaXN0IiwiZ2V0U2VsZWN0b3JzIiwiZ2V0RWxlbWVudHMiLCJnZXRRdWlja1Rhc2tJbnB1dCIsInZhbHVlIiwiYWRkVGFza1RvTWFpbkxpc3QiLCJuZXdUYXNrIiwiYWRkVGFza1RvTWFpbkxpc3RQaW5uZWQiLCJjbGVhclF1aWNrQWRkVGFza0lucHV0Iiwic3R5bGUiLCJkaXNwbGF5Iiwib3BlbkZvcm1UYXNrIiwicmVtb3ZlIiwiY2xvc2VGb3JtVGFzayIsImdldEZvcm1UYXNrVGFza0lucHV0IiwiZ2V0Rm9ybVRhc2tEYXRlSW5wdXQiLCJmb3JtYXREYXRlIiwicmVwbGFjZUFsbCIsImdldEZvcm1UYXNrTWVtb0lucHV0IiwiZ2V0Rm9ybVRhc2tQaW5Cb29sZWFuIiwiZ2V0Rm9ybVRhc2tDb2xvclNlbGVjdCIsImNvbG9yVmFsdWUiLCJjbGVhckZvcm1UYXNrRmllbGRzIiwiYWRkSXRlbXRvRWRpdFRhc2siLCJvcGVuRWRpdFRhc2siLCJjbG9zZUVkaXRUYXNrIiwiZ2V0RWRpdFRhc2tUYXNrSW5wdXQiLCJnZXRFZGl0VGFza0RhdGVJbnB1dCIsImdldEVkaXRUYXNrTWVtb0lucHV0IiwiZ2V0RWRpdFRhc2tQaW5Cb29sZWFuIiwiZ2V0RWRpdFRhc2tDb2xvclNlbGVjdCIsImNvbnNvbGUiLCJsb2ciLCJ1cGRhdGVUYXNrRGlzcGxheUZyb21FZGl0VGFzayIsInRhc2tDb21wb25lbnRzIiwicXVlcnlTZWxlY3RvckFsbCIsIkFycmF5IiwiZnJvbSIsInRhc2tDb21wb25lbnQiLCJ0YXNrSWQiLCJjdXJyZW50VGFza0NvbXBvbmVudFVJIiwiZ2V0RWxlbWVudEJ5SWQiLCJuZXdEaXNwbGF5VGFza0NvbXBvbmVudCIsInBhcmVudE5vZGUiLCJyZXBsYWNlQ2hpbGQiLCJkZWxldGVUYXNrRGlzcGxheUZyb21FZGl0VGFzayIsIm9wZW5DbGVhckxpc3RNZW51IiwiY2xvc2VDbGVhckxpc3RNZW51IiwiY2xlYXJMaXN0cyIsImZpcnN0Q2hpbGQiLCJyZW1vdmVDaGlsZCIsIkNvbnRyb2xsZXIiLCJsb2FkRXZlbnRMaXN0ZW5lcnMiLCJxdWlja0FkZFRhc2tTdWJtaXQiLCJmb3JtVGFza1N1Ym1pdCIsImNsaWNrZWRFZGl0VGFzayIsImVkaXRUYXNrU3VibWl0IiwiZWRpdFRhc2tEZWxldGVTdWJtaXQiLCJjaGVja2VkVGFza0FuZFVwYXRlRGF0YSIsImUiLCJpbnB1dCIsInByZXZlbnREZWZhdWx0IiwidGFyZ2V0IiwiY29udGFpbnMiLCJjdXJyZW50VGFza0lkIiwiVGFza3RvRWRpdERhdGEiLCJjdXJyZW50VGFzayIsImZpbmRDb21wbGV0ZWRTdGF0dXMiLCJpbml0Il0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUVBLE1BQU1BLFdBQVcsR0FBR0MsUUFBUSxDQUFDQyxhQUFULENBQXVCLE1BQXZCLENBQXBCO0FBQ0EsTUFBTUMsV0FBVyxHQUFHRixRQUFRLENBQUNDLGFBQVQsQ0FBdUIsaUJBQXZCLENBQXBCO0FBQ0EsTUFBTUUsT0FBTyxHQUFHSCxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBaEIsQyxDQUVBOztBQUNBLE1BQU1HLEVBQUUsR0FBR0MsTUFBTSxDQUFDQyxVQUFQLENBQWtCLG9CQUFsQixDQUFYOztB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aWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gPT09PT09PT09PT09PVxyXG4vLyBNZWRpYSBRdWVyaWVzXHJcbi8vID09PT09PT09PT09PT1cclxuXHJcbmNvbnN0IG1haW5FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1haW5cIik7XHJcbmNvbnN0IGZvcm1UYXNrQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mb3JtLXRhc2tfX2J0blwiKTtcclxuY29uc3QgaDFUaXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGl0bGVcIik7XHJcblxyXG4vLyBSZS1Qb3NpdGlvbiBoMSAudGl0bGVcclxuY29uc3QgbXEgPSB3aW5kb3cubWF0Y2hNZWRpYShcIihtaW4td2lkdGg6IDYwMHB4KVwiKTtcclxuXHJcbmlmIChtcS5tYXRjaGVzKSB7XHJcbiAgICAvLyBNb3ZlIGgxIC50aXRsZSBlbGVtZW50XHJcbiAgICAvLyBjb25zb2xlLmxvZyhcInBhc3MgLSBpcyBMYXJnZSBTY3JlZW5cIik7XHJcbiAgICBtYWluRWxlbWVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2FmdGVyYmVnaW4nLCBoMVRpdGxlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNMYXJnZVNjcmVlbigpIHtcclxuICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+PSA2MDApIHtcclxuICAgICAgICAvLyBNb3ZlIGgxIC50aXRsZSBlbGVtZW50XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJwYXNzIC0gaXMgTGFyZ2UgU2NyZWVuXCIpO1xyXG4gICAgICAgIG1haW5FbGVtZW50Lmluc2VydEFkamFjZW50RWxlbWVudCgnYWZ0ZXJiZWdpbicsIGgxVGl0bGUpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZm9ybVRhc2tCdG4uaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCdhZnRlcmVuZCcsIGgxVGl0bGUpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicGFzcyAtIGlzIExhcmdlIFNjcmVlbiBGbGV4XCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBpc0xhcmdlU2NyZWVuKTtcclxuIiwiLy8gTW9kZWwgLSBWaWV3IC0gQ29udHJvbGxlciAoTVZDKSBQYXR0ZXJuIHVzZWQgKyBTdG9yYWdlQ3RybCB3aXRoIExvY2FsU3RvcmFnZSBpbnRlcmFjdGlvbnNcclxuXHJcbi8vIHRvZG9cclxuLy8gQ2xlYW4gQ29kZSBhbmQgY29tbWVudHNcclxuXHJcblxyXG5mdW5jdGlvbiBnZXRVbmlxdWVJZCgpIHtcclxuICAgIGlmICh3aW5kb3cuY3J5cHRvICYmIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50MzJBcnJheSgxKSlbMF07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpXHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT1cclxuLy8gU3RvcmFnZSBDb250cm9sbGVyXHJcbi8vID09PT09PT09PT09PT09PT09PVxyXG4vLyAtIExvY2FsIFN0b3JhZ2VcclxuLy8gTkI6IFwiaXRlbVwiIG1heSBhbHNvIGJlIHJlZmVycmVkIHRvIGRhdGEgZnJvbSBMb2NhbFN0b3JhZ2VcclxuY29uc3QgU3RvcmFnZSA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgLy8gUHVibGljIG1ldGhvZHNcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgYWRkSXRlbTogZnVuY3Rpb24gKG5ld1Rhc2tEYXRhKSB7XHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwicGVyc2lzdGluZyB0byBMUy4uLlwiKVxyXG4gICAgICAgICAgICBsZXQgaXRlbXM7XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayBmb3IgYXZhaWxhYmxlIGl0ZW0gaW4gTFNcclxuICAgICAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidGFza3NcIikgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW1zID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUHVzaCBuZXcgaXRlbVxyXG4gICAgICAgICAgICAgICAgaXRlbXMucHVzaChuZXdUYXNrRGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgbmV3IFN0b3JhZ2UgJ3Rhc2tzJ1wiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTZXQgTFNcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidGFza3NcIiwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIEdldCBhdmFpbGFibGUgaXRlbSBpbiBMU1xyXG4gICAgICAgICAgICAgICAgaXRlbXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidGFza3NcIikpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkdldHRpbmcgYXZhaWxhYmxlIFN0b3JhZ2U6IFwiLCBpdGVtcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUHVzaCBuZXcgaXRlbVxyXG4gICAgICAgICAgICAgICAgaXRlbXMucHVzaChuZXdUYXNrRGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUmUtU2V0IExTXHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRhc2tzXCIsIEpTT04uc3RyaW5naWZ5KGl0ZW1zKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldEl0ZW1zOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtcztcclxuXHJcbiAgICAgICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRhc2tzXCIpID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGl0ZW1zID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRhc2tzXCIpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW1zO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdXBkYXRlSXRlbTogZnVuY3Rpb24gKHVwZGF0ZVRhc2tEYXRhKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0YXNrc1wiKSk7XHJcblxyXG4gICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHVwZGF0ZVRhc2tEYXRhLmlkID09IGl0ZW0uaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtcy5zcGxpY2UoaW5kZXgsIDEsIHVwZGF0ZVRhc2tEYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidGFza3NcIiwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlbGV0ZUl0ZW06IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgICAgICBsZXQgaXRlbXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidGFza3NcIikpO1xyXG5cclxuICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpZCA9PSBpdGVtLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRhc2tzXCIsIEpTT04uc3RyaW5naWZ5KGl0ZW1zKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbGVhckl0ZW1zOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwidGFza3NcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuXHJcbi8vID09PT09XHJcbi8vIE1vZGVsXHJcbi8vID09PT09XHJcbi8vIC0gTG9jYWwgRGF0YVxyXG5jb25zdCBNb2RlbCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBNb2RlbCBDb25zdHJ1Y3RvclxyXG4gICAgY29uc3QgTW9kZWxDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uIChpZCA9IGdldFVuaXF1ZUlkKCksIHRpdGxlLCBkYXRlID0gXCJcIiwgbWVtbyA9IFwiXCIsIHBpbiA9IGZhbHNlLCBjb2xvciA9IFwibm9uZVwiLCBjb21wbGV0ZWQgPSBmYWxzZSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgdGhpcy5kYXRlID0gZGF0ZTtcclxuICAgICAgICB0aGlzLm1lbW8gPSBtZW1vO1xyXG4gICAgICAgIHRoaXMucGluID0gcGluO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcclxuICAgICAgICB0aGlzLmNvbXBsZXRlZCA9IGNvbXBsZXRlZDtcclxuICAgIH07XHJcblxyXG4gICAgLy8gRGF0YSBTdHJ1Y3R1cmVcclxuICAgIC8vIC0gc3RhdGU6IFwiY29tcGxldGVkXCIsIFwicGluXCJcclxuICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICAgLy8gaXRlbXM6IFtcclxuICAgICAgICAvLyAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgXCJpZFwiOiBnZXRVbmlxdWVJZCgpLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJ0aXRsZVwiOiBcIldhbGsgdGhlIGRvZ1wiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJtZW1vXCI6IFwiV2FsayBmb3IgaGFsZiBhbiBob3VyXCIsXHJcbiAgICAgICAgLy8gICAgICAgICBcImRhdGVcIjogXCJcIixcclxuICAgICAgICAvLyAgICAgICAgIFwicGluXCI6IGZhbHNlLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJjb2xvclwiOiBcIm5vbmVcIixcclxuICAgICAgICAvLyAgICAgICAgIFwiY29tcGxldGVkXCI6IGZhbHNlXHJcbiAgICAgICAgLy8gICAgIH0sXHJcbiAgICAgICAgLy8gICAgIHtcclxuICAgICAgICAvLyAgICAgICAgIFwiaWRcIjogZ2V0VW5pcXVlSWQoKSxcclxuICAgICAgICAvLyAgICAgICAgIFwidGl0bGVcIjogXCJXYXRlciB0aGUgcGxhbnRcIixcclxuICAgICAgICAvLyAgICAgICAgIFwibWVtb1wiOiBcIlwiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJkYXRlXCI6IFwiMDEvMDEvMjBcIixcclxuICAgICAgICAvLyAgICAgICAgIFwicGluXCI6IGZhbHNlLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJjb2xvclwiOiBcInJlZFwiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJjb21wbGV0ZWRcIjogZmFsc2VcclxuICAgICAgICAvLyAgICAgfSxcclxuICAgICAgICAvLyAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgXCJpZFwiOiBnZXRVbmlxdWVJZCgpLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJ0aXRsZVwiOiBcIldhdGVyIHRoZSBwbGFudCBhZ2FpblwiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJtZW1vXCI6IFwiXCIsXHJcbiAgICAgICAgLy8gICAgICAgICBcImRhdGVcIjogXCIwMS8wMS8yMFwiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJwaW5cIjogdHJ1ZSxcclxuICAgICAgICAvLyAgICAgICAgIFwiY29sb3JcIjogXCJub25lXCIsXHJcbiAgICAgICAgLy8gICAgICAgICBcImNvbXBsZXRlZFwiOiBmYWxzZVxyXG4gICAgICAgIC8vICAgICB9LFxyXG4gICAgICAgIC8vICAgICB7XHJcbiAgICAgICAgLy8gICAgICAgICBcImlkXCI6IGdldFVuaXF1ZUlkKCksXHJcbiAgICAgICAgLy8gICAgICAgICBcInRpdGxlXCI6IFwiRG8gZ3JvY2VyeVwiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJtZW1vXCI6IFwiXCIsXHJcbiAgICAgICAgLy8gICAgICAgICBcImRhdGVcIjogXCJcIixcclxuICAgICAgICAvLyAgICAgICAgIFwicGluXCI6IHRydWUsXHJcbiAgICAgICAgLy8gICAgICAgICBcImNvbG9yXCI6IFwibm9uZVwiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJjb21wbGV0ZWRcIjogdHJ1ZVxyXG4gICAgICAgIC8vICAgICB9LFxyXG4gICAgICAgIC8vICAgICB7XHJcbiAgICAgICAgLy8gICAgICAgICBcImlkXCI6IGdldFVuaXF1ZUlkKCksXHJcbiAgICAgICAgLy8gICAgICAgICBcInRpdGxlXCI6IFwiU2luZyBzb25nXCIsXHJcbiAgICAgICAgLy8gICAgICAgICBcIm1lbW9cIjogXCJcIixcclxuICAgICAgICAvLyAgICAgICAgIFwiZGF0ZVwiOiBcIlwiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJwaW5cIjogZmFsc2UsXHJcbiAgICAgICAgLy8gICAgICAgICBcImNvbG9yXCI6IFwibm9uZVwiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJjb21wbGV0ZWRcIjogdHJ1ZVxyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gXSxcclxuICAgICAgICBpdGVtczogU3RvcmFnZS5nZXRJdGVtcygpLFxyXG4gICAgICAgIGN1cnJlbnRJdGVtOiBudWxsLFxyXG4gICAgfVxyXG5cclxuICAgIC8vIFB1YmxpYyBNZXRob2RzXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGxvZ0RhdGE6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRJdGVtczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZGF0YS5pdGVtcztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFkZFF1aWNrVGFzazogZnVuY3Rpb24gKHF1aWNrVGFza0lucHV0KSB7XHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHF1aWNrVGFza0lucHV0KTtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBuZXcgdGFza1xyXG4gICAgICAgICAgICBjb25zdCBuZXdUYXNrRGF0YSA9IG5ldyBNb2RlbENvbnN0cnVjdG9yKHVuZGVmaW5lZCwgcXVpY2tUYXNrSW5wdXQpO1xyXG5cclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobmV3VGFza0RhdGEpO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIHRvIGl0ZW1zIEFycmF5XHJcbiAgICAgICAgICAgIGRhdGEuaXRlbXMucHVzaChuZXdUYXNrRGF0YSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3VGFza0RhdGE7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZGRGb3JtVGFzazogZnVuY3Rpb24gKHRhc2tJbnB1dCwgZGF0ZUlucHV0LCBtZW1vSW5wdXQsIHBpbkJvb2xlYW4sIGNvbG9yU2VsZWN0KSB7XHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRhc2tJbnB1dCwgZGF0ZUlucHV0LCBtZW1vSW5wdXQsIHBpbkJvb2xlYW4sIGNvbG9yU2VsZWN0KTtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBuZXcgdGFza1xyXG4gICAgICAgICAgICBjb25zdCBuZXdUYXNrRGF0YSA9IG5ldyBNb2RlbENvbnN0cnVjdG9yKHVuZGVmaW5lZCwgdGFza0lucHV0LCBkYXRlSW5wdXQsIG1lbW9JbnB1dCwgcGluQm9vbGVhbiwgY29sb3JTZWxlY3QpO1xyXG5cclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobmV3VGFza0RhdGEpO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIHRvIGl0ZW1zIEFycmF5XHJcbiAgICAgICAgICAgIGRhdGEuaXRlbXMucHVzaChuZXdUYXNrRGF0YSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3VGFza0RhdGE7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRUYXNrQnlJZDogZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgICAgIGxldCB0YXJnZXRUYXNrRGF0YSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAvLyBMb29wIHRocm91Z2ggaXRlbXNcclxuICAgICAgICAgICAgZGF0YS5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5pZCA9PSBpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRhc2tEYXRhID0gaXRlbTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkZldGNoaW5nIHRhcmdldGVkIGl0ZW0gaXNcIiwgdGFyZ2V0VGFza0RhdGEpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldFRhc2tEYXRhO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0Q3VycmVudFRhc2s6IGZ1bmN0aW9uICh0YXNrdG9FZGl0RGF0YSkge1xyXG4gICAgICAgICAgICBkYXRhLmN1cnJlbnRJdGVtID0gdGFza3RvRWRpdERhdGE7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRDdXJyZW50SXRlbTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZGF0YS5jdXJyZW50SXRlbTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVwZGF0ZURhdGFGcm9tRWRpdFRhc2s6IGZ1bmN0aW9uICh0YXNrSW5wdXQsIGRhdGVJbnB1dCwgbWVtb0lucHV0LCBwaW5Cb29sZWFuLCBjb2xvclNlbGVjdCkge1xyXG4gICAgICAgICAgICBsZXQgdGFyZ2V0VGFza0RhdGEgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgZGF0YS5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5pZCA9PT0gZGF0YS5jdXJyZW50SXRlbS5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFNldCBuZXcgdmFsdWVzXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS50aXRsZSA9IHRhc2tJbnB1dDtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmRhdGUgPSBkYXRlSW5wdXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5tZW1vID0gbWVtb0lucHV0O1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ucGluID0gcGluQm9vbGVhbjtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmNvbG9yID0gY29sb3JTZWxlY3Q7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRhc2tEYXRhID0gaXRlbTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRUYXNrRGF0YTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVwZGF0ZUN1cnJlbnRUYXNrQ2hlY2tlZERhdGE6IGZ1bmN0aW9uIChjb21wbGV0ZWRTdGF0dXMpIHtcclxuICAgICAgICAgICAgbGV0IHRhcmdldFRhc2tEYXRhID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGRhdGEuaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT0gZGF0YS5jdXJyZW50SXRlbS5pZCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBTZXQgcHJvcGVydHkgXCJjb21wbGV0ZWRcIiB0byBgdHJ1ZWBcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmNvbXBsZXRlZCA9IGNvbXBsZXRlZFN0YXR1cztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkN1cnJlbnQgdGFzayBjb21wbGV0ZSBpc1wiLCBpdGVtLmNvbXBsZXRlZClcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VGFza0RhdGEgPSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldFRhc2tEYXRhO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlSXRlbTogZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRGVsZXRpbmcgZGF0YS4uLlwiKVxyXG5cclxuICAgICAgICAgICAgLy8gR2V0IGFuIEFycmF5IG9mIGlkc1xyXG4gICAgICAgICAgICBjb25zdCBpZHMgPSBkYXRhLml0ZW1zLm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uaWQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gR2V0IGluZGV4IG9mIHRhcmdldCB0YXNrIGNvbXBvbmVudCBpZFxyXG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGlkcy5pbmRleE9mKGlkKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFJlbW92ZSBpdGVtXHJcbiAgICAgICAgICAgIGRhdGEuaXRlbXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG5cclxuLy8gPT09PVxyXG4vLyBWaWV3XHJcbi8vID09PT1cclxuLy8gLSBBbnl0aGluZyB0byBkbyB3aXRoIHRoZSBVSVxyXG5jb25zdCBWaWV3ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIFVJIHNlbGVjdG9ycycgbmFtZVxyXG4gICAgY29uc3QgVUlTZWxlY3RvcnMgPSB7XHJcbiAgICAgICAgd2hvbGVMaXN0czogXCIubGlzdF9fd3JhcHBlclwiLFxyXG4gICAgICAgIGxpc3RDb21wb25lbnQ6IFwiLmxpc3QtY29tcG9uZW50XCIsXHJcbiAgICAgICAgLy8gUXVpY2sgXCJBZGQgVGFza1wiIFNlbGVjdG9yc1xyXG4gICAgICAgIHF1aWNrVGFza0lucHV0OiBcIi5hZGQtdGFza19faW5wdXRcIixcclxuICAgICAgICBxdWlja1Rhc2tCdG46IFwiLmFkZC10YXNrX19idG5cIixcclxuICAgICAgICAvLyBMaXN0cyBTZWxlY3RvcnNcclxuICAgICAgICBtYWluTGlzdDogXCIubWFpbi1saXN0XCIsXHJcbiAgICAgICAgY29tcGxldGVkTGlzdDogXCIuY29tcGxldGVkLWxpc3RcIixcclxuICAgICAgICAvLyBGb3JtIFNlbGVjdG9yc1xyXG4gICAgICAgIGFkZEZvcm1PcGVuYnRuOiBcIi5mb3JtLXRhc2tfX2J0blwiLFxyXG4gICAgICAgIGFkZEZvcm06IFwiLmZvcm0tdGFza19fd3JhcHBlclwiLFxyXG4gICAgICAgIGVkaXRGb3JtOiBcIi5lZGl0LXRhc2tfX3dyYXBwZXJcIixcclxuICAgICAgICBvdmVybGF5OiBcIi5vdmVybGF5X19tb2R1bGVcIixcclxuICAgICAgICAvLyBDbGVhciBMaXN0IFNlbGVjdG9yc1xyXG4gICAgICAgIGNsZWFyTGlzdE1lbnU6IFwiLmRlbGV0ZS1jb25maXJtYXRpb25fX21vZHVsZVwiLFxyXG4gICAgICAgIGRlbGV0ZUNhbmNlbEJ0bjogXCIuZGVsZXRlLWNvbmZpcm1hdGlvbi1jYW5jZWxfX2J0blwiLFxyXG4gICAgICAgIGRlbGV0ZUNvbmZpcm1CdG46IFwiLmRlbGV0ZS1jb25maXJtYXRpb24tY29uZmlybV9fYnRuXCIsXHJcbiAgICAgICAgb3BlbkNsZWFyTGlzdE1lbnVCdG46IFwiLmNsZWFyLWxpc3RfX2J0blwiXHJcbiAgICB9XHJcblxyXG4gICAgLy8gVUkgZWxlbWVudFxyXG4gICAgY29uc3QgVUlFbGVtZW50cyA9IHtcclxuICAgICAgICAvLyBcIkZvcm0gVGFza1wiIEZvcm1cclxuICAgICAgICBhZGRGb3JtQ2FuY2VsQnRuOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZvcm0tdGFza19fbW9kdWxlXCIpLmNoaWxkcmVuWzBdLmZpcnN0RWxlbWVudENoaWxkLFxyXG4gICAgICAgIGFkZEZvcm1UYXNrSW5wdXQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybS10YXNrX19tb2R1bGVcIikuY2hpbGRyZW5bMV0uY2hpbGRyZW5bMF0ubGFzdEVsZW1lbnRDaGlsZCxcclxuICAgICAgICBhZGRGb3JtRGF0ZUlucHV0OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZvcm0tdGFza19fbW9kdWxlXCIpLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzFdLmxhc3RFbGVtZW50Q2hpbGQsXHJcbiAgICAgICAgYWRkRm9ybU1lbW9JbnB1dDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mb3JtLXRhc2tfX21vZHVsZVwiKS5jaGlsZHJlblsxXS5jaGlsZHJlblsyXS5sYXN0RWxlbWVudENoaWxkLFxyXG4gICAgICAgIGFkZEZvcm1QaW5JbnB1dDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mb3JtLXRhc2tfX21vZHVsZVwiKS5jaGlsZHJlblsxXS5jaGlsZHJlblszXS5sYXN0RWxlbWVudENoaWxkLmZpcnN0RWxlbWVudENoaWxkLFxyXG4gICAgICAgIGFkZEZvcm1Db2xvcklucHV0UmVkOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZvcm0tdGFza19fbW9kdWxlXCIpLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzBdLFxyXG4gICAgICAgIGFkZEZvcm1Db2xvcklucHV0WWVsbG93OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZvcm0tdGFza19fbW9kdWxlXCIpLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzJdLFxyXG4gICAgICAgIGFkZEZvcm1Db2xvcklucHV0Qmx1ZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mb3JtLXRhc2tfX21vZHVsZVwiKS5jaGlsZHJlblsxXS5jaGlsZHJlbls0XS5jaGlsZHJlblsxXS5jaGlsZHJlbls0XSxcclxuICAgICAgICBhZGRGb3JtQ29sb3JJbnB1dEdyZWVuOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZvcm0tdGFza19fbW9kdWxlXCIpLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzZdLFxyXG4gICAgICAgIGFkZEZvcm1Db2xvcklucHV0Tm9uZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mb3JtLXRhc2tfX21vZHVsZVwiKS5jaGlsZHJlblsxXS5jaGlsZHJlbls0XS5jaGlsZHJlblsxXS5jaGlsZHJlbls4XSxcclxuICAgICAgICBhZGRGb3JtU3VibWl0QnRuOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZvcm0tdGFza19fbW9kdWxlXCIpLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzJdLFxyXG4gICAgICAgIC8vIFwiRWRpdCBUYXNrXCIgRm9ybVxyXG4gICAgICAgIGVkaXRGb3JtQ2FuY2VsQnRuOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXQtdGFza19fbW9kdWxlXCIpLmNoaWxkcmVuWzBdLmZpcnN0RWxlbWVudENoaWxkLFxyXG4gICAgICAgIGVkaXRGb3JtVXBkYXRlQnRuOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXQtdGFza19fbW9kdWxlXCIpLmNoaWxkcmVuWzBdLmxhc3RFbGVtZW50Q2hpbGQsXHJcbiAgICAgICAgZWRpdEZvcm1UYXNrSW5wdXQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZWRpdC10YXNrX19tb2R1bGVcIikuY2hpbGRyZW5bMV0uY2hpbGRyZW5bMF0ubGFzdEVsZW1lbnRDaGlsZCxcclxuICAgICAgICBlZGl0Rm9ybURhdGVJbnB1dDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lZGl0LXRhc2tfX21vZHVsZVwiKS5jaGlsZHJlblsxXS5jaGlsZHJlblsxXS5sYXN0RWxlbWVudENoaWxkLFxyXG4gICAgICAgIGVkaXRGb3JtTWVtb0lucHV0OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXQtdGFza19fbW9kdWxlXCIpLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzJdLmxhc3RFbGVtZW50Q2hpbGQsXHJcbiAgICAgICAgZWRpdEZvcm1QaW5JbnB1dDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lZGl0LXRhc2tfX21vZHVsZVwiKS5jaGlsZHJlblsxXS5jaGlsZHJlblszXS5sYXN0RWxlbWVudENoaWxkLmZpcnN0RWxlbWVudENoaWxkLFxyXG4gICAgICAgIGVkaXRGb3JtQ29sb3JJbnB1dFJlZDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lZGl0LXRhc2tfX21vZHVsZVwiKS5jaGlsZHJlblsxXS5jaGlsZHJlbls0XS5jaGlsZHJlblsxXS5jaGlsZHJlblswXSxcclxuICAgICAgICBlZGl0Rm9ybUNvbG9ySW5wdXRZZWxsb3c6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZWRpdC10YXNrX19tb2R1bGVcIikuY2hpbGRyZW5bMV0uY2hpbGRyZW5bNF0uY2hpbGRyZW5bMV0uY2hpbGRyZW5bMl0sXHJcbiAgICAgICAgZWRpdEZvcm1Db2xvcklucHV0Qmx1ZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lZGl0LXRhc2tfX21vZHVsZVwiKS5jaGlsZHJlblsxXS5jaGlsZHJlbls0XS5jaGlsZHJlblsxXS5jaGlsZHJlbls0XSxcclxuICAgICAgICBlZGl0Rm9ybUNvbG9ySW5wdXRHcmVlbjogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lZGl0LXRhc2tfX21vZHVsZVwiKS5jaGlsZHJlblsxXS5jaGlsZHJlbls0XS5jaGlsZHJlblsxXS5jaGlsZHJlbls2XSxcclxuICAgICAgICBlZGl0Rm9ybUNvbG9ySW5wdXROb25lOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXQtdGFza19fbW9kdWxlXCIpLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzhdLFxyXG4gICAgICAgIGVkaXRGb3JtRGVsZXRlQnRuOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXQtdGFza19fbW9kdWxlXCIpLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzJdXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVuZGVyID0gZnVuY3Rpb24gKHRhc2tEYXRhKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdENvbXBvbmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgbGlzdENvbXBvbmVudC5jbGFzc0xpc3QuYWRkKFwibGlzdC1jb21wb25lbnRcIik7XHJcblxyXG4gICAgICAgIC8vIEFkZCBVbmlxdWUgSURcclxuICAgICAgICBsaXN0Q29tcG9uZW50LmlkID0gdGFza0RhdGFbXCJpZFwiXTtcclxuXHJcbiAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhsaXN0Q29tcG9uZW50LmlkKTtcclxuXHJcbiAgICAgICAgLy8gTGlzdCBDb21wb25lbnQgLSBGaXJzdCBCbG9ja1xyXG4gICAgICAgIGNvbnN0IGxpc3RDb21wb25lbnRGaXJzdEJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBsaXN0Q29tcG9uZW50Rmlyc3RCbG9jay5jbGFzc0xpc3QuYWRkKFwibGlzdC1jb21wb25lbnRfX2ZpcnN0LWJsb2NrXCIpO1xyXG5cclxuICAgICAgICAvLyBMaXN0IENvbXBvbmVudCAtIEZpcnN0IEJsb2NrIC0gQ29tcG9uZW50c1xyXG4gICAgICAgIC8vIFBpbiB0byB0aGUgVG9wXHJcbiAgICAgICAgY29uc3QgcGluQ29tcG9uZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBwaW5Db21wb25lbnQuY2xhc3NMaXN0LmFkZChcInBpbl9fd3JhcHBlclwiKTtcclxuICAgICAgICBjb25zdCBwaW5JY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlcIik7XHJcbiAgICAgICAgcGluSWNvbi5jbGFzc0xpc3QuYWRkKFwiZmFcIiwgXCJmYS10aHVtYi10YWNrXCIpO1xyXG5cclxuICAgICAgICBpZiAoIXRhc2tEYXRhW1wicGluXCJdKSB7XHJcbiAgICAgICAgICAgIHBpbkljb24uY2xhc3NMaXN0LmFkZChcImludmlzaWJsZVwiKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcGluSWNvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcInRydWVcIik7XHJcblxyXG4gICAgICAgIHBpbkNvbXBvbmVudC5hcHBlbmRDaGlsZChwaW5JY29uKTtcclxuXHJcbiAgICAgICAgLy8gQ2hlY2tib3hcclxuICAgICAgICBjb25zdCBjaGVja2JveENvbXBvbmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgICAgICBjaGVja2JveENvbXBvbmVudC5jbGFzc0xpc3QuYWRkKFwiY2hlY2tib3hcIik7XHJcbiAgICAgICAgLy8gY2hlY2tib3hDb21wb25lbnQuc2V0QXR0cmlidXRlKFwiZm9yXCIsIFwiY2hlY2tcIik7XHJcblxyXG4gICAgICAgIC8vIENoZWNrYm94IC0gSWNvblxyXG4gICAgICAgIGNvbnN0IGNoZWNrYm94SWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBjaGVja2JveEljb24uaWQgPSBcImNoZWNrXCI7XHJcbiAgICAgICAgY2hlY2tib3hJY29uLnR5cGUgPSBcImNoZWNrYm94XCI7XHJcbiAgICAgICAgY2hlY2tib3hJY29uLmNoZWNrZWQgPSB0YXNrRGF0YVtcImNvbXBsZXRlZFwiXTtcclxuICAgICAgICBjaGVja2JveEljb24uY2xhc3NMaXN0LmFkZChcImNoZWNrXCIpO1xyXG5cclxuICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQ2hlY2tib3hJY29uXCIsIGNoZWNrYm94SWNvbi5jaGVja2VkKTtcclxuXHJcbiAgICAgICAgLy8gQ2hlY2tib3ggLSBMYWJlbFxyXG4gICAgICAgIGNvbnN0IGNoZWNrYm94TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBjaGVja2JveExhYmVsLmNsYXNzTGlzdC5hZGQoXCJ0ZXh0LWxhYmVsXCIpO1xyXG5cclxuICAgICAgICAvLyBDaGVja2JveCAtIExhYmVsIC0gQ3JlYXRlIFRleHROb2RlXHJcbiAgICAgICAgY29uc3QgY2hlY2tib3hMYWJlbFRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0YXNrRGF0YVtcInRpdGxlXCJdKTtcclxuICAgICAgICBjaGVja2JveExhYmVsLmFwcGVuZChjaGVja2JveExhYmVsVGV4dCk7XHJcblxyXG4gICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJyZW5kZXJpbmcgbGFiZWw6XCIsIGNoZWNrYm94TGFiZWwpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicmVuZGVyaW5nIGxhYmVsIHRleHQ6XCIsIGNoZWNrYm94TGFiZWxUZXh0KTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInJlbmRlcmluZyBsYWJlbCB0ZXh0IGRhdGE6XCIsIHRhc2tEYXRhW1widGl0bGVcIl0pO1xyXG5cclxuICAgICAgICBjaGVja2JveENvbXBvbmVudC5hcHBlbmRDaGlsZChjaGVja2JveEljb24pO1xyXG4gICAgICAgIGNoZWNrYm94Q29tcG9uZW50LmFwcGVuZENoaWxkKGNoZWNrYm94TGFiZWwpO1xyXG5cclxuICAgICAgICAvLyBEdWUgRGF0ZVxyXG4gICAgICAgIGNvbnN0IGR1ZURhdGVDb21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGR1ZURhdGVDb21wb25lbnQuY2xhc3NMaXN0LmFkZChcImR1ZS1kYXRlXCIpO1xyXG5cclxuICAgICAgICAvLyBEdWUgRGF0ZSAtIFNwYW4gRWxlbWVudFxyXG4gICAgICAgIGNvbnN0IGR1ZURhdGVTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgZHVlRGF0ZVNwYW4uY2xhc3NMaXN0LmFkZChcInRleHQtZGF0ZVwiKTtcclxuXHJcbiAgICAgICAgaWYgKHRhc2tEYXRhW1wiZGF0ZVwiXSkge1xyXG4gICAgICAgICAgICAvLyBEdWUgRGF0ZSAtIENyZWF0ZSBUZXh0Tm9kZVxyXG4gICAgICAgICAgICBjb25zdCBkdWVEYXRlVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRhc2tEYXRhW1wiZGF0ZVwiXSk7XHJcbiAgICAgICAgICAgIGR1ZURhdGVTcGFuLmFwcGVuZChkdWVEYXRlVGV4dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkdWVEYXRlQ29tcG9uZW50LmFwcGVuZENoaWxkKGR1ZURhdGVTcGFuKTtcclxuXHJcbiAgICAgICAgLy8gRWxsaXBzZXNcclxuICAgICAgICBjb25zdCBlbGxpcHNpc0NvbXBvbmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZWxsaXBzaXNDb21wb25lbnQuY2xhc3NMaXN0LmFkZChcImVsbGlwc2VzX193cmFwcGVyXCIpO1xyXG5cclxuICAgICAgICAvLyBFbGxpcHNlcyAtIEljb25cclxuICAgICAgICBjb25zdCBlbGxpcHNpc0ljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaVwiKTtcclxuICAgICAgICBlbGxpcHNpc0ljb24uY2xhc3NMaXN0LmFkZChcImZhXCIsIFwiZmEtZWxsaXBzaXMtaFwiKTtcclxuICAgICAgICBlbGxpcHNpc0ljb24uc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJ0cnVlXCIpO1xyXG5cclxuICAgICAgICBlbGxpcHNpc0NvbXBvbmVudC5hcHBlbmRDaGlsZChlbGxpcHNpc0ljb24pO1xyXG5cclxuICAgICAgICAvLyBTdGljayBDb2xvclxyXG4gICAgICAgIGNvbnN0IHN0aWNreUNvbG9yQ29tcG9uZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBzdGlja3lDb2xvckNvbXBvbmVudC5jbGFzc0xpc3QuYWRkKFwic3RpY2t5LWNvbG9yXCIpO1xyXG5cclxuICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUmVuZGVyaW5nIFN0aWNreSBDb2xvcjpcIiwgdGFza0RhdGFbXCJjb2xvclwiXSk7XHJcblxyXG4gICAgICAgIGlmICh0YXNrRGF0YVtcImNvbG9yXCJdICE9IFwibm9uZVwiKSB7XHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQWRkaW5nIGNsYXNzIFN0aWNreSBDb2xvcjpcIiwgdGFza0RhdGFbXCJjb2xvclwiXSk7XHJcblxyXG4gICAgICAgICAgICBzdGlja3lDb2xvckNvbXBvbmVudC5jbGFzc0xpc3QuYWRkKHRhc2tEYXRhW1wiY29sb3JcIl0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUmVuZGVyaW5nIFN0aWNreSBDb2xvcjogXCIsIFwibm9uZVwiKTtcclxuXHJcbiAgICAgICAgICAgIHN0aWNreUNvbG9yQ29tcG9uZW50LmNsYXNzTGlzdC5hZGQoXCJub25lXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTGlzdCBDb21wb25lbnQgLSBTZWNvbmQgQmxvY2tcclxuICAgICAgICBjb25zdCBsaXN0Q29tcG9uZW50U2Vjb25kQmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGxpc3RDb21wb25lbnRTZWNvbmRCbG9jay5jbGFzc0xpc3QuYWRkKFwibGlzdC1jb21wb25lbnRfX3NlY29uZC1ibG9ja1wiKTtcclxuXHJcbiAgICAgICAgLy8gTWVtb1xyXG4gICAgICAgIGNvbnN0IG1lbW9TcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgbWVtb1NwYW4uY2xhc3NMaXN0LmFkZChcInRleHQtbWVtb1wiKTtcclxuXHJcbiAgICAgICAgaWYgKHRhc2tEYXRhW1wibWVtb1wiXSkge1xyXG4gICAgICAgICAgICAvLyBNZW1vIC0gQ3JlYXRlIFRleHROb2RlXHJcbiAgICAgICAgICAgIGNvbnN0IG1lbW9UZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGFza0RhdGFbXCJtZW1vXCJdKTtcclxuICAgICAgICAgICAgbWVtb1NwYW4uYXBwZW5kKG1lbW9UZXh0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsaXN0Q29tcG9uZW50U2Vjb25kQmxvY2suY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxpc3RDb21wb25lbnRTZWNvbmRCbG9jay5hcHBlbmRDaGlsZChtZW1vU3Bhbik7XHJcblxyXG4gICAgICAgIC8vIFB1dHRpbmcgaXQgYWxsIHRvZ2V0aGVyLi4uXHJcbiAgICAgICAgbGlzdENvbXBvbmVudEZpcnN0QmxvY2suYXBwZW5kKHBpbkNvbXBvbmVudCwgY2hlY2tib3hDb21wb25lbnQsIGR1ZURhdGVDb21wb25lbnQsIGVsbGlwc2lzQ29tcG9uZW50LCBzdGlja3lDb2xvckNvbXBvbmVudCk7XHJcblxyXG4gICAgICAgIGxpc3RDb21wb25lbnQuYXBwZW5kQ2hpbGQobGlzdENvbXBvbmVudEZpcnN0QmxvY2spO1xyXG4gICAgICAgIGxpc3RDb21wb25lbnQuYXBwZW5kQ2hpbGQobGlzdENvbXBvbmVudFNlY29uZEJsb2NrKTtcclxuXHJcbiAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhsaXN0Q29tcG9uZW50KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGxpc3RDb21wb25lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHVibGljIE1ldGhvZHNcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcG9wdWxhdGVMaXN0OiBmdW5jdGlvbiAoaXRlbXMsIGNvbXBsZXRlZFN0YXR1cykge1xyXG4gICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlRoZSBDb21wbGV0ZWQgU3RhdHVzIGlzXCIsIGNvbXBsZXRlZFN0YXR1cyk7XHJcblxyXG4gICAgICAgICAgICAvLyBJZiBjb21wbGV0ZWQgc3RhdHVzIGlzIGF2YWlsYWJsZSxcclxuICAgICAgICAgICAgLy8gcG9wdWxhdGUgZm9yIEJPVEggTWFpbiBMaXN0IGFuZCBDb21wbGV0ZWQgTGlzdFxyXG4gICAgICAgICAgICAvLyBJZiBub3QsIHBvcHVsYXRlIGZvciBNYWluIExpc3QgT05MWVxyXG4gICAgICAgICAgICBpZiAoY29tcGxldGVkU3RhdHVzKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBTaG93IENvbXBsZXRlZCBMaXN0XHJcbiAgICAgICAgICAgICAgICBWaWV3LnNob3dDb21wbGV0ZWRMaXN0KCk7XHJcbiAgICAgICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRhc2sgPSByZW5kZXIoaXRlbSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJwb3B1bGF0aW5nOlwiLCB0YXNrKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRmlsdGVyIE1haW4gTGlzdCBhbmQgQ29tcGxldGVkIExpc3RcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21wbGV0ZWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwicG9wdWxhdGluIE1haW4gbGlzdC4uLlwiKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0ucGluKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLm1haW5MaXN0KS5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmJlZ2luXCIsIHRhc2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5tYWluTGlzdCkuYXBwZW5kKHRhc2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJwb3B1bGF0aW5nIENvbXBsZXRlZCBsaXN0Li4uXCIpXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBcHBlbmQgdG8gQ29tcGxldGVkIExpc3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0ucGluKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLmNvbXBsZXRlZExpc3QpLmZpcnN0RWxlbWVudENoaWxkLmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyZW5kXCIsIHRhc2spXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLmNvbXBsZXRlZExpc3QpLmFwcGVuZCh0YXNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgVmlldy5oaWRlQ29tcGxldGVkTGlzdCgpO1xyXG4gICAgICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTm8gQ29tcGxldGVkIExpc3QsIHBvcHVsYXRpbiBNYWluIGxpc3QuLi5cIilcclxuXHJcbiAgICAgICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRhc2sgPSByZW5kZXIoaXRlbSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnBpbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLm1haW5MaXN0KS5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmJlZ2luXCIsIHRhc2spO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMubWFpbkxpc3QpLmFwcGVuZCh0YXNrKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0U2VsZWN0b3JzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBVSVNlbGVjdG9ycztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldEVsZW1lbnRzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBVSUVsZW1lbnRzO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0UXVpY2tUYXNrSW5wdXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMucXVpY2tUYXNrSW5wdXQpLnZhbHVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYWRkVGFza1RvTWFpbkxpc3Q6IGZ1bmN0aW9uIChuZXdUYXNrRGF0YSkge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgZWxlbWVudHNcclxuICAgICAgICAgICAgY29uc3QgbmV3VGFzayA9IHJlbmRlcihuZXdUYXNrRGF0YSk7XHJcblxyXG4gICAgICAgICAgICAvLyBJbnNlcnQgbmV3IGxpc3QgY29tcG9uZW50IHRvIERPTVxyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLm1haW5MaXN0KS5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2JlZm9yZWVuZCcsIG5ld1Rhc2spO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYWRkVGFza1RvTWFpbkxpc3RQaW5uZWQ6IGZ1bmN0aW9uIChuZXdUYXNrRGF0YSkge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgZWxlbWVudHNcclxuICAgICAgICAgICAgY29uc3QgbmV3VGFzayA9IHJlbmRlcihuZXdUYXNrRGF0YSk7XHJcblxyXG4gICAgICAgICAgICAvLyBJbnNlcnQgbmV3IGxpc3QgY29tcG9uZW50IHRvIERPTVxyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLm1haW5MaXN0KS5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2FmdGVyYmVnaW4nLCBuZXdUYXNrKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsZWFyUXVpY2tBZGRUYXNrSW5wdXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5xdWlja1Rhc2tJbnB1dCkudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaGlkZUNvbXBsZXRlZExpc3Q6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5jb21wbGV0ZWRMaXN0KS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzaG93Q29tcGxldGVkTGlzdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLmNvbXBsZXRlZExpc3QpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvcGVuRm9ybVRhc2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJvcGVuIEZvcm0gVGFza1wiKTtcclxuXHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMub3ZlcmxheSkuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5hZGRGb3JtKS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xvc2VGb3JtVGFzazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkNsb3NlIEZvcm0gVGFza1wiKTtcclxuXHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMub3ZlcmxheSkuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5hZGRGb3JtKS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0Rm9ybVRhc2tUYXNrSW5wdXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFVJRWxlbWVudHMuYWRkRm9ybVRhc2tJbnB1dC52YWx1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldEZvcm1UYXNrRGF0ZUlucHV0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBmb3JtYXREYXRlID0gVUlFbGVtZW50cy5hZGRGb3JtRGF0ZUlucHV0LnZhbHVlLnJlcGxhY2VBbGwoXCItXCIsIFwiL1wiKTtcclxuXHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZGF0ZSBmb3JtYXRcIiwgZm9ybWF0RGF0ZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0RGF0ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldEZvcm1UYXNrTWVtb0lucHV0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBVSUVsZW1lbnRzLmFkZEZvcm1NZW1vSW5wdXQudmFsdWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRGb3JtVGFza1BpbkJvb2xlYW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFVJRWxlbWVudHMuYWRkRm9ybVBpbklucHV0LmNoZWNrZWQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRGb3JtVGFza0NvbG9yU2VsZWN0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBjb2xvclZhbHVlO1xyXG5cclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJjb2xvciBSZWQgaXNcIiwgVUlFbGVtZW50cy5hZGRGb3JtQ29sb3JJbnB1dFJlZC5jaGVja2VkKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJjb2xvciBZZWxsb3cgaXNcIiwgVUlFbGVtZW50cy5hZGRGb3JtQ29sb3JJbnB1dFllbGxvdy5jaGVja2VkKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJjb2xvciBCbHVlIGlzXCIsIFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXRCbHVlLmNoZWNrZWQpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImNvbG9yIEdyZWVuIGlzXCIsIFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXRHcmVlbi5jaGVja2VkKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJjb2xvciBOb25lIGlzXCIsIFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXROb25lLmNoZWNrZWQpO1xyXG5cclxuICAgICAgICAgICAgLy8gRmluZCBWYWx1ZVxyXG4gICAgICAgICAgICBpZiAoVUlFbGVtZW50cy5hZGRGb3JtQ29sb3JJbnB1dFJlZC5jaGVja2VkIHx8IFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXRZZWxsb3cuY2hlY2tlZCB8fCBVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0Qmx1ZS5jaGVja2VkIHx8IFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXRHcmVlbi5jaGVja2VkIHx8IFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXROb25lLmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0UmVkLmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiSWYgLSByZWRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yVmFsdWUgPSBVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0UmVkLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0WWVsbG93LmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiSWYgLSB5ZWxsb3dcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yVmFsdWUgPSBVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0WWVsbG93LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0Qmx1ZS5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIklmIC0geWVsbG93XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb2xvclZhbHVlID0gVUlFbGVtZW50cy5hZGRGb3JtQ29sb3JJbnB1dEJsdWUudmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXRHcmVlbi5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIklmIC0geWVsbG93XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb2xvclZhbHVlID0gVUlFbGVtZW50cy5hZGRGb3JtQ29sb3JJbnB1dEdyZWVuLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0Tm9uZS5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIklmIC0gbm9uZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3JWYWx1ZSA9IFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXROb25lLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29sb3JWYWx1ZSA9IFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXROb25lLnZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImNvbG9yXCIsIGNvbG9yVmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvbG9yVmFsdWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbGVhckZvcm1UYXNrRmllbGRzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIFVJRWxlbWVudHMuYWRkRm9ybVRhc2tJbnB1dC52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgICAgIFVJRWxlbWVudHMuYWRkRm9ybURhdGVJbnB1dC52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgICAgIFVJRWxlbWVudHMuYWRkRm9ybU1lbW9JbnB1dC52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgICAgIFVJRWxlbWVudHMuYWRkRm9ybVBpbklucHV0LmNoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgVUlFbGVtZW50cy5hZGRGb3JtQ29sb3JJbnB1dFJlZC5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXRZZWxsb3cuY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0Qmx1ZS5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXRHcmVlbi5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXROb25lLmNoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFkZEl0ZW10b0VkaXRUYXNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vIFNldCBjdXJyZW50IHRhc2sgY29tcG9uZW50J3MgdmFsdWVzIHRvIFwiRWRpdCBUYXNrXCIgbW9kdWxlXHJcbiAgICAgICAgICAgIFVJRWxlbWVudHMuZWRpdEZvcm1UYXNrSW5wdXQudmFsdWUgPSBNb2RlbC5nZXRDdXJyZW50SXRlbSgpLnRpdGxlO1xyXG4gICAgICAgICAgICBVSUVsZW1lbnRzLmVkaXRGb3JtRGF0ZUlucHV0LnZhbHVlID0gTW9kZWwuZ2V0Q3VycmVudEl0ZW0oKS5kYXRlO1xyXG4gICAgICAgICAgICBVSUVsZW1lbnRzLmVkaXRGb3JtTWVtb0lucHV0LnZhbHVlID0gTW9kZWwuZ2V0Q3VycmVudEl0ZW0oKS5tZW1vO1xyXG4gICAgICAgICAgICBVSUVsZW1lbnRzLmVkaXRGb3JtUGluSW5wdXQuY2hlY2tlZCA9IE1vZGVsLmdldEN1cnJlbnRJdGVtKCkucGluO1xyXG5cclxuICAgICAgICAgICAgLy8gU2V0IGNvbG9yIGZyb20gc2VsZWN0aW9uXHJcbiAgICAgICAgICAgIHN3aXRjaCAoTW9kZWwuZ2V0Q3VycmVudEl0ZW0oKS5jb2xvcikge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInJlZFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIFVJRWxlbWVudHMuZWRpdEZvcm1Db2xvcklucHV0UmVkLmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInllbGxvd1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIFVJRWxlbWVudHMuZWRpdEZvcm1Db2xvcklucHV0WWVsbG93LmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImJsdWVcIjpcclxuICAgICAgICAgICAgICAgICAgICBVSUVsZW1lbnRzLmVkaXRGb3JtQ29sb3JJbnB1dEJsdWUuY2hlY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiZ3JlZW5cIjpcclxuICAgICAgICAgICAgICAgICAgICBVSUVsZW1lbnRzLmVkaXRGb3JtQ29sb3JJbnB1dEdyZWVuLmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBVSUVsZW1lbnRzLmVkaXRGb3JtQ29sb3JJbnB1dE5vbmUuY2hlY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIFZpZXcub3BlbkVkaXRUYXNrKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvcGVuRWRpdFRhc2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJvcGVuIEVkaXQgVGFza1wiKTtcclxuXHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMub3ZlcmxheSkuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5lZGl0Rm9ybSkuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsb3NlRWRpdFRhc2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJDbG9zZSBFZGl0IFRhc2tcIik7XHJcblxyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLm92ZXJsYXkpLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMuZWRpdEZvcm0pLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0RWRpdFRhc2tUYXNrSW5wdXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFVJRWxlbWVudHMuZWRpdEZvcm1UYXNrSW5wdXQudmFsdWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRFZGl0VGFza0RhdGVJbnB1dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsZXQgZm9ybWF0RGF0ZSA9IFVJRWxlbWVudHMuZWRpdEZvcm1EYXRlSW5wdXQudmFsdWUucmVwbGFjZUFsbChcIi1cIiwgXCIvXCIpO1xyXG5cclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJkYXRlIGZvcm1hdCBpbiBFZGl0IFRhc2tcIiwgZm9ybWF0RGF0ZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0RGF0ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldEVkaXRUYXNrTWVtb0lucHV0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBVSUVsZW1lbnRzLmVkaXRGb3JtTWVtb0lucHV0LnZhbHVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0RWRpdFRhc2tQaW5Cb29sZWFuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBVSUVsZW1lbnRzLmVkaXRGb3JtUGluSW5wdXQuY2hlY2tlZDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldEVkaXRUYXNrQ29sb3JTZWxlY3Q6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IGNvbG9yVmFsdWU7XHJcblxyXG4gICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkNoZWNraW5nIGluIEVkaXQgVGFzay4uLlwiKVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkNoZWNraW5nIGluIEVkaXQgVGFzay4uLlwiKVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImNvbG9yIFJlZCBpc1wiLCBVSUVsZW1lbnRzLmVkaXRGb3JtQ29sb3JJbnB1dFJlZC5jaGVja2VkKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJjb2xvciBZZWxsb3cgaXNcIiwgVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXRZZWxsb3cuY2hlY2tlZCk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiY29sb3IgQmx1ZSBpc1wiLCBVSUVsZW1lbnRzLmVkaXRGb3JtQ29sb3JJbnB1dEJsdWUuY2hlY2tlZCk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiY29sb3IgR3JlZW4gaXNcIiwgVUlFbGVtZW50cy5hZGRGb3JtQ29sb3JJbnB1dEdyZWVuLmNoZWNrZWQpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImNvbG9yIE5vbmUgaXNcIiwgVUlFbGVtZW50cy5hZGRGb3JtQ29sb3JJbnB1dE5vbmUuY2hlY2tlZCk7XHJcblxyXG4gICAgICAgICAgICAvLyBGaW5kIFZhbHVlXHJcbiAgICAgICAgICAgIHN3aXRjaCAoVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXRSZWQuY2hlY2tlZCB8fCBVSUVsZW1lbnRzLmVkaXRGb3JtQ29sb3JJbnB1dFllbGxvdy5jaGVja2VkIHx8IFVJRWxlbWVudHMuZWRpdEZvcm1Db2xvcklucHV0Qmx1ZS5jaGVja2VkIHx8IFVJRWxlbWVudHMuZWRpdEZvcm1Db2xvcklucHV0R3JlZW4uY2hlY2tlZCB8fCBVSUVsZW1lbnRzLmVkaXRGb3JtQ29sb3JJbnB1dE5vbmUuY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBVSUVsZW1lbnRzLmVkaXRGb3JtQ29sb3JJbnB1dFJlZC5jaGVja2VkOlxyXG4gICAgICAgICAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJTd2l0Y2ggLSByZWRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yVmFsdWUgPSBVSUVsZW1lbnRzLmVkaXRGb3JtQ29sb3JJbnB1dFJlZC52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXRZZWxsb3cuY2hlY2tlZDpcclxuICAgICAgICAgICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU3dpdGNoIC0geWVsbG93XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb2xvclZhbHVlID0gVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXRZZWxsb3cudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFVJRWxlbWVudHMuZWRpdEZvcm1Db2xvcklucHV0Qmx1ZS5jaGVja2VkOlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yVmFsdWUgPSBVSUVsZW1lbnRzLmVkaXRGb3JtQ29sb3JJbnB1dEJsdWUudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFVJRWxlbWVudHMuZWRpdEZvcm1Db2xvcklucHV0R3JlZW4uY2hlY2tlZDpcclxuICAgICAgICAgICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU3dpdGNoIC0gZ3JlZW5cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yVmFsdWUgPSBVSUVsZW1lbnRzLmVkaXRGb3JtQ29sb3JJbnB1dEdyZWVuLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU3dpdGNoIC0gZGVmYXVsdCBub25lXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb2xvclZhbHVlID0gVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXROb25lLnZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb2xvclwiLCBjb2xvclZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb2xvclZhbHVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdXBkYXRlVGFza0Rpc3BsYXlGcm9tRWRpdFRhc2s6IGZ1bmN0aW9uICh1cGRhdGVUYXNrRGF0YSkge1xyXG4gICAgICAgICAgICAvLyBTZWFyY2ggZm9yIHRhcmdldGVkIGxpc3QgY29tcG9uZW50XHJcbiAgICAgICAgICAgIGxldCB0YXNrQ29tcG9uZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoVUlTZWxlY3RvcnMubGlzdENvbXBvbmVudCk7XHJcblxyXG4gICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkxvb3Bpbmc6XCIsIHRhc2tDb21wb25lbnRzKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFR1cm4gTm9kZSBsaXN0IGludG8gYXJyYXlcclxuICAgICAgICAgICAgdGFza0NvbXBvbmVudHMgPSBBcnJheS5mcm9tKHRhc2tDb21wb25lbnRzKTtcclxuXHJcbiAgICAgICAgICAgIHRhc2tDb21wb25lbnRzLmZvckVhY2goKHRhc2tDb21wb25lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRhc2tJZCA9IHRhc2tDb21wb25lbnQuaWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwicGFzcyBpZFwiLCB0YXNrSWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0YXNrSWQgPT0gdXBkYXRlVGFza0RhdGEuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGUgVUlcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50VGFza0NvbXBvbmVudFVJID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYCR7dGFza0lkfWApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGN1cnJlbnRUYXNrQ29tcG9uZW50VUkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidXNpbmcgZGF0YVwiLCB1cGRhdGVUYXNrRGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdEaXNwbGF5VGFza0NvbXBvbmVudCA9IHJlbmRlcih1cGRhdGVUYXNrRGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIG5ldyB0YXNrIGlzIGNvbXBsZXRlZFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh1cGRhdGVUYXNrRGF0YS5jb21wbGV0ZWQgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBjb21wbGV0ZWQgdGFzayBpcyBwaW5uZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVwZGF0ZVRhc2tEYXRhLnBpbiA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBZGQgbmV3IGFuZCB1cGRhdGUgdGFzayBjb21wb25lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMuY29tcGxldGVkTGlzdCkuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYWZ0ZXJiZWdpblwiLCBuZXdEaXNwbGF5VGFza0NvbXBvbmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIG9sZCB0YXNrIGNvbXBvbmVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFRhc2tDb21wb25lbnRVSS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFkZCBuZXcgYW5kIHVwZGF0ZSB0YXNrIGNvbXBvbmVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFRhc2tDb21wb25lbnRVSS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdEaXNwbGF5VGFza0NvbXBvbmVudCwgY3VycmVudFRhc2tDb21wb25lbnRVSSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB1bmNvbXBsZXRlZCB0YXNrIGlzIHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVwZGF0ZVRhc2tEYXRhLnBpbiA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB1bmNvbXBsZXRlZCB0YXNrIGlzIHBpbm5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5tYWluTGlzdCkuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYWZ0ZXJiZWdpblwiLCBuZXdEaXNwbGF5VGFza0NvbXBvbmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIG9sZCB0YXNrIGNvbXBvbmVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFRhc2tDb21wb25lbnRVSS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFkZCBuZXcgYW5kIHVwZGF0ZSB0YXNrIGNvbXBvbmVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFRhc2tDb21wb25lbnRVSS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdEaXNwbGF5VGFza0NvbXBvbmVudCwgY3VycmVudFRhc2tDb21wb25lbnRVSSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIFZpZXcuY2xvc2VFZGl0VGFzaygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlVGFza0Rpc3BsYXlGcm9tRWRpdFRhc2s6IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgICAgICBWaWV3LmNsb3NlRWRpdFRhc2soKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9wZW5DbGVhckxpc3RNZW51OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMub3ZlcmxheSkuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5jbGVhckxpc3RNZW51KS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xvc2VDbGVhckxpc3RNZW51OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMub3ZlcmxheSkuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5jbGVhckxpc3RNZW51KS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xlYXJMaXN0czogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsZXQgbWFpbkxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLm1haW5MaXN0KTtcclxuICAgICAgICAgICAgY29uc3QgY29tcGxldGVkTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMuY29tcGxldGVkTGlzdCk7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAobWFpbkxpc3QuZmlyc3RDaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgbWFpbkxpc3QucmVtb3ZlQ2hpbGQobWFpbkxpc3QuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChjb21wbGV0ZWRMaXN0LmZpcnN0Q2hpbGQpIHtcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlZExpc3QucmVtb3ZlQ2hpbGQoY29tcGxldGVkTGlzdC5maXJzdENoaWxkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTtcclxuXHJcblxyXG4vLyA9PT09PT09PT09XHJcbi8vIENvbnRyb2xsZXJcclxuLy8gPT09PT09PT09PVxyXG4vLyAtIG1haW4gY29udHJvbGxlclxyXG4vLyAtIFdoZXJlIGV2ZXJ5dGhpbmcgd2lsbCBtZWV0XHJcbi8vIC0gaW5pdGlhbCBldmVudCBsaXN0ZW5lcnNcclxuLy8gLSBpbml0IGZ1bmN0aW9uXHJcbmNvbnN0IENvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKE1vZGVsLCBWaWV3LCBTdG9yYWdlKSB7XHJcbiAgICAvLyBMb2FkIEV2ZW50IExpc3RlbmVyc1xyXG4gICAgY29uc3QgbG9hZEV2ZW50TGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIEdldCBVSSBzZWxlY3RvcnNcclxuICAgICAgICBjb25zdCBVSVNlbGVjdG9ycyA9IFZpZXcuZ2V0U2VsZWN0b3JzKCk7XHJcbiAgICAgICAgY29uc3QgVUlFbGVtZW50cyA9IFZpZXcuZ2V0RWxlbWVudHMoKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIFF1aWNrIFwiQWRkIFRhc2tcIiBldmVudCAtIFN1Ym1pdCBpbnB1dFxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMucXVpY2tUYXNrQnRuKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcXVpY2tBZGRUYXNrU3VibWl0KTtcclxuXHJcbiAgICAgICAgLy8gQWRkIFwiRm9ybSBUYXNrXCIgZXZlbnQgLSBPcGVuIFwiRm9ybSBUYXNrXCIgbW9kdWxlXHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5hZGRGb3JtT3BlbmJ0bikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIFZpZXcub3BlbkZvcm1UYXNrKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIFwiRm9ybSBUYXNrXCIgQ2FuY2VsIGJ1dHRvbiBldmVudCAtIENsb3NlIFwiRm9ybSBUYXNrXCIgbW9kdWxlXHJcbiAgICAgICAgVUlFbGVtZW50cy5hZGRGb3JtQ2FuY2VsQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBWaWV3LmNsb3NlRm9ybVRhc2spO1xyXG5cclxuICAgICAgICAvLyBBZGQgXCJGb3JtIFRhc2tcIiBldmVudCAtIFN1Ym1pdCBpbnB1dHNcclxuICAgICAgICBVSUVsZW1lbnRzLmFkZEZvcm1TdWJtaXRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZvcm1UYXNrU3VibWl0KTtcclxuXHJcbiAgICAgICAgLy8gQWRkIHRhc2sgY29tcG9uZW50IGVsbGlwc2lzIC0gT3BlbiBcIkVkaXQgVGFza1wiIG1vZHVsZVxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMud2hvbGVMaXN0cykuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsaWNrZWRFZGl0VGFzayk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBcIkVkaXQgVGFza1wiIFVwZGF0ZSBidXR0b24gZXZlbnQgLSBTdWJtaXQgaW5wdXRzXHJcbiAgICAgICAgVUlFbGVtZW50cy5lZGl0Rm9ybVVwZGF0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZWRpdFRhc2tTdWJtaXQpO1xyXG5cclxuICAgICAgICAvLyBBZGQgXCJFZGl0IFRhc2tcIiBDYW5jZWwgYnV0dG9uIGV2ZW50IC0gQ2xvc2UgXCJFZGl0IFRhc2tcIiBtb2R1bGVcclxuICAgICAgICBVSUVsZW1lbnRzLmVkaXRGb3JtQ2FuY2VsQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBWaWV3LmNsb3NlRWRpdFRhc2spO1xyXG5cclxuICAgICAgICAvLyBBZGQgXCJFZGl0IFRhc2tcIiBEZWxldGUgYnV0dG9uIGV2ZW50IC0gRGVsZXRlIHRhc2sgY29tcG9uZW50XHJcbiAgICAgICAgVUlFbGVtZW50cy5lZGl0Rm9ybURlbGV0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZWRpdFRhc2tEZWxldGVTdWJtaXQpO1xyXG5cclxuICAgICAgICAvLyBBZGQgY2hlY2tib3ggZXZlbnQgLSBVcGRhdGUgZGF0YSB3aGVuIGNoZWNrZWQgb3IgdW5jaGVja2VkXHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy53aG9sZUxpc3RzKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2hlY2tlZFRhc2tBbmRVcGF0ZURhdGEpO1xyXG5cclxuICAgICAgICAvLyBBZGQgXCJDbGVhciBMaXN0XCIgZXZlbnQgLSBPcGVuIFwiQ2xlYXIgTGlzdFwiIE1lbnVcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLm9wZW5DbGVhckxpc3RNZW51QnRuKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgVmlldy5vcGVuQ2xlYXJMaXN0TWVudSk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBcIkNsZWFyIExpc3RcIiBldmVudCAtIENsb3NlIFwiQ2xlYXIgTGlzdFwiIE1lbnVcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLmRlbGV0ZUNhbmNlbEJ0bikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIFZpZXcuY2xvc2VDbGVhckxpc3RNZW51KTtcclxuXHJcbiAgICAgICAgLy8gQWRkIFwiQ2xlYXIgTGlzdFwiIGV2ZW50IC0gQ2xlYXIgTWFpbiBhbmQgQ29tcGxldGVkIExpc3RcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLmRlbGV0ZUNvbmZpcm1CdG4pLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGVhckxpc3RzKTtcclxuXHJcblxyXG4gICAgICAgIC8vID8gRmVhdHVyZSAtIHllcywgbm8sIHllcywgbm8/XHJcbiAgICAgICAgLy8gRGlzYWJsZSBzdWJtaXQgb24gXCJFbnRlclwiIGtleSBmb3IgXCJGb3JtIFRhc2tcIiBhbmQgXCJFZGl0IFRhc2tcIiBJbnB1dHNcclxuICAgICAgICAvLyBPdGhlcndpc2UsIGNhdGFzdHJvcGhlIG1heSBmb2xsb3dcclxuICAgICAgICAvLyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIC8vICAgICBpZiAoZS5rZXlDb2RlID09PSAxMyB8fCBlLndoaWNoID09PSAxMykge1xyXG4gICAgICAgIC8vICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAvLyAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vIH0pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgLy8gQWRkIFF1aWNrIFwiQWRkIFRhc2tcIiBzdWJtaXRcclxuICAgIGNvbnN0IHF1aWNrQWRkVGFza1N1Ym1pdCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlF1aWNrIEFkZCBUYXNrXCIpXHJcblxyXG4gICAgICAgIC8vIEdldCBpbnB1dCB2YWx1ZVxyXG4gICAgICAgIGNvbnN0IGlucHV0ID0gVmlldy5nZXRRdWlja1Rhc2tJbnB1dCgpO1xyXG5cclxuICAgICAgICAvLyBWYWxpZGF0ZVxyXG4gICAgICAgIC8vID8gU3VnZ2VzdGlvbnM6IFVzZSBSZWdFeHBcclxuICAgICAgICBpZiAoaW5wdXQgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJRdWljayBBZGQgVGFzazogVmFsaWRhdGluZ1wiKVxyXG5cclxuICAgICAgICAgICAgLy8gQWRkIGlucHV0IHZhbHVlIHRvIERhdGEsIGFuZFxyXG4gICAgICAgICAgICAvLyBHZXQgZGVmYXVsdCBkYXRhIHNldHVwIGZvciBVSVxyXG4gICAgICAgICAgICBjb25zdCBuZXdUYXNrRGF0YSA9IE1vZGVsLmFkZFF1aWNrVGFzayhpbnB1dCk7XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgbmV3IHRhc2sgdG8gVUkgbGlzdFxyXG4gICAgICAgICAgICBWaWV3LmFkZFRhc2tUb01haW5MaXN0KG5ld1Rhc2tEYXRhKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCB0byBMU1xyXG4gICAgICAgICAgICBTdG9yYWdlLmFkZEl0ZW0obmV3VGFza0RhdGEpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2xlYXIgaW5wdXQgZmllbGRcclxuICAgICAgICAgICAgVmlldy5jbGVhclF1aWNrQWRkVGFza0lucHV0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGlucHV0KTtcclxuXHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBBZGQgXCJGb3JtIFRhc2tcIiBTdWJtaXRcclxuICAgIGNvbnN0IGZvcm1UYXNrU3VibWl0ID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRm9ybSBUYXNrIC0gQWRkIEN1c3RvbWlzZWQgVGFza1wiKTtcclxuXHJcbiAgICAgICAgLy8gR2V0IFZhbHVlc1xyXG4gICAgICAgIGNvbnN0IHRhc2tJbnB1dCA9IFZpZXcuZ2V0Rm9ybVRhc2tUYXNrSW5wdXQoKTtcclxuICAgICAgICBjb25zdCBkYXRlSW5wdXQgPSBWaWV3LmdldEZvcm1UYXNrRGF0ZUlucHV0KCk7XHJcbiAgICAgICAgY29uc3QgbWVtb0lucHV0ID0gVmlldy5nZXRGb3JtVGFza01lbW9JbnB1dCgpO1xyXG4gICAgICAgIGNvbnN0IHBpbkJvb2xlYW4gPSBWaWV3LmdldEZvcm1UYXNrUGluQm9vbGVhbigpO1xyXG4gICAgICAgIGNvbnN0IGNvbG9yU2VsZWN0ID0gVmlldy5nZXRGb3JtVGFza0NvbG9yU2VsZWN0KCk7XHJcblxyXG5cclxuICAgICAgICAvLyBWYWxpZGF0ZVxyXG4gICAgICAgIC8vID8gU3VnZ2VzdGlvbnM6IFVzZSBSZWdFeHBcclxuICAgICAgICBpZiAodGFza0lucHV0ICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRm9ybSBUYXNrOiBWYWxpZGF0aW5nXCIpXHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgaW5wdXQgdmFsdWUgdG8gRGF0YSwgYW5kXHJcbiAgICAgICAgICAgIC8vIEdldCBkZWZhdWx0IGRhdGEgc2V0dXAgZm9yIFVJXHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1Rhc2tEYXRhID0gTW9kZWwuYWRkRm9ybVRhc2sodGFza0lucHV0LCBkYXRlSW5wdXQsIG1lbW9JbnB1dCwgcGluQm9vbGVhbiwgY29sb3JTZWxlY3QpO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIG5ldyB0YXNrIHRvIFVJIGxpc3RcclxuICAgICAgICAgICAgLy8gSWYgcGluQm9vbGVhbiBpcyB0cnVlLCBQaW4gdG8gdGhlIFRvcFxyXG4gICAgICAgICAgICBpZiAocGluQm9vbGVhbikge1xyXG4gICAgICAgICAgICAgICAgVmlldy5hZGRUYXNrVG9NYWluTGlzdFBpbm5lZChuZXdUYXNrRGF0YSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBWaWV3LmFkZFRhc2tUb01haW5MaXN0KG5ld1Rhc2tEYXRhKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQWRkIHRvIExTXHJcbiAgICAgICAgICAgIFN0b3JhZ2UuYWRkSXRlbShuZXdUYXNrRGF0YSk7XHJcblxyXG4gICAgICAgICAgICAvLyBDbGVhciBhbGwgXCJGb3JtIFRhc2tcIiBmaWVsZHNcclxuICAgICAgICAgICAgVmlldy5jbGVhckZvcm1UYXNrRmllbGRzKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBDbG9zZSBcIkZvcm0gVGFza1wiIG1vZHVsZVxyXG4gICAgICAgICAgICBWaWV3LmNsb3NlRm9ybVRhc2soKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gT3BlbiBhbmQgc2V0IFwiRWRpdCBUYXNrXCIgbW9kdWxlXHJcbiAgICBjb25zdCBjbGlja2VkRWRpdFRhc2sgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIC8vIHVzZSBldmVudCBkZWxlZ2F0aW9uIHZpYSBgZS50YXJnZXRgIHRvIGZpbmQgZWxlbWVudFxyXG4gICAgICAgIGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJlbGxpcHNlc19fd3JhcHBlclwiKSkge1xyXG4gICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVkaXQgQ2xpY2tlZCFcIik7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgdGFzayBjb21wb25lbnQgaWRcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudFRhc2tJZCA9IGUudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5pZDtcclxuXHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiY3VycmVudCB0YXNrIElEXCIsIGN1cnJlbnRUYXNrSWQpO1xyXG5cclxuICAgICAgICAgICAgLy8gR2V0IHRhc2sgY29tcG9uZW50IGlkIGZyb20gRGF0YVxyXG4gICAgICAgICAgICBjb25zdCBUYXNrdG9FZGl0RGF0YSA9IE1vZGVsLmdldFRhc2tCeUlkKGN1cnJlbnRUYXNrSWQpO1xyXG5cclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coVGFza3RvRWRpdERhdGEpO1xyXG5cclxuICAgICAgICAgICAgLy8gU2V0IHRhc2sgY29tcG9uZW50IGFzIFwiY3VycmVudEl0ZW1cIiBpLmUuIG1ha2VzIGxvY2F0aW5nIGl0IGVhc2llciBhbmQgZXRjLlxyXG4gICAgICAgICAgICAvLyAuLi4gYW5kIGVkaXRpbmcgcHVycG9zZVxyXG4gICAgICAgICAgICBNb2RlbC5zZXRDdXJyZW50VGFzayhUYXNrdG9FZGl0RGF0YSk7XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgY3VycmVudCB0YXNrIGNvbXBvbmVudCBkYXRhIHRvIFwiRWRpdCBUYXNrXCIgRm9ybSB0byBkaXNwbGF5XHJcbiAgICAgICAgICAgIFZpZXcuYWRkSXRlbXRvRWRpdFRhc2soKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIFVwZGF0ZSBcIkVkaXQgVGFza1wiIFN1Ym1pdFxyXG4gICAgY29uc3QgZWRpdFRhc2tTdWJtaXQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlVwZGF0aW5nIVwiKTtcclxuXHJcbiAgICAgICAgLy8gR2V0IEVkaXQgVGFzayBJbnB1dHMgYW5kIFZhbHVlc1xyXG4gICAgICAgIGNvbnN0IHRhc2tJbnB1dCA9IFZpZXcuZ2V0RWRpdFRhc2tUYXNrSW5wdXQoKTtcclxuICAgICAgICBjb25zdCBkYXRlSW5wdXQgPSBWaWV3LmdldEVkaXRUYXNrRGF0ZUlucHV0KCk7XHJcbiAgICAgICAgY29uc3QgbWVtb0lucHV0ID0gVmlldy5nZXRFZGl0VGFza01lbW9JbnB1dCgpO1xyXG4gICAgICAgIGNvbnN0IHBpbkJvb2xlYW4gPSBWaWV3LmdldEVkaXRUYXNrUGluQm9vbGVhbigpO1xyXG4gICAgICAgIGNvbnN0IGNvbG9yU2VsZWN0ID0gVmlldy5nZXRFZGl0VGFza0NvbG9yU2VsZWN0KCk7XHJcblxyXG4gICAgICAgIC8vIFVwZGF0ZSBjb21wb25lbnQgdGFzayBpbiBkYXRhXHJcbiAgICAgICAgY29uc3QgdXBkYXRlVGFza0RhdGEgPSBNb2RlbC51cGRhdGVEYXRhRnJvbUVkaXRUYXNrKHRhc2tJbnB1dCwgZGF0ZUlucHV0LCBtZW1vSW5wdXQsIHBpbkJvb2xlYW4sIGNvbG9yU2VsZWN0KTtcclxuXHJcbiAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIm5ldyBVcGRhdGUgZGF0YSBhcHBsaWVkIHRvIGRhdGFiYXNlXCIsIHVwZGF0ZVRhc2tEYXRhKVxyXG5cclxuICAgICAgICAvLyBVcGRhdGUgaXRlbSBMU1xyXG4gICAgICAgIFN0b3JhZ2UudXBkYXRlSXRlbSh1cGRhdGVUYXNrRGF0YSk7XHJcblxyXG4gICAgICAgIC8vIFVwZGF0ZSBVSVxyXG4gICAgICAgIFZpZXcudXBkYXRlVGFza0Rpc3BsYXlGcm9tRWRpdFRhc2sodXBkYXRlVGFza0RhdGEpO1xyXG5cclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIERlbGV0ZSBidXR0b24gb2YgXCJFZGl0IFRhc2tcIiBtb2R1bGVcclxuICAgIGNvbnN0IGVkaXRUYXNrRGVsZXRlU3VibWl0ID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAvLyBHZXQgY3VycmVudCB0YXNrIGNvbXBvbmVudFxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRUYXNrID0gTW9kZWwuZ2V0Q3VycmVudEl0ZW0oKTtcclxuXHJcbiAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkF0dGVtcHRpbmcgdG8gZGVsZXRlXCIsIGN1cnJlbnRUYXNrKTtcclxuXHJcbiAgICAgICAgLy8gRGVsZXRlIGZyb20gZGF0YSBzdHJ1Y3R1cmVcclxuICAgICAgICBNb2RlbC5kZWxldGVJdGVtKGN1cnJlbnRUYXNrLmlkKTtcclxuXHJcbiAgICAgICAgLy8gRGVsZXRlIGl0ZW0gTFNcclxuICAgICAgICBTdG9yYWdlLmRlbGV0ZUl0ZW0oY3VycmVudFRhc2suaWQpO1xyXG5cclxuICAgICAgICAvLyBEZWxldGUgZnJvbSBVSVxyXG4gICAgICAgIFZpZXcuZGVsZXRlVGFza0Rpc3BsYXlGcm9tRWRpdFRhc2soY3VycmVudFRhc2suaWQpO1xyXG5cclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSWYgYSB0YXNrIGlzIFVOQ0hFQ0ssIHVwZGF0ZSBkYXRhIGFuZCBVSVxyXG4gICAgY29uc3QgY2hlY2tlZFRhc2tBbmRVcGF0ZURhdGEgPSBmdW5jdGlvbiAoZSkge1xyXG5cclxuICAgICAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiY2hlY2tcIikpIHtcclxuICAgICAgICAgICAgbGV0IGNvbXBsZXRlZFN0YXR1cyA9IGUudGFyZ2V0LmNoZWNrZWQ7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvbXBsZXRlZFN0YXR1cyk7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgdGFzayBjb21wb25lbnQgaWRcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudFRhc2tJZCA9IGUudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLmlkO1xyXG5cclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJjdXJyZW50IHRhc2sgSURcIiwgY3VycmVudFRhc2tJZCk7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgdGFzayBjb21wb25lbnQgaWQgZnJvbSBEYXRhXHJcbiAgICAgICAgICAgIGNvbnN0IFRhc2t0b0VkaXREYXRhID0gTW9kZWwuZ2V0VGFza0J5SWQoY3VycmVudFRhc2tJZCk7XHJcblxyXG4gICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhUYXNrdG9FZGl0RGF0YSk7XHJcblxyXG4gICAgICAgICAgICBNb2RlbC5zZXRDdXJyZW50VGFzayhUYXNrdG9FZGl0RGF0YSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB1cGRhdGVUYXNrRGF0YSA9IE1vZGVsLnVwZGF0ZUN1cnJlbnRUYXNrQ2hlY2tlZERhdGEoY29tcGxldGVkU3RhdHVzKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFVwZGF0ZSBpdGVtIExTXHJcbiAgICAgICAgICAgIFN0b3JhZ2UudXBkYXRlSXRlbSh1cGRhdGVUYXNrRGF0YSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29tcGxldGVkU3RhdHVzID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidGFzayBkYXRhIGNoYW5nZSB0byBDT01QTEVURS4uLlwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBEbyBOT1QgdXBkYXRlIFVJXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInRhc2sgZGF0YSBjaGFuZ2UgdG8gVU5DT01QTEVURS4uLlwiKTtcclxuICAgICAgICAgICAgICAgIC8vIEZldGNoIGl0ZW1zIGZyb20gZGF0YSBzdHJ1Y3R1cmVcclxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gTW9kZWwuZ2V0SXRlbXMoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGVyZSBpcyBhbnkgXCJjb21wbGV0ZWRcIiB0YXNrIGVxdWFsICd0cnVlJ1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbXBsZXRlZFN0YXR1cyA9IGZpbmRDb21wbGV0ZWRTdGF0dXMoaXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENsZWFyIFVJXHJcbiAgICAgICAgICAgICAgICBWaWV3LmNsZWFyTGlzdHMoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBSZXBvcHVsYXRlIFVJIHdpdGggdXBkYXRlIGRhdGFcclxuICAgICAgICAgICAgICAgIFZpZXcucG9wdWxhdGVMaXN0KGl0ZW1zLCBjb21wbGV0ZWRTdGF0dXMpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2xlYXIgTGlzdHMgRGF0YSBhbmQgVUlcclxuICAgIGNvbnN0IGNsZWFyTGlzdHMgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8vIENsZWFyIExTXHJcbiAgICAgICAgU3RvcmFnZS5jbGVhckl0ZW1zKCk7XHJcblxyXG4gICAgICAgIC8vIENsZWFyIExpc3RzIFVJXHJcbiAgICAgICAgVmlldy5jbGVhckxpc3RzKCk7XHJcbiAgICAgICAgVmlldy5jbG9zZUNsZWFyTGlzdE1lbnUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBGaW5kIGlmIGFueSB0YXNrIGNvbXBvbmVudCBkYXRhIChpdGVtKSBpcyBDb21wbGV0ZWRcclxuICAgIGNvbnN0IGZpbmRDb21wbGV0ZWRTdGF0dXMgPSBmdW5jdGlvbiAoaXRlbXMpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMpIHtcclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJUaGUgY3VycmVudCBwcm9wZXJ0eSBzdGF0dXMgaXNcIiwgaXRlbVtcImNvbXBsZXRlZFwiXSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaXRlbVtcImNvbXBsZXRlZFwiXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFB1YmxpYyBNZXRob2RzXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJJbml0aWFsaXNpbmcgQXBwLi4uXCIpXHJcblxyXG4gICAgICAgICAgICAvLyBGZXRjaCBpdGVtcyBmcm9tIGRhdGEgc3RydWN0dXJlXHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gTW9kZWwuZ2V0SXRlbXMoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZXJlIGlzIGFueSBcImNvbXBsZXRlZFwiIHRhc2sgZXF1YWwgJ3RydWUnXHJcbiAgICAgICAgICAgIGxldCBjb21wbGV0ZWRTdGF0dXMgPSBmaW5kQ29tcGxldGVkU3RhdHVzKGl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFBvcHVsYXRlIExpc3RcclxuICAgICAgICAgICAgVmlldy5wb3B1bGF0ZUxpc3QoaXRlbXMsIGNvbXBsZXRlZFN0YXR1cyk7XHJcblxyXG4gICAgICAgICAgICAvLyBMb2FkIGV2ZW50IGxpc3RlbmVyc1xyXG4gICAgICAgICAgICBsb2FkRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKE1vZGVsLCBWaWV3LCBTdG9yYWdlKTtcclxuXHJcbi8vIEluaXRpYWxpc2UgQXBwXHJcbkNvbnRyb2xsZXIuaW5pdCgpO1xyXG4iXX0=
