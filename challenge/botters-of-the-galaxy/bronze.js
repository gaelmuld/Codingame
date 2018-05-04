/*************************\
|*LES FONCTIONS GÉNÉRALES*|
\*************************/

function distance(unite, ennemy) {
    return Math.sqrt((ennemy.x - unite.x) * (ennemy.x - unite.x) + (ennemy.y - unite.y) * (ennemy.y - unite.y));
}

function view(obj) {
    var result = [];
    for (var key in obj) {
        result.push([key + '=>' + obj[key]]);
    }
    printErr(result);
}

function viewAll(objs) {
    for (let obj of objs) {
        view(obj);
    }
}

Array.prototype.unique = function () {
    return this.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
}

function onRange(unite) {
    let teamVS = 1 - unite.team,
        attaquable = [],
        oppTeam = players[teamVS],
        ratioTime = unite.unitType == 'HERO' ? 0.1 : 0.2,
        attRange = 0;
    if (unite.attackRange <= 150)
        attRange = (1 - ratioTime) * unite.movementSpeed + unite.attackRange;
    else
        attRange = unite.attackRange + 100;

    for (let ennemy of oppTeam.unites) {
        if (distance(unite, ennemy) < attRange) {
            attaquable.push(ennemy);
            ennemy.targetValue += 1;
        }
    }

}

function listTarget() {
    let targets = players[1].unites.filter(unite => unite.targetValue > 0).sort(
        function (a, b) {
            return b.targetValue - a.targetValue;
        });
    return targets.length ? targets[0] : null;
}


/***********\
|*ACTION IA*|
\***********/


function actions(unite) {
    let hero = unite;
    var startTime = new Date().getTime();

    // votre code à mesurer ici


    /*************\
    |*DEBUGS DATA*|
    \*************/

    //view(bushes);
    //viewAll(items);
    //view(hero);
    //view(players[1]);
    //viewAll(player[0].unites);


    /***********\
    |*VARIABLES*|
    \***********/

    var action = 'WAIT'; //action à faire - de base rien faire
    var nearestDist = Infinity;
    var side = myTeam ? -1 : 1; //droite -1 \ gauche +1 
    var sumPos = 0, //somme des positions des unités alliers
        numUnit = 0, // nbre d'unités alliers
        goX = '',
        goY = hero.y;
    var targets = [];

    /***********************\
    |*FONCTIONS SPÉCIFIQUES*|
    \***********************/

    //selection Ennemy

    function SafeArea(unite) {
        let team = unite.team;

    }
    for (let ennemy of players[1].unites) {
        if (distance(hero, ennemy) <= nearestDist) {
            nearestEnnemy = ennemy;
            nearestDist = distance(hero, ennemy);
        }
    }
    //Defence position
    for (let ally of player1.unites) {
        if (ally.unitType == "UNIT") {
            sumPos += ally.x;
            numUnit += 1;
        }
    }
    var posMoyTeam = numUnit ? sumPos / numUnit : 960 - 860 * side;
    action = 'WAIT';
    var rangeAttak = distance(hero, nearestEnnemy) < hero.attackRange * 1.2;
    var closeWarning = distance(hero, nearestEnnemy) < 180 * 0.7;
    var safeBattle = distance(hero, ennemyTower) > 500;

    /*********\
    |*ACTIONS*|
    \*********/


    if (!rangeAttak) {
        goX = Math.round(hero.x + (distance(hero, nearestEnnemy) / 4 * side))
        action = 'MOVE ' + goX + ' ' + goY;
    }
    if (rangeAttak) {
        action = 'ATTACK ' + listTarget().unitId;
        if (numUnit > 5) {
            action = 'ATTACK_NEAREST HERO';
        }
    }
    if (closeWarning || !safeBattle) {
        goX = Math.round(hero.x - (180 * side))
        action = 'MOVE ' + goX + ' ' + goY;
    }
    if (posMoyTeam * side < hero.x * side) {
        goX = Math.round(posMoyTeam - (100 * side))
        action = 'MOVE ' + goX + ' ' + goY;
    }
    return action;
}
/*************\
|*LES CLASSES*|
\*************/

function Bushes() { // usefrul from wood1, represents the number of bushes and the number of places where neutral units can spawn
    this.entityType = ''; // BUSH, from wood1 it can also be SPAWN
    this.x = '';
    this.y = '';
    this.radius = '';
}

function Items() { // useful from wood2
    this.itemName = ''; // contains keywords such as BRONZE, SILVER and BLADE, BOOTS connected by "_" to help you sort easier
    this.itemCost = ''; // BRONZE items have lowest cost, the most expensive items are LEGENDARY
    this.damage = ''; // keyword BLADE is present if the most important item stat is damage
    this.health = '';
    this.maxHealth = '';
    this.mana = '';
    this.maxMana = '';
    this.moveSpeed = ''; // keyword BOOTS is present if the most important item stat is moveSpeed
    this.manaRegeneration = '';
    this.isPotion = ''; // 0 if it's not instantly consumed
}

