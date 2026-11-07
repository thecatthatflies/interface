import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CheckCircle, Eye, Robot, WarningOctagon } from '@phosphor-icons/react'

type Build = 'skill' | 'noskill'
type Line = { depth: number; role: string; name: string; extra?: string; problem?: boolean }

const RESPONDERS = ['Unassigned', 'Hana Sato', 'Tomas Lindqvist', 'Maya Okafor']

// A small, honest accessibility-tree reader: the roles and names an agent gets from this DOM.
// It handles the elements used in the specimen; it is not a full ARIA implementation.
function implicitRole(el: Element): string | null {
  const explicit = el.getAttribute('role')
  if (explicit) return explicit
  const tag = el.tagName.toLowerCase()
  if (/^h[1-6]$/.test(tag)) return 'heading'
  if (tag === 'button') return 'button'
  if (tag === 'a' && el.hasAttribute('href')) return 'link'
  if (tag === 'select') return 'combobox'
  if (tag === 'article') return 'article'
  if (tag === 'dl') return 'list'
  if (tag === 'time') return 'time'
  return null
}

function accessibleName(el: Element): string {
  const label = el.getAttribute('aria-label')
  if (label) return label
  const labelledby = el.getAttribute('aria-labelledby')
  if (labelledby) {
    return labelledby
      .split(' ')
      .map((id) => el.ownerDocument.getElementById(id)?.textContent?.trim() ?? '')
      .join(' ')
      .trim()
  }
  if (el.tagName === 'SELECT' && el.id) {
    const l = el.ownerDocument.querySelector(`label[for="${el.id}"]`)
    return l?.textContent?.trim() ?? ''
  }
  if (el.tagName === 'SELECT') return ''
  return (el.textContent ?? '').replace(/\s+/g, ' ').trim()
}

function readTree(root: Element): Line[] {
  const out: Line[] = []
  const walk = (el: Element, depth: number) => {
    if (el.getAttribute('aria-hidden') === 'true') return
    const role = implicitRole(el)
    const clickableGeneric = !role && (el as HTMLElement).dataset.clickable === 'true'
    if (role) {
      const name = accessibleName(el)
      const line: Line = { depth, role, name }
      if (role === 'heading') line.extra = `level=${el.tagName.slice(1)}`
      if (role === 'combobox') line.extra = `value="${(el as HTMLSelectElement).value}"`
      if ((role === 'button' || role === 'combobox') && (!name || out.some((o) => o.role === role && o.name === name))) line.problem = true
      if (role === 'combobox' && !name) line.problem = true
      out.push(line)
      if (['heading', 'button', 'link', 'status', 'time', 'combobox'].includes(role)) return
      for (const c of Array.from(el.children)) walk(c, depth + 1)
      return
    }
    if (clickableGeneric) {
      out.push({ depth, role: 'generic', name: accessibleName(el), extra: 'clickable, not focusable', problem: true })
      return
    }
    const direct = Array.from(el.childNodes)
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent?.trim())
      .filter(Boolean)
      .join(' ')
    if (direct && el.children.length === 0) out.push({ depth, role: 'text', name: direct })
    for (const c of Array.from(el.children)) walk(c, depth)
  }
  walk(root, 0)
  return out
}

