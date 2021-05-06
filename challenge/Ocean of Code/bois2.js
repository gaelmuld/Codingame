/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/
/**************************\
|**Les Constantes de jeu**|
\**************************/
const WATER = ".";
const GROUND = "x";

var inputs = readline().split(' ');
const WIDTH = parseInt(inputs[0]);
const HEIGHT = parseInt(inputs[1]);
const ME = parseInt(inputs[2]);
/**********************\
|**Les Classes de jeu**|
\**********************/

class Game {
	constructor(map, me, pvEnnemy) {
		this.map = map;
		this.Me = me;
		this.PVEnnemy = pvEnnemy;
	}
}
class Tuile {
	constructor(type, posX, posY) {
		this.type = type;
		this.x = posX;
		this.y = posY;
		this.place = posX + posY * WIDTH
	}
}
class Map {
	constructor(tuiles) {
		this.carte = tuiles;
	}
	getTuile(posX, posY) {
		let response = this.carte[posX + posY * WIDTH];
		return response;
	}
	getTuileFromPlace(code) {
		return this.getTuile(code % WIDTH, Math.floor(code / WIDTH));
	}
}
class Me {
	constructor(id, posX, posY, life, CD) {
		this.id = id;
		this.x = posX;
		this.y = posY;
		this.life = life;
		this.cd = CD;
	}
}
class CountDown {
	constructor(torpedo, sonar, silence, mine) {
		this.torpedo = torpedo;
		this.sonar = sonar;
		this.silence = silence;
		this.mine = mine;
	}
	addCD(power) {
		switch (power) {
			case "TORPEDO":
				this.torpedo++;
				break;
			case "SONAR":
				this.sonar++;
				break;
			case "SILENCE":
				this.silence++;
				break;
			case "MINE":
				this.mine++;
				break;
		}
	}
	ready(power) {
		switch (power) {
			case "TORPEDO":
				return this.torpedo == 3;
				/*case "SONAR":
					this.sonar++;
					break;
				case "SILENCE":
					this.silence++;
					break;
				case "MINE":
					this.mine++;
					break;*/
		}
	}
	use(power) {
		switch (power) {
			case "TORPEDO":
				return this.ready(power) ? this.torpedo = 0 : false;
				/*case "SONAR":
					this.sonar++;
					break;
				case "SILENCE":
					this.silence++;
					break;
				case "MINE":
					this.mine++;
					break;*/
		}
	}
}
class Ennemy {
	constructor(life, order) {
		this.id = 1 - ME;
		this.life = life;
		this.order = order;
		this.moves = [];
		this.pos = [];
	}
	getInfo() {
		let orders = [];
		let infos = this.order.split("|");
		for (let info of infos) {
			let grabInfo = info.split(" ");
			switch (grabInfo[0]) {
				case 'MOVE':
					this.moves.push(grabInfo[1]);
					switch (grabInfo[1]) {
						case 'N':
							this.pos = this.pos.map(x => x - WIDTH).filter(y => y >= 0);
							this.pos = this.pos.filter(t => MAP.getTuileFromPlace(t).type == WATER);
							break;
						case 'S':
							this.pos = this.pos.map(x => x + WIDTH).filter(y => y < (WIDTH - 1 * HEIGHT - 1));
							this.pos = this.pos.filter(t => MAP.getTuileFromPlace(t).type == WATER);
							break;
						case 'W':
							this.pos = this.pos.filter(y => y > 0).map(x => x - 1);
							this.pos = this.pos.filter(t => MAP.getTuileFromPlace(t).type == WATER);
							break;
						case 'E':
							this.pos = this.pos.filter(y => y % WIDTH < WIDTH - 1).map(x => x + 1);
							this.pos = this.pos.filter(t => MAP.getTuileFromPlace(t).type == WATER);
							break;
					}
					orders.push(["MOVE", grabInfo[1]]);
					break;
				case 'SURFACE':
					let area = grabInfo[1];
					let tuileArea = [];
					let firstx = ((area - 1) % 3) * 5;
					let lastx = ((area - 1) % 3) * 5 + 4;
					let firsty = Math.floor((area - 1) / 3) * 5;
					let lasty = Math.floor((area - 1) / 3) * 5 + 4;
					this.pos = this.pos.filter(t => t % 15 >= firstx && t % 15 <= lastx &&
						Math.floor(t / 15) >= firsty && Math.floor(t / 15) <= lasty);

					orders.push(["SURFACE", grabInfo[1]]);
					break;
				case 'TORPEDO':
					//TODO améliorer les pos possibles
					let possiblePos = impact(grabInfo[1], grabInfo[2], 4);
					this.pos = possiblePos.filter(obj => this.pos.indexOf(obj) != -1);
					orders.push(["TORPEDO", grabInfo[1], grabInfo[2]]);
					break;
				case 'MSG':
					orders.push(["MSG", grabInfo[1]]);
					break;
			}
		}
		return (orders);
	}
	hitInfo(prevLife) {
		if (prevLife - this.life == 2) {
			for (let order of this.getInfo()) {
				if (order[0] == "TORPEDO") {
					this.pos = MAP.getTuile(order[1], order[2]).place;
				}
			}
		}
		if (prevLife - this.life == 1) {
			for (let order of this.getInfo()) {
				if (order[0] == "TORPEDO") {
					let impact = MAP.getTuile(order[1], order[2]);
					//TODO regler le soucis de recupération de tuile
					console.error(MAP.getTuile(order[1], order[2]));
					let touch = MAP.carte.filter(t => Math.abs(t.x - impact.x) <= 1 &&
						Math.abs(t.y - impact.y) <= 1 &&
						!((t.x - impact.x) == 0 && (t.y - impact.y) == 0)).map(t => t.place);
					this.pos = this.pos.filter(t => touch.indexOf(t) != -1);
				}
			}
		}
	}
}
/*************************\
|**Les Fonctions de jeu**|
\*************************/
function impact(posX, posY, radius) {
	//console.error("posX : " + posX + "--posY : " + posY + "--rad : " + radius)
	let possiblePos = []
	for (let rangeX = -radius; rangeX <= radius; rangeX++) {
		let radiusY = radius - Math.abs(rangeX);
		for (let rangeY = -radiusY; rangeY <= radiusY; rangeY++) {
			let X = Math.min(Math.max(parseInt(posX + rangeX), 0), WIDTH - 1);
			let Y = Math.min(Math.max(parseInt(posY + rangeY), 0), HEIGHT - 1);
			let laTuile = MAP.getTuile(X, Y);
			if (laTuile.type == WATER && possiblePos.indexOf(laTuile.place) === -1) {
				//console.error(laTuile);
				possiblePos.push(laTuile.place);
			}
		}
	}
	return possiblePos;
}

