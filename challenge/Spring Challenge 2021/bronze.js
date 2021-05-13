/**
 * CLASS GAME
 */
class Cell {
    constructor([index, richness, neigh0, neigh1, neigh2, neigh3, neigh4, neigh5]) {
        this.index = index; // 0 is the center cell, the next cells spiral outwards
        this.richness = richness; // 0 if the cell is unusable, 1-3 for usable cells
        this.neights = [neigh0, neigh1, neigh2, neigh3, neigh4, neigh5]; // the index of the neighbouring cell for each direction
        this.baseScore = richness > 0 ? (richness - 1) * 2 : 0; // score given after a COMPLETE act
    }
    infos() {
        return `Tuile ${this.index}
Richesse ${this.richness} => ${this.richVal}
Tuiles proches ${this.neighs()}`
    }
}
class Tree {
    constructor([pos, size, isMine, isDormant]) {
        this.pos = parseInt(pos); // location of this tree
        this.size = parseInt(size); // size of this tree: 0-3
        this.isMine = parseInt(isMine); // 1 if this is your tree
        this.isDormant = parseInt(isDormant); // 1 if this tree is dormant
        this.isSpooky = 0; // if 1 give 0 sun
        this.beSpooked=[];// turn when will be spooked
    }
    toString() {
        `${this.isMine} : ${this.pos} - ${this.size} - ${this.isDormant}`
    }
}
class Player {
    constructor([sun, score, isWaiting = null]) {
        this.sun = parseInt(sun); // sun points
        this.score = parseInt(score); //current score
        this.isWaiting = parseInt(isWaiting); // whether your opponent is asleep until the next day
        this.myTrees; // list of trees of player
    }
    toString() {
        return "sol : " + this.sun + "|scr : " + this.score + "|tot : " + (parseInt(this.score) + Math.floor(this.sun / 3))
    }
    sunGain() {
        let incomes = this.myTrees.filter(x => !x.isSpooky).map(x => x.size)
        if (incomes)
            return incomes.reduce((a, x) => a + x);
        return 0;
    }
}
class Game {
    constructor(day, nutrients, table, trees, players, tips, nTrees) {
        this.day = parseInt(day); // the game lasts 24 days: 0-23
        this.nutrients = parseInt(nutrients); // the base score you gain from the next COMPLETE action
        this.table = table; // table of game ( list of Cell )
        this.trees = trees; // table of trees ( list of Tree )
        this.players = players; //table of playerrs (list of Player)
        this.tips = tips; // table of possible acts
        this.nTrees = nTrees; // the current amount of trees
    }
    info() {
        return `
Jour : ${this.day};
Nutiments : ${this.nutrients};
J1: ${this.players[0]};
J2 : ${this.players[1]};
#arbres : ${this.trees.filter(x=>x.isMine==1).length} - ${this.trees.filter(x=>x.isMine!=1).length}`
    }
}

const GROW = "GROW"; //GROW cellIdx
const SEED = "SEED"; //SEED sourceIdx targetIdx
const COMPLETE = "COMPLETE"; //COMPLETE cellIdx
const WAIT = "WAIT"; //WAIT <message>
const LASTDAY = 23;
const numberOfCells = parseInt(readline()); // 37
var game;
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
    players[0].myTrees = trees.filter(x => x.isMine === 1);
    players[1].myTrees = trees.filter(x => x.isMine === 0);

    const numberOfPossibleMoves = parseInt(readline());
    for (let i = 0; i < numberOfPossibleMoves; i++) {
        tips.push(readline());
    }
    game = new Game(day, nutrients, table, trees, players, tips, numberOfTrees);
    for (let turn = 0; turn <= 5; turn++){
        fearTree(trees,turn);
    }
    console.log(ACT("messsage"));
}

function ACT(message) {
    let recoltedTree = game.players[0].myTrees.filter(x => x.size == 3).sort((x, y) => x.pos < y.pos);
    if (game.day > LASTDAY - 3) {
        if (recoltedTree.length && game.players[0].sun > 3) {
            return COMPLETE+" "+ recoltedTree.pop().pos + ' ' + message;
        } else {
            return WAIT +" "+ message;
        }
    } else {
        let tips = game.tips;
        tips.shift();
        let countTips = tips.length;
        let scores = [];
        for (let tip of tips) {
           scores.push([scoreAct(tip),tip]);
        }
        scores.sort((a, b) => b[0] - a[0]);
        console.error(scores);
        if (countTips > 0) {
            let action = scores[0][1];
            return action + " " + message
        }
    }
    return WAIT+" "+ message;
}
function costTree(tree) {
    if (tree.size == 3)
        return 4;
    return game.trees.filter(x => x.size == tree.size + 1).length + tree.size * (tree.size + 1) + 1;
}
function fearTree(tree, turn=0, pos = tree.pos, size = tree.size) {
    if (Array.isArray(tree)) {
        for (let t of tree) {
            fearTree(t, turn, pos, size)
        }
    }

    if (size > 0) {
        let cellSpooked = game.table[pos].neights[(game.day + turn) % 6];
        if (cellSpooked != -1) {
            treeSpooked = game.trees.filter(x => x.pos == cellSpooked)
            if (treeSpooked.length) {
                if (treeSpooked[0].size <= tree.size) {
                    if (turn == 0) {
                        treeSpooked[0].isSpooky = 1;
                    }
                    treeSpooked[0].beSpooked.push(turn);
                    //console.error(tree.pos + "=>" + treeSpooked[0].pos + " in " + turn);
                }
            }
            fearTree(tree, turn, cellSpooked, size - 1)
        }
    }
}
function countSizeTree(size, player = 1) {
    return game.players[player].myTrees.filter(x => x.size == size);
}
function scoreAct(tip) {
    [act, from,to] = tip.split(" ");
    from = parseInt(from);
    to = parseInt(to);
    let tree = getTreeFromPos(from);
    if (act == GROW) {
        let tree = getTreeFromPos(from);
        return (-(costTree(tree)) + (tree.size * (LASTDAY - game.day)));
    }
    if (act == SEED) {
        return (-(game.trees.filter(x => x.size == tree.size + 1).length + 1));
    }
    if (act == COMPLETE) {
        return ((game.table[from].baseScore + game.nutrients - 4) - (3 * (LASTDAY - game.day)));
    }
}
function getTreeFromPos(pos) {
    return game.trees.filter(x=>x.pos == pos)[0]
}