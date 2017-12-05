"use strict";
/*-----Импорты модулей-----*/
import accordeonInit from "./accordeon";
import feedsInit from "./feeds";
import formInit from "./form";
import hamburgerMenu from "./hamburger_menu";
import modalOpen from "./modal";
import OnePageScroll from "./onePageScroll";
import sliderInit from "./slider";

// проверка с какого браузера сидит пользователь
const md = new MobileDetect(window.navigator.userAgent);

// создание нового объекта от конструктора OnaPageScroll

let OPS = new OnePageScroll(
  {
    querySelectorWrapper: ".wrapper",
    queryOPSList: ".maincontent",
    queryOPSItems: ".section",
    OPScurrnetItem: 0,
    querySelectorPagination: ".pagination",
    querySelectorPaginationItem: ".pagination__item"
  },
  md
);

// иницилизация его (в нее входит проверка наличия элементов на странице, а также установка обработчика на document)
OPS.init();

/*-----Аккордеон для секции team------*/
(function() {
  var teamAccordeon = document.getElementById("team__accordeon");

  if (teamAccordeon) {
    teamAccordeon.addEventListener(
      "click",
      accordeonInit(".team__accordeon-item", "team__accordeon-item--active")
    );
    teamAccordeon.addEventListener(
      "thouchstart",
      accordeonInit(".team__accordeon-item", "team__accordeon-item--active")
    );
  }
})();

/*-----Аккордеон для секции menu------*/
(function() {
  let menu = document.getElementById("menu");

  if (menu) {
    menu.addEventListener(
      "click",
      accordeonInit(".menu__item", "menu__item--active")
    );
  }
})();

//иницилизация отзывов
feedsInit(modalOpen);
//иницилизация формы
formInit(modalOpen);
//иницилизация формы
hamburgerMenu();
//иницилизация слайдера
sliderInit(md);

// подключение яндекс карт
(function() {
  ymaps.ready(init);

  function init() {
    let myMap = new ymaps.Map("map", {
      center: [59.92835943, 30.32644111],
      zoom: 12,
      controls: []
    });
    let marker = "/img/map-marker.png";

    myMap.behaviors.disable("scrollZoom");

    let coords = [
        [59.95415993442389, 30.412447935989327],
        [59.9444854, 30.38450602],
        [59.88751101, 30.32545451],
        [59.90993322, 30.49436931]
      ],
      myCollection = new ymaps.GeoObjectCollection(
        {},
        {
          iconLayout: "default#image",
          iconImageHref: marker,
          iconImageSize: [46, 57],
          iconImageOffset: [-24, -54]
        }
      );

    for (var i = 0; i < coords.length; i++) {
      myCollection.add(new ymaps.Placemark(coords[i]));
    }

    myMap.geoObjects.add(myCollection);
  }
})();