function Unites() {
    this.unitId = '';
    this.team = '';
    this.unitType = ''; // UNIT, HERO, TOWER, can also be GROOT from wood1
    this.x = '';
    this.y = '';
    this.attackRange = '';
    this.health = '';
    this.maxHealth = '';
    this.shield = ''; // useful in bronze
    this.attackDamage = '';
    this.movementSpeed = '';
    this.stunDuration = ''; // useful in bronze
    this.goldValue = '';
    this.countDown1 = ''; // all countDown and mana variables are useful starting in bronze
    this.countDown2 = '';
    this.countDown3 = '';
    this.mana = '';
    this.maxMana = '';
    this.manaRegeneration = '';
    this.heroType = ''; // DEADPOOL, VALKYRIE, DOCTOR_STRANGE, HULK, IRONMAN
    this.isVisible = ''; // 0 if it isn't
    this.itemsOwned = ''; // useful from wood1
    this.targetValue; // valeur de targeting
}

function Players() {
    this.gold = '';
    this.roundType = ''; // a positive value will show the number of heroes that await a command
    this.unites = [];
}
/***************\
|*LES VARIABLES*|
\***************/

var bushes = [],
    items = [],
    players = [];
var choseHero1, choseHero2, hero, ennemyTower;
var myTeam = parseInt(readline());
var bushAndSpawnPointCount = parseInt(readline());
for (var i = 0; i < bushAndSpawnPointCount; i++) {
    var bushe = new Bushes();
    var inputs = readline().split(' ');
    bushe.entityType = inputs[0];
    bushe.x = parseInt(inputs[1]);
    bushe.y = parseInt(inputs[2]);
    bushe.radius = parseInt(inputs[3]);
    bushes.push(bushe);
}
var itemCount = parseInt(readline());
for (var i = 0; i < itemCount; i++) {
    var item = new Items();
    var inputs = readline().split(' ');
    item.itemName = inputs[0];
    item.itemCost = parseInt(inputs[1]);
    item.damage = parseInt(inputs[2]);
    item.health = parseInt(inputs[3]);
    item.maxHealth = parseInt(inputs[4]);
    item.mana = parseInt(inputs[5]);
    item.maxMana = parseInt(inputs[6]);
    item.moveSpeed = parseInt(inputs[7]);
    item.manaRegeneration = parseInt(inputs[8]);
    item.isPotion = parseInt(inputs[9]);
    items.push(item);
}
items.sort(function (a, b) {
    if (a.damage > 0) {
        return (b.damage / b.itemCost - a.damage / a.itemCost);
    } else {
        return 1;
    }
});
var player1 = new Players(),
    player2 = new Players();
/***********\
|*GAME LOOP*|
\***********/
while (true) {
    player2.unites = [];
    player1.unites = [];
    player1.gold = parseInt(readline());
    player2.gold = parseInt(readline());
    player1.roundType = parseInt(readline()); // a positive value will show the number of heroes that await a command
    player2.roundType = player1.roundType;
    var entityCount = parseInt(readline());
    for (var i = 0; i < entityCount; i++) {
        var unite = new Unites();
        var inputs = readline().split(' ');
        unite.unitId = parseInt(inputs[0]);
        unite.team = parseInt(inputs[1]);
        unite.unitType = inputs[2]; // UNIT, HERO, TOWER, can also be GROOT from wood1
        unite.x = parseInt(inputs[3]);
        unite.y = parseInt(inputs[4]);
        unite.attackRange = parseInt(inputs[5]);
        unite.health = parseInt(inputs[6]);
        unite.maxHealth = parseInt(inputs[7]);
        unite.shield = parseInt(inputs[8]); // useful in bronze
        unite.attackDamage = parseInt(inputs[9]);
        unite.movementSpeed = parseInt(inputs[10]);
        unite.stunDuration = parseInt(inputs[11]); // useful in bronze
        unite.goldValue = parseInt(inputs[12]);
        unite.countDown1 = parseInt(inputs[13]); // all countDown and mana variables are useful starting in bronze
        unite.countDown2 = parseInt(inputs[14]);
        unite.countDown3 = parseInt(inputs[15]);
        unite.mana = parseInt(inputs[16]);
        unite.maxMana = parseInt(inputs[17]);
        unite.manaRegeneration = parseInt(inputs[18]);
        unite.heroType = inputs[19]; // DEADPOOL, VALKYRIE, DOCTOR_STRANGE, HULK, IRONMAN
        unite.isVisible = parseInt(inputs[20]); // 0 if it isn't
        unite.itemsOwned = parseInt(inputs[21]); // useful from wood1
        unite.targetValue = 0;

        if (unite.team === myTeam) {
            player1.unites.push(unite);
        } else {
            player2.unites.push(unite);
        }
    }
    /*****************\
    |resultat une fois|
    \*****************/
    var players = [player1, player2];
    for (let unite of players[0].unites) {
        onRange(unite)
    }

    /*******\
    |*PRINT*|
    \*******/
    if (!choseHero1 && !choseHero2) {
        choseHero1 = 'IRONMAN';
        choseHero2 = 'VALKYRIE';
        print(choseHero1);
        print(choseHero2);
        continue;
    }
    if (!ennemyTower) {
        for (let ennemy of players[1].unites) {
            if (ennemy.unitType === 'TOWER') {
                ennemyTower = ennemy;
                break;
            }
        }
    }
    for (let unite of players[0].unites) {
        if (unite.unitType === 'HERO') {
            print(actions(unite));
            printErr(unite.heroType, '->', actions(unite));
        }

    }
}
