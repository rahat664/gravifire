import Link from "next/link";
import { resolveM1Pair } from "@/lib/m1-evidence";
import { resolveM4Family } from "@/lib/m4-evidence";
import { scientificDatasets } from "@/data/scientific-datasets";

const m1 = resolveM1Pair();
const silicone = resolveM4Family()[0];
const runtimeFamilies = scientificDatasets.filter((dataset) => dataset.status === "INGESTED").length;
const coverageRecords = scientificDatasets.reduce((total, dataset) => total + (dataset.realRuns || dataset.recordCount || 0), 0);

const surfaces = [
  ["Experiment Explorer", "Trace source records, conditions, and provenance.", "/experiments", "01"],
  ["Applicability Explorer", "Compare source conditions with an explicit mission scenario.", "/applicability", "02"],
  ["Investigation Ranking", "Review deterministic research relevance and its factors.", "/recommend/investigations", "03"],
  ["Virtual Fire Lab", "Separate observed values from counterfactual questions.", "/lab", "04"],
  ["Ask GRAVIFIRE", "Ask questions against the evidence layer.", "/ask", "05"],
  ["Fire Landscape", "See evidence coverage without turning it into risk.", "/landscape", "06"],
  ["What Should We Test Next?", "Turn missing combinations into scoped experiments.", "/recommend", "07"],
  ["Mission Control", "Explore a fictional Vesta 2038 campaign with evidence boundaries.", "/mission-control", "08"],
];

