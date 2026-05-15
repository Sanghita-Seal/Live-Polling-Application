import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";
import GradientButton from "../components/ui/GradientButton.jsx";
import "./Home.css";

const stats = [
  { value: "50K+", label: "Polls Created" },
  { value: "1M+", label: "Votes Submitted" },
  { value: "Live", label: "Realtime Analytics" },
  { value: "Teams", label: "Trusted by Students & Teams" },
];

const problems = [
  {
    title: "Manual counting wastes time",
    copy: "Skip spreadsheets, paper slips, and delayed summaries with instant vote capture.",
  },
  {
    title: "Silent audiences never participate",
    copy: "Give everyone a low-friction way to answer, whether they sign in or vote anonymously.",
  },
  {
    title: "Static surveys reduce engagement",
    copy: "Keep sessions active with live charts, changing totals, and shareable outcomes.",
  },
];

const features = [
  "Realtime Voting",
  "Live Analytics",
  "Anonymous or Login Voting",
  "Publish Results Anytime",
  "Public Share Links",
  "Socket.io Live Updates",
  "Poll Expiry Control",
  "Participant Summaries",
  "Dashboard Analytics",
  "Mobile Friendly Experience",
];

const steps = [
  ["01", "Create a Poll", "Add questions, options, timing, and voting preferences in minutes."],
  ["02", "Share the Link", "Send one clean public link to classrooms, events, teams, or judges."],
  ["03", "Collect Live Votes", "Watch totals, participants, and chart data refresh as answers arrive."],
  ["04", "Reveal Results", "Publish final outcomes when the moment is right."],
];

const audiences = [
  "Colleges & Classrooms",
  "Workshops",
  "Team Meetings",
  "Hackathons",
  "Conferences",
  "Community Feedback",
];

