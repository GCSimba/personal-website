(() => {
  const languageButtons = [...document.querySelectorAll("[data-language]")];
  const languageNodes = [...document.querySelectorAll("[data-lang]")];
  const search = document.querySelector("#card-search");
  const cards = [...document.querySelectorAll(".knowledge-card")];
  const filters = [...document.querySelectorAll(".tag-filter")];
  const noResults = document.querySelector("#no-results");
  let activeTag = "";

  function setLanguage(language) {
    const next = language === "en" ? "en" : "zh";
    document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
    languageNodes.forEach((node) => {
      node.hidden = node.dataset.lang !== next;
    });
    languageButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.language === next));
    });
    if (search) {
      search.placeholder = next === "zh" ? "搜索标题、摘要或书名" : "Search titles, summaries, or books";
    }
    localStorage.setItem("notes-language", next);
  }

  function applyFilters() {
    const query = search ? search.value.trim().toLocaleLowerCase() : "";
    let visible = 0;
    cards.forEach((card) => {
      const tags = (card.dataset.tags || "").split("|").filter(Boolean);
      const matchesTag = !activeTag || tags.includes(activeTag);
      const matchesText = !query || (card.dataset.search || "").includes(query);
      card.hidden = !(matchesTag && matchesText);
      if (!card.hidden) visible += 1;
    });
    if (noResults) noResults.hidden = visible !== 0 || cards.length === 0;
  }

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });
  filters.forEach((button) => {
    button.addEventListener("click", () => {
      activeTag = button.dataset.tag || "";
      filters.forEach((item) => item.classList.toggle("is-active", item === button));
      applyFilters();
    });
  });
  if (search) search.addEventListener("input", applyFilters);

  setLanguage(localStorage.getItem("notes-language") || "zh");
  applyFilters();
})();