export function TwoReaders() {
  const [build, setBuild] = useState<Build>('skill')
  const [acked, setAcked] = useState(false)
  const [responder, setResponder] = useState('Unassigned')
  const [lines, setLines] = useState<Line[]>([])
  const cardRef = useRef<HTMLDivElement>(null)

  const refresh = useCallback(() => {
    if (cardRef.current) setLines(readTree(cardRef.current))
  }, [])

  useLayoutEffect(refresh, [build, acked, responder, refresh])
  useEffect(() => {
    if (!cardRef.current) return
    const mo = new MutationObserver(refresh)
    mo.observe(cardRef.current, { subtree: true, childList: true, characterData: true, attributes: true })
    return () => mo.disconnect()
  }, [refresh])

  const problems = lines.filter((l) => l.problem).length
  const skill = build === 'skill'
  const status = acked ? 'Acknowledged' : 'Firing, not acknowledged'

  return (
    <div className="relative">
      <div role="group" aria-label="Which build to inspect" className="mb-4 inline-flex rounded-full border border-line bg-surface p-1 text-sm">
        {(
          [
            ['skill', 'Built with the skill'],
            ['noskill', 'Built without'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={build === value}
            onClick={() => setBuild(value)}
            className={`min-h-11 rounded-full px-4 font-medium transition-colors ${
              build === value ? 'bg-ink text-bg' : 'text-muted hover:text-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* What a person sees: the same pixels in both builds. */}
        <figure className="m-0 rounded-[var(--radius-panel)] border border-line bg-surface shadow-[0_24px_60px_-28px_color-mix(in_oklab,var(--color-primary)_45%,transparent)]">
          <figcaption className="flex items-center gap-2 border-b border-line px-5 py-3 text-sm text-muted">
            <Eye size={18} weight="bold" aria-hidden="true" />
            What a person sees
          </figcaption>
          <div ref={cardRef} className="p-5">
            <article aria-labelledby={skill ? 'inc-title' : undefined}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-danger-soft px-2 py-0.5 font-mono text-xs font-medium text-danger">SEV1</span>
                {skill ? (
                  <span role="status" className={`text-sm font-medium ${acked ? 'text-ok' : 'text-danger'}`}>
                    {status}
                  </span>
                ) : (
                  <span className={`text-sm font-medium ${acked ? 'text-ok' : 'text-danger'}`}>{status}</span>
                )}
              </div>
              {skill ? (
                <h2 id="inc-title" className="mt-3 text-lg font-bold leading-snug text-ink">
                  INC-2291 Checkout error rate above SLO
                </h2>
              ) : (
                <div className="mt-3 text-lg font-bold leading-snug text-ink">INC-2291 Checkout error rate above SLO</div>
              )}
              <p className="mt-1 text-sm text-muted">
                Error rate <span className="font-mono text-ink">8.42%</span> against an SLO of <span className="font-mono">0.50%</span>
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {skill ? (
                  <button
                    type="button"
                    onClick={() => setAcked(true)}
                    disabled={acked}
                    className="rounded-[var(--radius-control)] bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition active:translate-y-px disabled:opacity-60"
                  >
                    {acked ? 'Acknowledged' : 'Acknowledge'}
                    <span className="sr-only"> INC-2291</span>
                  </button>
                ) : (
                  <div
                    data-clickable="true"
                    onClick={() => setAcked(true)}
                    className="cursor-pointer select-none rounded-[var(--radius-control)] bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition active:translate-y-px"
                    style={{ opacity: acked ? 0.6 : 1 }}
                  >
                    {acked ? 'Acknowledged' : 'Acknowledge'}
                  </div>
                )}
                {skill && (
                  <label htmlFor="responder-skill" className="sr-only">
                    Responder for INC-2291
                  </label>
                )}
                <select
                  id={skill ? 'responder-skill' : undefined}
                  value={responder}
                  onChange={(e) => setResponder(e.target.value)}
                  className="rounded-[var(--radius-control)] border border-line-strong bg-surface px-3 py-2.5 text-sm text-ink"
                >
                  {RESPONDERS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
            </article>
          </div>
        </figure>

        {/* What an agent reads: computed from the DOM above, live. */}
        <figure className="m-0 flex flex-col rounded-[var(--radius-panel)] border border-line bg-sunken">
          <figcaption className="flex items-center justify-between gap-3 border-b border-line px-5 py-3 text-sm text-muted">
            <span className="flex items-center gap-2">
              <Robot size={18} weight="bold" aria-hidden="true" className="text-agent-ink" />
              What an agent reads
            </span>
            <span aria-live="polite" className={`flex items-center gap-1.5 font-medium ${problems ? 'text-danger' : 'text-ok'}`}>
              {problems ? <WarningOctagon size={16} weight="fill" aria-hidden="true" /> : <CheckCircle size={16} weight="fill" aria-hidden="true" />}
              {problems ? `${problems} ${problems === 1 ? 'problem' : 'problems'} for an agent` : 'Every control named'}
            </span>
          </figcaption>
          <div className="overflow-x-auto px-5 py-4" tabIndex={0}>
            {lines.map((l, i) => (
              <div key={i} className={`tree-line ${l.problem ? 'text-danger' : l.role === 'text' ? 'text-muted' : 'text-ink'}`}>
                {'  '.repeat(l.depth)}
                <span className={l.problem ? '' : 'text-agent-ink'}>{l.role}</span>
                {l.name ? ` "${l.name}"` : ' ""'}
                {l.extra ? <span className="text-muted"> {l.extra}</span> : null}
                {l.problem ? <span className="font-medium">  {'<-'} {l.role === 'generic' ? 'no role, keyboard cannot reach it' : 'no name'}</span> : null}
              </div>
            ))}
          </div>
          <p className="mt-auto border-t border-line px-5 py-3 text-sm text-muted">
            Click Acknowledge or change the responder. The tree is read from the card on the left as it changes.
          </p>
        </figure>
      </div>
    </div>
  )
}
