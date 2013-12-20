/* 
====================================
MOTEUR DU JEU
====================================
*/
function engine(){
	move(my_character); // check les déplacements du perso
	show_info(); // affiche les informations pour l'utilisateur (plus qu'optionnel)
	display_map(); // affiche la carte
	display_character(); // affiche le personnage
	check_end();
}
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
function load_sprites(){
	virtual_map.sprite = new Image();
	virtual_map.sprite.src = "img/map_sprite.png";

	my_character.sprite = new Image();
	my_character.sprite.src = "img/sprite.png";
	
	map_objects.sprite = new Image();
	map_objects.sprite.src = "img/objects_sprite.png";
}

function set_frames(){
	if( my_character.frame < my_character.max_frame ){
		my_character.frame += 1;
	}
	else{
		my_character.frame = 0;
	}
	setTimeout(set_frames, 1000/12);
}

// index de la map (permet de retrouver une case par son id)

function map_index(case_id,line,row){
	index[case_id] = { "i" : line , "j" : row };
}

// Déplacements du perso (tous les 1/60e de secondes, le navigateur déplace ou non le personnage) 

function move(object){
	// si flèche droite enfoncée
	if(controller.left == 0 && controller.right == 0 && controller.down == 0 && controller.up == 0){
		object.max_frame = 0;
	}
	else{
		object.max_frame = 4;
	}
	
	if(controller.right == 1){
		if(object.current_speed_x<0){
			object.current_speed_x = 0;
		}
		object.current_speed_x = Math.min(object.current_speed_x + 1,object.max_speed);
		object.next_case = virtual_map[index[object.case_id].i+1][index[object.case_id].j];
		if((object.next_case.space == 1 && virtual_map[index[object.case_id].i+1][index[object.case_id].j+1].space==1) || (object.next_case.space == 1 && virtual_map[index[object.case_id].i+1][index[object.case_id].j+1].space==0 && object.y <= visual_map.ratio-(object.height*visual_map.ratio))){
			object.x += object.current_speed_x;
		}
		else if (object.next_case.space == 0  || (object.next_case.space == 1 && virtual_map[index[object.case_id].i+1][index[object.case_id].j+1].space==0 && object.y > visual_map.ratio-(object.height*visual_map.ratio))){
			object.current_speed_x = Math.min(object.current_speed_x + 1,object.max_speed);
			object.x = Math.min(object.x + object.current_speed_x, visual_map.ratio - object.width * visual_map.ratio);
		}
		if(object.x >= visual_map.ratio){
			object.x -= visual_map.ratio;
			object.eq_x += 1;
			object.case_id = object.next_case.id;
		}
		object.sens = 0;
	}
	
	// si flèche gauche enfoncée
	
	if(controller.left == 1){
		if(object.current_speed_x>0){
			object.current_speed_x = 0;
		}
		object.next_case = virtual_map[index[object.case_id].i-1][index[object.case_id].j];
		if((object.next_case.space == 1 && virtual_map[index[object.case_id].i-1][index[object.case_id].j+1].space==1) || (object.next_case.space == 1 && virtual_map[index[object.case_id].i-1][index[object.case_id].j+1].space==0 && object.y <= visual_map.ratio-(object.height*visual_map.ratio))){
			object.current_speed_x = Math.max(object.current_speed_x - 1, -object.max_speed);
			object.x += object.current_speed_x;
		}
		else if (object.next_case.space == 0 || (object.next_case.space == 1 && virtual_map[index[object.case_id].i-1][index[object.case_id].j+1].space==0 && object.y > visual_map.ratio-(object.height*visual_map.ratio))){
			object.current_speed_x = Math.max(object.current_speed_x - 1, -object.max_speed);
			object.x = Math.max(object.x + object.current_speed_x, 0);
		}
		if(object.x < 0){
			object.x += visual_map.ratio;
			object.eq_x -= 1;
			object.case_id = object.next_case.id;
		}
		object.sens = 1;
	}
	
	// si flèche bas enfoncée
	
	if(controller.down == 1){
		if(object.current_speed_y < 0){
			object.current_speed_y = 0;
		}
		object.next_case = virtual_map[index[object.case_id].i][index[object.case_id].j+1];
		if((object.next_case.space == 1 && virtual_map[index[object.case_id].i+1][index[object.case_id].j+1].space==1) || (object.next_case.space == 1 && virtual_map[index[object.case_id].i+1][index[object.case_id].j+1].space==0 && object.x <= visual_map.ratio-(object.width*visual_map.ratio))){
			object.current_speed_y = Math.min(object.current_speed_y + 1, object.max_speed);
			object.y += object.current_speed_y;
		}
		else if (object.next_case.space == 0 || (object.next_case.space == 1 && virtual_map[index[object.case_id].i+1][index[object.case_id].j+1].space==0 && object.x > visual_map.ratio-(object.width*visual_map.ratio))){
			object.current_speed_y = Math.min(object.current_speed_y + 1, object.max_speed);
			object.y = Math.min(object.y + object.current_speed_y, visual_map.ratio - object.height * visual_map.ratio);
		}
		
		if(object.y >= visual_map.ratio){
			object.y -= visual_map.ratio;
			object.eq_y += 1;
			object.case_id = object.next_case.id; 
		}
	}
	
	// si flèche haut enfoncée
	
	if(controller.up == 1){
		if(object.current_speed_y > 0){
			object.current_speed_y = 0;
		}
		object.next_case = virtual_map[index[object.case_id].i][index[object.case_id].j-1];
		if((object.next_case.space == 1 && virtual_map[index[object.case_id].i+1][index[object.case_id].j-1].space==1) || (object.next_case.space == 1 && virtual_map[index[object.case_id].i+1][index[object.case_id].j-1].space==0 && object.x <= visual_map.ratio-(object.width*visual_map.ratio))){
			object.current_speed_y = Math.max(object.current_speed_y - 1, -object.max_speed);
			object.y += object.current_speed_y;
		}
		else if (object.next_case.space == 0 || (object.next_case.space == 1 && virtual_map[index[object.case_id].i+1][index[object.case_id].j-1].space==0 && object.x > visual_map.ratio-(object.width*visual_map.ratio))){
			object.current_speed_y = Math.max(object.current_speed_y - 1, -object.max_speed);
			object.y = Math.max(object.y + object.current_speed_y, 0);
		}
		if(object.y < 0){
			object.y += visual_map.ratio;
			object.eq_y -= 1;
			object.case_id = object.next_case.id;
		}
	}
	
	// appel au fonctions pour ralentir le perso
	
	if(controller.left == 0 && controller.right == 0){
		slowDownX();
	}
	if(controller.down == 0 && controller.up == 0){
		slowDownY();
	}
	
	
	
}

