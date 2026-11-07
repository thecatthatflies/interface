import { BrandMade, Film, Footer, Hero, Install, Myths, Nav, Principles, Results, Skills, Thesis } from './components/Sections'

// The launch film ships in public/launch once rendered; the section stays out of the page until then.
const FILM_READY = false

export function App() {
  return (
    <div className="grain min-h-[100dvh] bg-bg text-ink">
      <a href="#main" className="skip-link rounded-[var(--radius-control)] bg-surface px-4 py-3 font-medium text-ink shadow">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Film available={FILM_READY} />
        <Results />
        <Thesis />
        <Skills />
        <Principles />
        <Myths />
        <BrandMade />
        <Install />
      </main>
      <Footer />
    </div>
  )
}