const testimonials = [
  {
    quote: "PollSync made our workshop feedback feel immediate instead of like homework after the event.",
    name: "Aarav Mehta",
    role: "Student Organizer",
  },
  {
    quote: "The live analytics page gives presenters exactly what they need while the room is still engaged.",
    name: "Priya Nair",
    role: "Hackathon Mentor",
  },
  {
    quote: "Simple enough for quick classes, polished enough to show stakeholders after the session.",
    name: "Rohan Sen",
    role: "Team Lead",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    copy: "For students and creators testing quick audience polls.",
    perks: ["Unlimited draft polls", "Public vote links", "Basic result sharing"],
  },
  {
    name: "Pro",
    price: "$12",
    copy: "For classrooms, workshops, and active team sessions.",
    perks: ["Realtime analytics", "Participant summaries", "Published final results"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    copy: "For organizations running high-volume events and programs.",
    perks: ["Team workspaces", "Priority support", "Custom reporting"],
  },
];

function SectionHeader({ eyebrow, title, copy }) {
  return (
    <div className="landing-section-header reveal-on-load">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {copy ? <p>{copy}</p> : null}
    </div>
  );
}

function MiniBarChart() {
  return (
    <div className="mini-chart" aria-label="Live bar chart preview">
      <span className="bar bar-one" />
      <span className="bar bar-two" />
      <span className="bar bar-three" />
      <span className="bar bar-four" />
    </div>
  );
}

function DonutChart() {
  return (
    <div className="donut-chart" aria-label="Pie chart preview">
      <span>72%</span>
    </div>
  );
}

function DashboardPreview({ large = false }) {
  return (
    <section className={`landing-dashboard ${large ? "landing-dashboard-large" : ""}`} aria-label="PollSync dashboard preview">
      <div className="dashboard-window-bar">
        <span />
        <span />
        <span />
      </div>
      <div className="dashboard-preview-header">
        <div>
          <p className="eyebrow">Live analytics</p>
          <h3>Product Demo Poll</h3>
        </div>
        <span className="live-pill">Live now</span>
      </div>
      <div className="dashboard-metric-grid">
        <div>
          <p>Votes</p>
          <strong>1,284</strong>
        </div>
        <div>
          <p>Participants</p>
          <strong>742</strong>
        </div>
        <div>
          <p>Active polls</p>
          <strong>18</strong>
        </div>
      </div>
      <div className="dashboard-preview-body">
        <div className="chart-panel landing-chart-panel">
          <div className="chart-title-row">
            <span>Engagement by option</span>
            <strong>+24%</strong>
          </div>
          <MiniBarChart />
        </div>
        <div className="chart-panel landing-chart-panel">
          <div className="chart-title-row">
            <span>Participation</span>
            <strong>Realtime</strong>
          </div>
          <DonutChart />
        </div>
      </div>
      <div className="activity-feed">
        <div>
          <span className="status-dot" />
          <p>Socket update received</p>
          <strong>2s ago</strong>
        </div>
        <div>
          <span className="status-dot status-dot-blue" />
          <p>28 new votes submitted</p>
          <strong>Live</strong>
        </div>
        <div>
          <span className="status-dot status-dot-yellow" />
          <p>Results ready to publish</p>
          <strong>Ready</strong>
        </div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <div className="page-shell landing-page-shell">
      <Navbar variant="landing" />

      <main>
        <section className="landing-hero">
          <div className="landing-hero-copy reveal-on-load">
            <p className="eyebrow">Realtime audience engagement</p>
            <h1>PollSync Keeps Every Audience Engaged.</h1>
            <p>
              Create interactive polls, collect votes in real time, track live analytics, and reveal results when you
              are ready. Built for classrooms, events, workshops, hackathons, and teams.
            </p>
            <div className="hero-actions">
              <GradientButton as={Link} to="/polls/create">
                Create Poll
              </GradientButton>
              <a className="ghost-button" href="#analytics">
                Watch Demo
              </a>
            </div>
          </div>

          <div className="hero-visual-wrap reveal-on-load">
            <div className="floating-chip chip-top">+148 votes</div>
            <DashboardPreview />
            <div className="floating-chip chip-bottom">91% participation</div>
          </div>
        </section>

        <section className="landing-section landing-stats" aria-label="PollSync statistics">
          {stats.map((stat) => (
            <div className="glass-card stat-card reveal-on-load" key={stat.label}>
              <strong>{stat.value}</strong>
              <p>{stat.label}</p>
            </div>
          ))}
        </section>

        <section className="landing-section" id="problem">
          <SectionHeader eyebrow="The problem" title="Traditional feedback methods are slow and disconnected." />
          <div className="landing-card-grid three-column">
            {problems.map((problem) => (
              <article className="glass-card landing-info-card reveal-on-load" key={problem.title}>
                <span className="card-icon" />
                <h3>{problem.title}</h3>
                <p>{problem.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section" id="features">
          <SectionHeader
            eyebrow="Features"
            title="Everything a live polling workflow needs."
            copy="Launch, share, monitor, and publish from one focused product experience."
          />
          <div className="feature-grid">
            {features.map((feature, index) => (
              <article className="glass-card feature-card reveal-on-load" key={feature}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{feature}</h3>
                <p>Built into the PollSync workflow with clean controls and audience-ready sharing.</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section dashboard-showcase" id="analytics">
          <SectionHeader
            eyebrow="Dashboard preview"
            title="Realtime analytics that feel alive."
            copy="Monitor votes, participation, chart movement, and event activity without leaving the creator view."
          />
          <DashboardPreview large />
        </section>

        <section className="landing-section">
          <SectionHeader eyebrow="How it works" title="From idea to live results in four steps." />
          <div className="steps-grid">
            {steps.map(([number, title, copy]) => (
              <article className="glass-card step-card reveal-on-load" key={title}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section">
          <SectionHeader eyebrow="Built for" title="Any room where participation matters." />
          <div className="audience-grid">
            {audiences.map((audience) => (
              <article className="glass-card audience-card reveal-on-load" key={audience}>
                <span className="card-icon card-icon-soft" />
                <h3>{audience}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section">
          <SectionHeader eyebrow="Testimonials" title="Designed for fast-moving sessions." />
          <div className="landing-card-grid three-column">
            {testimonials.map((testimonial) => (
              <article className="glass-card testimonial-card reveal-on-load" key={testimonial.name}>
                <p>&quot;{testimonial.quote}&quot;</p>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section realtime-highlight">
          <div className="realtime-copy reveal-on-load">
            <p className="eyebrow">Realtime analytics highlight</p>
            <h2>Socket.io updates, instant refreshes, and dynamic charts in one live view.</h2>
            <p>
              PollSync tracks participation as it happens, refreshes analytics immediately, and keeps the creator
              dashboard synced with every submitted vote.
            </p>
          </div>
          <div className="glass-card realtime-list reveal-on-load">
            <span>Live Socket.io updates</span>
            <span>Instant analytics refresh</span>
            <span>Dynamic charts</span>
            <span>Realtime participation tracking</span>
          </div>
        </section>

        <section className="landing-section" id="pricing">
          <SectionHeader eyebrow="Pricing" title="Start free. Grow when your audience does." />
          <div className="pricing-grid">
            {pricingPlans.map((plan) => (
              <article className={`glass-card pricing-card ${plan.featured ? "pricing-card-featured" : ""}`} key={plan.name}>
                <p className="eyebrow">{plan.name}</p>
                <h3>{plan.price}</h3>
                <p>{plan.copy}</p>
                <ul>
                  {plan.perks.map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
                </ul>
                <GradientButton as={Link} to="/register" className="small-button">
                  Get Started
                </GradientButton>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section final-cta">
          <div className="final-cta-inner reveal-on-load">
            <p className="eyebrow">Ready when your audience is</p>
            <h2>Stop Guessing What Your Audience Thinks.</h2>
            <p>Turn every classroom, event, and meeting into an interactive realtime experience.</p>
            <div className="hero-actions">
              <GradientButton as={Link} to="/register">
                Start Creating Polls
              </GradientButton>
              <Link className="ghost-button" to="/dashboard">
                Explore Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <Link to="/" className="brand">
          <img src="/pollsync-logo.svg" alt="PollSync" className="brand-logo" />
        </Link>
        <nav aria-label="Footer navigation">
          <a href="#features">Product</a>
          <a href="#features">Features</a>
          <a href="#analytics">Analytics</a>
          <a href="#problem">Documentation</a>
          <a href="mailto:hello@pollsync.com">Contact</a>
          <a href="https://github.com/" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="#pricing">Social links</a>
        </nav>
      </footer>
    </div>
  );
}

export default Home;
