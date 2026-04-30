"use strict";

// получение рандомного числа в указанном диапозоне
function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; // Максимум и минимум включаются
}

// функции кнопок ---------------------------------------------
function grind_coffee() {
  if (holder.parentNode.id === "coffee_grinder") {
    holder_obj.isEmpty = false;
  }
}

function tamp_coffee() {
  if (holder.parentNode.id === "tamper") {
    holder_obj.isCoffeeTampered = true;
  }
}

function make_coffee() {
  if (
    // вот меня бесит этот кусок кода с условием
    cup.parentNode.id === "coffee_maker" &&
    holder.parentNode.id === "coffee_maker" &&
    holder_obj.isEmpty === false &&
    holder_obj.isCoffeeTampered == true
  ) {
    cup.classList.add("cup_filled");
    cup_obj.contains.push("кофе");
    cup_obj.checkCoffee();
  }

  if (holder.parentNode.id === "coffee_maker") {
    holder_obj.isEmpty = true;
    holder_obj.isCoffeeTampered = false;
  }
}

//  -------------------------------------------------

// объект холдер со свойствами
const holder_obj = {
  isEmpty: true,
  isCoffeeTampered: false,
};

// объект стакан со свойствами
const cup_obj = {
  currentDrink: "",
  contains: [],
  checkCoffee, // ссылка на функцию
  resetCup,
};

// массив доступных кофе для приготовления
const coffee = [
  {
    name: "эспрессо",
    contains: ["кофе"],
  },
  {
    name: "капучино",
    contains: ["кофе", "молоко"],
  },
  {
    name: "латте",
    contains: ["молоко", "кофе"],
  },
];

// перетаскиваемый элемент
let draggedElement = null;

// получение DOM-элементов

const holder = document.querySelector(".holder");
const cup = document.querySelector(".cup");
const tamper = document.getElementById("tamper");
const coffee_maker = document.getElementById("coffee_maker");
const coffee_grinder = document.getElementById("coffee_grinder");

// кнопки
const grinder_btn = document.querySelector(".grinder_btn");
grinder_btn.addEventListener("click", grind_coffee);

const tamper_btn = document.querySelector(".tamper_btn");
tamper_btn.addEventListener("click", tamp_coffee);

const maker_btn = document.querySelector(".maker_btn");
maker_btn.addEventListener("click", make_coffee);

// добавление событий на начало перетаскивания и на конец
holder.addEventListener("dragstart", dragStart);
holder.addEventListener("dragend", dragEnd);
cup.addEventListener("dragstart", dragStart);
cup.addEventListener("dragend", dragEnd);

// молоко
const milk_box = document.querySelector(".milk_box");

cup.addEventListener("dragover", dragOver);
cup.addEventListener("drop", drop);

// функции перетаскиваемых объектов -------------------------
function dragStart() {
  if (this.classList.contains("cup")) {
    draggedElement = "cup";
  } else if (this.classList.contains("holder")) {
    draggedElement = "holder";
  }
  setTimeout(() => ((this.className = "invisible"), 0));
}

function dragEnd() {
  if (draggedElement === "holder") {
    this.classList = "holder";
  } else if (draggedElement === "cup") {
    this.classList = "cup";
  }

  this.classList.remove("invisible"); // убираем invisible если есть
}

// функции приборов (статичные) -----------------------
function dragEnter(e) {
  e.preventDefault();
  // зачем вот это я не знаю
}

function dragOver(e) {
  e.preventDefault();
  // это нужно что бы при наведении на прибор не показывался крестик;
  // и что бы работала функция drop()
}

// --- функция перетаскивания объекта в прибор
function drop() {
  switch (this.id) {
    case "coffee_maker":
      putIn_coffeeMaker(draggedElement);
      break;
    case "coffee_grinder":
      putIn_coffeeGrinder(draggedElement);
      break;
    case "tamper":
      putIn_tamper(draggedElement);
      break;
    case "cup":
      cup_obj.contains.push("молоко");
      cup_obj.checkCoffee();
      break;
    case "serving_zone":
      giveTo_servingZone();
      break;
    case "table_backDesk":
      putOn_table_backDesk(draggedElement);
      break;
    case "transfer_toFront":
      if (draggedElement === "cup") table_frontDesk.append(cup);
      break;
    case "transfer_toBack":
      if (draggedElement === "cup") table_backDesk.append(cup);
      break;
  }
}
// ------------------------------------------------------------------------

