# Choosing metrics

Read this before laying out a dashboard: what to show, how to define it, and what context each figure needs to be judged.

Tags: **[E]** empirical, **[S]** standard or institutional, **[P]** practitioner, **[J]** judgment.

## Contents

1. Metric inventory template
2. Service and infrastructure sets
3. Business and product metrics
4. Small-business status
5. Comparators and baselines
6. Noise: when a change is a change
7. Definitions people and agents can read
8. Sources

## 1. Metric inventory template

Fill one row per candidate metric before designing. Rows with an empty "Decision" column usually leave the first screen [J].

| Field | Example |
|---|---|
| Name (plain words) | Checkout p95 latency |
| Definition | 95th percentile server time for POST /checkout, successful and failed requests separately, 5-minute windows |
| Decision it changes | On-call investigates when above 500 ms for 10 min |
| Owner | Payments team |
| Source and cadence | Prometheus histogram, scraped every 15 s, displayed per minute |
| Normal | Under 500 ms; typical 350-450 ms on weekdays |
| Direction of good | Lower |
| Comparator | Same hour last week |
| Failure looks like | No samples since a time; partial scrape |
| Who writes it | System (trusted) |

## 2. Service and infrastructure sets

Pick one method per kind of thing and apply it everywhere, so every service dashboard reads the same way [P: Grafana best practices].

| Method | For | Signals | Source |
|---|---|---|---|
| Four golden signals | User-facing systems, if you can measure only four things | Latency, traffic, errors, saturation | Google SRE book ch. 6 [S] |
| RED | Request-driven services | Rate, errors, duration | Wilkie (Weaveworks) [P], via Grafana [P] |
| USE | Resources: CPU, memory, disks, network, queues | Utilization, saturation, errors | Gregg [P] |

- **Symptoms on the overview, causes on drill-down.** Page and highlight on what users feel (RED or golden signals); use resource metrics (USE) to debug [S: SRE; P: Grafana].
- **Latency as a distribution:** p50 and p95 or p99, with successful and failed requests separate, since fast errors make averages look healthy [S: SRE].
- **Errors include implicit ones:** a 200 with wrong content counts, if you can detect it [S: SRE].
- **Saturation needs a target,** because systems degrade before 100% [S: SRE].
- **SLO views:** objective, current attainment over the window, error budget remaining, and burn rate, with the projection "budget exhausted in about 3 days at this rate" marked as an estimate [S: SRE workbook; J].
- **Refresh matches the process:** for a 99.9% target, probing more than once or twice a minute is probably unnecessary [S: SRE].

## 3. Business and product metrics

- **Count, rate, and value are different figures.** Orders (count), conversion (rate with denominator), revenue (value with currency). Show which [J].
- **Rates carry their base:** "3.1% (62 of 2,000 sessions)". Below a few dozen events, show counts rather than percentages, or show the interval [J; NHS on noise].
- **Money:** currency, gross or net, refunds and tax included or not, recognized or booked. Most revenue disagreements are definition disagreements [J].
- **Funnels:** each step with count and step rate, from the same cohort and window, so the numbers can be checked against each other [J].
- **Cohorts and retention:** state the cohort definition and the window; cohorts still maturing are marked as incomplete [J].
- **Targets:** target and actual on the same scale (bullet graph or bar with target line), with the period elapsed shown, so "62% of target on day 15 of 30" can be judged [P: Few bullet graph spec].

## 4. Small-business status

A bakery owner, a landlord, a club treasurer: occasional readers who need the next action, often on a phone [J].

- Lead with sentences that contain the numbers: "14 orders for Saturday, 3 not yet paid ($86 outstanding)."
- Lists of things to act on (unpaid orders, low stock) rank above charts.
- One chart at most per question ("Sales by week, last 8 weeks"), labeled directly.
- Plain words for every metric; no "AOV" or "MRR" unless the owner uses them.
- Annotated charts were preferred by general readers over sparse or text-only versions [E: Stokes et al.].

## 5. Comparators and baselines

Every relative figure names its comparison. Choose the comparator for the decision [J; S: NHS Making Data Count]:

| Question | Comparator |
|---|---|
| Is it normal right now? | Normal band from history for this hour and weekday |
| Are we on track? | Target pro-rated to elapsed time |
| Did the change help? | Same metric before and after the change date, same length windows |
| Is this period better? | Same period last year or last month, aligned by weekday |
| Which is worst? | Peers on the same scale, sorted |

Write it out: "up 12% vs 1-5 Oct", "4 points below target for day 15". Never "vs last period" without the dates [S: NHS; P: Few].

## 6. Noise: when a change is a change

- Two-point comparisons and red-amber-green ratings mislead: they hide trends and send people chasing noise [S: NHS Making Data Count].
- Use a process-behavior (XmR) chart or a similar check to separate common from special variation before coloring a change [S: NHS].
- Without enough history for that, show the change in neutral color with the history beside it, and let the reader judge [J].
- Feed a noise-only fixture to the dashboard; nothing should alarm or turn colored [J].

## 7. Definitions people and agents can read

- Each panel has a short description reachable by keyboard and in the DOM (not only a hover tooltip): definition, source, refresh, owner [P: Grafana panel descriptions; S: WCAG 1.4.13].
- Keep definitions in one metric dictionary file that both the dashboard and any API read, so they cannot drift [J].
- Name things the same way everywhere: the tile, the chart title, the column header, the CSV header, the API field [S: Mac HIG via interface-guidelines].

## 8. Sources

- Beyer et al. *Site Reliability Engineering*, ch. 6 "Monitoring Distributed Systems": https://sre.google/sre-book/monitoring-distributed-systems/
- Grafana. Dashboard best practices (USE, RED, golden signals, maturity, annotations): https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/
- Gregg, B. The USE Method: https://www.brendangregg.com/usemethod.html
- Few, S. Bullet Graph Design Specification (2013): https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf
- NHS England. Making Data Count: https://www.england.nhs.uk/publication/making-data-count/
- Bach et al. 2023, dashboard design patterns; Stokes et al. on annotated charts: see `research/04-dashboards-dataviz.md` for full references and reading notes.
