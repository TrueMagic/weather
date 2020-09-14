class View {
  constructor() {
    this.containerMain = document.querySelector("#main");

    this.EnterCityInput = document.createElement("input");

    this.addCityBtn = document.createElement("button");
    this.deleteCityBtn = document.createElement("button");
    this.citiesList = document.createElement("ul");

    this.EnterCityInput.classList.add("EnterCityInput");
    this.addCityBtn.classList.add("addCityBtn");
    this.deleteCityBtn.classList.add("deleteCityBtn");
    this.citiesList.classList.add("citiesList");

    this.EnterCityInput.placeholder = "Enter the city";
    this.addCityBtn.innerHTML = "Add";
    this.deleteCityBtn.innerHTML = "Clear"; 
  }
  
  initRender() {
    this.containerMain.append(this.EnterCityInput, this.addCityBtn, this.deleteCityBtn, this.citiesList);
  }
  
  renderCitiesList(nameOfCity, id, temp, clouds, windSpeed) {
    const cityItem = document.createElement("li");
    const content = document.createElement("div");
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");
    const saveButton = document.createElement("button");
    const editionsConteiner = document.createElement("div");
    const editInput = document.createElement("input");
 

    deleteButton.classList.add ("deleteButton");
    editButton.classList.add("editButton");
    saveButton.classList.add("saveButton");
    content.classList.add("contentCities");
    editionsConteiner.classList.add('hide');
    editInput.classList.add("editInput");
    
    editInput.value = nameOfCity;

    deleteButton.innerHTML = "Delete";
    editButton.innerHTML = "Edit";
    saveButton.innerHTML = "Save";
    content.innerHTML = `${nameOfCity} <br>
    ${temp}&#8451, Clouds:${clouds}, Wind:${windSpeed}m/s`;
  
    deleteButton.setAttribute("data-action", "delete");
    deleteButton.setAttribute("data-id", id);
    editButton.setAttribute("data-action", "edit");
    editButton.setAttribute("data-id", id);
    saveButton.setAttribute("data-action", "saveedit" );
    saveButton.setAttribute("data-id", id);

    editionsConteiner.append(editInput, saveButton);
    cityItem.append(content, editButton, editionsConteiner, deleteButton);
    this.citiesList.append(cityItem);  
  }
}

class ViewStatic {
  constructor() {
    this.containerMain = document.querySelector("#main");

    this.containerAside = document.createElement("div");
    this.containerPosition = document.createElement("div");
    this.headerYourCity = document.createElement("h3");
    this.containerPosition1 = document.createElement("div");
    this.containerPosition2 = document.createElement("div");
    this.conteinerMoney = document.createElement("div");
    this.headerMoney = document.createElement("h3");
    this.usdInfo = document.createElement("div");
    this.eurInfo = document.createElement("div");

    this.containerAside.classList.add("containerAside");
    this.containerPosition.classList.add("containerPosition");
    this.headerYourCity.classList.add("headerYourCity");
    this.containerPosition1.classList.add("containerPosition1");
    this.containerPosition2.classList.add("containerPosition2");
    this.conteinerMoney.classList.add("conteinerMoney");
    this.headerMoney.classList.add("headerMoney");
    this.usdInfo.classList.add("usdInfo");
    this.eurInfo.classList.add("eurInfo");

    this.headerYourCity.innerText = "Your location";
    this.headerMoney.innerText = "Exchange"; 
  }

  initRenderStaticView() {
    this.conteinerMoney.append(this.headerMoney, this.usdInfo, this.eurInfo);
    this.containerPosition.append(this.headerYourCity, this.containerPosition1, this.containerPosition2);
    this.containerAside.append(this.containerPosition, this.conteinerMoney);
    this.containerMain.append(this.containerAside);
  }

  renderLocation(name, temp, clouds, windSpeed) {
    this.containerPosition1.innerHTML = name;
    this.containerPosition2.innerHTML = `${temp}&#8451, Clouds:${clouds}, Wind:${windSpeed}m/s`;
  }

  renderMoney(buyUSD, saleUSD, buyEUR, saleEUR) {
    this.usdInfo.innerHTML = `USD: ${buyUSD}/${saleUSD}`; 
    this.eurInfo.innerHTML = `EUR: ${buyEUR}/${saleEUR}`;
  }
 
}