// сохранение приборов в массиве, что бы дать им события (дополнить в будущем по возможности)
const obj = [coffee_maker, coffee_grinder, tamper];

// раздача событий на каждый прибор
for (let i = 0; i < obj.length; i++) {
  let object = obj[i];
  object.addEventListener("dragenter", dragEnter);
  object.addEventListener("dragover", dragOver);
  object.addEventListener("drop", drop);
}

// функции для вставления перетаскиваемого объекта  -----------
function putIn_coffeeMaker(object) {
  if (object === "holder") {
    if (
      holder_obj.isEmpty === false &&
      holder_obj.isCoffeeTampered === true &&
      draggedElement === "holder"
    ) {
      holder.classList = "holder_in_maker";
      coffee_maker.append(holder);
    }
  } else if (object === "cup") {
    cup.classList = "cup_in_maker";
    coffee_maker.append(cup);
  }
}

function putIn_coffeeGrinder(object) {
  if (object === "holder") {
    if (
      holder_obj.isEmpty === true &&
      holder_obj.isCoffeeTampered === false &&
      draggedElement === "holder"
    ) {
      holder.classList = "holder_in_grinder";
      coffee_grinder.append(holder);
    }
  }
}

function putIn_tamper(object) {
  if (object === "holder") {
    if (
      holder_obj.isEmpty === false &&
      holder_obj.isCoffeeTampered === false &&
      draggedElement === "holder"
    ) {
      holder.classList = "holder_in_tamper";
      tamper.append(holder);
    }
  }
}

function giveTo_servingZone() {
  if (currentCustomer.currentOrder === cup_obj.currentDrink) {
    console.log("Правильный напиток!");
    getRandomCustomerForDay(today);
    cup_obj.resetCup();
  } else {
    console.log("Неправильный напиток!");
    getRandomCustomerForDay(today);
    cup_obj.resetCup();
  }
  serving_zone.classList.remove("hover_effect"); // убрать в будущем
}

function putOn_table_backDesk(object) {
  if (object === "cup") {
    cup.classList = "cup_on_table";
    table_backDesk.append(cup);
  } else if (object === "holder") {
    holder.classList = "holder_on_table";
    table_backDesk.append(holder);
  }
}

//  -------------------------------------------------------------

function resetCup() {
  cup_obj.currentDrink = "";
  cup_obj.contains = [];
  document.getElementById("cups_container").append(cup);
}

//

// Получаем back_desk
const backDesk = document.getElementById("back_desk");

// конструктор клиентов -----------------------
class Customer {
  constructor(id, name, coffeeList, visitDays) {
    this.id = id;
    this.name = name;
    this.coffeeList = coffeeList; // массив кофе: ["эспрессо", "капучино"]
    this.visitDays = visitDays; // массив дней: ["пн", "вт", "ср"]
    this.currentOrder = null;
    this.wasToday = false;
  }

  makeOrder() {
    const randomIndex = getRandomNumber(0, this.coffeeList.length - 1);
    this.currentOrder = this.coffeeList[randomIndex];
    return this.currentOrder;
  }

  resetForNewDay() {
    this.wasToday = false;
  }
}
//  -------------------------------------------

// массив с клиентами
const customers = [
  new Customer(1, "Анастасия", ["эспрессо", "капучино"], ["пн", "ср", "пт"]),
  new Customer(2, "Михаил", ["латте", "капучино"], ["пн", "ср"]),
  new Customer(3, "Алексей", ["латте", "капучино"], ["пн", "чт"]),
];

// Функция получения клиента
function getRandomCustomerForDay(day) {
  // выбор доступных клиентов на день
  let availableCustomers = customers.filter(
    (customer) =>
      customer.visitDays.includes(day) && customer.wasToday === false
  );

  if (availableCustomers.length === 0) {
    console.log(`На ${day} больше нет новых клиентов!`);
    let x = switchDay();
    return getRandomCustomerForDay(x);
  }

  // выбор случайного клиента из доступных
  const randomIndex = getRandomNumber(0, availableCustomers.length - 1);
  let selectedCustomer = availableCustomers[randomIndex];
  selectedCustomer.wasToday = true;
  const order = selectedCustomer.makeOrder();
  console.log(`Сегодняшний день: ${today}`);
  console.log(`Клиент: ${selectedCustomer.name}, Заказ: ${order}`);
  return selectedCustomer;
}

