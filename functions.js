/* 
====================================
MOTEUR DU JEU
====================================
*/
function engine(){
	set_frames();
	move(my_character); // check les déplacements du perso
	collect(my_character); // Gère le rammassage d'objets
	attack();
	show_info(); // affiche la quantité d'or que le joueur possède
	display_map(); // affiche la carte
	displayElements(); // affiche le personnage
	check_end(); // Vérifie si le joueur a atteint la sortie
}


/* 
====================================
FIN DU JEU ? 
====================================
*/
function check_end(){
	if(my_character.eq_x == end.x && my_character.eq_y == end.y && my_character.x >= 10 && my_character.y <= 45){
		window.clearInterval(GameHeart)
		alert("Vous avez atteint la sortie !")
		location.reload();
	}
}


/* 
====================================
LOAD & SET SPRITES
Fonction qui assigne les sprites chargées au différents objets du jeu
====================================
*/
function set_frames(){
	if(frame_rate == 0){
		if( my_character.frame < my_character.max_frame - my_character.start_frame ){
			my_character.frame += 1;
		}
		else{
			my_character.frame = 0;
		}
	}
	frame_rate += 1;
	if(frame_rate == 4){
		frame_rate = 0;
	}
}


/* 
====================================
INDEX DE LA CARTE
Fonction qui crée un index (variable tableau) des cases en fonction de leur ID; appelé lors de la création de la carte
====================================
*/
function map_index(case_id,line,row){
	index[case_id] = { "i" : line , "j" : row };
}


/* 
====================================
COLLECTE D'OBJETS
Fonction qui se le contenu de la case sur laquelle se trouve le perso est collectable, et si oui, le collecte.
====================================
*/
function collect(object){
	if( virtual_map[index[object.case_id].i][index[object.case_id].j].content.inventaire == true ){
		object.inventaire.gold += virtual_map[index[object.case_id].i][index[object.case_id].j].content.valeur;
		virtual_map[index[object.case_id].i][index[object.case_id].j].content = objects[1];
	}
}

/* 
====================================
DEPLACEMENTS
Fonction dégueulasse qui gère les déplacements du personnage et les collisions, appelée à 60hertz par la fonction engine();
====================================
*/
function getCasePosition(AbsX, AbsY){
	var posX = Math.floor( (AbsX-1) / (visual_map.ratio) );
	var posY = Math.floor( (AbsY-1) / (visual_map.ratio) );
	return [posX,posY];
}

