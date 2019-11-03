const font = {
    scorebord : "50px Factory",
    gameover : "65px Factory"
} 
var circleRepository = []
var pendingCircleInitialization = true;
var gameStart = false;
var sectors = [];
var scoreboards = []
var spawnBricks = [];
var behavior = {
    scene : {
        isVisible : true,
        isObstacle : false,
        isSpawn : false
    },
    sector : {
        isVisible : true,
        isObstacle : true,
        isSpawn : false
    },
    spawn : {
        isVisible : true,
        isObstacle : false,
        isSpawn : true
    },
    wall : {
        isVisible : true,
        isObstacle : true,
        isSpawn : false
    }    
}
var colors = {
    brick :{
        darkCyan : {
            vibrant : "#293749",
            flat : "darkCyan"
        },
        red : {
            vibrant : "#BB3030",
            flat : "red"
        },
        orange : {
            vibrant : "#FF5733",
            flat : "orange"
        },
        purple : {
            vibrant : "#950DEC",
            flat : "purple"
        },
        green : {
            vibrant : "#006400",
            flat : "green"
        },
        yellow : {
            vibrant : "#FFFF00",
            flat : "yellow"
        },
        darkGray : {
            vibrant : "#808080",
            flat : "darkGray"
        },
        midCyan : {
            vibrant : "#295C9E",
            flat : "midCyan"
        },
        shadow : {
            
            vibrant : "#21262B",
            flat : "shadow"
        }
    },
    circle:{
        red : {
            vibrant : "#FF0000",
            flat : "red"
        },
        blue : {
            vibrant : "#0000FF",
            flat : "purple"
        },
        olive : {
            vibrant : "#777722",
            flat: "green"
        }
    }
}

var layers = {
    "lvl1" : 
        ((context) => {
        //Define the size, color and behavior of a brick
        var bricks = [
            new Brick(context, colors.brick.darkCyan, behavior.scene),
            new Brick(context, colors.brick.yellow, behavior.scene),
            new Brick(context, colors.brick.red, behavior.sector),
            new Brick(context, colors.brick.purple, behavior.sector),
            new Brick(context, colors.brick.yellow, behavior.sector),
            new Brick(context, colors.brick.darkGray, behavior.spawn),
            new Brick(context, colors.brick.midCyan, behavior.wall),
            new Brick(context, colors.brick.shadow, behavior.wall),
            new Brick(context, colors.brick.midCyan, behavior.scene),
            new Brick(context, colors.brick.shadow, behavior.wall)
        ]

        //Define the size and position and the type of brick used to create zones and add to the zones array
        let zones = [];
        zones.push(new Zone(0, 0, 32, 29, bricks[0]));
        
        //size of tile dimentions for walls in the 4 corners of the map
        let WallWidth = 13;
        let WallHeight = 5;

        //size of tile dimentions for scoreboard backgrounds in the top left and right corners of the map
        let scorboardWidth = 4;
        let scoreboardHeight = 3;
        
        //building the dimentions for the walls and score board for top left of map
        zones.push(new Zone(0, 0, WallWidth, WallHeight, bricks[8]));
        zones.push(new Zone(0, 0, WallWidth - 1, WallHeight - 1, bricks[6]));
        let scoreboard1 = new Zone(1, 1, scorboardWidth, scoreboardHeight, bricks[9])
        zones.push(scoreboard1)
        
        //building the dimentions for the walls and score board for top right of map
        zones.push(new Zone(19, 0, WallWidth, WallHeight, bricks[8]));
        zones.push(new Zone(20, 0, WallWidth - 1, WallHeight - 1, bricks[6]));
        let scoreboard2 = new Zone(27, 1, scorboardWidth, scoreboardHeight, bricks[9])
        zones.push(scoreboard2)

        //building the dimentions for the walls for bottom left of map
        zones.push(new Zone(0, 24, WallWidth, WallHeight, bricks[8]));
        zones.push(new Zone(0, 25, WallWidth - 1, WallHeight - 1, bricks[6]));

        //building the dimentions for the walls for bottom right of map
        zones.push(new Zone(19, 24, WallWidth, WallHeight, bricks[8]));
        zones.push(new Zone(20, 25, WallWidth - 1, WallHeight - 1, bricks[6]));

        //build the dimentions for the area near the red zone
        zones.push(new Zone(0, 9, 8, 11, bricks[1]))
        let redSector = new Zone(-1, 10, 8, 9, bricks[2])
        zones.push(redSector)
        
        //build the dimentions for the area near the red zone
        zones.push(new Zone(24, 9, 8, 11, bricks[1]))
        let blueSector = new Zone(25, 10, 9, 9, bricks[3])
        zones.push(blueSector)

        //build the dimentions for the area north and south spawn zone
        zones.push(new Zone(15, 0, 2, 1, bricks[5]))
        zones.push(new Zone(15, 28, 2, 1, bricks[5]))

        //make these variables readily available
        scoreboards = [scoreboard1, scoreboard2]
        sectors = [redSector, blueSector]

        //merge all the bricks together
        let ZonesFullySuperimposed = zones.reduce((oldZone, newZone) => oldZone.addZone(newZone))
        return ZonesFullySuperimposed.Layout
    })
}
let mouse = {
    x : 0 ,
    y : 0,
    pressed : false,
    holding : null
}

