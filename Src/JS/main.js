// замикання 7.09
let computecounter = 0;
function memorize(fn) {
    const cache = {};
    return function (...args) {
        const argsKey = args.join('.');
        if (cache[argsKey] !== undefined) {
            return cache[argsKey];
        } else {
            const result = fn(...args);
            cache[argsKey] = result;
            return result;
        }
    };
}
function compute(a, b) {
    computecounter++;
    console.log(computecounter);
    return Math.floor(Math.random() * 1_000_000) + a + b;
}
const computeMemorized = memorize(compute);
console.log(computeMemorized(1, 1));
console.log(computeMemorized(1, 2));
console.log(computeMemorized(1, 2));
console.log(computeMemorized(1, 2));
console.log(computeMemorized(1, 1));
console.log(computeMemorized(1, 1));


// класи 14.09
// 1.
function Task(id, title, description) {
    this.id = id;
    this.title = title;
    this.description = description;
}
Task.prototype.toString = function () {
    return `${this.id} - ${this.title} - ${this.description}`;
};
function BlockedTask(id, title, description) {
    Task.call(Task, id, title, description);
}
BlockedTask.prototype = Object.create(Task.prototype);
BlockedTask.prototype.constructor = BlockedTask;
BlockedTask.prototype.toString = function () {
    return `BLOCKED: ${Task.prototype.toString.call(this)}`;
};
function DeadlineTask(id, title, description, deadline) {
    Task.call(this, id, title, description);
    this.deadline = deadline;
}
DeadlineTask.prototype = Object.create(Task.prototype);
DeadlineTask.prototype.constructor = DeadlineTask;
DeadlineTask.prototype.toString = function () {
    const now = new Date();
    if (this.deadline < now) {
        return `DEADLINE PASSED - ${Task.prototype.toString.call(this)} - ${this.deadline}`;
    } else {
        return `${Task.prototype.toString.call(this)} - ${this.deadline}`;
    }
};
function TaskPrinter(tasks) {
    this.tasks = tasks;
}
TaskPrinter.prototype.print = function () {
    for (const task of this.tasks) {
        console.log(task.toString());
    }
};
const t = [
    new Task(1, 'T 1', 'D 1'),
    new BlockedTask(2, 'T 2', 'D 2'),
    new DeadlineTask(3, 'T 3', 'D 3', new Date('2023-09-26')),
    new DeadlineTask(4, 'T 4', 'D 4', new Date('2023-09-25')),
];
const taskPrinter = new TaskPrinter(t);
taskPrinter.print();

// 2.
class MyArray extends Array {
    constructor(array) {
        super(...array);
    }
    closest(data) {
        let mDif = Math.abs(this[0] - data);
        let closestIndex = 0;
        for (let i = 1; i < this.length; i++) {
            const dif = Math.abs(this[i] - data);
            if (dif < mDif) {
                mDif = dif;
                closestIndex = i;
            }
        }
        return closestIndex;
    }
}
const array = [1, 2, 3, 5, 8, 13, 21, 34];
const myArray = new MyArray(array);
console.log(myArray.closest(5)) // 3
console.log(myArray.closest(10)) // 4
console.log(myArray.closest(100500)) // 7
console.log(myArray.closest(-1)) // 0 


// Статичні класи 21.09
// 1
function Distance(value, unit) {
    if (unit == 'm' || 'km' || 'inch' || 'feet' || 'yard' || 'mile') {
        this.value = value;
        this.unit = unit;
    }
    else {
        throw new Error('Not a unit');
    }
}
Distance.prototype.converter = function (newUnit) {
    let tempUnit = this.unit;
    let temlValue=this.value;
    if (newUnit == 'm' || 'km' || 'inch' || 'feet' || 'yard' || 'mile') {
        if (tempUnit === newUnit) {
            return temlValue;
        }
        else {
            const units = {
                'm': 1,
                'km': 1000,
                'inch': 0.0254,
                'feet': 0.3048,
                'yard': 0.9144,
                'mile': 1609.34
            };
            const rez = temlValue * (units[newUnit] / units[tempUnit]);
            console.log(rez);
            return rez;
        }
    }
    else {
        throw new Error('Invalid unit');
    }

};
Distance.prototype.add = function (distance) {
    let tempUnit = this.unit;
    let temlValue=this.value
    if (distance instanceof Distance) {
        const converted = distance.converter(tempUnit);
        temlValue += converted;
    } else {
        throw new Error('Not a distance object');
    }
    this.value=temlValue;
};
Distance.prototype.toString = function (unit) {
    if (unit == 'm' || 'km' || 'inch' || 'feet' || 'yard' || 'mile') {
        const convert = this.converter(unit);
        return `${convert}${unit}`;
    }
    else {
        throw new Error('Not a unit');
    }
};
const distance = new Distance(1, Distance.METER);
distance.add(new Distance(1, Distance.KILOMETER));
distance.add(new Distance(1, Distance.INCHE));
distance.add(new Distance(1, Distance.FEET));
distance.add(new Distance(1, Distance.YARD));
distance.add(new Distance(1, Distance.MILE));
console.log(distance.toString(Distance.METER)); // Має вивести "2612 m"