/************************\
|**Les Variables de jeu**|
\************************/
let prevEnnemyLife = -10;
var tuiles = [];
let opp = new Ennemy(0, '');
for (let i = 0; i < HEIGHT; i++) {
	const line = readline().split('');
	for (let j = 0; j < WIDTH; j++) {
		tuiles.push(new Tuile(line[j], j, i));
	}
}
const MAP = new Map(tuiles);
opp.pos = MAP.carte.filter(t => t.type == '.').map(t => t.place);
// Write an action using console.log()
// To debug: console.error('Debug messages...');

/** Position de départ **/

console.log('5 14');

/********* ***********\
|**La Boucle de jeu**|
\********** **********/
while (true) {
	var inputs = readline().split(' ');
	const x = parseInt(inputs[0]);
	const y = parseInt(inputs[1]);
	const myLife = parseInt(inputs[2]);
	const oppLife = parseInt(inputs[3]);
	const torpedoCooldown = parseInt(inputs[4]);
	const sonarCooldown = parseInt(inputs[5]);
	const silenceCooldown = parseInt(inputs[6]);
	const mineCooldown = parseInt(inputs[7]);
	const sonarResult = readline();
	const opponentOrders = readline();
	let cd = new CountDown(torpedoCooldown, sonarCooldown, silenceCooldown, mineCooldown);
	let moi = new Me(ME, x, y, myLife, cd);
	opp.life = oppLife;
	opp.order = opponentOrders;
	console.error(prevEnnemyLife - opp.life);
	console.error(opp.getInfo());
	opp.getInfo();
	opp.hitInfo(prevEnnemyLife);
	console.error(opp);
	prevEnnemyLife = oppLife;

	// Write an action using console.log()
	// To debug: console.error('Debug messages...');

	console.log('MOVE N TORPEDO');
}
