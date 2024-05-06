const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillStyle = '#000';
c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: { x: 0, y: 0 },
    imageSrc: './assets/background.png'
});

const shop = new Sprite({
    position: { x: 600, y: 128 },
    imageSrc: './assets/shop.png',
    scale: 2.75,
    frameMax: 6
})

const player = new Fighter({
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    imageSrc: './assets/samuraiMack/Idle.png',
    frameMax: 8,
    scale: 2.5,
    offset: { x: 215, y: 157 },
    sprites: {
        idle: {
            imageSrc: './assets/samuraiMack/Idle.png',
            frameMax: 8
        },
        run: {
            imageSrc: './assets/samuraiMack/Run.png',
            frameMax: 8
        },
        jump: {
            imageSrc: './assets/samuraiMack/Jump.png',
            frameMax: 2
        },
        fall: {
            imageSrc: './assets/samuraiMack/Fall.png',
            frameMax: 2
        },
        attack1: {
            imageSrc: './assets/samuraiMack/Attack1.png',
            frameMax: 6
        },
        takeHit: {
            imageSrc: './assets/samuraiMack/Take Hit - white silhouette.png',
            frameMax: 4
        },
        death: {
            imageSrc: './assets/samuraiMack/Death.png',
            frameMax: 6
        }
    },
    attackBox: {
        offset: { x: 100, y: 50 },
        width: 158,
        height: 50
    }
});

const enemy = new Fighter({
    position: { x: 400, y: 180 },
    velocity: { x: 0, y: 0 },
    color: 'blue',
    imageSrc: './assets/kenji/Idle.png',
    frameMax: 4,
    scale: 2.5,
    offset: { x: 215, y: 167 },
    sprites: {
        idle: {
            imageSrc: './assets/kenji/Idle.png',
            frameMax: 4
        },
        run: {
            imageSrc: './assets/kenji/Run.png',
            frameMax: 8
        },
        jump: {
            imageSrc: './assets/kenji/Jump.png',
            frameMax: 2
        },
        fall: {
            imageSrc: './assets/kenji/Fall.png',
            frameMax: 2
        },
        attack1: {
            imageSrc: './assets/kenji/Attack1.png',
            frameMax: 4
        },
        takeHit: {
            imageSrc: './assets/kenji/Take Hit.png',
            frameMax: 3
        },
        death: {
            imageSrc: './assets/kenji/Death.png',
            frameMax: 7
        }
    },
    attackBox: {
        offset: { x: -170, y: 50 },
        width: 170,
        height: 50
    }
});

const keys = {
    a: { pressed: false },
    d: { pressed: false },
    w: { pressed: false },
    ArrowRight: { pressed: false },
    ArrowLeft: { pressed: false },
    ArrowUp: { pressed: false }
}

let timer = 60;
let timerId;

function animate() {
    window.requestAnimationFrame(animate);

    c.fillStyle = '#000';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();

    c.fillStyle = 'rgba(255, 255, 255, 0.15)';
    c.fillRect(0, 0, canvas.width, canvas.height);

    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
        player.switchSprite('run');
    }
    else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
        player.switchSprite('run');
    }
    else {
        //reset animation
        player.switchSprite('idle');
    }

    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    }
    else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    }
    else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    }
    else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    //detect collision
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        })
        && player.isAttacking
        && player.frameCurrent === 4
    ) {
        player.isAttacking = false;
        enemy.takeHit();
        document.getElementById("enemyHealth").style.width = `${enemy.health}%`;
    }

    if (player.isAttacking && player.frameCurrent === 4) {
        player.isAttacking = false;
    }

    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        })
        && enemy.isAttacking
        && enemy.frameCurrent === 2
    ) {
        enemy.isAttacking = false;
        player.takeHit();
        document.getElementById("playerHealth").style.width = `${player.health}%`;
    }

    if (enemy.isAttacking && enemy.frameCurrent === 2) {
        enemy.isAttacking = false;
    }

    //end game for health less than 0
    if (enemy.health <= 0 || player.health <= 0) {
        showWinner({ player, enemy, timerId });
    }
}

animate();
decreaseTime();

window.addEventListener('keydown', (e) => {
    // e.preventDefault();
    if (!player.dead) {
        switch (e.key) {
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;

            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a';
                break;

            case 'w':
                player.velocity.y = -20;
                break;

            case ' ':
                player.attack();
                break;
        }
    }

    if (!enemy.dead) {
        switch (e.key) {
            //enemy
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break;

            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break;

            case 'ArrowUp':
                enemy.velocity.y = -20;
                break;

            case 'ArrowDown':
                enemy.attack();
                break;
        }
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'd':
            keys.d.pressed = false;
            break;

        case 'a':
            keys.a.pressed = false;
            break;

        //enemy
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }
})