export default function Home() {
  return (
    <main className="home-command">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__grid" aria-hidden="true" />
        <div className="home-hero__content">
          <div className="home-kicker"><span className="status-light" /> RESEARCH OPERATIONS <span className="home-kicker__divider">/</span> EVIDENCE SYSTEM 01</div>
          <div className="home-hero__layout">
            <div className="home-hero__copy">
              <p className="home-eyebrow">SPACECRAFT FIRE-SAFETY RESEARCH</p>
              <h1 id="home-title">GRAVI<span>FIRE</span></h1>
              <p className="home-hero__subhead">Evidence for the next frontier of fire safety.</p>
              <p className="home-hero__description">Explore NASA combustion investigations, inspect the source records behind each observation, and see where mission conditions exceed the available evidence.</p>
              <div className="home-hero__actions">
                <Link href="/dashboard" className="command-button command-button--primary">Open science dashboard <span aria-hidden="true">↗</span></Link>
                <Link href="/mission-control" className="command-button command-button--secondary">Enter Mission Control</Link>
              </div>
              <p className="home-hero__disclaimer">NASA experiment evidence is source-linked. The Vesta 2038 campaign is fictional and is not a NASA mission.</p>
            </div>
            <aside className="home-console" aria-label="Evidence system status">
              <div className="home-console__top"><span>ARCHIVE STATUS</span><span className="status-pill"><i /> LOCAL INDEX</span></div>
              <div className="home-console__main">
                <span className="home-console__label">REVIEWED RUNTIME COVERAGE</span>
                <div className="home-console__stats">
                  <div><strong>{String(runtimeFamilies).padStart(2, "0")}</strong><span>INGESTED<br />FAMILIES</span></div>
                  <div><strong>{coverageRecords.toLocaleString("en-US")}</strong><span>LOCAL<br />RECORDS*</span></div>
                </div>
                <p>*Count combines ingested runs, observation records and configuration envelopes in the local registry. It is not a run total or a measure of scientific confidence.</p>
              </div>
              <div className="home-console__footer"><span>PROVENANCE LINKED</span><span>UNKNOWN VALUES PRESERVED</span></div>
            </aside>
          </div>
          <div className="home-hero__rail" aria-label="Platform principles">
            <span>DETERMINISTIC INGESTION</span><span>SOURCE TRACEABILITY</span><span>EXPLICIT EVIDENCE LIMITS</span><span>NO SAFETY CERTIFICATION</span>
          </div>
        </div>
      </section>

      <section className="home-evidence" aria-labelledby="evidence-heading">
        <div className="section-heading">
          <div><p className="home-eyebrow">SOURCE RECORDS · SELECTED EXAMPLES</p><h2 id="evidence-heading">Evidence has a boundary.</h2></div>
          <p>These examples remain tied to their reported conditions. They are not universal material classifications or predictions for an untested habitat.</p>
        </div>
        <div className="home-evidence__grid">
          <EvidenceCard index="01" eyebrow="SIBAL / SAFFIRE-I" title={`${m1.s1.data.burnTimeS.rawValue} s`} compare={`${m1.s2.data.burnTimeS.rawValue} s`} body="Recorded burn-time comparison" note="Source comparison under specific tested conditions." />
          <EvidenceCard index="02" eyebrow="SILICONE / SAFFIRE-II" title="Complete" compare="Insignificant / ~0" body="Source-reported observations for sample 2-1" note={`Reviewed low-g runtime: ${silicone.data.burnTime.rawValue} burn time and ${silicone.data.microgravityBurnLength.rawValue} burn length. Not a universal safety classification.`} />
          <article className="home-evidence-card home-evidence-card--limit"><div className="home-evidence-card__index">03 <span>APPLICABILITY LIMIT</span></div><p className="home-evidence-card__eyebrow">MARS MISSION CONTEXT</p><h3>Evidence gap</h3><p className="home-evidence-card__body">No matching combined-condition evidence in the current GRAVIFIRE archive for this mission context.</p><p className="home-evidence-card__note">No Mars fire-behavior prediction is generated.</p></article>
        </div>
        <div className="home-section-action"><Link href="/experiments" className="text-link">Browse source-linked investigations <span aria-hidden="true">→</span></Link></div>
      </section>

      <section className="home-method" aria-labelledby="method-heading">
        <div className="home-method__copy"><p className="home-eyebrow">THE EVIDENCE CHAIN</p><h2 id="method-heading">Every conclusion starts with a source.</h2><p>NASA records pass through deterministic ingestion and provenance before becoming an evidence state. When the archive cannot support a conclusion, GRAVIFIRE identifies the gap instead.</p></div>
        <ol className="home-method__steps">{["NASA source data", "Deterministic ingestion", "Traceable evidence", "Bounded interpretation"].map((step, index) => <li key={step}><span>0{index + 1}</span><strong>{step}</strong>{index < 3 && <i aria-hidden="true">→</i>}</li>)}</ol>
      </section>

      <section className="home-capabilities" aria-labelledby="capabilities-heading">
        <div className="section-heading"><div><p className="home-eyebrow">SYSTEM DIRECTORY</p><h2 id="capabilities-heading">Research operations</h2></div><p>Choose a surface to inspect evidence, compare conditions, or explore the fictional campaign.</p></div>
        <div className="home-capabilities__grid">{surfaces.map(([title, body, href, index]) => <Link key={href} href={href} className="capability-card"><span className="capability-card__index">{index}</span><span className="capability-card__arrow" aria-hidden="true">↗</span><strong>{title}</strong><span className="capability-card__body">{body}</span></Link>)}</div>
      </section>
      <footer className="home-footer"><span>GRAVIFIRE · RESEARCH OPERATIONS</span><span>NASA EVIDENCE REFERENCES · FICTIONAL VESTA CAMPAIGN · NO NASA ENDORSEMENT IMPLIED</span></footer>
    </main>
  );
}

function EvidenceCard({ index, eyebrow, title, compare, body, note }: { index: string; eyebrow: string; title: string; compare: string; body: string; note: string }) {
  return <article className="home-evidence-card"><div className="home-evidence-card__index">{index} <span>OBSERVATION</span></div><p className="home-evidence-card__eyebrow">{eyebrow}</p><h3>{title}<span className="home-evidence-card__versus"> / </span>{compare}</h3><p className="home-evidence-card__body">{body}</p><p className="home-evidence-card__note">{note}</p></article>;
}
