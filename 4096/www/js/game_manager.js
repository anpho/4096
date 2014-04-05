function GameManager(size, InputManager, Actuator, ScoreManager) {
	this.size = size; // Size of the grid
	this.inputManager = new InputManager;
	this.scoreManager = new ScoreManager;
	this.actuator = new Actuator;

	this.startTiles = 2;

	this.inputManager.on("move", this.move.bind(this));
	this.inputManager.on("restart", this.restart.bind(this));

	this.setup();
}

// Restart the game
GameManager.prototype.restart = function() {
	this.actuator.restart();
	this.setup();
};

// Set up the game
GameManager.prototype.setup = function() {
	this.grid = new Grid(this.size);

	this.score = 0;
	this.over = false;
	this.won = false;

	// Add the initial tiles
	this.addStartTiles();

	// Update the actuator
	this.actuate();
};

// Set up the initial tiles to start the game with
GameManager.prototype.addStartTiles = function() {
	for (var i = 0; i < this.startTiles; i++) {
		this.addRandomTile();
	}
};

// Adds a tile in a random position
GameManager.prototype.addRandomTile = function() {
	if (this.grid.cellsAvailable()) {
		var value = Math.random() < 0.9 ? 2 : 4;
		var tile = new Tile(this.grid.randomAvailableCell(), value);

		this.grid.insertTile(tile);
	}
};

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function() {
	if (this.scoreManager.get() < this.score) {
		this.scoreManager.set(this.score);
	}

	this.actuator.actuate(this.grid, {
		score: this.score,
		over: this.over,
		won: this.won,
		bestScore: this.scoreManager.get()
	});

};

// Save all tile positions and remove merger info
GameManager.prototype.prepareTiles = function() {
	this.grid.eachCell(function(x, y, tile) {
		if (tile) {
			tile.mergedFrom = null;
			tile.savePosition();
		}
	});
};

// Move a tile and its representation
GameManager.prototype.moveTile = function(tile, cell) {
	this.grid.cells[tile.x][tile.y] = null;
	this.grid.cells[cell.x][cell.y] = tile;
	tile.updatePosition(cell);
};

// Move tiles on the grid in the specified direction
GameManager.prototype.move = function(direction) {
	// 0: up, 1: right, 2:down, 3: left
	var self = this;

	if (this.over || this.won) return; // Don't do anything if the game's over
	var cell, tile;

	var vector = this.getVector(direction);
	var traversals = this.buildTraversals(vector);
	var moved = false;

	// Save the current tile positions and remove merger information
	this.prepareTiles();

	// Traverse the grid in the right direction and move tiles
	traversals.x.forEach(function(x) {
		traversals.y.forEach(function(y) {
			cell = {
				x: x,
				y: y
			};
			tile = self.grid.cellContent(cell);

			if (tile) {
				var positions = self.findFarthestPosition(cell, vector);
				var next = self.grid.cellContent(positions.next);

				// Only one merger per row traversal?
				if (next && next.value === tile.value && !next.mergedFrom) {
					var merged = new Tile(positions.next, tile.value * 2);
					merged.mergedFrom = [tile, next];

					self.grid.insertTile(merged);
					self.grid.removeTile(tile);

					// Converge the two tiles' positions
					tile.updatePosition(positions.next);

					// Update the score
					self.score += merged.value;

					// The mighty 2048 tile
					if (merged.value === 4096) self.won = true;
				} else {
					self.moveTile(tile, positions.farthest);
				}

				if (!self.positionsEqual(cell, tile)) {
					moved = true; // The tile moved from its original cell!
				}
			}
		});
	});

	if (moved) {
		this.addRandomTile();

		if (!this.movesAvailable()) {
			this.over = true; // Game over!
		}

		this.actuate();
	}
};

// Get the vector representing the chosen direction
GameManager.prototype.getVector = function(direction) {
	// Vectors representing tile movement
	var map = {
		0: {
			x: 0,
			y: -1
		},
		// up
		1: {
			x: 1,
			y: 0
		},
		// right
		2: {
			x: 0,
			y: 1
		},
		// down
		3: {
			x: -1,
			y: 0
		} // left
	};

	return map[direction];
};

