// Model - View - Controller (MVC) Pattern used + StorageCtrl with LocalStorage interactions

// todo
// Clean Code and comments


function getUniqueId() {
    if (window.crypto && window.crypto.getRandomValues) {
        return window.crypto.getRandomValues(new Uint32Array(1))[0];
    } else {
        return Math.random()
    }
}


// ==================
// Storage Controller
// ==================
// - Local Storage
// NB: "item" may also be referred to data from LocalStorage
const Storage = (function () {

    // Public methods
    return {
        addItem: function (newTaskData) {
            // ! Log
            console.log("persisting to LS...")
            let items;

            // Check for available item in LS
            if (localStorage.getItem("tasks") === null) {
                items = [];

                // Push new item
                items.push(newTaskData);

                // ! Log
                console.log("Creating new Storage 'tasks'");

                // Set LS
                localStorage.setItem("tasks", JSON.stringify(items));
            } else {
                // Get available item in LS
                items = JSON.parse(localStorage.getItem("tasks"));

                // ! Log
                console.log("Getting available Storage: ", items);

                // Push new item
                items.push(newTaskData);

                // Re-Set LS
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
            })

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
    }
})();


// =====
// Model
// =====
// - Local Data
const Model = (function () {
    // Model Constructor
    const ModelConstructor = function (id = getUniqueId(), title, date = "", memo = "", pin = false, color = "none", completed = false) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.memo = memo;
        this.pin = pin;
        this.color = color;
        this.completed = completed;
    };

    // Data Structure
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
        currentItem: null,
    }

    // Public Methods
    return {
        logData: function () {
            return data;
        },
        getItems: function () {
            return data.items;
        },
        addQuickTask: function (quickTaskInput) {
            // ! Log
            console.log(quickTaskInput);

            // Create new task
            const newTaskData = new ModelConstructor(undefined, quickTaskInput);

            // ! Log
            console.log(newTaskData);

            // Add to items Array
            data.items.push(newTaskData);

            return newTaskData;
        },
        addFormTask: function (taskInput, dateInput, memoInput, pinBoolean, colorSelect) {
            // ! Log
            console.log(taskInput, dateInput, memoInput, pinBoolean, colorSelect);

            // Create new task
            const newTaskData = new ModelConstructor(undefined, taskInput, dateInput, memoInput, pinBoolean, colorSelect);

            // ! Log
            console.log(newTaskData);

            // Add to items Array
            data.items.push(newTaskData);

            return newTaskData;
        },
        getTaskById: function (id) {
            let targetTaskData = null;

            // Loop through items
            data.items.forEach(function (item) {
                if (item.id == id) {
                    targetTaskData = item;
                }
            });

            // ! Log
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
            })

            return targetTaskData;
        },
        updateCurrentTaskCheckedData: function (completedStatus) {
            let targetTaskData = null;

            data.items.forEach(function (item) {
                if (item.id == data.currentItem.id) {

                    // Set property "completed" to `true`
                    item.completed = completedStatus;

                    // ! Log
                    console.log("Current task complete is", item.completed)

                    targetTaskData = item;
                }
            })

            return targetTaskData;
        },
        deleteItem: function (id) {
            // ! Log
            console.log("Deleting data...")

            // Get an Array of ids
            const ids = data.items.map(function (item) {
                return item.id;
            });

            // Get index of target task component id
            const index = ids.indexOf(id);

            // Remove item
            data.items.splice(index, 1);
        }
    }
})();


