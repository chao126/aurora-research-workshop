'use client';

import { useEffect, useMemo, useState } from 'react';
import type {
  AppView,
  ResearchSource,
  SessionMode,
  SourceRole,
  VerificationStatus,
  WorkspaceState,
  WorkspaceTab,
} from './domain';
import { initialWorkspace, sessionCards } from './mock-data';

const roles: SourceRole[] = ['Anchor', 'Foundation', 'Supporting', 'Alternative', 'Contradictory', 'Context'];
const workspaceTabs: { id: WorkspaceTab; label: string; note: string }[] = [
  { id: 'sources', label: 'Sources', note: '6' },
  { id: 'synthesis', label: 'Synthesis', note: '3' },
  { id: 'discover', label: 'Discover', note: '3' },
  { id: 'connect', label: 'Connect', note: '8' },
  { id: 'compose', label: 'Compose', note: '2' },
];

type InterpretationItem = {
  id: string;
  label: string;
  value: string;
  starred: boolean;
};

const researchEmphases = ['背景梳理', '争议分析', '批判阅读', '跨学科探索', '寻找研究问题'];

function createDefaultInterpretation(): InterpretationItem[] {
  return [
    { id: 'primary-question', label: 'Primary question', value: '历史制度主义如何解释渐进式制度变迁，不同机制的理论边界是什么？', starred: false },
    { id: 'must-answer', label: 'Must answer', value: '比较变迁机制；评估理论边界；形成可陈述立场。', starred: false },
    { id: 'required-materials', label: 'Required materials', value: '本周六篇指定阅读，全部为必用材料。', starred: false },
    { id: 'expected-output', label: 'Expected output', value: '5 分钟课堂发言 + 可延伸为阅读回应的论证。', starred: false },
    { id: 'missing-information', label: 'Missing information', value: '未指定引用格式；默认使用 author–date。', starred: false },
  ];
}

export default function Home() {
  const [view, setView] = useState<AppView>('guide');
  const [guideStartMode, setGuideStartMode] = useState<SessionMode>('assignment_led');
  const [tab, setTab] = useState<WorkspaceTab>('sources');
  const [toast, setToast] = useState('');
  const [workspace, setWorkspace] = useState<WorkspaceState>(initialWorkspace);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('research-workspace-demo');
      if (saved) {
        // Browser persistence is restored only after hydration to keep the server render stable.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setWorkspace(JSON.parse(saved) as WorkspaceState);
      }
    } catch {
      // A fresh demo state is safer than blocking the workspace on corrupt local data.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem('research-workspace-demo', JSON.stringify(workspace));
  }, [workspace, hydrated]);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  }

  function openWorkspace(nextTab: WorkspaceTab = 'sources') {
    setTab(nextTab);
    setView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function createSession(mode: SessionMode, title: string, question: string) {
    setWorkspace((current) => ({
      ...current,
      sessionTitle: title || (mode === 'assignment_led' ? '新的导师命题' : '新的材料研究'),
      researchQuestion: question || current.researchQuestion,
      assignmentConfirmed: mode === 'assignment_led',
    }));
    showToast('研究会话已创建，用户确认的任务解读已锁定');
    openWorkspace('sources');
  }

  return (
    <main className={`app-frame ${view === 'workspace' ? 'workspace-mode' : ''}`}>
      <Topbar view={view} setView={setView} openWorkspace={openWorkspace} />
      <div className="demo-strip">
        <span>INTERACTIVE MVP</span>
        <p>当前显示可编辑的本地演示数据；未连接的外部服务不会伪造实时核验结果。</p>
      </div>
      <nav className="mobile-nav" aria-label="移动端主导航">
        <button className={view === 'guide' ? 'active' : ''} onClick={() => setView('guide')}>指南</button>
        <button className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}>工作台</button>
        <button className={view === 'workspace' ? 'active' : ''} onClick={() => openWorkspace()}>Session</button>
        <button className={view === 'profile' ? 'active' : ''} onClick={() => setView('profile')}>Profile</button>
        <button className={view === 'integrations' ? 'active' : ''} onClick={() => setView('integrations')}>Integrations</button>
      </nav>

      {view === 'dashboard' && (
        <Dashboard setView={setView} openWorkspace={openWorkspace} showToast={showToast} />
      )}
      {view === 'new-session' && <NewSession initialMode={guideStartMode} onCreate={createSession} onCancel={() => setView('guide')} />}
      {view === 'workspace' && (
        <Workspace
          tab={tab}
          setTab={setTab}
          state={workspace}
          setState={setWorkspace}
          showToast={showToast}
          goDashboard={() => setView('dashboard')}
        />
      )}
      {view === 'profile' && <ResearchProfile setState={setWorkspace} showToast={showToast} />}
      {view === 'integrations' && <Integrations state={workspace} setState={setWorkspace} showToast={showToast} />}
      {view === 'guide' && <GuidePage startSession={(mode) => { setGuideStartMode(mode); setView('new-session'); }} openWorkspace={openWorkspace} />}

      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
    </main>
  );
}

function Topbar({ view, setView, openWorkspace }: { view: AppView; setView: (view: AppView) => void; openWorkspace: (tab?: WorkspaceTab) => void }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => setView('guide')} aria-label="返回平台指南首页">
        <span className="brand-mark" aria-hidden="true">A·</span>
        <span><strong>Aurora’s Research Workshop</strong><small>证据驱动的个人学术工作台</small></span>
      </button>
      <nav className="main-nav" aria-label="主导航">
        <button className={view === 'guide' ? 'active' : ''} onClick={() => setView('guide')}>开始指南</button>
        <button className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}>工作台</button>
        <button className={view === 'workspace' ? 'active' : ''} onClick={() => openWorkspace()}>Research Session</button>
        <button className={view === 'profile' ? 'active' : ''} onClick={() => setView('profile')}>Research Profile</button>
        <button className={view === 'integrations' ? 'active' : ''} onClick={() => setView('integrations')}>Integrations</button>
      </nav>
      <button className="avatar" aria-label="用户菜单">ZC</button>
    </header>
  );
}

function Dashboard({ setView, openWorkspace, showToast }: { setView: (view: AppView) => void; openWorkspace: (tab?: WorkspaceTab) => void; showToast: (message: string) => void }) {
  return (
    <>
      <section className="hero" id="top">
        <div className="eyebrow"><span /> 当前研究队列 · 3</div>
        <div className="hero-grid">
          <div>
            <p className="hero-kicker">RESEARCH COMMAND CENTER</p>
            <h1>你今天要研究什么？</h1>
            <p className="hero-copy">从指定阅读或一个明确命题开始，将材料转化为可核验证据、文献争议与你自己的论证。</p>
          </div>
          <button className="primary-cta" onClick={() => setView('new-session')}>
            <span aria-hidden="true">+</span>
            <span><strong>New Research Session</strong><small>从材料或导师命题开始</small></span>
            <b aria-hidden="true">↗</b>
          </button>
        </div>
      </section>

      <section className="quick-start" aria-labelledby="quick-title">
        <div className="section-label"><span>01</span><h2 id="quick-title">Quick start</h2></div>
        <div className="quick-actions">
          <button onClick={() => setView('new-session')}><i>↑</i><span><strong>Upload files</strong><small>PDF · DOCX · PPTX · TXT</small></span></button>
          <button onClick={() => showToast('Zotero 导入会保留原始条目关联')}><i>Z</i><span><strong>Start from Zotero</strong><small>选择条目或收藏夹</small></span></button>
          <button onClick={() => setView('new-session')}><i>§</i><span><strong>Start with an assignment</strong><small>优先守住命题忠实度</small></span></button>
        </div>
      </section>

      <section className="sessions" aria-labelledby="sessions-title">
        <div className="section-heading">
          <div className="section-label"><span>02</span><h2 id="sessions-title">Recent sessions</h2></div>
          <button className="text-action" onClick={() => showToast('已显示全部近期会话')}>View all <span>→</span></button>
        </div>
        <div className="session-list">
          {sessionCards.map((session, index) => (
            <article className="session-row" key={session.id}>
              <div className={`session-index ${session.accent}`}>0{index + 1}</div>
              <div className="session-main">
                <div className="session-title-line"><h3>{session.title}</h3><span className="status"><i className={session.accent} />{session.status}</span></div>
                <p>{session.question}</p><small>{session.meta}</small>
              </div>
              <div className="session-progress" aria-label={`完成度 ${session.progress}%`}><span>{session.progress}%</span><div><i style={{ width: `${session.progress}%` }} /></div></div>
              <button className="open-session" aria-label={`打开${session.title}`} onClick={() => openWorkspace(session.id === 'algorithm' ? 'connect' : 'sources')}>→</button>
            </article>
          ))}
        </div>
      </section>
      <PrincipleFooter />
    </>
  );
}