class Controller { 
  constructor(model, view, viewStatic) {
    this.model = model;
    this.view = view;
    this.viewStatic = viewStatic;
    const loadAllContent = this.loadAllContent.bind(this);
  }

  loadAllContent() {
    this.getLocation();
    this.getMoney();
    this.loadStorage();
  }

  loadStorage() {
    this.model.loadList();
  }

  locationNotReceived() {
    this.viewStatic.headerYourCity.innerText = 'Unable to get your location';
  }


  locationReceived(position) {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    this.model.getWeather(latitude, longitude);
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => this.locationReceived(position), (position)=>this.locationNotReceived(position));
    } else {
      this.viewStatic.headerYourCity.innerText = "There is some problems with your browser";
    }
  }

  getMoney() {
    this.model.getMoney();
    setInterval(()=>this.model.getMoney(), 3600000);
  }
  
  addCity() {
    const cities = this.model.cities;
    const cityName = this.view.EnterCityInput.value;
    const id = cities.length ? cities.length : 0;
    if (cityName !== "") {
    this.model.addCityToList(cityName, id);
    }
  }

  clearList() {
    this.view.citiesList.innerHTML = "";
    this.model.cities.length = 0;
    this.model.save();
  }

  showEdit(editBtn) {
    const showConteiner = editBtn.nextElementSibling;
    showConteiner.classList.toggle("show");
  }

  editCity(saveEdBtn) {
    const inputSaver = saveEdBtn.previousElementSibling;
    let newCityName = inputSaver.value;
    const newCityLi = saveEdBtn.closest("li");
    const newCityDiv = newCityLi.firstElementChild;
    const wrapper = saveEdBtn.parentElement;
    const cityId = parseInt(saveEdBtn.dataset.id);
    if (newCityName == "") {
      wrapper.classList.toggle("show");
    } else {
      this.model.editList(newCityName, newCityDiv, cityId);
      wrapper.classList.toggle("show");
    }
  }


  deleteCity(deleteBtn) {
    const cityId = parseInt(deleteBtn.dataset.id);
    this.model.deleteFromArr(cityId);
    this.view.citiesList.innerHTML = "";
    this.model.deleteFromList(this.model.cities);
  }


  addHandle() {
    document.addEventListener("DOMContentLoaded", () => this.loadAllContent());

    this.view.addCityBtn.addEventListener("click", () => this.addCity());
    this.view.deleteCityBtn.addEventListener("click", () => this.clearList());

    this.view.citiesList.addEventListener("click", (ev) => {
      const targetEditBtn= ev.target;
      const actionEdit = ev.target.dataset.action;
      if (actionEdit === "edit") {
        this.showEdit(targetEditBtn);
      }  
    });

    this.view.citiesList.addEventListener("click", (ev) => {
      const targetDeleteBtn = ev.target;
      const actionDel = ev.target.dataset.action;
      if (actionDel === "delete") {
        this.deleteCity(targetDeleteBtn);
      }  
    });

    this.view.citiesList.addEventListener("click", (ev) => {
      const saveEditButton = ev.target;
      const actionSave = ev.target.dataset.action;
      if (actionSave === "saveedit") {
        this.editCity(saveEditButton);
      }
    });
  }
}

class Model {
  constructor(view, viewStatic) {
    this.view = view;
    this.viewStatic = viewStatic;

    if(localStorage.getItem("cities") !== null) {
      this.cities = JSON.parse(localStorage.getItem("cities"));
  } else {
      this.cities = [];
    }  
  }

  save() {  
    localStorage.setItem("cities", JSON.stringify(this.cities));
}

  loadList() {
    this.cities.forEach(cityItem => {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityItem.cityName}&appid=61aafb341bc35ca228d34b505939ae6e`)
      .then( response => {      
        if (response.status !== 200) {
        this.view.EnterCityInput.innerHTML = `Error: ${response.status}`;
      } else {
        return response.json();
      }
      })
      .then(response => {
        const temp = parseInt(response.main.temp - 273.15);
        const clouds = response.weather[0].description;
        const windSpeed = parseInt(response.wind.speed);
        const name = response.name;
        this.view.renderCitiesList(name, cityItem.id, temp, clouds, windSpeed);
      });
    });
  }

  getWeather(latitude, longitude) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=61aafb341bc35ca228d34b505939ae6e`)
    .then(response => {
      if (response.status !== 200) {
        this.viewStatic.headerYourCity.innerText = `Error: ${response.status}`;
      } else {
        return response.json();
      }
    })
    .then(response => {
      const temp = parseInt(response.main.temp - 273.15);
      const clouds = response.weather[0].description;
      const windSpeed = parseInt(response.wind.speed);
      const name = response.name;
      this.viewStatic.renderLocation(name, temp, clouds, windSpeed);
    });
  }

