// Every fact on the page lives here, so the page and its claims can be checked against the repository.
export const REPO = 'https://github.com/thecatthatflies/interface'

export type Skill = { name: string; what: string; detail?: string; tier: 'foundation' | 'brand' | 'type' }

export const SKILLS: Skill[] = [
  {
    name: 'interface-guidelines',
    tier: 'foundation',
    what: 'The foundation every other skill builds on.',
    detail: 'Nine ranked principles for both readers, a brief, build, verify, operate workflow, and a rendered-page audit: axe-core plus 26 checks at 375, 768 and 1440 px, light and dark.',
  },
  {
    name: 'brand-identity',
    tier: 'brand',
    what: 'Logo, color, type and assets as real files.',
    detail: 'OKLCH palettes checked against WCAG 2.2, SVG logos with a 16 to 512 px contact sheet, favicons, social cards, tokens and a guidelines page. This site was branded with it.',
  },
  { name: 'dashboard-design', tier: 'type', what: 'Monitoring, analytics, live data, alarms, honest charts.' },
  { name: 'landing-page-design', tier: 'type', what: 'Launch and marketing pages with a real art-direction step.' },
  { name: 'web-app-design', tier: 'type', what: 'SaaS and internal tools: tables, settings, permissions.' },
  { name: 'mobile-app-design', tier: 'type', what: 'iOS, Android and mobile web conventions, reach, offline.' },
  { name: 'form-design', tier: 'type', what: 'Sign-up, checkout and multi-step flows that forgive.' },
  { name: 'ai-chat-design', tier: 'type', what: 'Streaming, sources, tool calls, approvals, trust.' },
  { name: 'agent-tool-design', tier: 'type', what: 'MCP tools, CLIs and APIs, with a tool-definition linter.' },
  { name: 'ecommerce-design', tier: 'type', what: 'Product pages, cart and checkout, readable product data.' },
  { name: 'content-site-design', tier: 'type', what: 'Docs, blogs and knowledge bases: reading and search.' },
  { name: 'desktop-app-design', tier: 'type', what: 'Electron, Tauri and native: menus, shortcuts, panes.' },
  { name: 'email-design', tier: 'type', what: 'HTML email that survives Gmail, Outlook and dark mode.' },
]

export const RESULTS = [
  { arm: 'No skill', checks: 19, axe: 'Missing page language and an unnamed select', tokens: '133k', minutes: 8, shot: 'without_skill' },
  { arm: 'interface-guidelines', checks: 26, axe: 'None', tokens: '186k', minutes: 13, shot: 'with_skill' },
  { arm: 'taste-skill v2.1.5', checks: 23, axe: 'None', tokens: '241k', minutes: 15, shot: 'rival_skill' },
] as const

// The 1992 Macintosh Human Interface Guidelines, re-read for an agent reader. Verdicts from research/01-macintosh-hig.md.
export const PRINCIPLES = [
  {
    name: 'Feedback and dialog',
    page: 'pp. 9-10',
    verdict: 'Transfers directly',
    then: 'Keep people informed: show that a command was received, what is happening, and when it is done.',
    now: 'An agent needs the same signal in the tree: a status region that says what changed, not a color flash it cannot see.',
  },
  {
    name: 'Perceived stability',
    page: 'p. 11',
    verdict: 'Transfers, stricter for agents',
    then: 'Familiar, predictable places. Windows and controls stay where people left them.',
    now: 'Agents hold references to elements. If live updates rebuild the row, the reference dies mid-task. Names and nodes must survive re-render.',
  },
  {
    name: 'Forgiveness',
    page: 'p. 10',
    verdict: 'Amended',
    then: 'Make actions reversible, and warn before anything that destroys work.',
    now: 'For agents this splits into three mechanisms: preview before acting, reversal after, and safe repetition. A confirm dialog is not authority, because an agent can click it.',
  },
  {
    name: 'See and point',
    page: 'p. 7',
    verdict: 'Transfers for discovery',
    then: 'People choose from what they can see rather than remembering commands.',
    now: 'Agents also choose from what is exposed. A hover-only action or an unlabeled icon is invisible to both readers.',
  },
  {
    name: 'Direct manipulation',
    page: 'pp. 5-6',
    verdict: 'Partial',
    then: 'Drag the thing itself, and see the result at once.',
    now: 'Dragging means nothing to an agent. Every drag needs an equivalent named action: "Move INC-2290 to Hana Sato".',
  },
  {
    name: 'Aesthetic integrity',
    page: 'pp. 11-12',
    verdict: 'Mostly human',
    then: 'Graphics serve the content and stay coherent.',
    now: 'Agents do not see beauty. That is why polish and machine legibility have to be checked separately: one does not imply the other.',
  },
] as const

// Folklore removed from the skills, with the replacement wording they use. From skills/interface-guidelines/references/evidence.md.
export const MYTHS = [
  { claim: 'The 400 ms Doherty threshold', instead: 'Sub-second response helps routine entry. The number is not in the original paper.' },
  { claim: "Hick's law means fewer options", instead: 'Design for search and grouping. Mean choice-overload effect across studies is about zero.' },
  { claim: '7 plus or minus 2 items per menu', instead: 'A memory finding misapplied. Visible items need no remembering.' },
  { claim: 'Skeletons make loading feel faster', instead: 'Studies do not show it. Skeletons keep the layout still, which is reason enough.' },
  { claim: 'Dark mode reduces eye strain', instead: 'Unsupported. Offer it as a preference.' },
  { claim: 'Blue builds trust', instead: 'Color associations are weak and cultural. Choose for distinctiveness and the idea.' },
] as const

export const INSTALL = {
  claude: ['/plugin marketplace add thecatthatflies/interface', '/plugin install interface@interface'],
  any: ['git clone https://github.com/thecatthatflies/interface.git', 'cd interface', 'bash install.sh'],
}
