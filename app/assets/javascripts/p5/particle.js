import utils from "../utils";

class Particle {
    constructor(sk) {
        this.sk = sk
        this.pos = sk.createVector(sk.random(sk.width), sk.random(sk.height));
        this.vel = sk.createVector(0, 0);
        this.acc = sk.createVector(0, 0);
        this.maxspeed = window.PARTICLE_MAX_SPEED;
        this.prevPos = this.pos.copy();
        this.line = []
        this.lineMaxLength = 98
        this.showLine = true

    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxspeed);
        this.pos.add(this.vel);
        this.updateLine(this.pos)
        this.acc.mult(0);
        this.maxspeed = window.PARTICLE_MAX_SPEED
    }

    follow(sk, cols, scl, vectors) {
        var x = sk.floor(this.pos.x / scl);
        var y = sk.floor(this.pos.y / scl);
        var index = x + y * cols;
        var force = vectors[index];
        this.applyForce(force);
    }

    applyForce(force) {
        this.acc.add(force);
    }

    show(sk) {

        const bodyColor = utils.hexToRgb(window.BODY_COLOR)
        
        if (this.showLine) {
            const curveGroups = []
            sk.beginShape();
            for (let i = 0; i < this.line.length - 3; i++) {
                if (i % 4 === 0) {
                    const curveGroup = this.line.slice(i, i + 4);
                    if (curveGroup.map((point) => point.skip).includes(true)) {
                        continue;
                    }
                    sk.stroke(`rgba(${bodyColor.r}, ${bodyColor.g}, ${bodyColor.b}, 0.1)`);
                    sk.strokeWeight(1);
                    // sk.stroke(0, 255, 0);
                    sk.curve(
                        curveGroup[0].x, curveGroup[0].y,
                        curveGroup[1].x, curveGroup[1].y,
                        curveGroup[2].x, curveGroup[2].y,
                        curveGroup[3].x, curveGroup[3].y
                    );
                    sk.curve(
                        curveGroup[0].x, curveGroup[0].y,
                        curveGroup[0].x, curveGroup[0].y,
                        curveGroup[1].x, curveGroup[1].y,
                        curveGroup[2].x, curveGroup[2].y,
                    );
    
                    sk.curve(
                        curveGroup[1].x, curveGroup[1].y,
                        curveGroup[2].x, curveGroup[2].y,
                        curveGroup[3].x, curveGroup[3].y,
                        curveGroup[3].x, curveGroup[3].y
                    );
    
                    if (this.line[i-1]) {
                        sk.line(this.line[i-1].x, this.line[i-1].y, curveGroup[0].x, curveGroup[0].y)
                    }
    
                    // if(!this.line[i].skip || !this.line[0].skip) {
                    //     sk.line(sk.width / 2, sk.height / 2, this.line[i].x, this.line[i].y)
                    // }
    
    
                }
            }
            sk.endShape();
            
        } else {
            sk.stroke(`rgba(${bodyColor.r}, ${bodyColor.g}, ${bodyColor.b}, 0.5)`);
            sk.strokeWeight(1);
            sk.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
        }

        this.updatePrev();
    }



    updatePrev() {
        this.prevPos.x = this.pos.x;
        this.prevPos.y = this.pos.y;
    }

    edges(width, height) {
        if (this.pos.x > width) {
            this.pos.x = 0;
            this.updatePrev();
            this.updateLine(this.pos, true)
        }
        if (this.pos.x < 0) {
            this.pos.x = width;
            this.updatePrev();
            this.updateLine(this.pos, true)
        }
        if (this.pos.y > height) {
            this.pos.y = 0;
            this.updatePrev();
            this.updateLine(this.pos, true)
        }
        if (this.pos.y < 0) {
            this.pos.y = height;
            this.updatePrev();
            this.updateLine(this.pos, true)
        }
    }

    updateLine(pos, skip = false) {
        this.lifeSpan -= 1
        this.line.push({ x: this.pos.x, y: this.pos.y, skip: skip })
        if (this.line.length > this.lineMaxLength) {
            this.line.shift()
        }
    }
}

export default Particle

