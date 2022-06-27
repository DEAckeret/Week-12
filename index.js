class Pizza {
    constructor(name){
        this.name = name;
        this.toppings = [];
    }

    addToppings(topping){
        this.toppings.push(new Topping(topping));
    }

}

var text = new Pizza();
console.log(text);

class Topping {
    constructor(topping){
        this.topping = topping
    }
}


class PizzaService {
    static url = 'https://crudcrud.com/api/d575a455869848a39fc47b83c0b9e5e8/pizzas';

    static getAllPizzas() {
        return $.get(this.url);
    }

    static getPizza(id){
        return $.get(this.url + `/${id}`);
    }

    static createPizza(pizza){
        return $.ajax({
            url: this.url + pizza,
            dataType: 'json',
            data: JSON.stringify(pizza),
            contentType: 'application/json',
            type: 'POST'
        });
    }

    static updatePizza(pizza) {
        return $.ajax({
            url: this.url +`/${pizza._id}`,
            dataType: 'json',
            data: JSON.stringify(pizza),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deletePizza(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

class Test {

}

class DOMManager {
    static pizzas;

    static getAllPizzas() {
        PizzaService.getAllPizzas().then(pizzas => this.render(pizzas));
    }

    static createPizza(name) {
        PizzaService.createPizza(new Pizza(name))
            .then(() =>{
                return PizzaService.getAllPizzas();
            })
            .then((pizzas) => this.render(pizzas));
    }

    static deletePizza(id) {
        PizzaService.deletePizza(id)
            .then(() => {
                return PizzaService.getAllPizzas();
            })
            .then((pizzas) => this.render(pizzas));
    }

    static addTopping(id){
        for (let pizza of this.pizzas) {
            if (pizza._id == id) {
                pizza.toppings.push(new Topping($(`#${pizza._id}-topping-name`).val()));
                PizzaService.updatePizza(pizza) 
                    .then(() => {
                        return PizzaService.getAllPizzas();
                    })
                    .then((pizzas) => this.render(pizzas));
            }
        }
    }

    static deleteTopping(pizzaId, toppingId) {
        for (let pizza of this.pizzas) {
            if (pizza._id == pizzaId){
                for (let room of pizza.rooms) {
                    if (room._id == toppingId) {
                        pizza.rooms.splice(pizza.rooms.indexOf(room), 1);
                        PizzaService.updatePizza(pizza)
                            .then(() => {
                                return PizzaService.getAllPizzas();
                            })
                            .then((pizzas) => this.render(pizzas));
                    }
                }
            }
        }
    }

    static render(pizzas) {
        this.pizzas = pizzas;
        $('#app').empty();
        for (let pizza of pizzas){
            $('#app').prepend(
                `<div id = "${pizza._id}" class = "card">
                    <div class = "card-header">
                        <h2>${pizza.name}</h2>
                        <button class = "btn btn-danger" onclick = "DOMManager.deletePizza('${pizza._id}')">Delete</button>
                    </div>
                    <div class = "card-body">
                        <div class = "card">
                            <div class = "row">
                                <div class = "col-sm">
                                    <input type = "text" id = "${pizza._id}-topping-name" class = "form-control" placeholder = "Topping Name">
                                </div>
                            </div>
                            <button id = "${pizza._id}-new-topping" onclick = "DOMManager.addTopping('${pizza._id}')" class = "btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div><br>
                `
            );
            for (let topping of pizza.toppings) {
                $(`#${pizza._id}`).find('.card-body').append(
                    `<p>
                        <span id = "name-${topping._id}"><strong>Topping: </strong> ${topping.name}</span>
                        <button class = "btn btn-danger" onclick = "DOMManager.deleteRoom('${pizza._id}', '${topping._id }')">Delete</button>
                    `
                )
            }
        }
    }
}

$('#create-new-pizza').click(() => {
    DOMManager.createPizza($('#new-pizza-name').val());
    $('#new-pizza-name').val('');
})

DOMManager.getAllPizzas();

/*$.get('https://crudcrud.com/api/d575a455869848a39fc47b83c0b9e5e8/unicorns', (data) => {
    console.log(data)
})

$.post('https://crudcrud.com/api/d575a455869848a39fc47b83c0b9e5e8/unicorns') */