let gameState = {
    gameover : false
}


let loadGame = () => {
    clearIntro()
    setCanvas()
    setMusic()
    setGameMode()
    setAnimations()  
}


let clearIntro = () => {
    document.getElementById('missionContainer').style.display = "none";
    document.getElementById('buttonContainer').style.display = "none";
}

let setCanvas = () => {
    canvas = document.getElementById("SOS");
    canvasContext = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 725;   
}

let setMusic = () => {
    music = document.getElementById('imagination')
    music.play();
    music.loop = true;
    music.volume = 0.1;
}

let setGameMode = () => {
    gameStart = true;
}

let setAnimations = () => {
    if(gameStart === true){
        let framesPerSecond = 30
        animateIntervalID = setInterval(animate, 1000/framesPerSecond);
    }
}

let setMouseListeners = () => {
    canvas.addEventListener('mousemove', updateMousePos)
    canvas.addEventListener('mousedown', toggleDrag)
    canvas.addEventListener('mouseup', toggleDrag)
} 

let updateMousePos = (e) => {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    mouse.x = e.clientX - rect.left - root.scrollLeft;
    mouse.y = e.clientY - rect.top - root.scrollTop;    
}

let toggleDrag = (e) => {
    if(e.type == "mousedown"){
        mouse.pressed = true;

    }else if(e.type == "mouseup"){
        mouse.pressed = false;
        mouse.holding = null;
    }
}

let animate = () => {
    // if(gameStart ==  false) clearInterval(animateIntervalID)
    applyBackground()
    setMouseListeners()
    displayLayers();
    if(pendingCircleInitialization){
        spawnInitializationManager()
        pendingCircleInitialization = false;
    }
    displayCircles(circleRepository)
    implementCircleInteraction()
    displayCountsAndScores()
    // displayMouseCoordinates()
    promptGameOver(sectors, circleRepository)
    
}

let stopAllIntervals = () => {
    // clearInterval(animateIntervalID)
    clearInterval(spawnerIntervalID)
}

let applyBackground = () => {
    canvasContext.fillStyle = '#0099FF';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
}

let displayLayers = () => {
    let layout = layers["lvl1"]
    generateLayout = new GenerateLayer(layout(canvasContext));
    generateLayout.implimentBricksFromLayer();
    spawnBricks = generateLayout.SavedSpawns
}

let spawnInitializationManager = () => {
    //An index that will increment to represent an array of values
    let spawnIndex = 0;
    //InitalizeSpawns returns an array of Circles, indicating each of these circle's positions and colors 
    //To do do this, InitalizeSpawns takes in a set of parameters from the spawnGenerator function, selecting the proper difficulty parameters based on the current spawnIndex
    //parameters that indicate where circles to be rendered, their duration of how long it may stay on the field and the amount are controlled.
    //Once InitalizeSpawns returns an array of circles, the circles array is spread as parameters into array circleRepository. This allows each spawned circle to be rendered.
    //spawnIndex is then incremented and after 5 seconds, this process repeats
    spawnerIntervalID = setInterval(() => {
        circleRepository.push(...initializeSpawns(...spawnGenerator(spawnIndex)))
        spawnIndex++
    }, 3000)
}

