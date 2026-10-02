// --- DOM Selectors ---
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

let taskIdCounter = 1;

// --- Required Functions ---

// 1. Create and return one task item element safely
function createTaskElement(taskText, taskId) {
  const li = document.createElement("li");
  li.className = "task-item";
  li.dataset.taskId = taskId;
  li.dataset.state = "pending";

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = taskText;

  const completeBtn = document.createElement("button");
  completeBtn.className = "complete-btn";
  completeBtn.textContent = "Complete";

  const editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.textContent = "Edit";

  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.textContent = "Remove";

  li.appendChild(span);
  li.appendChild(completeBtn);
  li.appendChild(editBtn);
  li.appendChild(removeBtn);

  return li;
}

// 2. Add new task with validation and unique ID
function addTask(taskText) {
  const trimmedText = taskText.trim();
  if (!trimmedText) {
    taskMessage.textContent = "Task cannot be empty";
    return;
  }

  taskMessage.textContent = "";
  const taskId = `task-${taskIdCounter++}`;
  const taskElement = createTaskElement(trimmedText, taskId);

  taskList.appendChild(taskElement);
  taskInput.value = "";
  updateTaskCounts();
}

// 3. Toggle completed state
function toggleTaskComplete(taskItem) {
  taskItem.classList.toggle("completed");
  const isCompleted = taskItem.classList.contains("completed");
  taskItem.dataset.state = isCompleted ? "completed" : "pending";
  updateTaskCounts();
}

// 4. Begin task editing
function beginTaskEdit(taskItem) {
  const textSpan = taskItem.querySelector(".task-text");
  if (!textSpan) return;

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "edit-input";
  editInput.value = textSpan.textContent;

  const editBtn = taskItem.querySelector(".edit-btn");
  editBtn.textContent = "Save";

  taskItem.replaceChild(editInput, textSpan);
}

// 5. Save edited task value
function saveTaskEdit(taskItem) {
  const editInput = taskItem.querySelector(".edit-input");
  if (!editInput) return;

  const trimmedText = editInput.value.trim();
  if (!trimmedText) {
    taskMessage.textContent = "Task cannot be empty";
    return;
  }

  taskMessage.textContent = "";
  const newSpan = document.createElement("span");
  newSpan.className = "task-text";
  newSpan.textContent = trimmedText;

  const editBtn = taskItem.querySelector(".edit-btn");
  editBtn.textContent = "Edit";

  taskItem.replaceChild(newSpan, editInput);
}

// 6. Remove a single task
function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

// 7. Update count summary display
function updateTaskCounts() {
  const allTasks = taskList.querySelectorAll(".task-item");
  const total = allTasks.length;
  let pending = 0;
  let completed = 0;

  allTasks.forEach((item) => {
    if (item.dataset.state === "completed") {
      completed++;
    } else {
      pending++;
    }
  });

  totalCount.textContent = total;
  pendingCount.textContent = pending;
  completedCount.textContent = completed;
}

// 8. Delegated event handler for task list actions
function handleTaskListClick(event) {
  const target = event.target;
  const taskItem = target.closest(".task-item");

  if (!taskItem) return;

  if (target.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (target.matches(".edit-btn")) {
    if (target.textContent === "Edit") {
      beginTaskEdit(taskItem);
    } else if (target.textContent === "Save") {
      saveTaskEdit(taskItem);
    }
  } else if (target.matches(".remove-btn")) {
    removeTask(taskItem);
  }
}

// 9. Load required sample tasks using DocumentFragment
function loadSampleTasks() {
  const samples = [
    "Review DOM selectors",
    "Practice createElement",
    "Study event delegation"
  ];

  const fragment = document.createDocumentFragment();

  samples.forEach((sampleText) => {
    const taskId = `task-${taskIdCounter++}`;
    const taskElement = createTaskElement(sampleText, taskId);
    fragment.appendChild(taskElement);
  });

  taskList.appendChild(fragment);
  updateTaskCounts();
}

// --- Event Listeners ---
addTaskBtn.addEventListener("click", () => addTask(taskInput.value));

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask(taskInput.value);
  }
});

loadSamplesBtn.addEventListener("click", loadSampleTasks);

// Single delegated event listener for dynamic task list items
taskList.addEventListener("click", handleTaskListClick);