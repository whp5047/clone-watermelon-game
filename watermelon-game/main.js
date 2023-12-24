import { Bodies, Engine, Render, Runner, World, Body, Events } from "matter-js";
import { FRUITS } from "./fruits";

const engine = Engine.create();
const render = Render.create({
  engine,
  element: document.body,
  options: {
    wireframes: false,
    background: "#F7F4C8",
    width: 620,
    height: 850,
  }
});

const world = engine.world;
const leftWall = Bodies.rectangle(15, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: '#E6B143' }
});

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: '#E6B143' }
});

const ground = Bodies.rectangle(310, 820, 620, 60, {
  isStatic: true,
  render: { fillStyle: '#E6B143' }
});

const topLine = Bodies.rectangle(310, 150, 620, 2, {
  name : 'topLine',
  isStatic: true,
  isSensor :true,
  render: { fillStyle: '#E6B143' }
});

World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
let disableOption = false;
let interval = null;

function makeFruits() {
  const index = Math.floor(Math.random() * 5);
  const item = FRUITS[index];

  const body = Bodies.circle(300, 50, item.radius, {
    index: index,
    isSleeping :true,
    render: {
      sprite: { texture: `${item.name}.png` }
    },
    restitution : 0.2,
  })

  currentBody = body;
  currentFruit = item;

  World.add(world, body);
}


window.onkeyup = (keyUp) =>{
  switch (keyUp.code) {
    case 'KeyA':
    case 'KeyD':
      clearInterval(interval);
      interval = null;
  }
}

window.onkeydown = (keyDown) => {
  if(disableOption) return;

  switch(keyDown.code){
    case 'KeyA':
      if(interval) return;
      interval = setInterval( () => {
        if( currentBody.position.x - currentFruit.radius > 32)
        Body.setPosition(currentBody,{
          x: currentBody.position.x - 1,
          y: currentBody.position.y
        })
      }, 5);
        
      break;
    case 'KeyD':
      if(interval) return;
      interval = setInterval( () => {
        if( currentBody.position.x + currentFruit.radius < 588){}
        Body.setPosition(currentBody,{
          x: currentBody.position.x + 1,
          y: currentBody.position.y
        })
      }, 5);
    
      break;
    case 'KeyS':
      currentBody.isSleeping = false;
      disableOption = true;
      setTimeout( ()=> {
        makeFruits();
        disableOption = false
      }, 1000); 
      break;    
  }
}

Events.on(engine, 'collisionActive', (event) => {
  event.pairs.forEach((collision) => {
    if(collision.bodyA?.index === collision.bodyB?.index ){
      const index = collision.bodyA.index;
      if( index === FRUITS.length - 1 ) return;
      World.remove(world, [collision.bodyA, collision.bodyB]);

      const newItem = FRUITS[index + 1];
      const newBody = Bodies.circle(
        collision.collision.supports[0].x,
        collision.collision.supports[0].y,
        newItem.radius,
        { 
          render : { 
            sprite: { texture: `${newItem.name}.png`} 
          },
          index : index + 1
        }
      );

      World.add(world, newBody);
    }

  })
})

makeFruits();