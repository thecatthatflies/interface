import { useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  GithubLogo,
  Palette,
  Compass,
  ChartLine,
  Megaphone,
  AppWindow,
  DeviceMobile,
  Textbox,
  ChatsCircle,
  Plugs,
  ShoppingBag,
  BookOpenText,
  Desktop,
  EnvelopeSimple,
} from '@phosphor-icons/react'
import { INSTALL, MYTHS, PRINCIPLES, REPO, RESULTS, SKILLS } from '../content'
import { TwoReaders } from './TwoReaders'

const base = import.meta.env.BASE_URL

/* Entry motion for sections. Content starts visible (no opacity fade), so agents, screenshots and
   no-JS readers always get it; the motion is a short rise only. */
function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { y: 22 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function Lockup({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden="true">
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M20 4H44A16 16 0 0 1 60 20V44A16 16 0 0 1 44 60H20A16 16 0 0 1 4 44V20A16 16 0 0 1 20 4ZM21 12H43A9 9 0 0 1 52 21V43A9 9 0 0 1 43 52H21A9 9 0 0 1 12 43V21A9 9 0 0 1 21 12ZM27 22H37A5 5 0 0 1 42 27V37A5 5 0 0 1 37 42H27A5 5 0 0 1 22 37V27A5 5 0 0 1 27 22Z"
        />
      </svg>
      <span className="text-xl font-extrabold tracking-[-0.03em]">interface</span>
    </span>
  )
}

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[color-mix(in_oklab,var(--color-bg)_86%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-6 px-4 md:px-8">
        <a href="#top" className="text-ink no-underline" aria-label="interface, back to top">
          <Lockup />
        </a>
        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-7 text-[0.95rem] text-muted">
            <li><a className="inline-flex min-h-11 items-center hover:text-ink" href="#results">Results</a></li>
            <li><a className="inline-flex min-h-11 items-center hover:text-ink" href="#skills">Skills</a></li>
            <li><a className="inline-flex min-h-11 items-center hover:text-ink" href="#principles">Principles</a></li>
            <li><a className="inline-flex min-h-11 items-center hover:text-ink" href="#evidence">Evidence</a></li>
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={REPO}
            className="hidden items-center gap-2 rounded-[var(--radius-control)] px-3 py-2 text-sm font-medium text-ink hover:bg-sunken sm:inline-flex"
          >
            <GithubLogo size={18} weight="bold" aria-hidden="true" />
            View source
          </a>
          <a
            href="#install"
            className="inline-flex min-h-11 items-center rounded-[var(--radius-control)] bg-primary px-4 text-sm font-semibold text-on-primary transition active:translate-y-px"
          >
            Install
          </a>
        </div>
      </div>
    </header>
  )
}

export function Hero() {
  const reduce = useReducedMotion()
  const enter = (d: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: d, ease: [0.16, 1, 0.3, 1] as const } }
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="dot-grid pointer-events-none absolute inset-y-0 right-0 hidden w-[56%] [mask-image:linear-gradient(to_left,black_40%,transparent)] lg:block" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-[1280px] gap-10 px-4 pb-20 pt-12 md:px-8 md:pt-20 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-center lg:gap-12">
        <div>
          <motion.h1
            id="hero-title"
            {...enter(0)}
            className="text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink sm:text-5xl lg:text-[3.3rem] xl:text-[3.6rem]"
          >
            Interfaces have two readers now.
          </motion.h1>
          <motion.p {...enter(0.08)} className="mt-6 max-w-[34ch] text-lg leading-relaxed text-muted md:text-xl">
            Thirteen skills that teach coding agents to build screens people understand and other agents can operate.
          </motion.p>
          <motion.div {...enter(0.16)} className="mt-8 flex flex-wrap gap-3">
            <a
              href="#install"
              className="group inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-control)] bg-primary px-6 text-base font-semibold text-on-primary transition active:translate-y-px"
            >
              Install
              <ArrowRight size={18} weight="bold" aria-hidden="true" className="transition group-hover:translate-x-0.5" />
            </a>
            <a
              href={REPO}
              className="inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-control)] border border-line-strong px-6 text-base font-semibold text-ink transition hover:bg-sunken"
            >
              <GithubLogo size={18} weight="bold" aria-hidden="true" />
              View source
            </a>
          </motion.div>
        </div>
        <motion.div {...enter(0.22)}>
          <TwoReaders />
        </motion.div>
      </div>
    </section>
  )
}

