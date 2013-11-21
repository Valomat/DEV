// Moteur du jeu à 60hertz secondes

function engine(){
	move_char(); // check les déplacements du perso
	show_info(); // affiche les informations pour l'utilisateur (plus qu'optionnel)
	display_map(); // affiche la carte
	display_character(); // affiche le personnage
	setTimeout(engine, 1000/60); // 60 hertz
}

// index de la map (permet de retrouver une case par son id)

function map_index(case_id,line,row){
	index[case_id] = { "i" : line , "j" : row };
}

// Déplacements du perso (tous les 1/60e de secondes, le navigateur déplace ou non le personnage) 

function move_char(){

	// si flèche droite enfoncée
	
	if(controller.right == 1){
		if(my_character.current_speed_x<0){
			my_character.current_speed_x = 0;
		}
		my_character.current_speed_x = Math.min(my_character.current_speed_x + 1,my_character.max_speed);
		my_character.next_case = virtual_map[index[my_character.case_id].i+1][index[my_character.case_id].j];
		if((my_character.next_case.space == 1 && virtual_map[index[my_character.case_id].i+1][index[my_character.case_id].j+1].space==1) || (my_character.next_case.space == 1 && virtual_map[index[my_character.case_id].i+1][index[my_character.case_id].j+1].space==0 && my_character.y <= visual_map.ratio-(my_character.height*visual_map.ratio))){
			my_character.x += my_character.current_speed_x;
		}
		else if (my_character.next_case.space == 0  || (my_character.next_case.space == 1 && virtual_map[index[my_character.case_id].i+1][index[my_character.case_id].j+1].space==0 && my_character.y > visual_map.ratio-(my_character.height*visual_map.ratio))){
			my_character.current_speed_x = Math.min(my_character.current_speed_x + 1,my_character.max_speed);
			my_character.x = Math.min(my_character.x + my_character.current_speed_x, visual_map.ratio - my_character.width * visual_map.ratio);
		}
		visual_map.eq_x = Math.min(Math.max(my_character.eq_x - visual_map.width/2, 0), map_utilities.limit_x - visual_map.width - 1);
		if(visual_map.eq_x == my_character.eq_x - visual_map.width/2&& visual_map.x < visual_map.ratio * (map_utilities.limit_x -visual_map.width) - my_character.max_speed && visual_map.scroll_x != my_character.x ){
			context.translate(- my_character.current_speed_x, 0);
			visual_map.x += my_character.current_speed_x;
		}
		
		if(my_character.x >= visual_map.ratio){
			my_character.x -= visual_map.ratio;
			my_character.eq_x += 1;
			my_character.case_id = my_character.next_case.id;
		}
		
		visual_map.scroll_x = my_character.x;
	}
	
	// si flèche gauche enfoncée
	
	if(controller.left == 1){
		if(my_character.current_speed_x>0){
			my_character.current_speed_x = 0;
		}
		my_character.next_case = virtual_map[index[my_character.case_id].i-1][index[my_character.case_id].j];
		if((my_character.next_case.space == 1 && virtual_map[index[my_character.case_id].i-1][index[my_character.case_id].j+1].space==1) || (my_character.next_case.space == 1 && virtual_map[index[my_character.case_id].i-1][index[my_character.case_id].j+1].space==0 && my_character.y <= visual_map.ratio-(my_character.height*visual_map.ratio))){
			my_character.current_speed_x = Math.max(my_character.current_speed_x - 1, -my_character.max_speed);
			my_character.x += my_character.current_speed_x;
		}
		else if (my_character.next_case.space == 0 || (my_character.next_case.space == 1 && virtual_map[index[my_character.case_id].i-1][index[my_character.case_id].j+1].space==0 && my_character.y > visual_map.ratio-(my_character.height*visual_map.ratio))){
			my_character.current_speed_x = Math.max(my_character.current_speed_x - 1, -my_character.max_speed);
			my_character.x = Math.max(my_character.x + my_character.current_speed_x, 0);
		}
		visual_map.eq_x = Math.min(Math.max(my_character.eq_x - visual_map.width/2, 0), map_utilities.limit_x - visual_map.width - 1);
		if(visual_map.eq_x == my_character.eq_x - visual_map.width/2 && visual_map.x > my_character.max_speed && visual_map.scroll_x != my_character.x){
			context.translate(- my_character.current_speed_x, 0);
			visual_map.x += my_character.current_speed_x;
		}
		if(my_character.x < 0){
			my_character.x += visual_map.ratio;
			my_character.eq_x -= 1;
			my_character.case_id = my_character.next_case.id;
		}
		visual_map.scroll_x = my_character.x;
	}
	
	// si flèche bas enfoncée
	
	if(controller.down == 1){
		if(my_character.current_speed_y < 0){
			my_character.current_speed_y = 0;
		}
		my_character.next_case = virtual_map[index[my_character.case_id].i][index[my_character.case_id].j+1];
		if((my_character.next_case.space == 1 && virtual_map[index[my_character.case_id].i+1][index[my_character.case_id].j+1].space==1) || (my_character.next_case.space == 1 && virtual_map[index[my_character.case_id].i+1][index[my_character.case_id].j+1].space==0 && my_character.x <= visual_map.ratio-(my_character.width*visual_map.ratio))){
			my_character.current_speed_y = Math.min(my_character.current_speed_y + 1, my_character.max_speed);
			my_character.y += my_character.current_speed_y;
		}
		else if (my_character.next_case.space == 0 || (my_character.next_case.space == 1 && virtual_map[index[my_character.case_id].i+1][index[my_character.case_id].j+1].space==0 && my_character.x > visual_map.ratio-(my_character.width*visual_map.ratio))){
			my_character.current_speed_y = Math.min(my_character.current_speed_y + 1, my_character.max_speed);
			my_character.y = Math.min(my_character.y + my_character.current_speed_y, visual_map.ratio - my_character.height * visual_map.ratio);
		}
		visual_map.eq_y = Math.min(Math.max(my_character.eq_y - visual_map.height/2, 0), map_utilities.limit_y - visual_map.height - 1);
		if(visual_map.eq_y == my_character.eq_y - visual_map.height/2 && visual_map.y < visual_map.ratio * (map_utilities.limit_y -visual_map.height) - my_character.max_speed && visual_map.scroll_y != my_character.y ){
			context.translate(0, - my_character.current_speed_y);
			visual_map.y += my_character.current_speed_y;
		}
		
		if(my_character.y >= visual_map.ratio){
			my_character.y -= visual_map.ratio;
			my_character.eq_y += 1;
			my_character.case_id = my_character.next_case.id; 
		}
		
		
		visual_map.scroll_y = my_character.y;
	}
	
	// si flèche haut enfoncée
	
	if(controller.up == 1){
		if(my_character.current_speed_y > 0){
			my_character.current_speed_y = 0;
		}
		my_character.next_case = virtual_map[index[my_character.case_id].i][index[my_character.case_id].j-1];
		if((my_character.next_case.space == 1 && virtual_map[index[my_character.case_id].i+1][index[my_character.case_id].j-1].space==1) || (my_character.next_case.space == 1 && virtual_map[index[my_character.case_id].i+1][index[my_character.case_id].j-1].space==0 && my_character.x <= visual_map.ratio-(my_character.width*visual_map.ratio))){
			my_character.current_speed_y = Math.max(my_character.current_speed_y - 1, -my_character.max_speed);
			my_character.y += my_character.current_speed_y;
		}
		else if (my_character.next_case.space == 0 || (my_character.next_case.space == 1 && virtual_map[index[my_character.case_id].i+1][index[my_character.case_id].j-1].space==0 && my_character.x > visual_map.ratio-(my_character.width*visual_map.ratio))){
			my_character.current_speed_y = Math.max(my_character.current_speed_y - 1, -my_character.max_speed);
			my_character.y = Math.max(my_character.y + my_character.current_speed_y, 0);
		}
		
		visual_map.eq_y = Math.min(Math.max(my_character.eq_y - visual_map.height/2, 0), map_utilities.limit_y - visual_map.height - 1);
		if(visual_map.eq_y == my_character.eq_y - visual_map.height/2 && visual_map.y > my_character.max_speed && visual_map.scroll_y != my_character.y){
			context.translate(0, - my_character.current_speed_y);
			visual_map.y += my_character.current_speed_y;
		}
		if(my_character.y < 0){
			my_character.y += visual_map.ratio;
			my_character.eq_y -= 1;
			my_character.case_id = my_character.next_case.id;
		}
		visual_map.scroll_y = my_character.y;
	}
	
	// appel au fonctions pour ralentir le perso
	
	if(controller.left == 0 && controller.right == 0){
		slowDownX();
	}
	if(controller.down == 0 && controller.up == 0){
		slowDownY();
	}
	
}

