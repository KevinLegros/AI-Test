(function() {
	$(document).ready(function() {
		$('#cnv').on('contextmenu', function(e) {
			return false;
		});
		
		var game = new Game();
	});
	
	
	Game = function() {
		this.canvas = undefined;
		this.canvasW = 0;
		this.canvasH = 0;
		this.context = undefined;
		
		this.canvas = $('#cnv').get(0);
		this.canvasW = parseInt(this.canvas.width);
		this.canvasH = parseInt(this.canvas.height);
		this.context = this.canvas.getContext('2d');
		
		this.gameMinX = this.canvasW / 20;
		this.gameMaxX = this.canvasW - (this.gameMinX);
		
		this.gameMinY = this.canvasH / 20;
		this.gameMaxY = this.canvasH - (this.gameMinY);
		
		this.input = new Input(this.canvas);
		this.input.addMouseMoveEvent(this.canvas);
		this.input.addMouseDownUpEvent(this.canvas);
		
		this.input.addTouchMoveEvent(this.canvas);
		this.input.addTouchDownUpEvent(this.canvas);
		
		this.input.addKeyDownEvent(this.canvas);
		this.input.addKeyUpEvent(this.canvas);
		
		this.entities = [];
		
		/* ----------------- METHODS ------------- */
		this.loop = function() {
			this.update();
			this.render();
		}
		this.update = function() {
			var mousePos = null;
			try {
				mousePos = this.input.m_mousePos;
			} catch(e) {
				console.log(e);
			}
			
			if(this.input.mouseClicked(0)) {
			} else if(this.input.mouseDown(0)) {
			} else if(this.input.mouseUp(0)) {
			}
			
			if(this.input.mouseDown(0)) {
				if(this.input.mouseDownTime() % 10 == 0) {
					this.entities.push(new Entity(this, null, this.entities.length, mousePos));
				}
			}
			
			if(this.input.isKeyPressed('c')) {
				for(var i = 0; i < this.entities.length; i++) {
					delete this.entities[i];
				}
				this.entities = [];
				$('.log').empty();
				this.log("Cleared all entities");
			}
			this.input.update();
			
			for(var i = 0; i < this.entities.length; i++) {
				this.entities[i].update();
			}
		}
		this.render = function() {
			this.context.clearRect(0, 0, this.canvasW, this.canvasH);
			var img = null;
			
			this.context.fillStyle = "#FF0000";
			this.context.fillRect(0, 0, this.canvasW, this.canvasH);
			
			var rectWidth = this.canvasW - this.gameMinX * 2;
			var rectHeight = this.canvasH - this.gameMinY * 2;
			
			this.context.fillStyle = "#000000";
			this.context.fillRect(this.gameMinX, this.gameMinY, rectWidth, rectHeight);
			
			for(var i = 0; i < this.entities.length; i++) {
				this.entities[i].render();
			}
			
			this.debugDraw("Rect width: "+rectWidth+" Canvas width: "+this.canvasW+ " MinX is "+this.gameMinX+" MaxX is "+this.gameMaxX, 12, 10, 20);
			this.debugDraw("Rect height: "+rectHeight+" Canvas height: "+this.canvasH+ " MinY is "+this.gameMinY+" MaxY is "+this.gameMaxY, 12, 10, 40);
			this.debugDraw("Entities: "+this.entities.length, 12, 10, 60);
			if(this.entities.length > 0) {
				this.debugDraw("Entity 0 life: "+this.entities[0].m_life+" seconds passed "+(Math.floor(this.entities[0].m_life / 60)), 12, 10, 80);
			}
		}
		this.debugDraw = function(text, size, x, y) {
			this.context.font = size+"px Georgia";
			this.context.fillStyle = "#FFFFFF";
			this.context.fillText(text, x, y);
		}
		
		this.log = function(text) {
			$('.log').prepend('<div>'+text+'</div>');
		}
		/* ----------------- METHODS ------------- */
		
		this.intervalID = setInterval(
			(function(self) {
				return function() {
					self.loop();
				}
			})(this),
			1000 / 60);
		// this.loop();
	}
	
	
	Input = function() {
		/* ----------------- MOUSE ------------- */
		this.m_mousePos = {};
		this.m_mouseWasDown = {};
		this.m_mouseIsDown = {};
		this.m_mouseDownTime = -1;
				
	
		/* ----------------- METHODS ------------- */
		this.getMousePos = function(canvas, evt) {
			var rect = canvas.getBoundingClientRect();
			return {
				x: evt.clientX - rect.left,
				y: evt.clientY - rect.top
			}
		}
		this.mouseClicked = function(button) {
			return !this.m_mouseWasDown[button] && this.m_mouseIsDown[button];
		}
		this.mouseDown = function(button) {
			return this.m_mouseIsDown[button];
		}
		this.mouseUp = function(button) {
			return this.m_mouseWasDown[button] && !this.m_mouseIsDown[button];
		}
		this.mouseDownTime = function() {
			return this.m_mouseDownTime;
		}
		
		this.addMouseMoveEvent = function(canvas) {
			var me = this;
			canvas.addEventListener('mousemove', function(evt) {
				me.m_mousePos = me.getMousePos(canvas, evt);
			}, false);
		}
		this.addMouseDownUpEvent = function(canvas) {
			var me = this;
			canvas.addEventListener('mousedown', function(evt) {
				me.m_mouseIsDown[evt.button] = true;
				me.m_mouseDownTime = 0;
			}, false);
			canvas.addEventListener('mouseup', function(evt) {
				me.m_mouseIsDown[evt.button] = false;
				m_mouseDownTime = -1;
			}, false);
		}
		
		
		this.addTouchMoveEvent = function(canvas) {
			var me = this;
			canvas.addEventListener('touchmove', function(evt) {
				me.m_mousePos = me.getMousePos(canvas, evt);
			}, false);
		}
		this.addTouchDownUpEvent = function(canvas) {
			var me = this;
			canvas.addEventListener('touchstart', function(evt) {
				me.m_mouseIsDown[evt.button] = true;
				me.m_mouseDownTime = 0;
			}, false);
			canvas.addEventListener('touchend', function(evt) {
				me.m_mouseIsDown[evt.button] = false;
				m_mouseDownTime = -1;
			}, false);
			canvas.addEventListener('touchcancel', function(evt) {
				me.m_mouseIsDown[evt.button] = false;
				m_mouseDownTime = -1;
			}, false);
		}
		
		/* ----------------- METHODS ------------- */
		
		/* ----------------- MOUSE ------------- */
		
		
		/* ----------------- KEYBOARD ------------- */
		this.keyboard = {
			'c': false,	// c 67
			'r': false  // r 82
		};
		this.lastKeyboard = this.keyboard;
		
		this.isKeyPressed = function(keyVal) {
			return this.keyboard[keyVal] && !this.lastKeyboard[keyVal];
		}
		this.isKeyDown = function(keyVal) {
			return this.keyboard[keyVal] && this.lastKeyboard[keyVal];
		}
		this.isKeyUp = function(keyVal) {
			return !this.keyboard[keyVal] && this.lastKeyboard[keyVal];
		}
		
		this.addKeyDownEvent = function(canvas) {
			var me = this;
			window.addEventListener('keypress', function(evt) {
				me.keyboard[String.fromCharCode(evt.keyCode).toLowerCase()] = true;
			}, false);
		}
		this.addKeyUpEvent = function(canvas) {
			var me = this;
			window.addEventListener('keyup', function(evt) {
				me.keyboard[String.fromCharCode(evt.keyCode).toLowerCase()] = false;
			}, false);
		}
		/* ----------------- KEYBOARD ------------- */
		
		this.update = function() {
			this.lastKeyboard = this.keyboard;
			// TODO
			this.keyboard = {};
			
			for(key in this.m_mouseWasDown) {
				if(this.m_mouseWasDown[key] && !this.m_mouseIsDown[key]) {
					this.m_mouseWasDown[key] = false;
				}
			}
			for(key in this.m_mouseIsDown) {
				if(this.m_mouseIsDown[key]) {
					this.m_mouseWasDown[key] = true;
				}
			}
			
			if(this.m_mouseDownTime > -1) {
				this.m_mouseDownTime++;
			}
		}
	}
	
	
	Entity = function(game, sprite, id, pos) {
		this.m_game = game;
		this.m_id = id;
		this.m_pos = {x: pos.x, y: pos.y};
		this.m_sprite = sprite;
		this.m_life = 0;
		this.m_color = '#'+Math.floor(Math.random()*16777215).toString(16);
		this.m_behavior = new Behavior(this.m_game, this);
		
		this.m_radius = 10;
		this.m_borderColor = '#FFFFFF';
		
		this.m_maxVelocity = {x: Math.floor(Math.random() * 10) - 5, y: Math.floor(Math.random() * 10) - 5};
		
		this.m_velocity = this.m_maxVelocity;
		
		this.aheadVector = this.m_pos;
		this.maxSeeAhead = 50;
		this.midAheadVector = this.m_pos;
		this.maxMidSeeAhead = 25;
		
		this.m_aheadColor = "#00FF00";
		
		this.m_game.log("Creation entity at "+this.m_pos.x+","+this.m_pos.y+" with velocity "+this.m_velocity.x+","+this.m_velocity.y);
		
		/* ----------------- METHODS ------------- */
		this.update = function() {
			this.m_life++;
			
			this.m_aheadColor = "#00FF00";
			this.m_borderColor = '#FFFFFF';
			
			// Calculate ahead vector
			var velocityVectorLength = Math.sqrt(this.m_velocity.x * this.m_velocity.x + this.m_velocity.y * this.m_velocity.y);
			var normalizedVelocity = {x: this.m_velocity.x / velocityVectorLength, y: this.m_velocity.y / velocityVectorLength};
			this.aheadVector = {x: this.m_pos.x + normalizedVelocity.x * this.maxSeeAhead, y: this.m_pos.y + normalizedVelocity.y * this.maxSeeAhead};
			this.midAheadVector = {x: this.m_pos.x + normalizedVelocity.x * this.maxMidSeeAhead, y: this.m_pos.y + normalizedVelocity.y * this.maxMidSeeAhead};
			
			this.m_behavior.update();
			
			if(Math.abs(this.m_velocity.x) > Math.abs(this.m_maxVelocity.x)) {
				if(this.m_velocity.x < 0) {
					this.m_velocity.x = -Math.abs(this.m_maxVelocity.x);
				} else if(this.m_velocity.x > 0) {
					this.m_velocity.x = Math.abs(this.m_maxVelocity.x);
				}
			}
			
			if(Math.abs(this.m_velocity.y) > Math.abs(this.m_maxVelocity.y)) {
				if(this.m_velocity.y < 0) {
					this.m_velocity.y = -Math.abs(this.m_maxVelocity.y);
				} else if(this.m_velocity.y > 0) {
					this.m_velocity.y = Math.abs(this.m_maxVelocity.y);
				}
			}
			
			var newX = this.m_pos.x + this.m_velocity.x;
			var newY = this.m_pos.y + this.m_velocity.y;
			this.m_pos = {x: newX, y: newY};
		}
		this.render = function() {
			if(this.m_sprite != null) {
				var img = new Image();
				img.src = 'res/' + this.m_sprite;
				this.m_game.context.drawImage(img, this.m_pos.x, this.m_pos.y);
			} else {
				this.m_game.context.beginPath();
					this.m_game.context.arc(this.m_pos.x, this.m_pos.y, this.m_radius, 0, 2 * Math.PI, false);
					this.m_game.context.fillStyle = this.m_color;
					this.m_game.context.fill();
					this.m_game.context.lineWidth = 2;
					this.m_game.context.strokeStyle = this.m_borderColor;
				this.m_game.context.stroke();
				
				// Draw head vector
				this.m_game.context.beginPath();
					this.m_game.context.strokeStyle = this.m_aheadColor;
					this.m_game.context.moveTo(this.m_pos.x, this.m_pos.y);
					this.m_game.context.lineTo(this.aheadVector.x, this.aheadVector.y);
				this.m_game.context.stroke();
				
				this.m_game.context.beginPath();
					this.m_game.context.strokeStyle = this.m_aheadColor;
					this.m_game.context.moveTo(this.m_pos.x, this.m_pos.y);
					this.m_game.context.lineTo(this.midAheadVector.x, this.midAheadVector.y);
				this.m_game.context.stroke();
				
				// Draw veclocity vector
				this.m_game.context.beginPath();
					this.m_game.context.strokeStyle = "#FFFFFF";
					this.m_game.context.moveTo(this.m_pos.x, this.m_pos.y);
					this.m_game.context.lineTo(this.m_pos.x + this.m_velocity.x, this.m_pos.y + this.m_velocity.y);
				this.m_game.context.stroke();
				
			}
			
			this.m_behavior.render();
		}
		this.distance = function(vectorA, vectorB) {
			return Math.sqrt((vectorB.x - vectorA.x) * (vectorB.x - vectorA.x) + (vectorB.y - vectorA.y) * (vectorB.y - vectorA.y));
		}
		this.lineIntersectCircle = function(entity) {
			return (this.distance(entity.m_pos, this.aheadVector) <= entity.m_radius) || (this.distance(entity.m_pos, this.midAheadVector) <= entity.m_radius);
		}
		this.lineIntersectCircleDouble = function(entity) {
			return (this.distance(entity.m_pos, this.aheadVector) <= entity.m_radius * 2) || (this.distance(entity.m_pos, this.midAheadVector) <= entity.m_radius * 2);
		}
		this.collidesWith = function(entity) {
			return this.distance(this.m_pos, entity.m_pos) <= entity.m_radius * 2;
		}
		/* ----------------- METHODS ------------- */
	}
	
	Behavior = function(game, entity) {
		this.m_game = game;
		this.m_entity = entity;
		this.states = ['CRUISING', 'OUT_OF_BOUNDS', 'STOPPED', 'AVOIDING'];
		this.currentState = 'CRUISING';
		
		this.avoidedEntity = null;
		
		this.m_dashedlines = [];
		
		this.m_game.log("Entity "+this.m_entity.m_id+" is currently: "+this.currentState);
		
		this.update = function() {
			this.m_dashedlines = [];
		
			// OUT OF BOUNDS
			this.handleOutOfBounds();
			
			if(this.currentState == 'CRUISING') {
				for(var i = 0; i < this.m_game.entities.length; i++) {
					var entity = this.m_game.entities[i];
					if(entity == this.m_entity) {
						continue;
					}
					
					// Check near collision
					this.m_dashedlines.push({x1: this.m_entity.aheadVector.x, y1: this.m_entity.aheadVector.y, x2: entity.m_pos.x, y2: entity.m_pos.y});
					
					if(this.m_entity.lineIntersectCircle(entity)) {
						this.avoidedEntity = entity;
						// this.m_entity.m_aheadColor = "#FF0000";
						this.m_entity.m_aheadColor = "#FFFF00";
						this.m_entity.m_borderColor = "#FFFF00";
						this.currentState = 'AVOIDING';
						//entity.m_behavior.currentState = 'AVOIDING';
						
						this.m_game.log("Entity "+this.m_entity.m_id+" avoiding "+entity.m_id+" current state is now "+this.currentState);
					}
					
					
					// Check actual collision
					if(this.m_entity.collidesWith(entity)) {
						this.currentState = 'STOPPED';
						entity.m_behavior.currentState = 'STOPPED';
						// this.m_game.log("Entity "+this.m_entity.m_id+" collided with "+entity.m_id+" distance is "+this.m_entity.distance(entity));
						this.m_game.log("Entity "+this.m_entity.m_id+" collided with "+entity.m_id);
					}
				}
				
				
				
				if(this.currentState == 'CRUISING') {
					// Still cruising
					// Wander randomly
					if((this.m_entity.m_life / 60) % 2 == 0 && (Math.random() * 100) < 60) {
						// 60% to change direction every 2 seconds
						//this.m_game.log("Entity "+this.m_entity.m_id+" changing course");
						this.m_entity.m_velocity = {x: Math.floor(Math.random() * 10) - 5, y: Math.floor(Math.random() * 10) - 5};
						this.m_entity.m_maxVelocity = this.m_entity.m_velocity;
					}/* else if((this.m_entity.m_life / 60) % 2 == 0 && (Math.random() * 100) < 60) {
						// 60% to stop every 2 seconds
						this.m_entity.m_velocity = {x: 0, y: 0};
					}*/
				}
			} else if(this.currentState == 'STOPPED') {
				this.m_entity.m_velocity = {x: 0, y: 0};
				this.m_entity.m_aheadColor = "#FF0000";
				this.m_entity.m_borderColor = "#FF0000";
			} else if(this.currentState == 'AVOIDING') {
				this.handleAvoiding();
			}
		}
		
		this.handleOutOfBounds = function() {
			var correction = 0.5;
			var isOutOfBounds = false;
			
			if(this.m_entity.m_pos.x < this.m_game.gameMinX) {
				//correction = this.m_entity.m_maxVelocityX / 2;
				this.m_entity.m_velocity.x += correction;
				isOutOfBounds = true;
			} else if(this.m_entity.m_pos.x > this.m_game.gameMaxX) {
				//correction = this.m_entity.m_maxVelocityX / 2;
				this.m_entity.m_velocity.x -= correction;
				isOutOfBounds = true;
			}
			
			
			if(this.m_entity.m_pos.y < this.m_game.gameMinY) {
				//correction = this.m_entity.m_maxVelocityY / 2;
				this.m_entity.m_velocity.y += correction;
				isOutOfBounds = true;
			} else if(this.m_entity.m_pos.y > this.m_game.gameMaxY) {
				//correction = this.m_entity.m_maxVelocityY / 2;
				this.m_entity.m_velocity.y -= correction;
				isOutOfBounds = true;
			}
			
			if(isOutOfBounds) {
				if(this.currentState != 'OUT_OF_BOUNDS') {
					this.currentState = 'OUT_OF_BOUNDS';
					//this.m_game.log("Entity "+this.m_entity.m_id+" is now: "+this.currentState);
				}
			} else {
				if(this.currentState == 'OUT_OF_BOUNDS') {
					//this.m_game.log("Entity "+this.m_entity.m_id+" resumed CRUISING from OUT OF BOUNDS");
					this.currentState = 'CRUISING';
					//this.m_game.log("Entity "+this.m_entity.m_id+" is now: "+this.currentState);
				}
			}
		}
		
		this.handleAvoiding = function() {
			var correction = 0.5;
			// Check if there is an entity to avoid
			if(this.avoidedEntity == null) {
				this.currentState = 'CRUISING';
				this.m_game.log("Entity "+this.m_entity.m_id+" resumed CRUISING from avoidedEntity == NULL");
				return;
			}
			
			if(this.currentState == 'STOPPED') {
				return;
			}
			
			// Check if still need to avoid
			if(this.m_entity.lineIntersectCircleDouble(this.avoidedEntity)) {
				this.m_entity.m_aheadColor = "#FFFF00";
				this.m_entity.m_borderColor = "#FFFF00";
				this.avoidedEntity.m_borderColor = "#FFFF00";
				
				// Check for ahead vector
				if(this.avoidedEntity.m_velocity.y > 0) {
					// Obstacle going DOWN : go UP
					this.m_entity.m_velocity.y -= correction;
				} else if(this.avoidedEntity.m_velocity.y <= 0) {
					// Obstacle going UP : go DOWN
					this.m_entity.m_velocity.y += correction;
				}
				
				if(this.avoidedEntity.m_velocity.x > 0) {
					// Obstacle going RIGHT
					this.m_entity.m_velocity.x -= correction;
				} else if(this.avoidedEntity.m_velocity.x <= 0) {
					// Obstacle going LEFT
					this.m_entity.m_velocity.x += correction;
				}
				
			} else {
				this.currentState = 'CRUISING';
				this.m_game.log("Entity "+this.m_entity.m_id+" ended avoiding with "+this.avoidedEntity.m_id+" current state is now "+this.currentState);
				this.avoidedEntity = null;
			}
		}
		
		this.render = function() {
			for(var i = 0; i < this.m_dashedlines.length; i++) {
				this.m_game.context.beginPath();
					this.m_game.context.strokeStyle = "#FFFFFF";
					this.m_game.context.setLineDash([5]);
					//this.m_game.context.setLineDash([2]);
					this.m_game.context.moveTo(this.m_dashedlines[i].x1, this.m_dashedlines[i].y1);
					this.m_game.context.lineTo(this.m_dashedlines[i].x2, this.m_dashedlines[i].y2);
				this.m_game.context.stroke();
				this.m_game.context.setLineDash([0]);
			}
		}
	}
})();