function move(object){
	// si flèche droite enfoncée
	if(controller.left == 0 && controller.right == 0 && controller.down == 0 && controller.up == 0){
		object.start_frame = object.animation.stop[0];
		object.max_frame = object.animation.stop[1];
	}
	else{
		object.start_frame = object.animation.walk[0];
		object.max_frame = object.animation.walk[1];
	}
	var oCC = getCasePosition( object.eq_x * visual_map.ratio + object.x , object.eq_y * visual_map.ratio + object.y );
	object.case_id = virtual_map[oCC[0]][oCC[1]].id
	
	if(controller.right == 1){
		if(object.current_speed_x<0){
			object.current_speed_x = 0;
		}
		object.current_speed_x = Math.min(object.current_speed_x + 1,object.max_speed);
		checkRightTop = getCasePosition( (object.eq_x * visual_map.ratio + object.x + object.current_speed_x + object.hitbox[0] + object.hitbox[2]) , (object.eq_y * visual_map.ratio + object.y + object.hitbox[1]) );
		checkRightBottom = getCasePosition( (object.eq_x * visual_map.ratio + object.x + object.current_speed_x + object.hitbox[0] + object.hitbox[2]) , (object.eq_y * visual_map.ratio + object.y + object.hitbox[1] + object.hitbox[3]) );
		if( virtual_map[checkRightTop[0]][checkRightTop[1]].space == 1 && virtual_map[checkRightBottom[0]][checkRightBottom[1]].space == 1 ){
			object.x += object.current_speed_x;
		}
		else{
			object.x = Math.min( object.x + object.current_speed_x , visual_map.ratio -1 + object.hitbox[0] );
		}
		object.sens = 0;
		my_character.sensX = 1;
	}
	if(controller.left == 1){
		if(object.current_speed_x>0){
			object.current_speed_x = 0;
		}
		object.current_speed_x = Math.max(object.current_speed_x - 1, -object.max_speed);
		checkLeftTop = getCasePosition( (object.eq_x * visual_map.ratio + object.x + object.current_speed_x + object.hitbox[0]) , (object.eq_y * visual_map.ratio + object.y + object.hitbox[1]) );
		checkLeftBottom = getCasePosition( (object.eq_x * visual_map.ratio + object.x + object.current_speed_x + object.hitbox[0]) , (object.eq_y * visual_map.ratio + object.y + object.hitbox[1] + object.hitbox[3]) );
		if( virtual_map[checkLeftTop[0]][checkLeftTop[1]].space == 1 && virtual_map[checkLeftBottom[0]][checkLeftBottom[1]].space == 1 ){
			object.x += object.current_speed_x;
		}
		else{
			object.x = Math.max( object.x + object.current_speed_x , 0 - object.hitbox[0] + 1);
		}
		object.sens = 1;
		my_character.sensX = -1;
	}
	if(controller.down == 1){
		if(object.current_speed_y < 0){
			object.current_speed_y = 0;
		}
		object.current_speed_y = Math.min(object.current_speed_y + 1, object.max_speed);
		checkLeftBottom = getCasePosition( (object.eq_x * visual_map.ratio + object.x + object.hitbox[0]) , (object.eq_y * visual_map.ratio + object.y + object.current_speed_y + object.hitbox[1] + object.hitbox[3]) );
		checkRightBottom = getCasePosition( (object.eq_x * visual_map.ratio + object.x + object.hitbox[0] + object.hitbox[2]) , (object.eq_y * visual_map.ratio + object.y + object.current_speed_y + object.hitbox[1] + object.hitbox[3]) );
		if( virtual_map[checkLeftBottom[0]][checkLeftBottom[1]].space == 1 && virtual_map[checkRightBottom[0]][checkRightBottom[1]].space == 1 ){
			object.y += object.current_speed_y;	
		}
		else{
			object.y = Math.min( object.y + object.current_speed_y , visual_map.ratio + object.hitbox[1] - 1);
		}
		my_character.sensY = 1;
	}
	if(controller.up == 1){
		if(object.current_speed_y > 0){
			object.current_speed_y = 0;
		}
		object.current_speed_y = Math.max(object.current_speed_y - 1, -object.max_speed);
		checkLeftTop = getCasePosition( (object.eq_x * visual_map.ratio + object.x + object.hitbox[0]) , (object.eq_y * visual_map.ratio + object.y + object.current_speed_y + object.hitbox[1]) );
		checkRightTop = getCasePosition( (object.eq_x * visual_map.ratio + object.x + object.hitbox[0] + object.hitbox[2]) , (object.eq_y * visual_map.ratio + object.y + object.current_speed_y + object.hitbox[1]) );
		if( virtual_map[checkLeftTop[0]][checkLeftTop[1]].space == 1 && virtual_map[checkRightTop[0]][checkRightTop[1]].space == 1 ){
			object.y += object.current_speed_y;	
		}
		else{
			object.y = Math.max( object.y + object.current_speed_y , 0 - object.hitbox[1] + 1);
		}
		my_character.sensY = -1;
	}
	
	if(object.x >= visual_map.ratio){
		object.x -= visual_map.ratio;
		object.eq_x += 1;
	}
	if(object.x < 0){
		object.x += visual_map.ratio;
		object.eq_x -= 1;
	}
	if(object.y >= visual_map.ratio){
		object.y -= visual_map.ratio;
		object.eq_y += 1;
	}
	if(object.y < 0){
		object.y += visual_map.ratio;
		object.eq_y -= 1;
	}
	
	// appel au fonctions pour ralentir le perso
	if(controller.left == 0 && controller.right == 0){
		my_character.sensX = 0;
		slowDownX();
	}
	if(controller.down == 0 && controller.up == 0){
		my_character.sensY = 0;
		slowDownY();
	}
}

