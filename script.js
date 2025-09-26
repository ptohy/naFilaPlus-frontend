let token = null;
const apiUrl = "http://localhost:5000";

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const res = await fetch(apiUrl + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok) {
    token = data.token;
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
    loadContents();
  } else {
    document.getElementById("loginMsg").innerText = "Falha no login";
  }
}

async function loadContents() {
  const res = await fetch(apiUrl + "/contents");
  const data = await res.json();
  const list = document.getElementById("contentList");
  list.innerHTML = "";
  data.forEach(c => {
    const li = document.createElement("li");
    li.textContent = `${c.title} (${c.tipo}) - ${c.status} [${c.progresso}%]`;

    // Botão editar
    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.onclick = () => editContent(c.id);
    li.appendChild(editBtn);

    // Botão excluir
    const delBtn = document.createElement("button");
    delBtn.textContent = "Excluir";
    delBtn.onclick = () => deleteContent(c.id);
    li.appendChild(delBtn);

    list.appendChild(li);
  });
}

async function addContent() {
  const title = document.getElementById("title").value;
  const tipo = document.getElementById("tipo").value;
  const status = document.getElementById("status").value;
  const progresso = document.getElementById("progresso").value;
  await fetch(apiUrl + "/contents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, tipo, status, progresso })
  });
  loadContents();
}

async function editContent(id) {
  const title = prompt("Novo título:");
  const tipo = prompt("Novo tipo:");
  const status = prompt("Novo status:");
  const progresso = prompt("Novo progresso (%):");
  if (!title || !tipo || !status) return;
  await fetch(apiUrl + "/contents/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, tipo, status, progresso })
  });
  loadContents();
}

async function deleteContent(id) {
  await fetch(apiUrl + "/contents/" + id, { method: "DELETE" });
  loadContents();
}
