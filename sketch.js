var bg
var runner, runnerimg, logimg, lpuddle, lpuddleimg, hearts, heartsimg, branches, branchimg1, branchimg2, stoneimg, lava, lava2,lava3 ,lavaimg, obstacle;
var heart1, heart2, heart3;
var gO, goimg, screen
var gameState="start"
var stepsGroup;
var heartsGroup;
var distance=0
var obstaclesGroup;
var x=130;
var jumpSound, cHSound, gOSound, tSound, bgSound;
var counter=3;
function preload(){
   bg=loadImage("volcano2.jpg");
   logimg=loadImage("log.png");
   lpuddleimg=loadImage("lava puddle.png");
   heartsimg=loadImage("heart.png");
   branchimg1=loadImage("branch1.png");
   branchimg2=loadImage("branch2.png");
   stoneimg=loadImage("stone.png")
   runnerimg=loadAnimation("running_girl 1.png", "running_girl 2.png", "running_girl 3.png", "running girl 4.png")
   lavaimg=loadImage("lava.jpg")
   goimg=loadImage("game over .png");
   screen=loadImage("screen.png");

   jumpSound=loadSound("jump sound.wav");
   cHSound=loadSound("heart collect.wav");
   gOSound=loadSound("game over.wav");
   tSound=loadSound("trip sound.wav");
   bgSound=loadSound("background music.mp3");

  
}
function setup() {
  createCanvas(1500,900);
  edges=createEdgeSprites();
  
  lava=createSprite(300, 880, 1500, 20);
  lava.addImage(lavaimg)
  lava2=createSprite(880, 880, 1500, 20);
  lava2.addImage(lavaimg);
  lava3=createSprite(1380, 880, 1500, 20);
  lava3.addImage(lavaimg);
  runner=createSprite(90, 760, 30, 30);
  runner.addAnimation("running girl", runnerimg);
  runner.scale=0.5
  gO=createSprite(700, 300, 50, 50);
  gO.addImage(goimg);
  gO.scale=2;

  heart1=createSprite(100, 100, 10, 10);
  heart1.addImage(heartsimg);
  heart1.scale=0.05;

  heart2=createSprite(180, 100, 10, 10);
  heart2.addImage(heartsimg);
  heart2.scale=0.05;

  heart3=createSprite(260, 100, 10, 10);
  heart3.addImage(heartsimg);
  heart3.scale=0.05;
  stepsGroup=new Group();
  obstaclesGroup = new Group();
  heartsGroup = new Group();
  
}


function draw() {
  background(bg); 

  if(gameState==="start"){
    background(screen);
    fill ("black");
    textSize(40)
    text ("Press space to jump",570, 160);
    text ("Dont fall into the lava or touch the branches", 440, 220);
    text ("If you do, you will lose a heart. You have 3 hearts in total",430, 280);
    text ("If all hearts are lost, you lose the game", 450, 360)
    text("you can collect hearts if you lose one", 500, 420);
    text("press 'm' to play", 565, 700)
    lava.visible = false;
    lava2.visible = false;
    lava3.visible = false;
    runner.visible = false;
    gO.visible = false;
    heart1.visible=false;
    heart2.visible=false;
    heart3.visible=false;
    stepsGroup.destroyEach();
    obstaclesGroup.destroyEach();

    if(keyDown("m")){
      gameState="play";
      heart1.visible=true;
      heart2.visible=true;
      heart3.visible=true;
    }
    
   } 
   runner.collide(edges[3]);
   runner.velocityY=runner.velocityY+0.8
   if(runner.isTouching(stepsGroup)){
    runner.velocityY=0;
  }
  runner.debug=true

   if(gameState==="play"){
    background(bg); 
    //bgSound.loop();
    if(keyDown("space")&& runner.y>=692){
      runner.velocityY=-30;
      jumpSound.play();
    }
    
    
  

    lava.visible = true;
    lava2.visible = true;
    lava3.visible = true;
    runner.visible = true;
    gO.visible = false;
    //heart1.visible=true;
    //heart2.visible=true;
   // heart3.visible=true;
    fill("white");
    textSize(30);
    text("Distance: "+ distance, 1200, 100);
    distance=distance+Math.round(getFrameRate()/60);

    spawnBranches();
    spawnSteps();
    spawnHearts();

    if(runner.isTouching(obstaclesGroup)){
      obstaclesGroup.destroyEach();
      switch(counter){
        case 3: heart3.visible=false; 
                counter=counter-1;
                break;
        case 2: heart2.visible=false; 
                 counter=counter-1;
                  break;  
        case 1: heart1.visible=false; 
                //counter=counter-1;
                gameState="end"
      }
    }
    if(runner.isTouching(heartsGroup)){
      heartsGroup.destroyEach();
      counter=counter+1
      var temp="heart"+counter;
      if(temp==="heart3"){
        heart3.visible=true
      }
      else if(temp==="heart2"){
        heart2.visible=true
      }
      
      cHSound.play();
      //console.log(temp);
      //console.log(counter)
    }
   }

   if (gameState==="end"){
      gO.visible=true
      stepsGroup.setVelocityXEach(0)
      obstaclesGroup.setVelocityXEach(0);
      fill("white");
      strokeWeight(3)
      textSize(30);
      text("press 'r' to restart", 600, 700);
      gOSound.play();


      if(keyDown("r")){
        gameState="play"
        stepsGroup.destroyEach();
        obstaclesGroup.destroyEach();
        distance=0;
        x=130;
        heart1.visible=true;
        heart2.visible=true;
        heart3.visible=true;
        counter=3
      }
   }

   drawSprites();

}

function spawnBranches(){
  if(frameCount%200===0){
    var branches=createSprite(1500, random(780, 890), 10,10);
    var rand=Math.round(random(1, 2));
    branches.velocity.x=-5
    switch(rand){
      case 1:branches.addImage(branchimg1);
             break;
      case 2:branches.addImage(branchimg2);
             break; 
      case 3:branches.addImage(lpuddleimg)             
    }
    branches.scale=0.3
    branches.lifetime=1000;
    obstaclesGroup.add(branches);
    branches.debug=true;
    //if(runner.isTouching(obstaclesGroup)){
      //tSound.play();
    //}
  }
}


function spawnSteps(){
  if(distance%100===0){
    x=x+50;
  }
    if(frameCount%x===0){
      var obstacle=createSprite(1500, random(800, 850), 50, 50);
      obstacle.velocity.x=-5
      var rand=Math.round(random(1,2));
      switch(rand){
        case 1 :obstacle.addImage(logimg);
                break;
        case 2:obstacle.addImage(stoneimg)  ;  
                break;    
       }
       obstacle.scale = 0.3;
      obstacle.lifetime = 1000;
      stepsGroup.add(obstacle);
      }
      if(runner.isTouching(stepsGroup)){
        tSound.play();
      }
  }
  
  

  function spawnHearts(){
    if(frameCount%700===0){
      var hearts=createSprite(1500, 600, 10,10);
      hearts.addImage(heartsimg);
      hearts.scale=0.04
      hearts.velocity.x=-5;
      hearts.lfetime=1000;
      heartsGroup.add(hearts)
      
    }
    
  }