let spawnGenerator = (spawnIdx) => {
    const EQ_CONCENTRATION = 0
    const TOP_ONLY = 1
    const BOTTOM_ONLY = 2
    const RAND_CONCENTRATION = 3
    const RED = 0
    const BLUE = 1
    const EITHER = -1
    const REST = [0, 0, 0, -1]

    let type = -1;
    let dataIndex;

    //[how many circles to render, where they are distributed, how long until detonation, colors]
    let beginnerSingle = [[1,TOP_ONLY,10,RED], [1,BOTTOM_ONLY,10,BLUE]]
    let beginnerOneSided = [[2,TOP_ONLY,10,RED], [2,TOP_ONLY,10,BLUE], [2,BOTTOM_ONLY,10,RED], [2,BOTTOM_ONLY,10,BLUE]]
    let beginnerMixed = [[2,RAND_CONCENTRATION,10,RED], [2,RAND_CONCENTRATION,10,BLUE], [2,RAND_CONCENTRATION,10,RED], [2,RAND_CONCENTRATION,10,BLUE]]

    let easySingle = [[1,TOP_ONLY,8,RED], [1,BOTTOM_ONLY,8,BLUE]]
    let easyOneSided = [[3,TOP_ONLY,8,RED], [3,TOP_ONLY,8,BLUE], [3,BOTTOM_ONLY,8,RED], [3,BOTTOM_ONLY,8,BLUE]]
    let easyMixed = [[4,EQ_CONCENTRATION,10,RED], [4,EQ_CONCENTRATION,10,BLUE], [4,EQ_CONCENTRATION,10,RED], [4,EQ_CONCENTRATION,10,BLUE]]

    let normalSingle = [[1,TOP_ONLY,5,RED], [1,BOTTOM_ONLY,5,BLUE]]
    let normalOneSided = [[5,TOP_ONLY,,EITHER], [5,TOP_ONLY,8,BLUE], [5,BOTTOM_ONLY,10,EITHER], [5,BOTTOM_ONLY,8,BLUE]]
    let normalMixed = [[6,EQ_CONCENTRATION,8,BLUE], [6,RAND_CONCENTRATION,10,EITHER], [6,EQ_CONCENTRATION,8,RED], [6,RAND_CONCENTRATION,10,EITHER]]

    let hardSingle = [[1,TOP_ONLY,3,EITHER], [1,BOTTOM_ONLY,3,EITHER]]
    let hardOneSided = [[8,TOP_ONLY,5,EITHER], [8,TOP_ONLY,5,BLUE], [8,BOTTOM_ONLY,5,EITHER], [8,BOTTOM_ONLY,5,BLUE]]
    let hardMixed = [[8,RAND_CONCENTRATION,6,BLUE], [8,RAND_CONCENTRATION,6,EITHER], [8,RAND_CONCENTRATION,6,RED], [8,RAND_CONCENTRATION,6,EITHER]]

    let smallFlood = [16,EQ_CONCENTRATION,120,EITHER]
    let mediumFlood = [32,EQ_CONCENTRATION,180,EITHER]
    let largeFlood = [48,EQ_CONCENTRATION,240,EITHER]
    let hugeFlood = [64,EQ_CONCENTRATION,300,EITHER]

    let blueFlood = [16,EQ_CONCENTRATION,120,BLUE]
    let redFlood =  [16,EQ_CONCENTRATION,120,RED]

    if(spawnIdx < 5){
        document.getElementById('phase').innerHTML = "PHASE: I'M BABY"
        dataIndex = Math.floor((Math.random() * beginnerSingle.length))
        spawnData = beginnerSingle[dataIndex];
    }else if(spawnIdx > 5 && spawnIdx <= 20){
        document.getElementById('phase').innerHTML = "PHASE: BEGINNER"
        type = Math.floor((Math.random() * 3))
        if(type == 1){
            dataIndex = Math.floor((Math.random() * beginnerOneSided.length))
            spawnData = beginnerOneSided[dataIndex];
        }else{
            dataIndex = Math.floor((Math.random() * beginnerMixed.length))
            spawnData = beginnerMixed[dataIndex];
        }
    }else if(spawnIdx > 20 && spawnIdx <= 40){
        document.getElementById('phase').innerHTML = "PHASE: PSHHH EASY"
        type = Math.floor((Math.random() * 3))
        if(type == 0){
            dataIndex = Math.floor((Math.random() * hardSingle.length))
            spawnData = hardSingle[dataIndex];
        }else if(type == 1){
            dataIndex = Math.floor((Math.random() * easyOneSided.length))
            spawnData = easyOneSided[dataIndex];
        }else if(type == 2){
            dataIndex = Math.floor((Math.random() * easyMixed.length))
            spawnData = easyMixed[dataIndex]
        }
    }else if(spawnIdx > 40 && spawnIdx <= 100){
        document.getElementById('phase').innerHTML = "PHASE: AVERAGE"
        type = Math.floor((Math.random() * 5))
        if(type == 0){
            dataIndex = Math.floor((Math.random() * easySingle.length));
            spawnData = easySingle[dataIndex]
        }else if(type == 1){
            dataIndex = Math.floor((Math.random() * easyOneSided.length));
            spawnData = easyOneSided[dataIndex]
        }else if(type == 2){
            dataIndex = Math.floor((Math.random() * easyMixed.length));
            spawnData = easyMixed[dataIndex]
        }else if(type == 3){
            spawnData = blueFlood
        }else if(type == 4){
            spawnData = redFlood
        }
    }else if(spawnIdx > 100 && spawnIdx <= 300){
        document.getElementById('phase').innerHTML = "PHASE: DECENT"
        type = Math.floor((Math.random() * 6))
        if(type == 0){
            dataIndex = Math.floor((Math.random() * normalSingle.length));
            spawnData = normalSingle[dataIndex]
        }else if(type == 1){
            dataIndex = Math.floor((Math.random() * normalOneSided.length));
            spawnData = normalOneSided[dataIndex]
        }else if(type == 2){
            dataIndex = Math.floor((Math.random() * normalMixed.length));
            spawnData = normalMixed[dataIndex]
        }else if(type == 3){
            spawnData = smallFlood
        }else if(type == 4){
            spawnData = blueFlood
        }else if(type == 5){
            spawnData = redFlood
        }
    }else if(spawnIdx > 300 && spawnIdx <= 500){
        document.getElementById('phase').innerHTML = "PHASE: DANGER DWELLER"
        type = Math.floor((Math.random() * 3))
        if(type == 0){
            dataIndex = Math.floor((Math.random() * hardSingle.length));
            spawnData = hardSingle[dataIndex]
        }else if(type == 1){
            dataIndex = Math.floor((Math.random() * normalOneSided.length));
            spawnData = normalOneSided[dataIndex]
        }else if(type == 2){
            dataIndex = Math.floor((Math.random() * normalMixed.length));
            spawnData = normalMixed[dataIndex]
        }

    }else if(spawnIdx > 500 && spawnIdx <= 1000){
        document.getElementById('phase').innerHTML = "PHASE: THE BADBADNOTGOOD"
        type = Math.floor((Math.random() * 7))
        if(type == 0){
            dataIndex = Math.floor((Math.random() * hardSingle.length));
            spawnData = hardSingle[dataIndex]
        }else if(type == 1){
            dataIndex = Math.floor((Math.random() * hardOneSided.length));
            spawnData = hardOneSided[dataIndex]
        }else if(type == 2){
            dataIndex = Math.floor((Math.random() * hardMixed.length));
            spawnData = hardMixed[dataIndex]
        }else if(type == 3){
            spawnData = mediumFlood
        }else{
            spawnData = REST
        }
    }else if(spawnIdx > 1000){
        document.getElementById('phase').innerHTML = "PHASE LIKELY CHEATED"
        type = Math.floor((Math.random() * 15))
        if(type == 0){
            dataIndex = Math.floor((Math.random() * hardSingle.length));
            spawnData = hardSingle[dataIndex]
        }else if(type == 1){
            dataIndex = Math.floor((Math.random() * hardOneSided.length));
            spawnData = hardOneSided[dataIndex]
        }else if(type == 2){
            dataIndex = Math.floor((Math.random() * hardMixed.length));
            spawnData = hardMixed[dataIndex]
        }else if(type == 13){
            spawnData = largeFlood
        }else{
            spawnData = REST
        }
    }
    return spawnData;
}

