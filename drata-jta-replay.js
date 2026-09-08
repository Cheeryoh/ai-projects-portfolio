(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const safeList = value => Array.isArray(value) ? value : [];
  const safeText = (value, fallback = "") => typeof value === "string" && value.trim() ? value.trim() : fallback;
  let timer = null;
  let activeIndex = 0;
  let replayStages = [];

  function createStage(stage, index) {
    const el = document.createElement("article");
    el.className = "stage";
    el.dataset.index = String(index);
    const id = document.createElement("span"); id.className = "stage-id"; id.textContent = String(index + 1).padStart(2, "0");
    const cost = document.createElement("span"); cost.className = "cost"; cost.textContent = stage.costLabel || "recorded";
    const title = document.createElement("h2"); title.textContent = safeText(stage.title, "Pipeline stage");
    const state = document.createElement("p"); state.textContent = safeText(stage.statusLabel, "Completed agent output");
    el.append(id, cost, title, state);
    if (stage.parallelGroup === "reviewers") {
      const parallel = document.createElement("p");
      parallel.className = "parallel-note";
      parallel.textContent = "Parallel simulated review";
      el.append(parallel);
    }
    return el;
  }

  function show(stages, index) {
    const stage = stages[index];
    if (!stage) return;
    const cards = [...document.querySelectorAll(".stage")];
    cards.forEach((card, i) => {
      card.classList.toggle("active", i === index);
      card.classList.toggle("complete", i < index);
      if (i === index) card.setAttribute("aria-current", "step");
      else card.removeAttribute("aria-current");
    });
    $("progress-bar").style.width = `${((index + 1) / stages.length) * 100}%`;
    $("detail-label").textContent = safeText(stage.agent, `STAGE ${index + 1}`).toUpperCase();
    $("detail-title").textContent = safeText(stage.title, "Pipeline stage");
    $("detail-summary").textContent = safeText(stage.summary, "A public summary was not exported.");
    const facts = safeList(stage.facts);
    $("detail-facts").replaceChildren(...facts.map(fact => {
      const li = document.createElement("li");
      const label = document.createElement("strong"); label.textContent = `${safeText(fact.label, "Detail")}: `;
      li.append(label, document.createTextNode(safeText(fact.value, "Not reported")));
      return li;
    }));
    $("stage-position").textContent = `Stage ${index + 1} of ${stages.length} · ${timer === null ? "Paused" : "Playing"}`;
    $("previous").disabled = index === 0;
    $("next").disabled = index === stages.length - 1;
    $("play").disabled = timer !== null;
    $("pause").disabled = timer === null;
  }

  function pause() {
    if (timer !== null) clearInterval(timer);
    timer = null;
    show(replayStages, activeIndex);
  }

  function play() {
    if (timer !== null || !replayStages.length) return;
    if (activeIndex === replayStages.length - 1) activeIndex = 0;
    timer = setInterval(() => {
      activeIndex += 1;
      if (activeIndex === replayStages.length - 1) pause();
      else show(replayStages, activeIndex);
    }, Number($("speed").value));
    show(replayStages, activeIndex);
  }

  function move(delta) {
    pause();
    activeIndex = Math.max(0, Math.min(replayStages.length - 1, activeIndex + delta));
    show(replayStages, activeIndex);
  }

  async function load() {
    const response = await fetch("assets/drata-admin-jta.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Run projection returned ${response.status}`);
    const data = await response.json();
    const stages = safeList(data.pipelineStages);
    if (!stages.length) throw new Error("No public pipeline stages were exported");
    $("run-meta").textContent = `${safeText(data.meta?.runId, "run pending")}\n${safeText(data.meta?.generatedDate, "date pending")}`;
    $("stages").replaceChildren(...stages.map(createStage));
    replayStages = stages;
    show(replayStages, activeIndex);
    $("previous").addEventListener("click", () => move(-1));
    $("next").addEventListener("click", () => move(1));
    $("play").addEventListener("click", play);
    $("pause").addEventListener("click", pause);
    $("speed").addEventListener("change", () => {
      if (timer !== null) { pause(); play(); }
    });
    document.addEventListener("visibilitychange", () => { if (document.hidden) pause(); });
  }

  load().catch(error => {
    $("detail-label").textContent = "DATA UNAVAILABLE";
    $("detail-title").textContent = "Replay cannot start";
    $("detail-summary").textContent = error.message;
  });
})();
