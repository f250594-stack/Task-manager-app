// Load tasks from localStorage, or start with empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks based on current filter
function renderTasks() {
  taskList.innerHTML = '';

  let filteredTasks = tasks;
  if (currentFilter === 'active') {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  }

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''}>
      <span>${task.text}</span>
      <button>✕</button>
    `;

    // Checkbox toggle
    const checkbox = li.querySelector('input');
    checkbox.addEventListener('change', () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    // Delete button
    const deleteBtn = li.querySelector('button');
    deleteBtn.addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    taskList.appendChild(li);
  });

  updateTaskCount();
}

// Update "X tasks left" text
function updateTaskCount() {
  const activeCount = tasks.filter(task => !task.completed).length;
  taskCount.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''} left`;
}

// Add new task
function addTask() {
  const text = taskInput.value.trim();
  if (text === '') return;

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskInput.value = '';
  taskInput.focus();
}

addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

// Filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Clear completed tasks
clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

// Initial render
renderTasks();