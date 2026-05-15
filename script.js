const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const searchInput = document.querySelector("#site-search");
const searchResults = document.querySelector("#search-results");
const form = document.querySelector("#consult-form");
const formStatus = document.querySelector("#form-status");

menuToggle?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    mainNav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});

const searchableItems = Array.from(document.querySelectorAll("[data-search-item]")).map((element) => ({
  element,
  text: element.getAttribute("data-search-item")?.toLowerCase() || "",
  title: element.querySelector("h3")?.textContent?.trim() || element.textContent?.trim().split("\n")[0] || "Kết quả",
}));

searchInput?.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  searchResults.innerHTML = "";

  searchableItems.forEach(({ element }) => {
    element.style.outline = "";
    element.style.outlineOffset = "";
  });

  if (query.length < 2) {
    return;
  }

  const matches = searchableItems.filter((item) => item.text.includes(query) || item.title.toLowerCase().includes(query)).slice(0, 5);

  if (!matches.length) {
    searchResults.innerHTML = '<div class="search-result">Chưa thấy kết quả phù hợp. Thử từ khóa khác hoặc gửi form tư vấn.</div>';
    return;
  }

  matches.forEach((item) => {
    item.element.style.outline = "2px solid #b98943";
    item.element.style.outlineOffset = "3px";

    const result = document.createElement("button");
    result.type = "button";
    result.className = "search-result";
    result.textContent = item.title;
    result.addEventListener("click", () => {
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
    message: data.get("message"),
    createdAt: new Date().toISOString(),
  };

  const leads = JSON.parse(localStorage.getItem("ctm-demo-leads") || "[]");
  leads.push(lead);
  localStorage.setItem("ctm-demo-leads", JSON.stringify(leads));

  form.reset();
  formStatus.textContent = "Đã lưu yêu cầu demo. Bản thật sẽ gửi email cho admin và tạo lead trong CMS/CRM.";
});
