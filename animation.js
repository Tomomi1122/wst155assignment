const canvas = document.querySelector('canvas');
canvas.setAttribute('style', 'background-color:#000');

canvas.width = 800;
canvas.height = 800;

const ctx = canvas.getContext('2d');

const gravity = 0.98;
const friction = 0.997;

let mousePos = { x: 0, y: 0 };
let isClicked = false;

window.addEventListener('mousedown', (e) => {
  isClicked = true;
});
window.addEventListener('mouseup', (e) => {
  isClicked = false;
});

canvas.addEventListener('mousemove', (e) => {
  mousePos.x = e.offsetX;
  mousePos.y = e.offsetY;
});

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  static getDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  }
}

class Circle {
  constructor(posX, posY, velX, velY, r, color) {
    this.pos = new Vector(posX, posY);
    this.vel = new Vector(velX, velY);
    this.r = r;
    this.color = color;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  update() {
    if (
      this.pos.x + this.r > mousePos.x &&
      this.pos.x - this.r < mousePos.x &&
      this.pos.y + this.r > mousePos.y &&
      this.pos.y - this.r < mousePos.y &&
      isClicked
    ) {
      this.pos.x = mousePos.x;
      this.pos.y = mousePos.y;
    } else {
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
      this.vel.x *= friction;
      this.vel.y *= friction;
      this.vel.y +=
        0.0005 * Vector.getDistance(0, this.pos.y + this.r, 0, canvas.height);
    }

    if (this.pos.x > canvas.width - this.r) {
      this.pos.x = canvas.width - this.r;
      this.vel.x *= -1;
    }
    if (this.pos.x < this.r) {
      this.pos.x = this.r;
      this.vel.x *= -1;
    }
    if (this.pos.y > canvas.height - this.r) {
      this.pos.y = canvas.height - this.r;
      this.vel.y *= -1;
    }
    if (this.pos.y < this.r) {
      this.pos.y = this.r;
      this.vel.y *= -1;
    }

    this.draw();
  }
}

let circles = [];

let createCircles = (num) => {
  for (let i = 0; i < num; i++) {
    let posX = Math.random() * canvas.width;
    let posY = Math.random() * canvas.height;
    let velX = Math.random() * 5;
    let velY = Math.random() * 5;
    let r = Math.random() * 70;
    let red = Math.random() * 255;
    let green = Math.random() * 155;
    let blue = Math.random() * 150;
    let color = `rgb(${red},${green},${blue})`;
    circles.push(new Circle(posX, posY, velX, velY, r, color));
  }
};

createCircles(150);

let lastTime = 0;

let animate = (time) => {
  let fps = 1000/ (time - lastTime);
  console.log(fps);
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  circles.forEach((circle) => {
    circle.update();
  });
  ctx.fillStyle = '#ff1a75';
  ctx.font = '50px Bona Nova';
  ctx.fillText(`x: ${mousePos.x}, y:${mousePos.y}`, 300, 50);
  lastTime = time;
  requestAnimationFrame((time) => {
    animate(time);
  });
};

animate();
