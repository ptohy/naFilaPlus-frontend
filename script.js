const resolvedHost = (location.hostname === 'localhost' || location.hostname === '::1')
  ? '127.0.0.1'
  : location.hostname;
const apiUrl = `${location.protocol}//${resolvedHost}:5000`;

let token = localStorage.getItem('nf_token') || null;
let contentsCache = [];
let editingId = null;
let deletingId = null;
let dragId = null;

const $  = (id) => document.getElementById(id);
const esc = (s) => (s ?? '').toString().replace(/[&<>"']/g, m => (
  {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]
));
const clamp = (n, min=0, max=100) => Math.max(min, Math.min(max, Number(n || 0)));

function showToast(msg, type='success', ms=2200){
  const root = $('toastRoot');
  if(!root) return alert(msg);
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  root.appendChild(el);
  setTimeout(()=>{
    el.style.opacity='0';
    el.style.transform='translateY(6px)';
    setTimeout(()=>el.remove(), 160);
  }, ms);
}

function normalizeStatus(s){ return s === 'fazendo' ? 'em_progresso' : s; }
function statusLabel(s){
  s = normalizeStatus(s);
  return s==='pendente' ? 'Pendente'
       : s==='em_progresso' ? 'Em progresso'
       : s==='concluido' ? 'Concluído'
       : s;
}

function setAuthState(isAuthed){
  const loginBox = $('loginBox');
  const appBox   = $('app');
  if (loginBox) loginBox.style.display = isAuthed ? 'none' : 'block';
  if (appBox)   appBox.style.display   = isAuthed ? 'block' : 'none';
  const logoutBtn = $('logoutBtn');
  if (logoutBtn) logoutBtn.hidden = !isAuthed;
}

async function login(e){
  e?.preventDefault?.();
  const email = $('email')?.value?.trim() || '';
  const password = $('password')?.value?.trim() || '';

  if(!email || !password){
    showToast('Preencha e-mail/usuário e senha', 'error');
    return;
  }
  try{
    const res = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ email, password })
    });
    const data = await res.json().catch(()=>({}));
    if(!res.ok){
      showToast(data?.details?.message || data?.error || 'Falha no login', 'error');
      return;
    }
    token = data.token || 'dev-local';
    localStorage.setItem('nf_token', token);
    setAuthState(true);
    await loadContents();
    showToast('Login OK');
  }catch{
    showToast('Erro de rede', 'error');
  }
}

function logout(){
  try{ localStorage.removeItem('nf_token'); }catch(e){}
  token = null;
  setAuthState(false);
  showToast('Sessão encerrada');
}

function applySavedOrder(){
  const order = JSON.parse(localStorage.getItem('nf_order') || '[]');
  if(!order.length) return;
  contentsCache.sort((a,b) => {
    const ia = order.indexOf(a.id);
    const ib = order.indexOf(b.id);
    return (ia === -1 ? 1e9 : ia) - (ib === -1 ? 1e9 : ib);
  });
}

async function loadContents(params={}){
  const q = new URLSearchParams();
  if(params.status) q.set('status', params.status);
  if(params.tipo)   q.set('tipo', params.tipo);

  const res = await fetch(`${apiUrl}/contents${q.toString()?`?${q}`:''}`, { cache: 'no-store' });
  const data = await res.json().catch(()=>[]);
  contentsCache = (Array.isArray(data)? data : []).map(it => ({...it, status: normalizeStatus(it.status)}));
  applySavedOrder();
  renderList();
}

function applyFilters(e){
  e?.preventDefault?.();
  const s     = $('search-input')?.value?.trim().toLowerCase() || '';
  const tipo  = $('filter-type')?.value || '';
  const status= $('filter-status')?.value || '';

  loadContents({ tipo: tipo || undefined, status: status || undefined }).then(() => {
    let list = contentsCache;
    if(s) list = list.filter(it => (it.title || '').toLowerCase().includes(s));
    renderList(list);
  });
}