function attack(){
	if(my_character.attack.hitting == false && controller.attack == 1){
		my_character.attack.hitting = true;
	}
	
	
	if(my_character.sensX == 1 && my_character.sensY == 0){
		my_character.setHitbox(my_character.width/2 * visual_map.ratio,-my_character.height/2 * visual_map.ratio,my_character.width * visual_map.ratio,my_character.height * visual_map.ratio);
	}
	else if(my_character.sensX == -1 && my_character.sensY == 0){
		my_character.setHitbox((-my_character.width/2-my_character.width) * visual_map.ratio,-my_character.height/2 * visual_map.ratio,my_character.width * visual_map.ratio,my_character.height * visual_map.ratio);
	}
	else if(my_character.sensX == 0 && my_character.sensY == 1){
		my_character.setHitbox(-my_character.width/2 * visual_map.ratio,my_character.height/2 * visual_map.ratio,my_character.width * visual_map.ratio,my_character.height * visual_map.ratio);
	}
	else if(my_character.sensX == -0 && my_character.sensY == -1){
		my_character.setHitbox(-my_character.width/2 * visual_map.ratio,(-my_character.height/2-my_character.height) * visual_map.ratio,my_character.width * visual_map.ratio,my_character.height * visual_map.ratio);
	}
	else if(my_character.sensX == 1 && my_character.sensY == 1){
		my_character.setHitbox(my_character.width/2 * visual_map.ratio,my_character.height/2 * visual_map.ratio,my_character.width * visual_map.ratio,my_character.height * visual_map.ratio);
	}
	else if(my_character.sensX == -1 && my_character.sensY == -1){
		my_character.setHitbox((-my_character.width/2-my_character.width) * visual_map.ratio,(-my_character.height/2-my_character.height) * visual_map.ratio,my_character.width * visual_map.ratio,my_character.height * visual_map.ratio);
	}
	else if(my_character.sensX == 1 && my_character.sensY == -1){
		my_character.setHitbox(my_character.width/2 * visual_map.ratio,(-my_character.height/2-my_character.height) * visual_map.ratio,my_character.width * visual_map.ratio,my_character.height * visual_map.ratio);
	}
	else if(my_character.sensX == -1 && my_character.sensY == 1){
		my_character.setHitbox((-my_character.width/2-my_character.width) * visual_map.ratio,my_character.height/2 * visual_map.ratio,my_character.width * visual_map.ratio,my_character.height * visual_map.ratio);
	}
	
	
	if(my_character.attack.hitting == true){
		
		my_character.start_frame = my_character.animation.attack[0];
		my_character.max_frame = my_character.animation.attack[1];
		my_character.attack.state += 1;
	/*
		if( (bot.x + bot.hitbox[0] <= my_character.x + my_character.attack.hitbox[2] + my_character.attack.hitbox[0]) && (bot.x + bot.hitbox[2] >= my_character.x + my_character.attack.hitbox[0]) && (bot.y + bot.hitbox[1] <= my_character.y + my_character.attack.hitbox[3] + my_character.attack.hitbox[1]) && (bot.y + bot.hitbox[3] >= my_character.y + my_character.attack.hitbox[1]) && my_character.attack.hitting == true){
			if(my_character.attack.hit == false){
				bot.life -= 1;
				my_character.attack.hit = true;
			}
		}
	*/
		if (my_character.attack.state > my_character.attack.length){
			my_character.attack.hitting = false;
			my_character.attack.hit = false;
			my_character.attack.state = 0;
		}
	}
	
	
}