// Build a list of positions to traverse in the right order
GameManager.prototype.buildTraversals = function(vector) {
	var traversals = {
		x: [],
		y: []
	};

	for (var pos = 0; pos < this.size; pos++) {
		traversals.x.push(pos);
		traversals.y.push(pos);
	}

	// Always traverse from the farthest cell in the chosen direction
	if (vector.x === 1) traversals.x = traversals.x.reverse();
	if (vector.y === 1) traversals.y = traversals.y.reverse();

	return traversals;
};

GameManager.prototype.findFarthestPosition = function(cell, vector) {
	var previous;

	// Progress towards the vector direction until an obstacle is found
	do {
		previous = cell;
		cell = {
			x: previous.x + vector.x,
			y: previous.y + vector.y
		};
	} while (this.grid.withinBounds(cell) && this.grid.cellAvailable(cell));

	return {
		farthest: previous,
		next: cell // Used to check if a merge is required
	};
};

GameManager.prototype.movesAvailable = function() {
	return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
GameManager.prototype.tileMatchesAvailable = function() {
	var self = this;

	var tile;

	for (var x = 0; x < this.size; x++) {
		for (var y = 0; y < this.size; y++) {
			tile = this.grid.cellContent({
				x: x,
				y: y
			});

			if (tile) {
				for (var direction = 0; direction < 4; direction++) {
					var vector = self.getVector(direction);
					var cell = {
						x: x + vector.x,
						y: y + vector.y
					};

					var other = self.grid.cellContent(cell);

					if (other && other.value === tile.value) {
						return true; // These two tiles can be merged
					}
				}
			}
		}
	}

	return false;
};

GameManager.prototype.positionsEqual = function(first, second) {
	return first.x === second.x && first.y === second.y;
};

///////////////////////////////////
(function() {
	var lastTime = 0;
	var vendors = ['webkit', 'moz'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}
}());

/////////////////////////////////////
function Grid(size) {
	this.size = size;

	this.cells = [];

	this.build();
}

// Build a grid of the specified size
Grid.prototype.build = function() {
	for (var x = 0; x < this.size; x++) {
		var row = this.cells[x] = [];

		for (var y = 0; y < this.size; y++) {
			row.push(null);
		}
	}
};

// Find the first available random position
Grid.prototype.randomAvailableCell = function() {
	var cells = this.availableCells();

	if (cells.length) {
		return cells[Math.floor(Math.random() * cells.length)];
	}
};

Grid.prototype.availableCells = function() {
	var cells = [];

	this.eachCell(function(x, y, tile) {
		if (!tile) {
			cells.push({
				x: x,
				y: y
			});
		}
	});

	return cells;
};

// Call callback for every cell
Grid.prototype.eachCell = function(callback) {
	for (var x = 0; x < this.size; x++) {
		for (var y = 0; y < this.size; y++) {
			callback(x, y, this.cells[x][y]);
		}
	}
};

// Check if there are any cells available
Grid.prototype.cellsAvailable = function() {
	return !!this.availableCells().length;
};

// Check if the specified cell is taken
Grid.prototype.cellAvailable = function(cell) {
	return !this.cellOccupied(cell);
};

Grid.prototype.cellOccupied = function(cell) {
	return !!this.cellContent(cell);
};

Grid.prototype.cellContent = function(cell) {
	if (this.withinBounds(cell)) {
		return this.cells[cell.x][cell.y];
	} else {
		return null;
	}
};

// Inserts a tile at its position
Grid.prototype.insertTile = function(tile) {
	this.cells[tile.x][tile.y] = tile;
};

Grid.prototype.removeTile = function(tile) {
	this.cells[tile.x][tile.y] = null;
};

Grid.prototype.withinBounds = function(position) {
	return position.x >= 0 && position.x < this.size && position.y >= 0 && position.y < this.size;
};

///////////////////////
function HTMLActuator() {
	this.tileContainer = document.querySelector(".tile-container");
	this.scoreContainer = document.querySelector(".score-container");
	this.bestContainer = document.querySelector(".best-container");
	this.messageContainer = document.querySelector(".game-message");
	this.sharingContainer = document.querySelector(".score-sharing");

	this.score = 0;
}

HTMLActuator.prototype.actuate = function(grid, metadata) {
	var self = this;

	window.requestAnimationFrame(function() {
		self.clearContainer(self.tileContainer);

		grid.cells.forEach(function(column) {
			column.forEach(function(cell) {
				if (cell) {
					self.addTile(cell);
				}
			});
		});

		self.updateScore(metadata.score);
		self.updateBestScore(metadata.bestScore);

		if (metadata.over) self.message(false); // You lose
		if (metadata.won) self.message(true); // You win!
	});
};

HTMLActuator.prototype.restart = function() {
	if (typeof ga !== "undefined") {
		ga("send", "event", "game", "restart");
	}
	this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function(container) {
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
};

HTMLActuator.prototype.addTile = function(tile) {
	var self = this;

    var wrapper = document.createElement("div");
    var inner = document.createElement("div");
    var position = tile.previousPosition || {
        x: tile.x,
        y: tile.y
    };
    var positionClass = this.positionClass(position);

    // We can't use classlist because it somehow glitches when replacing classes
    var classes = ["tile", "tile-" + tile.value, positionClass];

    if (tile.value > 2048)
        classes.push("tile-super");

    this.applyClasses(wrapper, classes);

    inner.classList.add("tile-inner");
    inner.textContent = tile.value;

    if (tile.previousPosition) {
        // Make sure that the tile gets rendered in the previous position first
        window.requestAnimationFrame(function() {
            classes[2] = self.positionClass({
                x: tile.x,
                y: tile.y
            });
            self.applyClasses(wrapper, classes); // Update the position
        });
    } else if (tile.mergedFrom) {
        classes.push("tile-merged");
        this.applyClasses(wrapper, classes);

        // Render the tiles that merged
        tile.mergedFrom.forEach(function(merged) {
            self.addTile(merged);
        });
    } else {
        classes.push("tile-new");
        this.applyClasses(wrapper, classes);
    }

    // Add the inner part of the tile to the wrapper
    wrapper.appendChild(inner);

    // Put the tile on the board
    this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function(element, classes) {
	element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function(position) {
	return {
		x: position.x + 1,
		y: position.y + 1
	};
};

HTMLActuator.prototype.positionClass = function(position) {
	position = this.normalizePosition(position);
	return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function(score) {
	this.clearContainer(this.scoreContainer);

	var difference = score - this.score;
	this.score = score;

	this.scoreContainer.textContent = this.score;

	if (difference > 0) {
		var addition = document.createElement("div");
		addition.classList.add("score-addition");
		addition.textContent = "+" + difference;

		this.scoreContainer.appendChild(addition);
	}
};

HTMLActuator.prototype.updateBestScore = function(bestScore) {
	this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function(won) {
	document.querySelector('[class=lower]').style.display = 'none';
	var type = won ? "game-won" : "game-over";
	var message = won ? "You win!" : "Game over!";

	if (typeof ga !== "undefined") {
		ga("send", "event", "game", "end", type, this.score);
	}
	this.messageContainer.classList.add(type);
	this.messageContainer.getElementsByTagName("p")[0].textContent = message;
	setTimeout(function() {
		document.querySelector('[class=lower]').style.display = 'block';
	}, 2000);
};

HTMLActuator.prototype.clearMessage = function() {
	this.messageContainer.classList.remove("game-won", "game-over");
};

function tweetscore(score) {
	document.querySelector('[class=score-sharing]').parentNode.style.display = 'none';
	setTimeout(function() {
		app.screenshot = community.screenshot.execute({
			dest: app.ss,
			mime: 'image/png'
		});
		Invoke.targets(app.screenshot);
		document.querySelector('[class=score-sharing]').parentNode.style.display = 'block';
	}, 1000);
}
////////////////////////////////////
function KeyboardInputManager() {
	this.events = {};

	this.listen();
}

KeyboardInputManager.prototype.on = function(event, callback) {
	if (!this.events[event]) {
		this.events[event] = [];
	}
	this.events[event].push(callback);
};

KeyboardInputManager.prototype.emit = function(event, data) {
	var callbacks = this.events[event];
	if (callbacks) {
		callbacks.forEach(function(callback) {
			callback(data);
		});
	}
};
KeyboardInputManager.prototype.tweetit = function() {
	tweetscore(app.gamemgr.score);
};
KeyboardInputManager.prototype.listen = function() {
	var self = this;

	var map = {
		38: 0,
		// Up
		39: 1,
		// Right
		40: 2,
		// Down
		37: 3,
		// Left
		75: 0,
		// vim keybindings
		76: 1,
		74: 2,
		72: 3,
		87: 0,
		// W
		68: 1,
		// D
		83: 2,
		// S
		65: 3 // A
	};

	document.addEventListener("keydown", function(event) {
		var modifiers = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
		var mapped = map[event.which];

		if (!modifiers) {
			if (mapped !== undefined) {
				event.preventDefault();
				self.emit("move", mapped);
			}

			if (event.which === 32) self.restart.bind(self)(event);
		}
	});

	var retry = document.getElementsByClassName("retry-button")[0];
	retry.addEventListener("click", this.restart.bind(this));
	retry.addEventListener("touchend", this.restart.bind(this));



	var tweetbtn = document.querySelector(".score-sharing");
	tweetbtn.addEventListener("click", this.tweetit.bind(this));
	tweetbtn.addEventListener("touchend", this.tweetit.bind(this));


	// Listen to swipe events
	var touchStartClientX, touchStartClientY;
	var gameContainer = document.getElementsByClassName("game-container")[0];

	gameContainer.addEventListener("touchstart", function(event) {
		if (event.touches.length > 1) return;

		touchStartClientX = event.touches[0].clientX;
		touchStartClientY = event.touches[0].clientY;
		event.preventDefault();
	});

	gameContainer.addEventListener("touchmove", function(event) {
		event.preventDefault();
	});

	gameContainer.addEventListener("touchend", function(event) {
		if (event.touches.length > 0) return;

		var dx = event.changedTouches[0].clientX - touchStartClientX;
		var absDx = Math.abs(dx);

		var dy = event.changedTouches[0].clientY - touchStartClientY;
		var absDy = Math.abs(dy);

		if (Math.max(absDx, absDy) > 10) {
			// (right : left) : (down : up)
			self.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
		}
	});
};

KeyboardInputManager.prototype.restart = function(event) {
	event.preventDefault();
	this.emit("restart");
};

////////////////////////////////
window.fakeStorage = {
	_data: {},

	setItem: function(id, val) {
		return this._data[id] = String(val);
	},

	getItem: function(id) {
		return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
	},

	removeItem: function(id) {
		return delete this._data[id];
	},

	clear: function() {
		return this._data = {};
	}
};

function LocalScoreManager() {
	var localSupported = !! window.localStorage;

	this.key = "bestScore";
	this.storage = localSupported ? window.localStorage : window.fakeStorage;
}

LocalScoreManager.prototype.get = function() {
	return this.storage.getItem(this.key) || 0;
};

LocalScoreManager.prototype.set = function(score) {
	this.storage.setItem(this.key, score);
};

/////////////////////////////
function Tile(position, value) {
	this.x = position.x;
	this.y = position.y;
	this.value = value || 2;

	this.previousPosition = null;
	this.mergedFrom = null; // Tracks tiles that merged together
}

Tile.prototype.savePosition = function() {
	this.previousPosition = {
		x: this.x,
		y: this.y
	};
};

Tile.prototype.updatePosition = function(position) {
	this.x = position.x;
	this.y = position.y;
};