let initializeSpawns = (circlesToBeRendered, releaseType, secondsToExplode, colorId) => {
    if(gameStart == false) clearInterval(spawnerIntervalID)
    
    //an array of circles
    let newCircleRepository = [];

    //a variables used for releaseType == 0
    let spawnBricksRemaining = spawnBricks.length - 1;
    let resetSpawnBricksRemaining = spawnBricks.length - 1;


    //a variable that contains an index on information of a spawn brick at that index, including x and y positions
    let spawnBrickIndex;

    while(circlesToBeRendered > 0){
        //Ensures that circles are released from all spawn bricks at equal concentations
        //Grabs the index of a spawnBrick's index and assigns it to spawnBrickIndex which will provide a future circle's x and y coords
        //It traverses from the amount of spawn bricks there are on the map to a value 0
        //then resets back to the original amount amount of spawn brick until each potential circle has been assigned a spawnBrickIndex
        if(releaseType == 0){
             spawnBrickIndex = spawnBricksRemaining
            if(spawnBricksRemaining % spawnBricks.length == 0){
                spawnBricksRemaining = resetSpawnBricksRemaining
            }else{
                spawnBricksRemaining--
            } 
        }

        //Ensures that circles will only release from either spawn bricks from ONLY the top 
        else if(releaseType == 1){
            spawnBrickIndex = 0
        }

        //Ensures that circles will only release from either spawn bricks from ONLY the top 
        else if(releaseType == 2){
            spawnBrickIndex = 2
        }

        //Ensures that circles will release from spawn bricks at any concentration
        else if (releaseType == 3){
            spawnBrickIndex = Math.floor((Math.random() * spawnBricks.length))
        }

        //develop the state of a circle
        let x = spawnBricks[spawnBrickIndex].x
        let y = spawnBricks[spawnBrickIndex].y
        let dirX = directionRandomization()
        let dirY = directionRandomization()
        let radius = 25;
        let color = colorSelection(colorId)
        //create the circle
        let circle = new Circle(canvasContext, x, y, dirX, dirY, radius, color, secondsToExplode)
        //start this circle's detonation timer
        circle.explodeCountdown() 
        //push this circle into the array of circles 
        newCircleRepository.push(circle)
        //decrement the number of circles left to render
        circlesToBeRendered--
    }
    return newCircleRepository;
}

let directionRandomization = () => {
    let dir = Math.random() * 2 - 1
        // if(Math.abs(dir) < 0.75){
        //     dir = dir < 0 ? -0.75 : 0.75
        // }
    return dir;
}

let colorSelection = (colorId=-1) => {

    if(colorId == -1){
        colorId = Math.floor((Math.random() * 2));
    }
    
    if(colorId == 0){
        return colors.circle.red
    }else if(colorId === 1){
        return colors.circle.blue 
    }   

}

let displayCircles = (circleRepository) => {
    circleRepository.map(circle => {
        circle.display()
        circle.move(canvas)
    })
}

let implementCircleInteraction = () => {
    collisionWithBricksActive()
    if(gameState.gameover == false){
        interactionWithMouseActive()
    }  
}

let collisionWithBricksActive = () => {
    circleRepository.map(circle => {
        circle.beAwareOfBricks(generateLayout.SavedBricks)
    })
}

let interactionWithMouseActive = () => {
    circleRepository.map(circle => {
        circle.beAwareOfMouse(mouse)
    })
}

let displayCountsAndScores = () => {
    sectors.forEach(sector => sector.beAwareOfCircles(circleRepository))
    let positions = scoreboards.map(scoreboard => {
        ScoreCoordinates = {
            x : scoreboard.zoneWestSide() + ((scoreboard.width - 3) * scoreboard.brick.width) - 1.5,
            y : scoreboard.zoneNorthSide() + ((scoreboard.height - 1) * scoreboard.brick.height) + 5
        }
        return ScoreCoordinates;
    })
    sectors.forEach((sector, idx) => {
        canvasContext.font = font.scorebord;
        canvasContext.fillStyle = "#FFFFFF";
        canvasContext.fillText(sector.Count, positions[idx].x, positions[idx].y)
    })   
}

