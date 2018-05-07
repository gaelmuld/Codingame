var lon = parseFloat(readline().replace(',', '.'));
var lat = parseFloat(readline().replace(',', '.'));
var N = parseInt(readline());
var prevD = Infinity;
var nam;
for (var i = 0; i < N; i++) {
    var defib = readline().split(';');
    var len = defib.length;
    lonD = parseFloat(defib[len - 2].replace(',', '.'));
    latD = parseFloat(defib[len - 1].replace(',', '.'));

    let x = (lonD - lon) * Math.cos((lat + latD) / 2);
    let y = (latD - lat);
    let d = Math.sqrt(x * x + y * y) * 6371;

    if (prevD > d) {
        prevD = d;
        nam = defib[1];
    }
}
print(nam);
