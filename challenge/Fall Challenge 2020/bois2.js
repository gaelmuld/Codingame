class Witch {
	constructor(witch) {
		this.inv = [parseInt(witch[0]), parseInt(witch[1]), parseInt(witch[2]), parseInt(witch[3])]; //tiers ingredients in inventory
		this.score = parseInt(witch[4]); // amount of rupees
	}
}
class Order {
	constructor(order) {
		this.id = parseInt(order[0]); // the unique ID of this spell or recipe
		this.type = order[1]; // in the first league: BREW; later: CAST, OPPONENT_CAST, LEARN, BREW
		this.delta0 = parseInt(order[2]); // tier-0 ingredient change
		this.delta1 = parseInt(order[3]); // tier-1 ingredient change
		this.delta2 = parseInt(order[4]); // tier-2 ingredient change
		this.delta3 = parseInt(order[5]); // tier-3 ingredient change
		this.price = parseInt(order[6]); // the price in rupees if this is a potion
		this.tomeIndex = parseInt(order[7]); // in the first two leagues: always 0; later: the index in the tome if this is a tome spell, equal to the read-ahead tax; For brews, this is the value of the current urgency bonus
		this.taxCount = parseInt(order[8]); // in the first two leagues: always 0; later: the amount of taxed tier-0 ingredients you gain from learning this spell; For brews, this is how many times you can still gain an urgency bonus
		this.castable = order[9] !== '0'; // in the first league: always 0; later: 1 if this is a castable player spell
		this.repeatable = order[10] !== '0'; // for the first two leagues: always 0; later: 1 if this is a repeatable player spell
	}
}

while (true) {
	let action, id;
	let orders = [];
	let witches = [];

	const actionCount = parseInt(readline()); // the number of spells and recipes in play
	for (let i = 0; i < actionCount; i++) {
		orders[i] = new Order(readline().split(' '));
	}
	for (let i = 0; i < 2; i++) {
		witches[i] = new Witch(readline().split(' '));
	}
	console.error(orders, witches);

	// in the first league: BREW <id> | WAIT; 
	// later: BREW <id> | CAST <id> [<times>] | LEARN <id> | REST | WAIT
	console.log(action);
}
