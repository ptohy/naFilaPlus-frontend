# naFilaPlus — Frontend (HTML/CSS/JS)

Interface baseada no projeto inicial, evoluída para cumprir os requisitos do MVP:
- **Login** com API externa (ReqRes) ou **bypass** para testes
- **Form** de novo conteúdo com validação
- **Lista** de conteúdos com filtros
- **Edição** e **exclusão** via **modal** (sem `alert`/`prompt`)
- **Barra de progresso** + valor em %
- **Drag and Drop** com persistência de ordem (localStorage)
- **Estilo**: classes do projeto base
- **Botão "Sair"** (limpa sessão e volta para o login)

## Como rodar (Docker)
```bash
docker rm -f nafila-frontend 2>/dev/null || true
docker build -t nafila-frontend .
docker run -d --name nafila-frontend -p 8080:80 nafila-frontend
# Abra: http://localhost:8080
```

> O frontend espera o backend em `http://SEU_HOST:5000` (detecta `location.hostname`).

## Credenciais de demonstração (requisito de "como testar")
Use o serviço de teste **ReqRes** (padrão do backend):
- **E-mail:** `eve.holt@reqres.in`
- **Senha:** `cityslicka`
- **API Key (se o backend exigir):** valor de `EXTERNAL_AUTH_API_KEY` (ex.: `demo123`)

> Se o backend estiver com `BYPASS_EXTERNAL_AUTH=1`, **qualquer e-mail/senha** funcionam (apenas para desenvolvimento).

## Fluxo de uso
1. Acesse `http://localhost:8080`
2. Faça **login** com as credenciais acima
3. Adicione um conteúdo (título, tipo, status, progresso)
4. Edite/exclua via **modal**
5. Use **Concluir** para marcar como concluído (100%)
6. Reordene com **drag and drop**

## Observações
- A ordem é persistida somente no navegador (não no backend), conforme escopo de MVP.
- Para redes diferentes, garanta acesso ao `:5000` do backend.