// ====
// View
// ====
// - Anything to do with the UI
const View = (function () {
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
    }

    // UI element
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
    }

    const render = function (taskData) {
        const listComponent = document.createElement("div");
        listComponent.classList.add("list-component");

        // Add Unique ID
        listComponent.id = taskData["id"];

        // ! Log
        console.log(listComponent.id);

        // List Component - First Block
        const listComponentFirstBlock = document.createElement("div");
        listComponentFirstBlock.classList.add("list-component__first-block");

        // List Component - First Block - Components
        // Pin to the Top
        const pinComponent = document.createElement("div");
        pinComponent.classList.add("pin__wrapper");
        const pinIcon = document.createElement("i");
        pinIcon.classList.add("fa", "fa-thumb-tack");

        if (!taskData["pin"]) {
            pinIcon.classList.add("invisible")
        }

        pinIcon.setAttribute("aria-hidden", "true");

        pinComponent.appendChild(pinIcon);

        // Checkbox
        const checkboxComponent = document.createElement("label");
        checkboxComponent.classList.add("checkbox");
        // checkboxComponent.setAttribute("for", "check");

        // Checkbox - Icon
        const checkboxIcon = document.createElement("input");
        checkboxIcon.id = "check";
        checkboxIcon.type = "checkbox";
        checkboxIcon.checked = taskData["completed"];
        checkboxIcon.classList.add("check");

        // ! Log
        console.log("CheckboxIcon", checkboxIcon.checked);

        // Checkbox - Label
        const checkboxLabel = document.createElement("span");
        checkboxLabel.classList.add("text-label");

        // Checkbox - Label - Create TextNode
        const checkboxLabelText = document.createTextNode(taskData["title"]);
        checkboxLabel.append(checkboxLabelText);

        // ! Log
        console.log("rendering label:", checkboxLabel);
        console.log("rendering label text:", checkboxLabelText);
        console.log("rendering label text data:", taskData["title"]);

        checkboxComponent.appendChild(checkboxIcon);
        checkboxComponent.appendChild(checkboxLabel);

        // Due Date
        const dueDateComponent = document.createElement("div");
        dueDateComponent.classList.add("due-date");

        // Due Date - Span Element
        const dueDateSpan = document.createElement("span");
        dueDateSpan.classList.add("text-date");

        if (taskData["date"]) {
            // Due Date - Create TextNode
            const dueDateText = document.createTextNode(taskData["date"]);
            dueDateSpan.append(dueDateText);
        }

        dueDateComponent.appendChild(dueDateSpan);

        // Ellipses
        const ellipsisComponent = document.createElement("div");
        ellipsisComponent.classList.add("ellipses__wrapper");

        // Ellipses - Icon
        const ellipsisIcon = document.createElement("i");
        ellipsisIcon.classList.add("fa", "fa-ellipsis-h");
        ellipsisIcon.setAttribute("aria-hidden", "true");

        ellipsisComponent.appendChild(ellipsisIcon);

        // Stick Color
        const stickyColorComponent = document.createElement("div");
        stickyColorComponent.classList.add("sticky-color");

        // ! Log
        // console.log("Rendering Sticky Color:", taskData["color"]);

        if (taskData["color"] != "none") {
            // ! Log
            // console.log("Adding class Sticky Color:", taskData["color"]);

            stickyColorComponent.classList.add(taskData["color"]);
        } else {
            // ! Log
            // console.log("Rendering Sticky Color: ", "none");

            stickyColorComponent.classList.add("none");
        }

        // List Component - Second Block
        const listComponentSecondBlock = document.createElement("div");
        listComponentSecondBlock.classList.add("list-component__second-block");

        // Memo
        const memoSpan = document.createElement("span");
        memoSpan.classList.add("text-memo");

        if (taskData["memo"]) {
            // Memo - Create TextNode
            const memoText = document.createTextNode(taskData["memo"]);
            memoSpan.append(memoText);
        } else {
            listComponentSecondBlock.classList.add("hidden");
        }

        listComponentSecondBlock.appendChild(memoSpan);

        // Putting it all together...
        listComponentFirstBlock.append(pinComponent, checkboxComponent, dueDateComponent, ellipsisComponent, stickyColorComponent);

        listComponent.appendChild(listComponentFirstBlock);
        listComponent.appendChild(listComponentSecondBlock);

        // ! Log
        console.log(listComponent);

        return listComponent;
    }

    // Public Methods
    return {
        populateList: function (items, completedStatus) {
            // ! Log
            console.log("The Completed Status is", completedStatus);

            // If completed status is available,
            // populate for BOTH Main List and Completed List
            // If not, populate for Main List ONLY
            if (completedStatus) {
                // Show Completed List
                View.showCompletedList();
                items.forEach(function (item) {
                    let task = render(item);

                    // ! Log
                    console.log("populating:", task);

                    // Filter Main List and Completed List
                    if (item.completed === false) {
                        // ! Log
                        console.log("populatin Main list...")

                        if (item.pin) {
                            document.querySelector(UISelectors.mainList).insertAdjacentElement("afterbegin", task);
                        } else {
                            document.querySelector(UISelectors.mainList).append(task);
                        }
                    } else {
                        // ! Log
                        console.log("populating Completed list...")

                        // Append to Completed List
                        if (item.pin) {
                            document.querySelector(UISelectors.completedList).firstElementChild.insertAdjacentElement("afterend", task)
                        } else {
                            document.querySelector(UISelectors.completedList).append(task);
                        }
                    }
                });
            } else {
                View.hideCompletedList();
                // ! Log
                console.log("No Completed List, populatin Main list...")

                items.forEach(function (item) {
                    let task = render(item);

                    if (item.pin) {
                        document.querySelector(UISelectors.mainList).insertAdjacentElement("afterbegin", task);
                    } else {
                        document.querySelector(UISelectors.mainList).append(task);
                    }
                })
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
            const newTask = render(newTaskData);

            // Insert new list component to DOM
            document.querySelector(UISelectors.mainList).insertAdjacentElement('beforeend', newTask);
        },
        addTaskToMainListPinned: function (newTaskData) {
            // Create elements
            const newTask = render(newTaskData);

            // Insert new list component to DOM
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
            document.querySelector(UISelectors.addForm).classList.add("hidden");
        },
        getFormTaskTaskInput: function () {
            return UIElements.addFormTaskInput.value;
        },
        getFormTaskDateInput: function () {
            let formatDate = UIElements.addFormDateInput.value.replaceAll("-", "/");

            // ! Log
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
            let colorValue;

            // ! Log
            console.log("color Red is", UIElements.addFormColorInputRed.checked);
            console.log("color Yellow is", UIElements.addFormColorInputYellow.checked);
            console.log("color Blue is", UIElements.addFormColorInputBlue.checked);
            console.log("color Green is", UIElements.addFormColorInputGreen.checked);
            console.log("color None is", UIElements.addFormColorInputNone.checked);

            // Find Value
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
            }

            // ! Log
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
            UIElements.editFormPinInput.checked = Model.getCurrentItem().pin;

            // Set color from selection
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
            let formatDate = UIElements.editFormDateInput.value.replaceAll("-", "/");

            // ! Log
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
            let colorValue;

            // ! Log
            console.log("Checking in Edit Task...")
            console.log("Checking in Edit Task...")
            console.log("color Red is", UIElements.editFormColorInputRed.checked);
            console.log("color Yellow is", UIElements.editFormColorInputYellow.checked);
            console.log("color Blue is", UIElements.editFormColorInputBlue.checked);
            console.log("color Green is", UIElements.addFormColorInputGreen.checked);
            console.log("color None is", UIElements.addFormColorInputNone.checked);

            // Find Value
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
            }


            // ! Log
            console.log("color", colorValue);

            return colorValue;
        },
        updateTaskDisplayFromEditTask: function (updateTaskData) {
            // Search for targeted list component
            let taskComponents = document.querySelectorAll(UISelectors.listComponent);

            // ! Log
            console.log("Looping:", taskComponents);

            // Turn Node list into array
            taskComponents = Array.from(taskComponents);

            taskComponents.forEach((taskComponent) => {
                const taskId = taskComponent.id;

                // ! Log
                console.log("pass id", taskId);

                if (taskId == updateTaskData.id) {
                    // Update UI
                    const currentTaskComponentUI = document.getElementById(`${taskId}`);

                    // ! Log
                    console.log(currentTaskComponentUI);

                    // ! Log
                    console.log("using data", updateTaskData);

                    let newDisplayTaskComponent = render(updateTaskData);

                    // Check if new task is completed
                    if (updateTaskData.completed == true) {
                        // Check if completed task is pinned
                        if (updateTaskData.pin == true) {
                            // Add new and update task component
                            document.querySelector(UISelectors.completedList).insertAdjacentElement("afterbegin", newDisplayTaskComponent);

                            // Remove old task component
                            currentTaskComponentUI.remove();
                        } else {
                            // Add new and update task component
                            currentTaskComponentUI.parentNode.replaceChild(newDisplayTaskComponent, currentTaskComponentUI);
                        }
                    } else {
                        // Check if uncompleted task is true
                        if (updateTaskData.pin == true) {
                            // Check if uncompleted task is pinned
                            document.querySelector(UISelectors.mainList).insertAdjacentElement("afterbegin", newDisplayTaskComponent);

                            // Remove old task component
                            currentTaskComponentUI.remove();
                        } else {
                            // Add new and update task component
                            currentTaskComponentUI.parentNode.replaceChild(newDisplayTaskComponent, currentTaskComponentUI);
                        }
                    }

                    View.closeEditTask();
                }
            })
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
    }
})();