export function Film({ available }: { available: boolean }) {
  if (!available) return null
  return (
    <section aria-labelledby="film-title" className="mx-auto max-w-[1280px] px-4 pb-24 md:px-8">
      <Reveal>
        <h2 id="film-title" className="sr-only">Launch film</h2>
        <div className="overflow-hidden rounded-[var(--radius-panel)] border border-line bg-ink">
          <video
            className="block aspect-video w-full"
            controls
            preload="metadata"
            playsInline
            poster={`${base}launch/poster.jpg`}
            aria-describedby="film-desc"
          >
            <source src={`${base}launch/interface-launch.mp4`} type="video/mp4" />
          </video>
        </div>
        <p id="film-desc" className="mt-3 text-sm text-muted">
          The launch film, 40 seconds, rendered from code with raea. No narration; every line of text is on screen.
        </p>
      </Reveal>
    </section>
  )
}

export function Results() {
  return (
    <section id="results" aria-labelledby="results-title" className="border-y border-line bg-sunken">
      <div className="mx-auto max-w-[1280px] px-4 py-24 md:px-8">
        <Reveal>
          <p className="font-mono text-sm font-medium uppercase tracking-[0.14em] text-agent-ink">The benchmark</p>
          <h2 id="results-title" className="mt-3 max-w-[22ch] text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-ink md:text-5xl">
            One prompt. Same model. Three builds.
          </h2>
          <p className="mt-5 max-w-[62ch] text-lg text-muted">
            An on-call console for an engineer paged at 3 a.m., built with no skill, with interface-guidelines, and with taste-skill. Each build was rendered at three widths in light and dark and checked by the same audit.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {RESULTS.map((r, i) => (
            <Reveal key={r.arm} delay={i * 0.08}>
              <figure className={`m-0 h-full overflow-hidden rounded-[var(--radius-panel)] border bg-surface ${r.checks === 26 ? 'border-primary' : 'border-line'}`}>
                <img
                  src={`${base}benchmarks/${r.shot}-desktop-dark.jpg`}
                  alt={`Desktop screenshot of the on-call console built ${r.arm === 'No skill' ? 'with no skill' : `with ${r.arm}`}`}
                  width={1440}
                  height={900}
                  loading="lazy"
                  className="block aspect-[16/10] w-full object-cover object-top"
                />
                <figcaption className="p-5">
                  <p className="text-sm font-medium text-muted">{r.arm}</p>
                  <p className="mt-1 text-4xl font-extrabold tracking-[-0.03em] text-ink">
                    {r.checks}
                    <span className="text-xl font-bold text-muted"> / 26 checks</span>
                  </p>
                  <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                    <dt className="text-muted">Serious a11y issues</dt>
                    <dd className={r.axe === 'None' ? 'text-ok' : 'text-danger'}>{r.axe}</dd>
                    <dt className="text-muted">Cost</dt>
                    <dd className="font-mono text-ink">{r.tokens} tokens, {r.minutes} min</dd>
                  </dl>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <div className="grid gap-6 rounded-[var(--radius-panel)] border border-line bg-surface p-6 md:grid-cols-[auto_1fr] md:items-start md:p-8">
            <p className="text-2xl font-bold tracking-[-0.02em] text-ink md:max-w-[16ch]">The no-skill build looked more finished.</p>
            <p className="max-w-[62ch] text-muted">
              The skill's console was the most correct, but it read like a well-structured document. So the skill changed: visual design is now a full build step, not the last priority. The audit is also partly ours, which favors the skill; the independent axe-core results point the same way. Sample size is one build per arm.{' '}
              <a className="font-medium text-primary-ink underline underline-offset-4" href={`${REPO}/tree/main/benchmarks`}>
                Full results and limits
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Thesis() {
  return (
    <section aria-labelledby="thesis-title" className="mx-auto max-w-[1280px] px-4 py-28 md:px-8">
      <Reveal>
        <h2 id="thesis-title" className="max-w-[18ch] text-[2.4rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-ink md:text-6xl">
          Polish and legibility to machines are <em className="not-italic text-agent-ink">independent</em>.
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <p className="max-w-[52ch] text-lg text-muted">
            One beautifully designed portfolio we studied had three level-one headings, all of them button labels, and its work tiles were unnamed click targets. A person sees a great page. An agent sees a page it cannot use.
          </p>
          <p className="max-w-[52ch] text-lg text-muted">
            So these skills keep two lists. What serves both readers: what exists, what is possible, what state it is in, what just happened, and how to undo it. What serves only people: pointing, motion, beauty. Both get built. Each gets checked on its own.
          </p>
        </div>
      </Reveal>
    </section>
  )
}

const ICONS: Record<string, ReactNode> = {
  'interface-guidelines': <Compass size={28} weight="duotone" aria-hidden="true" />,
  'brand-identity': <Palette size={28} weight="duotone" aria-hidden="true" />,
  'dashboard-design': <ChartLine size={22} weight="bold" aria-hidden="true" />,
  'landing-page-design': <Megaphone size={22} weight="bold" aria-hidden="true" />,
  'web-app-design': <AppWindow size={22} weight="bold" aria-hidden="true" />,
  'mobile-app-design': <DeviceMobile size={22} weight="bold" aria-hidden="true" />,
  'form-design': <Textbox size={22} weight="bold" aria-hidden="true" />,
  'ai-chat-design': <ChatsCircle size={22} weight="bold" aria-hidden="true" />,
  'agent-tool-design': <Plugs size={22} weight="bold" aria-hidden="true" />,
  'ecommerce-design': <ShoppingBag size={22} weight="bold" aria-hidden="true" />,
  'content-site-design': <BookOpenText size={22} weight="bold" aria-hidden="true" />,
  'desktop-app-design': <Desktop size={22} weight="bold" aria-hidden="true" />,
  'email-design': <EnvelopeSimple size={22} weight="bold" aria-hidden="true" />,
}

const RANKED = ['Everyone can use it', 'It tells the truth', 'It says what it means', 'The answer comes first', 'Mistakes are survivable', 'It stays put', 'The possible is visible', 'Convention', 'Polish']

export function Skills() {
  const [foundation, brand, ...types] = SKILLS
  return (
    <section id="skills" aria-labelledby="skills-title" className="mx-auto max-w-[1280px] px-4 pb-28 md:px-8">
      <Reveal>
        <h2 id="skills-title" className="max-w-[20ch] text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-ink md:text-5xl">
          One foundation, one brand kit, eleven kinds of interface.
        </h2>
        <p className="mt-5 max-w-[60ch] text-lg text-muted">
          Each skill triggers on its own when a request fits, including casual ones like "a simple page for my bakery orders".
        </p>
      </Reveal>

      <div className="mt-12 grid gap-4 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <a
            href={`${REPO}/tree/main/skills/${foundation.name}`}
            className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[var(--radius-panel)] bg-primary p-7 text-on-primary md:p-9"
          >
            <div className="dot-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
            <div className="relative">
              {ICONS[foundation.name]}
              <h3 className="mt-6 font-mono text-lg font-medium">{foundation.name}</h3>
              <p className="mt-2 max-w-[24ch] text-3xl font-bold leading-tight tracking-[-0.02em]">{foundation.what}</p>
            </div>
            <ol className="relative mt-8 flex flex-wrap gap-x-2 gap-y-2 text-sm font-medium" aria-label="The nine principles, highest rank first">
              {RANKED.map((r, i) => (
                <li key={r} className="flex items-center gap-2">
                  <span className="rounded-full bg-[color-mix(in_oklab,var(--color-on-primary)_14%,transparent)] px-3 py-1">{r}</span>
                  {i < RANKED.length - 1 && <span aria-hidden="true">&gt;</span>}
                </li>
              ))}
            </ol>
            <p className="relative mt-6 max-w-[56ch] opacity-90">{foundation.detail}</p>
            <ArrowUpRight size={22} weight="bold" aria-hidden="true" className="absolute right-6 top-6 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </Reveal>
        <Reveal className="lg:col-span-5" delay={0.06}>
          <a
            href={`${REPO}/tree/main/skills/${brand.name}`}
            className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface p-7 text-ink md:p-9"
          >
            <span className="text-agent-ink">{ICONS[brand.name]}</span>
            <h3 className="mt-6 font-mono text-lg font-medium">{brand.name}</h3>
            <p className="mt-2 text-2xl font-bold leading-tight tracking-[-0.02em]">{brand.what}</p>
            <p className="mt-3 text-muted">{brand.detail}</p>
            <img
              src={`${base}brand/assets/og-image.png`}
              alt="The social card for interface, generated by the brand-identity asset script"
              width={1200}
              height={630}
              className="mt-6 block w-full rounded-[var(--radius-control)] border border-line"
            />
            <ArrowUpRight size={22} weight="bold" aria-hidden="true" className="absolute right-6 top-6 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </Reveal>
        <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-12 lg:grid-cols-4">
          {types.map((s, i) => (
            <li key={s.name} className={i === types.length - 1 ? 'sm:col-span-2 lg:col-span-1' : undefined}>
              <Reveal delay={(i % 4) * 0.05} className="h-full">
                <a
                  href={`${REPO}/tree/main/skills/${s.name}`}
                  className="group flex h-full flex-col gap-3 rounded-[var(--radius-panel)] border border-line bg-surface p-5 transition hover:border-line-strong hover:bg-sunken"
                >
                  <span className="text-primary-ink">{ICONS[s.name]}</span>
                  <span className="font-mono text-[0.95rem] font-medium text-ink">{s.name}</span>
                  <span className="text-[0.95rem] leading-snug text-muted">{s.what}</span>
                </a>
              </Reveal>
            </li>
          ))}
          <li className="hidden lg:block">
            <Reveal delay={0.1} className="h-full">
              <div className="flex h-full items-center rounded-[var(--radius-panel)] bg-[var(--agent-tint)] p-5 text-[var(--agent-on-tint)]">
                <p className="max-w-[48ch] font-medium">
                  Every skill names its sibling for adjacent work, so two skills do not fire on the same request.
                </p>
              </div>
            </Reveal>
          </li>
        </ul>
      </div>
    </section>
  )
}

export function Principles() {
  const [active, setActive] = useState(0)
  const p = PRINCIPLES[active]
  return (
    <section id="principles" aria-labelledby="principles-title" className="border-y border-line bg-sunken">
      <div className="mx-auto max-w-[1280px] px-4 py-24 md:px-8">
        <Reveal>
          <h2 id="principles-title" className="max-w-[22ch] text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-ink md:text-5xl">
            The 1992 Macintosh guidelines, re-read for agents.
          </h2>
          <p className="mt-5 max-w-[62ch] text-lg text-muted">
            The principles that made the Mac legible to people mostly transfer to software that reads the screen. Some need amending. One does not transfer at all.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div role="tablist" aria-label="Principles" aria-orientation="vertical" className="flex flex-col gap-2">
            {PRINCIPLES.map((x, i) => (
              <button
                key={x.name}
                role="tab"
                id={`tab-${i}`}
                aria-selected={i === active}
                aria-controls="principle-panel"
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault()
                    const next = (i + (e.key === 'ArrowDown' ? 1 : -1) + PRINCIPLES.length) % PRINCIPLES.length
                    setActive(next)
                    document.getElementById(`tab-${next}`)?.focus()
                  }
                }}
                className={`flex items-center justify-between gap-4 rounded-[var(--radius-control)] border px-5 py-4 text-left transition ${
                  i === active ? 'border-primary bg-surface text-ink' : 'border-transparent text-muted hover:bg-surface hover:text-ink'
                }`}
              >
                <span className="text-lg font-bold tracking-[-0.01em]">{x.name}</span>
                <span className={`shrink-0 text-sm ${i === active ? 'text-agent-ink' : ''}`}>{x.verdict}</span>
              </button>
            ))}
          </div>
          <div id="principle-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="rounded-[var(--radius-panel)] border border-line bg-surface p-7 md:p-10">
            <p className="text-sm text-muted">Macintosh Human Interface Guidelines, {p.page}</p>
            <h3 className="mt-2 text-3xl font-extrabold tracking-[-0.025em] text-ink">{p.name}</h3>
            <dl className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <dt className="flex items-center gap-2 font-medium text-primary-ink">For people, 1992</dt>
                <dd className="mt-2 text-ink">{p.then}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 font-medium text-agent-ink">For agents, now</dt>
                <dd className="mt-2 text-ink">{p.now}</dd>
              </div>
            </dl>
            <p className="mt-8 inline-flex rounded-full bg-[var(--agent-tint)] px-3 py-1 text-sm font-medium text-[var(--agent-on-tint)]">Verdict: {p.verdict}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Myths() {
  return (
    <section id="evidence" aria-labelledby="evidence-title" className="mx-auto max-w-[1280px] px-4 py-28 md:px-8">
      <Reveal>
        <h2 id="evidence-title" className="max-w-[20ch] text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-ink md:text-5xl">
          Rules carry their evidence. Folklore gets replaced.
        </h2>
        <p className="mt-5 max-w-[64ch] text-lg text-muted">
          Every rule is tagged empirical, standard, practitioner, or judgment. These popular claims did not survive the check, so the skills say something truer instead.
        </p>
      </Reveal>
      <div className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-2">
        {MYTHS.map((m, i) => (
          <Reveal key={m.claim} delay={(i % 2) * 0.06}>
            <div className="border-t border-line pt-5">
              <p className="text-xl font-bold text-muted line-through decoration-danger decoration-2">{m.claim}</p>
              <p className="mt-2 max-w-[52ch] text-ink">{m.instead}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function BrandMade() {
  return (
    <section aria-labelledby="brand-title" className="mx-auto max-w-[1280px] px-4 pb-28 md:px-8">
      <Reveal>
        <div className="grid overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface lg:grid-cols-2">
          <div className="p-7 md:p-12">
            <h2 id="brand-title" className="max-w-[18ch] text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] text-ink md:text-4xl">
              This site's brand came out of brand-identity.
            </h2>
            <p className="mt-5 max-w-[50ch] text-muted">
              The idea, a focus ring, is the one piece of an interface drawn for readers who do not point. The palette, the outlined wordmark, the favicons and the social card were generated and checked by the skill's scripts. Indigo is for people. Amber is for agents.
            </p>
            <a
              href={`${base}brand/brand-book/index.html`}
              className="mt-8 inline-flex min-h-11 items-center gap-2 font-semibold text-primary-ink underline underline-offset-4"
            >
              Read the brand guidelines
              <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-px bg-line">
            <div className="flex aspect-square items-center justify-center bg-primary text-on-primary">
              <img src={`${base}brand/assets/icon-512.png`} alt="The interface app icon: a white focus ring on indigo" width={512} height={512} className="w-1/2" />
            </div>
            <div className="flex aspect-square flex-col justify-end bg-[var(--color-agent)] p-5 text-[var(--neutral-1000)]">
              <span className="font-mono text-sm">agent</span>
              <span className="font-mono text-lg font-medium">#e8a33d</span>
            </div>
            <div className="flex aspect-square flex-col justify-end bg-[var(--primary-700)] p-5 text-white">
              <span className="font-mono text-sm">primary</span>
              <span className="font-mono text-lg font-medium">#3442d9</span>
            </div>
            <div className="flex aspect-square items-center justify-center bg-sunken p-6 text-ink">
              <span className="text-center">
                <span className="block text-6xl font-extrabold tracking-[-0.04em]">Aa</span>
                <span className="mt-2 block text-sm text-muted">Schibsted Grotesk, IBM Plex Mono</span>
              </span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function CopyLine({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[color-mix(in_oklab,white_10%,transparent)] py-3 last:border-0">
      <code className="min-w-0 break-all font-mono text-[0.95rem] text-[var(--neutral-50)] sm:break-normal">{text}</code>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
          } catch {
            setCopied(false)
          }
        }}
        className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-[var(--radius-control)] px-3 text-sm text-[var(--neutral-300)] hover:bg-[color-mix(in_oklab,white_8%,transparent)] hover:text-white"
      >
        {copied ? <Check size={18} weight="bold" aria-hidden="true" /> : <Copy size={18} weight="bold" aria-hidden="true" />}
        <span>{copied ? 'Copied' : 'Copy'}</span>
        <span className="sr-only"> command: {text}</span>
      </button>
    </div>
  )
}

export function Install() {
  const [tab, setTab] = useState<'claude' | 'any'>('claude')
  return (
    <section id="install" aria-labelledby="install-title" className="border-t border-line bg-sunken">
      <div className="mx-auto grid max-w-[1280px] grid-cols-[minmax(0,1fr)] gap-10 px-4 py-24 md:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
        <Reveal>
          <p className="font-mono text-sm font-medium uppercase tracking-[0.14em] text-agent-ink">Install</p>
          <h2 id="install-title" className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-ink md:text-5xl">
            Free, open source, two commands.
          </h2>
          <p className="mt-5 max-w-[46ch] text-lg text-muted">
            Apache 2.0. Works in Claude Code, Codex, and any agent that reads a skills folder. The scripts need Node 18 or later.
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="overflow-hidden rounded-[var(--radius-panel)] bg-[var(--neutral-1000)] ring-1 ring-line">
            <div role="tablist" aria-label="Where to install" className="flex gap-1 border-b border-[color-mix(in_oklab,white_10%,transparent)] p-2">
              {(
                [
                  ['claude', 'Claude Code'],
                  ['any', 'Any agent'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  role="tab"
                  aria-selected={tab === value}
                  aria-controls="install-panel"
                  onClick={() => setTab(value)}
                  className={`min-h-11 rounded-[var(--radius-control)] px-4 text-sm font-medium ${
                    tab === value ? 'bg-[color-mix(in_oklab,white_12%,transparent)] text-white' : 'text-[var(--neutral-400)] hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div id="install-panel" role="tabpanel" className="px-5 py-2">
              {INSTALL[tab].map((line) => (
                <CopyLine key={line} text={line} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between md:px-8">
        <Lockup className="text-ink" />
        <p>Apache 2.0. Built with its own skills and checked with its own audit.</p>
        <a href={REPO} className="inline-flex min-h-11 items-center gap-2 font-medium text-ink hover:underline">
          <GithubLogo size={18} weight="bold" aria-hidden="true" />
          thecatthatflies/interface
        </a>
      </div>
    </footer>
  )
}
