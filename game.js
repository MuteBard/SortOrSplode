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
    gap = true;
    visible;
    obstacle;
    spawn;
    
    constructor(context, width, height, color, behaviorType){
        super(context, null, null, width, height, color)
        this.visible = behaviorType.isVisible;
        this.obstacle = behaviorType.isObstacle;
        this.spawn = behaviorType.isSpawn
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

    get toggleGap(){
        this.gap = this.gap == 2 ? 0 : 2;
        return this.gap;
    }

}

class Circle extends Entity{
    ballSpeedX;
    ballSpeedY;
    trueCenterX;
    trueCenterY;
    radius;
    invulerable = false;

    constructor(context, x, y, dirX, dirY, radius, color){
        super(context, x, y, color)
        this.color = color;
        this.trueCenterX = x;
        this.trueCenterY = y;
        this.radius = radius;
        this.ballSpeedX = 5 * dirX;
        this.ballSpeedY = 5 * dirY;
    }

    invulerableSwitch(){
        this.invulerable = true;
        setTimeout(() => this.invulerable = false, 100);  
    }

    get Radius(){
        return this.radius;
    }
    
    isCollildingWith(entity){
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
                max : 58,
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
                // let otherLeftSide = entity.x
                // let otherTopSide = entity.y
                // let otherRightSide = entity.x + entity.width
                // let otherBottomSide = entity.y + entity.height

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
        if(mouse.pressed == true){
            this.isInteractingWithMouse(mouse)
        }
        // this.drawLinesBetween(mouse.x, mouse.y)
        
    }




    drawLinesBetween(entityX, entityY){
        this.Context.strokeStyle = "#0000FF";
        this.Context.beginPath();
        this.Context.moveTo(super.X, super.Y);
        this.Context.lineTo(entityX, entityY);
        this.Context.stroke();
    }



    move(canvas){
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

    
    display(){
        this.Context.fillStyle = super.Color;
        this.Context.beginPath();
        this.Context.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
        this.Context.fill();
    }

}

class Zone{
    x;
    y;
    width;
    height;
    brick;
    layout;

    constructor(x, y, width, height, brick, layout){
        if(layout == null){
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.brick = brick;
            let row = Array(width).fill(brick);
            this.layout = Array(height).fill(row)
        }
        else if (x === null && y === null && width === null, height === null, brick === null){
            this.x = 0;
            this.y = 0;
            this.width = layout[0].length
            this.height = layout.length
            this.brick = null
            this.layout = layout
        }
    }

    getLayout(){
        return this.layout;
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
var circleRepository = Array(10).fill(new Circle());
var pendingCircleInitialization = true;
var spawns = [];
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
    }
}
var layers = {
    "lvl1" : 
        ((context) => {

        //Define the size, color and behavior of a brick
        var bricks = [
            new Brick(context, 25, 25, "#EAEAEA", behavior.scene),
            new Brick(context, 25, 25, "#FF5733", behavior.scene),
            new Brick(context, 25, 25, "#BB3030", behavior.sector),
            new Brick(context, 25, 25, "#950DEC", behavior.sector),
            new Brick(context, 25, 25, "#FFFF00", behavior.sector),
            new Brick(context, 25, 25, "#808080", behavior.spawn)
        ]

        //Define the size and position and the type of brick used to create zones and add to the zones array
        let zones = [];
        zones.push(new Zone(0, 0, 32, 29, bricks[0]));

        zones.push(new Zone(0, 9, 8, 11, bricks[1]))
        zones.push(new Zone(1, 10, 6, 9, bricks[2]))
        
        zones.push(new Zone(24, 9, 8, 11, bricks[1]))
        zones.push(new Zone(25, 10, 6, 9, bricks[3]))

        zones.push(new Zone(15, 0, 2, 1, bricks[5]))
        zones.push(new Zone(15, 28, 2, 1, bricks[5]))

        //merge all the bricks together
        let ZonesFullySuperimposed = zones.reduce((oldZone, newZone) => oldZone.addZone(newZone))
        return ZonesFullySuperimposed.getLayout()

    })
}
let mouse = {
    x : 0 ,
    y : 0,
    pressed : false,
    holding : null
}

window.onload = () => {
    //this is so that we can access the width and the height
    canvas = document.getElementById("SOS");
    //this is so we have access to the graphics buffer. Graphical text, lines, colors, fill, shapes
    canvasContext = canvas.getContext('2d');
    var framesPerSecond = 30;
    setInterval(drawCode, 1000/framesPerSecond);
    canvas.addEventListener('mousemove', updateMousePos)
    canvas.addEventListener('mousedown', toggleDrag)
}

var drawCode = () => {
    createWindow();
    displayLayers();
    if(pendingCircleInitialization){
        circleRepository = initializeSpawns()
        pendingCircleInitialization = false;
    }
    displayCircles(circleRepository)
    implementCircleInteraction()
    displayMouseCoordinates()
}

var createWindow = () => {
    canvasContext.fillStyle = '#0099FF';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
}

var displayLayers = () => {
    let layout = layers["lvl1"]
    generateLayout = new GenerateLayer(layout(canvasContext));
    generateLayout.implimentBricksFromLayer();
    spawns = generateLayout.SavedSpawns
}

var displayCircles = (circleRepository) =>{
    circleRepository.map(circle => {
        circle.display()
        circle.move(canvas)
    })
}

var implementCircleInteraction = () => {
        collisionWithBricksActive()
        interactionWithMouseActive()
}

var collisionWithBricksActive = () => {
    circleRepository.map(circle => {
        circle.beAwareOfBricks(generateLayout.SavedBricks)
    })
}

var interactionWithMouseActive = () => {
    circleRepository.map(circle => {
        circle.beAwareOfMouse(mouse)
    })
}

var initializeSpawns = () => {
    return circleRepository.map(circle => {
        index = Math.floor((Math.random() * spawns.length));
        let x = spawns[index].x
        let y = spawns[index].y
        let dirX = directionRandomization()
        let dirY = directionRandomization()
        let color = colorRandomization()

        circle = new Circle(canvasContext, x, y, dirX, dirY, 20, color)
        return circle
    })
}

var colorRandomization = () => {
    colorId = Math.floor((Math.random() * 2));
    if(colorId === 0) return "#FF0000"
    else if(colorId === 1) return "#0000FF"
}

var directionRandomization = () => {
    return((Math.random() * 2) - 1);
}

var displayMouseCoordinates = () => {
    canvasContext.font = "10px Arial";
    canvasContext.fillStyle = "#0E0EFF";
    canvasContext.fillText(`(${mouse.x},${mouse.y})`, mouse.x, mouse.y)
    
}

var toggleDrag = () => {
     mouse.pressed = mouse.pressed == false ? true : false
     if(mouse.pressed == false){
        mouse.holding = null  
     }
}

var updateMousePos = (e) => {
    //Return the size of an element and its position relative to the viewport
    //https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_element_getboundingclientrect
    var rect = canvas.getBoundingClientRect();
    //get access to the number of pixels the content of a <div> element is scrolled horizontally and vertically
    //https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_element_scrollleft
    var root = document.documentElement;
    mouse.x = e.clientX - rect.left - root.scrollLeft;
    mouse.y = e.clientY - rect.top - root.scrollTop;
    //center the cursor to the center of the paddle
}