// var displayMouseCoordinates = () => {
//     canvasContext.font = "10px Arial";
//     canvasContext.fillStyle = "#007700";
//     canvasContext.fillText(`(${mouse.x},${mouse.y})`, mouse.x, mouse.y)   
// }

let promptGameOver = (sectors, circleRepository) => {
    circleRepository.forEach(circle => {
        if(circle.ExplodeState == 2){
            gameStart = false
        }
    })
    sectors.forEach(sector => {
        if(sector.ExplodeState == true){
            gameStart = false
        }
    })

    if (gameStart === false){
        //plaster game over on the window
        canvasContext.font = font.gameover;
        canvasContext.fillStyle = "#FF0000";
        canvasContext.fillText(`Game Over`, canvas.width/3.7, canvas.height/3)
         
        
        //remove the game board after 5 seconds
        setTimeout(() => {
            clearInterval(animateIntervalID)
            let title = document.getElementById("title")
            let game = document.getElementById("game");
            title.setAttribute("class", "title fadeOut")
            game.setAttribute("class","game fadeOut")

        }, 2000)


        // show the user their score
        setTimeout(() => {
            canvas.width = 0;
            canvas.height = 0;

            
            let scoreContainer = document.getElementById('scoreContainer')
            scoreContainer.setAttribute("class","scoreContainer fadeIn")
            scoreContainer.style.color = "#FFFF00";

            let scoreText = document.getElementById('scoreText')
            scoreText.innerHTML = "Nodes successfully neutralized:";

            let scorePoints = document.getElementById('scorePoints')
            scorePoints.innerHTML = sectors.reduce((sum, sector) => sector.Count + sum, 0)
        }, 4000)
    }
}

class Entity{
    context;
    x;
    y;
    color;
    
    constructor(context, x, y, color){
        this.context = context;
        this.x = x;
        this.y = y;
        this.color = color;
    }

    set X(x){
        this.x = x;
    }

    set Y(y){
        this.y = y;
    }

    set Color(color){
        this.color = color;
    }
    get Color(){
        return this.color
    }

    get X(){
        return this.x
    }

    get Y(){
        return this.y
    }

    get Context(){
        return this.context;
    }

    display(){}
}

class Rectangle extends Entity{
    trueCenterX;
    trueCenterY;
    width;
    height;

    constructor(context, x, y, width, height, color){
        super(context, x, y, color)
        this.width = width;
        this.height = height;
        this.color = color;
        this.trueCenterX = x + width/2
        this.trueCenterY = y + height/2
    }


    set Width(width){
        this.width = width;
    }

    get Width(){
        return this.width;
    }

    set Height(height){
        this.height = height;
    }

    get Height(){
        return this.height;
    }

    get TrueCenterX(){
        return this.trueCenterX;
    }

    get TrueCenterY(){
        return this.trueCenterY;
    }

    isCollildingWith(entity){
        //get the center of the entity
        let calcX = (this.trueCenterX - entity.trueCenterX);
        let calcY = (this.trueCenterY - entity.trueCenterY);

        //Square the difference 
        let powX = Math.pow(calcX, 2)
        let powY = Math.pow(calcY, 2)

        //distance by finding the root
        let distance = Math.abs(powX + powY)

        if(distance < 50){
            console.log("too close")
        }
    }

    display(){
        super.display();
        this.context.fillStyle = super.Color;
        this.context.fillRect(this.x, this.y, this.WidthWithGap, this.HeightWithGap, this.color);
    }

}

class Brick extends Rectangle{
    idX = 0;
    idY = 0;  
    gap = true  ;
    visible;
    obstacle;
    spawn;
    flatColor;

    
    constructor(context, colors, behaviorType){
        super(context, null, null, 25, 25, colors != null ? colors.vibrant : null)
        this.flatColor = colors != null ? colors.flat : null;
        this.visible = behaviorType.isVisible;
        this.obstacle = behaviorType.isObstacle;
        this.spawn = behaviorType.isSpawn;
    }

    get flatColor(){
        return this.flatColor;
    }

    set IdX(idX){
        this.X = idX * this.width
        this.trueCenterX = (idX * this.Width) + this.width/2
        this.idX = idX;
    }

    set IdY(idY){
        this.y = idY * this.height
        this.trueCenterY = (idY * this.height) + this.height/2
        this.idY = idY;
    }

    get IdX(){
        return this.idX;
    }

    get IdY(){ 
        return this.idY;
    }

    get WidthWithGap(){
        return this.gap ? this.width - this.gap : this.width;
    }

    get HeightWithGap(){
        return this.gap ? this.height - this.gap : this.height;
    }

    get isVisible(){
        return this.visible;
    }

    get isSpawn(){
        return this.spawn;
    }

    get isObstacle(){
        return this.obstacle;
    }

    get isGapVisible(){
        return this.gap;
    }

