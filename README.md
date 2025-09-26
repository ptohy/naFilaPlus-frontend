# naFilaPlus — Frontend (HTML/CSS/JS)

Interface web evoluída a partir do projeto base, atendendo ao MVP:
- **Login** usando o backend (DummyJSON no servidor)
- **Cadastro** de conteúdo
- **Lista** com filtros por título/tipo/status
- **Edições** e **exclusão** via **modais**

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

---

## 🧭 Fluxo de uso
1. Acesse `http://localhost:8080`.
2. Faça **login** com as credenciais acima.
3. Adicione um conteúdo (título, tipo, status)
4. Edite/exclua **se necessário**.
5. Clique em **Concluir** para marcar 100% de progresso.
6. Reordene com **drag and drop** (ordem salva no navegador).

---

## ℹ️ Observações
- Certifique‑se de que o backend está acessível na porta **5000** do mesmo host.