// fonction inutilisée pour l'instant

function scroll_map(){
	visual_map.eq_x = Math.min(Math.max(my_character.eq_x - visual_map.width/2, 0), map_utilities.limit_x - visual_map.width - 1);
	visual_map.eq_y = Math.min(Math.max(my_character.eq_y - visual_map.height/2, 0), map_utilities.limit_x - visual_map.height - 1);
	if(visual_map.eq_x == my_character.eq_x - visual_map.width/2 && visual_map.x - my_character.x !=  0){
		context.translate(-my_character.current_speed_x, 0);
	}
	if(visual_map.eq_y == my_character.eq_y - visual_map.height/2 && visual_map.y - my_character.y !=  0){
		context.translate(0, -my_character.current_speed_y);
	}
	visual_map.y = my_character.y;

	
	
	
	/*

		if(controller.left == 1){
			if(visual_map.eq_x * visual_map.ratio + visual_map.x > 0){
				context.translate(visual_map.scroll_speed, 0)
				visual_map.x -= visual_map.scroll_speed;
			}
			if(visual_map.x < 0){
				visual_map.x += visual_map.ratio;
				visual_map.eq_x = Math.max(visual_map.eq_x - 1, 0);
			}
		}
		if(controller.right == 1){
			if(visual_map.eq_x < map_utilities.limit_x-visual_map.width){
				context.translate(-visual_map.scroll_speed, 0);
				visual_map.x += visual_map.scroll_speed;
			}
			
			if(visual_map.x >= visual_map.ratio){
				visual_map.x -=  visual_map.ratio;
				visual_map.eq_x = Math.min(visual_map.eq_x + 1, map_utilities.limit_x-visual_map.width);
			}	
		}
		if(controller.up == 1){
			if(visual_map.eq_y * visual_map.ratio + visual_map.y > 0){
				context.translate(0, visual_map.scroll_speed)
				visual_map.y -= visual_map.scroll_speed;
			}
			if(visual_map.y < 0){
				visual_map.y += visual_map.ratio;
				visual_map.eq_y = Math.max(visual_map.eq_y - 1, 0);
			}
		}
		if(controller.down == 1){
			if(visual_map.eq_y < map_utilities.limit_y-visual_map.height){
				context.translate(0, -visual_map.scroll_speed);
				visual_map.y += visual_map.scroll_speed;
			}
			
			if(visual_map.y >= visual_map.ratio){
				visual_map.y -=  visual_map.ratio;
				visual_map.eq_y = Math.min(visual_map.eq_y + 1, map_utilities.limit_y-visual_map.height);
			}	
		}
		
		if(controller.left == 0 && controller.right == 0){
			ref.speed_x = 0;
		}
		if(controller.down == 0 && controller.up == 0){
			ref.speed_y = 0;
		}
		*/
}

