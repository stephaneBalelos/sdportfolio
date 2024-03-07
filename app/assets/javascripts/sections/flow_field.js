import p5 from "p5";
import Particle from "../p5/particle";
const Section = {

  load: (section) => {
    const canvas = section.querySelector('canvas')

    
    
    if (canvas) {
      
      var inc = 0.1;
      var scl = 10;
      var cols, rows;

      var zoff = 0;

      var fr;

      var particles = [];

      var flowfield;

      var canvasEl;

      var WIDTH;
      var HEIGHT;
      

      canvas.addEventListener('click', () => {
        scl = scl == 10 ? 150 : 10
      })

      const getSketchFunction = (el) => {
        canvasEl = el
        WIDTH = canvasEl.getBoundingClientRect().width
        HEIGHT = canvasEl.getBoundingClientRect().height

        return sketchFunction
      }

      const sketchFunction = (sk) => {
        console.log(scl)
        sk.setup = () => {
          sk.createCanvas(WIDTH, HEIGHT, 'WEBGL', canvasEl);
          cols = sk.floor(sk.width / scl);
          rows = sk.floor(sk.height / scl);
          fr = sk.createP('');

          flowfield = new Array(cols * rows);

          for (var i = 0; i < 500; i++) {
            particles[i] = new Particle(sk);
          }
          sk.background(25);
        }

        sk.draw = () => {
          sk.background(25)
          var yoff = 0;
          for (var y = 0; y < rows; y++) {
            var xoff = 0;
            for (var x = 0; x < cols; x++) {
              var index = x + y * cols;
              var angle = sk.noise(xoff, yoff, zoff) * sk.TWO_PI * 4;
              var v = p5.Vector.fromAngle(angle);
              v.setMag(1);
              flowfield[index] = v;
              xoff += inc;
              sk.stroke(0, 50);
              // sk.push();
              // sk.translate(x * scl, y * scl);
              // sk.rotate(v.heading());
              // sk.strokeWeight(1);
              // sk.line(0, 0, scl, 0);
              // sk.pop();
            }
            yoff += inc;

            zoff += 0.0003;
          }

          for (var i = 0; i < particles.length; i++) {
            particles[i].follow(sk, cols, scl, flowfield);
            particles[i].update();
            particles[i].edges(sk.width, sk.height);
            particles[i].show(sk);
          }

          fr.html(sk.floor(sk.frameRate()));
        }
      }

      const P5 = new p5(getSketchFunction(canvas));



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