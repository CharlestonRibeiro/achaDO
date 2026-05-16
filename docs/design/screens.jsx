/* achaDO · UI screens (Dashboard / Termos / Achados / Configurações)
   Each screen is a function component; render inside <Screen theme="light|dark">. */

const { Fragment } = React;

/* ────────────────────────── icons (lucide-ish, hand-drawn) ────────────────────────── */
const I = {
  dash:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>,
  terms: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>,
  bell:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  gear:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
  play:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>,
  plus:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  more:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>,
  ext:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>,
  chev:  () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>,
  mail:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>,
  clock: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  key:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="3.5"/><path d="m10 13 9-9"/><path d="m16 6 3 3"/></svg>,
  filter:() => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h18l-7 9v6l-4-2v-4z"/></svg>,
  edit:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="m18 2 4 4-11 11H7v-4z"/></svg>,
  arch:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8"/><path d="M10 12h4"/></svg>,
  reqd:  () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  ban:   () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="9"/><path d="m5 5 14 14"/></svg>,
  build: () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M3 9h18"/></svg>,
  doc:   () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4v16h16V8l-4-4z"/><path d="M14 4v4h4"/></svg>,
};

/* ────────────────────────── shared chrome ────────────────────────── */

function Sidebar({ active }) {
  const items = [
    { id: 'dash',  label: 'Dashboard',     icon: <I.dash/> },
    { id: 'termos',label: 'Termos',        icon: <I.terms/>, count: 14 },
    { id: 'achados',label:'Achados',       icon: <I.bell/>,  badge: '4' },
    { id: 'config',label: 'Configurações', icon: <I.gear/> },
  ];
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="mark">a</div>
        <div className="name">achaDO</div>
        <div className="tag">v0.1</div>
      </div>
      <div className="section-label">Aplicação</div>
      {items.map(it => (
        <a key={it.id} className={"nav-item" + (active === it.id ? " active" : "")}>
          <span className="ico">{it.icon}</span>
          <span>{it.label}</span>
          {it.badge ? <span className="badge">{it.badge}</span>
            : it.count ? <span className="count">{it.count}</span> : null}
        </a>
      ))}

      <div className="section-label" style={{marginTop: 18}}>Fontes monitoradas</div>
      {[
        { sigla: 'DOU',    esfera: 'federal',   ok: true },
        { sigla: 'DOE-RO', esfera: 'estadual', ok: true },
        { sigla: 'DOE-AC', esfera: 'estadual', ok: true },
        { sigla: 'DOE-MT', esfera: 'estadual', ok: true },
      ].map(f => (
        <a key={f.sigla} className="nav-item" style={{cursor: 'default'}}>
          <span className="ico"><span className={"dot" + (f.ok ? "" : " warn")} style={{boxShadow:'none'}}></span></span>
          <span style={{fontFamily: '"Geist Mono", monospace', fontSize: 12, letterSpacing: '0.04em'}}>{f.sigla}</span>
          <span className="count" style={{fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase'}}>{f.esfera}</span>
        </a>
      ))}

      <div className="sidebar-foot">
        <div className="row"><span className="dot"/><span>Vigilância ativa</span></div>
        <div className="meta">Próximo ciclo · hoje, 12:00 BRT</div>
      </div>
    </aside>
  );
}

function TopBar({ title, crumb, actions }) {
  return (
    <div className="topbar">
      <div className="title-block">
        <h1>{title}</h1>
        {crumb && <div className="crumb">{crumb}</div>}
      </div>
      <div style={{display:'flex', gap: 8}}>{actions}</div>
    </div>
  );
}

function Screen({ theme, children }) {
  return (
    <div data-theme={theme} className="app">{children}</div>
  );
}

/* ────────────────────────── DASHBOARD ────────────────────────── */

function Dashboard() {
  // sparkline: matches per day, last 14 days
  const spark = [2, 0, 3, 1, 0, 0, 4, 6, 2, 1, 0, 3, 5, 7];
  const max = Math.max(...spark);
  const isWeekend = (i) => i === 4 || i === 5 || i === 11 || i === 12;

  return (
    <div className="main">
      <TopBar
        title="Dashboard"
        crumb="16 mai 2026 · sex · 12:24 BRT"
        actions={<>
          <button className="btn ghost"><span className="ico"><I.clock/></span>Histórico de ciclos</button>
          <button className="btn primary"><span className="ico"><I.play/></span>Executar ciclo</button>
        </>}
      />

      <div className="canvas scroll">

        {/* status banner */}
        <div className="banner">
          <div className="icon"><I.check/></div>
          <div>
            <h2>Ciclo diário concluído — 4 de 4 fontes coletadas</h2>
            <p>16 mai 2026, 12:03:42 BRT · duração 24 min 18 s · 1.247 publicações indexadas · 7 matches</p>
          </div>
          <button className="btn sm"><span className="ico"><I.ext/></span>Abrir relatório</button>
        </div>

        {/* KPI row */}
        <div className="kpi-row">
          <div className="kpi">
            <div className="label">Edições</div>
            <div className="value">4<span className="unit">hoje</span></div>
            <div className="delta">100% das fontes · <b>↑ 1</b> vs. ontem</div>
          </div>
          <div className="kpi">
            <div className="label">Publicações</div>
            <div className="value">1.247</div>
            <div className="delta"><b>↑ 12%</b> média 7d · 1.113</div>
          </div>
          <div className="kpi" style={{borderColor: 'var(--accent)', boxShadow: '0 0 0 1px var(--accent), 0 1px 0 oklch(0.85 0.008 80 / 0.7)'}}>
            <div className="label" style={{color: 'var(--accent-ink)'}}>Matches</div>
            <div className="value">7<span className="unit">do dia</span></div>
            <div className="delta"><b>↑ 2</b> não lidos · 4 termos</div>
          </div>
          <div className="kpi">
            <div className="label">Digest</div>
            <div className="value">1<span className="unit">enviado</span></div>
            <div className="delta">12:04 · joao.silva@gmail.com</div>
          </div>
        </div>

        {/* sources card */}
        <div className="card">
          <div className="card-h">
            <h3>Fontes do ciclo</h3>
            <div className="right">Último ciclo · 12:03:42 BRT</div>
          </div>
          <div className="sources">
            {[
              { sigla:'DOU',    esfera:'Federal',  pubs:1.142, ts:'12:03:42', edicao:'Nº 92 · 16/05/2026' },
              { sigla:'DOE-RO', esfera:'RO',       pubs:47,    ts:'12:08:11', edicao:'Nº 8 423 · 16/05'  },
              { sigla:'DOE-AC', esfera:'AC',       pubs:31,    ts:'12:14:09', edicao:'Nº 13 891 · 16/05' },
              { sigla:'DOE-MT', esfera:'MT',       pubs:27,    ts:'12:21:33', edicao:'Nº 28 974 · 16/05' },
            ].map(s => (
              <div key={s.sigla} className="src">
                <div className="head">
                  <span className="sigla">{s.sigla}</span>
                  <span className="esfera">{s.esfera}</span>
                </div>
                <div className="stats">
                  <div>
                    <span className="n">{s.pubs}</span>
                    <span className="l">publicações</span>
                  </div>
                </div>
                <div className="ts"><span className="dot"/>indexada às {s.ts}</div>
                <div className="ts" style={{paddingLeft: 14}}>{s.edicao}</div>
              </div>
            ))}
          </div>
        </div>

        {/* bottom row: recent matches + spark */}
        <div style={{display:'grid', gridTemplateColumns:'1.55fr 1fr', gap:14}}>
          <div className="card">
            <div className="card-h">
              <h3>Achados recentes</h3>
              <div className="right">4 novos · 3 lidos</div>
            </div>
            {[
              { d:'12:04', t:'DOU §3',     termo:'edital de abertura', tit:'EDITAL Nº 1 — TRF DA 1ª REGIÃO', trecho:'Torna pública a abertura do concurso público de provas para provimento de cargos efetivos de Analista Judiciário…', orgao:'Tribunal Regional Federal · 1ª Região', pill:'novo'},
              { d:'12:04', t:'DOE-MT',     termo:'homologação', tit:'PORTARIA SEPLAG Nº 412/2026', trecho:'Homologação do resultado final do certame para Analista Administrativo, edital nº 04/2024, conforme…', orgao:'Secretaria de Planejamento e Gestão', pill:'novo'},
              { d:'12:04', t:'DOU §3',     termo:'convocação 2026', tit:'CONVOCAÇÃO PARA AVALIAÇÃO DE TÍTULOS', trecho:'Ficam convocados os candidatos relacionados no Anexo I para a fase de avaliação de títulos do concurso 2026/01…', orgao:'Ministério da Gestão', pill:'novo'},
            ].map((m, i) => (
              <div key={i} className="match">
                <div className="col-meta">
                  <span className="date">{m.d}</span>
                  <span className="src-tag">{m.t}</span>
                </div>
                <div className="col-body">
                  <span className="termo">{m.termo}</span>
                  <div className="titulo">{m.tit}</div>
                  <div className="trecho">{m.trecho}</div>
                  <div className="orgao">{m.orgao}</div>
                </div>
                <div className="actions">
                  <span className={"pill " + (m.pill === 'novo' ? 'novo' : 'lido')}>{m.pill}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-h">
              <h3>Matches · 14 dias</h3>
              <div className="right">total 34 · média 2.4/d</div>
            </div>
            <div className="card-pad">
              <div className="spark">
                {spark.map((v, i) => (
                  <div key={i} className={"bar" + (i === spark.length - 1 ? " a" : isWeekend(i) ? " f" : "")}
                       style={{height: Math.max(4, (v / max) * 38) + 'px'}}/>
                ))}
              </div>
              <div style={{display:'flex', justifyContent:'space-between', marginTop: 8,
                           fontFamily:'"Geist Mono", monospace', fontSize: 10, color:'var(--ink-3)', letterSpacing:'0.12em'}}>
                <span>03/05</span><span>09</span><span>HOJE</span>
              </div>
              <div className="hr" style={{margin:'18px 0 14px'}}/>
              <div style={{display:'grid', gap: 10}}>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:12.5}}>
                  <span style={{color:'var(--ink-2)'}}>Termo mais ativo</span>
                  <span style={{fontFamily:'"Geist Mono", monospace', color:'var(--ink-1)'}}>"edital de abertura"</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:12.5}}>
                  <span style={{color:'var(--ink-2)'}}>Fonte com mais matches</span>
                  <span style={{fontFamily:'"Geist Mono", monospace', color:'var(--ink-1)'}}>DOU · 19</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:12.5}}>
                  <span style={{color:'var(--ink-2)'}}>Vigilância semanal</span>
                  <span style={{fontFamily:'"Geist Mono", monospace', color:'var(--ok)'}}>domingo · ativa</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ────────────────────────── TERMOS ────────────────────────── */