function NewSession({ initialMode, onCreate, onCancel }: { initialMode: SessionMode; onCreate: (mode: SessionMode, title: string, question: string) => void; onCancel: () => void }) {
  const [mode, setMode] = useState<SessionMode>(initialMode);
  const [assignment, setAssignment] = useState('请比较本周六篇阅读如何解释渐进式制度变迁，并评估各自的理论边界。准备 5 分钟课堂发言。');
  const [parsed, setParsed] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [presets, setPresets] = useState<string[]>(['争议分析']);
  const [confirmed, setConfirmed] = useState(false);
  const [interpretationItems, setInterpretationItems] = useState<InterpretationItem[]>(createDefaultInterpretation);

  const priorityCount = interpretationItems.filter((item) => item.starred).length;
  const parsedQuestion = interpretationItems.find((item) => item.id === 'primary-question')?.value || interpretationItems[0]?.value || assignment;

  function parseAssignment() {
    setInterpretationItems(createDefaultInterpretation());
    setParsed(true);
    setConfirmed(false);
  }

  function updateInterpretation(id: string, patch: Partial<InterpretationItem>) {
    setInterpretationItems((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item));
    setConfirmed(false);
  }

  function moveInterpretation(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= interpretationItems.length) return;
    setInterpretationItems((items) => {
      const next = [...items];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
    setConfirmed(false);
  }

  function addInterpretation() {
    setInterpretationItems((items) => [
      ...items,
      { id: `custom-${Date.now()}`, label: 'Custom requirement', value: '', starred: false },
    ]);
    setConfirmed(false);
  }

  function removeInterpretation(id: string) {
    setInterpretationItems((items) => items.length > 1 ? items.filter((item) => item.id !== id) : items);
    setConfirmed(false);
  }

  function toggleEmphasis(item: string) {
    setPresets((selected) => selected.includes(item) ? selected.filter((value) => value !== item) : [...selected, item]);
  }

  return (
    <section className="new-session-page">
      <button className="back-link" onClick={onCancel}>← 返回指南</button>
      <header className="page-intro compact">
        <p className="hero-kicker">NEW RESEARCH SESSION</p>
        <h1>选择最贴近当前任务的起点</h1>
        <p>两种模式共用同一个工作区，但会守住不同的研究约束。</p>
      </header>

      <div className="mode-switcher" role="radiogroup" aria-label="研究会话模式">
        <button className={mode === 'material_led' ? 'selected' : ''} onClick={() => { setMode('material_led'); setConfirmed(false); }}>
          <span>A</span><strong>I have materials</strong><small>我有资料，但还不完全知道该问什么。</small>
        </button>
        <button className={mode === 'assignment_led' ? 'selected' : ''} onClick={() => { setMode('assignment_led'); setConfirmed(false); }}>
          <span>B</span><strong>I have an assignment</strong><small>导师已经明确告诉我要回答什么。</small>
        </button>
      </div>

      {mode === 'assignment_led' ? (
        <div className="session-form assignment-form">
          <section>
            <label className="field-label" htmlFor="assignment">Original assignment</label>
            <textarea id="assignment" value={assignment} onChange={(event) => { setAssignment(event.target.value); setParsed(false); setConfirmed(false); }} rows={6} />
            <div className="form-row">
              <fieldset><legend>Required sources</legend><label><input type="radio" name="required" defaultChecked /> 全部指定材料</label><label><input type="radio" name="required" /> 由我决定</label></fieldset>
              <fieldset><legend>Additional literature</legend><label><input type="radio" name="additional" defaultChecked /> 搜索前先询问</label><label><input type="radio" name="additional" /> 不允许</label></fieldset>
            </div>
            <button className="solid-button" disabled={!assignment.trim()} onClick={parseAssignment}>{parsed ? '重新解析任务' : '解析导师命题'} <span>→</span></button>
          </section>
          <aside className={`task-parsing ${parsed ? 'ready' : ''}`}>
            <div className="aside-heading"><span>§</span><div><strong>Task interpretation</strong><small>需要你确认才能继续</small></div></div>
            {!parsed ? <div className="empty-analysis"><i>∷</i><p>AI 会先将命题拆成可核对的任务结构，不会直接进入深度写作。</p></div> : (
              <>
                <div className="interpretation-toolbar">
                  <div><strong>需求执行顺序</strong><small>默认同等优先；星标项会优先实现</small></div>
                  <span>{priorityCount ? `${priorityCount} 项已星标` : 'Standard priority'}</span>
                </div>
                <ol className="interpretation-list">
                  {interpretationItems.map((item, index) => (
                    <li className={item.starred ? 'starred' : ''} key={item.id}>
                      <div className="interpretation-rank" aria-label={`执行顺序 ${index + 1}`}>{String(index + 1).padStart(2, '0')}</div>
                      <div className="interpretation-fields">
                        <input aria-label={`第 ${index + 1} 项需求名称`} value={item.label} onChange={(event) => updateInterpretation(item.id, { label: event.target.value })} />
                        <textarea aria-label={`第 ${index + 1} 项需求内容`} rows={2} value={item.value} placeholder="说明这项需求的具体内容" onChange={(event) => updateInterpretation(item.id, { value: event.target.value })} />
                      </div>
                      <div className="interpretation-actions">
                        <button className={item.starred ? 'priority active' : 'priority'} onClick={() => updateInterpretation(item.id, { starred: !item.starred })} aria-pressed={item.starred} aria-label={item.starred ? `取消星标 ${item.label}` : `星标 ${item.label}`}>{item.starred ? '★' : '☆'}</button>
                        <button disabled={index === 0} onClick={() => moveInterpretation(index, -1)} aria-label={`上移 ${item.label}`}>↑</button>
                        <button disabled={index === interpretationItems.length - 1} onClick={() => moveInterpretation(index, 1)} aria-label={`下移 ${item.label}`}>↓</button>
                        <button className="remove" disabled={interpretationItems.length === 1} onClick={() => removeInterpretation(item.id)} aria-label={`删除 ${item.label}`}>×</button>
                      </div>
                    </li>
                  ))}
                </ol>
                <button className="add-interpretation" onClick={addInterpretation}><span>＋</span> 添加一项需求</button>
                <label className="confirm-check"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /><span><strong>我已确认这一任务解读</strong><small>确认后深度分析将以此为约束</small></span></label>
                <button className="solid-button full" disabled={!confirmed} onClick={() => onCreate('assignment_led', '制度渐变理论课堂讨论', parsedQuestion)}>确认并进入 Sources <span>→</span></button>
              </>
            )}
          </aside>
        </div>
      ) : (
        <div className="session-form material-form">
          <section>
            <label className="upload-zone">
              <input type="file" multiple accept=".pdf,.docx,.pptx,.txt,.md" onChange={(event) => setFiles(Array.from(event.target.files || []).map((file) => file.name))} />
              <i>↑</i><strong>拖入或选择研究材料</strong><small>导入后先做浅层扫描、类型识别与重复检查</small>
            </label>
            {files.length > 0 && <div className="file-queue">{files.map((file) => <span key={file}>✓ {file}</span>)}</div>}
            <div className="preset-block"><span>Research emphasis <small>可多选 · 已选择 {presets.length}/{researchEmphases.length}</small></span><div>{researchEmphases.map((item) => <button key={item} className={presets.includes(item) ? 'selected' : ''} aria-pressed={presets.includes(item)} onClick={() => toggleEmphasis(item)}><i>{presets.includes(item) ? '✓' : '+'}</i>{item}</button>)}</div></div>
          </section>
          <aside className="question-preview">
            <p className="hero-kicker">POSSIBLE RESEARCH QUESTIONS</p>
            <h2>{files.length ? '材料就绪，可以形成研究问题' : '先加入材料，再讨论该问什么'}</h2>
            <p>{files.length ? `将综合“${presets.length ? presets.join('、') : '开放探索'}”的方向建议问题，并为每个问题显示具体材料依据。` : '不用先猜一个完美问题。系统会将每条建议与已上传来源绑定。'}</p>
            <button className="solid-button full" disabled={!files.length} onClick={() => onCreate('material_led', '新的材料研究', '这组材料呈现了怎样的理论发展与核心争议？')}>开始浅层扫描 <span>→</span></button>
          </aside>
        </div>
      )}
    </section>
  );
}

function Workspace({ tab, setTab, state, setState, showToast, goDashboard }: { tab: WorkspaceTab; setTab: (tab: WorkspaceTab) => void; state: WorkspaceState; setState: React.Dispatch<React.SetStateAction<WorkspaceState>>; showToast: (message: string) => void; goDashboard: () => void }) {
  const completed = [true, state.sources.length > 0, state.relations.length > 0, state.activeTracks.length > 0, state.generatedQuick || state.generatedFull];
  return (
    <div className="workspace-shell">
      <aside className="workspace-sidebar">
        <button className="back-link" onClick={goDashboard}>← 全部会话</button>
        <div className="session-identity"><span>ASSIGNMENT LED</span><h2>{state.sessionTitle}</h2><p>{state.researchQuestion}</p><small><i /> 任务解读已由用户确认</small></div>
        <nav aria-label="会话工作区">
          {workspaceTabs.map((item, index) => (
            <button className={tab === item.id ? 'active' : ''} key={item.id} onClick={() => setTab(item.id)}>
              <i>{completed[index] ? '✓' : index + 1}</i><span>{item.label}</span><small>{item.note}</small>
            </button>
          ))}
        </nav>
        <div className="trust-note"><strong>Trust controls</strong><p>用户修改、确认和锁定的内容不会被 AI 静默覆盖。</p></div>
      </aside>
      <section className="workspace-content">
        {tab === 'sources' && <SourcesPanel state={state} setState={setState} showToast={showToast} />}
        {tab === 'synthesis' && <SynthesisPanel state={state} setState={setState} showToast={showToast} />}
        {tab === 'discover' && <DiscoverPanel state={state} setState={setState} showToast={showToast} />}
        {tab === 'connect' && <ConnectPanel state={state} setState={setState} showToast={showToast} />}
        {tab === 'compose' && <ComposePanel state={state} setState={setState} showToast={showToast} />}
      </section>
    </div>
  );
}

function WorkspaceHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <header className="workspace-header"><div><p className="hero-kicker">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>{action && <div className="header-action">{action}</div>}</header>
  );
}