// fonction qui obtient un nombre aléatoire entre 0 et limit

function get_random(limit){
	var rand = parseInt(Math.random() * limit);
	return rand;
}

// fonction qui assure les bords et un chemin tout autour de la map

function create_path(limitL,limitH){
	for(i=0; i<limitL; i++){
		for(j=0; j<limitH; j++){
			virtual_map[1][Math.min(Math.max(j,1),limitH-2)].space = 1;
			virtual_map[1][Math.min(Math.max(j,1),limitH-2)].color = "#eeeeee";
			virtual_map[0][j].space = 0;
			virtual_map[0][j].color = "#cccccc";
			
			virtual_map[limitH-2][Math.min(Math.max(j,1),limitH-2)].space = 1;
			virtual_map[limitH-2][Math.min(Math.max(j,1),limitH-2)].color = "#eeeeee";
			virtual_map[limitH-1][j].space = 0;
			virtual_map[limitH-1][j].color = "#cccccc";
		}
		
		virtual_map[Math.min(i,limitL-2)][1].space = 1;
		virtual_map[Math.min(i,limitL-2)][1].color = "#eeeeee";
		virtual_map[i][0].space = 0;
		virtual_map[i][0].color = "#cccccc";
		
		virtual_map[Math.min(i,limitL-2)][limitL-2].space = 1;
		virtual_map[Math.min(i,limitL-2)][limitL-2].color = "#eeeeee";
		virtual_map[i][limitL-1].space = 0;
		virtual_map[i][limitL-1].color = "#cccccc";
	}
}

