function createplayer(){
	let cursors;
    let pad1;
	player = game.add.sprite(window.innerWidth/2, window.innerHeight/2,"player");
	game.physics.enable(player, Phaser.Physics.ARCADE);
	player.anchor.set(0.5, 0.5);
	cursors = game.input.keyboard.createCursorKeys(); 
	player.speed = 500;
	/*player.body.drag.set(100);*/
    player.body.maxVelocity.set(800);
    player.body.setSize(50,50, 27, 35);
    // animation player
   	let move = player.animations.add('move');
	player.animations.play('move', 10, true);
    // pad controls
    game.input.gamepad.start(); 
    pad1 = game.input.gamepad.pad1;

	player.update = function(){
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    /*player.body.angularVelocity = 0;*/
	// Move up with keyboard or gamepad
    if (cursors.up.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y)<-0.1)
    {
        game.physics.arcade.accelerationFromRotation(player.rotation, 300, player.body.velocity);
        /*game.physics.arcade.velocityFromAngle(player.angle, 300, player.body.velocity);*/
    }
    // Move down with keyboard or gamepad
    else if (cursors.down.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN)|| pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) >0.1)
    {
        game.physics.arcade.accelerationFromRotation(player.rotation, -300, player.body.velocity);
    }
    else
    {
        player.body.acceleration.set(0);
    }
    // Rotate left with keyboard or gamepad
    if (cursors.left.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X)<-0.1)
    {
        player.body.angularVelocity = -300;
    }
    // Rotate right with keyboard or gamepad
    else if (cursors.right.isDown  || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN)|| pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) >0.1)
    {
        player.body.angularVelocity = 300;
    }
    else 
    {
        player.body.angularVelocity = 0;
    }
    screenWrap(player);
    // Faire revenir les balles qui sortent de l'écran
    /*bullets.forEachExists(screenWrap, this);*/
	return player; 
	}; 
}
function screenWrap (player) {

    if (player.x < 0)
    {
        player.x = game.width;
    }
    else if (player.x > game.width)
    {
        player.x = 0;
    }

    if (player.y < 0)
    {
        player.y = game.height;
    }
    else if (player.y > game.height)
    {
        player.y = 0;
    }

}