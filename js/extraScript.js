const addBtn = document.getElementById("plus_btn");
const textInput = document.getElementById("textbox");
const textList = document.getElementById("textList");

const todayBtn = document.getElementById("taskTodayBtn");
const newListBtn = document.getElementById("taskNewBtn");
const myListBtn = document.getElementById("taskMyBtn");
const myH2Heading = document.getElementById("topicH2");
const tasks = [];

function generateUniqueId() {
  return Date.now().toString();
}

window.addEventListener("DOMContentLoaded", start);

todayBtn.addEventListener("click", function () {
  myH2Heading.textContent = "Today";
});
newListBtn.addEventListener("click", function () {
  myH2Heading.textContent = "New list";
});
myListBtn.addEventListener("click", function () {
  myH2Heading.textContent = "My Lists";
});
// document.querySelector("plus_btn").addEventListener("click", btn_klik);
addBtn.addEventListener("click", addTextToList);
function start() {
  console.log("ready");
}

function addTextToList() {
  const text = textInput.value;

  if (text.trim() === "") {
    alert("Tilføj tekst");
    return;
  }
  textInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTextToList();
    }
  });
  const listItem = document.createElement("li");
  listItem.textContent = text;

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.classList.add("removeButton");

  // Tilføj fjern-knap-klik-håndterer
  removeButton.addEventListener("click", function () {
    textList.removeChild(listItem);
  });

  // Tilføj fjern-knap til listeelement
  listItem.appendChild(removeButton);

  textList.appendChild(listItem);

  textInput.value = "";
  const id = generateUniqueId("li");
  const task = { id, description: text };
  tasks.push(task);
}
// ***********************************

("use strict");

const listNameInput = document.getElementById("listName");
const createListButton = document.getElementById("createList");
const listMenu = document.getElementById("listMenu");
const taskListContainer = document.getElementById("taskListContainer");
const listTitle = document.getElementById("listTitle");
const activeListName = document.getElementById("activeListName");
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("plus_btn");
const taskList = document.getElementById("taskList");
const doneList = document.getElementById("doneList");

let lists = getSavedLists();
let activeList = null;

function getSavedLists() {
  const savedLists = localStorage.getItem("todoLists");
  return savedLists ? JSON.parse(savedLists) : {};
}

function saveListsToLS() {
  localStorage.setItem("todoLists", JSON.stringify(lists));
}

function updateUiData() {
  listMenu.innerHTML = "";
  for (const listName in lists) {
    if (lists.hasOwnProperty(listName)) {
      const listButton = document.createElement("button");
      listButton.textContent = listName;
      listButton.addEventListener("click", function () {
        activeList = listName;
        activeListName.textContent = listName;
        updateTaskList();
      });
      const deleteListButton = document.createElement("button");
      deleteListButton.textContent = "X";
      deleteListButton.addEventListener("click", function () {
        deleteList(listName);
      });
      const buttonContainer = document.createElement("div");
      buttonContainer.appendChild(listButton);
      buttonContainer.appendChild(deleteListButton);
      const listItem = document.createElement("li");
      listItem.appendChild(buttonContainer);
      listMenu.appendChild(listItem);
    }
  }
}

updateUiData();

createListButton.addEventListener("click", function () {
  const listName = listNameInput.value.trim();
  if (listName !== "") {
    lists[listName] = [];
    const listButton = document.createElement("button");
    listButton.textContent = listName;
    listButton.addEventListener("click", function () {
      activeList = listName;
      activeListName.textContent = listName;
      updateTaskList();
    });
    listMenu.appendChild(listButton);

    saveListsToLS();
    updateUiData();

    listNameInput.value = "";
  }
});

// addTaskButton.addEventListener("click", function () {
//   const taskText = taskInput.value.trim();
//   if (taskText !== "" && activeList !== null) {
//     lists[activeList].push(taskText);
//     updateTaskList();
//     saveListsToLS();
//     updateUiData();
//     taskInput.value = "";
//   }
// });

function updateListMenuText(newText) {
  listMenu.textContent = newText;
}

function updateTaskList() {
  taskList.innerHTML = "";
  if (activeList !== null) {
    lists[activeList].forEach(function (taskText) {
      const taskItem = document.createElement("li");
      taskItem.textContent = taskText;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "X";
      deleteButton.addEventListener("click", function () {
        const taskIndex = lists[activeList].indexOf(taskText);
        if (taskIndex !== -1) {
          lists[activeList].splice(taskIndex, 1);
          saveListsToLS();
          updateTaskList();
        }
      });

      taskItem.appendChild(deleteButton);
      taskList.appendChild(taskItem);
    });
  }
}
function deleteList(listName) {
  if (listName in lists) {
    delete lists[listName];
    saveListsToLS();
    updateUiData();

    if (activeList === listName) {
      activeList = null;
      activeListName.textContent = "none";
      taskList.innerHTML = "";
    }
  }
}
// ... Din eksisterende kode ...

// Function to add a task
function addTask() {
  const taskDescription = taskDescriptionInput.value.trim();
  const taskQuantity = taskQuantityInput.value;

  if (taskDescription !== "") {
    const taskItem = createTaskItem(taskDescription, taskQuantity);
    const currentListTitle = listDetailTitle.textContent;

    // Check if the current list exists in listsData
    if (listsData[currentListTitle]) {
      listsData[currentListTitle].tasks.push({
        taskString: taskDescription,
        howMany: taskQuantity,
        done: false,
      });
    }

    updateListDetail(); // Update the displayed tasks
    // Clear input fields
    taskDescriptionInput.value = "";
    taskQuantityInput.value = "";
  }
}

// Function to create a task item
function createTaskItem(description, quantity) {
  const taskItem = new TodoTask(description);

  const li = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  const span = document.createElement("span");
  span.textContent = `Description: ${description} - Quantity: ${quantity}`;
  const undoBtn = document.createElement("button");
  undoBtn.textContent = "Undo";
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(undoBtn);
  li.appendChild(deleteBtn);

  checkbox.addEventListener("change", function () {
    taskItem.toggleDone();
    updateListDetail();
  });

  undoBtn.addEventListener("click", function () {
    taskItem.toggleDone();
    updateListDetail();
  });

  deleteBtn.addEventListener("click", function () {
    // Remove the task from listsData
    const currentListTitle = listDetailTitle.textContent;
    const currentListTasks = listsData[currentListTitle].tasks;
    const index = currentListTasks.indexOf(taskItem);

    if (index !== -1) {
      currentListTasks.splice(index, 1);
      updateListDetail();
    }

    // Remove the task item from the DOM
    li.remove();
  });

  return li;
}

// ... Resten af din eksisterende kode ...