    get toggleVisible(){
        this.visible = !this.visible;
        return this.visible;
    }

    toggleGap(){
        this.gap = this.gap == 2 ? 0 : 2;
    }

}

class Circle extends Entity{
    ballSpeedX;
    ballSpeedY;
    trueCenterX;
    trueCenterY;
    radius;
    invulerable;
    flatColor;
    oldColor;
    distressColor;
    explodeColor;
    incapacitated;
    count;
    explodeTimer;
    explodeState;
    interval;
    ignoreMouse;
    currentSector;
    incapacitateOnce;

    constructor(context, x, y, dirX, dirY, radius, colors, explodeTimer){
        super(context, x, y, colors != null ? colors.vibrant : null)
        this.flatColor = colors != null ? colors.flat : null;
        this.oldColor = colors != null ? colors.vibrant : null;
        this.distressColor = "#00FF00";
        this.explodeColor = "#00FFFF";
        this.trueCenterX = x;
        this.trueCenterY = y;
        this.radius = radius;
        this.ballSpeedX = 5 * dirX;
        this.ballSpeedY = 5 * dirY;
        this.invulerable = false;
        this.incapacitated = false;
        this.count = 0;
        this.explodeTimerStart = explodeTimer * 1000;
        this.explodeTimer = explodeTimer;
        this.explodeState = 0;
        this.ignoreMouse = false;
        this.currentSector = null;
        this.incapacitateOnce = false
        
    }

    explodeCountdown(){
    this.interval = setInterval(() => {
            if(this.explodeTimer <= 0){
                this.explodeState = 2;
                this.color = this.explodeColor;
                this.ballSpeedX = 0
                this.ballSpeedY = 0 
            }else if(this.explodeTimer < 5){
                if(this.explodeTimer % 2 == 0){
                    this.color = this.distressColor;
                }else{
                    this.color = this.oldColor;
                }
                this.explodeState = 1;
                
            }
            this.explodeTimer--;
        }, 1000); 
    }

    invulerableSwitch(){
        this.invulerable = true;
        setInterval(() => this.invulerable = false, 100);  
    }

    incapacitatedSwitch(){  
        this.incapacitated = true
        this.ballSpeedX = 0
        this.ballSpeedY = 0
        this.color = this.oldColor
        this.ignoreMouse = true
        clearInterval(this.interval)

        if(this.incapacitateOnce == false){
            //randomize the placement of the circle within the zone once incapacitated
            let westSideOfSector = this.currentSector.zoneWestSide() + 25
            let widthOfSector = this.currentSector.TrueWidth - 50  
            let northSideOfSector = this.currentSector.zoneNorthSide() + 25
            let heightOfSector = this.currentSector.TrueHeight - 50
            this.x = Math.floor(Math.random() * widthOfSector) + westSideOfSector;
            this.y = Math.floor(Math.random() * heightOfSector) + northSideOfSector;
            this.incapacitateOnce = true;
        }


    }
    
    get Radius(){
        return this.radius;
    }

    get flatColor(){
        return this.flatColor;
    }

    get ExplodeColor(){
        return this.explodeColor;
    }

    set ExplodeState(num){
        this.explodeState = num;
    }

    get ExplodeState(){
        return this.explodeState;
    }

    set CurrentSector(zone){
        this.currentSector = zone;
    } 

    get CurrentSector(){
        return this.currentSector;
    }

