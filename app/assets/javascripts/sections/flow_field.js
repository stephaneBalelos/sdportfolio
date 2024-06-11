import p5 from "p5";
import Particle from "../p5/particle";
import utils from "../utils";
import initController from "../flow_field_controller";
const Section = {

  load: (section) => {
    const canvas = section.querySelector('canvas')
    let MODE = "random-noise" // "attractor-center" | "random-noise-static"
    let PARTICLES_COUNT = 100

    window.BODY_COLOR = getComputedStyle(document.body).getPropertyValue('--body-color')
    window.BG_COLOR = getComputedStyle(document.body).getPropertyValue('--body-bg')

    window.ParticlesGrowLimit = 196
    window.ParticleLifespan = 200
    window.PARTICLE_MAX_SPEED = 4


    const frameRateEls = Array.from(document.querySelectorAll("[fr-viewer]"))
    window.FRAME_RATE = new Proxy({fr: 0}, {
      set: function(obj, prop, value) {
        obj[prop] = value;
        for (var i = 0; i < frameRateEls.length; i++) {
          frameRateEls[i].innerHTML = value
        }
        return true;
      }
    })


    window.FLOWFIELD_MODE = "vortex" // "random-noise" | "attractor" | "vortex" | "random-noise-static
    window.FLOWFIELD_SCALE = 10
    window.SHOW_FIELD_VECTORS = false
    window.PARTICLES_COUNT = 50

    // Mode Params Random Noise
    window.RANDOM_NOISE_INCREMENT = 0.2
    window.RANDOM_NOISE_ZOFF_INCREMENT = 0.00003

    // Mode Params Attractor
    window.ATTRACTOR_CENTER = "center" // "mouse-follow" | "center" | "mouse-click"
    window.ATTRACTOR_RADIUS = 150

    // Mode Params Vortex
    window.VORTEX_CENTER = "center" // "mouse-follow" | "center" | "mouse-click"
    window.VORTEX_ANGLE = 45
    window.VORTEX_RADIUS = 0
    
  
    
    
    if (canvas) {
      
      var inc = window.RANDOM_NOISE_INCREMENT ? window.RANDOM_NOISE_INCREMENT : 0.1;
      var scl = window.FLOWFIELD_SCALE ? window.FLOWFIELD_SCALE : 10;
      var cols, rows;

      var zoff = 0;

      var fr;

      var particles = [];

      var flowfield;

      var canvasEl;

      var WIDTH;
      var HEIGHT;

      var lastClickPosition;
      

      const getSketchFunction = (el) => {
        canvasEl = el
        WIDTH = canvasEl.getBoundingClientRect().width
        HEIGHT = canvasEl.getBoundingClientRect().height

        return sketchFunction
      }

      const sketchFunction = (sk) => {
        sk.setup = () => {
          const canvas = sk.createCanvas(WIDTH, HEIGHT, 'WEBGL', canvasEl);

          for (var i = 0; i < PARTICLES_COUNT; i++) {
            particles[i] = new Particle(sk);
          }
          sk.background(window.BG_COLOR);
          lastClickPosition = sk.createVector(WIDTH / 2, HEIGHT / 2)

          document.body.addEventListener('click', (e) => {
            if (window.ATTRACTOR_CENTER === "mouse-click" || window.VORTEX_CENTER === "mouse-click") {
              lastClickPosition = sk.createVector(e.clientX, e.clientY)
            }
          })
        }

        sk.draw = () => {

          // Handle Scale Changes
          scl = window.FLOWFIELD_SCALE ? window.FLOWFIELD_SCALE : 10;
          PARTICLES_COUNT = window.PARTICLES_COUNT ? window.PARTICLES_COUNT : 100
          // Handle Particles Count Changes
          if (particles.length < PARTICLES_COUNT) {
            for (var i = 0; i < PARTICLES_COUNT - particles.length; i++) {
              particles.push(new Particle(sk));
            }
          } else if (particles.length > PARTICLES_COUNT) {
            particles = particles.slice(0, PARTICLES_COUNT)
          }
          cols = sk.floor(sk.width / scl);
          rows = sk.floor(sk.height / scl);
          flowfield = new Array(cols * rows);


          
          sk.background(window.BG_COLOR);
          // sk.strokeWeight(50);
          var center = sk.createVector(WIDTH / 2, HEIGHT / 2)
          // sk.point(center);
          if (window.FLOWFIELD_MODE) {
            MODE = window.FLOWFIELD_MODE
          }
          var yoff = 0;
          for (var y = 0; y < rows; y++) {
            var xoff = 0;
            for (var x = 0; x < cols; x++) {
              var index = x + y * cols;
              var angle;
              var v;
              
              switch (MODE) {
                case "random-noise":
                  angle = sk.noise(xoff, yoff, zoff) * sk.TWO_PI * 4;
                  v = p5.Vector.fromAngle(angle);
                  break;
                case "attractor":
                  let attractorCenter;
                  switch (window.ATTRACTOR_CENTER) {
                    case "center":
                      attractorCenter = center
                      break;
                    case "mouse-follow":
                      attractorCenter = sk.createVector(sk.mouseX, sk.mouseY)
                      break;
                    case "mouse-click":
                      attractorCenter = lastClickPosition
                      break;
                    default:
                      attractorCenter = center
                  }
                  v = sk.createVector(x * scl, y * scl).sub(attractorCenter).mult(-1);
                  if(v.mag() < window.ATTRACTOR_RADIUS) {
                    v = v.mult(0)
                  }
                  break;
                case "vortex":
                  let vortexCenter
                  switch (window.VORTEX_CENTER) {
                    case "center":
                      vortexCenter = center
                      break;
                    case "mouse-follow":
                      vortexCenter = sk.createVector(sk.mouseX, sk.mouseY)
                      break;
                    case "mouse-click":
                      vortexCenter = lastClickPosition
                      break;
                    default:
                      vortexCenter = center
                  }
                  
                  v = sk.createVector(x * scl, y * scl).sub(vortexCenter).mult(-1);
                  
                  v = sk.createVector(x * scl, y * scl).sub(vortexCenter).mult(-1);
                  const xc = sk.lerp(sk.mouseX, sk.width, 0)
                  const yc = sk.lerp(sk.mouseY, sk.height, 0)

                  const a = window.VORTEX_ANGLE ? window.VORTEX_ANGLE : 45
                  sk.angleMode(sk.DEGREES)
                  v = v.rotate(a)
                  sk.angleMode(sk.RADIANS)
                  
                  if(v.mag() < window.VORTEX_RADIUS) {
                    v = v.mult(0)
                  }
                  break;
                case "random-noise-static":
                  angle = sk.noise(xoff, yoff, zoff) * sk.TWO_PI * 4;
                  if (!flowfield[index]) {
                    v = p5.Vector.fromAngle(angle);
                  } else{
                    v = flowfield[index]
                  }
                  break;
              
                default:
                  angle = sk.noise(sk.random(cols * inc), sk.random(rows * inc), sk.random(0.0003 * cols)) * sk.TWO_PI * 4;
                  v = p5.Vector.fromAngle(angle);
                  break;
              }

              v.setMag(1);
              flowfield[index] = v;
              xoff += window.RANDOM_NOISE_INCREMENT ? window.RANDOM_NOISE_INCREMENT : 0.1;
              
              if (window.SHOW_FIELD_VECTORS) {
                const offset = scl / 2;
                const bodyColor = utils.hexToRgb(window.BODY_COLOR)
                sk.stroke(`rgba(${bodyColor.r}, ${bodyColor.g}, ${bodyColor.b}, 0.3)`);
                sk.strokeWeight(1);
                sk.push();
                sk.translate(x * scl + offset, y * scl + offset);
                sk.rotate(v.heading());
                sk.line(0, 0, scl * v.mag(), 0);
                sk.fill(`rgba(${bodyColor.r}, ${bodyColor.g}, ${bodyColor.b}, 0.3)`);
                if(v.mag() > 0) {
                  sk.triangle(scl, 0, scl - scl/8, scl /8, scl - scl/8, scl / -8)
                } else {
                  sk.point(0, 0)
                }
                sk.pop();
              } 
            }
            yoff += window.RANDOM_NOISE_INCREMENT ? window.RANDOM_NOISE_INCREMENT : 0.1;

            zoff += window.RANDOM_NOISE_ZOFF_INCREMENT ? window.RANDOM_NOISE_ZOFF_INCREMENT : 0.0003;
          }

          if (!window.SHOW_FIELD_VECTORS) {
            for (var i = 0; i < particles.length; i++) {
              particles[i].follow(sk, cols, scl, flowfield);
              particles[i].update();
              particles[i].edges(sk.width, sk.height);
  
              particles[i].show(sk);
            }
          }


          // if (sk.frameCount % 100 == 0) {
          //   particles.shift();
          //   particles.push(new Particle(sk));
          // }

          // fr.html(sk.floor(sk.frameRate()));
          window.FRAME_RATE.fr = sk.floor(sk.frameRate());
        }

        sk.windowResized = () => {
          const width = window.innerWidth;
          const height = window.innerHeight;
          sk.resizeCanvas(width, height);
          WIDTH = width
          HEIGHT = height
        }
      }

      const P5 = new p5(getSketchFunction(canvas));

      initController()
    }

  },

  // unload: (section) => {
  // },

  // select: (section) => {
  // },

  // deselect: (section) => {
  // },

  // reorder: (section) => {
  // },

  // blockSelect: (section, block) => {
  // },

  // blockDeselect: (section, block) => {
  // }

}

export default Section;
