function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function showWinner({ player, enemy, timerId }) {
    clearTimeout(timerId);
    document.getElementById("result").style.display = "flex";

    if (player.health === enemy.health) {
        document.getElementById("result").innerHTML = "TIE";
    }
    else if (player.health > enemy.health) {
        document.getElementById("result").innerHTML = "P1 WINS";
    }
    else {
        document.getElementById("result").innerHTML = "P2 WINS";
    }
}

function decreaseTime() {
    timerId = setTimeout(decreaseTime, 1000);
    if (timer > 0) {
        timer--;
        document.getElementById("timer").innerHTML = timer;
    }

    if (timer === 0) {
        showWinner({ player, enemy, timerId });
    }
}