/* 
====================================
ALEATOIRE
Fonction qui me permet d'obtenir un nombre aléatoire utilisable dans les tableau. Pas sûr que ce soit la méthode la plus optimisée mais jeme fais pas chier.
====================================
*/
function get_random(limit){
	var rand = parseInt(Math.random() * limit);
	return rand;
}


/* 
====================================
CANVAS DE LA CARTE
Crée la base de la carte, donnant à chaque case une coordonnée X et Y, et un ID et un contenu vide de base
====================================
*/
function create_map(limitL, limitH){
	for(i=0; i<limitL; i++){
		for(j=0; j<limitH; j++){
			ligne[j] = { 
				"id" : map_utilities.id , 
				"x" : map_utilities.x , 
				"y" : map_utilities.y , 
				"content" : { }
			};
			map_index(map_utilities.id,i,j); // ajoute la case à la variable index
			map_utilities.y += 1;
			map_utilities.id += 1;
		}
		virtual_map[i] = ligne;
		ligne = [ ];
		map_utilities.y -= limitH;
		map_utilities.x += 1;	
	}
	map_utilities.id=0;
	map_aleatoire(limitL,limitH);
	create_path(limitL,limitH);
}


/* 
====================================
OBJETS ALEATOIRES
Fonction qui ajoute des objets au contenu des cases
====================================
*/
function set_objects(positionI, positionJ){
	if(Math.random() < 0.1){
		virtual_map[positionI][positionJ].content = objects[get_random(2)];
	}
}


/* 
====================================
CARTE ALEATOIRE
Fonction qui remplit les cases de la carte avec des murs ou des sols, et ajoute les contenus; le tout aléatoirement
====================================
*/
function map_aleatoire(limitL,limitH){
	for(g=0; g<(limitL/5); g++){
		for(h=0; h<(limitH/5); h++){
			var lol = get_random(3);
			path.current = h*limitH + g;
			for(i=(g*5); i<(g*5)+5; i++){
				for(j=(h*5); j<(h*5)+5; j++){
					virtual_map[i][j].space = square.left[lol].map[i-(g*5)][j-(h*5)];
					virtual_map[i][j].material = virtual_map[i][j].space;
					
					if(virtual_map[i][j].space == 1){
						set_objects(i, j)
					}
				}
			}
		}
	}
}


/* 
====================================
CREATION D'UN CHEMIN
Fonction qui crée un chemin aléatoire de gauche à droite, et ajoute une sortie à la fin
====================================
*/
function create_path(limitL,limitH){
	path.currenty = get_random((limitH-10)/5); // définit à quelle hauteur le chemin va commencer
	my_character.case_id = virtual_map[1][(path.currenty*5)+1].id; // place le personnage à cette hauteur (pour qu'il se toruve bien sur le chemin au début !)
	my_character.eq_x = (path.currentx*5) + 1;
	my_character.eq_y = (path.currenty*5) + 1;
	context.translate( 0 , -visual_map.scrolled_y)
	while(path.currentx < limitL/5){
		path.going = getSens(limitH); // appel à la fonction getSens(), qui décide les possibilités de chemin
		for(i=path.currentx*5; i<path.currentx*5+5; i++){
			for(j=path.currenty*5; j<path.currenty*5+5; j++){
				virtual_map[i][j].space = path_temp[path.coming][path.going].map[i-(path.currentx*5)][j-(path.currenty*5)];
				virtual_map[i][j].material = virtual_map[i][j].space;
			}
		}
		if(bot.state == false){
			bot.eq_x = path.currentx*5 + 3;
			bot.eq_y = path.currenty*5 + 3;
			bot.ab_x = (path.currentx*5 + 3) *visual_map.ratio;
			bot.ab_y = (path.currenty*5 + 3) *visual_map.ratio;
			bot.state = true;
		}
		path.currentx += path_temp[path.coming][path.going].horizontal;
		path.currenty = Math.max(Math.min((path.currenty + path_temp[path.coming][path.going].vertical),((limitH-5)/5)),0);
		path.coming = path_temp[path.coming][path.going].exit;
	}
	
	
	for(i=0; i<limitL; i++){
		virtual_map[i][0].space = 0;
		virtual_map[i][limitH-1].space = 0;
		virtual_map[i][0].material = 0;
		virtual_map[i][limitH-1].material = 0;
	}
	for(j=0; j<limitH; j++){
		virtual_map[0][j].space = 0;
		virtual_map[limitL-1][j].space = 0;
		virtual_map[0][j].material = 0;
		virtual_map[limitL-1][j].material = 0;
	}
	
	virtual_map[(path.currentx-1)*5 + 3][(path.currenty)*5 + 1].material = 2;
	virtual_map[(path.currentx-1)*5 + 4][(path.currenty)*5 + 1].material = 3;
	
	end.x = virtual_map[(path.currentx-1)*5 + 3][(path.currenty)*5 + 1].x;
	end.y = virtual_map[(path.currentx-1)*5 + 3][(path.currenty)*5 + 1].y;
}


