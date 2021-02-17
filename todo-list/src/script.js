"use strict";

const mainElement = document.querySelector("main");
const formTaskBtn = document.querySelector(".form-task__btn");
const h1Title = document.querySelector(".title"); // Re-Position h1 .title

const mq = window.matchMedia("(min-width: 600px)"); // ! Further testing on mobile device needed
// ? Not sure if-statement or mq is necessary

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

// Other Modules
// const uuid = uuidv4;
// const getUniqueId = uuidv4;
// todo
// Implemet the "Task Form" MVC
// FInd out why you cannot mark 'checked' on the checkbox
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


const Storage = function () {
  // Public methods
  return {
    addItem: function (newTaskData) {
      // ! Log
      console.log("persisting to LS...");
      let items; // Check if there is any data in LS

      if (localStorage.getItem("tasks") === null) {
        items = []; // Push new item

        items.push(newTaskData); // ! Log

        console.log("Creating new Storage 'tasks'"); // Set LS

        localStorage.setItem("tasks", JSON.stringify(items));
      } else {
        // Get data if available
        items = JSON.parse(localStorage.getItem("tasks")); // ! Log

        console.log("Getting available Storage: ", items); // Push new item

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
}(); // ========================
// Item Controller || Model
// ========================
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
  }; // Data Structure / State


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
      console.log(quickTaskInput); // Create new task

      const newTaskData = new ModelConstructor(undefined, quickTaskInput); // ! Log

      console.log(newTaskData); // Add to items Array

      data.items.push(newTaskData);
      return newTaskData;
    },
    addFormTask: function (taskInput, dateInput, memoInput, pinBoolean, colorSelect) {
      // ! Log
      console.log(taskInput, dateInput, memoInput, pinBoolean, colorSelect); // Create new task

      const newTaskData = new ModelConstructor(undefined, taskInput, dateInput, memoInput, pinBoolean, colorSelect); // ! Log

      console.log(newTaskData); // Add to items Array

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

      console.log("Fetching targeted item is", targetTaskData);
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
          // Set mark completed "true"
          item.completed = completedStatus; // ! Log

          console.log("Current task complete is", item.completed);
          targetTaskData = item;
        }
      });
      return targetTaskData;
    },
    deleteItem: function (id) {
      // ! Log
      console.log("Deleting data..."); // Get an array of ids

      const ids = data.items.map(function (item) {
        return item.id;
      }); // Get index of target task component id

      const index = ids.indexOf(id); // Remove item

      data.items.splice(index, 1);
    }
  };
}(); // =====================
// UI Controller || View
// =====================
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

    console.log(listComponent.id); // List Component - First Block

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

    console.log("CheckboxIcon", checkboxIcon.checked); // Checkbox - Label

    const checkboxLabel = document.createElement("span");
    checkboxLabel.classList.add("text-label"); // Checkbox - Label - Create TextNode

    const checkboxLabelText = document.createTextNode(taskData["title"]);
    checkboxLabel.append(checkboxLabelText); // ! Log

    console.log("rendering label:", checkboxLabel);
    console.log("rendering label text:", checkboxLabelText);
    console.log("rendering label text data:", taskData["title"]);
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
      memoSpan.append(memoText); // listComponentSecondBlock.classList.remove("hidden");
    } else {
      listComponentSecondBlock.classList.add("hidden");
    }

    listComponentSecondBlock.appendChild(memoSpan); // Putting it all together...

    listComponentFirstBlock.append(pinComponent, checkboxComponent, dueDateComponent, ellipsisComponent, stickyColorComponent);
    listComponent.appendChild(listComponentFirstBlock);
    listComponent.appendChild(listComponentSecondBlock); // ! Log

    console.log(listComponent);
    return listComponent;
  }; // Public Methods


  return {
    populateList: function (items, completedStatus) {
      // !! Testing Required
      // ! Log
      console.log("The Completed Status is", completedStatus); // If there is completed status, populate for both Main List and Completed List

      if (completedStatus) {
        // Show completed list
        View.showCompletedList();
        items.forEach(function (item) {
          let task = render(item); // ! Log

          console.log("populating:", task); // Filter Main List and Completed List

          if (item.completed === false) {
            // ! Log
            console.log("populatin Main list..."); // Append to Main List
            // ? Use "append" or "appendChild"
            // document.querySelector(UISelectors.mainList).appendChild()

            if (item.pin) {
              document.querySelector(UISelectors.mainList).insertAdjacentElement("afterbegin", task);
            } else {
              document.querySelector(UISelectors.mainList).append(task);
            }
          } else {
            // ! Log
            console.log("populating Completed list..."); // Append to Completed List

            if (item.pin) {
              document.querySelector(UISelectors.completedList).firstElementChild.insertAdjacentElement("afterend", task);
            } else {
              document.querySelector(UISelectors.completedList).append(task);
            }
          }
        });
      } else {
        View.hideCompletedList(); // ! Log

        console.log("No Completed List, populatin Main list..."); // Append to Main List
        // ? Use "append" or "appendChild"
        // document.querySelector(UISelectors.mainList).appendChild()

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
      // mainList.appendChild(listComponent);

      document.querySelector(UISelectors.mainList).insertAdjacentElement('beforeend', newTask);
    },
    addTaskToMainListPinned: function (newTaskData) {
      // Create elements
      const newTask = render(newTaskData); // Insert new list component to DOM
      // mainList.appendChild(listComponent);

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
      console.log("open Form Task");
      document.querySelector(UISelectors.overlay).classList.remove("hidden");
      document.querySelector(UISelectors.addForm).classList.remove("hidden");
    },
    closeFormTask: function () {
      // ! Log
      console.log("Close Form Task");
      document.querySelector(UISelectors.overlay).classList.add("hidden");
      document.querySelector(UISelectors.addForm).classList.add("hidden"); // ? Clear / reset input fields
    },
    getFormTaskTaskInput: function () {
      return UIElements.addFormTaskInput.value;
    },
    getFormTaskDateInput: function () {
      let formatDate = UIElements.addFormDateInput.value.replaceAll("-", "/"); // ! Log

      console.log("date format", formatDate);
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

      console.log("color Red is", UIElements.addFormColorInputRed.checked);
      console.log("color Yellow is", UIElements.addFormColorInputYellow.checked);
      console.log("color Blue is", UIElements.addFormColorInputBlue.checked);
      console.log("color Green is", UIElements.addFormColorInputGreen.checked);
      console.log("color None is", UIElements.addFormColorInputNone.checked); // Find Value

      if (UIElements.addFormColorInputRed.checked || UIElements.addFormColorInputYellow.checked || UIElements.addFormColorInputBlue.checked || UIElements.addFormColorInputGreen.checked || UIElements.addFormColorInputNone.checked) {
        if (UIElements.addFormColorInputRed.checked) {
          // ! Log
          console.log("If - red");
          colorValue = UIElements.addFormColorInputRed.value;
        }

        if (UIElements.addFormColorInputYellow.checked) {
          // ! Log
          console.log("If - yellow");
          colorValue = UIElements.addFormColorInputYellow.value;
        }

        if (UIElements.addFormColorInputBlue.checked) {
          // ! Log
          console.log("If - yellow");
          colorValue = UIElements.addFormColorInputBlue.value;
        }

        if (UIElements.addFormColorInputGreen.checked) {
          // ! Log
          console.log("If - yellow");
          colorValue = UIElements.addFormColorInputGreen.value;
        }

        if (UIElements.addFormColorInputNone.checked) {
          // ! Log
          console.log("If - none");
          colorValue = UIElements.addFormColorInputNone.value;
        }
      } else {
        colorValue = UIElements.addFormColorInputNone.value;
      } // ! Log


      console.log("color", colorValue);
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
      console.log("open Edit Task");
      document.querySelector(UISelectors.overlay).classList.remove("hidden");
      document.querySelector(UISelectors.editForm).classList.remove("hidden");
    },
    closeEditTask: function () {
      // ! Log
      console.log("Close Edit Task");
      document.querySelector(UISelectors.overlay).classList.add("hidden");
      document.querySelector(UISelectors.editForm).classList.add("hidden");
    },
    getEditTaskTaskInput: function () {
      return UIElements.editFormTaskInput.value;
    },
    getEditTaskDateInput: function () {
      let formatDate = UIElements.editFormDateInput.value.replaceAll("-", "/"); // ! Log

      console.log("date format in Edit Task", formatDate);
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

      console.log("Checking in Edit Task...");
      console.log("Checking in Edit Task...");
      console.log("color Red is", UIElements.editFormColorInputRed.checked);
      console.log("color Yellow is", UIElements.editFormColorInputYellow.checked);
      console.log("color Blue is", UIElements.editFormColorInputBlue.checked);
      console.log("color Green is", UIElements.addFormColorInputGreen.checked);
      console.log("color None is", UIElements.addFormColorInputNone.checked); // Find Value

      switch (UIElements.editFormColorInputRed.checked || UIElements.editFormColorInputYellow.checked || UIElements.editFormColorInputBlue.checked || UIElements.editFormColorInputGreen.checked || UIElements.editFormColorInputNone.checked) {
        case UIElements.editFormColorInputRed.checked:
          // ! Log
          console.log("Switch - red");
          colorValue = UIElements.editFormColorInputRed.value;
          break;

        case UIElements.editFormColorInputYellow.checked:
          // ! Log
          console.log("Switch - yellow");
          colorValue = UIElements.editFormColorInputYellow.value;
          break;

        case UIElements.editFormColorInputBlue.checked:
          colorValue = UIElements.editFormColorInputBlue.value;
          break;

        case UIElements.editFormColorInputGreen.checked:
          // ! Log
          console.log("Switch - green");
          colorValue = UIElements.editFormColorInputGreen.value;
          break;

        default:
          // ! Log
          console.log("Switch - default none");
          colorValue = UIElements.editFormColorInputNone.value;
      } // ! Log


      console.log("color", colorValue);
      return colorValue;
    },
    updateTaskDisplayFromEditTask: function (updateTaskData) {
      // Search for targeted list component
      let taskComponents = document.querySelectorAll(UISelectors.listComponent); // ! Log

      console.log("Looping:", taskComponents); // Turn Node list into array

      taskComponents = Array.from(taskComponents);
      taskComponents.forEach(taskComponent => {
        // const taskId = taskComponent.getAttribute('id');
        const taskId = taskComponent.id; // ! Log

        console.log("pass id", taskId);

        if (taskId == updateTaskData.id) {
          // Update UI
          const currentTaskComponentUI = document.getElementById("".concat(taskId)); // ! Log

          console.log(currentTaskComponentUI); // ! Log

          console.log("using data", updateTaskData);
          let newDisplayTaskComponent = render(updateTaskData); // !! Testing needed for Completed Tasks >>
          // Check if new task is completed

          if (updateTaskData.completed == true) {
            // Check if completed task is pinned
            if (updateTaskData.pin == true) {
              // Add new and update task component
              document.querySelector(UISelectors.completedList).insertAdjacentElement("afterbegin", newDisplayTaskComponent); // Remove old task component

              currentTaskComponentUI.remove();
            } else {
              // Add new and update task component
              // currentTaskComponentUI.insertAdjacentElement("afterend",newDisplayTaskComponent);
              currentTaskComponentUI.parentNode.replaceChild(newDisplayTaskComponent, currentTaskComponentUI); // !! <<
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
      // document.querySelector(`[id="${id}"]`).remove();
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
}(); // ============================
// App Controller || Controller
// ============================
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

    document.querySelector(UISelectors.deleteConfirmBtn).addEventListener("click", clearLists); // Disable submit on "Enter" key for "Form Task" and "Edit Task" Inputs
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
    console.log("Quick Add Task"); // Get input value

    const input = View.getQuickTaskInput(); // Validate
    // ? Suggestions: Use RegExp

    if (input !== "") {
      // ! Log
      console.log("Quick Add Task: Validating"); // Add input value to Data, and
      // Get default data setup for UI

      const newTaskData = Model.addQuickTask(input); // Add new task to UI list

      View.addTaskToMainList(newTaskData); // Add to LS

      Storage.addItem(newTaskData); // Clear input field

      View.clearQuickAddTaskInput();
    } // ! Log


    console.log(input);
    e.preventDefault();
  }; // Add "Form Task" Submit


  const formTaskSubmit = function (e) {
    // ! Log
    console.log("Form Task - Add Customised Task"); // Get Values

    const taskInput = View.getFormTaskTaskInput();
    const dateInput = View.getFormTaskDateInput();
    const memoInput = View.getFormTaskMemoInput();
    const pinBoolean = View.getFormTaskPinBoolean();
    const colorSelect = View.getFormTaskColorSelect(); // Validate
    // ? Suggestions: Use RegExp

    if (taskInput !== "") {
      // ! Log
      console.log("Form Task: Validating"); // Add input value to Data, and
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
    // use event delegation via e.target to find element
    // traverse the DOM to find id
    // get current task data to edit via Model.getItemById
    // - It should be an object
    // Set current item via Model.setCurrentItem
    // - set data 'currentItem' as above line
    // Ad item to form via View.addItemToForm()
    // - grab values
    //     - grab 'currentItem' and set it in View
    //     - Create Model.getCurrentItem function
    if (e.target.classList.contains("ellipses__wrapper")) {
      // ! Log
      console.log("Edit Clicked!"); // Get task component id

      const currentTaskId = e.target.parentNode.parentNode.id; // ! Log

      console.log("current task ID", currentTaskId); // Get task component id from Data

      const TasktoEditData = Model.getTaskById(currentTaskId); // ! Log

      console.log(TasktoEditData); // Set task component as "currentItem" i.e. makes locating it easier and etc.
      // ... and editing purpose

      Model.setCurrentTask(TasktoEditData); // Add current task component data to "Edit Task" Form to display

      View.addItemtoEditTask();
    }
  }; // todo
  // Update "Edit Task" Submit


  const editTaskSubmit = function (e) {
    e.preventDefault(); // ! Log

    console.log("Updating!"); // ! WIP >>
    // - Create following View methods
    // - Create following Model metho
    // guide from Brad T
    // https://www.udemy.com/course/modern-javascript-from-the-beginning/learn/lecture/8762558#overview
    // Get Edit Task Inputs and Values

    const taskInput = View.getEditTaskTaskInput();
    const dateInput = View.getEditTaskDateInput();
    const memoInput = View.getEditTaskMemoInput();
    const pinBoolean = View.getEditTaskPinBoolean();
    const colorSelect = View.getEditTaskColorSelect(); // ? Rename const variable
    // Update component task in data

    const updateTaskData = Model.updateDataFromEditTask(taskInput, dateInput, memoInput, pinBoolean, colorSelect); // ! Log

    console.log("new Update data applied to database", updateTaskData); // Update item LS

    Storage.updateItem(updateTaskData); // Update UI

    View.updateTaskDisplayFromEditTask(updateTaskData);
    e.preventDefault();
  }; // Delete button of "Edit Task" module


  const editTaskDeleteSubmit = function (e) {
    // Get current task component
    const currentTask = Model.getCurrentItem(); // ! Log

    console.log("Attempting to delete", currentTask); // Delete from data structure

    Model.deleteItem(currentTask.id); // Delete item LS

    Storage.deleteItem(currentTask.id); // Delete from UI

    View.deleteTaskDisplayFromEditTask(currentTask.id);
    e.preventDefault();
  }; // If a task is UNCHECK, update data and UI


  const checkedTaskAndUpateData = function (e) {
    if (e.target.classList.contains("check")) {
      // console.log("clicked on:", e.target.classList.contains("check"));
      // console.log(e.target);
      // console.log(e.target.checked);
      // const checkbox = e.target;
      let completedStatus = e.target.checked;
      console.log(completedStatus); // Get task component id

      const currentTaskId = e.target.parentNode.parentNode.parentNode.id; // ! Log

      console.log("current task ID", currentTaskId); // Get task component id from Data

      const TasktoEditData = Model.getTaskById(currentTaskId); // ! Log

      console.log(TasktoEditData);
      Model.setCurrentTask(TasktoEditData);
      const updateTaskData = Model.updateCurrentTaskCheckedData(completedStatus); // Update item LS

      Storage.updateItem(updateTaskData);

      if (completedStatus == true) {
        console.log("task data change to COMPLETE..."); // Do NOT update UI

        return;
      } else {
        console.log("task data change to UNCOMPLETE..."); // Fetch items from data structure

        const items = Model.getItems(); // Check if there is any "completed" task equal 'true'

        let completedStatus = findCompletedStatus(items); // Update UI
        // Clear UI

        View.clearLists(); //todo - bookmark
        // Push UNCHECK task to Main List - basically a page refresh
        // setTimeout(View.populateList(items, completedStatus), 20000);

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
      console.log("Initialising App..."); // Fetch items from data structure

      const items = Model.getItems(); // Check if there is any "completed" task equal 'true'

      let completedStatus = findCompletedStatus(items); // Populate List

      View.populateList(items, completedStatus); // Load event listeners

      loadEventListeners();
    }
  };
}(Model, View, Storage); // Initialise App


Controller.init();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJtdmMuanMiXSwibmFtZXMiOlsibWFpbkVsZW1lbnQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJmb3JtVGFza0J0biIsImgxVGl0bGUiLCJtcSIsIndpbmRvdyIsIm1hdGNoTWVkaWEiLCJtYXRjaGVzIiwiY29uc29sZSIsImxvZyIsImluc2VydEFkamFjZW50RWxlbWVudCIsImlzTGFyZ2VTY3JlZW4iLCJpbm5lcldpZHRoIiwiYWRkRXZlbnRMaXN0ZW5lciIsImdldFVuaXF1ZUlkIiwiY3J5cHRvIiwiZ2V0UmFuZG9tVmFsdWVzIiwiVWludDMyQXJyYXkiLCJNYXRoIiwicmFuZG9tIiwiU3RvcmFnZSIsImFkZEl0ZW0iLCJuZXdUYXNrRGF0YSIsIml0ZW1zIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInB1c2giLCJzZXRJdGVtIiwiSlNPTiIsInN0cmluZ2lmeSIsInBhcnNlIiwiZ2V0SXRlbXMiLCJ1cGRhdGVJdGVtIiwidXBkYXRlVGFza0RhdGEiLCJmb3JFYWNoIiwiaXRlbSIsImluZGV4IiwiaWQiLCJzcGxpY2UiLCJkZWxldGVJdGVtIiwiY2xlYXJJdGVtcyIsInJlbW92ZUl0ZW0iLCJNb2RlbCIsIk1vZGVsQ29uc3RydWN0b3IiLCJ0aXRsZSIsImRhdGUiLCJtZW1vIiwicGluIiwiY29sb3IiLCJjb21wbGV0ZWQiLCJkYXRhIiwiY3VycmVudEl0ZW0iLCJsb2dEYXRhIiwiYWRkUXVpY2tUYXNrIiwicXVpY2tUYXNrSW5wdXQiLCJ1bmRlZmluZWQiLCJhZGRGb3JtVGFzayIsInRhc2tJbnB1dCIsImRhdGVJbnB1dCIsIm1lbW9JbnB1dCIsInBpbkJvb2xlYW4iLCJjb2xvclNlbGVjdCIsImdldFRhc2tCeUlkIiwidGFyZ2V0VGFza0RhdGEiLCJzZXRDdXJyZW50VGFzayIsInRhc2t0b0VkaXREYXRhIiwiZ2V0Q3VycmVudEl0ZW0iLCJ1cGRhdGVEYXRhRnJvbUVkaXRUYXNrIiwidXBkYXRlQ3VycmVudFRhc2tDaGVja2VkRGF0YSIsImNvbXBsZXRlZFN0YXR1cyIsImlkcyIsIm1hcCIsImluZGV4T2YiLCJWaWV3IiwiVUlTZWxlY3RvcnMiLCJ3aG9sZUxpc3RzIiwibGlzdENvbXBvbmVudCIsInF1aWNrVGFza0J0biIsIm1haW5MaXN0IiwiY29tcGxldGVkTGlzdCIsImFkZEZvcm1PcGVuYnRuIiwiYWRkRm9ybSIsImVkaXRGb3JtIiwib3ZlcmxheSIsImNsZWFyTGlzdE1lbnUiLCJkZWxldGVDYW5jZWxCdG4iLCJkZWxldGVDb25maXJtQnRuIiwib3BlbkNsZWFyTGlzdE1lbnVCdG4iLCJVSUVsZW1lbnRzIiwiYWRkRm9ybUNhbmNlbEJ0biIsImNoaWxkcmVuIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJhZGRGb3JtVGFza0lucHV0IiwibGFzdEVsZW1lbnRDaGlsZCIsImFkZEZvcm1EYXRlSW5wdXQiLCJhZGRGb3JtTWVtb0lucHV0IiwiYWRkRm9ybVBpbklucHV0IiwiYWRkRm9ybUNvbG9ySW5wdXRSZWQiLCJhZGRGb3JtQ29sb3JJbnB1dFllbGxvdyIsImFkZEZvcm1Db2xvcklucHV0Qmx1ZSIsImFkZEZvcm1Db2xvcklucHV0R3JlZW4iLCJhZGRGb3JtQ29sb3JJbnB1dE5vbmUiLCJhZGRGb3JtU3VibWl0QnRuIiwiZWRpdEZvcm1DYW5jZWxCdG4iLCJlZGl0Rm9ybVVwZGF0ZUJ0biIsImVkaXRGb3JtVGFza0lucHV0IiwiZWRpdEZvcm1EYXRlSW5wdXQiLCJlZGl0Rm9ybU1lbW9JbnB1dCIsImVkaXRGb3JtUGluSW5wdXQiLCJlZGl0Rm9ybUNvbG9ySW5wdXRSZWQiLCJlZGl0Rm9ybUNvbG9ySW5wdXRZZWxsb3ciLCJlZGl0Rm9ybUNvbG9ySW5wdXRCbHVlIiwiZWRpdEZvcm1Db2xvcklucHV0R3JlZW4iLCJlZGl0Rm9ybUNvbG9ySW5wdXROb25lIiwiZWRpdEZvcm1EZWxldGVCdG4iLCJyZW5kZXIiLCJ0YXNrRGF0YSIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJsaXN0Q29tcG9uZW50Rmlyc3RCbG9jayIsInBpbkNvbXBvbmVudCIsInBpbkljb24iLCJzZXRBdHRyaWJ1dGUiLCJhcHBlbmRDaGlsZCIsImNoZWNrYm94Q29tcG9uZW50IiwiY2hlY2tib3hJY29uIiwidHlwZSIsImNoZWNrZWQiLCJjaGVja2JveExhYmVsIiwiY2hlY2tib3hMYWJlbFRleHQiLCJjcmVhdGVUZXh0Tm9kZSIsImFwcGVuZCIsImR1ZURhdGVDb21wb25lbnQiLCJkdWVEYXRlU3BhbiIsImR1ZURhdGVUZXh0IiwiZWxsaXBzaXNDb21wb25lbnQiLCJlbGxpcHNpc0ljb24iLCJzdGlja3lDb2xvckNvbXBvbmVudCIsImxpc3RDb21wb25lbnRTZWNvbmRCbG9jayIsIm1lbW9TcGFuIiwibWVtb1RleHQiLCJwb3B1bGF0ZUxpc3QiLCJzaG93Q29tcGxldGVkTGlzdCIsInRhc2siLCJoaWRlQ29tcGxldGVkTGlzdCIsImdldFNlbGVjdG9ycyIsImdldEVsZW1lbnRzIiwiZ2V0UXVpY2tUYXNrSW5wdXQiLCJ2YWx1ZSIsImFkZFRhc2tUb01haW5MaXN0IiwibmV3VGFzayIsImFkZFRhc2tUb01haW5MaXN0UGlubmVkIiwiY2xlYXJRdWlja0FkZFRhc2tJbnB1dCIsInN0eWxlIiwiZGlzcGxheSIsIm9wZW5Gb3JtVGFzayIsInJlbW92ZSIsImNsb3NlRm9ybVRhc2siLCJnZXRGb3JtVGFza1Rhc2tJbnB1dCIsImdldEZvcm1UYXNrRGF0ZUlucHV0IiwiZm9ybWF0RGF0ZSIsInJlcGxhY2VBbGwiLCJnZXRGb3JtVGFza01lbW9JbnB1dCIsImdldEZvcm1UYXNrUGluQm9vbGVhbiIsImdldEZvcm1UYXNrQ29sb3JTZWxlY3QiLCJjb2xvclZhbHVlIiwiY2xlYXJGb3JtVGFza0ZpZWxkcyIsImFkZEl0ZW10b0VkaXRUYXNrIiwib3BlbkVkaXRUYXNrIiwiY2xvc2VFZGl0VGFzayIsImdldEVkaXRUYXNrVGFza0lucHV0IiwiZ2V0RWRpdFRhc2tEYXRlSW5wdXQiLCJnZXRFZGl0VGFza01lbW9JbnB1dCIsImdldEVkaXRUYXNrUGluQm9vbGVhbiIsImdldEVkaXRUYXNrQ29sb3JTZWxlY3QiLCJ1cGRhdGVUYXNrRGlzcGxheUZyb21FZGl0VGFzayIsInRhc2tDb21wb25lbnRzIiwicXVlcnlTZWxlY3RvckFsbCIsIkFycmF5IiwiZnJvbSIsInRhc2tDb21wb25lbnQiLCJ0YXNrSWQiLCJjdXJyZW50VGFza0NvbXBvbmVudFVJIiwiZ2V0RWxlbWVudEJ5SWQiLCJuZXdEaXNwbGF5VGFza0NvbXBvbmVudCIsInBhcmVudE5vZGUiLCJyZXBsYWNlQ2hpbGQiLCJkZWxldGVUYXNrRGlzcGxheUZyb21FZGl0VGFzayIsIm9wZW5DbGVhckxpc3RNZW51IiwiY2xvc2VDbGVhckxpc3RNZW51IiwiY2xlYXJMaXN0cyIsImZpcnN0Q2hpbGQiLCJyZW1vdmVDaGlsZCIsIkNvbnRyb2xsZXIiLCJsb2FkRXZlbnRMaXN0ZW5lcnMiLCJxdWlja0FkZFRhc2tTdWJtaXQiLCJmb3JtVGFza1N1Ym1pdCIsImNsaWNrZWRFZGl0VGFzayIsImVkaXRUYXNrU3VibWl0IiwiZWRpdFRhc2tEZWxldGVTdWJtaXQiLCJjaGVja2VkVGFza0FuZFVwYXRlRGF0YSIsImUiLCJpbnB1dCIsInByZXZlbnREZWZhdWx0IiwidGFyZ2V0IiwiY29udGFpbnMiLCJjdXJyZW50VGFza0lkIiwiVGFza3RvRWRpdERhdGEiLCJjdXJyZW50VGFzayIsImZpbmRDb21wbGV0ZWRTdGF0dXMiLCJpbml0Il0sIm1hcHBpbmdzIjoiOztBQUFBLE1BQU1BLFdBQVcsR0FBR0MsUUFBUSxDQUFDQyxhQUFULENBQXVCLE1BQXZCLENBQXBCO0FBQ0EsTUFBTUMsV0FBVyxHQUFHRixRQUFRLENBQUNDLGFBQVQsQ0FBdUIsaUJBQXZCLENBQXBCO0FBQ0EsTUFBTUUsT0FBTyxHQUFHSCxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBaEIsQyxDQUVBOztBQUNBLE1BQU1HLEVBQUUsR0FBR0MsTUFBTSxDQUFDQyxVQUFQLENBQWtCLG9CQUFsQixDQUFYLEMsQ0FFQTtBQUNBOztBQUNB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QUFDaUIsSUFBWCIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBtYWluRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtYWluXCIpO1xyXG5jb25zdCBmb3JtVGFza0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybS10YXNrX19idG5cIik7XHJcbmNvbnN0IGgxVGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRpdGxlXCIpO1xyXG5cclxuLy8gUmUtUG9zaXRpb24gaDEgLnRpdGxlXHJcbmNvbnN0IG1xID0gd2luZG93Lm1hdGNoTWVkaWEoXCIobWluLXdpZHRoOiA2MDBweClcIik7XHJcblxyXG4vLyAhIEZ1cnRoZXIgdGVzdGluZyBvbiBtb2JpbGUgZGV2aWNlIG5lZWRlZFxyXG4vLyA/IE5vdCBzdXJlIGlmLXN0YXRlbWVudCBvciBtcSBpcyBuZWNlc3NhcnlcclxuaWYgKG1xLm1hdGNoZXMpIHtcclxuICAgIC8vIE1vdmUgaDEgLnRpdGxlIGVsZW1lbnRcclxuICAgIGNvbnNvbGUubG9nKFwicGFzcyAtIGlzIExhcmdlIFNjcmVlblwiKTtcclxuICAgIG1haW5FbGVtZW50Lmluc2VydEFkamFjZW50RWxlbWVudCgnYWZ0ZXJiZWdpbicsIGgxVGl0bGUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0xhcmdlU2NyZWVuKCkge1xyXG4gICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID49IDYwMCkge1xyXG4gICAgICAgIC8vIE1vdmUgaDEgLnRpdGxlIGVsZW1lbnRcclxuICAgICAgICBjb25zb2xlLmxvZyhcInBhc3MgLSBpcyBMYXJnZSBTY3JlZW5cIik7XHJcbiAgICAgICAgbWFpbkVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCdhZnRlcmJlZ2luJywgaDFUaXRsZSk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBmb3JtVGFza0J0bi5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2FmdGVyZW5kJywgaDFUaXRsZSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJwYXNzIC0gaXMgTGFyZ2UgU2NyZWVuIEZsZXhcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIGlzTGFyZ2VTY3JlZW4pO1xyXG4iLCIvLyBPdGhlciBNb2R1bGVzXHJcbi8vIGNvbnN0IHV1aWQgPSB1dWlkdjQ7XHJcbi8vIGNvbnN0IGdldFVuaXF1ZUlkID0gdXVpZHY0O1xyXG5cclxuLy8gdG9kb1xyXG4vLyBJbXBsZW1ldCB0aGUgXCJUYXNrIEZvcm1cIiBNVkNcclxuLy8gRkluZCBvdXQgd2h5IHlvdSBjYW5ub3QgbWFyayAnY2hlY2tlZCcgb24gdGhlIGNoZWNrYm94XHJcblxyXG5mdW5jdGlvbiBnZXRVbmlxdWVJZCgpIHtcclxuICAgIGlmICh3aW5kb3cuY3J5cHRvICYmIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50MzJBcnJheSgxKSlbMF07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpXHJcbiAgICB9XHJcbn1cclxuXHJcbi8vID09PT09PT09PT09PT09PT09PVxyXG4vLyBTdG9yYWdlIENvbnRyb2xsZXJcclxuLy8gPT09PT09PT09PT09PT09PT09XHJcbi8vIC0gTG9jYWwgU3RvcmFnZVxyXG5jb25zdCBTdG9yYWdlID0gKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAvLyBQdWJsaWMgbWV0aG9kc1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBhZGRJdGVtOiBmdW5jdGlvbiAobmV3VGFza0RhdGEpIHtcclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJwZXJzaXN0aW5nIHRvIExTLi4uXCIpXHJcbiAgICAgICAgICAgIGxldCBpdGVtcztcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZXJlIGlzIGFueSBkYXRhIGluIExTXHJcbiAgICAgICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRhc2tzXCIpID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFB1c2ggbmV3IGl0ZW1cclxuICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2gobmV3VGFza0RhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIG5ldyBTdG9yYWdlICd0YXNrcydcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU2V0IExTXHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRhc2tzXCIsIEpTT04uc3RyaW5naWZ5KGl0ZW1zKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBHZXQgZGF0YSBpZiBhdmFpbGFibGVcclxuICAgICAgICAgICAgICAgIGl0ZW1zID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRhc2tzXCIpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJHZXR0aW5nIGF2YWlsYWJsZSBTdG9yYWdlOiBcIiwgaXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFB1c2ggbmV3IGl0ZW1cclxuICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2gobmV3VGFza0RhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFJlLVNldCBMU1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0YXNrc1wiLCBKU09OLnN0cmluZ2lmeShpdGVtcykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRJdGVtczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsZXQgaXRlbXM7XHJcbiAgICAgICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRhc2tzXCIpID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGl0ZW1zID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRhc2tzXCIpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW1zO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdXBkYXRlSXRlbTogZnVuY3Rpb24gKHVwZGF0ZVRhc2tEYXRhKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0YXNrc1wiKSk7XHJcblxyXG4gICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHVwZGF0ZVRhc2tEYXRhLmlkID09IGl0ZW0uaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtcy5zcGxpY2UoaW5kZXgsIDEsIHVwZGF0ZVRhc2tEYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidGFza3NcIiwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlbGV0ZUl0ZW06IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgICAgICBsZXQgaXRlbXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidGFza3NcIikpO1xyXG5cclxuICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpZCA9PSBpdGVtLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRhc2tzXCIsIEpTT04uc3RyaW5naWZ5KGl0ZW1zKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbGVhckl0ZW1zOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwidGFza3NcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpO1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gSXRlbSBDb250cm9sbGVyIHx8IE1vZGVsXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyAtIExvY2FsIERhdGFcclxuY29uc3QgTW9kZWwgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gTW9kZWwgQ29uc3RydWN0b3JcclxuICAgIGNvbnN0IE1vZGVsQ29uc3RydWN0b3IgPSBmdW5jdGlvbiAoaWQgPSBnZXRVbmlxdWVJZCgpLCB0aXRsZSwgZGF0ZSA9IFwiXCIsIG1lbW8gPSBcIlwiLCBwaW4gPSBmYWxzZSwgY29sb3IgPSBcIm5vbmVcIiwgY29tcGxldGVkID0gZmFsc2UpIHtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgIHRoaXMuZGF0ZSA9IGRhdGU7XHJcbiAgICAgICAgdGhpcy5tZW1vID0gbWVtbztcclxuICAgICAgICB0aGlzLnBpbiA9IHBpbjtcclxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICAgICAgdGhpcy5jb21wbGV0ZWQgPSBjb21wbGV0ZWQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIERhdGEgU3RydWN0dXJlIC8gU3RhdGVcclxuICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICAgLy8gaXRlbXM6IFtcclxuICAgICAgICAvLyAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgXCJpZFwiOiBnZXRVbmlxdWVJZCgpLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJ0aXRsZVwiOiBcIldhbGsgdGhlIGRvZ1wiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJtZW1vXCI6IFwiV2FsayBmb3IgaGFsZiBhbiBob3VyXCIsXHJcbiAgICAgICAgLy8gICAgICAgICBcImRhdGVcIjogXCJcIixcclxuICAgICAgICAvLyAgICAgICAgIFwicGluXCI6IGZhbHNlLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJjb2xvclwiOiBcIm5vbmVcIixcclxuICAgICAgICAvLyAgICAgICAgIFwiY29tcGxldGVkXCI6IGZhbHNlXHJcbiAgICAgICAgLy8gICAgIH0sXHJcbiAgICAgICAgLy8gICAgIHtcclxuICAgICAgICAvLyAgICAgICAgIFwiaWRcIjogZ2V0VW5pcXVlSWQoKSxcclxuICAgICAgICAvLyAgICAgICAgIFwidGl0bGVcIjogXCJXYXRlciB0aGUgcGxhbnRcIixcclxuICAgICAgICAvLyAgICAgICAgIFwibWVtb1wiOiBcIlwiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJkYXRlXCI6IFwiMDEvMDEvMjBcIixcclxuICAgICAgICAvLyAgICAgICAgIFwicGluXCI6IGZhbHNlLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJjb2xvclwiOiBcInJlZFwiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJjb21wbGV0ZWRcIjogZmFsc2VcclxuICAgICAgICAvLyAgICAgfSxcclxuICAgICAgICAvLyAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgXCJpZFwiOiBnZXRVbmlxdWVJZCgpLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJ0aXRsZVwiOiBcIldhdGVyIHRoZSBwbGFudCBhZ2FpblwiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJtZW1vXCI6IFwiXCIsXHJcbiAgICAgICAgLy8gICAgICAgICBcImRhdGVcIjogXCIwMS8wMS8yMFwiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJwaW5cIjogdHJ1ZSxcclxuICAgICAgICAvLyAgICAgICAgIFwiY29sb3JcIjogXCJub25lXCIsXHJcbiAgICAgICAgLy8gICAgICAgICBcImNvbXBsZXRlZFwiOiBmYWxzZVxyXG4gICAgICAgIC8vICAgICB9LFxyXG4gICAgICAgIC8vICAgICB7XHJcbiAgICAgICAgLy8gICAgICAgICBcImlkXCI6IGdldFVuaXF1ZUlkKCksXHJcbiAgICAgICAgLy8gICAgICAgICBcInRpdGxlXCI6IFwiRG8gZ3JvY2VyeVwiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJtZW1vXCI6IFwiXCIsXHJcbiAgICAgICAgLy8gICAgICAgICBcImRhdGVcIjogXCJcIixcclxuICAgICAgICAvLyAgICAgICAgIFwicGluXCI6IHRydWUsXHJcbiAgICAgICAgLy8gICAgICAgICBcImNvbG9yXCI6IFwibm9uZVwiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJjb21wbGV0ZWRcIjogdHJ1ZVxyXG4gICAgICAgIC8vICAgICB9LFxyXG4gICAgICAgIC8vICAgICB7XHJcbiAgICAgICAgLy8gICAgICAgICBcImlkXCI6IGdldFVuaXF1ZUlkKCksXHJcbiAgICAgICAgLy8gICAgICAgICBcInRpdGxlXCI6IFwiU2luZyBzb25nXCIsXHJcbiAgICAgICAgLy8gICAgICAgICBcIm1lbW9cIjogXCJcIixcclxuICAgICAgICAvLyAgICAgICAgIFwiZGF0ZVwiOiBcIlwiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJwaW5cIjogZmFsc2UsXHJcbiAgICAgICAgLy8gICAgICAgICBcImNvbG9yXCI6IFwibm9uZVwiLFxyXG4gICAgICAgIC8vICAgICAgICAgXCJjb21wbGV0ZWRcIjogdHJ1ZVxyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gXSxcclxuICAgICAgICBpdGVtczogU3RvcmFnZS5nZXRJdGVtcygpLFxyXG4gICAgICAgIGN1cnJlbnRJdGVtOiBudWxsLFxyXG4gICAgfVxyXG5cclxuICAgIC8vIFB1YmxpYyBNZXRob2RzXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGxvZ0RhdGE6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRJdGVtczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZGF0YS5pdGVtcztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFkZFF1aWNrVGFzazogZnVuY3Rpb24gKHF1aWNrVGFza0lucHV0KSB7XHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHF1aWNrVGFza0lucHV0KTtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBuZXcgdGFza1xyXG4gICAgICAgICAgICBjb25zdCBuZXdUYXNrRGF0YSA9IG5ldyBNb2RlbENvbnN0cnVjdG9yKHVuZGVmaW5lZCwgcXVpY2tUYXNrSW5wdXQpO1xyXG5cclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgY29uc29sZS5sb2cobmV3VGFza0RhdGEpO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIHRvIGl0ZW1zIEFycmF5XHJcbiAgICAgICAgICAgIGRhdGEuaXRlbXMucHVzaChuZXdUYXNrRGF0YSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3VGFza0RhdGE7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZGRGb3JtVGFzazogZnVuY3Rpb24gKHRhc2tJbnB1dCwgZGF0ZUlucHV0LCBtZW1vSW5wdXQsIHBpbkJvb2xlYW4sIGNvbG9yU2VsZWN0KSB7XHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRhc2tJbnB1dCwgZGF0ZUlucHV0LCBtZW1vSW5wdXQsIHBpbkJvb2xlYW4sIGNvbG9yU2VsZWN0KTtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBuZXcgdGFza1xyXG4gICAgICAgICAgICBjb25zdCBuZXdUYXNrRGF0YSA9IG5ldyBNb2RlbENvbnN0cnVjdG9yKHVuZGVmaW5lZCwgdGFza0lucHV0LCBkYXRlSW5wdXQsIG1lbW9JbnB1dCwgcGluQm9vbGVhbiwgY29sb3JTZWxlY3QpO1xyXG5cclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgY29uc29sZS5sb2cobmV3VGFza0RhdGEpO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIHRvIGl0ZW1zIEFycmF5XHJcbiAgICAgICAgICAgIGRhdGEuaXRlbXMucHVzaChuZXdUYXNrRGF0YSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3VGFza0RhdGE7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRUYXNrQnlJZDogZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgICAgIGxldCB0YXJnZXRUYXNrRGF0YSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAvLyBMb29wIHRocm91Z2ggaXRlbXNcclxuICAgICAgICAgICAgZGF0YS5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5pZCA9PSBpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRhc2tEYXRhID0gaXRlbTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZldGNoaW5nIHRhcmdldGVkIGl0ZW0gaXNcIiwgdGFyZ2V0VGFza0RhdGEpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldFRhc2tEYXRhO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0Q3VycmVudFRhc2s6IGZ1bmN0aW9uICh0YXNrdG9FZGl0RGF0YSkge1xyXG4gICAgICAgICAgICBkYXRhLmN1cnJlbnRJdGVtID0gdGFza3RvRWRpdERhdGE7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRDdXJyZW50SXRlbTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZGF0YS5jdXJyZW50SXRlbTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVwZGF0ZURhdGFGcm9tRWRpdFRhc2s6IGZ1bmN0aW9uICh0YXNrSW5wdXQsIGRhdGVJbnB1dCwgbWVtb0lucHV0LCBwaW5Cb29sZWFuLCBjb2xvclNlbGVjdCkge1xyXG4gICAgICAgICAgICBsZXQgdGFyZ2V0VGFza0RhdGEgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgZGF0YS5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5pZCA9PT0gZGF0YS5jdXJyZW50SXRlbS5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFNldCBuZXcgdmFsdWVzXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS50aXRsZSA9IHRhc2tJbnB1dDtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmRhdGUgPSBkYXRlSW5wdXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5tZW1vID0gbWVtb0lucHV0O1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ucGluID0gcGluQm9vbGVhbjtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmNvbG9yID0gY29sb3JTZWxlY3Q7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRhc2tEYXRhID0gaXRlbTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRUYXNrRGF0YTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVwZGF0ZUN1cnJlbnRUYXNrQ2hlY2tlZERhdGE6IGZ1bmN0aW9uIChjb21wbGV0ZWRTdGF0dXMpIHtcclxuICAgICAgICAgICAgbGV0IHRhcmdldFRhc2tEYXRhID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGRhdGEuaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT0gZGF0YS5jdXJyZW50SXRlbS5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFNldCBtYXJrIGNvbXBsZXRlZCBcInRydWVcIlxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uY29tcGxldGVkID0gY29tcGxldGVkU3RhdHVzO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ3VycmVudCB0YXNrIGNvbXBsZXRlIGlzXCIsIGl0ZW0uY29tcGxldGVkKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUYXNrRGF0YSA9IGl0ZW07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0VGFza0RhdGE7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWxldGVJdGVtOiBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJEZWxldGluZyBkYXRhLi4uXCIpXHJcbiAgICAgICAgICAgIC8vIEdldCBhbiBhcnJheSBvZiBpZHNcclxuICAgICAgICAgICAgY29uc3QgaWRzID0gZGF0YS5pdGVtcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmlkO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCBpbmRleCBvZiB0YXJnZXQgdGFzayBjb21wb25lbnQgaWRcclxuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBpZHMuaW5kZXhPZihpZCk7XHJcblxyXG4gICAgICAgICAgICAvLyBSZW1vdmUgaXRlbVxyXG4gICAgICAgICAgICBkYXRhLml0ZW1zLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBVSSBDb250cm9sbGVyIHx8IFZpZXdcclxuLy8gPT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vLyAtIEFueXRoaW5nIHRvIGRvIHdpdGggdGhlIFVJXHJcbmNvbnN0IFZpZXcgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gVUkgc2VsZWN0b3JzJyBuYW1lXHJcbiAgICBjb25zdCBVSVNlbGVjdG9ycyA9IHtcclxuICAgICAgICB3aG9sZUxpc3RzOiBcIi5saXN0X193cmFwcGVyXCIsXHJcbiAgICAgICAgbGlzdENvbXBvbmVudDogXCIubGlzdC1jb21wb25lbnRcIixcclxuICAgICAgICAvLyBRdWljayBcIkFkZCBUYXNrXCIgU2VsZWN0b3JzXHJcbiAgICAgICAgcXVpY2tUYXNrSW5wdXQ6IFwiLmFkZC10YXNrX19pbnB1dFwiLFxyXG4gICAgICAgIHF1aWNrVGFza0J0bjogXCIuYWRkLXRhc2tfX2J0blwiLFxyXG4gICAgICAgIC8vIExpc3RzIFNlbGVjdG9yc1xyXG4gICAgICAgIG1haW5MaXN0OiBcIi5tYWluLWxpc3RcIixcclxuICAgICAgICBjb21wbGV0ZWRMaXN0OiBcIi5jb21wbGV0ZWQtbGlzdFwiLFxyXG4gICAgICAgIC8vIEZvcm0gU2VsZWN0b3JzXHJcbiAgICAgICAgYWRkRm9ybU9wZW5idG46IFwiLmZvcm0tdGFza19fYnRuXCIsXHJcbiAgICAgICAgYWRkRm9ybTogXCIuZm9ybS10YXNrX193cmFwcGVyXCIsXHJcbiAgICAgICAgZWRpdEZvcm06IFwiLmVkaXQtdGFza19fd3JhcHBlclwiLFxyXG4gICAgICAgIG92ZXJsYXk6IFwiLm92ZXJsYXlfX21vZHVsZVwiLFxyXG4gICAgICAgIC8vIENsZWFyIExpc3QgU2VsZWN0b3JzXHJcbiAgICAgICAgY2xlYXJMaXN0TWVudTogXCIuZGVsZXRlLWNvbmZpcm1hdGlvbl9fbW9kdWxlXCIsXHJcbiAgICAgICAgZGVsZXRlQ2FuY2VsQnRuOiBcIi5kZWxldGUtY29uZmlybWF0aW9uLWNhbmNlbF9fYnRuXCIsXHJcbiAgICAgICAgZGVsZXRlQ29uZmlybUJ0bjogXCIuZGVsZXRlLWNvbmZpcm1hdGlvbi1jb25maXJtX19idG5cIixcclxuICAgICAgICBvcGVuQ2xlYXJMaXN0TWVudUJ0bjogXCIuY2xlYXItbGlzdF9fYnRuXCJcclxuICAgIH1cclxuXHJcbiAgICAvLyBVSSBlbGVtZW50XHJcbiAgICBjb25zdCBVSUVsZW1lbnRzID0ge1xyXG4gICAgICAgIC8vIFwiRm9ybSBUYXNrXCIgRm9ybVxyXG4gICAgICAgIGFkZEZvcm1DYW5jZWxCdG46IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybS10YXNrX19tb2R1bGVcIikuY2hpbGRyZW5bMF0uZmlyc3RFbGVtZW50Q2hpbGQsXHJcbiAgICAgICAgYWRkRm9ybVRhc2tJbnB1dDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mb3JtLXRhc2tfX21vZHVsZVwiKS5jaGlsZHJlblsxXS5jaGlsZHJlblswXS5sYXN0RWxlbWVudENoaWxkLFxyXG4gICAgICAgIGFkZEZvcm1EYXRlSW5wdXQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybS10YXNrX19tb2R1bGVcIikuY2hpbGRyZW5bMV0uY2hpbGRyZW5bMV0ubGFzdEVsZW1lbnRDaGlsZCxcclxuICAgICAgICBhZGRGb3JtTWVtb0lucHV0OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZvcm0tdGFza19fbW9kdWxlXCIpLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzJdLmxhc3RFbGVtZW50Q2hpbGQsXHJcbiAgICAgICAgYWRkRm9ybVBpbklucHV0OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZvcm0tdGFza19fbW9kdWxlXCIpLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzNdLmxhc3RFbGVtZW50Q2hpbGQuZmlyc3RFbGVtZW50Q2hpbGQsXHJcbiAgICAgICAgYWRkRm9ybUNvbG9ySW5wdXRSZWQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybS10YXNrX19tb2R1bGVcIikuY2hpbGRyZW5bMV0uY2hpbGRyZW5bNF0uY2hpbGRyZW5bMV0uY2hpbGRyZW5bMF0sXHJcbiAgICAgICAgYWRkRm9ybUNvbG9ySW5wdXRZZWxsb3c6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybS10YXNrX19tb2R1bGVcIikuY2hpbGRyZW5bMV0uY2hpbGRyZW5bNF0uY2hpbGRyZW5bMV0uY2hpbGRyZW5bMl0sXHJcbiAgICAgICAgYWRkRm9ybUNvbG9ySW5wdXRCbHVlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZvcm0tdGFza19fbW9kdWxlXCIpLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzRdLFxyXG4gICAgICAgIGFkZEZvcm1Db2xvcklucHV0R3JlZW46IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybS10YXNrX19tb2R1bGVcIikuY2hpbGRyZW5bMV0uY2hpbGRyZW5bNF0uY2hpbGRyZW5bMV0uY2hpbGRyZW5bNl0sXHJcbiAgICAgICAgYWRkRm9ybUNvbG9ySW5wdXROb25lOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZvcm0tdGFza19fbW9kdWxlXCIpLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzhdLFxyXG4gICAgICAgIGFkZEZvcm1TdWJtaXRCdG46IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybS10YXNrX19tb2R1bGVcIikuY2hpbGRyZW5bMV0uY2hpbGRyZW5bNF0uY2hpbGRyZW5bMl0sXHJcbiAgICAgICAgLy8gXCJFZGl0IFRhc2tcIiBGb3JtXHJcbiAgICAgICAgZWRpdEZvcm1DYW5jZWxCdG46IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZWRpdC10YXNrX19tb2R1bGVcIikuY2hpbGRyZW5bMF0uZmlyc3RFbGVtZW50Q2hpbGQsXHJcbiAgICAgICAgZWRpdEZvcm1VcGRhdGVCdG46IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZWRpdC10YXNrX19tb2R1bGVcIikuY2hpbGRyZW5bMF0ubGFzdEVsZW1lbnRDaGlsZCxcclxuICAgICAgICBlZGl0Rm9ybVRhc2tJbnB1dDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lZGl0LXRhc2tfX21vZHVsZVwiKS5jaGlsZHJlblsxXS5jaGlsZHJlblswXS5sYXN0RWxlbWVudENoaWxkLFxyXG4gICAgICAgIGVkaXRGb3JtRGF0ZUlucHV0OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXQtdGFza19fbW9kdWxlXCIpLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzFdLmxhc3RFbGVtZW50Q2hpbGQsXHJcbiAgICAgICAgZWRpdEZvcm1NZW1vSW5wdXQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZWRpdC10YXNrX19tb2R1bGVcIikuY2hpbGRyZW5bMV0uY2hpbGRyZW5bMl0ubGFzdEVsZW1lbnRDaGlsZCxcclxuICAgICAgICBlZGl0Rm9ybVBpbklucHV0OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXQtdGFza19fbW9kdWxlXCIpLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzNdLmxhc3RFbGVtZW50Q2hpbGQuZmlyc3RFbGVtZW50Q2hpbGQsXHJcbiAgICAgICAgZWRpdEZvcm1Db2xvcklucHV0UmVkOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXQtdGFza19fbW9kdWxlXCIpLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzBdLFxyXG4gICAgICAgIGVkaXRGb3JtQ29sb3JJbnB1dFllbGxvdzogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lZGl0LXRhc2tfX21vZHVsZVwiKS5jaGlsZHJlblsxXS5jaGlsZHJlbls0XS5jaGlsZHJlblsxXS5jaGlsZHJlblsyXSxcclxuICAgICAgICBlZGl0Rm9ybUNvbG9ySW5wdXRCbHVlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXQtdGFza19fbW9kdWxlXCIpLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzRdLFxyXG4gICAgICAgIGVkaXRGb3JtQ29sb3JJbnB1dEdyZWVuOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXQtdGFza19fbW9kdWxlXCIpLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzZdLFxyXG4gICAgICAgIGVkaXRGb3JtQ29sb3JJbnB1dE5vbmU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZWRpdC10YXNrX19tb2R1bGVcIikuY2hpbGRyZW5bMV0uY2hpbGRyZW5bNF0uY2hpbGRyZW5bMV0uY2hpbGRyZW5bOF0sXHJcbiAgICAgICAgZWRpdEZvcm1EZWxldGVCdG46IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZWRpdC10YXNrX19tb2R1bGVcIikuY2hpbGRyZW5bMV0uY2hpbGRyZW5bNF0uY2hpbGRyZW5bMl1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZW5kZXIgPSBmdW5jdGlvbiAodGFza0RhdGEpIHtcclxuICAgICAgICBjb25zdCBsaXN0Q29tcG9uZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBsaXN0Q29tcG9uZW50LmNsYXNzTGlzdC5hZGQoXCJsaXN0LWNvbXBvbmVudFwiKTtcclxuICAgICAgICAvLyBBZGQgVW5pcXVlIElEXHJcbiAgICAgICAgbGlzdENvbXBvbmVudC5pZCA9IHRhc2tEYXRhW1wiaWRcIl07XHJcblxyXG4gICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgY29uc29sZS5sb2cobGlzdENvbXBvbmVudC5pZCk7XHJcblxyXG4gICAgICAgIC8vIExpc3QgQ29tcG9uZW50IC0gRmlyc3QgQmxvY2tcclxuICAgICAgICBjb25zdCBsaXN0Q29tcG9uZW50Rmlyc3RCbG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgbGlzdENvbXBvbmVudEZpcnN0QmxvY2suY2xhc3NMaXN0LmFkZChcImxpc3QtY29tcG9uZW50X19maXJzdC1ibG9ja1wiKTtcclxuXHJcbiAgICAgICAgLy8gTGlzdCBDb21wb25lbnQgLSBGaXJzdCBCbG9jayAtIENvbXBvbmVudHNcclxuICAgICAgICAvLyBQaW4gdG8gdGhlIFRvcFxyXG4gICAgICAgIGNvbnN0IHBpbkNvbXBvbmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgcGluQ29tcG9uZW50LmNsYXNzTGlzdC5hZGQoXCJwaW5fX3dyYXBwZXJcIik7XHJcbiAgICAgICAgY29uc3QgcGluSWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpXCIpO1xyXG4gICAgICAgIHBpbkljb24uY2xhc3NMaXN0LmFkZChcImZhXCIsIFwiZmEtdGh1bWItdGFja1wiKTtcclxuXHJcbiAgICAgICAgaWYgKCF0YXNrRGF0YVtcInBpblwiXSkge1xyXG4gICAgICAgICAgICBwaW5JY29uLmNsYXNzTGlzdC5hZGQoXCJpbnZpc2libGVcIilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBpbkljb24uc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJ0cnVlXCIpO1xyXG5cclxuICAgICAgICBwaW5Db21wb25lbnQuYXBwZW5kQ2hpbGQocGluSWNvbik7XHJcblxyXG4gICAgICAgIC8vIENoZWNrYm94XHJcbiAgICAgICAgY29uc3QgY2hlY2tib3hDb21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICAgICAgY2hlY2tib3hDb21wb25lbnQuY2xhc3NMaXN0LmFkZChcImNoZWNrYm94XCIpO1xyXG4gICAgICAgIC8vIGNoZWNrYm94Q29tcG9uZW50LnNldEF0dHJpYnV0ZShcImZvclwiLCBcImNoZWNrXCIpO1xyXG5cclxuICAgICAgICAvLyBDaGVja2JveCAtIEljb25cclxuICAgICAgICBjb25zdCBjaGVja2JveEljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgY2hlY2tib3hJY29uLmlkID0gXCJjaGVja1wiO1xyXG4gICAgICAgIGNoZWNrYm94SWNvbi50eXBlID0gXCJjaGVja2JveFwiO1xyXG4gICAgICAgIGNoZWNrYm94SWNvbi5jaGVja2VkID0gdGFza0RhdGFbXCJjb21wbGV0ZWRcIl07XHJcbiAgICAgICAgY2hlY2tib3hJY29uLmNsYXNzTGlzdC5hZGQoXCJjaGVja1wiKTtcclxuICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ2hlY2tib3hJY29uXCIsIGNoZWNrYm94SWNvbi5jaGVja2VkKTtcclxuXHJcbiAgICAgICAgLy8gQ2hlY2tib3ggLSBMYWJlbFxyXG4gICAgICAgIGNvbnN0IGNoZWNrYm94TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBjaGVja2JveExhYmVsLmNsYXNzTGlzdC5hZGQoXCJ0ZXh0LWxhYmVsXCIpO1xyXG5cclxuICAgICAgICAvLyBDaGVja2JveCAtIExhYmVsIC0gQ3JlYXRlIFRleHROb2RlXHJcbiAgICAgICAgY29uc3QgY2hlY2tib3hMYWJlbFRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0YXNrRGF0YVtcInRpdGxlXCJdKTtcclxuICAgICAgICBjaGVja2JveExhYmVsLmFwcGVuZChjaGVja2JveExhYmVsVGV4dCk7XHJcblxyXG4gICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJyZW5kZXJpbmcgbGFiZWw6XCIsIGNoZWNrYm94TGFiZWwpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVuZGVyaW5nIGxhYmVsIHRleHQ6XCIsIGNoZWNrYm94TGFiZWxUZXh0KTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInJlbmRlcmluZyBsYWJlbCB0ZXh0IGRhdGE6XCIsIHRhc2tEYXRhW1widGl0bGVcIl0pO1xyXG5cclxuICAgICAgICBjaGVja2JveENvbXBvbmVudC5hcHBlbmRDaGlsZChjaGVja2JveEljb24pO1xyXG4gICAgICAgIGNoZWNrYm94Q29tcG9uZW50LmFwcGVuZENoaWxkKGNoZWNrYm94TGFiZWwpO1xyXG5cclxuICAgICAgICAvLyBEdWUgRGF0ZVxyXG4gICAgICAgIGNvbnN0IGR1ZURhdGVDb21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGR1ZURhdGVDb21wb25lbnQuY2xhc3NMaXN0LmFkZChcImR1ZS1kYXRlXCIpO1xyXG5cclxuICAgICAgICAvLyBEdWUgRGF0ZSAtIFNwYW4gRWxlbWVudFxyXG4gICAgICAgIGNvbnN0IGR1ZURhdGVTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgZHVlRGF0ZVNwYW4uY2xhc3NMaXN0LmFkZChcInRleHQtZGF0ZVwiKTtcclxuXHJcbiAgICAgICAgaWYgKHRhc2tEYXRhW1wiZGF0ZVwiXSkge1xyXG4gICAgICAgICAgICAvLyBEdWUgRGF0ZSAtIENyZWF0ZSBUZXh0Tm9kZVxyXG4gICAgICAgICAgICBjb25zdCBkdWVEYXRlVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRhc2tEYXRhW1wiZGF0ZVwiXSk7XHJcbiAgICAgICAgICAgIGR1ZURhdGVTcGFuLmFwcGVuZChkdWVEYXRlVGV4dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkdWVEYXRlQ29tcG9uZW50LmFwcGVuZENoaWxkKGR1ZURhdGVTcGFuKTtcclxuXHJcbiAgICAgICAgLy8gRWxsaXBzZXNcclxuICAgICAgICBjb25zdCBlbGxpcHNpc0NvbXBvbmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZWxsaXBzaXNDb21wb25lbnQuY2xhc3NMaXN0LmFkZChcImVsbGlwc2VzX193cmFwcGVyXCIpO1xyXG5cclxuICAgICAgICAvLyBFbGxpcHNlcyAtIEljb25cclxuICAgICAgICBjb25zdCBlbGxpcHNpc0ljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaVwiKTtcclxuICAgICAgICBlbGxpcHNpc0ljb24uY2xhc3NMaXN0LmFkZChcImZhXCIsIFwiZmEtZWxsaXBzaXMtaFwiKTtcclxuICAgICAgICBlbGxpcHNpc0ljb24uc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJ0cnVlXCIpO1xyXG5cclxuICAgICAgICBlbGxpcHNpc0NvbXBvbmVudC5hcHBlbmRDaGlsZChlbGxpcHNpc0ljb24pO1xyXG5cclxuICAgICAgICAvLyBTdGljayBDb2xvclxyXG4gICAgICAgIGNvbnN0IHN0aWNreUNvbG9yQ29tcG9uZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBzdGlja3lDb2xvckNvbXBvbmVudC5jbGFzc0xpc3QuYWRkKFwic3RpY2t5LWNvbG9yXCIpO1xyXG5cclxuICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUmVuZGVyaW5nIFN0aWNreSBDb2xvcjpcIiwgdGFza0RhdGFbXCJjb2xvclwiXSk7XHJcblxyXG4gICAgICAgIGlmICh0YXNrRGF0YVtcImNvbG9yXCJdICE9IFwibm9uZVwiKSB7XHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQWRkaW5nIGNsYXNzIFN0aWNreSBDb2xvcjpcIiwgdGFza0RhdGFbXCJjb2xvclwiXSk7XHJcblxyXG4gICAgICAgICAgICBzdGlja3lDb2xvckNvbXBvbmVudC5jbGFzc0xpc3QuYWRkKHRhc2tEYXRhW1wiY29sb3JcIl0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUmVuZGVyaW5nIFN0aWNreSBDb2xvcjogXCIsIFwibm9uZVwiKTtcclxuXHJcbiAgICAgICAgICAgIHN0aWNreUNvbG9yQ29tcG9uZW50LmNsYXNzTGlzdC5hZGQoXCJub25lXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTGlzdCBDb21wb25lbnQgLSBTZWNvbmQgQmxvY2tcclxuICAgICAgICBjb25zdCBsaXN0Q29tcG9uZW50U2Vjb25kQmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGxpc3RDb21wb25lbnRTZWNvbmRCbG9jay5jbGFzc0xpc3QuYWRkKFwibGlzdC1jb21wb25lbnRfX3NlY29uZC1ibG9ja1wiKTtcclxuXHJcbiAgICAgICAgLy8gTWVtb1xyXG4gICAgICAgIGNvbnN0IG1lbW9TcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgbWVtb1NwYW4uY2xhc3NMaXN0LmFkZChcInRleHQtbWVtb1wiKTtcclxuXHJcbiAgICAgICAgaWYgKHRhc2tEYXRhW1wibWVtb1wiXSkge1xyXG4gICAgICAgICAgICAvLyBNZW1vIC0gQ3JlYXRlIFRleHROb2RlXHJcbiAgICAgICAgICAgIGNvbnN0IG1lbW9UZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGFza0RhdGFbXCJtZW1vXCJdKTtcclxuICAgICAgICAgICAgbWVtb1NwYW4uYXBwZW5kKG1lbW9UZXh0KTtcclxuXHJcbiAgICAgICAgICAgIC8vIGxpc3RDb21wb25lbnRTZWNvbmRCbG9jay5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxpc3RDb21wb25lbnRTZWNvbmRCbG9jay5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGlzdENvbXBvbmVudFNlY29uZEJsb2NrLmFwcGVuZENoaWxkKG1lbW9TcGFuKTtcclxuXHJcbiAgICAgICAgLy8gUHV0dGluZyBpdCBhbGwgdG9nZXRoZXIuLi5cclxuICAgICAgICBsaXN0Q29tcG9uZW50Rmlyc3RCbG9jay5hcHBlbmQocGluQ29tcG9uZW50LCBjaGVja2JveENvbXBvbmVudCwgZHVlRGF0ZUNvbXBvbmVudCwgZWxsaXBzaXNDb21wb25lbnQsIHN0aWNreUNvbG9yQ29tcG9uZW50KTtcclxuXHJcbiAgICAgICAgbGlzdENvbXBvbmVudC5hcHBlbmRDaGlsZChsaXN0Q29tcG9uZW50Rmlyc3RCbG9jayk7XHJcbiAgICAgICAgbGlzdENvbXBvbmVudC5hcHBlbmRDaGlsZChsaXN0Q29tcG9uZW50U2Vjb25kQmxvY2spO1xyXG5cclxuICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGxpc3RDb21wb25lbnQpO1xyXG5cclxuICAgICAgICByZXR1cm4gbGlzdENvbXBvbmVudDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQdWJsaWMgTWV0aG9kc1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBwb3B1bGF0ZUxpc3Q6IGZ1bmN0aW9uIChpdGVtcywgY29tcGxldGVkU3RhdHVzKSB7XHJcbiAgICAgICAgICAgIC8vICEhIFRlc3RpbmcgUmVxdWlyZWRcclxuXHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlIENvbXBsZXRlZCBTdGF0dXMgaXNcIiwgY29tcGxldGVkU3RhdHVzKTtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGlzIGNvbXBsZXRlZCBzdGF0dXMsIHBvcHVsYXRlIGZvciBib3RoIE1haW4gTGlzdCBhbmQgQ29tcGxldGVkIExpc3RcclxuICAgICAgICAgICAgaWYgKGNvbXBsZXRlZFN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgLy8gU2hvdyBjb21wbGV0ZWQgbGlzdFxyXG4gICAgICAgICAgICAgICAgVmlldy5zaG93Q29tcGxldGVkTGlzdCgpO1xyXG4gICAgICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0YXNrID0gcmVuZGVyKGl0ZW0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicG9wdWxhdGluZzpcIiwgdGFzayk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEZpbHRlciBNYWluIExpc3QgYW5kIENvbXBsZXRlZCBMaXN0XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uY29tcGxldGVkID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInBvcHVsYXRpbiBNYWluIGxpc3QuLi5cIilcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFwcGVuZCB0byBNYWluIExpc3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gPyBVc2UgXCJhcHBlbmRcIiBvciBcImFwcGVuZENoaWxkXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5tYWluTGlzdCkuYXBwZW5kQ2hpbGQoKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0ucGluKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLm1haW5MaXN0KS5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmJlZ2luXCIsIHRhc2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5tYWluTGlzdCkuYXBwZW5kKHRhc2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJwb3B1bGF0aW5nIENvbXBsZXRlZCBsaXN0Li4uXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFwcGVuZCB0byBDb21wbGV0ZWQgTGlzdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5waW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMuY29tcGxldGVkTGlzdCkuZmlyc3RFbGVtZW50Q2hpbGQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYWZ0ZXJlbmRcIiwgdGFzaylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMuY29tcGxldGVkTGlzdCkuYXBwZW5kKHRhc2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgVmlldy5oaWRlQ29tcGxldGVkTGlzdCgpO1xyXG4gICAgICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm8gQ29tcGxldGVkIExpc3QsIHBvcHVsYXRpbiBNYWluIGxpc3QuLi5cIilcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBBcHBlbmQgdG8gTWFpbiBMaXN0XHJcbiAgICAgICAgICAgICAgICAvLyA/IFVzZSBcImFwcGVuZFwiIG9yIFwiYXBwZW5kQ2hpbGRcIlxyXG4gICAgICAgICAgICAgICAgLy8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5tYWluTGlzdCkuYXBwZW5kQ2hpbGQoKVxyXG4gICAgICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0YXNrID0gcmVuZGVyKGl0ZW0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5waW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5tYWluTGlzdCkuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYWZ0ZXJiZWdpblwiLCB0YXNrKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLm1haW5MaXN0KS5hcHBlbmQodGFzayk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldFNlbGVjdG9yczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gVUlTZWxlY3RvcnM7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRFbGVtZW50czogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gVUlFbGVtZW50cztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldFF1aWNrVGFza0lucHV0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLnF1aWNrVGFza0lucHV0KS52YWx1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFkZFRhc2tUb01haW5MaXN0OiBmdW5jdGlvbiAobmV3VGFza0RhdGEpIHtcclxuICAgICAgICAgICAgLy8gQ3JlYXRlIGVsZW1lbnRzXHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1Rhc2sgPSByZW5kZXIobmV3VGFza0RhdGEpO1xyXG5cclxuICAgICAgICAgICAgLy8gSW5zZXJ0IG5ldyBsaXN0IGNvbXBvbmVudCB0byBET01cclxuICAgICAgICAgICAgLy8gbWFpbkxpc3QuYXBwZW5kQ2hpbGQobGlzdENvbXBvbmVudCk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMubWFpbkxpc3QpLmluc2VydEFkamFjZW50RWxlbWVudCgnYmVmb3JlZW5kJywgbmV3VGFzayk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZGRUYXNrVG9NYWluTGlzdFBpbm5lZDogZnVuY3Rpb24gKG5ld1Rhc2tEYXRhKSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBlbGVtZW50c1xyXG4gICAgICAgICAgICBjb25zdCBuZXdUYXNrID0gcmVuZGVyKG5ld1Rhc2tEYXRhKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEluc2VydCBuZXcgbGlzdCBjb21wb25lbnQgdG8gRE9NXHJcbiAgICAgICAgICAgIC8vIG1haW5MaXN0LmFwcGVuZENoaWxkKGxpc3RDb21wb25lbnQpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLm1haW5MaXN0KS5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2FmdGVyYmVnaW4nLCBuZXdUYXNrKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsZWFyUXVpY2tBZGRUYXNrSW5wdXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5xdWlja1Rhc2tJbnB1dCkudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaGlkZUNvbXBsZXRlZExpc3Q6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5jb21wbGV0ZWRMaXN0KS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzaG93Q29tcGxldGVkTGlzdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLmNvbXBsZXRlZExpc3QpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvcGVuRm9ybVRhc2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvcGVuIEZvcm0gVGFza1wiKTtcclxuXHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMub3ZlcmxheSkuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5hZGRGb3JtKS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xvc2VGb3JtVGFzazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNsb3NlIEZvcm0gVGFza1wiKTtcclxuXHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMub3ZlcmxheSkuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5hZGRGb3JtKS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xyXG5cclxuICAgICAgICAgICAgLy8gPyBDbGVhciAvIHJlc2V0IGlucHV0IGZpZWxkc1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0Rm9ybVRhc2tUYXNrSW5wdXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFVJRWxlbWVudHMuYWRkRm9ybVRhc2tJbnB1dC52YWx1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldEZvcm1UYXNrRGF0ZUlucHV0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBmb3JtYXREYXRlID0gVUlFbGVtZW50cy5hZGRGb3JtRGF0ZUlucHV0LnZhbHVlLnJlcGxhY2VBbGwoXCItXCIsIFwiL1wiKTtcclxuXHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGF0ZSBmb3JtYXRcIiwgZm9ybWF0RGF0ZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0RGF0ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldEZvcm1UYXNrTWVtb0lucHV0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBVSUVsZW1lbnRzLmFkZEZvcm1NZW1vSW5wdXQudmFsdWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRGb3JtVGFza1BpbkJvb2xlYW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFVJRWxlbWVudHMuYWRkRm9ybVBpbklucHV0LmNoZWNrZWQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRGb3JtVGFza0NvbG9yU2VsZWN0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBjb2xvclZhbHVlO1xyXG5cclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb2xvciBSZWQgaXNcIiwgVUlFbGVtZW50cy5hZGRGb3JtQ29sb3JJbnB1dFJlZC5jaGVja2VkKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb2xvciBZZWxsb3cgaXNcIiwgVUlFbGVtZW50cy5hZGRGb3JtQ29sb3JJbnB1dFllbGxvdy5jaGVja2VkKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb2xvciBCbHVlIGlzXCIsIFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXRCbHVlLmNoZWNrZWQpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImNvbG9yIEdyZWVuIGlzXCIsIFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXRHcmVlbi5jaGVja2VkKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb2xvciBOb25lIGlzXCIsIFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXROb25lLmNoZWNrZWQpO1xyXG5cclxuICAgICAgICAgICAgLy8gRmluZCBWYWx1ZVxyXG4gICAgICAgICAgICBpZiAoVUlFbGVtZW50cy5hZGRGb3JtQ29sb3JJbnB1dFJlZC5jaGVja2VkIHx8IFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXRZZWxsb3cuY2hlY2tlZCB8fCBVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0Qmx1ZS5jaGVja2VkIHx8IFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXRHcmVlbi5jaGVja2VkIHx8IFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXROb25lLmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0UmVkLmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSWYgLSByZWRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yVmFsdWUgPSBVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0UmVkLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0WWVsbG93LmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSWYgLSB5ZWxsb3dcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yVmFsdWUgPSBVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0WWVsbG93LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0Qmx1ZS5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklmIC0geWVsbG93XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb2xvclZhbHVlID0gVUlFbGVtZW50cy5hZGRGb3JtQ29sb3JJbnB1dEJsdWUudmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXRHcmVlbi5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklmIC0geWVsbG93XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb2xvclZhbHVlID0gVUlFbGVtZW50cy5hZGRGb3JtQ29sb3JJbnB1dEdyZWVuLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0Tm9uZS5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklmIC0gbm9uZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3JWYWx1ZSA9IFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXROb25lLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29sb3JWYWx1ZSA9IFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXROb25lLnZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb2xvclwiLCBjb2xvclZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb2xvclZhbHVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xlYXJGb3JtVGFza0ZpZWxkczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBVSUVsZW1lbnRzLmFkZEZvcm1UYXNrSW5wdXQudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgICBVSUVsZW1lbnRzLmFkZEZvcm1EYXRlSW5wdXQudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgICBVSUVsZW1lbnRzLmFkZEZvcm1NZW1vSW5wdXQudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgICBVSUVsZW1lbnRzLmFkZEZvcm1QaW5JbnB1dC5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXRSZWQuY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0WWVsbG93LmNoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgVUlFbGVtZW50cy5hZGRGb3JtQ29sb3JJbnB1dEJsdWUuY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0R3JlZW4uY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBVSUVsZW1lbnRzLmFkZEZvcm1Db2xvcklucHV0Tm9uZS5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZGRJdGVtdG9FZGl0VGFzazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyBTZXQgY3VycmVudCB0YXNrIGNvbXBvbmVudCdzIHZhbHVlcyB0byBcIkVkaXQgVGFza1wiIG1vZHVsZVxyXG4gICAgICAgICAgICBVSUVsZW1lbnRzLmVkaXRGb3JtVGFza0lucHV0LnZhbHVlID0gTW9kZWwuZ2V0Q3VycmVudEl0ZW0oKS50aXRsZTtcclxuICAgICAgICAgICAgVUlFbGVtZW50cy5lZGl0Rm9ybURhdGVJbnB1dC52YWx1ZSA9IE1vZGVsLmdldEN1cnJlbnRJdGVtKCkuZGF0ZTtcclxuICAgICAgICAgICAgVUlFbGVtZW50cy5lZGl0Rm9ybU1lbW9JbnB1dC52YWx1ZSA9IE1vZGVsLmdldEN1cnJlbnRJdGVtKCkubWVtbztcclxuICAgICAgICAgICAgVUlFbGVtZW50cy5lZGl0Rm9ybVBpbklucHV0LmNoZWNrZWQgPSBNb2RlbC5nZXRDdXJyZW50SXRlbSgpLnBpbjtcclxuXHJcbiAgICAgICAgICAgIC8vIFNldCBjb2xvciBmcm9tIHNlbGVjdGlvblxyXG4gICAgICAgICAgICBzd2l0Y2ggKE1vZGVsLmdldEN1cnJlbnRJdGVtKCkuY29sb3IpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJyZWRcIjpcclxuICAgICAgICAgICAgICAgICAgICBVSUVsZW1lbnRzLmVkaXRGb3JtQ29sb3JJbnB1dFJlZC5jaGVja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJ5ZWxsb3dcIjpcclxuICAgICAgICAgICAgICAgICAgICBVSUVsZW1lbnRzLmVkaXRGb3JtQ29sb3JJbnB1dFllbGxvdy5jaGVja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJibHVlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXRCbHVlLmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImdyZWVuXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXRHcmVlbi5jaGVja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXROb25lLmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBWaWV3Lm9wZW5FZGl0VGFzaygpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb3BlbkVkaXRUYXNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib3BlbiBFZGl0IFRhc2tcIik7XHJcblxyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLm92ZXJsYXkpLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMuZWRpdEZvcm0pLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbG9zZUVkaXRUYXNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2xvc2UgRWRpdCBUYXNrXCIpO1xyXG5cclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5vdmVybGF5KS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLmVkaXRGb3JtKS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xyXG5cclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldEVkaXRUYXNrVGFza0lucHV0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBVSUVsZW1lbnRzLmVkaXRGb3JtVGFza0lucHV0LnZhbHVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0RWRpdFRhc2tEYXRlSW5wdXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IGZvcm1hdERhdGUgPSBVSUVsZW1lbnRzLmVkaXRGb3JtRGF0ZUlucHV0LnZhbHVlLnJlcGxhY2VBbGwoXCItXCIsIFwiL1wiKTtcclxuXHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGF0ZSBmb3JtYXQgaW4gRWRpdCBUYXNrXCIsIGZvcm1hdERhdGUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZvcm1hdERhdGU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRFZGl0VGFza01lbW9JbnB1dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gVUlFbGVtZW50cy5lZGl0Rm9ybU1lbW9JbnB1dC52YWx1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldEVkaXRUYXNrUGluQm9vbGVhbjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gVUlFbGVtZW50cy5lZGl0Rm9ybVBpbklucHV0LmNoZWNrZWQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRFZGl0VGFza0NvbG9yU2VsZWN0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBjb2xvclZhbHVlO1xyXG5cclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDaGVja2luZyBpbiBFZGl0IFRhc2suLi5cIilcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDaGVja2luZyBpbiBFZGl0IFRhc2suLi5cIilcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb2xvciBSZWQgaXNcIiwgVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXRSZWQuY2hlY2tlZCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29sb3IgWWVsbG93IGlzXCIsIFVJRWxlbWVudHMuZWRpdEZvcm1Db2xvcklucHV0WWVsbG93LmNoZWNrZWQpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImNvbG9yIEJsdWUgaXNcIiwgVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXRCbHVlLmNoZWNrZWQpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImNvbG9yIEdyZWVuIGlzXCIsIFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXRHcmVlbi5jaGVja2VkKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb2xvciBOb25lIGlzXCIsIFVJRWxlbWVudHMuYWRkRm9ybUNvbG9ySW5wdXROb25lLmNoZWNrZWQpO1xyXG5cclxuICAgICAgICAgICAgLy8gRmluZCBWYWx1ZVxyXG4gICAgICAgICAgICBzd2l0Y2ggKFVJRWxlbWVudHMuZWRpdEZvcm1Db2xvcklucHV0UmVkLmNoZWNrZWQgfHwgVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXRZZWxsb3cuY2hlY2tlZCB8fCBVSUVsZW1lbnRzLmVkaXRGb3JtQ29sb3JJbnB1dEJsdWUuY2hlY2tlZCB8fCBVSUVsZW1lbnRzLmVkaXRGb3JtQ29sb3JJbnB1dEdyZWVuLmNoZWNrZWQgfHwgVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXROb25lLmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXRSZWQuY2hlY2tlZDpcclxuICAgICAgICAgICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3dpdGNoIC0gcmVkXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb2xvclZhbHVlID0gVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXRSZWQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFVJRWxlbWVudHMuZWRpdEZvcm1Db2xvcklucHV0WWVsbG93LmNoZWNrZWQ6XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlN3aXRjaCAtIHllbGxvd1wiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3JWYWx1ZSA9IFVJRWxlbWVudHMuZWRpdEZvcm1Db2xvcklucHV0WWVsbG93LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBVSUVsZW1lbnRzLmVkaXRGb3JtQ29sb3JJbnB1dEJsdWUuY2hlY2tlZDpcclxuICAgICAgICAgICAgICAgICAgICBjb2xvclZhbHVlID0gVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXRCbHVlLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBVSUVsZW1lbnRzLmVkaXRGb3JtQ29sb3JJbnB1dEdyZWVuLmNoZWNrZWQ6XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlN3aXRjaCAtIGdyZWVuXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb2xvclZhbHVlID0gVUlFbGVtZW50cy5lZGl0Rm9ybUNvbG9ySW5wdXRHcmVlbi52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlN3aXRjaCAtIGRlZmF1bHQgbm9uZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3JWYWx1ZSA9IFVJRWxlbWVudHMuZWRpdEZvcm1Db2xvcklucHV0Tm9uZS52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29sb3JcIiwgY29sb3JWYWx1ZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY29sb3JWYWx1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVwZGF0ZVRhc2tEaXNwbGF5RnJvbUVkaXRUYXNrOiBmdW5jdGlvbiAodXBkYXRlVGFza0RhdGEpIHtcclxuICAgICAgICAgICAgLy8gU2VhcmNoIGZvciB0YXJnZXRlZCBsaXN0IGNvbXBvbmVudFxyXG4gICAgICAgICAgICBsZXQgdGFza0NvbXBvbmVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFVJU2VsZWN0b3JzLmxpc3RDb21wb25lbnQpO1xyXG5cclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJMb29waW5nOlwiLCB0YXNrQ29tcG9uZW50cyk7XHJcblxyXG4gICAgICAgICAgICAvLyBUdXJuIE5vZGUgbGlzdCBpbnRvIGFycmF5XHJcbiAgICAgICAgICAgIHRhc2tDb21wb25lbnRzID0gQXJyYXkuZnJvbSh0YXNrQ29tcG9uZW50cyk7XHJcblxyXG4gICAgICAgICAgICB0YXNrQ29tcG9uZW50cy5mb3JFYWNoKCh0YXNrQ29tcG9uZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zdCB0YXNrSWQgPSB0YXNrQ29tcG9uZW50LmdldEF0dHJpYnV0ZSgnaWQnKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRhc2tJZCA9IHRhc2tDb21wb25lbnQuaWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicGFzcyBpZFwiLCB0YXNrSWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0YXNrSWQgPT0gdXBkYXRlVGFza0RhdGEuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGUgVUlcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50VGFza0NvbXBvbmVudFVJID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYCR7dGFza0lkfWApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGN1cnJlbnRUYXNrQ29tcG9uZW50VUkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidXNpbmcgZGF0YVwiLCB1cGRhdGVUYXNrRGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdEaXNwbGF5VGFza0NvbXBvbmVudCA9IHJlbmRlcih1cGRhdGVUYXNrRGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vICEhIFRlc3RpbmcgbmVlZGVkIGZvciBDb21wbGV0ZWQgVGFza3MgPj5cclxuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBuZXcgdGFzayBpcyBjb21wbGV0ZWRcclxuICAgICAgICAgICAgICAgICAgICBpZiAodXBkYXRlVGFza0RhdGEuY29tcGxldGVkID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgY29tcGxldGVkIHRhc2sgaXMgcGlubmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1cGRhdGVUYXNrRGF0YS5waW4gPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWRkIG5ldyBhbmQgdXBkYXRlIHRhc2sgY29tcG9uZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLmNvbXBsZXRlZExpc3QpLmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyYmVnaW5cIiwgbmV3RGlzcGxheVRhc2tDb21wb25lbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBvbGQgdGFzayBjb21wb25lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUYXNrQ29tcG9uZW50VUkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBZGQgbmV3IGFuZCB1cGRhdGUgdGFzayBjb21wb25lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGN1cnJlbnRUYXNrQ29tcG9uZW50VUkuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYWZ0ZXJlbmRcIixuZXdEaXNwbGF5VGFza0NvbXBvbmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VGFza0NvbXBvbmVudFVJLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0Rpc3BsYXlUYXNrQ29tcG9uZW50LCBjdXJyZW50VGFza0NvbXBvbmVudFVJKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICEhIDw8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB1bmNvbXBsZXRlZCB0YXNrIGlzIHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVwZGF0ZVRhc2tEYXRhLnBpbiA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB1bmNvbXBsZXRlZCB0YXNrIGlzIHBpbm5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5tYWluTGlzdCkuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYWZ0ZXJiZWdpblwiLCBuZXdEaXNwbGF5VGFza0NvbXBvbmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIG9sZCB0YXNrIGNvbXBvbmVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFRhc2tDb21wb25lbnRVSS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFkZCBuZXcgYW5kIHVwZGF0ZSB0YXNrIGNvbXBvbmVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFRhc2tDb21wb25lbnRVSS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdEaXNwbGF5VGFza0NvbXBvbmVudCwgY3VycmVudFRhc2tDb21wb25lbnRVSSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIFZpZXcuY2xvc2VFZGl0VGFzaygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVsZXRlVGFza0Rpc3BsYXlGcm9tRWRpdFRhc2s6IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgICAgICAvLyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbaWQ9XCIke2lkfVwiXWApLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgICAgICBWaWV3LmNsb3NlRWRpdFRhc2soKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9wZW5DbGVhckxpc3RNZW51OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMub3ZlcmxheSkuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5jbGVhckxpc3RNZW51KS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xvc2VDbGVhckxpc3RNZW51OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMub3ZlcmxheSkuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5jbGVhckxpc3RNZW51KS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xlYXJMaXN0czogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsZXQgbWFpbkxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLm1haW5MaXN0KTtcclxuICAgICAgICAgICAgY29uc3QgY29tcGxldGVkTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMuY29tcGxldGVkTGlzdCk7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAobWFpbkxpc3QuZmlyc3RDaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgbWFpbkxpc3QucmVtb3ZlQ2hpbGQobWFpbkxpc3QuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChjb21wbGV0ZWRMaXN0LmZpcnN0Q2hpbGQpIHtcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlZExpc3QucmVtb3ZlQ2hpbGQoY29tcGxldGVkTGlzdC5maXJzdENoaWxkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTtcclxuXHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIEFwcCBDb250cm9sbGVyIHx8IENvbnRyb2xsZXJcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyAtIG1haW4gY29udHJvbGxlclxyXG4vLyAtIFdoZXJlIGV2ZXJ5dGhpbmcgd2lsbCBtZWV0XHJcbi8vIC0gaW5pdGlhbCBldmVudCBsaXN0ZW5lcnNcclxuLy8gLSBpbml0IGZ1bmN0aW9uXHJcbmNvbnN0IENvbnRyb2xsZXIgPSAoZnVuY3Rpb24gKE1vZGVsLCBWaWV3LCBTdG9yYWdlKSB7XHJcbiAgICAvLyBMb2FkIEV2ZW50IExpc3RlbmVyc1xyXG4gICAgY29uc3QgbG9hZEV2ZW50TGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIEdldCBVSSBzZWxlY3RvcnNcclxuICAgICAgICBjb25zdCBVSVNlbGVjdG9ycyA9IFZpZXcuZ2V0U2VsZWN0b3JzKCk7XHJcbiAgICAgICAgY29uc3QgVUlFbGVtZW50cyA9IFZpZXcuZ2V0RWxlbWVudHMoKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIFF1aWNrIFwiQWRkIFRhc2tcIiBldmVudCAtIFN1Ym1pdCBpbnB1dFxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMucXVpY2tUYXNrQnRuKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcXVpY2tBZGRUYXNrU3VibWl0KTtcclxuXHJcbiAgICAgICAgLy8gQWRkIFwiRm9ybSBUYXNrXCIgZXZlbnQgLSBPcGVuIFwiRm9ybSBUYXNrXCIgbW9kdWxlXHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy5hZGRGb3JtT3BlbmJ0bikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIFZpZXcub3BlbkZvcm1UYXNrKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIFwiRm9ybSBUYXNrXCIgQ2FuY2VsIGJ1dHRvbiBldmVudCAtIENsb3NlIFwiRm9ybSBUYXNrXCIgbW9kdWxlXHJcbiAgICAgICAgVUlFbGVtZW50cy5hZGRGb3JtQ2FuY2VsQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBWaWV3LmNsb3NlRm9ybVRhc2spO1xyXG5cclxuICAgICAgICAvLyBBZGQgXCJGb3JtIFRhc2tcIiBldmVudCAtIFN1Ym1pdCBpbnB1dHNcclxuICAgICAgICBVSUVsZW1lbnRzLmFkZEZvcm1TdWJtaXRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZvcm1UYXNrU3VibWl0KTtcclxuXHJcbiAgICAgICAgLy8gQWRkIHRhc2sgY29tcG9uZW50IGVsbGlwc2lzIC0gT3BlbiBcIkVkaXQgVGFza1wiIG1vZHVsZVxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoVUlTZWxlY3RvcnMud2hvbGVMaXN0cykuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsaWNrZWRFZGl0VGFzayk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBcIkVkaXQgVGFza1wiIFVwZGF0ZSBidXR0b24gZXZlbnQgLSBTdWJtaXQgaW5wdXRzXHJcbiAgICAgICAgVUlFbGVtZW50cy5lZGl0Rm9ybVVwZGF0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZWRpdFRhc2tTdWJtaXQpO1xyXG5cclxuICAgICAgICAvLyBBZGQgXCJFZGl0IFRhc2tcIiBDYW5jZWwgYnV0dG9uIGV2ZW50IC0gQ2xvc2UgXCJFZGl0IFRhc2tcIiBtb2R1bGVcclxuICAgICAgICBVSUVsZW1lbnRzLmVkaXRGb3JtQ2FuY2VsQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBWaWV3LmNsb3NlRWRpdFRhc2spO1xyXG5cclxuICAgICAgICAvLyBBZGQgXCJFZGl0IFRhc2tcIiBEZWxldGUgYnV0dG9uIGV2ZW50IC0gRGVsZXRlIHRhc2sgY29tcG9uZW50XHJcbiAgICAgICAgVUlFbGVtZW50cy5lZGl0Rm9ybURlbGV0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZWRpdFRhc2tEZWxldGVTdWJtaXQpO1xyXG5cclxuICAgICAgICAvLyBBZGQgY2hlY2tib3ggZXZlbnQgLSBVcGRhdGUgZGF0YSB3aGVuIGNoZWNrZWQgb3IgdW5jaGVja2VkXHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihVSVNlbGVjdG9ycy53aG9sZUxpc3RzKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2hlY2tlZFRhc2tBbmRVcGF0ZURhdGEpO1xyXG5cclxuICAgICAgICAvLyBBZGQgXCJDbGVhciBMaXN0XCIgZXZlbnQgLSBPcGVuIFwiQ2xlYXIgTGlzdFwiIE1lbnVcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLm9wZW5DbGVhckxpc3RNZW51QnRuKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgVmlldy5vcGVuQ2xlYXJMaXN0TWVudSk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBcIkNsZWFyIExpc3RcIiBldmVudCAtIENsb3NlIFwiQ2xlYXIgTGlzdFwiIE1lbnVcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLmRlbGV0ZUNhbmNlbEJ0bikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIFZpZXcuY2xvc2VDbGVhckxpc3RNZW51KTtcclxuXHJcbiAgICAgICAgLy8gQWRkIFwiQ2xlYXIgTGlzdFwiIGV2ZW50IC0gQ2xlYXIgTWFpbiBhbmQgQ29tcGxldGVkIExpc3RcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVJU2VsZWN0b3JzLmRlbGV0ZUNvbmZpcm1CdG4pLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGVhckxpc3RzKTtcclxuXHJcblxyXG5cclxuICAgICAgICAvLyBEaXNhYmxlIHN1Ym1pdCBvbiBcIkVudGVyXCIga2V5IGZvciBcIkZvcm0gVGFza1wiIGFuZCBcIkVkaXQgVGFza1wiIElucHV0c1xyXG4gICAgICAgIC8vIE90aGVyd2lzZSwgY2F0YXN0cm9waGUgbWF5IGZvbGxvd1xyXG4gICAgICAgIC8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgLy8gICAgIGlmIChlLmtleUNvZGUgPT09IDEzIHx8IGUud2hpY2ggPT09IDEzKSB7XHJcbiAgICAgICAgLy8gICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIC8vICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBBZGQgUXVpY2sgXCJBZGQgVGFza1wiIHN1Ym1pdFxyXG4gICAgY29uc3QgcXVpY2tBZGRUYXNrU3VibWl0ID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiUXVpY2sgQWRkIFRhc2tcIilcclxuXHJcbiAgICAgICAgLy8gR2V0IGlucHV0IHZhbHVlXHJcbiAgICAgICAgY29uc3QgaW5wdXQgPSBWaWV3LmdldFF1aWNrVGFza0lucHV0KCk7XHJcblxyXG4gICAgICAgIC8vIFZhbGlkYXRlXHJcbiAgICAgICAgLy8gPyBTdWdnZXN0aW9uczogVXNlIFJlZ0V4cFxyXG4gICAgICAgIGlmIChpbnB1dCAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlF1aWNrIEFkZCBUYXNrOiBWYWxpZGF0aW5nXCIpXHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgaW5wdXQgdmFsdWUgdG8gRGF0YSwgYW5kXHJcbiAgICAgICAgICAgIC8vIEdldCBkZWZhdWx0IGRhdGEgc2V0dXAgZm9yIFVJXHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1Rhc2tEYXRhID0gTW9kZWwuYWRkUXVpY2tUYXNrKGlucHV0KTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBuZXcgdGFzayB0byBVSSBsaXN0XHJcbiAgICAgICAgICAgIFZpZXcuYWRkVGFza1RvTWFpbkxpc3QobmV3VGFza0RhdGEpO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIHRvIExTXHJcbiAgICAgICAgICAgIFN0b3JhZ2UuYWRkSXRlbShuZXdUYXNrRGF0YSk7XHJcblxyXG4gICAgICAgICAgICAvLyBDbGVhciBpbnB1dCBmaWVsZFxyXG4gICAgICAgICAgICBWaWV3LmNsZWFyUXVpY2tBZGRUYXNrSW5wdXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgY29uc29sZS5sb2coaW5wdXQpO1xyXG5cclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEFkZCBcIkZvcm0gVGFza1wiIFN1Ym1pdFxyXG4gICAgY29uc3QgZm9ybVRhc2tTdWJtaXQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJGb3JtIFRhc2sgLSBBZGQgQ3VzdG9taXNlZCBUYXNrXCIpO1xyXG5cclxuICAgICAgICAvLyBHZXQgVmFsdWVzXHJcbiAgICAgICAgY29uc3QgdGFza0lucHV0ID0gVmlldy5nZXRGb3JtVGFza1Rhc2tJbnB1dCgpO1xyXG4gICAgICAgIGNvbnN0IGRhdGVJbnB1dCA9IFZpZXcuZ2V0Rm9ybVRhc2tEYXRlSW5wdXQoKTtcclxuICAgICAgICBjb25zdCBtZW1vSW5wdXQgPSBWaWV3LmdldEZvcm1UYXNrTWVtb0lucHV0KCk7XHJcbiAgICAgICAgY29uc3QgcGluQm9vbGVhbiA9IFZpZXcuZ2V0Rm9ybVRhc2tQaW5Cb29sZWFuKCk7XHJcbiAgICAgICAgY29uc3QgY29sb3JTZWxlY3QgPSBWaWV3LmdldEZvcm1UYXNrQ29sb3JTZWxlY3QoKTtcclxuXHJcblxyXG4gICAgICAgIC8vIFZhbGlkYXRlXHJcbiAgICAgICAgLy8gPyBTdWdnZXN0aW9uczogVXNlIFJlZ0V4cFxyXG4gICAgICAgIGlmICh0YXNrSW5wdXQgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJGb3JtIFRhc2s6IFZhbGlkYXRpbmdcIilcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBpbnB1dCB2YWx1ZSB0byBEYXRhLCBhbmRcclxuICAgICAgICAgICAgLy8gR2V0IGRlZmF1bHQgZGF0YSBzZXR1cCBmb3IgVUlcclxuICAgICAgICAgICAgY29uc3QgbmV3VGFza0RhdGEgPSBNb2RlbC5hZGRGb3JtVGFzayh0YXNrSW5wdXQsIGRhdGVJbnB1dCwgbWVtb0lucHV0LCBwaW5Cb29sZWFuLCBjb2xvclNlbGVjdCk7XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgbmV3IHRhc2sgdG8gVUkgbGlzdFxyXG4gICAgICAgICAgICAvLyBJZiBwaW5Cb29sZWFuIGlzIHRydWUsIFBpbiB0byB0aGUgVG9wXHJcbiAgICAgICAgICAgIGlmIChwaW5Cb29sZWFuKSB7XHJcbiAgICAgICAgICAgICAgICBWaWV3LmFkZFRhc2tUb01haW5MaXN0UGlubmVkKG5ld1Rhc2tEYXRhKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIFZpZXcuYWRkVGFza1RvTWFpbkxpc3QobmV3VGFza0RhdGEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgdG8gTFNcclxuICAgICAgICAgICAgU3RvcmFnZS5hZGRJdGVtKG5ld1Rhc2tEYXRhKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENsZWFyIGFsbCBcIkZvcm0gVGFza1wiIGZpZWxkc1xyXG4gICAgICAgICAgICBWaWV3LmNsZWFyRm9ybVRhc2tGaWVsZHMoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENsb3NlIFwiRm9ybSBUYXNrXCIgbW9kdWxlXHJcbiAgICAgICAgICAgIFZpZXcuY2xvc2VGb3JtVGFzaygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBPcGVuIGFuZCBzZXQgXCJFZGl0IFRhc2tcIiBtb2R1bGVcclxuICAgIGNvbnN0IGNsaWNrZWRFZGl0VGFzayA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgLy8gdXNlIGV2ZW50IGRlbGVnYXRpb24gdmlhIGUudGFyZ2V0IHRvIGZpbmQgZWxlbWVudFxyXG4gICAgICAgIC8vIHRyYXZlcnNlIHRoZSBET00gdG8gZmluZCBpZFxyXG4gICAgICAgIC8vIGdldCBjdXJyZW50IHRhc2sgZGF0YSB0byBlZGl0IHZpYSBNb2RlbC5nZXRJdGVtQnlJZFxyXG4gICAgICAgIC8vIC0gSXQgc2hvdWxkIGJlIGFuIG9iamVjdFxyXG4gICAgICAgIC8vIFNldCBjdXJyZW50IGl0ZW0gdmlhIE1vZGVsLnNldEN1cnJlbnRJdGVtXHJcbiAgICAgICAgLy8gLSBzZXQgZGF0YSAnY3VycmVudEl0ZW0nIGFzIGFib3ZlIGxpbmVcclxuICAgICAgICAvLyBBZCBpdGVtIHRvIGZvcm0gdmlhIFZpZXcuYWRkSXRlbVRvRm9ybSgpXHJcbiAgICAgICAgLy8gLSBncmFiIHZhbHVlc1xyXG4gICAgICAgIC8vICAgICAtIGdyYWIgJ2N1cnJlbnRJdGVtJyBhbmQgc2V0IGl0IGluIFZpZXdcclxuICAgICAgICAvLyAgICAgLSBDcmVhdGUgTW9kZWwuZ2V0Q3VycmVudEl0ZW0gZnVuY3Rpb25cclxuXHJcbiAgICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImVsbGlwc2VzX193cmFwcGVyXCIpKSB7XHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRWRpdCBDbGlja2VkIVwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0YXNrIGNvbXBvbmVudCBpZFxyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50VGFza0lkID0gZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLmlkO1xyXG5cclxuICAgICAgICAgICAgLy8gISBMb2dcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjdXJyZW50IHRhc2sgSURcIiwgY3VycmVudFRhc2tJZCk7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgdGFzayBjb21wb25lbnQgaWQgZnJvbSBEYXRhXHJcbiAgICAgICAgICAgIGNvbnN0IFRhc2t0b0VkaXREYXRhID0gTW9kZWwuZ2V0VGFza0J5SWQoY3VycmVudFRhc2tJZCk7XHJcblxyXG4gICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhUYXNrdG9FZGl0RGF0YSk7XHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgdGFzayBjb21wb25lbnQgYXMgXCJjdXJyZW50SXRlbVwiIGkuZS4gbWFrZXMgbG9jYXRpbmcgaXQgZWFzaWVyIGFuZCBldGMuXHJcbiAgICAgICAgICAgIC8vIC4uLiBhbmQgZWRpdGluZyBwdXJwb3NlXHJcbiAgICAgICAgICAgIE1vZGVsLnNldEN1cnJlbnRUYXNrKFRhc2t0b0VkaXREYXRhKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBjdXJyZW50IHRhc2sgY29tcG9uZW50IGRhdGEgdG8gXCJFZGl0IFRhc2tcIiBGb3JtIHRvIGRpc3BsYXlcclxuICAgICAgICAgICAgVmlldy5hZGRJdGVtdG9FZGl0VGFzaygpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIHRvZG9cclxuICAgIC8vIFVwZGF0ZSBcIkVkaXQgVGFza1wiIFN1Ym1pdFxyXG4gICAgY29uc3QgZWRpdFRhc2tTdWJtaXQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgLy8gISBMb2dcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlVwZGF0aW5nIVwiKTtcclxuXHJcbiAgICAgICAgLy8gISBXSVAgPj5cclxuICAgICAgICAvLyAtIENyZWF0ZSBmb2xsb3dpbmcgVmlldyBtZXRob2RzXHJcbiAgICAgICAgLy8gLSBDcmVhdGUgZm9sbG93aW5nIE1vZGVsIG1ldGhvXHJcblxyXG4gICAgICAgIC8vIGd1aWRlIGZyb20gQnJhZCBUXHJcbiAgICAgICAgLy8gaHR0cHM6Ly93d3cudWRlbXkuY29tL2NvdXJzZS9tb2Rlcm4tamF2YXNjcmlwdC1mcm9tLXRoZS1iZWdpbm5pbmcvbGVhcm4vbGVjdHVyZS84NzYyNTU4I292ZXJ2aWV3XHJcblxyXG4gICAgICAgIC8vIEdldCBFZGl0IFRhc2sgSW5wdXRzIGFuZCBWYWx1ZXNcclxuICAgICAgICBjb25zdCB0YXNrSW5wdXQgPSBWaWV3LmdldEVkaXRUYXNrVGFza0lucHV0KCk7XHJcbiAgICAgICAgY29uc3QgZGF0ZUlucHV0ID0gVmlldy5nZXRFZGl0VGFza0RhdGVJbnB1dCgpO1xyXG4gICAgICAgIGNvbnN0IG1lbW9JbnB1dCA9IFZpZXcuZ2V0RWRpdFRhc2tNZW1vSW5wdXQoKTtcclxuICAgICAgICBjb25zdCBwaW5Cb29sZWFuID0gVmlldy5nZXRFZGl0VGFza1BpbkJvb2xlYW4oKTtcclxuICAgICAgICBjb25zdCBjb2xvclNlbGVjdCA9IFZpZXcuZ2V0RWRpdFRhc2tDb2xvclNlbGVjdCgpO1xyXG5cclxuICAgICAgICAvLyA/IFJlbmFtZSBjb25zdCB2YXJpYWJsZVxyXG4gICAgICAgIC8vIFVwZGF0ZSBjb21wb25lbnQgdGFzayBpbiBkYXRhXHJcbiAgICAgICAgY29uc3QgdXBkYXRlVGFza0RhdGEgPSBNb2RlbC51cGRhdGVEYXRhRnJvbUVkaXRUYXNrKHRhc2tJbnB1dCwgZGF0ZUlucHV0LCBtZW1vSW5wdXQsIHBpbkJvb2xlYW4sIGNvbG9yU2VsZWN0KTtcclxuXHJcbiAgICAgICAgLy8gISBMb2dcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm5ldyBVcGRhdGUgZGF0YSBhcHBsaWVkIHRvIGRhdGFiYXNlXCIsIHVwZGF0ZVRhc2tEYXRhKVxyXG5cclxuICAgICAgICAvLyBVcGRhdGUgaXRlbSBMU1xyXG4gICAgICAgIFN0b3JhZ2UudXBkYXRlSXRlbSh1cGRhdGVUYXNrRGF0YSk7XHJcblxyXG4gICAgICAgIC8vIFVwZGF0ZSBVSVxyXG4gICAgICAgIFZpZXcudXBkYXRlVGFza0Rpc3BsYXlGcm9tRWRpdFRhc2sodXBkYXRlVGFza0RhdGEpO1xyXG5cclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIERlbGV0ZSBidXR0b24gb2YgXCJFZGl0IFRhc2tcIiBtb2R1bGVcclxuICAgIGNvbnN0IGVkaXRUYXNrRGVsZXRlU3VibWl0ID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAvLyBHZXQgY3VycmVudCB0YXNrIGNvbXBvbmVudFxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRUYXNrID0gTW9kZWwuZ2V0Q3VycmVudEl0ZW0oKTtcclxuXHJcbiAgICAgICAgLy8gISBMb2dcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkF0dGVtcHRpbmcgdG8gZGVsZXRlXCIsIGN1cnJlbnRUYXNrKTtcclxuXHJcbiAgICAgICAgLy8gRGVsZXRlIGZyb20gZGF0YSBzdHJ1Y3R1cmVcclxuICAgICAgICBNb2RlbC5kZWxldGVJdGVtKGN1cnJlbnRUYXNrLmlkKTtcclxuXHJcbiAgICAgICAgLy8gRGVsZXRlIGl0ZW0gTFNcclxuICAgICAgICBTdG9yYWdlLmRlbGV0ZUl0ZW0oY3VycmVudFRhc2suaWQpO1xyXG5cclxuICAgICAgICAvLyBEZWxldGUgZnJvbSBVSVxyXG4gICAgICAgIFZpZXcuZGVsZXRlVGFza0Rpc3BsYXlGcm9tRWRpdFRhc2soY3VycmVudFRhc2suaWQpO1xyXG5cclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSWYgYSB0YXNrIGlzIFVOQ0hFQ0ssIHVwZGF0ZSBkYXRhIGFuZCBVSVxyXG4gICAgY29uc3QgY2hlY2tlZFRhc2tBbmRVcGF0ZURhdGEgPSBmdW5jdGlvbiAoZSkge1xyXG5cclxuICAgICAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiY2hlY2tcIikpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJjbGlja2VkIG9uOlwiLCBlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJjaGVja1wiKSk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGUudGFyZ2V0KTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZS50YXJnZXQuY2hlY2tlZCk7XHJcbiAgICAgICAgICAgIC8vIGNvbnN0IGNoZWNrYm94ID0gZS50YXJnZXQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgY29tcGxldGVkU3RhdHVzID0gZS50YXJnZXQuY2hlY2tlZDtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coY29tcGxldGVkU3RhdHVzKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0YXNrIGNvbXBvbmVudCBpZFxyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50VGFza0lkID0gZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUuaWQ7XHJcblxyXG4gICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImN1cnJlbnQgdGFzayBJRFwiLCBjdXJyZW50VGFza0lkKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0YXNrIGNvbXBvbmVudCBpZCBmcm9tIERhdGFcclxuICAgICAgICAgICAgY29uc3QgVGFza3RvRWRpdERhdGEgPSBNb2RlbC5nZXRUYXNrQnlJZChjdXJyZW50VGFza0lkKTtcclxuXHJcbiAgICAgICAgICAgIC8vICEgTG9nXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFRhc2t0b0VkaXREYXRhKTtcclxuXHJcbiAgICAgICAgICAgIE1vZGVsLnNldEN1cnJlbnRUYXNrKFRhc2t0b0VkaXREYXRhKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZVRhc2tEYXRhID0gTW9kZWwudXBkYXRlQ3VycmVudFRhc2tDaGVja2VkRGF0YShjb21wbGV0ZWRTdGF0dXMpO1xyXG5cclxuICAgICAgICAgICAgLy8gVXBkYXRlIGl0ZW0gTFNcclxuICAgICAgICAgICAgU3RvcmFnZS51cGRhdGVJdGVtKHVwZGF0ZVRhc2tEYXRhKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb21wbGV0ZWRTdGF0dXMgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0YXNrIGRhdGEgY2hhbmdlIHRvIENPTVBMRVRFLi4uXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIERvIE5PVCB1cGRhdGUgVUlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidGFzayBkYXRhIGNoYW5nZSB0byBVTkNPTVBMRVRFLi4uXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gRmV0Y2ggaXRlbXMgZnJvbSBkYXRhIHN0cnVjdHVyZVxyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbXMgPSBNb2RlbC5nZXRJdGVtcygpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZXJlIGlzIGFueSBcImNvbXBsZXRlZFwiIHRhc2sgZXF1YWwgJ3RydWUnXHJcbiAgICAgICAgICAgICAgICBsZXQgY29tcGxldGVkU3RhdHVzID0gZmluZENvbXBsZXRlZFN0YXR1cyhpdGVtcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVXBkYXRlIFVJXHJcbiAgICAgICAgICAgICAgICAvLyBDbGVhciBVSVxyXG4gICAgICAgICAgICAgICAgVmlldy5jbGVhckxpc3RzKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy90b2RvIC0gYm9va21hcmtcclxuICAgICAgICAgICAgICAgIC8vIFB1c2ggVU5DSEVDSyB0YXNrIHRvIE1haW4gTGlzdCAtIGJhc2ljYWxseSBhIHBhZ2UgcmVmcmVzaFxyXG4gICAgICAgICAgICAgICAgLy8gc2V0VGltZW91dChWaWV3LnBvcHVsYXRlTGlzdChpdGVtcywgY29tcGxldGVkU3RhdHVzKSwgMjAwMDApO1xyXG4gICAgICAgICAgICAgICAgVmlldy5wb3B1bGF0ZUxpc3QoaXRlbXMsIGNvbXBsZXRlZFN0YXR1cylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBDbGVhciBMaXN0cyBEYXRhIGFuZCBVSVxyXG4gICAgY29uc3QgY2xlYXJMaXN0cyA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgLy8gQ2xlYXIgTFNcclxuICAgICAgICBTdG9yYWdlLmNsZWFySXRlbXMoKTtcclxuXHJcbiAgICAgICAgLy8gQ2xlYXIgTGlzdHMgVUlcclxuICAgICAgICBWaWV3LmNsZWFyTGlzdHMoKTtcclxuICAgICAgICBWaWV3LmNsb3NlQ2xlYXJMaXN0TWVudSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEZpbmQgaWYgYW55IHRhc2sgY29tcG9uZW50IGRhdGEgKGl0ZW0pIGlzIENvbXBsZXRlZFxyXG4gICAgY29uc3QgZmluZENvbXBsZXRlZFN0YXR1cyA9IGZ1bmN0aW9uIChpdGVtcykge1xyXG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xyXG4gICAgICAgICAgICAvLyAhIExvZ1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlRoZSBjdXJyZW50IHByb3BlcnR5IHN0YXR1cyBpc1wiLCBpdGVtW1wiY29tcGxldGVkXCJdKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpdGVtW1wiY29tcGxldGVkXCJdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHVibGljIE1ldGhvZHNcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkluaXRpYWxpc2luZyBBcHAuLi5cIilcclxuXHJcbiAgICAgICAgICAgIC8vIEZldGNoIGl0ZW1zIGZyb20gZGF0YSBzdHJ1Y3R1cmVcclxuICAgICAgICAgICAgY29uc3QgaXRlbXMgPSBNb2RlbC5nZXRJdGVtcygpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlcmUgaXMgYW55IFwiY29tcGxldGVkXCIgdGFzayBlcXVhbCAndHJ1ZSdcclxuICAgICAgICAgICAgbGV0IGNvbXBsZXRlZFN0YXR1cyA9IGZpbmRDb21wbGV0ZWRTdGF0dXMoaXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgLy8gUG9wdWxhdGUgTGlzdFxyXG4gICAgICAgICAgICBWaWV3LnBvcHVsYXRlTGlzdChpdGVtcywgY29tcGxldGVkU3RhdHVzKTtcclxuXHJcbiAgICAgICAgICAgIC8vIExvYWQgZXZlbnQgbGlzdGVuZXJzXHJcbiAgICAgICAgICAgIGxvYWRFdmVudExpc3RlbmVycygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoTW9kZWwsIFZpZXcsIFN0b3JhZ2UpO1xyXG5cclxuLy8gSW5pdGlhbGlzZSBBcHBcclxuQ29udHJvbGxlci5pbml0KCk7XHJcbiJdfQ==
