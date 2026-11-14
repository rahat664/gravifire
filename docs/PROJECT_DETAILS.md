# GRAVIFIRE project details

GRAVIFIRE is an interactive research and learning platform that turns NASA combustion research into an accessible, traceable workflow for exploring fire-safety questions in space. Built by Team NeuraVesta, it helps researchers, students and educators connect mission questions with experimental evidence, understand its limitations and identify what further research is needed.

As future exploration activities involve spacecraft, lunar habitats and Mars habitats, understanding how materials burn under different conditions becomes increasingly important. GRAVIFIRE supports a practical mission-research concept: use existing experimental evidence to investigate fire prevention, detection and suppression before drawing conclusions about a proposed environment. Users select a mission context and objective, explore relevant investigations, and compare reported experimental conditions with hypothetical mission settings. The platform makes this approach technically feasible through a working browser-based application built around available NASA records.

NASA data forms the foundation of the experience. GRAVIFIRE integrates investigation families including BASS-II, SAFFIRE, SAME/SAME-R, FLEX and FLEX-2, while preserving differences in their coverage and experimental scope. Deterministic ingestion and validation tools organize source information into inspectable records. A transparent ranking system helps users discover relevant investigations, while comparison views identify matched, mismatched and unknown conditions. Source identifiers, citations and provenance allow users to trace information back to its origin.

The resulting insights include both useful connections and important gaps. A matching oxygen concentration, for example, does not establish that a microgravity experiment validates behavior in lunar gravity. Similarly, a configuration range does not establish a measured outcome. By making these distinctions visible, GRAVIFIRE helps users formulate more precise research questions and identify conditions that require additional experiments.

Mission Control adds a creative exploration layer through a fictional spacecraft campaign aboard ISV Vesta in 2038. Players encounter operational questions, inspect real evidence and build an evidence dossier as they progress. The campaign turns uncertainty and source evaluation into interactive decisions, giving learners a reason to investigate the science behind a scenario. Its fictional events remain explicitly distinguished from NASA observations. It serves as an educational prototype for evidence-informed mission reasoning, rather than an operational spacecraft system.

GRAVIFIRE's potential impact extends across research, education and scientific communication. Students can learn why experimental context matters; researchers can discover relevant records and evidence gaps; and mission-design teams can use the workflow to structure early discussions about materials, atmospheres and research needs. The same habits of traceability and careful interpretation are valuable for fire-safety learning on Earth. Our intended contribution is better-informed decisions and clearer communication, with fewer unsupported assumptions about what existing evidence proves. The platform does not certify material safety or predict spacecraft fires.

The technical implementation combines TypeScript, Next.js 16, React and Tailwind CSS with interactive experiences using React Three Fiber, Three.js, Rapier and PlayCanvas across different implementations. EMBER, the evidence assistant, uses deterministic retrieval and structured response composition to answer supported scientific questions with references and limitations. Investigation rankings are reproducible and inspectable. Supporting tools include pnpm, Git/GitHub, Vitest, Playwright and accessibility checks, with the website hosted on Vercel. The application requires no custom hardware.

OpenAI ChatGPT and Codex were used as Super Intelligence (SI) development assistants for generating and revising code, organizing research, developing ingestion and validation tooling, writing tests, drafting documentation and automating captures. These uses are acknowledged in descriptive documentation and machine-readable metadata. Original NASA measurements and source media are not represented as SI-generated, and SI output does not replace experimental evidence.

Throughout development, our team prioritized scientific accuracy, accessible presentation, source traceability, reproducibility and clear boundaries between observation, interpretation and fiction. These choices bring together a creative mission-learning concept, meaningful use of NASA data and a functional technical implementation, with a long-term aim of helping people ask better questions about fire safety during future exploration.

## Supporting documentation

- [Application overview and local setup](../README.md)
- [Product architecture](GRAVIFIRE_PRODUCT_ARCHITECTURE.md)
- [Dataset coverage](gravifire-2026/03-dataset-coverage.md) and [expanded coverage](gravifire-2026/08-expanded-coverage.md)
- [Ranking methodology](gravifire-2026/05-ranking-methodology.md) and [applicability contract](gravifire-2026/04-applicability-contract.md)
- [Scientific acceptance assessment](gravifire-2026/16-scientific-acceptance.md)
- [SI / AI Usage Declaration](../AI_declaration.md) and [SI usage metadata](../SI_USAGE.json)

This project description was drafted with OpenAI Codex assistance. Intended benefits describe project goals, not measured operational outcomes or an award assessment.