/* 
====================================
POSSIBILITES DE CHEMIN
Fonction qui donne les possibilités de chemin
====================================
*/
function getSens(limitH){
	if( path.currenty > 0 && path.currenty < (limitH-5)/5 ){
		path.going = sens_dispo[path.coming][get_random(3)];
		return path.going;
	}
	else{
		if(path.coming == 1 || path.coming == 2){
			path.going = 0;
			return path.going;
		}
		else if(path.coming == 0 && path.currenty == 0){
			path.going = get_random(2);
			return path.going;
		}
		else if(path.coming == 0 && path.currenty >= (limitH-5)/5 ){
			path.going = sens_dispo[3][get_random(2)];
			return path.going;
		}
	}
	

/*
	if(path.currenty >= (limitH-5)/5 && path.coming == 1){
		path.going = sens_when_down[0];
	}
	else if(path.currenty >= (limitH-5)/5 && path.coming == 0){
		path.going = 2;
	}
	else if(path.currenty == 0 && path.coming == 0){
		path.going = sens_dispo[path.coming][1];
	}
	else{
		path.going = sens_dispo[path.coming][get_random(3)];
	}
	if(path.currentx == 0 && path.currenty == 0){
		path.going = 0;
	}
*/
}

/* 
====================================
AFFICHAGE ET SCROLL DE LA CARTE
Fonction qui affiche la carte, et scroll si besoin est
====================================
*/
function scroll_map(){
	visual_map.eq_x = Math.min( Math.max( my_character.eq_x - visual_map.width/2 , 0 ) , map_utilities.limit_x - visual_map.width);
	visual_map.eq_y = Math.min( Math.max( my_character.eq_y - visual_map.height/2 , 0 ) , map_utilities.limit_y - visual_map.height);
	
	if(my_character.eq_x >= visual_map.width/2 && my_character.eq_x <= map_utilities.limit_x - visual_map.width/2 - 1){
		visual_map.x = my_character.x
	}
	else{
		visual_map.x = 0;
	}
	if(my_character.eq_y >= visual_map.height/2 && my_character.eq_y <= map_utilities.limit_y - visual_map.height/2 - 1){
		visual_map.y = my_character.y
	}
	else{
		visual_map.y = 0;
	}
	visual_map.to_scroll_x = visual_map.scrolled_x - (visual_map.eq_x * visual_map.ratio + visual_map.x);
	visual_map.to_scroll_y = visual_map.scrolled_y - (visual_map.eq_y * visual_map.ratio + visual_map.y);
	
	context.translate( visual_map.to_scroll_x , visual_map.to_scroll_y);
	visual_map.scrolled_x = visual_map.eq_x * visual_map.ratio + visual_map.x;
	visual_map.scrolled_y = visual_map.eq_y * visual_map.ratio + visual_map.y;
}
function display_map(){
	scroll_map();
	context.clearRect(-6000, -6000, 6000, 6000);
	for(j=Math.max(visual_map.eq_y-2,0); j<Math.min(visual_map.height+visual_map.eq_y+2,map_utilities.limit_y); j++){
		for(i=Math.max(visual_map.eq_x-2,0); i<Math.min(visual_map.width+visual_map.eq_x+2,map_utilities.limit_x); i++){
			context.drawImage(virtual_map.sprite, 100 * virtual_map[i][j].material, 0 , 100 , 100 ,i * visual_map.ratio, j * visual_map.ratio , visual_map.ratio, visual_map.ratio);
			context.drawImage(map_objects.sprite, 30 * virtual_map[i][j].content.look, 0 , 30 , 30 ,i * visual_map.ratio + 10, j * visual_map.ratio , 30 * virtual_map[i][j].content.size, 30 * virtual_map[i][j].content.size);
		}
	}
}