// fonction qui obtient un nombre aléatoire entre 0 et limit

function get_random(limit){
	var rand = parseInt(Math.random() * limit);
	return rand;
}


/* 
====================================
CANVAS DE LA CARTE
Crée la base de la carte, donnant à chaque case une coordonnée X et Y, et un ID référencé dans un index
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
			map_index(map_utilities.id,i,j);
			map_utilities.y += 1;
			map_utilities.id += 1;
		}
		virtual_map[i] = ligne;
		ligne = [ ]
		map_utilities.y -= limitH;
		map_utilities.x += 1;	
	}
	map_utilities.id=0;
	map_aleatoire(limitL,limitH);
	create_path(limitL,limitH);
}

function set_objects(positionI, positionJ){
	virtual_map[positionI][positionJ].content = objects[get_random(3)];
	
}


/* 
====================================
CARTE ALEATOIRE
Fonction qui remplit les cases de la carte avec des murs ou des sols, et ajoute les contenus; le tout aléatoirement
====================================
*/
function map_aleatoire(limitL,limitH){
	for(g=0; g<(limitL/3); g++){
		for(h=0; h<(limitH/3); h++){
			var lol = get_random(3);
			path.current = h*limitH + g;
			for(i=(g*3); i<(g*3)+3; i++){
				for(j=(h*3); j<(h*3)+3; j++){
					virtual_map[i][j].space = square.left[lol].map[i-(g*3)][j-(h*3)];
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
	path.currenty = get_random((limitH-6)/3);
	my_character.case_id = virtual_map[1][(path.currenty*3)+1].id;
	my_character.eq_x = (path.currentx*3) + 1;
	my_character.eq_y = (path.currenty*3) + 1;
	context.translate( 0 , -visual_map.scrolled_y)
	while(path.currentx < limitL/3){
		getSens(limitH);
		for(i=path.currentx*3; i<path.currentx*3+3; i++){
			for(j=path.currenty*3; j<path.currenty*3+3; j++){
				virtual_map[i][j].space = path_temp[path.coming][path.going].map[get_random(3)][i-(path.currentx*3)][j-(path.currenty*3)];
				virtual_map[i][j].material = virtual_map[i][j].space;
			}
		}
		lol = get_random(3);
		path.currentx += path_temp[path.coming][path.going].horizontal;
		path.currenty = Math.max(Math.min((path.currenty + path_temp[path.coming][path.going].vertical),((limitH-3)/3)),0);
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
	
	virtual_map[(path.currentx-1)*3 + 1][(path.currenty)*3 + 1].material = 2;
	virtual_map[(path.currentx-1)*3 + 2][(path.currenty)*3 + 1].material = 3;
	
	end.x = virtual_map[(path.currentx-1)*3 + 1][(path.currenty)*3 + 1].x;
	end.y = virtual_map[(path.currentx-1)*3 + 1][(path.currenty)*3 + 1].y;
}


function getSens(limitH){
	if(path.currenty >= (limitH-3)/3 && path.coming == 1){
		path.going = sens_when_down[0];
	}
	else if(path.currenty >= (limitH-3)/3 && path.coming == 0){
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
}


/* 
====================================
AFFICHAGE ET SCROLL DE LA CARTE
Fonction qui affiche la carte, et scroll si besoin est
====================================
*/
function scroll_map(){
	visual_map.eq_x = Math.min( Math.max( my_character.eq_x - visual_map.width/2 , 0 ) , map_utilities.limit_x - visual_map.width);
	visual_map.eq_y = Math.min( Math.max( my_character.eq_y - visual_map.height/2 , 0 ) , map_utilities.limit_y - visual_map.height + 2);
	
	if(my_character.eq_x >= visual_map.width/2 && my_character.eq_x <= map_utilities.limit_x - visual_map.width/2 - 1){
		visual_map.x = my_character.x
	}
	else{
		visual_map.x = 0;
	}
	if(my_character.eq_y >= visual_map.height/2 && my_character.eq_y <= map_utilities.limit_y - visual_map.height/2 + 1){
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
function display_character(){
	context.drawImage( my_character.sprite , 30 * my_character.frame, 60 * my_character.sens , 30 , 60 , my_character.eq_x*visual_map.ratio + my_character.x, my_character.eq_y * visual_map.ratio + my_character.y , my_character.width * visual_map.ratio , my_character.height * visual_map.ratio);
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
}


// affiche les infos
function show_info(){
	$(".cor_x").html(my_character.eq_x);
	$(".cor_y").html(my_character.eq_y);
	$(".id").html(my_character.case_id);
	$(".v_x").html(my_character.current_speed_x);
	$(".v_y").html(my_character.current_speed_y);
	$(".sm_x").html(my_character.x);
	$(".sm_y").html(my_character.y);
	$(".content").html(virtual_map[index[my_character.case_id].i][index[my_character.case_id].j].content.name);
	$(".map_x").html(visual_map.eq_x);
	$(".map_y").html(visual_map.eq_y);
	$(".end_x").html(end.x);
	$(".end_y").html(end.y);
}

// ralentir le perso en x

function slowDownX()
{
  if (my_character.current_speed_x > 0)
    my_character.current_speed_x -= 1;
  if (my_character.current_speed_x < 0)
    my_character.current_speed_x += 1;
}

// ralentir le perso en y

function slowDownY()
{
  if (my_character.current_speed_y > 0)
    my_character.current_speed_y -= 1;
  if (my_character.current_speed_y < 0)
    my_character.current_speed_y += 1;
}
