window.onload = function() {
	//start crafty
	Crafty.init(640, 640);
	Crafty.canvas.init();
	
	//turn the sprite map into usable components
	Crafty.sprite(16, "images/sprite.png", {
		grass1: [0,0],
		grass2: [1,0],
		grass3: [2,0],
		grass4: [3,0],
		flower: [0,1],
		bush1: [0,2],
		bush2: [1,2],
		player: [0,3]
	});
	
	Crafty.sprite("images/goku.png", {
		goku: [0,0,28,35]
	});
	
	Crafty.sprite("images/link.png", {
		link: [0,30,25,30]
	});
	
	function renderMap(map, cb) {
		loadJSON(map+".json",function(json){
			var tp = {};
			for(var i = 0, max = json.tilesets.length; i < max; i++) {
				console.log("Loading tiles from: " + json.tilesets[i].image);
				var f = json.tilesets[i].firstgid;
				var tW = json.tilesets[i].tilewidth;
				var tH = json.tilesets[i].tileheight;
				var iW = json.tilesets[i].imagewidth;
				var iH = json.tilesets[i].imageheight;
				var s = json.tilesets[i].spacing;
				var obj = {};
				var numW = Math.floor(iW / (tW + s));
				var numH = Math.floor(iH / (tH + s));
				var tiles = numW * numH;
				var curr = 1;
				for(var _tH = 0; _tH < numH; _tH++) {
					for(var _tW = 0; _tW < numW; _tW++) {
						var tile = curr + 1;
						if(json.tilesets[i].tileproperties[curr]) tp["t" + tile] = json.tilesets[i].tileproperties[curr].e;
						else tp["t" + tile] = "";
						obj["t" + curr] = [_tW * (tW + s), _tH * (tH + s), tW, tH];
						curr++;
					}
				}
				Crafty.sprite(json.tilesets[i].image, obj);
			}
			for(var _l = 0; _l < json.layers.length; _l++){
				curr = 0;
				console.log("Loading layer" + _l, json.layers[_l].height, json.layers[_l].width);
				for(var _lH = 0; _lH < json.layers[_l].height; _lH++){
					for(var _lW = 0; _lW < json.layers[_l].width; _lW++){
						var tile = json.layers[_l].data[curr++];
						if(tile != 0) {
							Crafty.e("2D, Canvas, t" + tile + ", " + tp["t" + tile])
								.attr({x: _lW * tW, y: _lH * tH, z: _l});
						}
					}
				}
			}
			console.log(tiles + " loaded...");
			cb && cb();
		});
		
		function loadJSON(json, cb) {   
			    var xobj = new XMLHttpRequest();
			    xobj.overrideMimeType("application/json");
			    xobj.open('GET', json, true);
			    xobj.onreadystatechange = function () {
			        if (xobj.readyState == 4) {
			            var jsonTexto = xobj.responseText;
			            cb(JSON.parse(jsonTexto));
			        }
			    }
			    xobj.send(null);
		}
	}
	
	function getAnimation(x,y,w,i){
		var arr = [];
		for (var xx = 0;xx<i;xx++){
			arr.push([x + xx*w,y]);
		}
		return arr;
	}
	//method to randomy generate the map
	function generateWorld() {
		//generate the grass along the x-axis
		for(var i = 0; i < 25; i++) {
			//generate the grass along the y-axis
			for(var j = 0; j < 20; j++) {
				grassType = Crafty.math.randomInt(1, 4);
				Crafty.e("2D, Canvas, grass"+grassType)
					.attr({x: i * 16, y: j * 16});
				
				//1/50 chance of drawing a flower and only within the bushes
				if(i > 0 && i < 24 && j > 0 && j < 19 && Crafty.math.randomInt(0, 50) > 49) {
					Crafty.e("2D, DOM, flower, solid, destroy, SpriteAnimation")
						.attr({x: i * 16, y: j * 16})
						.animate("wind", 0, 1, 2)
						.animate("wind", 80, -1);
				}
			}
		}
		
		
		//create the bushes along the x-axis which will form the boundaries
		for(var i = 0; i < 25; i++) {
			Crafty.e("2D, Canvas, wall_top, solid, bush"+Crafty.math.randomInt(1,2))
				.attr({x: i * 16, y: 0, z: 2});
			Crafty.e("2D, DOM, wall_bottom, solid, bush"+Crafty.math.randomInt(1,2))
				.attr({x: i * 16, y: 304, z: 2});
		}
		
		//create the bushes along the y-axis
		//we need to start one more and one less to not overlap the previous bushes
		for(var i = 1; i < 19; i++) {
			Crafty.e("2D, DOM, wall_left, solid, bush"+Crafty.math.randomInt(1,2))
				.attr({x: 0, y: i * 16, z: 2});
			Crafty.e("2D, Canvas, wall_right, solid, bush"+Crafty.math.randomInt(1,2))
				.attr({x: 384, y: i * 16, z: 2});
		}
	}
	
	//the loading screen that will display while our assets load
	Crafty.scene("loading", function() {
		//load takes an array of assets and a callback when complete
		Crafty.load(["images/sprite.png"], function () {
			Crafty.scene("main"); //when everything is loaded, run the main scene
		});
		
		//black background with some loading text
		Crafty.background("#000");
		Crafty.e("2D, DOM, Text").attr({w: 100, h: 20, x: 150, y: 120})
			.text("Loading")
			.css({"text-align": "center"});
	});
	
	//automatically play the loading scene
	Crafty.scene("loading");
	renderMap("map1", function(){
		console.log("CASCASCASCAS");
	});
	
	Crafty.scene("main", function() {
		//generateWorld();
		
		Crafty.c('Hero', {
			init: function() {
					//setup animations
					this.direction = "down";
					this.requires("SpriteAnimation, Collision,KeyBoard")
					.animate("walk_up",getAnimation(0,120,30,8))
					.animate("walk_down", getAnimation(0,30,30,8))
					.animate("walk_left", getAnimation(239,0,24,8))
					.animate("walk_right",getAnimation(239,120,30,6))
					.animate("kame_down", getAnimation(0,90,30,6))
					.animate("kame_up", getAnimation(0,180,30,5))
					.animate("kame_left", getAnimation(239,90,30,5))
					.animate("kame_right", getAnimation(239,180,30,5))
					/*
						.animate("walk_left", getAnimation(3,230,28,4))
						.animate("walk_right",getAnimation(1,40,28,4))
						.animate("walk_up",getAnimation(2,80,28,4))
						.animate("walk_down", getAnimation(1,0,28,4))
						.animate("kame_down", getAnimation(3,364,28,5))
						.animate("kame_right", getAnimation(154,283,28,5))
						.animate("kame_up", getAnimation(325,275,28,5))
					*/
					
					//change direction when a direction change event is received
					.bind("KeyDown",function (e){
						if(e.key == 32){
							this.stop().animate("kame_" + this.direction, 10, 0);
							if(this.collidingObjs){
								for(var i in this.collidingObjs){
									this.collidingObjs[i].obj.destroy();
								}
							}
						}
					})
					
					.bind("NewDirection",
						function (direction) {
							if (direction.x < 0) {
								this.direction = "left";
								if (!this.isPlaying("walk_left"))
									this.stop().animate("walk_left", 10, -1);
							}
							if (direction.x > 0) {
								this.direction = "right";
								if (!this.isPlaying("walk_right"))
									this.stop().animate("walk_right", 10, -1);
							}
							if (direction.y < 0) {
								this.direction = "up";
								if (!this.isPlaying("walk_up"))
									this.stop().animate("walk_up", 10, -1);
							}
							if (direction.y > 0) {
								this.direction = "down";
								if (!this.isPlaying("walk_down"))
									this.stop().animate("walk_down", 10, -1);
							}
							if(!direction.x && !direction.y) {
								this.stop();
							}
					})
					// A rudimentary way to prevent the user from passing solid areas
					.bind('Moved', function(from) {
						this.collidingObjs = this.hit('destroy');
						if( this.hit('solid')) {
							this.attr({x: from.x, y:from.y});
						}						
					});
				return this;
			}
		});

		Crafty.c("RightControls", {
			init: function() {
				this.requires('Multiway');
			},

			rightControls: function(speed) {
				this.multiway(2, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180})
				return this;
			}

		});
		
		//create our player entity with some premade components
		player = Crafty.e("2D, DOM, link, RightControls, Hero, Animate, Collision")
			.attr({x: 160, y: 144, z: 1})
			.rightControls(1);
	});
	
	
};