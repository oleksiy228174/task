(function() {
  const STORAGE_KEY = 'taskflow.tasks';

  function loadTasks() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY))  []; }
    catch { return []; }
  }

  function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  function todayStr() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2,'0');
    const day = String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  }

  function addTask(title, dueDate) {
    const tasks = loadTasks();
    const t = { id: uid(), title: title.trim(), dueDate: dueDate||null, completed: false, createdAt: Date.now() };
    tasks.push(t);
    saveTasks(tasks);
    return t;
  }

  function toggleTask(id, completed) {
    const tasks = loadTasks();
    const i = tasks.findIndex(t=>t.id===id);
    if(i!==-1){ tasks[i].completed = completed; saveTasks(tasks); }
  }

  function removeTask(id){
    const tasks = loadTasks().filter(t=>t.id!==id);
    saveTasks(tasks);
  }

  function renderList(containerSelector, filterFn) {
    const container = document.querySelector(containerSelector);
    if(!container) return;

    const tasks = loadTasks()
      .sort((a,b)=>Number(a.completed)-Number(b.completed)||a.createdAt-b.createdAt)
      .filter(filterFn(()=>true));

    container.innerHTML = '';
    if(!tasks.length){
      container.innerHTML = <div class="task">Немає завдань для відображення.</div>;
      return;
    }

    tasks.forEach(t=>{
      const div = document.createElement('div');
      div.className = 'task';
      if(t.completed) div.classList.add('done');

      div.innerHTML = <input type="checkbox" ${t.completed?'checked':''} /> <span>${t.title}</span> <button class="delete-task" style="margin-left:auto;background:#fff;color:#d00;border:1px solid #C0FF42;border-radius:6px;">×</button>;

      const checkbox = div.querySelector('input[type="checkbox"]');
      checkbox.addEventListener('change', ()=>{
        toggleTask(t.id, checkbox.checked);
        location.reload();
      });

      const delBtn = div.querySelector('.delete-task');
      delBtn.addEventListener('click', ()=>{
        if(confirm('Видалити завдання?')){
          removeTask(t.id);
          div.remove();
        }
      });

      container.appendChild(div);
    });
  }

  document.addEventListener('DOMContentLoaded',()=>{
    const page = document.body.dataset.page;
    if(page==='home'){
      const today = todayStr();
      renderList('#task-list', t=>!t.completed && t.dueDate===today);
    }
    if(page==='in-progress'){
      renderList('#task-list', t=>!t.completed);
    }
    if(page==='done'){
      renderList('#task-list', t=>t.completed);
    }
    if(page==='add'){
      const form = document.getElementById('task-form');
      const titleInput = document.getElementById('title');
      const dateInput = document.getElementById('due');
      form.addEventListener('submit', e=>{
        e.preventDefault();
        const title = titleInput.value.trim();
        const due = dateInput.value||null;
        if(!title){ alert('Введіть назву завдання'); titleInput.focus(); return; }
        addTask(title,due);
        form.reset();
        location.href='in-progress.html';
      });
    }
  });
})();
