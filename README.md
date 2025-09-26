# naFilaPlus — Frontend (HTML/CSS/JS)

Interface baseada no projeto inicial, evoluída para cumprir os requisitos do MVP:

- **Login** contra backend (DummyJSON recomendado; ReqRes opcional no backend)
- **Cadastro** de conteúdo (progresso sempre inicia em **0**)
- **Lista com filtros** (título, tipo, status) e botão **Buscar** ao final
- **Edição/Exclusão** em **modal** acessível (sem `alert/prompt`)
- **Barra de progresso** + valor em %
- **Drag & Drop** dos cards com persistência da ordem (via `localStorage`)
- **Estilo** seguindo classes do projeto base
- **Botão “Sair”** (apenas logado, canto superior direito)

---

## 🔧 Pré‑requisitos
- Docker
- Backend rodando em `http://SEU_HOST:5000` (veja repositório do backend). **Recomendado: DummyJSON**

> O frontend autodetecta o host do backend como `http://{location.hostname}:5000`.
> - Se abrir `http://localhost:8080`, ele chamará `http://localhost:5000`.
> - Se abrir via IP da máquina (ex.: `http://192.168.X.Y:8080`), ele chamará `http://192.168.X.Y:5000`.

---

## 🚀 Build & Run (Docker)
```bash
docker rm -f nafila-frontend 2>/dev/null || true
docker build -t nafila-frontend .
docker run -d --name nafila-frontend -p 8080:80 nafila-frontend
# Abra: http://localhost:8080
```

---

## 🔐 Login (para avaliação do MVP)
Com o backend em **DummyJSON**:
- **username:** `emilys`
- **password:** `emilyspass`

> Se o backend estiver com `EXTERNAL_AUTH_MODE=reqres`, use:
> - **email:** `eve.holt@reqres.in`
> - **senha:** `cityslicka`  
> (pode falhar por políticas do serviço público; prefira DummyJSON para a banca)

---

## 🧭 Fluxo de uso
1. Acesse `http://localhost:8080` (ou `http://IP_DA_MAQUINA:8080` na rede).
2. Faça **login**.
3. Cadastre um conteúdo (título, tipo, status). **Progresso inicia em 0** automaticamente.
4. Edite/exclua via **modal**.
5. Clique **Concluir** para marcar 100%.
6. Reordene os cards com **drag and drop**.

---

## 🩺 Teste rápido do backend pela UI
Se a lista não carregar após login, teste o backend por terminal:
```bash
curl -s http://127.0.0.1:5000/health
curl -s -X POST http://127.0.0.1:5000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"emilys","password":"emilyspass"}'
```

---

## ❗Observações
- A ordem dos cards é persistida **apenas no navegador** (escopo de MVP).
- Para acesso por outros dispositivos na LAN, abra `http://IP_DA_MAQUINA:8080` e garanta o backend acessível em `http://IP_DA_MAQUINA:5000`.
