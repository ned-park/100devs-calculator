class Button {
  constructor(name, value, parent=null) {
    this.name = name
    this.value = value
    this.parent = parent
  }

  draw() {
    return new Promise(resolve => {
      resolve(document.querySelector('#interface').innerHTML += `<a href="#" class="button" id="${this.name}">${this.value}</a>`)
    })
  }

  giveEventListener() {
    document.querySelector(`#${this.name}`).addEventListener('click', (e) => this.parent.addToEquation(e.target.innerText))
  }
}

class Calculator {
  #equation;
  #reset;
  #buttons;
  
  constructor() {
    this.#equation = []
    this.#reset = true
    this.#buttons = [
      new Button('seven', 7, this),
      new Button('eight', 8, this),
      new Button('nine', 9, this),
      new Button('divide', '/', this),
      new Button('four', 4, this),
      new Button('five', 5, this),
      new Button('six', 6, this),
      new Button('multiply', 'x', this),
      new Button('one', 1, this),
      new Button('two', 2, this),
      new Button('three', 3, this),
      new Button('add', '+', this),
      new Button('zero', 0, this),
      new Button('point', '.', this),
      new Button('equals', '=', this),
      new Button('subtract', '-', this)
    ]

    this.#buttons.forEach(b => {
      b.draw()
      .then(res => {
        b.giveEventListener()
      })  
    })
  }

  evaluate() {
    //equation must be of odd length and alternate num, op
    let valid = this.#equation.length % 2 !== 0 && this.#equation.reduce((flag, c, i) => i % 2 === 0? flag && !isNaN(Number(c)): flag && /[+x/-]/.test(c), true) 
    if (!valid) { 
      this.reset = true
      this.#equation = ['Invalid expression']
      return
    }
    
    //maintain proper order of operations
    for (let i = 1; i < this.#equation.length - 1; i++) {
      if (this.#equation[i] === 'x' || this.#equation[i] === '/') {
        this.#equation[i] === 'x'
          ? this.#equation.splice(i-1, 3, Number(this.#equation[i-1]) * Number(this.#equation [i+1]))
          : this.#equation.splice(i-1, 3, Number(this.#equation[i-1]) / Number(this.#equation [i+1]))
        --i;
      }
    }
  
    for (let i = 1; i < this.#equation.length - 1; i++) {
      if (this.#equation[i] === '+' || this.#equation[i] === '-') {
        this.#equation[i] === '+'
          ? this.#equation.splice(i-1, 3, Number(this.#equation[i-1]) + Number(this.#equation [i+1]))
          : this.#equation.splice(i-1, 3, Number(this.#equation[i-1]) - Number(this.#equation [i+1]))
        --i
      }
    }
  
    //end of current calculation
    this.#reset = true
    this.display()
  }

  addToEquation(value) {
    if(this.#reset) {
      this.#reset = false
      this.#equation = []
    }

    switch(value) {
      case '+':
      case '-':
      case 'x':
      case '/':
        this.#equation.push(value)
        break;
      case '=': calc.evaluate()
        break;
      default: //digits
        if (/\d|[.]/.test(this.#equation[this.#equation.length-1]) || /-/.test(this.#equation[this.#equation.length-1]) && this.#equation.length % 2 === 1) {
          this.#equation[this.#equation.length-1] += value 
        } else {
          this.#equation.push(value)
        }
        break;
    }
    this.display()
  }

  display() {
    document.querySelector('#display').innerText = calc.getEquationString()
  }

  getEquationString() {
    return this.#equation.join(' ')
  }
}

let calc = new Calculator()


