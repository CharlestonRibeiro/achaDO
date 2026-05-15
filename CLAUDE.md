# CLAUDE.md — AchaDO

Guia de referência rápida para desenvolvimento assistido por IA. Para contexto completo, consulte [`docs/PRD.md`](docs/PRD.md) e [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## Comandos

```bash
# Rodar a aplicação
python -m achado

# Testes com cobertura (obrigatório: 100%)
pytest --cov=achado --cov-report=term-missing --cov-fail-under=100

# Lint e formatação
ruff check src/
ruff format src/

# Build do executável
pyinstaller achado.spec
```

---

## Arquitetura

Aplicação desktop Python, monolítica, local. Nenhum servidor central. Quatro componentes principais coordenados pelo agendador:

| Componente | Pacote | Responsabilidade |
|---|---|---|
| Coletor | `achado/collector/` | Download por fonte (DOU via HTML/API; DOEs via PDF em memória) |
| Indexador | `achado/indexer/` | Extração de texto e população do FTS5 |
| Monitor | `achado/monitor/` | Matching de termos contra publicações indexadas |
| Notificador | `achado/notifier/` | Montagem e envio do digest de e-mail |
| Agendador | `achado/scheduler/` | Coordena o pipeline diário via APScheduler |
| Painel | `achado/panel/` | Interface FastAPI em localhost |
| Bandeja | `achado/tray/` | Ícone pystray e menu de contexto |

Diagrama completo e fluxo de sequência: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## Restrições críticas

Estas decisões não são óbvias e causam bugs silenciosos se ignoradas.

**Coleta:**
- Nunca gravar PDF em disco. DOU → HTML em memória; DOEs → bytes de PDF em memória, descartados após indexação.
- Calcular SHA-256 do conteúdo antes de inserir qualquer edição. Se o hash já existe em `EDICAO`, ignorar — não reprocessar.

**Caminhos:**
- Nunca hardcodar caminhos. Sempre usar `platformdirs.user_data_dir("AchaDO")`. No Windows resolve para `%APPDATA%\AchaDO\`.

**Credenciais:**
- Senha SMTP armazenada exclusivamente via `keyring`. Nunca gravar em texto claro no banco ou em qualquer arquivo.

**Busca:**
- FTS5 configurado com tokenizer `unicode61` e `remove_diacritics=2` (buscas insensíveis a acentos).
- Termos do tipo `regex` usam `re.search()` em Python como pós-filtro sobre candidatos do FTS5. Nunca usar `LIKE` do SQLite para regex.

**Agendamento:**
- APScheduler configurado com `coalesce=True` e `misfire_grace_time=None`. Jobs perdidos (PC desligado) devem ser executados ao inicializar — nunca descartados.

**Adapters:**
- Cada fonte tem sua própria classe em `collector/` implementando `collector/base.py`. Adicionar uma nova fonte = novo arquivo. Nunca modificar adapters existentes para acomodar outra fonte.

---

## Git

- **Nunca commitar diretamente na `main`.** A `main` só recebe código via merge da `develop`. Commits diretos na `main` são proibidos.
- **`develop` é a branch de trabalho padrão.** Todo desenvolvimento acontece na `develop` ou em branches de funcionalidade que partem dela.
- **Uma branch por funcionalidade.** Nomenclatura: `feature/<nome-curto>` (ex.: `feature/dou-adapter`, `feature/fts5-indexer`). A branch parte de `develop` e volta para `develop` via merge.
- **Commit a cada mudança.** Não acumular mudanças não commitadas. Mensagens em português, no imperativo (ex.: `Adiciona adapter do DOU`, `Corrige dedup por hash`).
- **Merge `develop` → `main` somente quando estável.** A `main` deve sempre estar em estado funcional com testes passando e cobertura em 100%.

```bash
# Fluxo padrão para uma funcionalidade
git checkout develop
git checkout -b feature/<nome>
# ... desenvolve, testa, documenta ...
git add <arquivos>
git commit -m "Verbo + descrição"
git checkout develop
git merge feature/<nome>

# Quando develop está estável: merge para main
git checkout main
git merge develop
git push origin main
git push origin develop
```

---

## Testes

- **Cobertura obrigatória: 100%.** O comando `pytest --cov-fail-under=100` deve passar antes de qualquer commit.
- **Atualizar testes a cada mudança de comportamento.** Se uma função muda, o teste correspondente muda junto — no mesmo commit.
- **Banco em memória nos testes.** Usar fixture `conftest.py` com SQLite `:memory:` para isolar os testes do banco real.
- **Adapters testados com respostas mockadas.** Nunca fazer requisições reais à internet nos testes — mockar `httpx` e `playwright`.
- Os testes ficam em `tests/` espelhando a estrutura de `src/achado/`.

```bash
# Rodar testes com relatório de cobertura
pytest --cov=achado --cov-report=term-missing --cov-fail-under=100

# Rodar apenas um módulo
pytest tests/collector/test_dou.py -v
```

---

## Documentação

- **Atualizar a cada mudança relevante.** Qualquer alteração técnica reflete em [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md); qualquer alteração de comportamento ou regra de produto reflete em [`docs/PRD.md`](docs/PRD.md).
- **Mudanças neste arquivo (`CLAUDE.md`) seguem a mesma regra** — se uma convenção muda, atualizar aqui antes de commitar.
- A documentação e o código andam no mesmo commit. Nunca commitar código sem a documentação correspondente atualizada.

| Tipo de mudança | Documento a atualizar |
|---|---|
| Nova decisão técnica, novo componente, mudança de stack | `docs/ARCHITECTURE.md` |
| Nova regra de produto, mudança de escopo, novo requisito | `docs/PRD.md` |
| Nova convenção de desenvolvimento, novo comando | `CLAUDE.md` |