function SourcesPanel({ state, setState, showToast }: { state: WorkspaceState; setState: React.Dispatch<React.SetStateAction<WorkspaceState>>; showToast: (message: string) => void }) {
  const [selected, setSelected] = useState(state.sources[0]?.id || '');
  const [bookScope, setBookScope] = useState(false);
  const current = state.sources.find((source) => source.id === selected) || state.sources[0];
  const counts = useMemo(() => ({ verified: state.sources.filter((s) => s.verification === 'verified').length, locked: state.sources.filter((s) => s.locked).length }), [state.sources]);

  function updateSource(id: string, patch: Partial<ResearchSource>) {
    setState((value) => ({ ...value, sources: value.sources.map((source) => source.id === id ? { ...source, ...patch } : source) }));
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    const additions: ResearchSource[] = Array.from(fileList).map((file, index) => ({
      id: `upload-${Date.now()}-${index}`, short: `U${state.sources.length + index + 1}`, title: file.name.replace(/\.[^.]+$/, ''), authors: '待从文件中识别', year: new Date().getFullYear(),
      type: file.name.toLowerCase().endsWith('.pdf') ? 'article' : 'report', origin: 'upload', role: 'Supporting', importance: 2,
      verification: 'unverified', verificationLabel: '本地文件已加入 · 身份未核验', locked: false,
      insight: { question: '待分析', argument: '待分析', framework: '待分析', method: '待分析', contribution: '待分析', limitation: '待分析' },
    }));
    setState((value) => ({ ...value, sources: [...value.sources, ...additions] }));
    showToast(`已加入 ${additions.length} 个文件，当前标记为 Unverified`);
  }

  return (
    <>
      <WorkspaceHeader eyebrow="SOURCE INTAKE & UNDERSTANDING" title="Sources" description="所有材料都进入统一 Source 层；角色与重要性只属于当前会话。" action={<div className="source-actions"><label className="outline-button"><input type="file" multiple accept=".pdf,.docx,.pptx,.txt,.md" onChange={(event) => addFiles(event.target.files)} />+ Upload</label><button className="outline-button" onClick={() => showToast('Zotero 连接后可选择条目导入')}>+ Zotero</button><button className="solid-button" onClick={() => showToast('已为当前问题准备 Search Profile')}>Search literature</button></div>} />
      <div className="metric-ribbon">
        <div><strong>{state.sources.length}</strong><span>Total sources</span></div><div><strong>{counts.verified}</strong><span>Identity verified</span></div><div><strong>{state.sources.filter((s) => s.type === 'book').length}</strong><span>Books routed</span></div><div><strong>{counts.locked}</strong><span>User locked</span></div>
        <p><b>SEPARATE SIGNALS</b> Verification ≠ Importance ≠ Relevance</p>
      </div>

      <div className="source-workbench">
        <div className="source-table-wrap">
          <div className="source-table-head"><span>Source</span><span>Role</span><span>Importance</span><span>Verification</span><span>Lock</span></div>
          <div className="source-table">
            {state.sources.map((source) => (
              <div className={`source-record ${selected === source.id ? 'selected' : ''}`} key={source.id}>
                <button className="source-title" onClick={() => setSelected(source.id)}><i>{source.short}</i><span><strong>{source.title}</strong><small>{source.authors} · {source.year} · {source.type.replace('_', ' ')}</small></span></button>
                <label className="select-wrap"><select value={source.role} disabled={source.locked} onChange={(event) => updateSource(source.id, { role: event.target.value as SourceRole })}>{roles.map((role) => <option key={role}>{role}</option>)}</select></label>
                <Stars value={source.importance} disabled={source.locked} onChange={(importance) => updateSource(source.id, { importance })} />
                <VerificationBadge status={source.verification} label={source.verificationLabel} />
                <button className={`lock-button ${source.locked ? 'locked' : ''}`} onClick={() => { updateSource(source.id, { locked: !source.locked }); showToast(source.locked ? '已解锁，AI 仍需要你确认才能更改' : '已锁定，AI 不会覆盖该判断'); }} aria-label={source.locked ? '解锁' : '锁定'}>{source.locked ? '▣' : '□'}</button>
              </div>
            ))}
          </div>
        </div>

        {current && <aside className="source-inspector">
          <div className="inspector-top"><p>SOURCE INTELLIGENCE</p><VerificationBadge status={current.verification} /></div>
          <h2>{current.title}</h2><p className="authors">{current.authors} · {current.year}</p>
          {current.type === 'book' && <button className="book-detection" onClick={() => setBookScope(!bookScope)}><span><i>B</i><b>BOOK DETECTED</b><small>{current.pages} pages · {current.selectedChapters?.length || 0} chapters selected</small></span><strong>{bookScope ? '收起' : '设置阅读范围'} →</strong></button>}
          {bookScope && <div className="book-scope"><p>How should this book be read?</p><label><input type="radio" name="scope" /> Full book</label><label><input type="radio" name="scope" defaultChecked /> Selected chapters</label><label><input type="radio" name="scope" /> Recommend chapters for my question</label><div>{['Introduction: A Theory of Gradual Institutional Change', 'Chapter 2: Infiltrating the State', 'Chapter 3: Institutional Change in Chile'].map((chapter, index) => <label className="chapter" key={chapter}><input type="checkbox" defaultChecked={index < 2} /><span>{chapter}<small>{index === 0 ? '★★★★★ · 直接定义当前理论框架' : index === 1 ? '★★★★ · 提供关键经验案例' : '★★ · 辅助比较'}</small></span></label>)}</div><button className="mini-button" onClick={() => { setBookScope(false); showToast('章节范围已保存，整书将按层级处理'); }}>保存范围</button></div>}
          <dl className="intelligence-list">
            <div><dt>Research question</dt><dd>{current.insight.question}</dd></div><div><dt>Core argument</dt><dd>{current.insight.argument}</dd></div><div><dt>Theoretical framework</dt><dd>{current.insight.framework}</dd></div><div><dt>Method</dt><dd>{current.insight.method}</dd></div><div><dt>Contribution</dt><dd>{current.insight.contribution}</dd></div><div><dt>Limitation</dt><dd>{current.insight.limitation}</dd></div>
          </dl>
          <div className="evidence-snippet"><div><span>CLAIM · THEORETICAL</span><b>人工待确认</b></div><p>制度规则的模糊性并非只是缺陷，也是内生变化的条件。</p><small>Location: Introduction · p. 14（示例定位）</small></div>
        </aside>}
      </div>
    </>
  );
}

