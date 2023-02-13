// Flappy info
let flappy = document.createElement('img');
let topDistance = flappy.offsetTop;
let leftDistance = flappy.offsetLeft;

const beginButton = document.getElementById('beginButton');
let body = document.getElementById('body');
let scoreDiv = document.getElementsByClassName('score');

// Pipes
let pipeNumber = 1;
let pipes = document.getElementsByClassName("pipe");
pipes = Array.from(pipes);
const pipeWidth = "60px";
const pipeColor = "green";
const topPipeHeight = "200px";
const bottomPipeHeight = "100px";
let pastPipes = [];

//Intervals
let flappyFallInterval;
let pipeGenerationInterval;
let pipeMovementInterval;



function test() {
    startGame();
    beginButton.classList.add('hidden');

}

beginButton.addEventListener('click', () => {
    startGame();
    beginButton.classList.add('hidden');
})

document.addEventListener('keydown', (keypressed) => {
    if (keypressed.code === 'ArrowUp') {
        topDistance = topDistance - 50;
        flappy.style.top = topDistance + 'px';
    }
})

let on = true;

document.addEventListener('keydown', (keypressed) => {
    if (keypressed.code === 'Space') {
        if (on) {
            clearInterval(flappyFallInterval);
            clearInterval(pipeGenerationInterval);
            clearInterval(pipeMovementInterval);
            on = false;
        } else {
            flappyFall(flappy);
            pipeGeneration();
            pipeMovement();
            on = true;
        }
    }
})

function createFlappy(flappy) {
    flappy.setAttribute('src', 'img/blue_flappy_bird.png');
    flappy.setAttribute('id', 'flappy');
    body.appendChild(flappy);
}

function startGame() {
    createFlappy(flappy);
    flappyFall(flappy);
    pipeGeneration();
    pipeMovement();
}

function flappyFall(flappy) {
    flappyFallInterval = setInterval(() => {
        topDistance = topDistance + 3;
        leftDistance = flappy.offsetLeft;
        flappy.style.top = topDistance + 'px';
    }, 20);
}

const passageSize = 150;

function pipeGeneration() {
    pipeGenerationInterval = setInterval(() => {
        const topPipe = document.createElement("div");
        topPipe.setAttribute("id", pipeNumber);
        topPipe.setAttribute("class", "pipe");
        topPipe.classList.add('topPipe');
        topPipe.style.width = pipeWidth;
        topPipe.style.position = "absolute";
        topPipe.style.top = 0;
        topPipe.style.right = 0;
        topPipe.style.backgroundColor = pipeColor;
        
    
        const bottomPipe = document.createElement("div");
        bottomPipe.setAttribute("id", pipeNumber);
        bottomPipe.setAttribute("class", "pipe");
        bottomPipe.classList.add('bottomPipe');
        bottomPipe.style.width = pipeWidth;
        bottomPipe.style.position = "absolute";
        bottomPipe.style.bottom = 0;
        bottomPipe.style.right = 0;
        bottomPipe.style.backgroundColor = pipeColor;
        

        // random pipe height
        topPipe.style.height = getRandomNumber(window.innerHeight / 5, 4 * window.innerHeight / 5 - passageSize) + "px";
        bottomPipe.style.height = window.innerHeight - (parseInt(topPipe.style.height.slice(0, -2)) + passageSize) + "px";

        flappy.after(topPipe);
        flappy.after(bottomPipe);

        pipeNumber += 1;
        pipes = document.getElementsByClassName("pipe");
        pipes = Array.from(pipes);
    }, 2000); // pipe are generated every 2 seconds
}

function pipeGeneration1() {
    const topPipe = document.createElement("div");
    topPipe.setAttribute("id", pipeNumber);
    topPipe.setAttribute("class", "pipe");
    topPipe.style.width = pipeWidth;
    topPipe.style.position = "absolute";
    topPipe.style.top = 0;
    topPipe.style.right = 0;
    topPipe.style.backgroundColor = pipeColor;
    
    const bottomPipe = document.createElement("div");
    bottomPipe.setAttribute("class", "pipe");
    bottomPipe.style.width = pipeWidth;
    bottomPipe.style.position = "absolute";
    bottomPipe.style.bottom = 0;
    bottomPipe.style.right = 0;
    bottomPipe.style.backgroundColor = pipeColor;

    flappy.after(topPipe);
    flappy.after(bottomPipe);
}