function renderList(list=contentsCache){
  const ul = $('contentList');
  if(!ul) return;

  ul.innerHTML = '';
  if(!list.length){
    const li = document.createElement('li');
    li.className = 'item-card';
    li.innerHTML = '<em>Sem conteúdos.</em>';
    ul.appendChild(li);
    return;
  }

  for(const item of list){
    const progresso = clamp(item.progresso);
    const li = document.createElement('li');
    li.className = 'item-card' + (item.status==='concluido' ? ' concluido' : '');
    li.setAttribute('draggable', 'true');
    li.dataset.id = item.id;

    li.innerHTML = `
      <strong class="item-title">${esc(item.title)}</strong>
      <p class="item-meta"><small>Tipo:</small> ${esc(item.tipo)} &nbsp;&nbsp; <small>Status:</small> ${statusLabel(item.status)}</p>
      <div class="row-progress" aria-label="Progresso">
        <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progresso}">
          <div class="progress-fill" style="width:${progresso}%"></div>
        </div>
        <span class="progress-text">${progresso}%</span>
      </div>
      <div class="item-card-actions">
        <button type="button" class="btn complete-btn" data-action="complete" data-id="${item.id}">Concluir</button>
        <button type="button" class="btn" data-action="edit" data-id="${item.id}">Editar</button>
        <button type="button" class="btn delete-btn" data-action="delete" data-id="${item.id}">Excluir</button>
      </div>`;

    // Drag & drop
    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragover', handleDragOver);
    li.addEventListener('drop', handleDrop);
    li.addEventListener('dragend', handleDragEnd);

    ul.appendChild(li);
  }
}

function handleDragStart(e){
  dragId = Number(e.currentTarget.dataset.id);
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', String(dragId));
}
function handleDragOver(e){
  e.preventDefault();
  const over = e.currentTarget;
  const dragging = document.querySelector('.item-card.dragging');
  if(!dragging || over === dragging) return;

  const ul = $('contentList');
  const rect = over.getBoundingClientRect();
  const isAfter = (e.clientY - rect.top) > rect.height / 2;
  if(isAfter){ ul.insertBefore(dragging, over.nextSibling); }
  else { ul.insertBefore(dragging, over); }
}
function handleDrop(e){
  e.preventDefault();
  const toId = Number(e.currentTarget.dataset.id);
  if(dragId == null || dragId === toId) return;

  const fromIdx = contentsCache.findIndex(x => x.id === dragId);
  const toIdx   = contentsCache.findIndex(x => x.id === toId);
  if(fromIdx === -1 || toIdx === -1) return;

  const [moved] = contentsCache.splice(fromIdx, 1);
  contentsCache.splice(toIdx, 0, moved);
  localStorage.setItem('nf_order', JSON.stringify(contentsCache.map(x => x.id)));
}
function handleDragEnd(e){
  e.currentTarget.classList.remove('dragging');
  renderList();
}

async function addContent(e){
  e?.preventDefault?.();
  const title = $('title')?.value?.trim() || '';
  const tipo  = $('tipo')?.value || 'livro';
  let   status= $('status')?.value || 'pendente';

  // requisito: progresso SEMPRE 0 ao criar
  const progresso = 0;

  if (status === 'fazendo') status = 'em_progresso';
  if (title.length < 3){ showToast('Título muito curto','error'); return; }

  const res = await fetch(`${apiUrl}/contents`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    cache:'no-store',
    body: JSON.stringify({ title, tipo, status, progresso })
  });

  if(!res.ok){
    const err = await res.json().catch(()=>({}));
    showToast(err.error || 'Erro ao criar','error');
    return;
  }

  $('newForm')?.reset();
  await loadContents();
  showToast('Criado!');
}

function openEdit(id){
  const it = contentsCache.find(x => x.id === id);
  if(!it) return;
  editingId = id;
  $('edit-title').value      = it.title || '';
  $('edit-tipo').value       = it.tipo || 'livro';
  $('edit-status').value     = normalizeStatus(it.status) || 'pendente';
  $('edit-progresso').value  = clamp(it.progresso);
  setModalOpen(true);
}

function setModalOpen(open){
  const m = $('editModal');
  if(!m) return;
  m.setAttribute('aria-hidden', open ? 'false' : 'true');
  if(open){
    const escH = (e)=>{ if(e.key === 'Escape') closeModal(); };
    const outH = (e)=>{ if(e.target === m) closeModal(); };
    m._escHandler = escH;
    m._outsideHandler = outH;
    document.addEventListener('keydown', escH);
    m.addEventListener('click', outH);
    setTimeout(()=> $('edit-title')?.focus(), 80);
  }else{
    document.removeEventListener('keydown', m._escHandler||(()=>{}));
    m.removeEventListener('click', m._outsideHandler||(()=>{}));
  }
}
function closeModal(){ setModalOpen(false); editingId = null; }

