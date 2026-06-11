const content = {
  en: {
    htmlLang: "en",
    brand: "Your Name",
    navWork: "Work",
    navWriting: "Writing",
    navAbout: "About",
    eyebrow: "Personal archive",
    title: "Portfolio",
    lede:
      'I am building a public home for my <a href="#work">work</a>, <a href="#writing">writing</a>, and independent projects. This page is intentionally simple: a readable record before it becomes a larger website.',
    workTitle: "Work",
    writingTitle: "Writing",
    personalTitle: "Personal",
    aboutTitle: "About me",
    aboutBody:
      "Hey, I am Your Name. I care about thoughtful software, clear writing, and small systems that compound over time.",
    emailLink: "Email",
    githubLink: "GitHub",
    linkedinLink: "LinkedIn",
    xLink: "X",
    lastUpdated: "Last updated:",
    work: [
      {
        title: "Personal website",
        href: "#content",
        meta: "2026",
        body: "A minimal archive for projects, writing, and public notes. Built as a static page first so it can move easily to Cloudflare Pages later.",
      },
      {
        title: "Selected project",
        href: "#work",
        meta: "Case study",
        body: "Replace this with a project that shows your taste, role, constraints, and measurable outcome.",
      },
      {
        title: "Professional experience",
        href: "#about",
        meta: "Background",
        body: "Use this line for your current role, past work, research, freelance practice, or a concise career summary.",
      },
    ],
    writing: [
      {
        title: "Notes on building a personal website",
        href: "#writing",
        meta: "Draft",
        body: "A future essay about turning scattered work into a calm, durable public record.",
      },
      {
        title: "What I am learning now",
        href: "#writing",
        meta: "Log",
        body: "A lightweight space for current interests, technical notes, and experiments worth revisiting.",
      },
      {
        title: "Reading list",
        href: "#writing",
        meta: "Collection",
        body: "Books, articles, talks, and tools that are shaping how you think.",
      },
    ],
    personal: [
      {
        title: "Small tools",
        href: "#personal",
        meta: "Experiments",
        body: "Tiny utilities, scripts, automations, and weekend ideas that may become larger projects.",
      },
      {
        title: "Now page",
        href: "#personal",
        meta: "Current",
        body: "A short record of what you are focused on this month.",
      },
    ],
  },
  zh: {
    htmlLang: "zh-CN",
    brand: "你的名字",
    navWork: "作品",
    navWriting: "写作",
    navAbout: "关于",
    eyebrow: "个人档案",
    title: "作品集",
    lede:
      '我正在搭建一个属于自己的公开主页，用来整理<a href="#work">作品</a>、<a href="#writing">写作</a>和个人项目。这个版本刻意保持简单，先成为一份耐读、可靠、后续好扩展的记录。',
    workTitle: "作品",
    writingTitle: "写作",
    personalTitle: "个人项目",
    aboutTitle: "关于我",
    aboutBody:
      "你好，我是你的名字。我关注有思考的软件、清晰的表达，以及那些会随着时间慢慢复利的小系统。",
    emailLink: "邮箱",
    githubLink: "GitHub",
    linkedinLink: "LinkedIn",
    xLink: "X",
    lastUpdated: "最后更新：",
    work: [
      {
        title: "个人网站",
        href: "#content",
        meta: "2026",
        body: "一个极简的个人档案，用来放项目、文章和公开笔记。先做成静态页面，之后可以很轻松地部署到 Cloudflare Pages。",
      },
      {
        title: "精选项目",
        href: "#work",
        meta: "案例",
        body: "这里可以替换成最能代表你的项目，写清楚你的角色、限制条件、审美判断和实际结果。",
      },
      {
        title: "职业经历",
        href: "#about",
        meta: "背景",
        body: "这里可以放当前角色、过往工作、研究经历、自由职业实践，或者一句简洁的职业概述。",
      },
    ],
    writing: [
      {
        title: "关于搭建个人网站的笔记",
        href: "#writing",
        meta: "草稿",
        body: "未来可以写一篇文章，记录如何把分散的作品整理成稳定、安静、长期可维护的公开档案。",
      },
      {
        title: "我最近在学什么",
        href: "#writing",
        meta: "日志",
        body: "放当前兴趣、技术笔记和那些值得回头看的实验。",
      },
      {
        title: "阅读清单",
        href: "#writing",
        meta: "集合",
        body: "整理正在影响你思考方式的书、文章、演讲和工具。",
      },
    ],
    personal: [
      {
        title: "小工具",
        href: "#personal",
        meta: "实验",
        body: "一些工具、脚本、自动化和周末想法，未来也许会长成更完整的项目。",
      },
      {
        title: "Now 页面",
        href: "#personal",
        meta: "当前",
        body: "简短记录这个月正在关注什么。",
      },
    ],
  },
};

const storageKey = "portfolio-language";
const languageButtons = document.querySelectorAll("[data-lang]");
const textNodes = document.querySelectorAll("[data-i18n]");
const htmlNodes = document.querySelectorAll("[data-i18n-html]");
const listNodes = document.querySelectorAll("[data-list]");
const lastUpdatedNode = document.querySelector(".last-updated");

function renderList(node, items) {
  node.innerHTML = items
    .map(
      (item) => `
        <li>
          <strong><a href="${item.href}">${item.title}</a></strong>
          <span class="meta">(${item.meta})</span>
          <p>${item.body}</p>
        </li>
      `,
    )
    .join("");
}

function setLanguage(lang) {
  const dictionary = content[lang] || content.en;

  document.documentElement.lang = dictionary.htmlLang;

  textNodes.forEach((node) => {
    const key = node.dataset.i18n;
    if (dictionary[key]) {
      node.textContent = dictionary[key];
    }
  });

  htmlNodes.forEach((node) => {
    const key = node.dataset.i18nHtml;
    if (dictionary[key]) {
      node.innerHTML = dictionary[key];
    }
  });

  listNodes.forEach((node) => {
    const key = node.dataset.list;
    renderList(node, dictionary[key] || []);
  });

  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === lang;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  localStorage.setItem(storageKey, lang);
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.lang);
  });
});

if (lastUpdatedNode) {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const updated = `${now.getFullYear()}-${month}`;
  lastUpdatedNode.dateTime = updated;
  lastUpdatedNode.textContent = updated;
}

setLanguage(localStorage.getItem(storageKey) || "en");
