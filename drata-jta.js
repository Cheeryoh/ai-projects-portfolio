(() => {
  "use strict";

  const text = (value, fallback = "") => typeof value === "string" && value.trim() ? value.trim() : fallback;
  const list = value => Array.isArray(value) ? value : [];

  function node(tag, className, content) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content !== undefined) el.textContent = String(content);
    return el;
  }

  function renderEmpty(parent, message) {
    parent.replaceChildren(node("div", "empty", message));
  }

  function renderStatus(meta) {
    const row = document.getElementById("status-row");
    const entries = [
      ["Status", text(meta.statusLabel, "Unapproved draft"), "warning"],
      ["Sources", Number(meta.sourceCount) || 0],
      ["Run", text(meta.runId, "pending")],
      ["Generated", text(meta.generatedDate, "pending")]
    ];
    row.replaceChildren(...entries.map(([label, value, kind]) => {
      const pill = node("span", `pill ${kind || ""}`);
      pill.append(node("strong", "", `${label}: `), document.createTextNode(String(value)));
      return pill;
    }));
  }

  function renderStats(data) {
    const stats = document.getElementById("stats");
    const values = [
      [list(data.domains).length, "provisional domains"],
      [list(data.domains).reduce((n, d) => n + list(d.tasks).length, 0), "job tasks"],
      [list(data.ksas).reduce((n, d) => n + list(d.items).length, 0), "KSA statements"],
      [list(data.sources).length, "public sources"]
    ];
    stats.replaceChildren(...values.map(([value, label]) => {
      const card = node("div", "stat");
      card.append(node("b", "", value), node("span", "", label));
      return card;
    }));
  }

  function renderDomains(domains) {
    const grid = document.getElementById("domain-grid");
    if (!domains.length) return renderEmpty(grid, "No public task domains were exported.");
    grid.replaceChildren(...domains.map(domain => {
      const card = node("article", "card");
      const meta = node("div", "domain-meta");
      meta.append(node("span", "", text(domain.id, "Domain")), node("span", "", `${Number(domain.weight) || 0}% proposed`));
      card.append(meta, node("h3", "", text(domain.name, "Untitled domain")), node("p", "", text(domain.rationale, "Provisional grouping from the agent run.")));
      const ul = node("ul", "task-list");
      for (const task of list(domain.tasks)) {
        const li = node("li", "");
        li.append(node("span", "task-id", text(task.id, "T")), document.createTextNode(text(task.statement, "Task unavailable")));
        const details = [text(task.frequency), text(task.criticality)].filter(Boolean).join(" · ");
        if (details) li.append(node("span", "task-meta", details));
        ul.append(li);
      }
      card.append(ul);
      return card;
    }));
  }

  function renderKsas(groups) {
    const grid = document.getElementById("ksa-grid");
    if (!groups.length) return renderEmpty(grid, "No public KSA statements were exported.");
    grid.replaceChildren(...groups.map(group => {
      const card = node("article", "card");
      card.append(node("div", "domain-meta", text(group.domainId, "Domain")), node("h3", "", text(group.domainName, "Capability group")));
      const ul = node("ul", "plain-list");
      for (const item of list(group.items)) {
        const li = node("li", "");
        li.append(node("span", "task-id", text(item.id, text(item.type, "KSA"))), document.createTextNode(text(item.statement, "Statement unavailable")));
        ul.append(li);
      }
      card.append(ul);
      return card;
    }));
  }

  function renderReviews(reviews) {
    const grid = document.getElementById("review-grid");
    if (!reviews.length) return renderEmpty(grid, "No public review findings were exported.");
    grid.replaceChildren(...reviews.map(review => {
      const kind = text(review.kind, "review").toLowerCase();
      const category = `${kind} ${text(review.title).toLowerCase()}`;
      const card = node("article", "card review-card");
      card.dataset.kind = category.includes("bias") ? "bias" : category.includes("challenge") || category.includes("devil") || category.includes("risk") ? "risk" : "review";
      card.append(node("div", "domain-meta", text(review.label, "Simulated review")), node("h3", "", text(review.title, "Review finding")), node("p", "", text(review.summary, "No public summary.")));
      return card;
    }));
  }

  function renderSources(sources) {
    const grid = document.getElementById("source-grid");
    if (!sources.length) return renderEmpty(grid, "No public sources were exported.");
    grid.replaceChildren(...sources.map(source => {
      const card = node("article", "card source");
      card.append(node("div", "source-id", text(source.id, "SRC")));
      const body = node("div", "");
      const title = node("h3", "");
      const href = text(source.url);
      if (href) {
        const a = node("a", "", text(source.title, href));
        a.href = href;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        title.append(a);
      } else title.textContent = text(source.title, "Untitled source");
      body.append(title);
      if (source.excerpt) body.append(node("p", "quote", source.excerpt));
      card.append(body);
      return card;
    }));
  }

  function renderValidation(items) {
    const ul = document.getElementById("validation-list");
    const defaults = [
      "Recruit practicing administrators across customer segments.",
      "Rate task frequency, criticality, and acceptable performance.",
      "Revise the draft and approve the final JTA before building a blueprint.",
      "Keep every later assessment item traceable to an approved task and source."
    ];
    ul.replaceChildren(...(items.length ? items : defaults).map(item => node("li", "", text(item))));
  }

  async function load() {
    const response = await fetch("assets/drata-admin-jta.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Report data returned ${response.status}`);
    const data = await response.json();
    const meta = data.meta || {};
    document.getElementById("report-title").textContent = text(meta.title, "Drata Administrator");
    document.getElementById("report-summary").textContent = text(meta.summary, "A public-evidence draft produced through a multi-agent JTA pipeline.");
    document.getElementById("disclosure").textContent = text(meta.disclosure, "Independent portfolio proposal by Justin Oh. Not affiliated with, endorsed by, or reviewed by Drata. Product administration is not compliance assurance.");
    document.getElementById("run-footer").textContent = text(meta.footer, `Run ${text(meta.runId, "pending")} · Public projection only`);
    renderStatus({ ...meta, sourceCount: list(data.sources).length });
    renderStats(data);
    renderDomains(list(data.domains));
    renderKsas(list(data.ksas));
    renderReviews(list(data.reviews));
    renderSources(list(data.sources));
    renderValidation(list(data.validationNext));
  }

  load().catch(error => {
    document.getElementById("report-summary").textContent = "The report viewer is ready, but its public run projection has not been attached.";
    document.getElementById("disclosure").textContent = "Report unavailable. No partial or private pipeline data has been exposed.";
    renderStatus({ statusLabel: "Data unavailable" });
    for (const id of ["stats", "domain-grid", "ksa-grid", "review-grid", "source-grid"]) renderEmpty(document.getElementById(id), error.message);
    renderValidation([]);
  });
})();
