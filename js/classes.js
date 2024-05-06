class Sprite {
    constructor({
        position,
        imageSrc,
        scale = 1,
        frameMax = 1,
        offset = { x: 0, y: 0 }
    }) {
        this.width = 50;
        this.height = 150;
        this.position = position;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.frameMax = frameMax;

        this.frameCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 15;

        this.offset = offset;
    }

    draw() {
        c.drawImage(
            this.image,
            //crop arguments
            this.frameCurrent * (this.image.width / this.frameMax),
            0,
            this.image.width / this.frameMax,
            this.image.height,
            //crop arguments end
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            this.image.width / this.frameMax * this.scale,
            this.image.height * this.scale
        );
    }

    animateFrame() {
        this.framesElapsed++;

        //only run logic on certain frames
        if (this.framesElapsed % this.framesHold === 0) {
            this.frameCurrent = (this.frameCurrent + 1) % this.frameMax;
        }
    }

    update() {
        this.draw();
        this.animateFrame();

    }
}

class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1,
        frameMax = 1,
        offset = { x: 0, y: 0 },
        sprites,
        attackBox = {
            offset: {},
            width: undefined,
            height: undefined
        }
    }) {
        super({ imageSrc, scale, frameMax, position, offset });
        this.lastKey;
        this.isAttacking;

        this.width = 50;
        this.height = 150;
        this.health = 100;
        this.dead = false;

        this.velocity = velocity;
        this.color = color;

        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }

        this.sprites = sprites;

        for (const sprite in sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    update() {
        this.draw();

        if (!this.dead) {
            this.animateFrame();
        }

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        //draw attackbox
        // c.fillRect(
        //     this.attackBox.position.x,
        //     this.attackBox.position.y,
        //     this.attackBox.width,
        //     this.attackBox.height
        // );

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0;
            this.position.y = 330; //make char stand on ground
        }
        else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.switchSprite('attack1');
        this.isAttacking = true;
    }

    takeHit() {
        this.health -= 20;

        if (this.health <= 0) {
            this.switchSprite('death')
        }
        else {
            this.switchSprite('takeHit');
        }
    }

    switchSprite(sprite) {
        if (this.image === this.sprites.death.image) {
            if (this.frameCurrent === this.sprites.death.frameMax - 1) {
                this.dead = true;
            }
            return;
        }

        if (
            this.image === this.sprites.attack1.image &&
            this.frameCurrent < this.sprites.attack1.frameMax - 1
        ) return;

        if (
            this.image === this.sprites.takeHit.image &&
            this.frameCurrent < this.sprites.takeHit.frameMax - 1
        ) return;

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.frameMax = this.sprites.idle.frameMax;
                    this.frameCurrent = 0;
                }
                break;

            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.frameMax = this.sprites.run.frameMax;
                    this.frameCurrent = 0;
                }
                break;

            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.frameMax = this.sprites.jump.frameMax;
                    this.frameCurrent = 0;
                }
                break;

            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.frameMax = this.sprites.fall.frameMax;
                    this.frameCurrent = 0;
                }
                break;

            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.frameMax = this.sprites.attack1.frameMax;
                    this.frameCurrent = 0;
                }
                break;

            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.frameMax = this.sprites.takeHit.frameMax;
                    this.frameCurrent = 0;
                }
                break;


            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.frameMax = this.sprites.death.frameMax;
                    this.frameCurrent = 0;
                }
                break;
        }
    }
}