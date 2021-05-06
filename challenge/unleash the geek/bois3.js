/**
 * Deliver more ore to hq (left side of the map) than your opponent. Use radars to find ore but beware of traps!
 **/
const VIDE = -1;
const RADAR = 2;
const EMP = 3;
const CRISTAL = 4;

const TROU = 1;
const CLEAR = 0;

const WAIT = 'WAIT';
const MOVE = 'MOVE';
const DIG = 'DIG';
const REQUEST = 'REQUEST';
var test = 0;

function pos(posX, posY) {
	return posX + (width * posY);
}

function tuile(posX, posY) {
	return TUILES[pos(posX, posY)];
}
class Grille {
	constructor(width, height, tuiles) {
		this.width = width;
		this.height = height;
		this.tuiles = tuiles;
	}
	tuille(pos, posY = null) {
		if (posY == null)
			return this.tuiles[pos];
		return this.tuiles[pos + (width * posY)];

	}
}
class Tuile {
	constructor(ore, hole, id) {
		this.ore = ore;
		this.hole = hole;
		this.posX;
		this.posY;
		this.id = id;
		this.setPos(id);
	}
	setPos(id) {
		this.posX = id % width;
		this.posY = Math.floor(id / width);
	}
	nears() {
		let up = null;
		let left = null;
		let right = null;
		let down = null;
		if (this.posY > 0)
			up = TUILES[this.id - width];
		if (this.posX != 0)
			left = TUILES[this.id - 1];
		if (this.posX != width - 1)
			right = TUILES[this.id + 1];
		if (this.id < width * (height - 1))
			down = TUILES[this.id + width];

		return [up, left, right, down];
	}

}
class Joueur {
	constructor(score, bots, radar, trap, visible) {
		this.score = score;
		this.bots = bots;
		this.radar = radar;
		this.trap = trap;
		this.visible = visible;
	}

}
class Quest {
	constructor(action, x, y) {
		this.action = action;
		this.x = x;
		this.y = y;
	}
	changeQuest(action, x, y) {
		this.action = action;
		this.x = x;
		this.y = y;
	}
}
class Bot {
	constructor(id, type, posX, posY, item) {
		this.id = id;
		this.type = type;
		this.posX = posX;
		this.posY = posY;
		this.item = item;
		this.action = WAIT;

	}
	isDestroy() {
		return (this.posX === -1 && this.posY === -1);
	}
	getTuile() {
		return GRILLE.tuille(this.posX, this.posY);
	}
	onQG() {
		return this.posX === 0;
	}
	backQG() {
		this.action = `${MOVE} 0, ${this.posY}`;
	}


}
class Game {
	constructor(grille, joueurs) {
		this.grille = grille;
		this.joueurs = joueurs;
	}

}

var inputs = readline().split(' ');
const width = parseInt(inputs[0]);
const height = parseInt(inputs[1]); // size of the map

// logique

function lookLine(bot) {
	//recupe la quete
	let quest = QUEST[bot.id];
	//pas de quete => en créer une
	if (quest) {
		quest.x = Math.min(quest.x, width - 1)
		quest.y = Math.min(quest.y, height - 1)
		quest.x = Math.max(quest.x, 0)
		quest.y = Math.max(quest.y, 0)
	}
	if (!quest) {
		quest = new Quest(DIG, bot.posX + 3, bot.posY);
		QUEST.push(quest);
	}
	//cristal en main ?
	else if (bot.item == CRISTAL) {
		// retour au QG
		if (bot.onQG() == false && quest.action == DIG) {
			quest.action = MOVE;
			quest.x = 0;
			quest.y = bot.posY + 1;
		}
	} else {
		if (bot.onQG() && bot.item != CRISTAL) {
			quest.changeQuest(DIG, bot.posX + 2, bot.posY);
		}
		if (tuile(quest.x, quest.y).hole === TROU) {
			if (bot.posX + 3 < width) {

				quest.x += 3;
			} else {
				quest.x = 1;
				quest.y -= 1;
			}
		}
		if (bot.posX + 3 > width) {
			quest.x = 1;
			quest.y -= 1;
		}
	}
	bot.action = `${quest.action} ${quest.x} ${quest.y}`;
}

// game loop
var QUEST = [];
while (true) {

	var TUILES = [];
	var JOUEURS = [];
	var inputs = readline().split(' ');
	const myScore = parseInt(inputs[0]); // Amount of ore delivered
	const opponentScore = parseInt(inputs[1]);
	for (let i = 0; i < height; i++) {
		var inputs = readline().split(' ');
		for (let j = 0; j < width; j++) {
			const ore = inputs[2 * j]; // amount of ore or "?" if unknown
			const hole = parseInt(inputs[2 * j + 1]); // 1 if cell has a hole
			let tuile = new Tuile(ore, hole, j + width * i);
			TUILES.push(tuile);
		}
	}
	var inputs = readline().split(' ');
	const entityCount = parseInt(inputs[0]); // number of entities visible to you
	const radarCooldown = parseInt(inputs[1]); // turns left until a new radar can be requested
	const trapCooldown = parseInt(inputs[2]); // turns left until a new trap can be requested
	var BOTS = [];
	for (let i = 0; i < entityCount; i++) {
		var inputs = readline().split(' ');
		const id = parseInt(inputs[0]); // unique id of the entity
		const type = parseInt(inputs[1]); // 0 for your robot, 1 for other robot, 2 for radar, 3 for trap
		const x = parseInt(inputs[2]);
		const y = parseInt(inputs[3]); // position of the entity
		const item = parseInt(inputs[4]); // if this entity is a robot, the item it is carrying (-1 for NONE, 2 for RADAR, 3 for TRAP, 4 for ORE)
		let bot = new Bot(id, type, x, y, item)
		if (type === 0)
			BOTS.push(bot);
	}
	joueur1 = new Joueur(myScore, BOTS, radarCooldown, trapCooldown, entityCount);
	JOUEURS.push(joueur1);
	GRILLE = new Grille(width, height, TUILES)
	GAME = new Game(GRILLE, JOUEURS);
	const me = GAME.joueurs[0];

	console.error(QUEST);
	for (let i = 0; i < 5; i++) {
		let bot = me.bots[i];
		lookLine(bot);
		// Write an action using console.log()
		// To debug: console.error('Debug messages...');
		const posX = bot.posX;
		const posY = bot.posY;
		console.log(bot.action);

	}
}
