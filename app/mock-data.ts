import type { WorkspaceState } from './domain';

export const initialWorkspace: WorkspaceState = {
  sessionTitle: '导师第三周阅读材料',
  researchQuestion: '比较历史制度主义如何解释渐进式制度变迁，并评估不同机制的解释边界。',
  assignmentConfirmed: true,
  sources: [
    {
      id: 's1', short: 'M&T', title: 'Explaining Institutional Change: Ambiguity, Agency, and Power',
      authors: 'James Mahoney · Kathleen Thelen', year: 2010, type: 'book', origin: 'upload', role: 'Anchor', importance: 5,
      verification: 'partial', verificationLabel: '书目已交叉对照 · 全文待处理', locked: true, pages: 254,
      selectedChapters: ['Introduction: A Theory of Gradual Institutional Change', 'Chapter 2: Infiltrating the State'],
      insight: {
        question: '为什么看似稳定的制度会在没有外部冲击时渐进转化？',
        argument: '制度规则的模糊性与执行空间，为不同类型行动者提供了分层、转换、漂移和替代的可能。',
        framework: '渐进制度变迁 · 政治经济学', method: '比较历史分析 · 类型学',
        contribution: '将变迁的内生来源与行动者类型纳入同一分析框架。',
        limitation: '机制分类之间的边界在经验案例中可能重叠。',
      },
    },
    {
      id: 's2', short: 'S&T', title: 'Beyond Continuity: Institutional Change in Advanced Political Economies',
      authors: 'Wolfgang Streeck · Kathleen Thelen', year: 2005, type: 'book_chapter', origin: 'upload', role: 'Foundation', importance: 5,
      verification: 'verified', verificationLabel: '身份字段一致 · 演示记录', locked: false,
      insight: {
        question: '制度连续性的表象如何掩盖长期累积的结果性转变？',
        argument: '渐进过程可以在长时段内导致非连续性结果。', framework: '制度渐进变迁',
        method: '跨国案例比较', contribution: '将分层、漂移、转换与排挤解释为变迁模式。', limitation: '对机制之间的因果转换着墨较少。',
      },
    },
    {
      id: 's3', short: 'THL', title: 'How Institutions Evolve: The Political Economy of Skills in Germany, Britain, the United States, and Japan',
      authors: 'Kathleen Thelen', year: 2004, type: 'book', origin: 'zotero', role: 'Foundation', importance: 4,
      verification: 'verified', verificationLabel: 'Zotero 书目与上传文件一致 · 演示记录', locked: false, pages: 333,
      selectedChapters: ['Chapter 1: The Political Economy of Skills'],
      insight: {
        question: '技能形成制度为何在不同国家走向差异化路径？', argument: '制度演化由早期联盟、反馈与关键节点的序列共同塑造。',
        framework: '历史制度主义 · 路径依赖', method: '历史比较 · 过程追踪', contribution: '展示制度再生产中的政治冲突与变化。', limitation: '案例设计更擅长解释路径，较少处理快速断裂。',
      },
    },
    {
      id: 's4', short: 'PRS', title: 'Increasing Returns, Path Dependence, and the Study of Politics',
      authors: 'Paul Pierson', year: 2000, type: 'article', origin: 'upload', role: 'Alternative', importance: 4,
      verification: 'verified', verificationLabel: '题名、作者、年份一致 · 演示记录', locked: false,
      insight: {
        question: '政治过程中的正反馈如何产生路径依赖？', argument: '收益递增使早期选择变得自我强化，后续退出成本持续上升。',
        framework: '路径依赖 · 正反馈', method: '理论构建 · 历史例证', contribution: '为政治制度稳定性提供时间性解释。', limitation: '对稳定期内的内生变化解释不足。',
      },
    },
    {
      id: 's5', short: 'H&T', title: 'Political Science and the Three New Institutionalisms',
      authors: 'Peter A. Hall · Rosemary C. R. Taylor', year: 1996, type: 'review', origin: 'upload', role: 'Context', importance: 3,
      verification: 'partial', verificationLabel: '书目字段已对照 · 全文版本待确认', locked: false,
      insight: {
        question: '历史、理性选择与社会学制度主义如何理解行为与制度？', argument: '三条制度主义传统各有优势，也需要更多理论对话。',
        framework: '新制度主义', method: '理论综述 · 概念比较', contribution: '建立了广泛使用的三种制度主义比较坐标。', limitation: '更偏理论家族分类，并非变迁机制的经验检验。',
      },
    },
    {
      id: 's6', short: 'HCK', title: 'Privatizing Risk without Privatizing the Welfare State: The Hidden Politics of Social Policy Retrenchment in the United States',
      authors: 'Jacob S. Hacker', year: 2004, type: 'article', origin: 'discovery', role: 'Supporting', importance: 4,
      verification: 'warning', verificationLabel: '候选来源 · 需人工确认全文版本', locked: false,
      insight: {
        question: '没有明显立法逆转时，福利国家如何发生实质紧缩？', argument: '政策漂移通过不更新现有规则，在外部环境变化时重新分配风险。',
        framework: '政策漂移 · 福利国家', method: '历史制度分析', contribution: '将“不行动”识别为可产生分配后果的政治机制。', limitation: '美国案例的制度特殊性限制了外推。',
      },
    },
  ],
  relations: [
    { id: 'r1', from: 'S&T', to: 'M&T', type: 'conceptual_origin', basis: 'DIRECT_TEXTUAL_ENGAGEMENT', evidence: 'M&T Introduction · pp. 1–37（示例定位）', confidence: 'High', locked: true },
    { id: 'r2', from: 'PRS', to: 'M&T', type: 'alternative_explanation', basis: 'STRUCTURED_COMPARISON', evidence: '比较维度：变迁来源、时间性、行动者空间', confidence: 'Medium', locked: false },
    { id: 'r3', from: 'HCK', to: 'M&T', type: 'applies', basis: 'DIRECT_CITATION', evidence: '政策漂移与规则不更新的机制连接（待全文定位）', confidence: 'Medium', locked: false },
  ],
  candidates: [
    {
      id: 'c1', title: 'Institutions and Social Conflict', authors: 'Jack Knight', year: 1992, venue: 'Cambridge University Press',
      match: 91, anchor: 84, verification: 'partial', reason: ['直接处理制度与分配冲突', '补足行动者权力机制', '与 Anchor 的权力视角一致'], relation: 'Extends Anchor', status: 'candidate', zotero: false, relevanceRating: 0, importanceRating: 0,
    },
    {
      id: 'c2', title: 'A Theory of Gradual Institutional Change', authors: 'James Mahoney · Kathleen Thelen', year: 2010, venue: 'Cambridge University Press',
      match: 96, anchor: 100, verification: 'verified', reason: ['Anchor 书籍的理论导言', '完整定义四种变迁机制', '与当前问题直接同构'], relation: 'Part of Anchor', status: 'candidate', zotero: false, relevanceRating: 0, importanceRating: 0,
    },
    {
      id: 'c3', title: 'Gradual Transformations of Economic Systems', authors: 'Wolfgang Streeck', year: 2009, venue: 'Oxford University Press',
      match: 86, anchor: 78, verification: 'warning', reason: ['延伸制度渐变至政治经济体系', '提供长时段比较素材', '书目版本仍需人工确认'], relation: 'Related framework', status: 'candidate', zotero: false, relevanceRating: 0, importanceRating: 0,
    },
  ],
  connections: [
    { id: 'known', label: 'Known', helper: '当前可由证据支持的知识', value: '现有材料共同指向：制度稳定不等于制度静止，规则的执行与解释空间可以成为变迁来源。', locked: true },
    { id: 'gap', label: 'Gap', helper: '现有解释仍未解决什么', value: '不同变迁机制在经验过程中常常共存，现有类型学对机制转换条件说明不足。', locked: false },
    { id: 'connection', label: 'Connection', helper: '与长期研究方向的连接', value: '算法问责中“规则存在但执行不更新”的情形，可能是政策漂移在数字治理中的新表现。', locked: false },
    { id: 'hypothesis', label: 'Hypothesis', helper: '需要后续验证的可检验判断', value: '当问责规则的修订门槛高、但执行解释权分散时，算法治理更可能通过漂移而非正式替代发生变化。', locked: false },
    { id: 'alternative', label: 'Alternative explanation', helper: '可能与假设竞争的机制', value: '观察到的变化也可能来自技术能力差异，而非制度规则本身的执行空间。', locked: false },
    { id: 'evidence', label: 'Evidence needed', helper: '什么证据能支持或推翻假设', value: '规则修订记录、问责决定文本、政策执行者访谈，以及引入算法前后的案件处理序列。', locked: false },
    { id: 'method', label: 'Possible method', helper: '可行的经验设计', value: '两个执行权结构不同的公共部门比较，结合过程追踪与政策文本编码。', locked: false },
    { id: 'significance', label: 'Research significance', helper: '这个问题为什么值得研究', value: '将数字治理中常被视为“技术落后”的问题，重新识别为可比较的制度变迁机制。', locked: false },
  ],
  activeTracks: ['AI Governance', 'Algorithmic Accountability'],
  argumentApproved: false,
  argumentThesis: '历史制度主义对渐进变迁的贡献，不在于否定路径依赖，而在于将规则解释空间、行动者权力与多种变迁机制纳入稳定期分析。',
  generatedQuick: false,
  generatedFull: false,
  zoteroConnected: false,
};

export const sessionCards = [
  { id: 'institution', title: '制度变迁理论争议', question: '制度渐进变迁在何种条件下取代断裂式解释？', meta: '5 篇来源 · 2 个研究问题', status: '证据整理中', progress: 68, accent: 'umber' },
  { id: 'algorithm', title: '算法治理中的问责机制', question: '公共部门中算法问责的制度性缺口是什么？', meta: '12 篇来源 · 昨日编辑', status: '论证待确认', progress: 82, accent: 'sage' },
  { id: 'assignment', title: '导师第三周阅读材料', question: '比较四种国家能力解释的前提与局限。', meta: '7 篇来源 · 今日创建', status: '任务待确认', progress: 24, accent: 'blue' },
];