/* 
====================================
AFFICHAGE DU PERSONNAGE
Fonction qui affiche le personnage
====================================
*/
function displayElements(){
	drawHitbox();
	my_character.displayCharacter();
	if(my_character.attack.hitting == true){
		my_character.striking();
	}
}

function drawHitbox(){
	context.beginPath();
	context.fillStyle = "green";
	context.fillRect( my_character.eq_x * visual_map.ratio + my_character.x + my_character.attack.hitbox[0] , my_character.eq_y * visual_map.ratio + my_character.y  + my_character.attack.hitbox[1] , my_character.attack.hitbox[2] , my_character.attack.hitbox[3])
	context.closePath();
	context.beginPath();
	context.fillStyle = "blue";
	context.fillRect( my_character.eq_x * visual_map.ratio + my_character.x + my_character.hitbox[0] , my_character.eq_y * visual_map.ratio + my_character.y  + my_character.hitbox[1] , my_character.hitbox[2] , my_character.hitbox[3])
	context.closePath();
}


/* 
====================================
CONTROLES DU PERSONNAGE
Fonction qui gère les controles du personnage
====================================
*/
function keyDown(e){
	var code = e.keyCode ? e.keyCode : e.which;
	if (code == 38){
	controller.up = 1;
	}
	if (code == 40){
	controller.down = 1;
	}
	if (code == 37){
	controller.left = 1;
	controller.right = 0;
	}
	if (code == 39){
	controller.right = 1;
	controller.left = 0;
	}
	if (code == 88){
		controller.attack = 1;
	}
}

function keyUp(e){
	var code = e.keyCode ? e.keyCode : e.which;
	if (code == 38){
	controller.up = 0;
	}
	if (code == 40){
	controller.down = 0;
	}
	if (code == 37){
	controller.left = 0;
	}
	if (code == 39){
	controller.right = 0;
	}
	if (code == 88){
		controller.attack = 0;
	}
}


/* 
====================================
INFOS
Fonction qui affiche les informations du personnage
====================================
*/
function show_info(){
}


/* 
====================================
RALENTIR X
Fonction qui ralentit le personnage en x
====================================
*/
function slowDownX()
{
  if (my_character.current_speed_x > 0)
    my_character.current_speed_x -= 1;
  if (my_character.current_speed_x < 0)
    my_character.current_speed_x += 1;
}


/* 
====================================
RALENTIR Y
Fonction qui ralentit le personnage en y
====================================
*/
function slowDownY()
{
  if (my_character.current_speed_y > 0)
    my_character.current_speed_y -= 1;
  if (my_character.current_speed_y < 0)
    my_character.current_speed_y += 1;
}


function pause(){
	clearInterval(GameHeart);
}
function unPause(){
	GameHeart = setInterval(function(){engine()},1000/60);
}

function openInventory(){
	$("#pause").stop(true,true);
	$("#pause").fadeIn(500);
	pause();
}
function closeInventory(){
	$("#pause").fadeOut(500,function(){unPause()});
}