# Super Intelligence (SI) / AI Usage Declaration

- **Project:** GRAVIFIRE
- **Team:** NeuraVesta
- **Date:** November 14, 2026

## Purpose

This document discloses AI assistance in GRAVIFIRE's development and explains how that assistance differs from the project's scientific evidence and runtime behavior. It describes the documented development workflow, rather than claiming a complete inventory of every tool used by every contributor.

Here, **Super Intelligence (SI)** uses the NASA Space Apps Challenge terminology supplied for the submission, including chatbots, large language models, foundation models and image-generation tools. The documented SI tools used in this project are OpenAI ChatGPT and Codex.

## Code and data: descriptive acknowledgment and metadata

**SI-generated and SI-assisted code:** ChatGPT and Codex helped generate and revise application code in `src/`, data-ingestion and validation tooling in `scripts/psi/` and `Scripts/`, and testing and browser-automation code in `tests/`. This is a project-level acknowledgment; individual lines and files have not been exhaustively classified by authorship.

**SI-assisted data processing:** SI helped write the code that ingests, normalizes, validates and presents NASA source records. The derived records under `data/nasa/` are produced by deterministic processing of attributed sources. NASA measurements and original source media are not claimed as SI-generated. SI-written research summaries and interpretations must remain distinguishable from source observations; unavailable measurements remain unknown.

The accompanying machine-readable [SI usage metadata](SI_USAGE.json) records the tools, affected paths, generation and assistance roles, and data-provenance boundaries. It supplements existing source manifests and provenance records without changing their source identifiers or hashes. This declaration and the metadata were themselves generated with Codex assistance.

## NASA branding and design restriction

The supplied challenge rule prohibits SI-generated content from using, containing or modifying NASA branding or design elements, including NASA logos, flags and mission identifiers. This disclosure does not establish that every existing asset complies with that rule. Team review of submission assets remains necessary, including browser captures containing NASA-related identifiers. Scientific attribution and original-source provenance should remain accurate; they do not establish permission to incorporate protected design elements into generated content.

## AI tools and development assistance

OpenAI ChatGPT and Codex were used as development assistants. Documented uses include:

- **Research organization:** helping locate and organize source material, summarize repository research, compare requirements with implementation, and explain evidence limitations. AI-written summaries are interpretations, not primary scientific sources.
- **Software development:** assisting with application code, typed evidence contracts, ingestion and validation utilities, scientific interfaces, deterministic ranking, accessibility improvements, game HUD styling, debugging, and code review.
- **Testing and verification:** helping write and run unit tests, browser automation, accessibility scans, route checks, build checks, and performance investigations. A test is treated as executed only when actual execution evidence is available.
- **Documentation:** drafting and revising technical reports, methodology explanations, README content, demonstration plans, footage indexes, and this declaration.
- **Media-production tooling:** writing browser-capture automation and FFmpeg commands for actual application footage and user-specified edits. This assistance does not make the recorded gameplay or NASA source media AI-generated footage.
- **Release tooling:** assisting with Git operations, deployment preparation, Vercel deployment, and live-site verification under the user's instructions.

No percentage of AI-authored code or contributor effort is claimed: that has not been measured. No unverified model versions or additional AI tools are attributed here.

## AI assistance is not NASA evidence

GRAVIFIRE's scientific records are attributed to NASA investigations, experimental tables, reports, and available source media. AI output is not accepted as a replacement for an experimental measurement, source identifier, citation, or provenance record.

The project's evidence contracts require that:

- Available source identifiers, units, source fields, and provenance remain attached to the evidence.
- Unknown measurements and unavailable outcomes remain explicitly unknown or unavailable.
- Experimental-table entries, measured results, configuration envelopes, interpretations, and hypothetical mission settings remain distinguishable.
- Research references alone do not establish that experimental records have been ingested.
- Microgravity evidence is not presented as direct validation of lunar or Martian partial-gravity behavior.

AI assistance does not establish scientific correctness by itself. Source discrepancies and coverage limitations remain documented in the [dataset coverage](docs/gravifire-2026/03-dataset-coverage.md), [expanded coverage](docs/gravifire-2026/08-expanded-coverage.md), and [scientific acceptance](docs/gravifire-2026/16-scientific-acceptance.md) reports.

## What EMBER actually does

The current EMBER / Ask GRAVIFIRE implementation uses deterministic retrieval and structured answer composition over the available local evidence. It does **not** call an external generative language model to produce its scientific answers.

The investigation-ranking engine also uses explicit, reproducible scoring rules, rather than LLM-generated scores. Its scores represent research relevance, not material safety, fire probability, or certification. See the [grounded answer architecture](docs/GROUNDED_ANSWER_ENGINE.md) and [ranking methodology](docs/gravifire-2026/05-ranking-methodology.md).

These statements describe the current implementation, not a restriction on future versions. A future external model integration would require an updated declaration and evidence-validation rules.

## Fictional content, assets, and recordings

ISV Vesta and its 2038 mission campaign are fictional learning scenarios. Their narrative events, operational choices, and visual fire effects are not NASA experiments, measured outcomes, or validated fire predictions.

Third-party visual assets retain their original authorship and license requirements; AI-assisted coding or styling does not replace those credits. See [asset credits](docs/ASSET_CREDITS.md).

The documented raw master and local Short Showcase use recorded browser interactions and actual application rendering. Capture automation and editing commands were AI-assisted; no synthetic NASA experiment footage, artificial narration, or background music was added to those recordings. The [footage handover](docs/gravifire-2026/18-raw-footage-handover.md) records capture limitations, including incomplete progression and unusable error-screen intervals.

## Human responsibility and limits

Team NeuraVesta retains responsibility for reviewing the implementation, checking scientific statements against their sources, respecting licenses, deciding what to publish, and making any formal submission declarations.

Automated tests and accessibility scans do not substitute for human scientific review or manual screen-reader testing. Human-reported observations are distinguished from independently recorded evidence; unperformed checks must not be described as passed.

Neither the use of AI nor the use of NASA source material implies NASA endorsement, material-safety certification, or operational approval. GRAVIFIRE is a research and learning platform, not a validated spacecraft fire-safety prediction or certification system.

This declaration was itself drafted with AI assistance. It should be updated if the project's AI tools, runtime providers, or media-generation practices change.