const weekDays = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
let dayIndex = 0;
let today = weekDays[dayIndex];

let currentCustomer = null;
currentCustomer = getRandomCustomerForDay(today);

function switchDay() {
  dayIndex++;
  if (dayIndex < weekDays.length) {
    today = weekDays[dayIndex];
  } else {
    dayIndex = 0;
    today = weekDays[dayIndex];
  }
  customers.forEach((customer) => customer.resetForNewDay());
  return today;
}

const serving_zone = document.getElementById("serving_zone");
serving_zone.addEventListener("dragenter", servingZone_dragEnter);
serving_zone.addEventListener("dragleave", servingZone_dragLeave);
serving_zone.addEventListener("dragover", dragOver);
serving_zone.addEventListener("drop", drop);

function servingZone_dragEnter(e) {
  e.preventDefault();
  serving_zone.classList.add("hover_effect"); // убрать в будущем
}

function servingZone_dragLeave() {
  serving_zone.classList.remove("hover_effect"); // убрать в будущем
}

// функция проверки кофе
function checkCoffee() {
  let foundCoffee = null;

  for (let i = 0; i < coffee.length; i++) {
    const recipe = coffee[i];

    // Сравниваем массивы contains
    if (arraysEqual(cup_obj.contains, recipe.contains)) {
      foundCoffee = recipe;
      break;
    }
  }

  // Если нашли совпадение
  if (foundCoffee) {
    switch (foundCoffee.name) {
      case "эспрессо":
        cup_obj.currentDrink = "эспрессо";
        break;
      case "капучино":
        cup_obj.currentDrink = "капучино";
        break;
      case "латте":
        cup_obj.currentDrink = "латте";
        break;
    }

    console.log(`Приготовлен: ${foundCoffee.name}`);
  } else {
    console.log(`Неизвестный напиток!`);
  }
}

// Функция сравнения двух массивов
function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

// переключение между страницами
const frontDesk = document.querySelector(".front_desk");

function switchToFront() {
  frontDesk.classList.add("active");
  backDesk.classList.add("inactive");
}

function switchToBack() {
  frontDesk.classList.remove("active");
  backDesk.classList.remove("inactive");
}

// кнопки для переключения между стойками
document.getElementById("toFrontBtn").addEventListener("click", switchToFront);
document.getElementById("toBackBtn").addEventListener("click", switchToBack);

// цели -- идеи

// draggable = false , когда холдер в процессе действия
// можно на все нижнее поле добавить див стола, который центтрирует на себе холдер/стакан (или оставляет где есть)

// 6. добавить перетаскиваемый темпер и функционал для него
// ! ОШИБКА: при перетаскивании холдера и стакана в приборы им почему-то не присваиваются новые классы =>
// ! ОШИБКА: => или: новый класс даётся, но что-то обнуляет класс

const table_backDesk = document.getElementById("table_backDesk");
table_backDesk.addEventListener("dragover", dragOver);
table_backDesk.addEventListener("drop", drop);

const table_frontDesk = document.getElementById("table_frontDesk");

const transfer_toFront = document.getElementById("transfer_toFront");
transfer_toFront.addEventListener("dragover", dragOver);
transfer_toFront.addEventListener("drop", drop);

const transfer_toBack = document.getElementById("transfer_toBack");
transfer_toBack.addEventListener("dragover", dragOver);
transfer_toBack.addEventListener("drop", drop);

// ! кнопки для переключения на бэк и фронт деск добавлены. правда находясь в бек деск,
// ! кнопка на фронт деск выглядит как-то убого (p.s. навести на верхний правый угол находясь в бек деск)

// может быть как-то коментариями разделить классы в css для удобного понимания? или как-нибудь сгруппировать
// посмотреть можно ли оптимизировать присваивание событий для объектов
// update: это можно сделать при финальном рефакторинге, сейчас нет смысла т.к. все равно классы будут меняться
// 9. добавить комементарии ко всему: можно так же сделать при рефакторинге или после готового MVP
