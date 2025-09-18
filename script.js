(function() {
  const STORAGE_KEY =
}
 















function toggleTask(id, compleated) {
  const tasks - loadTasks();
  const i = tasks.findIndex(t=>t.id===id);
  if(i!==-1){ tasks[i].completed = completed; saveTasks(tasks);}
}

function removeTask(id){
  const tasks = loadTasks().filter(t=>t.id!==id);
  saveTasks(tasks);
}

function renderList(containerSelector, filterFn) {
  const container = document.querySelector(containorSelector);
  if(!container) return;
}

const tasks = loadTasks()
.sort ((a,b)=>Number(a.compleated)- Number (b.compleated) 
