# Requisitos do Produto — AchaDO

← [Voltar ao README](../README.md)

---

Este documento descreve **o que** o AchaDO se propõe a resolver, **para quem**, e **quais funcionalidades** ele entrega. A seção [Regras do produto](#regras-do-produto) reúne todas as regras e restrições do produto em um único lugar. Para detalhes sobre **como** isso é implementado tecnicamente, consulte o [documento de arquitetura](./ARCHITECTURE.md).

## Visão do produto

O **AchaDO** é uma aplicação desktop pessoal que coleta, indexa e monitora automaticamente o Diário Oficial da União e os Diários Oficiais dos estados de Rondônia, Acre e Mato Grosso. O usuário define os termos que importam para ele — nomes, CPFs, números de edital, cargos, órgãos — e recebe um aviso por e-mail assim que esses termos aparecem em qualquer publicação oficial dentro desse escopo.

A premissa é eliminar o trabalho braçal de visitar dezenas de portais diferentes, baixar PDFs manualmente e fazer buscas uma a uma. O AchaDO faz isso por você, todos os dias, em segundo plano.

## Para quem é

O AchaDO é construído pensando em **concurseiros** — quem estuda para concursos públicos e precisa acompanhar de perto:

- **Editais de abertura** de novos certames nos órgãos e cargos de interesse
- **Retificações de edital** (mudanças de cronograma, conteúdo programático, vagas)
- **Convocações** para provas, perícias médicas, avaliação de títulos e procedimentos de heteroidentificação
- **Resultados** preliminares, recursos e definitivos em cada fase
- **Homologações** do resultado final
- **Nomeações** dos aprovados em concursos já realizados
- **Prorrogações de validade** de concursos já homologados

Também é útil para quem precisa monitorar publicações oficiais por outros motivos: advogados acompanhando intimações, empresas seguindo licitações, jornalistas investigando atos públicos, ou qualquer pessoa interessada em ser notificada quando seu nome (ou de alguém próximo) aparecer no Diário Oficial.

## O problema

Quem presta concurso público no Brasil vive em alerta. Editais surgem sem aviso, retificações alteram regras a poucos dias da prova, convocações têm prazos curtos e fáceis de perder, e cada órgão publica suas decisões em um diário diferente — federal, estadual, municipal, do tribunal, da assembleia.

Hoje, acompanhar tudo isso significa:

- Visitar manualmente dezenas de portais distintos, cada um com layout próprio.
- Baixar PDFs gigantes e usar Ctrl+F para procurar termos relevantes.
- Refazer essa rotina todos os dias úteis, sob risco de perder um prazo.
- Confiar em terceiros (sites agregadores, grupos de WhatsApp) que podem atrasar ou filtrar a informação.

O AchaDO automatiza esse trabalho de vigilância. O usuário define o que quer ser avisado, e a aplicação cuida do resto.

## Como funciona (visão de produto)

O AchaDO é organizado em quatro componentes que trabalham em conjunto. Esta é a visão funcional; a visão técnica detalhada está no [documento de arquitetura](./ARCHITECTURE.md).

**Coletor.** Todos os dias úteis, baixa automaticamente as edições publicadas nas fontes oficiais configuradas — começando pelo Diário Oficial da União (DOU) e expandindo gradualmente para diários estaduais e municipais.

**Indexador.** Extrai o texto integral de cada publicação (incluindo PDFs com OCR quando necessário) e constrói um índice de busca rápido, permitindo localizar qualquer termo em segundos mesmo em arquivos volumosos.

**Monitor.** Compara as publicações recém-indexadas contra a lista de termos de interesse do usuário. Cada termo pode ser configurado com filtros adicionais (órgão emissor, seção do diário, expressões obrigatórias e proibidas para reduzir falsos positivos).

**Notificador.** Quando encontra correspondências, envia um e-mail consolidado ao usuário com os trechos relevantes, links diretos para a publicação original e a opção de arquivar ou marcar como lido.

## Regras do produto

Esta seção reúne todas as regras que governam o comportamento do AchaDO. São não-negociáveis dentro do escopo atual — qualquer mudança exige decisão de produto explícita.

---

### Fontes monitoradas

**R01.** O AchaDO monitora **exclusivamente** quatro fontes oficiais:

| Esfera | Fonte | Sigla |
|---|---|---|
| Federal | Diário Oficial da União | DOU |
| Estadual | Diário Oficial do Estado de Rondônia | DOE-RO |
| Estadual | Diário Oficial do Estado do Acre | DOE-AC |
| Estadual | Diário Oficial do Estado de Mato Grosso | DOE-MT |

**R02.** Adicionar qualquer outra fonte — outro estado, município, autarquia, Diário da Justiça ou tribunal — exige desenvolvimento novo e decisão explícita de produto. Não é configuração de usuário.

---

### Coleta e processamento

**R03.** Nenhum PDF é armazenado em disco. O DOU é coletado via HTML por ato individual (ou API pública); os DOEs são baixados em memória, processados e descartados após indexação.

**R04.** A mesma edição nunca é reprocessada. Deduplicação é feita por hash SHA-256 do conteúdo — detecta republicações e URLs alternativas para o mesmo material.

**R05.** Falha em uma fonte não interrompe a coleta das demais. Cada fonte roda de forma independente no mesmo ciclo.

**R06.** Em falha de rede, o coletor tenta novamente com backoff exponencial (4 tentativas, intervalo inicial de 30 s). Se persistir, a fonte é marcada como `quebrada` e o ciclo continua.

---

### Termos de busca

**R07.** O usuário pode cadastrar **quantos termos quiser**, sem limite. Exemplos válidos: o próprio nome, CPF, nome de concorrentes, número de um edital, cargo ou órgão de interesse — cada um como um termo separado.

**R08.** Cada termo é monitorado de forma **independente**. Encontrar "João Silva" e não encontrar "Maria Souza" no mesmo dia gera match apenas para o primeiro — os termos não têm relação entre si.

**R09.** Cada termo pertence a um dos três tipos: **keyword** (palavra ou conjunto de palavras), **frase exata** (correspondência literal incluindo ordem) ou **regex** (expressão regular).

**R10.** Cada termo pode ter filtros opcionais: órgão emissor, seção do diário, lista de palavras obrigatórias (todas precisam estar presentes) e lista de palavras proibidas (nenhuma pode estar presente). Filtros reduzem falsos positivos sem alterar o tipo do termo.

**R11.** Um match em qualquer termo já gera notificação. O digest do dia consolida todos os termos que tiveram achados — o usuário recebe tudo em um único e-mail, organizado por termo.

**R12.** Termos podem ser ativados e desativados sem serem excluídos. Um termo inativo não é avaliado no ciclo, mas preserva seu histórico de matches.

---

### Notificação

**R13.** Os matches do dia são consolidados em um único e-mail digest enviado ao final do ciclo diário. Não há e-mail por match individual.

**R14.** Cada match é notificado exatamente uma vez. Um match só é incluído em um digest; uma vez vinculado a uma notificação enviada, não aparece novamente.

**R15.** Falha no envio do e-mail não descarta os matches. Eles permanecem pendentes e são incluídos na próxima tentativa (próximo ciclo ou reenvio manual).

**R16.** O e-mail inclui, para cada match: o termo que disparou, o trecho contextual (~300 caracteres ao redor da ocorrência), o órgão emissor, a data da edição e o link direto para a publicação original no portal da fonte.

---

### Execução e agendamento

**R17.** O AchaDO se registra na inicialização do Windows ao ser instalado. O usuário não precisa abrir o aplicativo manualmente — ele sobe automaticamente com o sistema.

**R18.** A rotina diária executa inteiramente em segundo plano, com o painel fechado. Abrir o painel no navegador é opcional e não afeta a execução.

**R19.** Se o computador estava desligado no horário do ciclo programado, o job é executado imediatamente ao ligar o PC e iniciar o aplicativo — mesmo que seja horas depois do horário original. Nenhum dia útil é perdido por conta de o PC ter ficado desligado.

**R20.** O ciclo diário executa **no máximo uma vez por dia**. Múltiplos reinicios do PC no mesmo dia não disparam múltiplas execuções. Execuções manuais pelo Dashboard não contam como o ciclo automático do dia.

**R21.** Falhas em um ciclo não impedem o ciclo seguinte. O aplicativo nunca trava em estado de erro — registra a falha, sinaliza no ícone da bandeja e segue em espera.

---

### Privacidade e dados

**R22.** Todos os dados (banco, índice, histórico, termos) ficam exclusivamente no computador do usuário. Não há servidor central, nuvem ou coleta de dados.

**R23.** A senha do SMTP é armazenada no chaveiro nativo do sistema operacional (Credential Manager no Windows). Nunca é gravada em texto claro no banco ou em arquivos de configuração.

**R24.** As únicas conexões externas realizadas pelo AchaDO são: requisições aos portais dos Diários Oficiais (entrada de dados) e envio de e-mail via SMTP configurado pelo usuário (saída de notificações).

---

### Fora do escopo

**R25.** Diários Oficiais de qualquer estado que não RO, AC ou MT.

**R26.** Diários Oficiais municipais (capitais ou demais municípios).

**R27.** Diários da Justiça (federal, estaduais ou de tribunais superiores).

**R28.** Versão SaaS, hospedada ou multi-tenant.

**R29.** Análise ou interpretação jurídica do conteúdo encontrado.

**R30.** Integração com plataformas pagas de monitoramento de Diários Oficiais.

**R31.** Distribuição como serviço comercial.

**R32.** Dependência de qualquer serviço pago para funcionar.

---

## Requisitos funcionais

### MVP — primeira versão utilizável

- [ ] Coleta automatizada do Diário Oficial da União (Seções 1, 2 e 3)
- [ ] Indexação de texto completo das edições baixadas
- [ ] Cadastro de termos de busca por usuário (palavra-chave, frase exata, expressão regular)
- [ ] Verificação diária e envio de e-mail com os achados do dia
- [ ] Interface desktop simples para gerenciar termos e visualizar resultados, composta por quatro telas no painel local (`localhost`):
  - **Dashboard** — status do último ciclo (data/hora, fontes coletadas, quantidade de matches, erros), com botão para forçar execução manual.
  - **Termos** — CRUD de termos de busca (cadastrar, editar, ativar/desativar, excluir), com campo de tipo (keyword / frase / regex) e filtros opcionais.
  - **Achados** — histórico de matches pesquisável e filtrável por termo, fonte, data e status ("novo", "lido", "arquivado"); exibe trecho destacado e link para edição original.
  - **Configurações** — SMTP (host, porta, usuário; senha gerenciada pelo chaveiro do SO), horário da rotina diária e preferências de notificação.
- [ ] Histórico local pesquisável das edições baixadas

### Roadmap pós-MVP

- [ ] Coleta do Diário Oficial do Estado de Rondônia (DOE-RO)
- [ ] Coleta do Diário Oficial do Estado do Acre (DOE-AC)
- [ ] Coleta do Diário Oficial do Estado de Mato Grosso (DOE-MT)
- [ ] Categorização automática de publicações (edital, retificação, convocação, resultado, nomeação)
- [ ] Alertas em tempo real (push) para termos críticos, sem esperar o digest diário
- [ ] Compartilhamento de listas de termos entre usuários do mesmo grupo de estudos
- [ ] Aplicativo móvel companheiro para receber e marcar notificações
- [ ] Modo offline com banco local completo para consultas históricas

## Métricas de sucesso

Indicadores que servem para avaliar se o produto está cumprindo seu propósito:

- **Cobertura de coleta diária.** Percentual de dias úteis em que o coletor concluiu o pipeline sem falha crítica para o DOU.
- **Latência de notificação.** Tempo médio entre a publicação de uma edição e o e-mail chegar ao usuário (alvo do MVP: < 4 horas).
- **Taxa de falsos positivos.** Proporção de matches notificados que o usuário marca como irrelevantes.
- **Achados úteis confirmados pelo usuário.** Quantidade de matches que o usuário marca como acionáveis (ex.: "isso era um edital de interesse").

## Riscos e mitigações

Portais de Diários Oficiais são fontes externas fora do controle do produto. Os principais riscos operacionais e as estratégias de mitigação adotadas:

| Risco | Probabilidade | Mitigação |
|---|---|---|
| **Mudança de layout ou URL** do portal | Alta (acontece todo ano) | Adapters isolados por fonte: corrigir um não afeta os outros; falha reportada no Dashboard sem interromper demais fontes. |
| **Indisponibilidade temporária** do portal | Média | Retry com backoff exponencial (4 tentativas). Se persistir, ciclo segue sem a fonte e registra falha no log. |
| **CAPTCHA ou bloqueio de bots** | Baixa–Média | O AchaDO acessa as mesmas URLs públicas que qualquer navegador; se bloqueado, a mitigação é manual (ajuste de headers, intervalo entre requests). Não há solução automatizada — o usuário é avisado pelo Dashboard. |
| **Remoção ou mudança de API** do DOU | Baixa | O DOU possui API pública documentada (diariooficial.gov.br); o Adapter monitora essa API como fonte primária, com fallback para scraping direto. |
| **PDF corrompido ou ilegível** | Baixa | A edição é marcada como `falhou` e não bloqueia o pipeline; o usuário pode re-acionar manualmente. |

**O que não está mitigado no MVP:** mudanças que exijam resolução de CAPTCHA interativo (ex.: reCAPTCHA v2 com desafio visual) bloqueiam a coleta daquela fonte até correção manual. Isso é aceito como limitação da premissa de "sem dependência de serviços pagos".

---

← [Voltar ao README](../README.md) · [Arquitetura →](./ARCHITECTURE.md)
