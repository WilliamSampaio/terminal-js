#!/usr/bin/env node
"use strict";
class Snake {
    constructor() {
        this.direction = { x: 2, y: 0 };
        this.body = [
            { x: 2, y: 2 },
            { x: 2, y: 2 },
            { x: 2, y: 2 }
        ];
    }
}
class Mouse {
    constructor() {
        this.position = { x: 7, y: 7 };
        this.collision = false;
    }
    random(gameAreaWidth, gameAreaHeight, snake) {
        do {
            this.collision = false;
            const randomPosition = {
                x: Math.random() * ((gameAreaWidth - 1) - 1) + 1,
                y: Math.random() * ((gameAreaHeight - 1) - 1) + 1
            };
            if (randomPosition.x % 2 === 1) {
                randomPosition.x -= 1;
            }
            for (let i = 0; i < snake.body.length; i++) {
                if (snake.body[i].x == randomPosition.x && snake.body[i].y == randomPosition.y) {
                    this.collision = true;
                    break;
                }
            }
            if (!this.collision) {
                this.position = randomPosition;
                break;
            }
        } while (true);
    }
}
const TERM = require('terminal-kit').terminal;
TERM.clear();
TERM.hideCursor(true);
const snake = new Snake();
const mouse = new Mouse();
mouse.random(TERM.width, TERM.height, snake);
function drawGameArea() {
    TERM.moveTo(1, 1);
    TERM.red("┏");
    for (let x = 2; x < (TERM.width); x++) {
        TERM.moveTo(x, 1);
        TERM.red("━");
    }
    TERM.moveTo(TERM.width, 1);
    TERM.red("┓");
    const label = " [ TypeSnake ] ";
    TERM.moveTo((TERM.width - label.length) / 2, 1);
    TERM.bold.cyan(label);
    for (let y = 2; y < (TERM.height); y++) {
        TERM.moveTo(1, y);
        TERM.red("┃");
        TERM.moveTo(TERM.width, y);
        TERM.red("┃");
    }
    TERM.moveTo(1, TERM.height);
    TERM.red("┗");
    for (let x = 2; x < (TERM.width); x++) {
        TERM.moveTo(x, TERM.height);
        TERM.red("━");
    }
    TERM.moveTo(TERM.width, TERM.height);
    TERM.red("┛");
}
function terminate() {
    TERM.grabInput(false);
    setTimeout(function () {
        process.exit();
    }, 100);
}
drawGameArea();
TERM.on('key', function (name, matches, data) {
    // console.log("'key' event:", name, data);
    if (name === 'CTRL_C') {
        terminate();
    }
    switch (name) {
        case 'w':
        case 'W':
        case 'UP':
            snake.direction.x = 0;
            snake.direction.y = -1;
            break;
        case 's':
        case 'S':
        case 'DOWN':
            snake.direction.x = 0;
            snake.direction.y = 1;
            break;
        case 'a':
        case 'A':
        case 'LEFT':
            snake.direction.x = -2;
            snake.direction.y = 0;
            break;
        case 'd':
        case 'D':
        case 'RIGHT':
            snake.direction.x = 2;
            snake.direction.y = 0;
            break;
    }
});
TERM.grabInput();
function loop() {
    // update snake
    TERM.moveTo(snake.body[snake.body.length - 1].x, snake.body[snake.body.length - 1].y);
    TERM.yellow(" ");
    snake.body.pop();
    snake.body.unshift({
        x: snake.body[0].x + snake.direction.x,
        y: snake.body[0].y + snake.direction.y
    });
    // teletransport the snake
    if (snake.body[0].x <= 1) {
        snake.body[0].x = TERM.width - 2;
    }
    if (snake.body[0].x >= TERM.width) {
        snake.body[0].x = 2;
    }
    if (snake.body[0].y == 1) {
        snake.body[0].y = TERM.height - 1;
    }
    if (snake.body[0].y == TERM.height) {
        snake.body[0].y = 2;
    }
    // check if the snake caught the mouse
    if (snake.body[0].x == mouse.position.x && snake.body[0].y == mouse.position.y) {
        terminate();
        snake.body.push(snake.body[snake.body.length - 1]);
    }
    TERM.moveTo(mouse.position.x, mouse.position.y);
    TERM.cyan("🟡");
    TERM.moveTo(snake.body[0].x, snake.body[0].y);
    TERM.yellow("🟩");
    TERM.moveTo(10, TERM.height);
    TERM.green("Snake Head: (%d, %d) | Mouse Pos: (%d, %d)", snake.body[0].x, snake.body[0].y, mouse.position.x, mouse.position.y);
}
setInterval(loop, 150);
