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
    holder.src = "./img/main_assets/holder/holder_withCoffee.png";
  }
}

function tamp_coffee(object) {
  if (
    holder.parentNode.id === "tamper_zone" &&
    object === "tamper" &&
    holder_obj.isEmpty === false
  ) {
    holder_obj.isCoffeeTampered = true;
    holder.src = "./img/main_assets/holder/holder_tampered.png";
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
    cup_obj.contains.push("кофе");
    cup_obj.checkCoffee();
  }

  if (holder.parentNode.id === "coffee_maker") {
    holder_obj.isEmpty = true;
    holder_obj.isCoffeeTampered = false;
    holder.src = "./img/main_assets/holder/holder_empty.png";
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
  checkCoffee, // ссылки на функцию
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

// хранение перетаскиваемого элемента
let draggedElement = null;

// получение DOM-элементов

// === перетаскиваемые элементы ===
const holder = document.querySelector(".holder");
const cup = document.querySelector(".cup");
const tamper = document.getElementById("tamper");
const milk_box = document.querySelector(".milk_box");

// === статичные элементы ===
const tamper_zone = document.getElementById("tamper_zone");
const coffee_maker = document.getElementById("coffee_maker");
const coffee_grinder = document.getElementById("coffee_grinder");
const cups_container = document.getElementById("cups_container");
const sink = document.getElementById("sink");
const infoBook = document.getElementById("book");

// заметки заказов
const note = document.getElementById("note");
const note_text = document.getElementById("note_text");

// кнопки приборов
document.querySelector(".grinder_btn").addEventListener("click", grind_coffee);
document.querySelector(".maker_btn").addEventListener("click", make_coffee);

function dragStart() {
  if (this.classList.contains("cup")) {
    draggedElement = "cup";
  } else if (this.classList.contains("holder")) {
    draggedElement = "holder";
  } else if (this.classList.contains("milk_box")) {
    draggedElement = "milk_box";
  } else if (this.classList.contains("tamper")) {
    draggedElement = "tamper";
  }
}

function dragEnd() {
  if (draggedElement === "holder") {
    this.classList = "holder";
  } else if (draggedElement === "cup") {
    this.classList = "cup";
  } else if (draggedElement === "milk_box") {
    this.classList = "milk_box";
  } else if (draggedElement === "tamper") {
    this.classList = "tamper";
  }
}

// функции приборов (статичные) -----------------------
function dragEnter(e) {
  e.preventDefault();
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
    case "tamper_zone":
      if (draggedElement === "holder") tamper_zone.append(holder);
      break;
    case "cup":
      PutIn_milk(draggedElement);
      break;
    case "holder":
      tamp_coffee(draggedElement);
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
    case "cups_container":
      if (draggedElement === "cup") cups_container.append(cup);
      break;
    case "sink":
      if (draggedElement === "cup") cup_obj.resetCup();
      break;
  }
}
// ------------------------------------------------------------------------

// функции для вставления перетаскиваемого объекта  -----------
function putIn_coffeeMaker(object) {
  if (object === "holder") {
    if (
      holder_obj.isEmpty === false &&
      holder_obj.isCoffeeTampered === true &&
      draggedElement === "holder"
    ) {
      coffee_maker.append(holder);
    }
  } else if (object === "cup") {
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
      coffee_grinder.append(holder);
    }
  }
}

function giveTo_servingZone() {
  if (currentCustomer.currentOrder === cup_obj.currentDrink) {
    console.log("Правильный напиток! =======================");
    getRandomCustomerForDay(today);
    cup_obj.resetCup();
  } else {
    console.log("Неправильный напиток! =====================");
    getRandomCustomerForDay(today);
    cup_obj.resetCup();
  }
  serving_zone.classList.remove("hover_effect"); // убрать в будущем
}

function putOn_table_backDesk(object) {
  if (object === "cup") {
    table_backDesk.append(cup);
  } else if (object === "holder") {
    table_backDesk.append(holder);
  }
}

function PutIn_milk(object) {
  if (object === "milk_box") {
    cup_obj.contains.push("молоко");
    cup_obj.checkCoffee();
  }
}

//  -------------------------------------------------------------

function resetCup() {
  cup.src = "./img/main_assets/cup/cup.png";
  cup_obj.currentDrink = "";
  cup_obj.contains = [];
  document.getElementById("cups_container").append(cup);
}

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
  note_text.innerText = order;
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
        cup_obj.currentDrink = coffee[0].name;
        cup.src = "./img/main_assets/cup/cup_espresso.png";
        break;
      case "капучино":
        cup_obj.currentDrink = coffee[1].name;
        cup.src = "./img/main_assets/cup/cappuccino.png";
        break;
      case "латте":
        cup_obj.currentDrink = coffee[2].name;
        cup.src = "./img/main_assets/cup/latte.png";
        break;
    }

    console.log(`Приготовлен: ${foundCoffee.name}`);
  } else {
    cup.src = "./img/main_assets/cup/cup_withMilk.png";
    console.log(`Содержимое стакана: ${cup_obj.contains}`);
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
  backDesk.classList.remove("active");
  frontDesk.classList.remove("inactive");
}

function switchToBack() {
  backDesk.classList.add("active");
  frontDesk.classList.add("inactive");
}

// кнопки для переключения между стойками
document.getElementById("toFrontBtn").addEventListener("click", switchToFront);
document.getElementById("toBackBtn").addEventListener("click", switchToBack);

// обе доски и зоны переноса между ними
const table_backDesk = document.getElementById("table_backDesk");
const table_frontDesk = document.getElementById("table_frontDesk");
const transfer_toFront = document.getElementById("transfer_toFront");
const transfer_toBack = document.getElementById("transfer_toBack");

// сохранение приборов в массиве, что бы дать им события [dragenter, dragover, drop]
const obj = [
  coffee_maker,
  coffee_grinder,
  tamper_zone,
  cups_container,
  cup,
  holder,
  serving_zone,
  table_backDesk,
  transfer_toFront,
  transfer_toBack,
  sink,
];

// раздача событий на каждый прибор
for (let i = 0; i < obj.length; i++) {
  let object = obj[i];
  object.addEventListener("dragenter", dragEnter);
  object.addEventListener("dragover", dragOver);
  object.addEventListener("drop", drop);
}

// сохранение перетаскиваемых элементов в массиве, что бы дать им события [dragstart, dragend]
const obj_2 = [holder, cup, milk_box, tamper];

// раздача событий на каждый перетаскиваемый элемент
for (let i = 0; i < obj_2.length; i++) {
  let object = obj_2[i];
  object.addEventListener("dragstart", dragStart);
  object.addEventListener("dragend", dragEnd);
}

// цели -- идеи
// w🍓w
// добавление звуков для кофеварки, кофемолки, темперинга,
// во время наполнения стакана кофе, молоком, во время выливания содержимого в раковину

// добавить ассеты клиентов

// диалог при появлении клиента
// диалог при выдаче заказа
// задержка перед появлением клиента
// добавить ожидание при включении кофеварки и кофемолки

// сделать див блок рядом с клиентом, фон которого будет в виде облака из манги
// сделать последовательные диалоги
// ассет облачка диалога

// столешница на задней доске

// changelog
// добавлены ассеты для всех состояний стакана
// добавлена ассеты кофеварки, полки с книгой, заметки
// все дивы выравнены в соответствии новым фоном
// добавлены дивы для книги и заметок
// добавлено отображение заказа в заметке
// добавлен клиент "Азула"
