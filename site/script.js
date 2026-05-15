const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const searchTrigger = document.querySelector(".search-trigger");
const searchPanel = document.querySelector("#search-panel");
const searchInput = document.querySelector("#site-search");
const searchResults = document.querySelector("#search-results");
const filterButtons = document.querySelectorAll(".filter-btn");
const form = document.querySelector("#consult-form");
const formStatus = document.querySelector("#form-status");

const normalize = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");

menuToggle?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement && !event.target.closest(".mega-menu")) {
    mainNav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});

searchTrigger?.addEventListener("click", () => {
  const isHidden = searchPanel.hasAttribute("hidden");
  searchPanel.toggleAttribute("hidden", !isHidden);
  searchTrigger.setAttribute("aria-expanded", String(isHidden));

  if (isHidden) {
    requestAnimationFrame(() => searchInput?.focus());
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter || "all";
    const targetClass = button.dataset.target || "";
    const groupButtons = document.querySelectorAll(`[data-target="${targetClass}"]`);
    const cards = document.querySelectorAll(`.${targetClass}`);

    groupButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    cards.forEach((card) => {
      const categories = card.dataset.category || "";
      const shouldShow = filter === "all" || categories.includes(filter);
      card.toggleAttribute("hidden", !shouldShow);
    });
  });
});

const getTitle = (element) =>
  element.dataset.searchTitle ||
  element.querySelector("summary strong")?.textContent?.trim() ||
  element.querySelector("h3")?.textContent?.trim() ||
  element.textContent?.trim().replace(/\s+/g, " ").slice(0, 90) ||
  "Kết quả";

const searchableItems = Array.from(document.querySelectorAll("[data-search-item]")).map((element) => ({
  element,
  title: getTitle(element),
  text: normalize(`${getTitle(element)} ${element.getAttribute("data-search-item") || ""} ${element.textContent || ""}`),
}));

searchInput?.addEventListener("input", () => {
  const query = normalize(searchInput.value.trim());
  searchResults.innerHTML = "";
  searchableItems.forEach(({ element }) => element.classList.remove("is-highlighted"));

  if (query.length < 2) {
    return;
  }

  const matches = searchableItems.filter((item) => item.text.includes(query)).slice(0, 7);

  if (!matches.length) {
    searchResults.innerHTML = '<div class="search-result">Chưa thấy kết quả phù hợp. Thử từ khóa khác hoặc gửi form tư vấn.</div>';
    return;
  }

  matches.forEach((item) => {
    const result = document.createElement("button");
    result.type = "button";
    result.className = "search-result";
    result.textContent = item.title;
    result.addEventListener("click", () => {
      item.element.removeAttribute("hidden");
      item.element.classList.add("is-highlighted");

      if (item.element instanceof HTMLDetailsElement) {
        item.element.open = true;
      }

      item.element.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    searchResults.appendChild(result);
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const lead = {
    name: data.get("name"),
    phone: data.get("phone"),
    service: data.get("service"),
    urgency: data.get("urgency"),
    message: data.get("message"),
    createdAt: new Date().toISOString(),
  };

  const leads = JSON.parse(localStorage.getItem("ctm-leads") || "[]");
  leads.push(lead);
  localStorage.setItem("ctm-leads", JSON.stringify(leads));

  form.reset();
  formStatus.textContent = "Đã ghi nhận yêu cầu. Bộ phận tiếp nhận sẽ liên hệ lại để xác nhận lịch tư vấn.";
});