function Termos() {
  const termos = [
    { ativo:true,  padrao:'edital de abertura', tipo:'fr', last:'há 12 min', total:156,
      filtros:[{k:'seção', v:'§3'}, {k:'+req', t:'concurso público'}],
      fontes:'4 fontes' },
    { ativo:true,  padrao:'José Cardoso Silva', tipo:'kw', last:'há 3 dias', total:23,
      filtros:[], fontes:'4 fontes' },
    { ativo:true,  padrao:'/concurso.{0,20}delegado/i', tipo:'rx', last:'há 2 dias', total:8,
      filtros:[{k:'fonte', v:'DOU + DOE-RO'}, {k:'+req', t:'PCRO'}], fontes:'2 fontes', regex:true },
    { ativo:true,  padrao:'075.123.456-78', tipo:'kw', last:'nunca', total:0,
      filtros:[], fontes:'4 fontes' },
    { ativo:true,  padrao:'homologação', tipo:'kw', last:'há 12 min', total:47,
      filtros:[{k:'órgão', v:'SEPLAG-MT'}, {k:'−proib', t:'cancelamento'}], fontes:'1 fonte' },
    { ativo:true,  padrao:'convocação 2026', tipo:'fr', last:'há 12 min', total:12,
      filtros:[{k:'+req', t:'avaliação de títulos'}], fontes:'DOU' },
    { ativo:true,  padrao:'nomeação efetivos', tipo:'fr', last:'há 5 dias', total:4,
      filtros:[], fontes:'4 fontes' },
    { ativo:false, padrao:'retificação edital 02/2025', tipo:'fr', last:'há 21 dias', total:3,
      filtros:[], fontes:'DOU' },
    { ativo:false, padrao:'/prorroga[çc][ãa]o.{0,30}validade/i', tipo:'rx', last:'há 2 meses', total:11,
      filtros:[], fontes:'4 fontes', regex:true },
  ];
  const tipoLabel = { kw:'KEYWORD', fr:'FRASE', rx:'REGEX' };

  return (
    <div className="main">
      <TopBar
        title="Termos de busca"
        crumb="9 termos · 7 ativos · 2 inativos"
        actions={<>
          <button className="btn ghost"><span className="ico"><I.ext/></span>Importar</button>
          <button className="btn accent"><span className="ico"><I.plus/></span>Novo termo</button>
        </>}
      />
      <div className="canvas scroll">

        {/* filter bar */}
        <div className="filterbar">
          <div className="search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            <input placeholder="Buscar por padrão, filtro ou regex…"/>
            <kbd>⌘ K</kbd>
          </div>
          <div className="chips">
            <span className="chip on">Todos</span>
            <span className="chip">Ativos</span>
            <span className="chip">Inativos</span>
          </div>
          <div className="select"><span className="l">Tipo</span> Qualquer <I.chev/></div>
          <div className="select"><span className="l">Fonte</span> 4 fontes <I.chev/></div>
          <div className="select"><span className="l">Ordem</span> Último match <I.chev/></div>
        </div>

        <div className="card">
          <div className="termo-row head">
            <span className="col"></span>
            <span className="col">Padrão</span>
            <span className="col">Tipo</span>
            <span className="col">Filtros</span>
            <span className="col">Matches</span>
            <span className="col" style={{textAlign:'right'}}></span>
          </div>
          {termos.map((t, i) => (
            <div key={i} className={"termo-row" + (t.ativo ? "" : " muted")}>
              <div><div className={"switch" + (t.ativo ? " on" : "")}/></div>
              <div className="termo-padrao">
                <div className="text">
                  <div className={"v" + (t.regex ? " regex" : "")}>{t.padrao}</div>
                  <div className="lastmatch">último match · {t.last} · {t.fontes}</div>
                </div>
              </div>
              <div><span className={"tipo-pill " + t.tipo}>{tipoLabel[t.tipo]}</span></div>
              <div className="filtros-cell">
                {t.filtros.length === 0 && <span className="filtro-tag" style={{opacity:0.5}}>sem filtros</span>}
                {t.filtros.map((f, j) => (
                  <span key={j} className={"filtro-tag" + (f.k === '+req' ? ' req' : f.k === '−proib' ? ' proib' : '')}>
                    {f.k === '+req' && <I.reqd/>}
                    {f.k === '−proib' && <I.ban/>}
                    {f.k === 'órgão' && <I.build/>}
                    {f.k === 'seção' && <I.doc/>}
                    {f.k === 'fonte' && <I.filter/>}
                    {f.v || f.t}
                  </span>
                ))}
              </div>
              <div className="matchcount">
                <span className="n">{t.total}</span>
                <span className="l"> total</span>
              </div>
              <div style={{display:'flex', gap: 4, justifyContent:'flex-end', color: 'var(--ink-3)'}}>
                <button className="btn ghost sm"><I.edit/></button>
                <button className="btn ghost sm"><I.more/></button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

/* ────────────────────────── ACHADOS ────────────────────────── */

function Achados() {
  const matches = [
    { d:'hoje, 12:04', t:'DOU · §3', termo:'edital de abertura',
      tit:'EDITAL Nº 1 — TRIBUNAL REGIONAL FEDERAL DA 1ª REGIÃO',
      trecho:'…torna pública a abertura do concurso público de provas para provimento de cargos efetivos de Analista Judiciário, Área Judiciária e Área Administrativa, na forma do presente edital de abertura, observadas as disposições legais aplicáveis…',
      orgao:'Tribunal Regional Federal · 1ª Região · Diretoria-Geral',
      ed:'Edição nº 92 · página 184–189',
      pill:'novo' },
    { d:'hoje, 12:04', t:'DOE-MT', termo:'homologação',
      tit:'PORTARIA SEPLAG Nº 412/2026',
      trecho:'…o Secretário de Estado de Planejamento e Gestão, no uso de suas atribuições, resolve: Art. 1º Homologar o resultado final do certame para o cargo de Analista Administrativo, edital nº 04/2024, conforme relação nominal constante do Anexo Único…',
      orgao:'Secretaria de Planejamento e Gestão · MT',
      ed:'Edição nº 28 974 · página 12',
      pill:'novo' },
    { d:'hoje, 12:04', t:'DOU · §3', termo:'convocação 2026',
      tit:'CONVOCAÇÃO PARA AVALIAÇÃO DE TÍTULOS',
      trecho:'Ficam convocados os candidatos relacionados no Anexo I para a fase de avaliação de títulos do concurso 2026/01, conforme cronograma retificado pelo aviso nº 7/2026, devendo apresentar a documentação no período de…',
      orgao:'Ministério da Gestão e da Inovação em Serviços Públicos',
      ed:'Edição nº 92 · página 76',
      pill:'novo' },
    { d:'hoje, 12:04', t:'DOU · §3', termo:'edital de abertura',
      tit:'RETIFICAÇÃO — EDITAL Nº 4/2026',
      trecho:'…retifica o edital de abertura do concurso público publicado no Diário Oficial da União nº 78, de 25 de abril de 2026, Seção 3, página 142, para alterar o cronograma e o conteúdo programático da prova objetiva…',
      orgao:'Polícia Federal · Diretoria de Gestão de Pessoal',
      ed:'Edição nº 92 · página 191',
      pill:'novo' },
    { d:'ontem, 12:03', t:'DOE-RO', termo:'José Cardoso Silva',
      tit:'PORTARIA SEGEP Nº 1.847/2026',
      trecho:'…art. 2º Nomear, nos termos do art. 12 da Lei Complementar 68/1992, os candidatos aprovados no concurso público de que trata o edital nº 03/2025, conforme lista anexa, na qual consta José Cardoso Silva, classificação 14ª…',
      orgao:'Secretaria de Estado da Gestão de Pessoas · RO',
      ed:'Edição nº 8 422 · página 4',
      pill:'lido' },
    { d:'12/05', t:'DOU · §1', termo:'/concurso.{0,20}delegado/i',
      tit:'PORTARIA Nº 218/MJSP',
      trecho:'…autoriza a realização de concurso público para provimento de 500 (quinhentas) vagas de Delegado de Polícia Federal, observado o quantitativo definido em portaria interministerial, bem como o disposto na Lei nº 9.266/1996…',
      orgao:'Ministério da Justiça e Segurança Pública',
      ed:'Edição nº 88 · página 22',
      pill:'lido' },
  ];

  return (
    <div className="main">
      <TopBar
        title="Achados"
        crumb="34 nos últimos 14 dias · 4 não lidos"
        actions={<>
          <button className="btn ghost"><span className="ico"><I.check/></span>Marcar todos como lidos</button>
          <button className="btn"><span className="ico"><I.arch/></span>Arquivados</button>
        </>}
      />
      <div className="canvas scroll">

        <div className="filterbar">
          <div className="search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            <input placeholder="Buscar dentro dos achados…"/>
            <kbd>⌘ F</kbd>
          </div>
          <div className="chips">
            <span className="chip on">Tudo · 34</span>
            <span className="chip">Novos · 4</span>
            <span className="chip">Lidos</span>
            <span className="chip">Arquivados</span>
          </div>
          <div className="select"><span className="l">Termo</span> Qualquer <I.chev/></div>
          <div className="select"><span className="l">Fonte</span> 4 fontes <I.chev/></div>
          <div className="select"><span className="l">Data</span> 14 dias <I.chev/></div>
        </div>

        <div className="card">
          {matches.map((m, i) => (
            <div key={i} className="match">
              <div className="col-meta">
                <span className="date">{m.d}</span>
                <span className="src-tag">{m.t}</span>
                <span className="src-tag" style={{fontSize:9.5, color:'var(--ink-3)'}}>{m.ed}</span>
              </div>
              <div className="col-body">
                <span className="termo">{m.termo}</span>
                <div className="titulo">{m.tit}</div>
                <div className="trecho">{highlight(m.trecho, stripRegex(m.termo))}</div>
                <div className="orgao">{m.orgao}</div>
              </div>
              <div className="actions" style={{flexDirection:'column', alignItems:'flex-end', gap: 8}}>
                <span className={"pill " + (m.pill === 'novo' ? 'novo' : m.pill === 'lido' ? 'lido' : 'arq')}>{m.pill}</span>
                <div style={{display:'flex', gap: 4}}>
                  <button className="btn ghost sm" title="abrir no portal"><I.ext/></button>
                  <button className="btn ghost sm" title="arquivar"><I.arch/></button>
                  <button className="btn ghost sm"><I.more/></button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

function stripRegex(t) {
  if (!t) return '';
  if (t.startsWith('/')) return t.replace(/^\/|\/[a-z]*$/g, '').replace(/[.\\(){}\[\]?+*]/g,'').split(/[\s|]+/).filter(Boolean)[0] || '';
  return t;
}
function highlight(text, needle) {
  if (!needle) return text;
  const words = needle.split(/\s+/).filter(Boolean);
  if (!words.length) return text;
  const re = new RegExp('(' + words.map(escapeRe).join('|') + ')', 'gi');
  const parts = text.split(re);
  return parts.map((p, i) =>
    re.test(p) ? <mark key={i}>{p}</mark> : <span key={i}>{p}</span>
  );
}
function escapeRe(s) { return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'); }

/* ────────────────────────── CONFIGURAÇÕES ────────────────────────── */

function Configuracoes() {
  return (
    <div className="main">
      <TopBar
        title="Configurações"
        crumb="alterações aplicadas em tempo real · senha SMTP no chaveiro do SO"
        actions={<>
          <button className="btn ghost">Cancelar</button>
          <button className="btn primary">Salvar alterações</button>
        </>}
      />
      <div className="canvas scroll">
        <div className="settings-grid">
          <div className="settings-side">
            <div className="h">Notificação</div>
            <a className="active"><span className="ico"><I.mail/></span>SMTP &amp; e-mail</a>
            <a><span className="ico"><I.bell/></span>Preferências</a>

            <div className="h">Coleta</div>
            <a><span className="ico"><I.clock/></span>Agendamento</a>
            <a><span className="ico"><I.terms/></span>Fontes</a>

            <div className="h">Aplicação</div>
            <a><span className="ico"><I.key/></span>Privacidade &amp; chaveiro</a>
            <a><span className="ico"><I.gear/></span>Sobre · v0.1</a>
          </div>

          <div>
            <div className="form-section">
              <h2>Servidor SMTP</h2>
              <p className="desc">Credenciais do servidor de e-mail usado para enviar o digest diário. A senha é guardada no Credential Manager do Windows — nunca em texto claro.</p>

              <div className="field">
                <div className="label">Host
                  <span className="sub">FQDN do servidor SMTP</span>
                </div>
                <div className="control">
                  <input className="input" defaultValue="smtp.gmail.com"/>
                </div>
              </div>

              <div className="field">
                <div className="label">Porta &amp; segurança
                  <span className="sub">587 STARTTLS · 465 SSL</span>
                </div>
                <div className="control" style={{display:'flex', gap:8, alignItems:'center'}}>
                  <input className="input short" defaultValue="587"/>
                  <div className="select"><span className="l">Cripto</span> STARTTLS <I.chev/></div>
                </div>
              </div>

              <div className="field">
                <div className="label">Usuário
                  <span className="sub">também é o remetente</span>
                </div>
                <div className="control">
                  <input className="input" defaultValue="joao.silva@gmail.com"/>
                </div>
              </div>

              <div className="field">
                <div className="label">Senha
                  <span className="sub">Credential Manager · Windows</span>
                </div>
                <div className="control">
                  <div className="input locked">
                    <span>•••••••••••••••</span>
                    <button className="btn ghost sm"><span className="ico"><I.key/></span>Trocar no chaveiro</button>
                  </div>
                  <span className="helper">acesso restrito ao processo achado.exe · keyring v23.x</span>
                </div>
              </div>

              <div className="field" style={{borderBottom:'none'}}>
                <div className="label">Destinatário
                  <span className="sub">para onde os digests vão</span>
                </div>
                <div className="control">
                  <input className="input" defaultValue="joao.silva@gmail.com"/>
                  <div style={{display:'flex', gap:8, marginTop:6}}>
                    <button className="btn"><span className="ico"><I.play/></span>Testar conexão &amp; enviar e-mail</button>
                    <span className="helper ok" style={{display:'inline-flex', alignItems:'center', gap:6}}>
                      <span className="dot"/> conexão ok · enviado 16 mai 11:58
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Quando notificar</h2>
              <p className="desc">O digest sai uma vez por dia ao fim do ciclo. A vigilância semanal só dispara se a semana inteira passar sem achados.</p>

              <div className="toggle-row">
                <div className="info">
                  <div className="t">Digest diário</div>
                  <div className="d">Um único e-mail consolidando os achados do dia (R13).</div>
                </div>
                <div className="switch on"/>
              </div>
              <div className="toggle-row">
                <div className="info">
                  <div className="t">Vigilância semanal · domingos</div>
                  <div className="d">"Estou monitorando, sem ocorrências." Dispara apenas se a semana foi vazia (R17).</div>
                </div>
                <div className="switch on"/>
              </div>
              <div className="toggle-row">
                <div className="info">
                  <div className="t">Notificação na bandeja do sistema</div>
                  <div className="d">Aviso nativo quando o ciclo termina com matches novos.</div>
                </div>
                <div className="switch on"/>
              </div>
              <div className="toggle-row">
                <div className="info">
                  <div className="t">Limite por e-mail</div>
                  <div className="d">Cap máximo de matches anexados em um único digest.</div>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:6}}>
                  <input className="input short" defaultValue="50" style={{width: 64}}/>
                  <span className="helper">matches</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────── exports ────────────────────────── */
Object.assign(window, { Screen, Sidebar, Dashboard, Termos, Achados, Configuracoes });
