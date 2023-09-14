"use strict";
let lists = JSON.parse(localStorage.getItem("lists")) || {};
let activeList = null;

// Get DOM elements
const listNameInput = document.getElementById("listNameInput");
const createListButton = document.getElementById("createListButton");
const listsContainer = document.getElementById("listsContainer");
const listMenu = document.getElementById("listMenu");
const activeListName = document.getElementById("activeListName");
const taskDescriptionInput = document.getElementById("taskDescriptionInput");
const taskQuantityInput = document.getElementById("taskQuantityInput");
const addTaskButton = document.getElementById("addTaskButton");
const todoList = document.getElementById("todoList");
const doneList = document.getElementById("doneList");

// Event listener for creating a new list
createListButton.addEventListener("click", () => {
  const listName = listNameInput.value.trim();
  if (listName) {
    lists[listName] = [];
    saveLists();
    updateTodoList();
    listNameInput.value = "";
  }
});
function deleteList(listName) {
  if (listName in lists) {
    delete lists[listName];
    saveLists();
    // Opdater grænsefladen
    updateTodoList();
    if (activeList === listName) {
      activeList = null;
      activeListName.textContent = "none";
      todoList.innerHTML = "";
      doneList.innerHTML = "";
    }
  }
}

// Event listener for sletningsknapperne
function addDeleteListButtons() {
  const deleteButtons = document.querySelectorAll(".delete-list-button");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const listName = button.dataset.listName;
      deleteList(listName);
    });
  });
}
// Render the lists in the sidebar
function updateTodoList() {
  listMenu.innerHTML = "";
  for (const listName in lists) {
    const listItem = document.createElement("li");
    listItem.textContent = listName;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "✖";
    deleteButton.className = "delete-list-button";
    deleteButton.dataset.listName = listName;

    listItem.appendChild(deleteButton);

    listItem.addEventListener("click", () => {
      activeList = listName;
      activeListName.textContent = listName;
      updateTaskList();
    });
    listMenu.appendChild(listItem);
  }
  addDeleteListButtons();
}

// Save the lists to local storage
function saveLists() {
  localStorage.setItem("lists", JSON.stringify(lists));
}

// Event listener for adding a new task
addTaskButton.addEventListener("click", () => {
  const taskDescription = taskDescriptionInput.value.trim();
  const taskQuantity = taskQuantityInput.value.trim();
  if (taskDescription) {
    const task = {
      id: Date.now(),
      description: taskDescription,
      quantity: taskQuantity,
      done: false,
    };
    lists[activeList].push(task);
    saveLists();
    updateTaskList();
    taskDescriptionInput.value = "";
    taskQuantityInput.value = "";
  }
});

// Render tasks in the active list
function updateTaskList() {
  todoList.innerHTML = "";
  doneList.innerHTML = "";
  if (activeList && lists[activeList]) {
    lists[activeList].forEach((task) => {
      const taskItem = document.createElement("li");
      taskItem.textContent = `${task.description} - Pcs: ${task.quantity}`;
      const doneButton = document.createElement("button");
      doneButton.textContent = "✓";
      doneButton.addEventListener("click", () => {
        task.done = true;
        saveLists();
        updateTaskList();
      });
      const undoButton = document.createElement("button");
      undoButton.textContent = "↺";
      undoButton.addEventListener("click", () => {
        task.done = false;
        saveLists();
        updateTaskList();
      });
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "✖";
      deleteButton.addEventListener("click", () => {
        const index = lists[activeList].indexOf(task);
        if (index !== -1) {
          lists[activeList].splice(index, 1);
          saveLists();
          updateTaskList();
        }
      });
      if (task.done) {
        taskItem.classList.add("done");
        taskItem.appendChild(undoButton);
        doneList.appendChild(taskItem);
      } else {
        taskItem.appendChild(doneButton);
        taskItem.appendChild(deleteButton);
        todoList.appendChild(taskItem);
      }
    });
  }
}

// Initialize the app
updateTodoList();