function getRandomNumber(a, b) {
    return (Math.random() * (b - a)) + a;
}

let nearTopPipe = [];
let nearBottomPipe = [];

function pipeMovement() {
    pipeMovementInterval = setInterval(() => {

        

        pipes = document.getElementsByClassName("pipe");
        topPipes = Array.from(document.getElementsByClassName("topPipe"));
        bottomPipes = Array.from(document.getElementsByClassName("bottomPipe"));
        pipes = Array.from(pipes);
        pipes.map((pipe) => {
            pipe.style.right = parseInt(pipe.style.right.slice(0, -2)) + 10 + "px";
            if ((pipe.offsetLeft + parseInt(pipeWidth.slice(0, -2))) < leftDistance + flappy.width && pipe.getAttribute('id')) {
                pipe.classList.add('past');
            }

            



        })
        pastPipes = Array.from(document.getElementsByClassName('past'));
        if (pastPipes) {
            scoreDiv[0].innerHTML = pastPipes[0].getAttribute('id');
        }

        topPipes.map((pipe) => {

            if (nearTopPipe.length >= 2) {
                nearTopPipe.shift();
            }

            if (leftDistance < pipe.offsetLeft + getPixelsNumber(pipeWidth) + 10 && leftDistance > pipe.offsetLeft - flappy.width - 10) {
                nearTopPipe.push(pipe);
            }

        })

        bottomPipes.map((pipe) => {

            if (nearBottomPipe.length >= 2) {
                nearBottomPipe.shift();
            }

            if (leftDistance < pipe.offsetLeft + getPixelsNumber(pipeWidth) + 10 && leftDistance > pipe.offsetLeft - flappy.width - 10) {
                nearBottomPipe.push(pipe);
            }

        })




        // const nearPipe = topPipes.filter((pipe) => {
        //     leftDistance < pipe.offsetLeft + getPixelsNumber(pipeWidth) + 10 && leftDistance > pipe.offsetLeft - flappy.width - 10;
        // });
        console.log(nearTopPipe);





        if (collisionWithTopPipes(nearTopPipe[0], flappy) || collisionWithBottomPipes(nearBottomPipe[0], flappy)) {
            loseGame();
        }


        





    }, 100);
}

const restartButton = document.getElementsByClassName('restartButton')[0];
const loseDiv = document.getElementsByClassName('loseDiv')[0];

function loseGame() {

    // we stop every intervals
    clearInterval(flappyFallInterval);
    clearInterval(pipeGenerationInterval);
    clearInterval(pipeMovementInterval);

    restartButton.classList.remove('hidden');
    loseDiv.classList.remove('hidden');

}

function getPixelsNumber(pixels) {
    return parseFloat(pixels.slice(0, -2));
}

function collisionWithTopPipes(topPipe, flappy) {
    if (topDistance < getPixelsNumber(topPipe.style.height) && leftDistance + flappy.width > window.innerWidth - getPixelsNumber(topPipe.style.right) - getPixelsNumber(pipeWidth) && leftDistance < window.innerWidth - getPixelsNumber(topPipe.style.right) - getPixelsNumber(pipeWidth) + getPixelsNumber(pipeWidth) ) {
        return true;
    } else {
        return false;
    }
}

function collisionWithBottomPipes(bottomPipe, flappy) {
    if (topDistance > window.innerHeight - (getPixelsNumber(bottomPipe.style.height) + flappy.height) && leftDistance + flappy.width > window.innerWidth - getPixelsNumber(bottomPipe.style.right) - getPixelsNumber(pipeWidth) && leftDistance < window.innerWidth - getPixelsNumber(bottomPipe.style.right) - getPixelsNumber(pipeWidth) + getPixelsNumber(pipeWidth) ) {
        return true;
    } else {
        return false;
    }
}



