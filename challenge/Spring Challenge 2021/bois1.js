/**
 * CLASS GAME
 */
class Cell {
    constructor([index, richness, neigh0, neigh1, neigh2, neigh3, neigh4, neigh5]) {
        this.index = index; // 0 is the center cell, the next cells spiral outwards
        this.richness = richness; // 0 if the cell is unusable, 1-3 for usable cells
        this.neights = [neigh0,neigh1,neigh2,neigh3,neigh4,neigh5]; // the index of the neighbouring cell for each direction
        this.richVal = (richness - 1) * 2;
    }
    infos() {
        return `Tuile ${this.index}
Richesse ${this.richness} => ${this.richVal}
Tuiles proches ${this.neighs()}`
    }
}
class Tree {
    constructor([pos, size, isMine, isDormant]) {
        this.pos = pos; // location of this tree
        this.size = size; // size of this tree: 0-3
        this.isMine = isMine; // 1 if this is your tree
        this.isDormant = isDormant; // 1 if this tree is dormant
    }
}
class Tips {
    constructor(listMoves) {
        this.act = listMoves;
    }
}
class Player {
    constructor([sun, score, isWaiting = null]) {
        this.sun = sun; // sun points
        this.score = score; //current score
        this.isWaiting = isWaiting; // whether your opponent is asleep until the next day
    }
}
class Game {
    constructor(day, nutrients, table, trees, players, tips) {
        this.day = day; // the game lasts 24 days: 0-23
        this.nutrients = nutrients; // the base score you gain from the next COMPLETE action
        this.table = table;
        this.trees = trees;
        this.players = players;
        this.tips = tips;
        this.nTrees; // the current amount of trees
    }
}
const GROW = "GROW"; //GROW cellIdx
const SEED = "SEED"; //SEED sourceIdx targetIdx
const COMPLETE = "COMPLETE"; //COMPLETE cellIdx
const WAIT = "WAIT"; //WAIT <message>
const numberOfCells = parseInt(readline()); // 37
let table = [];
for (let i = 0; i < numberOfCells; i++) {
    table.push(new Cell(readline().split(' ')));
}

// game loop
while (true) {
    let players = [];
    let trees = [];
    let tips = [];
    const day = parseInt(readline());
    const nutrients = parseInt(readline());
    players[0] = new Player(readline().split(' '));
    players[1] = new Player(readline().split(' '));
    const numberOfTrees = parseInt(readline());
    for (let i = 0; i < numberOfTrees; i++) {
        trees.push(new Tree(readline().split(' ')));
    }
    const numberOfPossibleMoves = parseInt(readline());
    for (let i = 0; i < numberOfPossibleMoves; i++) {
        tips.push(new Tips(readline()));
    }
    const game = new Game(day, nutrients, table, trees, players, tips)

    //  |  |  | 
    console.log('COMPLETE ' + bestTrees(trees).pos);
}

function bestTrees(trees) {
    return [...trees].filter(x => x.isMine === '1').sort((x, y) => x.pos < y.pos)[0];
}
