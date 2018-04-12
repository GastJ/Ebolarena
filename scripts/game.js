let w = window.innerWidth;
let h = window.innerHeight;
let game = new Phaser.Game(w, h, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render }); 
let explosions;
let score = 0;
let highscore = 0;
let lives;
let enemyBullet;
let livingEnemies = [];
let player;
let pancreas1 = 0;
let pancreas2 = 0; 
let pancreas3 = 0;
let pancreas4 = 0;
let bulletTime = 0;
let angleTir = 0;
let generateEnemies = 10;
let generateCell = 3;
let generateInterferon = 1;
let tabX = [0, 1920];
let tabY = [0, 1080];
let comboMultiplier = 1; 
let count = 0;
let video;
let sprite;
let pad1;


function preload(){

    game.load.image("gameBg", "assets/images/map1.png", 1920, 1080);
    game.load.image("gameBg2", "assets/images/map2.png", 1920, 1080);
    game.load.image("gameBg3", "assets/images/map3.png", 1920, 1080);
    game.load.spritesheet("pancreas1", "assets/images/pancreasbasgauche.png", 155, 152, 4);
    game.load.spritesheet("pancreas2", "assets/images/pancreasbasdroite.png", 156.25, 152, 4);
    game.load.spritesheet("pancreas3", "assets/images/pancreashautgauche.png", 155, 152, 4);
    game.load.spritesheet("pancreas4", "assets/images/pancreashautdroite.png", 156.25, 152, 4);
    game.load.spritesheet("player", "assets/images/ebolaOK.png", 112, 112, 4); 
    game.load.spritesheet("bullet", "assets/images/finalShot.png", 25, 25); 
    game.load.spritesheet("enemy1", "assets/images/antithug.png", 38, 25, 4);
    game.load.spritesheet('kaboom', 'assets/images/explode.png', 128, 128, 16);
    game.load.spritesheet('cell', 'assets/images/cell1.png', 70, 70, 4);
    game.load.spritesheet('interferon', 'assets/images/interferon_boss.png', 222, 200, 4);
    game.load.image('play', 'assets/images/pause.png', 270, 180);
    /*game.load.image('retry','assets/images/retry7.png');
    game.load.image('menu','assets/images/menu7.png');*/
    game.load.spritesheet('retry','assets/images/retry-anime.png', 175, 150, 4);
    game.load.spritesheet('menu','assets/images/menu-anime.png', 160, 150, 4);
    game.load.image('gameover', 'assets/images/gameover5.png', 1920, 1080);
    game.load.image('lives','assets/images/lives.png', 77, 116);
    game.load.audio('boom', 'assets/sounds/bombe.ogg');
    game.load.audio('soundgame', 'assets/sounds/sonjeu.ogg');
    game.load.audio('laser', 'assets/sounds/laser.ogg');
    game.load.audio('soundgameover', 'assets/sounds/gameover.ogg');
    game.load.video('ebola', 'assets/images/ebola.mp4');

}; 
function goFullScreen(){
    // setting a background color
    game.stage.backgroundColor = "#555555";
    // using RESIZE scale mode
    game.world._definedSize = true;
    game.stage.disableVisibilityChange = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true; 
    /*game.scale.setScreenSize(true);*/ 
}
function create(){
	game.physics.startSystem(Phaser.Physics.ARCADE); 
    game.renderer.clearBeforeRender = false;
    game.renderer.roundPixels = true;  
    game.world.setBounds(0, 0, w, h);
    // fond
    bg = game.add.tileSprite(0, 0, 1920, 1080, 'gameBg');
    //bg.scale.setTo(0.8, 0.8); // comment this line if the background isn't well sized
    goFullScreen();
    // Joueur
    player = createplayer();
    /*cell = createCell();*/
    /*interferon = createInterferon();*/
    game.input.gamepad.start(); 
    pad1 = game.input.gamepad.pad1; 
    // Sons
    boom = game.add.audio('boom', 0.2);
    laser = game.add.audio('laser', 0);
    setTimeout(function(){
        laser.volume=0.1;
        soundgame.play();
    },2800);
    soundgame = game.add.audio('soundgame', 0.4,true);
    soundgameover = game.add.audio('soundgameover', 1);

    // Animations coins
    pancreas1 = createpancreas();
    pancreas2 = createpancreas2();
    pancreas3 = createpancreas3();
    pancreas4 = createpancreas4();

    // Ennemis
    enemies = game.add.group();
    enemies.enableBody = true; 
    cells = game.add.group();
    cells.enableBody = true;
    cells.visible = false;
    cells.health = 5;
    interferons = game.add.group();
    interferons.enableBody = true;
    interferons.visible = false;
    interferons.health = 50;
    coordooneesEnemies = Math.floor(Math.random()*3);
    setTimeout(function(){
        for (let j = 0 ; j < generateEnemies; j++)
        {
            enemy1 = enemies.create(w, h, 'enemy1');
            enemy1.exists = false; 
            enemy1.body.setSize(34,27, 2, 0);
            enemy1.scale.set(1.5,1.5);
            enemy1.checkWorldBounds = true;
            enemy1.outOfBoundsKill = true;
            // Animation ennemis
            enemy1.animations.add('enemy1');
            enemy1.animations.play('enemy1', 10, true);
        }
    },3500);
    // CELL
    for (let j = 0 ; j < generateCell; j++) {
        cell = cells.create(w, h, 'cell');
        cell.exists = false; 
        cell.body.setSize(50,65, 10, 0);
        cell.scale.set(1.5,1.5);
        cell.checkWorldBounds = true;
        cell.outOfBoundsKill = true;
        // Animation cell
        cell.animations.add('moveCell');
        cell.animations.play('moveCell', 10, true);
    }
    // INTERFERON
    for (let j = 0 ; j < generateInterferon; j++) {
        interferon = interferons.create(w, h, 'interferon');
        interferon.exists = false; 
        interferon.body.setSize(222,200, 0, 0);
        interferon.scale.set(1.5,1.5);
        /*interferon.checkWorldBounds = true;*/
        /*interferon.outOfBoundsKill = true;*/
        interferon.body.collideWorldBounds=true;
        /*interferon.body.gravity.x = 100;*/
        /*interferon.body.gravity.y = 100;*/
        interferon.body.bounce.setTo(0.4, 0.4);
        // Animation cell
        interferon.animations.add('moveInterferon');
        interferon.animations.play('moveInterferon', 10, true);
    }

    // Tirs
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(150, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    // explosions
    explosions = game.add.group();
    explosions.createMultiple(40, 'kaboom');
    explosions.forEach(setupEnemy,this);
    explosions.forEach(setupCell, this);
    explosions.forEach(setupInterferon, this);


    //  The score
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 50, scoreString + score, { font: '34px Bloody', fill: '#ffffff' });
    gamehighScoreString = 'Highscore : ';
    gamehighScoreText = game.add.text(10, 10, gamehighScoreString + localStorage.getItem("highscore"), { font: '34px Bloody', fill: '#ffffff' });
    
    // Combos
    comboString = 'Multiplier : ';
    // COMBOS
    comboText = game.add.text(10,90,'Multiplier : '+comboMultiplier + 'x',{font: '34px Bloody', fill:  '#ffffff'});

    //  Lives
    lives = game.add.group();
    game.add.text(game.world.width -115, 10, ': Lives ', { font: '34px Bloody', fill: '#ffffff' });

    //  Text
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Bloody', fill: '#CB1A1E' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    for (let i = 0; i < 5; i++) 
    {
        var player = lives.create(game.world.width - 285 + (30 * i), 50, 'lives');
        player.anchor.setTo(0.5, 0.5);
        player.angle = 0;
        player.alpha = 1;
    }

    pause_label = game.add.text(w/2.1, 20, 'Pause', { font: '34px Bloody', fill: '#ffffff' });
    pause_label.inputEnabled = true;
    pause_label.events.onInputUp.add(function () {
        // Met le jeu en pause quand clique sur bouton
        game.paused = true;

        // Puis ajoute le menu
        play = game.add.sprite(w/2, h/2, 'play');
        play.anchor.setTo(0.5, 0.5);

        // Phrase d'indication pour sortir du menu
        choiseLabel = game.add.text(w/2, h-150, 'Cliquer en dehors du menu pour revenir au jeu', { font: '30px Bloody', fill: '#ffffff' });
        choiseLabel.anchor.setTo(0.5, 0.5);
    });

    // Bouton Retry
    gameRetry = game.add.sprite(-1600, game.camera.y+400, "retry");
    gameRetry.anchor.set(0.5,0.5);
    gameRetry.visible = false;
    /*gameRetry.animations.add('moveRetry');
    gameRetry.animations.play('moveRetry', 10, true);*/

    // Bouton Menu
    gameMenu = game.add.sprite(-1600, game.camera.y+400, 'menu');
    gameMenu.anchor.set(0.5,0.5);
    gameMenu.visible = false;
    /*gameMenu.animations.add('moveMenu');
    gameMenu.animations.play('moveMenu', 10, true);*/

    // Bouton pour quitter pause
    game.input.onDown.add(unpause);

    // Fonction bouton pause
    function unpause(event){
        if(game.paused){
            // taille du menu pause
            let x1 = w/2 - 270/2, x2 = w/2 + 270/2,
            y1 = h/2 - 180/2, y2 = h/2 + 180/2;

            // regarde si le clique est à l'interieur du menu
            if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){

                // coordoonées du clique
                let x = event.x - x1,
                y = event.y - y1;
            }
            else{
                // enlève le menu et la phrase d'indication
                play.destroy();
                choiseLabel.destroy();

                // enlève la pause
                game.paused = false;
            }
        }
    };
    video = game.add.video('ebola');
    video.play();
    sprite = video.addToWorld(game.world.centerX, game.world.centerY, 0.5, 0.5,1.5,1.5);
    setTimeout(function(){
        sprite.destroy();
    },2600);
}
function conversion(){
    // Converts from degrees to radians
    Math.radians = function(degrees){
        return degrees * Math.PI / 180;
    }
    // Converts from radians to degrees
    Math.degrees = function(radians){
        return radians * 180/ Math.PI;
    }
}

function fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
        for(let i=0; i<2; i++){

        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
                //  And fire it
                bullet.reset(player.x + 10, player.y + 10);
                laser.play();
                conversion();
                if(i===0)
                    bullet.rotation = Math.degrees(Math.sin(Math.radians(angleTir)));
                else
                    bullet.rotation = Math.degrees(Math.sin(Math.radians(angleTir+180)));
                    bullet.rotation = player.rotation;
                    game.physics.arcade.velocityFromRotation(bullet.rotation, 400, bullet.body.velocity);
                    bulletTime = game.time.now + 200; // 70 (ancienne valeur)
            }
        }
        angleTir += 16;
    }

}

function collisionHandler (bullet, enemy1) {

    //  When a bullet hits an enemy we kill them both
    bullet.kill();
    enemy1.kill();
    if (enemy1.kill())
    {
        count += 1;
    }
    // score
    score += 100 * comboMultiplier;
    scoreText.text = scoreString + score;

    if (score >= localStorage.getItem("highscore")) 
    {
        gamehighScoreText.text = gamehighScoreString + score;
    }
    // combo
      
    if (comboMultiplier <= 7 && count == 15) 
    {
        comboMultiplier += 1;
        comboText.text = comboString+ comboMultiplier + "x" ;
    }
    else if(comboMultiplier <= 7 && count == 30)
    {
        comboMultiplier += 2;
        comboText.text = comboString+ comboMultiplier + "x" ;
    }
    else if(comboMultiplier <= 7 && count == 45)
    {
        comboMultiplier += 4;
        comboText.text = comboString+ comboMultiplier + "x" ;
    }

    // explosion
    let explosion = explosions.getFirstExists(false);
    explosion.reset(enemy1.body.x, enemy1.body.y);
    explosion.play('kaboom', 40, false, true);
    boom.play();
}
// COLLISION CELL
function collisionHandlerCell (bullet, cell) {
    bullet.kill();
    cells.health --;
    if(cells.health <= 0){
        cell.kill();
        /*count += 1;*/
        cells.health = 5;
        score += 500 * comboMultiplier;
        scoreText.text = scoreString + score;
        let explosion = explosions.getFirstExists(false);
        explosion.reset(cell.body.x+15, cell.body.y+10);
        explosion.play('kaboom', 40, false, true);
        boom.play();
    }

    if (score >= localStorage.getItem("highscore")) 
    {
        gamehighScoreText.text = gamehighScoreString + score;
    }
}
// COLLISION INTERFERON
function collisionHandlerInterferon (bullet, interferon) {
    bullet.kill();
    interferons.health --;
    if(interferons.health <= 0){
        interferon.kill();
        /*count += 1;*/
        interferons.health = 50;
        score += 10000 * comboMultiplier;
        scoreText.text = scoreString + score;
        let explosion = explosions.getFirstExists(false);
        explosion.reset(interferon.body.x+15, interferon.body.y+10);
        explosion.play('kaboom', 40, false, true);
        boom.play();
    }

    if (score >= localStorage.getItem("highscore")) 
    {
        gamehighScoreText.text = gamehighScoreString + score;
    }
}
function enemyHitsPlayer (player, enemy1) {

    enemy1.kill();
    me = this;
    live = lives.getFirstAlive();


    if (live && !me.hitCooldown)
    {   
        me.hitCooldown = true;
        live.kill();
        me.game.time.events.add(2500, function(){
            me.hitCooldown = false;
            player.tint = 0xffffff;
        },me);
        me.game.time.events.add(10, function(){
            player.tint = 0x00ffff;
        },me);
    }
    count = 0;
    // combo
    comboMultiplier = 1;
    comboText.text = comboString + comboMultiplier + "x";

    //  And create an explosion :)
    let explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x+25, player.body.y+15);
    explosion.play('kaboom', 40, false, true);
    boom.play();

    // When the player dies
    if (lives.countLiving() < 1)
    {
        player.destroy();
        enemies.destroy();
        cells.destroy();
        interferons.destroy();
        bullets.destroy();

        /*stateText.text=" GAME OVER \n Cliquez pour recommencer";
        stateText.visible = true;*/
        gameOver = game.add.sprite(w/2, h/2, 'gameover');
        gameOver.anchor.setTo(0.5, 0.5);
        gameOver.visible = true;
        gameMenu = game.add.button(w/1.615, h/1.582, 'menu', callMenu);
        gameMenu.visible = true;
        gameMenu.scale.setTo(1.3, 1.3);
        gameMenu.animations.add('moveMenu');
        gameMenu.animations.play('moveMenu', 9, true);
        gameRetry = game.add.button(w/4, h/1.6, 'retry', callIndex);
        gameRetry.visible = true;
        gameRetry.scale.setTo(1.3, 1.3);
        gameRetry.animations.add('moveRetry');
        gameRetry.animations.play('moveRetry', 9, true);
        soundgameover.play();
        //the "click to restart" handler
        /*game.input.onTap.addOnce(restart,this);*/
    }

}
// CELL HIT PLAYER
function cellHitsPlayer (player, cell) {
    cell.kill();
    me = this;
    live = lives.getFirstAlive();


    if (live && !me.hitCooldown)
    {   
        me.hitCooldown = true;
        live.kill();
        me.game.time.events.add(2500, function(){
            me.hitCooldown = false;
            player.tint = 0xffffff;
        },me);
        me.game.time.events.add(10, function(){
            player.tint = 0x00ffff;
        },me);
    }
    count = 0;
    // combo
    comboMultiplier = 1;
    comboText.text = comboString + comboMultiplier + "x";

    //  And create an explosion :)
    let explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x+25, player.body.y+15);
    explosion.play('kaboom', 40, false, true);
    boom.play();

    // When the player dies
    if (lives.countLiving() < 1)
    {
        player.destroy();
        enemies.destroy();
        cells.destroy();
        interferons.destroy();
        bullets.destroy();

        gameOver = game.add.sprite(w/2, h/2, 'gameover');
        gameOver.anchor.setTo(0.5, 0.5);
        gameOver.visible = true;
        gameMenu = game.add.button(w/1.615, h/1.582, 'menu', callMenu);
        gameMenu.visible = true;
        gameMenu.scale.setTo(1.3, 1.3);
        gameMenu.animations.add('moveMenu');
        gameMenu.animations.play('moveMenu', 9, true);
        gameRetry = game.add.button(w/4, h/1.6, 'retry', callIndex);
        gameRetry.visible = true;
        gameRetry.scale.setTo(1.3, 1.3);
        gameRetry.animations.add('moveRetry');
        gameRetry.animations.play('moveRetry', 9, true);
        soundgameover.play();
    }

}
// INTERFERON HIT PLAYER
function interferonHitsPlayer (player, interferon) {
    
    me = this;
    live = lives.getFirstAlive();


    if (live && !me.hitCooldown)
    {   
        me.hitCooldown = true;
        live.kill();
        me.game.time.events.add(2500, function(){
            me.hitCooldown = false;
            player.tint = 0xffffff;
        },me);
        me.game.time.events.add(10, function(){
            player.tint = 0x00ffff;
        },me);
        let explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x+25, player.body.y+15);
        explosion.play('kaboom', 40, false, true);
        boom.play();
    }
    count = 0;
    // combo
    comboMultiplier = 1;
    comboText.text = comboString + comboMultiplier + "x";

    // When the player dies
    if (lives.countLiving() < 1)
    {
        player.destroy();
        enemies.destroy();
        cells.destroy();
        interferons.destroy();
        bullets.destroy();

        gameOver = game.add.sprite(w/2, h/2, 'gameover');
        gameOver.anchor.setTo(0.5, 0.5);
        gameOver.visible = true;
        gameMenu = game.add.button(w/1.615, h/1.582, 'menu', callMenu);
        gameMenu.visible = true;
        gameMenu.scale.setTo(1.3, 1.3);
        gameMenu.animations.add('moveMenu');
        gameMenu.animations.play('moveMenu', 9, true);
        gameRetry = game.add.button(w/4, h/1.6, 'retry', callIndex);
        gameRetry.visible = true;
        gameRetry.scale.setTo(1.3, 1.3);
        gameRetry.animations.add('moveRetry');
        gameRetry.animations.play('moveRetry', 9, true);
        soundgameover.play();
    }

}
function setupEnemy (enemy1) {

    enemy1.anchor.x = 0.5;
    enemy1.anchor.y = 0.5;
    enemy1.animations.add('kaboom');

}
function setupCell (cell) {

    cell.anchor.x = 0.5;
    cell.anchor.y = 0.5;
    cell.animations.add('kaboom');

}
function setupInterferon (interferon) {

    interferon.anchor.x = 0.5;
    interferon.anchor.y = 0.5;
    interferon.animations.add('kaboom');

}
function update()
{
    let fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    if (fireButton.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_LEFT_TRIGGER=6)){
        fireBullet();
    }

    enemy1 = enemies.getFirstExists(false);
    cell = cells.getFirstExists(false);
    interferon = interferons.getFirstExists(false);

    if(enemy1)
    {
        /*rndX = game.rnd.integerInRange(-2500,3920); 
        rndY = game.rnd.integerInRange(-2000,3080);*/
        rndX = game.rnd.integerInRange(tabX[Math.round(Math.random())],tabX[Math.round(Math.random())]); 
        rndY = game.rnd.integerInRange(tabY[Math.round(Math.random())],tabY[Math.round(Math.random())]); 
        enemy1.reset(rndX, rndY); 
        game.physics.arcade.moveToObject(enemy1, player, 100); 
    }
    if(cell)
    {
        rndX = game.rnd.integerInRange(tabX[Math.round(Math.random())],tabX[Math.round(Math.random())]); 
        rndY = game.rnd.integerInRange(tabY[Math.round(Math.random())],tabY[Math.round(Math.random())]); 
        cell.reset(rndX, rndY); 
        game.physics.arcade.moveToObject(cell, player, 100); 
    }
    if(interferon)
    {
        rndX = game.rnd.integerInRange(tabX[Math.round(Math.random())],tabX[Math.round(Math.random())]); 
        rndY = game.rnd.integerInRange(tabY[Math.round(Math.random())],tabY[Math.round(Math.random())]); 
        interferon.reset(rndX, rndY); 
        game.physics.arcade.moveToObject(interferon, player, 100); 
    }
    // HIGHSCORE
    if (score > localStorage.getItem("highscore"))
    {
       localStorage.setItem("highscore", score);
    }
    /*gamehighScoreText.content = 'HIGHSCORE: ' + localStorage.getItem("highscore");*/
    // Changement background
    if (score == 10000 || score == 10100 || score == 10200 || score == 10300 || score == 10400 || score == 10500 || score == 10600 || score == 10700) 
    {
        bg.loadTexture('gameBg2');
        cells.visible = true;
    }
    if (score >= 10000){
        game.physics.arcade.collide(bullets, cells, collisionHandlerCell, null, this);
        game.physics.arcade.collide(player, cells, cellHitsPlayer, null, this);
    }
    /*if (score == 20000 || score == 20100 || score == 20200 || score == 20300 || score == 20400 || score == 20500 || score == 20600 || score == 20700) 
    {
        bg.loadTexture('gameBg3');
    }*/
    if (score == 30000 || score == 30100 || score == 30200 || score == 30300 || score == 30400 || score == 30500 || score == 30600 || score == 30700 || score == 30800 || score == 30900 || score == 31000 || score == 31100 || score == 31200 || score == 31300 || score == 31400 || score == 31500 || score == 31600 || score == 31700 || score == 31800 || score == 31900 || score == 32000 || score == 32100 || score == 32200 || score == 32300 || score == 32400 || score == 32500 || score == 32600 || score == 32700 || score == 32800 || score == 32900 || score == 33000 || score == 33100 || score == 33200 || score == 33300 || score == 33400 || score == 33500 || score == 33600 || score == 33700 || score == 33800 || score == 33900) 
    {
        bg.loadTexture('gameBg3');
        interferons.visible = true;
    }
    if (score >= 30000){
        game.physics.arcade.collide(bullets, interferons, collisionHandlerInterferon, null, this);
        game.physics.arcade.collide(player, interferons, interferonHitsPlayer, null, this);
    }

    // Activation collisions
    game.physics.arcade.collide(bullets, enemies, collisionHandler, null, this);
    /*game.physics.arcade.collide(bullets, cells, collisionHandlerCell, null, this);*/
    /*game.physics.arcade.collide(bullets, interferons, collisionHandlerInterferon, null, this);*/
    game.physics.arcade.collide(player, enemies, enemyHitsPlayer, null, this);
    /*game.physics.arcade.collide(player, cells, cellHitsPlayer, null, this);*/
    /*game.physics.arcade.collide(player, interferons, interferonHitsPlayer, null, this);*/

}
function render()
{
    /*enemies.forEachAlive(function(enemy)
    {
        game.debug.body(enemy);
    });*/

    /*cells.forEachAlive(function(cell)
    {
        game.debug.body(cell);
    });*/
    /*interferons.forEachAlive(function(interferon)
    {
        game.debug.body(interferon);
    });*/
    //game.debug.body(player);
}
/*function restart () 
{
    // Resets the life count
    lives.callAll('revive');
    // And brings the enemies back from the dead :)
    enemies.callAll('kill');

    // Ressuscite le joueur
    player.revive();

    // Remet le game background initial
    bg.loadTexture('gameBg');

    // Cache le game over et les boutons retry et menu
    gameOver.visible = false;
    // Restart le score
    game.world.remove(scoreText);
    game.world.remove(gamehighScoreText);
    score = 0;
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 50, scoreString + score, { font: '34px Bloody', fill: '#ffffff' });
    gamehighScoreString = 'Highscore : ';
    gamehighScoreText = game.add.text(10, 10, gamehighScoreString + localStorage.getItem("highscore"), { font: '34px Bloody', fill: '#ffffff' });
}*/
function callMenu(){
    document.location.href="menu.html";
}
function callIndex(){
    document.location.href="index.html";
}