    isCollildingWith(entity){
        if(this.incapacitated != true){
            
            let distance = this.getDistance(this.x, this.y, entity.trueCenterX, entity.trueCenterY)
            let distanceRange = {
                max : 52,
                min : 48 
            }
            if(distance < distanceRange.max && this.invulerable == false){ 
                this.invulerableSwitch() 
                // this.drawLinesBetween(entity.trueCenterX, entity.trueCenterY)
                //determine sides so that we can dicttate the proper way to bounce off
                let selfLeftSide = this.x - this.radius
                let selfTopSide = this.y - this.radius
                let selfRightSide = this.x + this.radius
                let selfBottomSide = this.y + this.radius

                let selfTopLeftCornerPoint = {
                    x : selfLeftSide,
                    y : selfTopSide
                }
                let selfTopRightCornerPoint = {
                    x : selfRightSide,
                    y : selfTopSide
                }
                let selfBottomLeftCornerPoint = {
                    x : selfLeftSide,
                    y : selfBottomSide
                }
                let selfBottomRightCornerPoint = {
                    x : selfRightSide,
                    y : selfBottomSide
                }
                let entityCenterPoint = {
                    x : entity.trueCenterX,
                    y : entity.trueCenterY
                }

                distanceRange = {
                    max : 65,
                    min : 30
                }

                let shouldMoveRIGHT =  
                    this.getDistance(selfTopLeftCornerPoint.x, selfTopLeftCornerPoint.y, entityCenterPoint.x, entityCenterPoint.y) < distanceRange.max &&
                    this.getDistance(selfBottomLeftCornerPoint.x, selfBottomLeftCornerPoint.y, entityCenterPoint.x, entityCenterPoint.y) < distanceRange.max //&&
                    // this.getDistance(selfTopLeftCornerPoint.x, selfTopLeftCornerPoint.y, entityCenterPoint.x, entityCenterPoint.y) > distanceRange.min &&
                    // this.getDistance(selfBottomLeftCornerPoint.x, selfBottomLeftCornerPoint.y, entityCenterPoint.x, entityCenterPoint.y) > distanceRange.min 

                let shouldMoveDOWN = 
                    this.getDistance(selfTopLeftCornerPoint.x, selfTopLeftCornerPoint.y, entityCenterPoint.x, entityCenterPoint.y) < distanceRange.max &&
                    this.getDistance(selfTopRightCornerPoint.x, selfTopRightCornerPoint.y, entityCenterPoint.x, entityCenterPoint.y) < distanceRange.max //&&
                    // this.getDistance(selfTopLeftCornerPoint.x, selfTopLeftCornerPoint.y, entityCenterPoint.x, entityCenterPoint.y) > distanceRange.min &&
                    // this.getDistance(selfTopRightCornerPoint.x, selfTopRightCornerPoint.y, entityCenterPoint.x, entityCenterPoint.y) > distanceRange.min    
        
                let shouldMoveLEFT = 
                    this.getDistance(selfTopRightCornerPoint.x, selfTopRightCornerPoint.y, entityCenterPoint.x, entityCenterPoint.y) < distanceRange.max &&
                    this.getDistance(selfBottomRightCornerPoint.x, selfBottomRightCornerPoint.y, entityCenterPoint.x, entityCenterPoint.y) < distanceRange.max //&&
                    // this.getDistance(selfTopRightCornerPoint.x, selfTopRightCornerPoint.y, entityCenterPoint.x, entityCenterPoint.y) > distanceRange.min &&
                    // this.getDistance(selfBottomRightCornerPoint.x, selfBottomRightCornerPoint.y, entityCenterPoint.x, entityCenterPoint.y) > distanceRange.min 
            
                let shouldMoveUP = 
                    this.getDistance(selfBottomLeftCornerPoint.x, selfBottomLeftCornerPoint.y, entityCenterPoint.x, entityCenterPoint.y) < distanceRange.max &&
                    this.getDistance(selfBottomRightCornerPoint.x, selfBottomRightCornerPoint.y, entityCenterPoint.x, entityCenterPoint.y) < distanceRange.max //&&
                    // this.getDistance(selfBottomLeftCornerPoint.x, selfBottomLeftCornerPoint.y, entityCenterPoint.x, entityCenterPoint.y) > distanceRange.min &&
                    // this.getDistance(selfBottomRightCornerPoint.x, selfBottomRightCornerPoint.y, entityCenterPoint.x, entityCenterPoint.y) > distanceRange.min 

                //if a rectangle find sides
                if(entity.radius == null){
                    // add direction if sides hit
                    if(shouldMoveLEFT == true){
                        this.ballSpeedX *= -1;
                    }
                    if(shouldMoveRIGHT == true){
                        this.ballSpeedX *= -1; 
                    }
                    if(shouldMoveUP == true){
                        this.ballSpeedY *= -1;
                    }
                    if(shouldMoveDOWN == true){
                        this.ballSpeedY *= -1; 
                    }

                }
                return true;
            } 
        }
        return false;
    }

    isInteractingWithMouse(mouse){
        let distance = this.getDistance(this.x, this.y, mouse.x, mouse.y)

        if(distance <= this.radius && mouse.holding == null){
            mouse.holding = this
        }
        if(mouse.holding === this){
            this.x = mouse.x
            this.y = mouse.y
        }
    }

    getDistance(x1,y1,x2,y2){
        //get the center of the entity
        let calcX = (x1 - x2);
        let calcY = (y1 - y2);

        //Square the difference 
        let powX = Math.pow(calcX, 2)
        let powY = Math.pow(calcY, 2)

        // distance by finding the root
        return Math.sqrt(powX + powY)
    }

    beAwareOfBricks(layer){
        let collision = false
        layer.forEach(brick => {
            //brick is no longer a class but a regular object
            if(brick.visible == true && brick.obstacle == true){
                this.isCollildingWith(brick)
            }
        })
    }

    beAwareOfMouse(mouse){

        if(mouse.pressed == true && this.ignoreMouse == false && this.explodeState < 2){
            this.isInteractingWithMouse(mouse)
        }
        if(this.explodeTimer < 5 && this.incapacitated == false){
            this.drawLinesBetween(mouse.x, mouse.y)
        } 
        
        
    }

    drawLinesBetween(entityX, entityY){
        this.Context.strokeStyle = "#00FF00";
        this.Context.beginPath();
        this.Context.moveTo(super.X, super.Y);
        this.Context.lineTo(entityX, entityY);
        this.Context.stroke();
    }

    move(canvas){
        if(this.explodeState < 2 || this.ignoreMouse == false || this.incapacitated == false){    
            //add movement
            this.x += this.ballSpeedX;
            this.y += this.ballSpeedY;

            //add direction if wall hit
            if(this.x < 0){
                this.ballSpeedX *= -1;
            }
            if(this.x > canvas.width){
                this.ballSpeedX *= -1;
            }
            if(this.y < 0){
                this.ballSpeedY *= -1; 
            }
            if(this.y > canvas.height){
                this.ballSpeedY *= -1; 
            }
        }
    }
    