// Créer une carte (début de coordonnée x, début de coordonnée y, largeur de la carte, hauteur de la carte, taux d'aléatoire de la carte)

function create_map(startX, startY, limitL, limitH, tolerance){

	map_utilities.x = get_random(startX);
	map_utilities.y = get_random(startY);
	
	for(i=0; i<limitL; i++){
		for(j=0; j<limitH; j++){
			var obj;
			map_utilities.random = get_random(11);
			
			var alea = get_random(30);
			if(alea<3){
				obj = get_random(4);
			}
			else{
				obj = 5;
			}
			
			ligne[j] = { 
				"id" : map_utilities.id , 
				"x" : map_utilities.x , 
				"y" : map_utilities.y , 
				"content" : objects[obj].name , 
				"mat" : material[map_utilities.random].mat , 
				"abr" : material[map_utilities.random].abr , 
				"color" : material[map_utilities.random].color , 
				"space" : material[map_utilities.random].walk ,
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
	
	create_path(limitL, limitH);
	
	my_character.case_id = virtual_map[1][1].id;
	
}

// Afficher la carte à l'écran
				
function display_map(){
	context.clearRect(-600, -600, 6000, 6000);
	for(j=Math.max(visual_map.eq_y-2,0); j<Math.min(visual_map.height+visual_map.eq_y+2,map_utilities.limit_y); j++){
		for(i=Math.max(visual_map.eq_x-2,0); i<Math.min(visual_map.width+visual_map.eq_x+2,map_utilities.limit_x); i++){
			// context.beginPath();
			context.drawImage(images[virtual_map[i][j].space], i * visual_map.ratio, j * visual_map.ratio , visual_map.ratio, visual_map.ratio);
			// context.fillStyle = virtual_map[i][j].color;
		    // context.fill();
		    context.lineWidth = 0;
		}
	}
}

// function qui se déclenche quand on appuie ou relache une touche

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

// affiche personnage

function display_character(){
	context.beginPath();
	context.rect((my_character.eq_x*visual_map.ratio) + my_character.x, my_character.eq_y * visual_map.ratio + my_character.y, my_character.width * visual_map.ratio, my_character.height * visual_map.ratio);
	context.fillStyle = "red";
    context.fill();
    context.lineWidth = 0;
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
	$(".content").html(virtual_map[index[my_character.case_id].i][index[my_character.case_id].j].content);
	$(".map_x").html(visual_map.x);
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