async function saveEdit(){
  if(!editingId) return;
  const btn = $('saveEditBtn');
  const title = $('edit-title')?.value?.trim() || '';
  const tipo  = $('edit-tipo')?.value || 'livro';
  let   status= $('edit-status')?.value || 'pendente';
  const progresso = clamp($('edit-progresso')?.value);

  if(status === 'fazendo') status = 'em_progresso';
  if(title.length < 3){ showToast('Título muito curto', 'error'); return; }

  if(btn){ btn.disabled = true; var prev = btn.textContent; btn.textContent = 'Salvando...'; }
  try{
    const res = await fetch(`${apiUrl}/contents/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type':'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ title, tipo, status, progresso })
    });
    if(!res.ok){
      const err = await res.json().catch(()=>({}));
      showToast(err.error || 'Erro ao salvar', 'error');
      return;
    }
    await loadContents();
    closeModal();
    showToast('Atualizado!');
  }catch{
    showToast('Erro de rede', 'error');
  }finally{
    if(btn){ btn.disabled = false; btn.textContent = prev; }
  }
}

function openDelete(id){
  const it = contentsCache.find(x => x.id === id);
  if(!it) return;
  deletingId = id;
  $('del-title').textContent = it.title || '';
  setDeleteModal(true);
}
function setDeleteModal(open){
  const m = $('deleteModal');
  if(!m) return;
  m.setAttribute('aria-hidden', open ? 'false' : 'true');
  if(open){
    const escH = (e)=>{ if(e.key === 'Escape') closeDeleteModal(); };
    const outH = (e)=>{ if(e.target === m) closeDeleteModal(); };
    m._escHandler = escH;
    m._outsideHandler = outH;
    document.addEventListener('keydown', escH);
    m.addEventListener('click', outH);
    setTimeout(()=> $('confirmDeleteBtn')?.focus(), 60);
  }else{
    document.removeEventListener('keydown', m._escHandler||(()=>{}));
    m.removeEventListener('click', m._outsideHandler||(()=>{}));
  }
}
function closeDeleteModal(){ setDeleteModal(false); deletingId = null; }

async function confirmDelete(){
  if(!deletingId) return;
  const btn = $('confirmDeleteBtn');
  if(btn) btn.disabled = true;
  try{
    const res = await fetch(`${apiUrl}/contents/${deletingId}`, { method: 'DELETE', cache: 'no-store' });
    if(!res.ok){
      const err = await res.json().catch(()=>({}));
      showToast(err.error || 'Erro ao excluir', 'error');
      if(btn) btn.disabled = false;
      return;
    }
    await loadContents();
    closeDeleteModal();
    showToast('Excluído!');
  }catch{
    showToast('Erro de rede', 'error');
  }finally{
    if(btn) btn.disabled = false;
  }
}

async function markDone(id){
  const it = contentsCache.find(x => x.id === id);
  if(!it) return;
  const res = await fetch(`${apiUrl}/contents/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type':'application/json' },
    cache: 'no-store',
    body: JSON.stringify({ ...it, status:'concluido', progresso: 100 })
  });
  if(!res.ok){
    showToast('Erro ao concluir', 'error');
    return;
  }
  await loadContents();
  showToast('Concluído!');
}

document.addEventListener('DOMContentLoaded', async () => {
  // Estado auth inicial
  setAuthState(!!token);
  if(token){ await loadContents(); }

  // Login/Logout
  $('loginForm')?.addEventListener('submit', login);
  $('logoutBtn')?.addEventListener('click', logout);

  // Novo conteúdo
  $('newForm')?.addEventListener('submit', addContent);

  // Filtros
  $('filterForm')?.addEventListener('submit', applyFilters);
  $('filter-type')?.addEventListener('change', applyFilters);
  $('filter-status')?.addEventListener('change', applyFilters);
  $('search-input')?.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){ applyFilters(e); }
  });

  // Delegação de eventos nos cards
  $('contentList')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if(!btn) return;
    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;
    if(action === 'complete')      markDone(id);
    else if(action === 'edit')     openEdit(id);
    else if(action === 'delete')   openDelete(id);
  });

  // Modal Edit
  $('saveEditBtn')?.addEventListener('click', saveEdit);
  document.querySelector('[data-close-edit]')?.addEventListener('click', closeModal);

  // Modal Delete
  $('confirmDeleteBtn')?.addEventListener('click', confirmDelete);
  $('cancelDeleteBtn')?.addEventListener('click', closeDeleteModal);
  document.querySelector('[data-close-delete]')?.addEventListener('click', closeDeleteModal);
});

Object.assign(window, {
  login, logout, addContent,
  openEdit, saveEdit, openDelete, confirmDelete,
  closeModal, closeDeleteModal, applyFilters, markDone
});
