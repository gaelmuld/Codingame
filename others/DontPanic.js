function pErr(item,message =''){
    printErr((message?message:'')+item);
}
var previousStage =0;
var inputs = readline().split(' ');
var nbFloors = parseInt(inputs[0]); // number of floors
var width = parseInt(inputs[1]); // width of the area
var nbRounds = parseInt(inputs[2]); // maximum number of rounds
var exitFloor = parseInt(inputs[3]); // floor on which the exit is found
var exitPos = parseInt(inputs[4]); // position of the exit on its floor
var nbTotalClones = parseInt(inputs[5]); // number of generated clones
var nbAdditionalElevators = parseInt(inputs[6]); // ignore (always zero)
var nbElevators = parseInt(inputs[7]); // number of elevators
var elevatorFloor =[];
var elevatorPos =[];
for (var i = 0; i < nbElevators; i++) {
    var inputs = readline().split(' ');
    elevatorFloor.push(parseInt(inputs[0])); // floor on which this elevator is found
    elevatorPos.push(parseInt(inputs[1])); // position of the elevator on its floor
}
// game loop
while (true) {
    var inputs = readline().split(' ');
    var cloneFloor = parseInt(inputs[0]); // floor of the leading clone
    var clonePos = parseInt(inputs[1]); // position of the leading clone on its floor
    var direction = inputs[2]; // direction of the leading clone: LEFT or RIGHT
    var action ='WAIT';
    
    direction = direction === 'LEFT'? -1:1;
    if((exitPos-clonePos)*direction<=0 && exitFloor == cloneFloor)
        action='BLOCK';
    if((elevatorPos[elevatorFloor.indexOf(cloneFloor)]-clonePos)*direction<0)
        action='BLOCK';
    
//    elevatorFloor.map(x=>pErr(x+'-'+elevatorPos[x]));
//    pErr((elevatorPos[elevatorFloor.indexOf(cloneFloor)]-clonePos)*direction,'DISTANCE : ');

    print(action); // action: WAIT or BLOCK
}