function VerificationBadge({ status, label }: { status: VerificationStatus; label?: string }) {
  const labels: Record<VerificationStatus, string> = { verified: 'Verified', partial: 'Partial', warning: 'Warning', unverified: 'Unverified' };
  return <span className={`verification ${status}`} title={label || labels[status]}><i>{status === 'verified' ? '✓' : status === 'warning' ? '!' : status === 'unverified' ? '?' : '◐'}</i>{labels[status]}</span>;
}

function Stars({ value, disabled = false, onChange, ariaLabel = '重要性' }: { value: number; disabled?: boolean; onChange: (value: number) => void; ariaLabel?: string }) {
  return <span className="stars" aria-label={`${ariaLabel} ${value} 星`}>{[1, 2, 3, 4, 5].map((star) => <button disabled={disabled} className={star <= value ? 'filled' : ''} key={star} onClick={() => onChange(star)} aria-label={`${ariaLabel} ${star} 星`}>★</button>)}</span>;
}

function SynthesisPanel({ state, setState, showToast }: { state: WorkspaceState; setState: React.Dispatch<React.SetStateAction<WorkspaceState>>; showToast: (message: string) => void }) {
  const relationLabels: Record<string, string> = { conceptual_origin: '概念源流', alternative_explanation: '替代解释', applies: '机制应用' };
  return (
    <>
      <WorkspaceHeader eyebrow="CROSS-SOURCE REASONING" title="Synthesis" description="不叠加六份摘要，而是直接显示共识、争议、理论差异与未解问题。" action={<button className="outline-button" onClick={() => showToast('比较矩阵已按当前锁定证据重新生成')}>↻ Refresh from evidence</button>} />
      <div className="synthesis-grid">
        <section className="matrix-panel">
          <div className="panel-heading"><span>COMPARISON MATRIX</span><small>6 sources · 5 dimensions</small></div>
          <div className="matrix-scroll"><table className="comparison-matrix"><thead><tr><th>Source</th><th>变迁来源</th><th>行动者</th><th>时间性</th><th>方法</th><th>解释边界</th></tr></thead><tbody>
            <tr><th>M&T 2010 <b>ANCHOR</b></th><td>规则模糊与执行空间</td><td>四类变迁行动者</td><td>渐进、内生</td><td>类型学 + 案例</td><td>机制可能重叠</td></tr>
            <tr><th>S&T 2005</th><td>规则与环境的偏离</td><td>组织与政治联盟</td><td>长期累积</td><td>跨国比较</td><td>因果转换较弱</td></tr>
            <tr><th>Pierson 2000</th><td>正反馈与收益递增</td><td>早期选择者</td><td>路径锁定</td><td>理论构建</td><td>稳定期变化较弱</td></tr>
            <tr><th>Hacker 2004</th><td>不更新导致的漂移</td><td>政策执行者</td><td>隐性累积</td><td>单案例历史分析</td><td>美国制度语境</td></tr>
          </tbody></table></div>
        </section>
        <aside className="synthesis-summary">
          <div><span>CONSENSUS</span><p>制度变迁不必以外部冲击或正式规则替代为前提。</p><small>4 / 6 sources · 7 evidence spans</small></div>
          <div className="contested"><span>CONTROVERSY</span><p>“渐进”是时间尺度，还是独立的因果机制？</p><small>3 positions · wording must remain cautious</small></div>
          <div><span>UNRESOLVED GAP</span><p>当多种机制在同一过程中共存时，现有类型学如何识别主导机制？</p><small>2 synthesis claims · user review needed</small></div>
        </aside>
      </div>
      <section className="relations-panel">
        <div className="panel-heading"><span>SOURCE RELATIONS</span><small>每条关系都必须回答“依据是什么”</small></div>
        <div className="relation-list">{state.relations.map((relation) => <article key={relation.id} className="relation-row"><div className="relation-flow"><b>{relation.from}</b><span>→ {relationLabels[relation.type] || relation.type} →</span><b>{relation.to}</b></div><div className={`basis ${relation.basis.toLowerCase()}`}><strong>{relation.basis.replaceAll('_', ' ')}</strong><small>{relation.evidence}</small></div><span className={`confidence ${relation.confidence.toLowerCase()}`}>{relation.confidence}</span><button className={`lock-button ${relation.locked ? 'locked' : ''}`} onClick={() => { setState((value) => ({ ...value, relations: value.relations.map((item) => item.id === relation.id ? { ...item, locked: !item.locked } : item) })); showToast(relation.locked ? '关系已解锁' : '关系与依据已锁定'); }}>{relation.locked ? '▣' : '□'}</button></article>)}</div>
      </section>
    </>
  );
}

