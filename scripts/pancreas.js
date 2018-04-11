function createpancreas(){
	pancreas1 = game.add.sprite(window.innerWidth-window.innerWidth -10,window.innerHeight*0.85,"pancreas1");
   	let move = pancreas1.animations.add('move');
	pancreas1.animations.play('move',10, true);
}; 

function createpancreas2(){
	pancreas2 = game.add.sprite(window.innerWidth*0.9,window.innerHeight*0.85,"pancreas2");
   	let move = pancreas2.animations.add('move');
	pancreas2.animations.play('move',10, true);
};

function createpancreas3(){
	pancreas3 = game.add.sprite(window.innerWidth-window.innerWidth -10,0,"pancreas3");
   	let move = pancreas3.animations.add('move');
	pancreas3.animations.play('move',10, true);
};

function createpancreas4(){
	pancreas4 = game.add.sprite(window.innerWidth*0.9,0,"pancreas4");
   	let move = pancreas4.animations.add('move');
	pancreas4.animations.play('move',10, true);
}