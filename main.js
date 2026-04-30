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
  if (cup.parentNode.id === "coffee_maker" && holder_obj.isEmpty === false) {
    cup.classList.add("cup_filled");
    cup_obj.contains.push("кофе");
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
      break;
    case "serving_zone":
      if (currentCustomer.currentOrder === cup_obj.currentDrink) {
        console.log("Правильный напиток!");
        getRandomCustomerForDay(today);
      } else {
        console.log("Неправильный напиток!");
        getRandomCustomerForDay(today);
      }
      serving_zone.classList.remove("hover_effect");
      break;
  }
}
// ------------------------------------------------------------------------

// сохранение приборов в массиве, что бы дать им события
const obj = [coffee_maker, coffee_grinder, tamper];

// раздача событий на каждый прибор
for (let i = 0; i < obj.length; i++) {
  let object = obj[i];
  object.addEventListener("dragenter", dragEnter);
  object.addEventListener("dragover", dragOver);
  object.addEventListener("drop", drop);
}
// console.log("изначальное состояние (холдер)", holder_obj);

// функции для вставления перетаскиваемого объекта в приборы -----------
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
//  -------------------------------------------------------------

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

// цели -- идеи

// draggable = false , когда холдер в процессе действия
// переход между меню с помощью класса hidden
// можно на все нижнее поле добавить див стола, который центтрирует на себе холдер/стакан (или оставляет где есть)

// 1. сделать так чтобы стакан можно было ставить на доску
// 2. сделать нормальную проверку на приготовленный кофе
// 3. сделать переход между фронт деск и бек деск
// 4. перенести зону выдачи на фронт деск
// 5. перенести напиток на фронт деск из бек деск
// -- сделать перетаскиваемую зону сверху на бек деске
// -- удалить ребенка стакан бек деск
// -- добавить ребенка стакан фронт деск
// 6. добавить перетаскиваемый темпер и функционал для него

const serving_zone = document.getElementById("serving_zone");
serving_zone.addEventListener("dragenter", servingZone_dragEnter);
serving_zone.addEventListener("dragleave", servingZone_dragLeave);
serving_zone.addEventListener("dragover", dragOver);
serving_zone.addEventListener("drop", drop);

function servingZone_dragEnter(e) {
  e.preventDefault();
  serving_zone.classList.add("hover_effect");
}

function servingZone_dragLeave() {
  serving_zone.classList.remove("hover_effect");
}

const checkCoffeeBtn = document.querySelector(".check_coffee_btn");
checkCoffeeBtn.addEventListener("click", checkCoffee);

// проверка кофе
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
    console.log(`Неизвестный напиток!ё  `);
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
