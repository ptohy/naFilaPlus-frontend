# naFilaPlus — Frontend (HTML/CSS/JS)

Interface web evoluída a partir do projeto base, atendendo ao MVP:
- **Login** usando o backend (DummyJSON no servidor)
- **Cadastro** de conteúdo (progresso inicia em **0**)
- **Lista** com filtros por título/tipo/status
- **Edição** e **exclusão** via **modais** (sem alert/prompt)
- **Barra de progresso** + valor em %
- **Drag and Drop** com persistência local (localStorage)
- **Estilos** seguindo as classes do projeto base
- **Botão “Sair”** (limpa sessão e retorna ao login)

---

## 🔧 Pré‑requisitos
- Docker
- Backend rodando em `http://SEU_HOST:5000` (o frontend detecta automaticamente `location.hostname`)

---

## 🚀 Como rodar (Docker)
```bash
docker rm -f nafila-frontend 2>/dev/null || true
docker build -t nafila-frontend .
docker run -d --name nafila-frontend -p 8080:80 nafila-frontend

# Abra: http://localhost:8080
```

---

## 🔐 Credenciais para teste (DummyJSON)
- **username:** `emilys`
- **password:** `emilyspass`

> O campo “Email” aceita **username** também (compatível com o backend atual).

---

## 🧭 Fluxo de uso
1. Acesse `http://localhost:8080`.
2. Faça **login** com as credenciais acima.
3. Adicione um conteúdo (título, tipo, status) — o **progresso inicia em 0%**.
4. Edite/exclua via **modal**.
5. Clique em **Concluir** para marcar 100%.
6. Reordene com **drag and drop** (ordem salva no navegador).

---

## ℹ️ Observações
- A ordem é persistida apenas no navegador (MVP).
- Certifique‑se de que o backend está acessível na porta **5000** do mesmo host.