    display(){
        if (this.Context != undefined){
            this.Context.fillStyle = super.Color;
            this.Context.beginPath();
            this.Context.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
            this.Context.fill();
            this.Context.lineWidth = 5;
            this.Context.strokeStyle = "#000000";
            this.Context.stroke();
        }
    }

}

class Zone{
    x;
    y;
    width;
    height;
    brick;
    layout;
    count;
    zonesExplodeState;
    flatColor;
    lastCount;
    incapacitatedCircles;

    constructor(x, y, width, height, brick, layout){
        if(layout == null){
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            let row = Array(width).fill(brick);
            this.layout = Array(height).fill(row);
            this.brick = brick;
            this.flatColor = brick.flatColor;
            this.zonesExplodeState = false;
            this.count = 0;
            this.incapacitatedCircles = []
        }
        else if (x === null && y === null && width === null, height === null, brick === null){
            this.x = 0;
            this.y = 0;
            this.width = layout[0].length;
            this.height = layout.length;
            this.layout = layout;
            this.brick = null;
            this.flatColor = null;
            this.zonesExplodeState = false;
            this.count = 0;
            this.incapacitatedCircles = []
        }
    }

    get Layout(){
        return this.layout;
    }

    get Count(){
        return this.zonesExplodeState ? 0 : this.count
    }

    get FlatColor(){
        return this.flatColor;
    }

    get ExplodeState(){
        return this.zonesExplodeState;
    }

    get TrueWidth(){
        return this.width * this.brick.width
    }

    get TrueHeight(){
        return this.height * this.brick.height
    }

    zoneWestSide(){
        return this.x * this.brick.width
    }
    zoneEastSide(){
        return this.zoneWestSide() + this.width * this.brick.width
    }
    zoneNorthSide(){
        return this.y * this.brick.height
    }
    zoneSouthSide(){
        return this.zoneNorthSide() + this.height * this.brick.height
    }
    incapacitatedCircles(){
        return this.incapacitatedCircles
    }

    //merges two zones together by taking in a zone as parameter and traverses the basezone's array to locate the proper
    //indexes to start adding bricks based on the zone's position and dimentions. 
    addZone(otherZone){    
        this.layout.map((row, rowIdx) => {
            if(rowIdx >= otherZone.y && rowIdx < otherZone.y + otherZone.height){
                let rowData = row.map((col, colIdx) => {
                    if(colIdx >= otherZone.x && colIdx < otherZone.x + otherZone.width){
                        return otherZone.brick
                    }else{
                        return this.layout[rowIdx][colIdx]
                    }
                }) 
                this.layout[rowIdx] = rowData;
            }
        })
        return this;
    }

    beAwareOfCircles(circleRepository){
        let buffer = 0;
        let circleWithinZone = circleRepository.filter((circle) =>{

        
                let circleXInZone = (circle.X > this.zoneWestSide()) && (circle.X < this.zoneEastSide())
                let circleYInZone = (circle.Y > this.zoneNorthSide()) && (circle.Y < this.zoneSouthSide())
                if(circleXInZone && circleYInZone){
                    //state that this is the current zone this circle is docked in
                    circle.CurrentSector = this
                    //make the circle immovable
                    circle.incapacitatedSwitch()

                    //if by chance a different colored circle from what the zone is placed in, then everything in that zone must explode
                    if (circle.flatColor !== this.flatColor){
                        this.zonesExplodeState = true;
                    }
                    //if circles belong to that sector while the zone is in an exploded state, those circles must explode
                    if(circle.currentSector == this && this.zonesExplodeState === true){
                        //go through all the circles to ensure getting all of them that are in this sector and explode all of them
                        circleRepository.forEach((circle) => {
                            if(circle.currentSector == this){
                                circle.ExplodeState = 2;
                                circle.Color = circle.ExplodeColor;
                                circle.display()
                            }
                        })
                    }
        
                }

                return circleXInZone && circleYInZone
        })
        this.count = circleWithinZone.length
    }
}

class GenerateLayer{
    layer;
    savedBricks;
    savedSpawns;

    constructor(layer){
        this.layer = layer;
        this.savedBricks = [];
        this.savedSpawns = [];
    }

    implimentBricksFromLayer(){
        //access each the rows of a layer (up and down, y)
        for(let i = 0; i < this.layer.length; i++){
            //access each the columns of a row (left and right, x)
            for(let j = 0; j < this.layer[i].length; j++){
                //define a brick
                let brick = this.layer[i][j];
                //continue if the brick is visible
                if(brick.isVisible){  
                    //identify the brick so thst it can calculate its position
                    brick.IdX = j;
                    brick.IdY = i;
                    //display the bricks
                    brick.display();
                    //holyshit javascript is dumb sometimes :joy:
                    //finally resolves issue with coordinates being the same in the end
                    let newBrick = Object.assign({}, brick)
                    this.savedBricks.push(newBrick)
                    if(brick.isSpawn == true){
                        this.savedSpawns.push(newBrick)
                    }          
                }
            } 
        }
    }

    get SavedBricks(){
        return this.savedBricks
        
    }

    get SavedSpawns(){
        return this.savedSpawns
    }
}

