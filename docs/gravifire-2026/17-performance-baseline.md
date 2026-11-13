# Browser performance baseline

## Measured environment and method

Measured on the existing Next.js development service at localhost:3000 without restarting it or building production output. Windows, Intel i5-11600K (12 logical CPUs), approximately 23.7 GiB RAM, Intel Arc A380 through ANGLE/D3D11, headless installed Chrome, 1920x1080 viewport. This is one machine and one short representative sample per mission, not a production performance certification.

Reproduce from repository root: `node tests/browser-harness/profile-phase5.cjs <new-output-folder>`. Existing destinations are refused. The authoritative sample is `tests/browser-harness/artifacts/ui-phase5/performance-dedicated/results.json`. The earlier `performance/` run is exploratory: a TypeScript check overlapped part of it, so it is not used as the readiness baseline. The dedicated repeat ran without concurrent test, lint or build commands.

Each mission opens in a fresh browser context in development review mode, waits for network idle and objective/canvas presence, then settles for two seconds. An eight-second requestAnimationFrame sample includes W for 1.5 seconds, A for one second and mouse movement after clicking the canvas. This exercises a short movement sequence, not an entire mission. Navigation timing, buffered browser long tasks and Chrome DevTools Performance metrics are also saved.

## Dedicated sample results

| Mission | Scene-ready proxy ms | rAF cadence / second | p50 / p95 / max interval ms | JS heap used MiB | Main-thread task time during sample s |
|---|---:|---:|---|---:|---:|
| M0 | 2898 | 96.2 | 10.0 / 10.3 / 30.0 | 51.3 | 6.067 |
| M1 | 1542 | 95.7 | 10.0 / 10.3 / 30.1 | 96.1 | 6.048 |
| M4 | 1563 | 88.5 | 10.0 / 20.0 / 20.2 | 121.5 | 6.722 |
| M6 | 1729 | 92.2 | 10.0 / 20.0 / 20.3 | 119.7 | 6.414 |

The rAF rate is a browser scheduling proxy. It is not an instrumented count of PlayCanvas-rendered frames or proof of display FPS. Headless scheduling differs from a physical display. No sample had an interval over 33.34 ms in the dedicated run; that does not establish a long-session frame budget. Scene-ready proxy includes navigation/network-idle waiting and element availability; it does not certify every asset has finished visually settling.

| Mission | DOMContentLoaded / load event ms | Long tasks from navigation through sample | Longest task ms | Sum of long tasks ms |
|---|---|---:|---:|---:|
| M0 | 138.3 / 339.5 | 6 | 1267 | 2185 |
| M1 | 264.2 / 451.8 | 5 | 131 | 393 |
| M4 | 178.6 / 435.2 | 4 | 117 | 294 |
| M6 | 196.1 / 455.5 | 6 | 129 | 443 |

Load events precede scene readiness. Long-task totals include startup and are not sample-only totals. The roughly 1.27-second M0 startup task warrants further profiling. Main-thread task time occupies approximately 76–84% of the eight-second samples, leaving limited headroom on this machine. This is measured browser task occupancy, not OS CPU utilization. JavaScript heap excludes GPU textures, video memory, other processes and much native memory; no memory-leak conclusion follows from these single snapshots.

## Rendering and warnings

M0 produced ten missing-uTime shader warnings and one deprecated Entity#getGuid warning; M1/M4/M6 each produced the deprecation once. Source inspection and prior diagnostics locate uTime initialization timing in the project M0 incident materials, and getGuid calls in the installed PlayCanvas React adapter. Logs and movement screenshots are preserved alongside results. No uncaught error or blank scene was observed in the samples. Visual diagonal surface/shadow artifacts remain, but their causal relationship to these warnings has not been demonstrated.

No dependencies or shader code were changed. No FPS or memory improvement is claimed. React commit counts were not measured: Chrome task/script metrics do not identify React rerender frequency. Production builds, repeated cold-cache runs, longer sessions, physical-display FPS, lower-end hardware, mobile GPUs, GPU-memory measurements and React profiling remain outstanding.

**Performance readiness: PARTIAL.** Short local samples are responsive, but startup blocking and task occupancy require investigation before broader performance claims. Suggested next profiling work: capture a controlled M0 startup trace, separate model decode/material compilation from React work, establish a physical-display frame budget, and repeat on representative target hardware before optimizing.
