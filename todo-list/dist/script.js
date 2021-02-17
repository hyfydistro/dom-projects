"use strict";const mainElement=document.querySelector("main"),formTaskBtn=document.querySelector(".form-task__btn"),h1Title=document.querySelector(".title"),mq=window.matchMedia("(min-width: 600px)");function isLargeScreen(){window.innerWidth>=600?mainElement.insertAdjacentElement("afterbegin",h1Title):formTaskBtn.insertAdjacentElement("afterend",h1Title)}function getUniqueId(){return window.crypto&&window.crypto.getRandomValues?window.crypto.getRandomValues(new Uint32Array(1))[0]:Math.random()}mq.matches&&mainElement.insertAdjacentElement("afterbegin",h1Title),window.addEventListener("resize",isLargeScreen);const Storage={addItem:function(e){let t;null===localStorage.getItem("tasks")?(t=[],t.push(e),localStorage.setItem("tasks",JSON.stringify(t))):(t=JSON.parse(localStorage.getItem("tasks")),t.push(e),localStorage.setItem("tasks",JSON.stringify(t)))},getItems:function(){let e;return e=null===localStorage.getItem("tasks")?[]:JSON.parse(localStorage.getItem("tasks")),e},updateItem:function(e){let t=JSON.parse(localStorage.getItem("tasks"));t.forEach((function(n,o){e.id==n.id&&t.splice(o,1,e)})),localStorage.setItem("tasks",JSON.stringify(t))},deleteItem:function(e){let t=JSON.parse(localStorage.getItem("tasks"));t.forEach((function(n,o){e==n.id&&t.splice(o,1)})),localStorage.setItem("tasks",JSON.stringify(t))},clearItems:function(){localStorage.removeItem("tasks")}},Model=function(){const e=function(e=getUniqueId(),t,n="",o="",d=!1,r="none",l=!1){this.id=e,this.title=t,this.date=n,this.memo=o,this.pin=d,this.color=r,this.completed=l},t={items:Storage.getItems(),currentItem:null};return{logData:function(){return t},getItems:function(){return t.items},addQuickTask:function(n){const o=new e(void 0,n);return t.items.push(o),o},addFormTask:function(n,o,d,r,l){const c=new e(void 0,n,o,d,r,l);return t.items.push(c),c},getTaskById:function(e){let n=null;return t.items.forEach((function(t){t.id==e&&(n=t)})),n},setCurrentTask:function(e){t.currentItem=e},getCurrentItem:function(){return t.currentItem},updateDataFromEditTask:function(e,n,o,d,r){let l=null;return t.items.forEach((function(c){c.id===t.currentItem.id&&(c.title=e,c.date=n,c.memo=o,c.pin=d,c.color=r,l=c)})),l},updateCurrentTaskCheckedData:function(e){let n=null;return t.items.forEach((function(o){o.id==t.currentItem.id&&(o.completed=e,n=o)})),n},deleteItem:function(e){const n=t.items.map((function(e){return e.id})).indexOf(e);t.items.splice(n,1)}}}(),View=function(){const e={wholeLists:".list__wrapper",listComponent:".list-component",quickTaskInput:".add-task__input",quickTaskBtn:".add-task__btn",mainList:".main-list",completedList:".completed-list",addFormOpenbtn:".form-task__btn",addForm:".form-task__wrapper",editForm:".edit-task__wrapper",overlay:".overlay__module",clearListMenu:".delete-confirmation__module",deleteCancelBtn:".delete-confirmation-cancel__btn",deleteConfirmBtn:".delete-confirmation-confirm__btn",openClearListMenuBtn:".clear-list__btn"},t={addFormCancelBtn:document.querySelector(".form-task__module").children[0].firstElementChild,addFormTaskInput:document.querySelector(".form-task__module").children[1].children[0].lastElementChild,addFormDateInput:document.querySelector(".form-task__module").children[1].children[1].lastElementChild,addFormMemoInput:document.querySelector(".form-task__module").children[1].children[2].lastElementChild,addFormPinInput:document.querySelector(".form-task__module").children[1].children[3].lastElementChild.firstElementChild,addFormColorInputRed:document.querySelector(".form-task__module").children[1].children[4].children[1].children[0],addFormColorInputYellow:document.querySelector(".form-task__module").children[1].children[4].children[1].children[2],addFormColorInputBlue:document.querySelector(".form-task__module").children[1].children[4].children[1].children[4],addFormColorInputGreen:document.querySelector(".form-task__module").children[1].children[4].children[1].children[6],addFormColorInputNone:document.querySelector(".form-task__module").children[1].children[4].children[1].children[8],addFormSubmitBtn:document.querySelector(".form-task__module").children[1].children[4].children[2],editFormCancelBtn:document.querySelector(".edit-task__module").children[0].firstElementChild,editFormUpdateBtn:document.querySelector(".edit-task__module").children[0].lastElementChild,editFormTaskInput:document.querySelector(".edit-task__module").children[1].children[0].lastElementChild,editFormDateInput:document.querySelector(".edit-task__module").children[1].children[1].lastElementChild,editFormMemoInput:document.querySelector(".edit-task__module").children[1].children[2].lastElementChild,editFormPinInput:document.querySelector(".edit-task__module").children[1].children[3].lastElementChild.firstElementChild,editFormColorInputRed:document.querySelector(".edit-task__module").children[1].children[4].children[1].children[0],editFormColorInputYellow:document.querySelector(".edit-task__module").children[1].children[4].children[1].children[2],editFormColorInputBlue:document.querySelector(".edit-task__module").children[1].children[4].children[1].children[4],editFormColorInputGreen:document.querySelector(".edit-task__module").children[1].children[4].children[1].children[6],editFormColorInputNone:document.querySelector(".edit-task__module").children[1].children[4].children[1].children[8],editFormDeleteBtn:document.querySelector(".edit-task__module").children[1].children[4].children[2]},n=function(e){const t=document.createElement("div");t.classList.add("list-component"),t.id=e.id;const n=document.createElement("div");n.classList.add("list-component__first-block");const o=document.createElement("div");o.classList.add("pin__wrapper");const d=document.createElement("i");d.classList.add("fa","fa-thumb-tack"),e.pin||d.classList.add("invisible"),d.setAttribute("aria-hidden","true"),o.appendChild(d);const r=document.createElement("label");r.classList.add("checkbox");const l=document.createElement("input");l.id="check",l.type="checkbox",l.checked=e.completed,l.classList.add("check");const c=document.createElement("span");c.classList.add("text-label");const i=document.createTextNode(e.title);c.append(i),r.appendChild(l),r.appendChild(c);const a=document.createElement("div");a.classList.add("due-date");const s=document.createElement("span");if(s.classList.add("text-date"),e.date){const t=document.createTextNode(e.date);s.append(t)}a.appendChild(s);const u=document.createElement("div");u.classList.add("ellipses__wrapper");const m=document.createElement("i");m.classList.add("fa","fa-ellipsis-h"),m.setAttribute("aria-hidden","true"),u.appendChild(m);const p=document.createElement("div");p.classList.add("sticky-color"),"none"!=e.color?p.classList.add(e.color):p.classList.add("none");const k=document.createElement("div");k.classList.add("list-component__second-block");const h=document.createElement("span");if(h.classList.add("text-memo"),e.memo){const t=document.createTextNode(e.memo);h.append(t)}else k.classList.add("hidden");return k.appendChild(h),n.append(o,r,a,u,p),t.appendChild(n),t.appendChild(k),t};return{populateList:function(t,o){o?(View.showCompletedList(),t.forEach((function(t){let o=n(t);!1===t.completed?t.pin?document.querySelector(e.mainList).insertAdjacentElement("afterbegin",o):document.querySelector(e.mainList).append(o):t.pin?document.querySelector(e.completedList).firstElementChild.insertAdjacentElement("afterend",o):document.querySelector(e.completedList).append(o)}))):(View.hideCompletedList(),t.forEach((function(t){let o=n(t);t.pin?document.querySelector(e.mainList).insertAdjacentElement("afterbegin",o):document.querySelector(e.mainList).append(o)})))},getSelectors:function(){return e},getElements:function(){return t},getQuickTaskInput:function(){return document.querySelector(e.quickTaskInput).value},addTaskToMainList:function(t){const o=n(t);document.querySelector(e.mainList).insertAdjacentElement("beforeend",o)},addTaskToMainListPinned:function(t){const o=n(t);document.querySelector(e.mainList).insertAdjacentElement("afterbegin",o)},clearQuickAddTaskInput:function(){document.querySelector(e.quickTaskInput).value=""},hideCompletedList:function(){document.querySelector(e.completedList).style.display="none"},showCompletedList:function(){document.querySelector(e.completedList).style.display="block"},openFormTask:function(){document.querySelector(e.overlay).classList.remove("hidden"),document.querySelector(e.addForm).classList.remove("hidden")},closeFormTask:function(){document.querySelector(e.overlay).classList.add("hidden"),document.querySelector(e.addForm).classList.add("hidden")},getFormTaskTaskInput:function(){return t.addFormTaskInput.value},getFormTaskDateInput:function(){return t.addFormDateInput.value.replaceAll("-","/")},getFormTaskMemoInput:function(){return t.addFormMemoInput.value},getFormTaskPinBoolean:function(){return t.addFormPinInput.checked},getFormTaskColorSelect:function(){let e;return t.addFormColorInputRed.checked||t.addFormColorInputYellow.checked||t.addFormColorInputBlue.checked||t.addFormColorInputGreen.checked||t.addFormColorInputNone.checked?(t.addFormColorInputRed.checked&&(e=t.addFormColorInputRed.value),t.addFormColorInputYellow.checked&&(e=t.addFormColorInputYellow.value),t.addFormColorInputBlue.checked&&(e=t.addFormColorInputBlue.value),t.addFormColorInputGreen.checked&&(e=t.addFormColorInputGreen.value),t.addFormColorInputNone.checked&&(e=t.addFormColorInputNone.value)):e=t.addFormColorInputNone.value,e},clearFormTaskFields:function(){t.addFormTaskInput.value="",t.addFormDateInput.value="",t.addFormMemoInput.value="",t.addFormPinInput.checked=!1,t.addFormColorInputRed.checked=!1,t.addFormColorInputYellow.checked=!1,t.addFormColorInputBlue.checked=!1,t.addFormColorInputGreen.checked=!1,t.addFormColorInputNone.checked=!1},addItemtoEditTask:function(){switch(t.editFormTaskInput.value=Model.getCurrentItem().title,t.editFormDateInput.value=Model.getCurrentItem().date,t.editFormMemoInput.value=Model.getCurrentItem().memo,t.editFormPinInput.checked=Model.getCurrentItem().pin,Model.getCurrentItem().color){case"red":t.editFormColorInputRed.checked=!0;break;case"yellow":t.editFormColorInputYellow.checked=!0;break;case"blue":t.editFormColorInputBlue.checked=!0;break;case"green":t.editFormColorInputGreen.checked=!0;break;default:t.editFormColorInputNone.checked=!0}View.openEditTask()},openEditTask:function(){document.querySelector(e.overlay).classList.remove("hidden"),document.querySelector(e.editForm).classList.remove("hidden")},closeEditTask:function(){document.querySelector(e.overlay).classList.add("hidden"),document.querySelector(e.editForm).classList.add("hidden")},getEditTaskTaskInput:function(){return t.editFormTaskInput.value},getEditTaskDateInput:function(){return t.editFormDateInput.value.replaceAll("-","/")},getEditTaskMemoInput:function(){return t.editFormMemoInput.value},getEditTaskPinBoolean:function(){return t.editFormPinInput.checked},getEditTaskColorSelect:function(){let e;switch(t.editFormColorInputRed.checked||t.editFormColorInputYellow.checked||t.editFormColorInputBlue.checked||t.editFormColorInputGreen.checked||t.editFormColorInputNone.checked){case t.editFormColorInputRed.checked:e=t.editFormColorInputRed.value;break;case t.editFormColorInputYellow.checked:e=t.editFormColorInputYellow.value;break;case t.editFormColorInputBlue.checked:e=t.editFormColorInputBlue.value;break;case t.editFormColorInputGreen.checked:e=t.editFormColorInputGreen.value;break;default:e=t.editFormColorInputNone.value}return console.log("color",e),e},updateTaskDisplayFromEditTask:function(t){let o=document.querySelectorAll(e.listComponent);o=Array.from(o),o.forEach((o=>{const d=o.id;if(d==t.id){const o=document.getElementById("".concat(d));let r=n(t);1==t.completed?1==t.pin?(document.querySelector(e.completedList).insertAdjacentElement("afterbegin",r),o.remove()):o.parentNode.replaceChild(r,o):1==t.pin?(document.querySelector(e.mainList).insertAdjacentElement("afterbegin",r),o.remove()):o.parentNode.replaceChild(r,o),View.closeEditTask()}}))},deleteTaskDisplayFromEditTask:function(e){document.getElementById(e).remove(),View.closeEditTask()},openClearListMenu:function(){document.querySelector(e.overlay).classList.remove("hidden"),document.querySelector(e.clearListMenu).classList.remove("hidden")},closeClearListMenu:function(){document.querySelector(e.overlay).classList.add("hidden"),document.querySelector(e.clearListMenu).classList.add("hidden")},clearLists:function(){let t=document.querySelector(e.mainList);const n=document.querySelector(e.completedList);for(;t.firstChild;)t.removeChild(t.firstChild);for(;n.firstChild;)n.removeChild(n.firstChild)}}}(),Controller=function(e,t,n){const o=function(o){const d=t.getQuickTaskInput();if(""!==d){const o=e.addQuickTask(d);t.addTaskToMainList(o),n.addItem(o),t.clearQuickAddTaskInput()}o.preventDefault()},d=function(o){const d=t.getFormTaskTaskInput(),r=t.getFormTaskDateInput(),l=t.getFormTaskMemoInput(),c=t.getFormTaskPinBoolean(),i=t.getFormTaskColorSelect();if(""!==d){const o=e.addFormTask(d,r,l,c,i);c?t.addTaskToMainListPinned(o):t.addTaskToMainList(o),n.addItem(o),t.clearFormTaskFields(),t.closeFormTask()}o.preventDefault()},r=function(n){if(n.target.classList.contains("ellipses__wrapper")){const o=n.target.parentNode.parentNode.id,d=e.getTaskById(o);e.setCurrentTask(d),t.addItemtoEditTask()}},l=function(o){o.preventDefault();const d=t.getEditTaskTaskInput(),r=t.getEditTaskDateInput(),l=t.getEditTaskMemoInput(),c=t.getEditTaskPinBoolean(),i=t.getEditTaskColorSelect(),a=e.updateDataFromEditTask(d,r,l,c,i);n.updateItem(a),t.updateTaskDisplayFromEditTask(a),o.preventDefault()},c=function(o){const d=e.getCurrentItem();e.deleteItem(d.id),n.deleteItem(d.id),t.deleteTaskDisplayFromEditTask(d.id),o.preventDefault()},i=function(o){if(o.target.classList.contains("check")){let d=o.target.checked;console.log(d);const r=o.target.parentNode.parentNode.parentNode.id,l=e.getTaskById(r);e.setCurrentTask(l);const c=e.updateCurrentTaskCheckedData(d);if(n.updateItem(c),1==d)return void console.log("task data change to COMPLETE...");{console.log("task data change to UNCOMPLETE...");const n=e.getItems();let o=s(n);t.clearLists(),t.populateList(n,o)}}},a=function(){n.clearItems(),t.clearLists(),t.closeClearListMenu()},s=function(e){for(const t of e)if(t.completed)return!0;return!1};return{init:function(){const n=e.getItems();let u=s(n);t.populateList(n,u),function(){const e=t.getSelectors(),n=t.getElements();document.querySelector(e.quickTaskBtn).addEventListener("click",o),document.querySelector(e.addFormOpenbtn).addEventListener("click",t.openFormTask),n.addFormCancelBtn.addEventListener("click",t.closeFormTask),n.addFormSubmitBtn.addEventListener("click",d),document.querySelector(e.wholeLists).addEventListener("click",r),n.editFormUpdateBtn.addEventListener("click",l),n.editFormCancelBtn.addEventListener("click",t.closeEditTask),n.editFormDeleteBtn.addEventListener("click",c),document.querySelector(e.wholeLists).addEventListener("click",i),document.querySelector(e.openClearListMenuBtn).addEventListener("click",t.openClearListMenu),document.querySelector(e.deleteCancelBtn).addEventListener("click",t.closeClearListMenu),document.querySelector(e.deleteConfirmBtn).addEventListener("click",a)}()}}}(Model,View,Storage);Controller.init();