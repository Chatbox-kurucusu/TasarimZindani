// LocalStorage üzerinden görevleri ve coinleri takip et
let coins = parseInt(localStorage.getItem("coins")) || 0;
document.getElementById("coins").innerText = coins;
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let selectedTask = null;

// Görev ekleme (İhtiyaç Yaz kısmı)
function addTask() {
  const input = document.getElementById("taskInput").value.trim();
  if (!input) return;
  const newTask = {
    id: Date.now(),
    content: input,
    responded: false,
    response: null
  };
  tasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  document.getElementById("taskInput").value = '';
}

// Tüm görevleri göster (başkalarının ihtiyaçları gibi)
function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = '';
  tasks.forEach(task => {
    if (!task.responded) {
      const taskElement = document.createElement("div");
      taskElement.className = "task";
      taskElement.innerHTML = `
        <p><strong>İstek:</strong> ${task.content}</p>
        <button class="btn" onclick="selectTask(${task.id})">Karşıla</button>
      `;
      list.appendChild(taskElement);
    }
  });
}

// Seçilen ihtiyaca yanıt gönderme
function selectTask(id) {
  selectedTask = id;
  document.getElementById("responseBox").scrollIntoView({ behavior: "smooth" });
}

// Yanıtı kaydet ve göreve iliştir
function submitResponse() {
  const response = document.getElementById("responseInput").value.trim();
  if (!response || selectedTask === null) return;
  const task = tasks.find(t => t.id === selectedTask);
  if (task) {
    task.response = response;
    task.responded = true;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    renderResponses();
    document.getElementById("responseInput").value = '';
    selectedTask = null;
  }
}

// Karşılanmış görevleri göster (Onay Bekliyor)
function renderResponses() {
  const list = document.getElementById("taskList");
  tasks.forEach(task => {
    if (task.responded) {
      const taskElement = document.createElement("div");
      taskElement.className = "task";
      taskElement.innerHTML = `
        <p><strong>İstek:</strong> ${task.content}</p>
        <p><strong>Yanıt:</strong> ${task.response}</p>
        <button class="btn" onclick="confirmResponse(${task.id})">✅ Onayla</button>
        <button class="btn" onclick="rejectResponse(${task.id})">❌ Reddet</button>
      `;
      list.appendChild(taskElement);
    }
  });
}

// Yanıt onaylandıysa coin ver
function confirmResponse(id) {
  coins += 10;
  localStorage.setItem("coins", coins);
  document.getElementById("coins").innerText = coins;
  alert("✅ Görev onaylandı! 10 coin kazandın.");
  tasks = tasks.filter(task => task.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Reddedilen yanıt silinir
function rejectResponse(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      task.responded = false;
      task.response = null;
    }
    return task;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  alert("❌ Yanıt reddedildi!");
}

// Sayfa açıldığında görevleri göster
window.onload = () => {
  renderTasks();
  renderResponses();
};
// Görev seçildiğinde dosya yükleme alanını göster
function selectTask(id) {
  selectedTask = id;
  document.getElementById("responseBox").style.display = "none";
  document.getElementById("uploadBox").style.display = "block";
  document.getElementById("uploadBox").scrollIntoView({ behavior: "smooth" });
}

// Sürükle–bırak alanı işleyicileri
const dropZone = document.getElementById("dropZone");
dropZone.addEventListener("dragover", function(e) {
  e.preventDefault();
  dropZone.style.background = "#e0f7ff";
});

dropZone.addEventListener("dragleave", function(e) {
  dropZone.style.background = "#f4f7fa";
});

dropZone.addEventListener("drop", function(e) {
  e.preventDefault();
  dropZone.style.background = "#f4f7fa";

  const file = e.dataTransfer.files[0];
  if (!file) return;

  // Dosya bilgilerini görevle iliştir
  const task = tasks.find(t => t.id === selectedTask);
  if (task) {
    task.response = `Yüklenen Dosya: ${file.name}`;
    task.responded = true;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    document.getElementById("fileStatus").innerText = `✔️ ${file.name} başarıyla eklendi.`;
    renderTasks();
    renderResponses();
    selectedTask = null;
  }

  // Alanı gizle
  setTimeout(() => {
    document.getElementById("uploadBox").style.display = "none";
    document.getElementById("fileStatus").innerText = "";
  }, 2000);
});
let tasks = JSON.parse(localStorage.getItem("tasks")) || [], coins = parseInt(localStorage.getItem("coins")) || 0, selectedTask = null; document.getElementById("coins").innerText = coins;

