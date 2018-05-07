var MESSAGE = readline();
var table =[];
for(var k in MESSAGE){
    lettre=MESSAGE[k];
    var result=lettre.charCodeAt();
    for(var i=0;i<7;i++){
        table.push(result%2);
        result=(result-result%2)/2;
    }
    table=table.reverse()
}