  getMoney() {
  fetch(`https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5`)
  .then(response => {
    if (response.status !== 200) {
      this.viewStatic.headerYourCity.innerText = `Error: ${response.status}`;
    } else {
      return response.json();
    }
  })
  .then(response =>{
    const buyUSD = Math.round(parseFloat(response[0].buy)*100) / 100;
    const saleUSD = Math.round(parseFloat(response[0].sale)*100) / 100;
    const buyEUR = Math.round(parseFloat(response[1].buy)*100) / 100;
    const saleEUR = Math.round(parseFloat(response[1].sale)*100) / 100;
    this.viewStatic.renderMoney(buyUSD, saleUSD, buyEUR, saleEUR);
  });
}

  addCityToArr(name, id) {
    const city = {
      id,
      cityName:name
    };
    this.cities.push(city);
    this.save();
  }

  addCityToList(cityName, id) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=61aafb341bc35ca228d34b505939ae6e`)
    .then(response => response.json())
    .then(response => {
      if (response.cod === "404") {
        this.view.EnterCityInput.value = 'City is not found';
        setTimeout(()=> {
          this.view.EnterCityInput.value = "";
        }, 4000);
      } else {
        const temp = parseInt(response.main.temp - 273.15);
        const clouds = response.weather[0].description;
        const windSpeed = parseInt(response.wind.speed);
        const name = response.name;
        this.view.renderCitiesList(name, id, temp, clouds, windSpeed);
        this.addCityToArr(name, id);
      }

      
    });
    this.view.EnterCityInput.value = '';
  }

  deleteFromArr(cityId) {
    const index = this.cities.findIndex((cityItem) => {
      return cityItem.id === cityId;
    });
    this.cities.splice(index, 1);
    this.save();
  }
 
  deleteFromList(arrOfCities) {
    arrOfCities.forEach(cityItem => {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityItem.cityName}&appid=61aafb341bc35ca228d34b505939ae6e`)
      .then( response => {      
        if (response.status !== 200) {
        this.view.EnterCityInput.innerHTML = `Error: ${response.status}`;
      } else {
        return response.json();
      }
      })
      .then(response => {
        const temp = parseInt(response.main.temp - 273.15);
        const clouds = response.weather[0].description;
        const windSpeed = parseInt(response.wind.speed);
        const name = response.name;
        this.view.renderCitiesList(name, cityItem.id, temp, clouds, windSpeed);
      });
    });
  }

  editArr(cityId, cityName) {
    const index = this.cities.findIndex((cityItem) => {
      return cityItem.id === cityId;
    });
    if (cityName !== "") {
    const newCity = {
      id : cityId,
      cityName
    };
    this.cities.splice(index, 1, newCity);
    this.save();
    }
  }

  editList(newCityName, newCityDiv, cityId) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${newCityName}&appid=61aafb341bc35ca228d34b505939ae6e`)
    .then(response => response.json())
    .then(response => {
      if (response.cod ==="404") {
        this.view.EnterCityInput.value = `Some error`;
        setTimeout(()=> {
        this.view.EnterCityInput.value = "";
        }, 4000);
      } else {
        const temp = parseInt(response.main.temp - 273.15);
        const clouds = response.weather[0].description;
        const windSpeed = parseInt(response.wind.speed);
        const name = response.name;
        newCityDiv.innerHTML = `${name} <br>                    
        ${temp}&#8451, Clouds:${clouds}, Wind:${windSpeed}m/s`;
      }

    });
  }
}


  const view = new View();
  const viewStatic = new ViewStatic();
  const model = new Model(view, viewStatic);
  const controller = new Controller(model, view, viewStatic);
  view.initRender();
  viewStatic.initRenderStaticView();
  controller.addHandle();


