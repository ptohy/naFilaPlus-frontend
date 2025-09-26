# naFilaPlus — Frontend (HTML/CSS/JS)

Interface evoluída a partir do projeto original, seguindo os requisitos do MVP:
- Tela de **login** (autenticação via API externa).
- **Cadastro** de conteúdo (progresso inicia em 0% por requisito).
- **Listagem** com filtros (título, tipo, status).
- **Edição**/**Exclusão** via **modais** (sem `alert/prompt`).
- **Barra de progresso** visual + porcentagem.
- **Drag & Drop** com persistência de ordem (localStorage).
- **Estilo** seguindo as classes do projeto base.
- Botão **Sair** (só aparece logado, canto superior direito).

---

## 🔧 Pré‑requisitos
- Docker
- Backend rodando em `http://<host>:5000`

O frontend usa `const apiUrl = \`http://${location.hostname}:5000\`;` — ou seja, ele tenta falar com o **mesmo host** onde você acessa o frontend. Se o backend estiver em outro host, você pode:
- Acessar o frontend pelo mesmo host do backend, **ou**
- Ajustar `apiUrl` no `script.js` para o IP do backend (ex.: `http://192.168.50.218:5000`).

---

## 🚀 Build & Run
```bash
docker rm -f nafila-frontend 2>/dev/null || true
docker build -t nafila-frontend .
docker run -d --name nafila-frontend -p 8080:80 nafila-frontend

# Abra: http://localhost:8080
```

---

## 🔐 Credenciais de demonstração (conforme modo do backend)
- **DummyJSON (recomendado p/ avaliação):**
  - No campo **e‑mail**, digite o **username**.
  - **username:** `emilys`
  - **password:** `emilyspass`

- **ReqRes (padrão do backend):**
  - **e‑mail:** `eve.holt@reqres.in`
  - **senha:** `cityslicka`
  - *Observação:* o serviço pode retornar `401` dependendo de políticas; prefira DummyJSON para testes do MVP.

---

## 🧭 Fluxo de uso
1. Abra o frontend e faça **login**.
2. Cadastre um novo conteúdo (progresso inicia em **0%**).
3. Use filtros, edite/exclua via **modal**.
4. Clique **Concluir** para marcar 100%.
5. Reordene via **drag & drop** (a ordem fica salva no navegador).

---

## 📝 Notas
- Ordem dos cards é persistida apenas no navegador (escopo do MVP).
- Se for acessar em rede (ex.: Mac → VM), exponha as portas e garanta que o host do backend é alcançável no `:5000`.