function DiscoverPanel({ state, setState, showToast }: { state: WorkspaceState; setState: React.Dispatch<React.SetStateAction<WorkspaceState>>; showToast: (message: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(true);
  const [sort, setSort] = useState('match');
  function runSearch() { setLoading(true); setSearched(false); window.setTimeout(() => { setLoading(false); setSearched(true); showToast('演示检索完成；未连接外部 API，因此不补写实时计量指标'); }, 850); }
  function updateCandidate(id: string, patch: Partial<WorkspaceState['candidates'][number]>) { setState((value) => ({ ...value, candidates: value.candidates.map((candidate) => candidate.id === id ? { ...candidate, ...patch } : candidate) })); }
  const candidates = [...state.candidates].sort((a, b) => sort === 'recent' ? b.year - a.year : sort === 'importance' ? b.importanceRating - a.importanceRating : b.match - a.match);
  return (
    <>
      <WorkspaceHeader eyebrow="VERIFIED LITERATURE DISCOVERY" title="Discover" description="检索顺序始终是 Verify → Match → Importance → Human review；匹配当前问题默认拥有最高权重。" />
      <div className="discover-layout">
        <aside className="search-profile">
          <div className="panel-heading"><span>SEARCH PROFILE</span><small>All fields optional</small></div>
          <label><span>Research question</span><textarea rows={4} defaultValue={state.researchQuestion} /></label>
          <div className="search-fields"><label><span>Date range</span><input defaultValue="2000 — 2026" /></label><label><span>Language</span><select defaultValue="English + Chinese"><option>English + Chinese</option><option>English</option><option>Chinese</option></select></label><label><span>Discipline</span><input defaultValue="Political Science" /></label><label><span>Method</span><input defaultValue="Comparative historical" /></label><label><span>Anchor relationship</span><select defaultValue="Cites or extends Anchor"><option>Cites or extends Anchor</option><option>Direct citation only</option><option>Any</option></select></label><label><span>Geographic focus</span><input placeholder="Optional" /></label></div>
          <button className="solid-button full" onClick={runSearch} disabled={loading}>{loading ? '正在通过三道门检查…' : '更新检索'} <span>→</span></button>
          <div className="ranking-rule"><strong>TRANSPARENT RANKING</strong>{[['Current-question match', 55], ['Anchor relationship', 15], ['User preference', 10], ['Source importance', 10], ['Recency', 5], ['Citation context', 5]].map(([label, weight]) => <div key={String(label)}><span>{label}</span><b>{weight}%</b><i><em style={{ width: `${weight}%` }} /></i></div>)}</div>
        </aside>
        <section className="candidate-area">
          <div className="candidate-toolbar"><div><strong>{searched ? candidates.length : 0} reviewed candidates</strong><small>演示数据 · 外部检索适配器未启用</small></div><label>Sort <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="match">Match</option><option value="importance">Importance</option><option value="recent">Recent</option></select></label></div>
          {loading && <div className="loading-state"><i />正在先核对身份，再计算匹配解释…</div>}
          {searched && candidates.map((candidate) => <article className={`candidate-card status-${candidate.status}`} key={candidate.id}>
            <div className="candidate-select"><input type="checkbox" checked={candidate.status === 'use'} onChange={(event) => updateCandidate(candidate.id, { status: event.target.checked ? 'use' : 'candidate' })} aria-label={`选择${candidate.title}`} /></div>
            <div className="candidate-body"><div className="candidate-title"><div><h2>{candidate.title}</h2><p>{candidate.authors} · {candidate.year} · {candidate.venue}</p></div><div className="match-score"><strong>{candidate.match}</strong><span>MATCH</span></div></div>
              <div className="gate-row"><span><b>GATE 1</b><VerificationBadge status={candidate.verification} /></span><span><b>GATE 2</b>Question {candidate.match} · Anchor {candidate.anchor}</span><span><b>GATE 3</b>JIF: Unavailable</span></div>
              <div className="recommend-reason"><span>WHY RECOMMENDED</span><ul>{candidate.reason.map((reason) => <li key={reason}>{reason}</li>)}</ul><small>Anchor relation: {candidate.relation} · Basis 已显式标注</small></div>
              <div className="candidate-rating"><label><span>Relevance</span><Stars ariaLabel="相关性" value={candidate.relevanceRating} onChange={(relevanceRating) => updateCandidate(candidate.id, { relevanceRating })} /></label><label><span>Importance</span><Stars ariaLabel="重要性" value={candidate.importanceRating} onChange={(importanceRating) => updateCandidate(candidate.id, { importanceRating })} /></label></div>
              <div className="candidate-actions"><button onClick={() => updateCandidate(candidate.id, { status: 'reject' })}>Reject</button><button onClick={() => updateCandidate(candidate.id, { status: 'later' })}>Later</button><button className="outline-button" onClick={() => { updateCandidate(candidate.id, { status: 'use' }); showToast('已加入当前会话，未自动写入 Zotero'); }}>Use</button><button className="solid-button" onClick={() => { updateCandidate(candidate.id, { status: 'use', zotero: true }); showToast('已选中 Use + Zotero；实际写入前仍会执行重复检查'); }}>Use + Zotero</button></div>
            </div>
          </article>)}
        </section>
      </div>
    </>
  );
}

function ConnectPanel({ state, setState, showToast }: { state: WorkspaceState; setState: React.Dispatch<React.SetStateAction<WorkspaceState>>; showToast: (message: string) => void }) {
  const tracks = ['AI Governance', 'Algorithmic Accountability', 'Public-sector AI'];
  function toggleTrack(track: string) { setState((value) => ({ ...value, activeTracks: value.activeTracks.includes(track) ? value.activeTracks.filter((item) => item !== track) : [...value.activeTracks, track] })); }
  return (
    <>
      <WorkspaceHeader eyebrow="PERSONAL RESEARCH CONNECTION" title="Connect" description="将当前证据链连接到你主动选择的长期方向，并明确区分已知、假设与待验证事项。" />
      <section className="track-selector"><div><span>CONNECT THIS SESSION TO</span><p>只激活当前真正相关的 Research Profile</p></div><div>{tracks.map((track) => <label key={track} className={state.activeTracks.includes(track) ? 'active' : ''}><input type="checkbox" checked={state.activeTracks.includes(track)} onChange={() => toggleTrack(track)} />{track}</label>)}<button onClick={() => showToast('临时方向只属于当前会话，不会自动升级')}>+ Temporary direction</button></div></section>
      <div className="connection-chain">{state.connections.map((block, index) => <div className="connection-item" key={block.id}>{index > 0 && <i className="chain-arrow">↓</i>}<article><header><div><span>{String(index + 1).padStart(2, '0')}</span><h2>{block.label}</h2></div><button className={`lock-button ${block.locked ? 'locked' : ''}`} onClick={() => { setState((value) => ({ ...value, connections: value.connections.map((item) => item.id === block.id ? { ...item, locked: !item.locked } : item) })); showToast(block.locked ? `${block.label} 已解锁` : `${block.label} 已由用户锁定`); }}>{block.locked ? '▣ Locked' : '□ Lock'}</button></header><small>{block.helper}</small><textarea value={block.value} disabled={block.locked} rows={3} onChange={(event) => setState((value) => ({ ...value, connections: value.connections.map((item) => item.id === block.id ? { ...item, value: event.target.value } : item) }))} /></article></div>)}</div>
      <div className="next-step"><div><span>NEXT</span><strong>已激活 {state.activeTracks.length} 个研究方向，8 个推理块中 {state.connections.filter((item) => item.locked).length} 个已锁定。</strong></div><button className="solid-button" onClick={() => showToast('研究连接已保存，可以进入 Argument Builder')}>保存研究连接</button></div>
    </>
  );
}

function ComposePanel({ state, setState, showToast }: { state: WorkspaceState; setState: React.Dispatch<React.SetStateAction<WorkspaceState>>; showToast: (message: string) => void }) {
  const [output, setOutput] = useState<'quick' | 'full'>('quick');
  const [duration, setDuration] = useState(60);
  const [purpose, setPurpose] = useState('Reading response');
  return (
    <>
      <WorkspaceHeader eyebrow="EVIDENCE → CLAIMS → ARGUMENT → DRAFT" title="Compose" description="生成完整文稿之前，先确认可追溯的论证结构。" />
      <div className="compose-layout">
        <section className="argument-builder">
          <div className="panel-heading"><span>ARGUMENT BUILDER</span><small>{state.argumentApproved ? '已由用户确认' : '待确认'}</small></div>
          <label className="thesis-field"><span>THESIS</span><textarea rows={4} value={state.argumentThesis} onChange={(event) => setState((value) => ({ ...value, argumentThesis: event.target.value, argumentApproved: false }))} /></label>
          <div className="argument-flow">
            <article><span>CLAIM 1</span><p>路径依赖擅长解释制度持续性，但对稳定时期内的变化空间解释不足。</p><small>Evidence: Pierson 2000 · M&T 2010</small></article>
            <article><span>CLAIM 2</span><p>规则模糊性与执行空间使变化可以在形式连续性下发生。</p><small>Evidence: S&T 2005 · M&T 2010 · Hacker 2004</small></article>
            <article className="counter"><span>COUNTERARGUMENT</span><p>渐进变化类型可能只是对结果的事后命名，未必构成独立因果机制。</p><small>Evidence needed: direct methodological critique</small></article>
            <article><span>RESPONSE</span><p>类型学的价值在于连接规则特征、行动者权力与可观察过程，而不是单独由结果反推机制。</p><small>Synthesis claim · requires cautious wording</small></article>
          </div>
          <label className="approval-check"><input type="checkbox" checked={state.argumentApproved} onChange={(event) => setState((value) => ({ ...value, argumentApproved: event.target.checked }))} /><span><strong>Approve structure</strong><small>确认后才能生成 Full 文稿</small></span></label>
        </section>
        <aside className="output-builder">
          <div className="output-tabs"><button className={output === 'quick' ? 'active' : ''} onClick={() => setOutput('quick')}>Quick</button><button className={output === 'full' ? 'active' : ''} onClick={() => setOutput('full')}>Full</button></div>
          {output === 'quick' ? <><p className="output-help">为课堂即时表达生成可控时长的论证提纲。</p><div className="duration-control">{[30, 60, 120].map((item) => <button key={item} className={duration === item ? 'active' : ''} onClick={() => setDuration(item)}><strong>{item}</strong><span>sec</span></button>)}</div><button className="solid-button full" disabled={!state.argumentApproved} onClick={() => setState((value) => ({ ...value, generatedQuick: true }))}>生成 {duration} 秒提纲</button>{!state.argumentApproved && <small className="disabled-note">请先确认 Argument 结构</small>}</> : <><p className="output-help">共用同一组 Evidence 与 Argument，只改变表达目的。</p><label className="purpose-field"><span>Purpose</span><select value={purpose} onChange={(event) => setPurpose(event.target.value)}>{['Oral presentation', 'Reading response', 'Discussion essay', 'Literature review', 'Research proposal', 'Academic draft'].map((item) => <option key={item}>{item}</option>)}</select></label><button className="solid-button full" disabled={!state.argumentApproved} onClick={() => setState((value) => ({ ...value, generatedFull: true }))}>生成 {purpose}</button>{!state.argumentApproved && <small className="disabled-note">请先确认 Argument 结构</small>}</>}
          <div className="provenance-rule"><span>◇</span><p><strong>Claim provenance stays attached</strong><small>证据、综合与假设保持不同状态。</small></p></div>
        </aside>
      </div>

      {output === 'quick' && state.generatedQuick && <section className="draft-output"><div className="draft-heading"><div><span>QUICK · {duration} SEC</span><h2>课堂发言提纲</h2></div><button className="outline-button" onClick={() => showToast('已复制提纲')}>复制</button></div><ol><li><b>Question</b><p>稳定的制度为什么仍会在没有明显断裂时发生变化？</p></li><li><b>Position</b><p>关键不是否定路径依赖，而是看到规则的解释与执行空间。</p></li><li><b>Evidence</b><p>M&T 的类型学以及 Hacker 对政策漂移的分析显示，“不改规则”同样可以改变结果。</p></li><li><b>Takeaway</b><p>因此，变迁研究应追问规则如何被执行，以及谁掌握解释权。</p></li></ol></section>}
      {output === 'full' && state.generatedFull && <section className="draft-output full-draft"><div className="draft-heading"><div><span>FULL · {purpose.toUpperCase()}</span><h2>渐进变迁：从制度稳定到规则内部的政治</h2></div><button className="outline-button" onClick={() => showToast('已生成新版本，旧版本仍可回溯')}>新建版本</button></div><div className="paper-copy"><p>历史制度主义的早期解释强调，收益递增与正反馈会使早期选择变得难以逆转（Pierson 2000）。这一视角深刻说明了制度的持续性，但对形式上保持稳定的制度如何在内部发生变化，仍然解释不足。</p><p>Mahoney 与 Thelen 将分析焦点转向规则的解释和执行。它们的核心贡献在于指出，规则的模糊性与行动者掌握的权力资源共同打开了渐进变迁的空间（Mahoney and Thelen 2010）。这一视角不是将所有变化归为单一逻辑，而是要求我们识别分层、漂移、转换与替代各自的经验痕迹。</p><p>然而，现有类型学的边界也应保持可见：不同机制可能在同一历史过程中重叠，而对结果的事后命名不足以证明因果机制。因此，一个更可靠的研究策略是将机制类型与过程证据绑定，并明确检验替代解释。</p></div><ClaimAudit showToast={showToast} /></section>}
    </>
  );
}

function ClaimAudit({ showToast }: { showToast: (message: string) => void }) {
  return <aside className="claim-audit"><div className="audit-title"><span>CLAIM AUDIT</span><b>Run complete</b></div><div className="audit-numbers"><span><strong>11</strong>Academic claims</span><span><strong>8</strong>Verified evidence</span><span><strong>2</strong>Synthesis</span><span><strong>1</strong>Hypothesis</span><span className="ok"><strong>0</strong>Unsupported</span></div><div className="contested-warning"><i>!</i><div><strong>CONTESTED CLAIM · 1</strong><p>“现有研究已经证明”会夸大共识，建议改为“现有文献提出”。</p></div><button onClick={() => showToast('已使用谨慎表述，并保留原始版本')}>谨慎改写</button></div></aside>;
}

function GuidePage({ startSession, openWorkspace }: { startSession: (mode: SessionMode) => void; openWorkspace: (tab?: WorkspaceTab) => void }) {
  const [selectedMode, setSelectedMode] = useState<SessionMode>('assignment_led');
  const [activeStage, setActiveStage] = useState(0);
  const entryModes: { id: SessionMode; number: string; title: string; description: string; action: string }[] = [
    { id: 'assignment_led', number: '01', title: '我有导师命题', description: '先拆解问题、交付物和优先级，由你确认后再处理材料。', action: '开始导师命题研究' },
    { id: 'material_led', number: '02', title: '我有研究材料', description: '先导入文献或笔记，再从材料中形成可检验的研究问题。', action: '导入材料开始研究' },
  ];
  const stages = [
    { number: '01', title: '确认任务', code: 'TASK', summary: '把模糊要求变成你确认过的研究约束。', doing: '核对研究问题、必答项与交付形式', records: 'Task interpretation、排序与星标优先级', complete: '任务解读已由你确认' },
    { number: '02', title: '组织文献', code: 'LITERATURE', summary: '区分来源角色、重要性与核验状态。', doing: '导入并筛选真正相关的来源', records: 'DOI、Source Role、Importance、Verification', complete: '核心来源身份与角色清晰' },
    { number: '03', title: '建立证据', code: 'EVIDENCE', summary: '把“读过文献”转化为可定位的证据单元。', doing: '标记原文并补充页码或段落定位', records: 'Evidence Card、Locator、Status、Confidence', complete: '关键证据都能回到原文' },
    { number: '04', title: '形成主张', code: 'CLAIM', summary: '在支持、冲突与缺口之间形成谨慎主张。', doing: '比较证据并处理替代解释', records: 'Claim、证据关系、锁定与审计事件', complete: '每个主张都有证据来源' },
    { number: '05', title: '写作与 QA', code: 'WRITING · QA', summary: '先确认论证结构，再生成并核验输出。', doing: '审批 Argument，检查 Unsupported 与 Contested', records: '版本、Claim provenance、QA 阻断项', complete: '阻断项清零后再导出' },
  ];
  const currentEntry = entryModes.find((item) => item.id === selectedMode) || entryModes[0];
  const currentStage = stages[activeStage];
  const steps = [
    ['选择起点', '有材料时选择 Material-led；有导师命题时选择 Assignment-led。两种模式最终进入同一个证据工作区。'],
    ['确认任务解读', '检查、修改和排序 Task interpretation。星标代表优先实现；未经你确认，系统不会进入深度处理。'],
    ['组织文献', '为来源设置 Role 与 Importance，并单独查看 Verification。三者表达不同判断，不能相互替代。'],
    ['提取证据', '将可用内容保存为 Evidence Card，同时保留来源、页码或 Locator、证据类型与核验状态。'],
    ['比较与扩展', '先在 Synthesis 中识别共识、争议和缺口，再按 Search Profile 扩展文献；候选来源必须经过人工选择。'],
    ['建立论证', '在 Connect 中形成研究连接，再用 Evidence → Claim → Argument 的顺序搭建结构，避免从文献直接生成全文。'],
    ['写作与 QA', '生成 Quick 或 Full 输出后，检查 Unsupported、Contested Claim 与缺失定位；通过后再导出或保存到 Zotero。'],
  ];
  const principles = [
    ['Verification', '来源或证据是否经过核验。'],
    ['Importance', '它对当前任务有多重要。'],
    ['Relevance', '它与当前研究问题有多匹配。'],
    ['Locator', '证据在原始材料中的可回溯位置。'],
    ['Lock', '你已确认并要求系统保留的判断。'],
  ];

  return (
    <>
      <section className="standalone-page guide-page">
        <header className="guide-onboarding">
          <div className="guide-onboarding-copy">
            <p className="guide-kicker">先理解流程，再开始研究</p>
            <h1>让每一个科研判断，<br />都能回到可靠证据。</h1>
            <p>Aurora’s Research Workshop 把研究问题、文献、Evidence Card、Claim、写作与 QA 串联成一条可追溯的证据链。用两分钟理解平台逻辑，再选择你的研究起点。</p>
            <ul className="guide-trust-row" aria-label="平台核心保障">
              <li>DOI / 页码始终可见</li>
              <li>状态与置信度可审计</li>
              <li>关键阻断提前暴露</li>
            </ul>
          </div>
          <aside className="guide-entry-card" aria-labelledby="entry-title">
            <p className="guide-card-kicker">选择研究起点</p>
            <h2 id="entry-title">你现在手上有什么？</h2>
            <div className="guide-entry-options">
              {entryModes.map((item) => (
                <button key={item.id} className={selectedMode === item.id ? 'selected' : ''} aria-pressed={selectedMode === item.id} onClick={() => setSelectedMode(item.id)}>
                  <b>{item.number}</b><span><strong>{item.title}</strong><small>{item.description}</small></span><i aria-hidden="true">→</i>
                </button>
              ))}
            </div>
            <button className="guide-main-action" onClick={() => startSession(selectedMode)}>{currentEntry.action}<span aria-hidden="true">→</span></button>
            <button className="guide-preview-action" onClick={() => openWorkspace('sources')}>先查看示例工作区</button>
          </aside>
        </header>

        <section className="guide-journey" aria-labelledby="guide-journey-title">
          <div className="guide-section-title"><span>PLATFORM LOGIC</span><h2 id="guide-journey-title">点击一个阶段，查看系统如何工作</h2></div>
          <div className="guide-stage-tabs" role="tablist" aria-label="研究流程阶段">
            {stages.map((stage, index) => (
              <button key={stage.number} role="tab" aria-selected={activeStage === index} className={activeStage === index ? 'active' : ''} onClick={() => setActiveStage(index)}>
                <span>{stage.number}</span><strong>{stage.title}</strong><small>{activeStage === index ? '正在预览' : '点击查看'}</small>
              </button>
            ))}
          </div>
          <article className="guide-stage-detail" role="tabpanel" aria-live="polite">
            <div className="guide-stage-summary">
              <span>{currentStage.number} / {currentStage.code}</span>
              <h3>{currentStage.title}</h3>
              <p>{currentStage.summary}</p>
              <b>完成条件：{currentStage.complete}</b>
            </div>
            <dl>
              <div><dt>你要做什么</dt><dd>{currentStage.doing}</dd></div>
              <div><dt>系统会记录</dt><dd>{currentStage.records}</dd></div>
              <div><dt>判断是否完成</dt><dd>{currentStage.complete}</dd></div>
            </dl>
          </article>
        </section>

        <div className="guide-body">
          <section className="guide-steps" aria-labelledby="guide-steps-title">
            <div className="guide-section-title"><span>FIRST RESEARCH RUN</span><h2 id="guide-steps-title">第一次使用，按这 7 步完成</h2></div>
            <ol>
              {steps.map(([title, copy], index) => (
                <li key={title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div><h3>{title}</h3><p>{copy}</p></div>
                </li>
              ))}
            </ol>
          </section>
          <aside className="guide-start-panel">
            <span>RECOMMENDED START</span>
            <h2>{currentEntry.title}</h2>
            <p>{currentEntry.description} 第一次不必追求完整文献库。</p>
            <ul>
              <li>一个明确问题</li>
              <li>少量高价值来源</li>
              <li>可接受的输出形式</li>
            </ul>
            <button className="solid-button full" onClick={() => startSession(selectedMode)}>{currentEntry.action} <span>→</span></button>
            <button className="guide-secondary" onClick={() => openWorkspace('sources')}>查看示例工作区</button>
          </aside>
        </div>

        <section className="guide-rules" aria-labelledby="guide-rules-title">
          <div className="guide-section-title"><span>DECISION RULES</span><h2 id="guide-rules-title">五个字段，不要混为一谈</h2></div>
          <dl>
            {principles.map(([term, description]) => <div key={term}><dt>{term}</dt><dd>{description}</dd></div>)}
          </dl>
          <div className="guide-caution"><strong>UNKNOWN STAYS UNKNOWN</strong><p>没有 DOI、页码、全文版本或外部核验结果时，平台应显示“未录入”或“待核验”，而不是补出一个看似完整的答案。</p></div>
        </section>
      </section>
      <PrincipleFooter />
    </>
  );
}

function ResearchProfile({ setState, showToast }: { setState: React.Dispatch<React.SetStateAction<WorkspaceState>>; showToast: (message: string) => void }) {
  const [promoted, setPromoted] = useState(false);
  return <section className="standalone-page"><header className="page-intro"><p className="hero-kicker">LONG-TERM USER-CONTROLLED MEMORY</p><h1>Research Profile</h1><p>长期研究方向与临时会话明确分层；AI 只能建议，不能自动升级方向。</p></header><div className="profile-layout"><section className="profile-tree"><div className="panel-heading"><span>RESEARCH TRACKS</span><small>User confirmed</small></div><div className="main-track"><span>MAIN DIRECTION</span><h2>AI Governance</h2><p>研究算法系统如何被规则、组织与公共价值塑造。</p><div className="subtracks"><article><i /> <span><b>Algorithmic Accountability</b><small>12 sessions · active</small></span></article><article><i /> <span><b>AI Regulation</b><small>7 sessions · active</small></span></article><article><i /> <span><b>Public-sector AI</b><small>4 sessions · active</small></span></article></div></div><div className={`temporary-track ${promoted ? 'promoted' : ''}`}><div><span>{promoted ? 'SUBTRACK' : 'TEMPORARY'}</span><h3>AI in universities</h3><p>2 sessions · 尚未证明是长期方向</p></div><div>{!promoted && <button className="outline-button" onClick={() => { setPromoted(true); showToast('已由你确认为 Subtrack，该变更已记录在 Audit Events'); }}>Promote to Subtrack</button>}<button onClick={() => showToast('临时方向已保留，未升级')}>Keep temporary</button></div></div></section><aside className="profile-facets"><div className="panel-heading"><span>RESEARCH FACETS</span><button>Edit</button></div>{[['Theories', ['Historical institutionalism', 'Policy feedback', 'Sociotechnical systems']], ['Concepts', ['Accountability', 'Institutional drift', 'Public value']], ['Methods', ['Comparative historical', 'Process tracing', 'Policy text analysis']], ['Cases / regions', ['East Asia', 'European Union', 'Public sector']]].map(([label, items]) => <div className="facet" key={String(label)}><span>{label as string}</span><p>{(items as string[]).map((item) => <b key={item}>{item}</b>)}</p></div>)}</aside></div><section className="preference-summary"><div><p className="hero-kicker">WHAT I CURRENTLY PRIORITIZE FOR YOU</p><h2>可解释的偏好摘要</h2><p>来自显式评分与行为记录，不是黑箱推荐模型。</p></div><div className="preference-columns"><div><span>Increasing</span><p>↑ 政治制度</p><p>↑ 比较研究</p><p>↑ 东亚案例</p></div><div><span>Lower</span><p>↓ 纯描述研究</p><p>↓ 缺少方法信息</p></div><div className="preference-actions"><button className="outline-button" onClick={() => showToast('偏好现在可以被你逐项编辑')}>Edit</button><button onClick={() => { setState((value) => ({ ...value })); showToast('已准备重置；演示中未删除原始行为记录'); }}>Reset</button></div></div></section></section>;
}

function Integrations({ state, setState, showToast }: { state: WorkspaceState; setState: React.Dispatch<React.SetStateAction<WorkspaceState>>; showToast: (message: string) => void }) {
  const [selected, setSelected] = useState<string[]>(state.sources.slice(0, 2).map((source) => source.id));
  return <section className="standalone-page"><header className="page-intro"><p className="hero-kicker">CURATED INPUT & OUTPUT</p><h1>Integrations</h1><p>外部服务通过统一接入层工作，任何未知信息都保持为未知。</p></header><div className="integration-grid"><section className="zotero-panel"><div className="integration-brand"><i>Z</i><div><span>ZOTERO</span><h2>精选研究资产的输入与输出</h2></div><b className={state.zoteroConnected ? 'connected' : ''}>{state.zoteroConnected ? '● Demo connected' : '○ Not connected'}</b></div><p>只把已经审核的高价值来源和研究注释写入 Zotero，不会自动污染你的文献库。</p><button className="solid-button" onClick={() => { setState((value) => ({ ...value, zoteroConnected: !value.zoteroConnected })); showToast(state.zoteroConnected ? '已断开本地演示连接' : '已开启本地演示连接；未使用真实凭据'); }}>{state.zoteroConnected ? '断开演示连接' : '连接 Zotero 演示'}</button><div className="export-builder"><div className="panel-heading"><span>SAVE RESEARCH ASSETS</span><small>Intentional export</small></div><div className="export-sources">{state.sources.slice(0, 4).map((source) => <label key={source.id}><input type="checkbox" checked={selected.includes(source.id)} onChange={() => setSelected((value) => value.includes(source.id) ? value.filter((id) => id !== source.id) : [...value, source.id])} /><span><strong>{source.title}</strong><small>{source.role} · {'★'.repeat(source.importance)} · {source.verification}</small></span></label>)}</div><label className="collection-field"><span>Collection</span><select><option>AI Governance / Institutional Theory</option><option>Coursework / Week 03</option></select></label><fieldset className="export-options"><legend>Add</legend>{['Metadata', 'Tags', 'Research note', 'User rating', 'Source role', 'Key pages', 'Session context'].map((item) => <label key={item}><input type="checkbox" defaultChecked />{item}</label>)}</fieldset><button className="solid-button full" disabled={!state.zoteroConnected || !selected.length} onClick={() => showToast(`已演示保存 ${selected.length} 条来源与 Research Note`)}>{state.zoteroConnected ? `保存 ${selected.length} 条至 Zotero` : '请先连接 Zotero'}</button></div></section><aside className="provider-stack"><div className="panel-heading"><span>LITERATURE PROVIDERS</span><small>Adapter status</small></div>{[{ name: 'Crossref', use: 'DOI identity / bibliographic metadata', status: 'Ready to configure' }, { name: 'OpenAlex', use: 'Broad discovery / scholarly graph', status: 'Ready to configure' }, { name: 'Semantic Scholar', use: 'Supplementary search / citation', status: 'Disabled in MVP demo' }, { name: 'LLM Provider', use: 'Reasoning / structured extraction', status: 'Local demo content' }].map((provider) => <article key={provider.name}><i>{provider.name.slice(0, 2).toUpperCase()}</i><div><strong>{provider.name}</strong><p>{provider.use}</p><small>{provider.status}</small></div></article>)}<div className="unknown-policy"><span>UNKNOWN STAYS UNKNOWN</span><p>没有已授权提供方时，JIF、引用量与出版状态不会被模型猜测。</p></div></aside></div></section>;
}

function PrincipleFooter() {
  return <footer><p><span>PRINCIPLE</span> Verification ≠ Importance ≠ Relevance</p><p>用户确认与锁定的学术判断，永远优先于 AI 建议。</p></footer>;
}
