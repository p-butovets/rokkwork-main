const hamburger = document.querySelector(".hamburger");
const mobileNavigation = document.querySelector(".mob__nav");
const headerNav = document.querySelector(".header__nav");
const mobNav = document.querySelector(".mob__nav-list");
const langToggler = document.querySelector(".lang-toggler");
const langTogglerList = document.querySelector(".lang-toggler__list");
const langTogglerListItem = document.querySelectorAll(
  ".lang-toggler__list-item"
);
const projectstWrapper = document.querySelector(".projects__wrapper");
let currentPath = window.location.pathname;

// Localize::Start
function getLangCookie() {
  return document.cookie.replace(
    /(?:(?:^|.*;\s*)lang\s*\=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
}

function setLangCookie(value, name = "lang") {
  document.cookie = `${name}=${value}`;
}

/**
 * It gets the language from the cookie, if it's not there, it gets it from the browser, if it's not
 * there, it sets it to English
 * @returns the userLang variable.
 */
function setLocalisation() {
  let userLang = getLangCookie();
  if (!userLang) {
    userLang = navigator.language;
    if (userLang !== "uk" && userLang !== "en") {
      userLang = "en";
    }
    setLangCookie(userLang);
  }
  return userLang;
}

function setTitle(data) {
  for (let i in data) {
    if (data[i].path === currentPath) {
      document.title = data[i].title;
    }
  }
}

function addMobNavToggler(item) {
  item.addEventListener("click", () => {
    hamburger.classList.toggle("hamburger_active");
    mobileNavigation.classList.toggle("mob__nav_active");
  });
}

/**
 * It takes an array of objects, loops through it, and creates a list item for each object
 * @param data - an array of objects with the following properties:
 * @param target - the element to which the items will be added
 * @param itemClassName - the class name of the item
 * @param inHTMLclassName - this is the class name that will be added to the item in the HTML.
 * @param isListener - if true, the function will add a listener to the item, which will toggle the
 * mobile navigation menu.
 */
function addNavItems(data, target, itemClassName, inHTMLclassName, isListener) {
  for (let i in data) {
    if (data[i].isTurnedOn == "true") {
      let item = document.createElement("li");
      item.classList.add(itemClassName);
      item.innerHTML = `<a href="${data[i].path}" ${data[i].attributes}>${data[i].ancor}</a>`;
      if (inHTMLclassName) {
        item.classList.add(inHTMLclassName);
      }
      target.appendChild(item);
      if (isListener) {
        addMobNavToggler(item);
      }
    }
  }
}

function setFontStyle(fontStyle) {
  let body = document.querySelector("body");
  body.style.fontFamily = fontStyle;
}

function setOneText(selector, text) {
  let element = document.querySelector(selector);
  element.innerHTML = text;
}

function setPlaceholder(selector, placeholder) {
  document.querySelector(selector).placeholder = placeholder;
}

/**
 * It creates a div element, adds some classes to it, adds some inner HTML to it, and then appends it
 * to the DOM
 * @param projectData - an object with the following properties:
 */
function addProject(projectData) {
  let projectItem = document.createElement("div");
  projectItem.classList.add("projects__item");

  let projectItemWrapper = document.createElement("div");
  projectItemWrapper.classList.add("projects__item__wrapper");

  let xtraWrapper = document.createElement("div");
  xtraWrapper.classList.add("projects__item__xtrawrap");
  xtraWrapper.innerHTML = `
        <div class="projects__item__title">${projectData.title}</div>
        <div class="projects__item__descr">${projectData.description}</div>
    `;

  let badges = document.createElement("div");
  badges.classList.add("projects__item__badges");

  for (let badgeText of projectData.badges) {
    let badge = document.createElement("div");
    badge.className = "badge badge_primary";
    badge.innerHTML = badgeText;
    badges.appendChild(badge);
  }

  projectItemWrapper.appendChild(xtraWrapper);
  projectItemWrapper.appendChild(badges);
  projectItem.appendChild(projectItemWrapper);
  projectstWrapper.appendChild(projectItem);
}

function addService(serviceData) {
  const wrapper = document.querySelector(".services__wrapper");

  const item = document.createElement("div");
  item.classList.add("services__item");

  const icon = document.createElement("div");
  icon.classList.add("services__item-icon");
  icon.innerHTML = `<img src="${serviceData.iconUrl}" alt="${serviceData.title}">`;

  const text = document.createElement("div");
  text.classList.add("services__item-text");
  text.innerHTML = `
        <div class="services__item-title">${serviceData.title}</div>
        <div class="services__item-description">${serviceData.description}</div>
    `;

  item.appendChild(icon);
  item.appendChild(text);
  wrapper.appendChild(item);
}


fetch(`data/data_${setLocalisation()}.json`)
  .then((response) => response.json())
  .then((json) => {
    setFontStyle(json.FONT_STYLE);
    setTitle(json.NAV_ITEMS_LIST);
    setOneText(".lang-toggler", json.LOCALIZE_TOGGLER.TEXT);
    setOneText(".promo__subtitle", json.PROMO_SUBTITLE_TEXT);
    setOneText(".button_primary", json.PROMO_BUTTON_PRIMARY_TEXT);
    setOneText(".button_secondary", json.PROMO_BUTTON_SECONDARY_TEXT);
    setOneText('[data-name="partners"]', json.PARTNERS_HEADING_TITLE_TEXT);
    setOneText('[data-name="projects"]', json.PROJECTS_HEADING_TITLE_TEXT);
    setOneText('[data-name="services"]', json.SERVICES_HEADING_TITLE_TEXT);
    setOneText(
      '[data-name="contacts-title"]',
      json.CONTACTS_HEADING_TITLE_TEXT
    );
    setOneText(
      '[data-name="contacts-subtitle"]',
      json.CONTACTS_HEADING_SUBTITLE_TEXT
    );
    addNavItems(
      json.NAV_ITEMS_LIST,
      headerNav,
      "header__nav__item",
      false,
      false
    );
    addNavItems(
      json.NAV_ITEMS_LIST,
      mobNav,
      "mob__nav-list-item",
      "mob_link",
      true
    );

    for (let project of json.PROJECTS) {
      addProject(project);
    }

    for (let service of json.SERVICES) {
      addService(service);
    }

    setPlaceholder('#name', json.INPUT_NAME_PLACEHOLDER);
    setPlaceholder('#email', json.INPUT_EMAIL_PLACEHOLDER);
    setPlaceholder('#text', json.INPUT_TEXT_PLACEHOLDER);
    setOneText('#btn_submit', json.FORM_BTN_TEXT);
  });

// Localize::End

//EventListeners::Start
window.addEventListener("DOMContentLoaded", () => {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("hamburger_active");
    mobileNavigation.classList.toggle("mob__nav_active");
  });
  langToggler.addEventListener("click", () => {
    langTogglerList.classList.toggle("lang-toggler__list_hidden");
  });
  langTogglerListItem.forEach((item) => {
    item.addEventListener("click", () => {
      langTogglerList.classList.toggle("lang-toggler__list_hidden");
      setLangCookie(item.dataset.lang);
      document.location.reload();
    });
  });
});
//EventListeners::End

//Send form 
$(document).ready(function () {
  $('#btn_reset').on('click', () => {
    $(this).find("input").val("");
    $('form').trigger('reset');
    $('#btn_reset').toggleClass('nohover');
  });
  

  $('form').submit(function (e) {
    e.preventDefault();
    
    $.ajax({
        type: 'POST',
        url: "https://rokkwork.space/mailer/main_mailer.php",
        data: {
          name: $('input#name').val(),
          email: $('input#email').val(),
          text: decodeURI($('textarea#text').val())
        }
    }).done(function () {
        $(this).find("input").val("");

        $('#btn_submit').addClass( "button_success" );
        const btnHtml = $('#btn_submit').html();
        $('#btn_submit').html( '<span class="material-symbols-outlined">done_all</span>' );

        setTimeout(() => {
          $('#btn_submit').html(btnHtml);
          $('#btn_submit').removeClass( "button_success" );
        }, 3000);

        $('form').trigger('reset');
    });
  });
});

