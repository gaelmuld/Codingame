//section CLASS

class Witch {
	constructor(witch) {
		this.inv = [parseInt(witch[0]), parseInt(witch[1]), parseInt(witch[2]), parseInt(witch[3])]; //tiers ingredients in inventory
		this.score = parseInt(witch[4]); // amount of rupees
	}
}
class Order {
	constructor(order) {
		this.id = parseInt(order[0]); // the unique ID of this spell or recipe
		this.type = order[1]; //BREW(preparer), CAST(sort), OPPONENT_CAST(sort opposant); Later LEARN, BREW
		this.delta = [parseInt(order[2]), parseInt(order[3]), parseInt(order[4]), parseInt(order[5])]; // ingredient change
		this.price = parseInt(order[6]); // the price in rupees if this is a potion
		this.tomeIndex = parseInt(order[7]); // in the first two leagues: always 0; later: the index in the tome if this is a tome spell, equal to the read-ahead tax; For brews, this is the value of the current urgency bonus
		this.taxCount = parseInt(order[8]); // in the first two leagues: always 0; later: the amount of taxed tier-0 ingredients you gain from learning this spell; For brews, this is how many times you can still gain an urgency bonus
		this.castable = order[9] !== '0'; // in the first league: always 0; later: 1 if this is a castable player spell
		this.repeatable = order[10] !== '0'; // for the first two leagues: always 0; later: 1 if this is a repeatable player spell
	}
}
class Cast {
	constructor(order) {
		this.id = parseInt(order[0]); // the unique ID of this spell or recipe
		this.type = order[1]; //BREW(preparer), CAST(sort), OPPONENT_CAST(sort opposant); Later LEARN, BREW
		this.delta = [parseInt(order[2]), parseInt(order[3]), parseInt(order[4]), parseInt(order[5])]; // ingredient change
		this.tomeIndex = parseInt(order[7]); // in the first two leagues: always 0; later: the index in the tome if this is a tome spell, equal to the read-ahead tax; For brews, this is the value of the current urgency bonus
		this.taxCount = parseInt(order[8]); // in the first two leagues: always 0; later: the amount of taxed tier-0 ingredients you gain from learning this spell; For brews, this is how many times you can still gain an urgency bonus
		this.castable = order[9] !== '0'; // in the first league: always 0; later: 1 if this is a castable player spell
		this.repeatable = order[10] !== '0'; // for the first two leagues: always 0; later: 1 if this is a repeatable player spell
	}
}

//section FUNCTION

function sumArray(a1, a2) {
	let l1 = a1.length;
	let l2 = a2.length;
	if (l1.length != l2.length)
		return false;
	let result = new Array(l1);
	for (let i = 0; i < l1; i++) {
		result[i] = a1[i] + a2[i];
	}
	return result;
}


//section INITIALISATION

let objectif;

while (true) {
	const actionCount = parseInt(readline()); // the number of spells and recipes in play
	let orders = [];
	let casts = [];
	for (let i = 0; i < actionCount; i++) {
		order = readline().split(' ');
		if (order[1] == "CAST") {
			cast = new Cast(order);
			casts.push(cast);
		}
		if (order[1] == "BREW") {
			let brew = new Order(order);
			orders.push(brew);
		}
	}
	// witches
	let witches = [];
	for (let i = 0; i < 2; i++) {
		witches[i] = new Witch(readline().split(' '));
	}

	//section DATAS

	objectif = objectif || orders[0];
	let balance = sumArray(objectif.delta, witches[0].inv);



	//section LOGIQUE
	0

	//section DEBUG

	console.error("balance:", balance);
	console.error(objectif);

	//section OUTPUT


	if (balance.filter(x => x < 0).length == 0) {
		console.log('BREW ' + objectif.id);
		objectif = null;
	} else {
		console.log('WAIT');
		// in the first league: BREW <id> | WAIT; 
		// later: BREW <id> | CAST <id> [<times>] | LEARN <id> | REST | WAIT
		//console.log(action);
	}
}