// ==========
// Controller
// ==========
// - main controller
// - Where everything will meet
// - initial event listeners
// - init function
const Controller = (function (Model, View, Storage) {
    // Load Event Listeners
    const loadEventListeners = function () {
        // Get UI selectors
        const UISelectors = View.getSelectors();
        const UIElements = View.getElements();

        // Add Quick "Add Task" event - Submit input
        document.querySelector(UISelectors.quickTaskBtn).addEventListener("click", quickAddTaskSubmit);

        // Add "Form Task" event - Open "Form Task" module
        document.querySelector(UISelectors.addFormOpenbtn).addEventListener("click", View.openFormTask);

        // Add "Form Task" Cancel button event - Close "Form Task" module
        UIElements.addFormCancelBtn.addEventListener("click", View.closeFormTask);

        // Add "Form Task" event - Submit inputs
        UIElements.addFormSubmitBtn.addEventListener("click", formTaskSubmit);

        // Add task component ellipsis - Open "Edit Task" module
        document.querySelector(UISelectors.wholeLists).addEventListener("click", clickedEditTask);

        // Add "Edit Task" Update button event - Submit inputs
        UIElements.editFormUpdateBtn.addEventListener("click", editTaskSubmit);

        // Add "Edit Task" Cancel button event - Close "Edit Task" module
        UIElements.editFormCancelBtn.addEventListener("click", View.closeEditTask);

        // Add "Edit Task" Delete button event - Delete task component
        UIElements.editFormDeleteBtn.addEventListener("click", editTaskDeleteSubmit);

        // Add checkbox event - Update data when checked or unchecked
        document.querySelector(UISelectors.wholeLists).addEventListener("click", checkedTaskAndUpateData);

        // Add "Clear List" event - Open "Clear List" Menu
        document.querySelector(UISelectors.openClearListMenuBtn).addEventListener("click", View.openClearListMenu);

        // Add "Clear List" event - Close "Clear List" Menu
        document.querySelector(UISelectors.deleteCancelBtn).addEventListener("click", View.closeClearListMenu);

        // Add "Clear List" event - Clear Main and Completed List
        document.querySelector(UISelectors.deleteConfirmBtn).addEventListener("click", clearLists);


        // ? Feature - yes, no, yes, no?
        // Disable submit on "Enter" key for "Form Task" and "Edit Task" Inputs
        // Otherwise, catastrophe may follow
        // document.addEventListener("keypress", function(e) {
        //     if (e.keyCode === 13 || e.which === 13) {
        //         e.preventDefault();

        //         return false;
        //     }
        // });

    };

    // Add Quick "Add Task" submit
    const quickAddTaskSubmit = function (e) {
        // ! Log
        console.log("Quick Add Task")

        // Get input value
        const input = View.getQuickTaskInput();

        // Validate
        // ? Suggestions: Use RegExp
        if (input !== "") {
            // ! Log
            console.log("Quick Add Task: Validating")

            // Add input value to Data, and
            // Get default data setup for UI
            const newTaskData = Model.addQuickTask(input);

            // Add new task to UI list
            View.addTaskToMainList(newTaskData);

            // Add to LS
            Storage.addItem(newTaskData);

            // Clear input field
            View.clearQuickAddTaskInput();
        }

        // ! Log
        console.log(input);

        e.preventDefault();
    };

    // Add "Form Task" Submit
    const formTaskSubmit = function (e) {
        // ! Log
        console.log("Form Task - Add Customised Task");

        // Get Values
        const taskInput = View.getFormTaskTaskInput();
        const dateInput = View.getFormTaskDateInput();
        const memoInput = View.getFormTaskMemoInput();
        const pinBoolean = View.getFormTaskPinBoolean();
        const colorSelect = View.getFormTaskColorSelect();


        // Validate
        // ? Suggestions: Use RegExp
        if (taskInput !== "") {
            // ! Log
            console.log("Form Task: Validating")

            // Add input value to Data, and
            // Get default data setup for UI
            const newTaskData = Model.addFormTask(taskInput, dateInput, memoInput, pinBoolean, colorSelect);

            // Add new task to UI list
            // If pinBoolean is true, Pin to the Top
            if (pinBoolean) {
                View.addTaskToMainListPinned(newTaskData);
            } else {
                View.addTaskToMainList(newTaskData);
            }

            // Add to LS
            Storage.addItem(newTaskData);

            // Clear all "Form Task" fields
            View.clearFormTaskFields();

            // Close "Form Task" module
            View.closeFormTask();
        }

        e.preventDefault();
    };

    // Open and set "Edit Task" module
    const clickedEditTask = function (e) {
        // use event delegation via `e.target` to find element
        if (e.target.classList.contains("ellipses__wrapper")) {
            // ! Log
            console.log("Edit Clicked!");

            // Get task component id
            const currentTaskId = e.target.parentNode.parentNode.id;

            // ! Log
            console.log("current task ID", currentTaskId);

            // Get task component id from Data
            const TasktoEditData = Model.getTaskById(currentTaskId);

            // ! Log
            console.log(TasktoEditData);

            // Set task component as "currentItem" i.e. makes locating it easier and etc.
            // ... and editing purpose
            Model.setCurrentTask(TasktoEditData);

            // Add current task component data to "Edit Task" Form to display
            View.addItemtoEditTask();
        }
    };

    // Update "Edit Task" Submit
    const editTaskSubmit = function (e) {
        e.preventDefault();

        // ! Log
        console.log("Updating!");

        // Get Edit Task Inputs and Values
        const taskInput = View.getEditTaskTaskInput();
        const dateInput = View.getEditTaskDateInput();
        const memoInput = View.getEditTaskMemoInput();
        const pinBoolean = View.getEditTaskPinBoolean();
        const colorSelect = View.getEditTaskColorSelect();

        // Update component task in data
        const updateTaskData = Model.updateDataFromEditTask(taskInput, dateInput, memoInput, pinBoolean, colorSelect);

        // ! Log
        console.log("new Update data applied to database", updateTaskData)

        // Update item LS
        Storage.updateItem(updateTaskData);

        // Update UI
        View.updateTaskDisplayFromEditTask(updateTaskData);

        e.preventDefault();
    };

    // Delete button of "Edit Task" module
    const editTaskDeleteSubmit = function (e) {
        // Get current task component
        const currentTask = Model.getCurrentItem();

        // ! Log
        console.log("Attempting to delete", currentTask);

        // Delete from data structure
        Model.deleteItem(currentTask.id);

        // Delete item LS
        Storage.deleteItem(currentTask.id);

        // Delete from UI
        View.deleteTaskDisplayFromEditTask(currentTask.id);

        e.preventDefault();
    }

    // If a task is UNCHECK, update data and UI
    const checkedTaskAndUpateData = function (e) {

        if (e.target.classList.contains("check")) {
            let completedStatus = e.target.checked;
            console.log(completedStatus);

            // Get task component id
            const currentTaskId = e.target.parentNode.parentNode.parentNode.id;

            // ! Log
            console.log("current task ID", currentTaskId);

            // Get task component id from Data
            const TasktoEditData = Model.getTaskById(currentTaskId);

            // ! Log
            console.log(TasktoEditData);

            Model.setCurrentTask(TasktoEditData);

            const updateTaskData = Model.updateCurrentTaskCheckedData(completedStatus);

            // Update item LS
            Storage.updateItem(updateTaskData);

            if (completedStatus == true) {
                console.log("task data change to COMPLETE...");

                // Do NOT update UI
                return;
            } else {
                console.log("task data change to UNCOMPLETE...");
                // Fetch items from data structure
                const items = Model.getItems();

                // Check if there is any "completed" task equal 'true'
                let completedStatus = findCompletedStatus(items);

                // Clear UI
                View.clearLists();

                // Repopulate UI with update data
                View.populateList(items, completedStatus)
            }
        }
    }

    // Clear Lists Data and UI
    const clearLists = function () {

        // Clear LS
        Storage.clearItems();

        // Clear Lists UI
        View.clearLists();
        View.closeClearListMenu();
    }

    // Find if any task component data (item) is Completed
    const findCompletedStatus = function (items) {
        for (const item of items) {
            // ! Log
            // console.log("The current property status is", item["completed"]);

            if (item["completed"]) {
                return true;
            }
        }
        return false;
    }

    // Public Methods
    return {
        init: function () {
            console.log("Initialising App...")

            // Fetch items from data structure
            const items = Model.getItems();

            // Check if there is any "completed" task equal 'true'
            let completedStatus = findCompletedStatus(items);

            // Populate List
            View.populateList(items, completedStatus);

            // Load event listeners
            loadEventListeners();
        }
    }
})(Model, View, Storage);

// Initialise App
Controller.init();
