const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

let inputLines = new Array(),
    height,
    width,
    idCounter;

readline.on("line", (line) => {
    inputLines.push(line); //считывание входных данных в массив
});

readline.on('close', function() {
    let firstLineArr = inputLines[0].split(" "),
        curLineArr,
        field = new Array(), 
        regionsInfo = new Array(); //информация о регионах
	
    idCounter = 2; //плодородные земли, принадлежащие одному региону начнут менять свои значения на id региона. Т.к. значения 0 и 1 заняты, начинаем с 2
	width = firstLineArr[0], // n - Ширина
  	height = firstLineArr[1], // m - Высота	
      
    inputLines.splice(0, 1); // исключение из входного массива информации о размерах поля

    for (let i = 0; i < height; i++) { //преобразование входных строк в массив
        curLineArr = inputLines[i].split(" ");
        field[i] = [];
        for (let j = 0; j < width; j++) {
            field[i].push(Number(curLineArr[j]));
        }
    }

    for (let i = 0; i < height; i++) { //маркировка регионов
        for (let j = 0; j < width; j++) {
            if (field[i][j] === 1) {
                getNeighbour(field, i, j);
                regionsInfo.push({"id": idCounter});
                idCounter++;
            }
        }
    }
  

    regionsInfo.forEach((element) => { //сбор информации о регионах
        element['area'] = calculateRegionArea(field, element['id']); //поиск площади региона
        element['fertility'] = countFertileLands(field, element['id']); //подсчет плодородных земель в регионе
        element['effiency'] = element['fertility'] / element['area'];
    })
  
    //рассмотреть более раннюю фильтрацию
    let filteredRegionsInfo = regionsInfo.filter((element) => { //фильтрация регионов, площадь которых не больше 1
        return element['area'] > 1;
    });

    let mostEffectiveRegion = findMostEfectiveRegion(filteredRegionsInfo);

    console.log(mostEffectiveRegion['area']);
});

function getNeighbour(field, i, j) {
    field[i][j] = idCounter;
    if ((j - 1) >= 0 && field[i][j - 1] === 1) { getNeighbour(field, i, j - 1) }
    if ((j + 1) < width && field[i][j + 1] === 1) { getNeighbour(field, i, j + 1) }
    if ((i + 1) < height && field[i + 1][j] === 1) { getNeighbour(field, i + 1, j) }
    if ((i - 1) >= 0 && field[i - 1][j] === 1) { getNeighbour(field, i - 1, j) }
    if ((i + 1) < height && (j + 1) < width && field[i + 1][j + 1] === 1) { getNeighbour(field, i + 1, j + 1) }
    if ((i - 1) >= 0 && (j - 1) >= 0 && field[i - 1][j - 1] === 1) { getNeighbour(field, i - 1, j - 1) }
    if ((i + 1) < height && (j - 1) >= 0 && field[i + 1][j - 1] === 1) { getNeighbour(field, i + 1, j - 1) }
    if ((i - 1) >= 0 && (j + 1) < width && field[i - 1][j + 1] === 1) { getNeighbour(field, i - 1, j + 1) }
}

function calculateRegionArea(_field, regionId) {
    let latList = Array();
    let longList = Array();
    let regionWidth;
    let regionHeight;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (_field[i][j] == regionId) {
                latList.push(i);
                longList.push(j);
            }
        }
    }

    regionWidth = calcMaxMinDiff(latList) + 1;
    regionHeight = calcMaxMinDiff(longList) + 1;

    return regionWidth * regionHeight;
}

function calcMaxMinDiff(arr) {
    let diff = Math.max.apply(null, arr) - Math.min.apply(null, arr);
    return diff;
}

function findMostEfectiveRegion(info) {
    let mostEffectiveRegion;
    let hugestEffiency = 0;
  	let regionArea = 0;

    info.forEach((element) => {
        if ((element['effiency'] > hugestEffiency) || (element['effiency'] == hugestEffiency && element['area'] > regionArea)) {
            hugestEffiency = element['effiency'];
          	regionArea = element['area'];
            mostEffectiveRegion = element;
        }
    });

    return mostEffectiveRegion;
}
function countFertileLands(_field, regionId) {
    let fertileLands = 0;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (_field[i][j] == regionId) {
                fertileLands++;
            }
        }
    }
    return fertileLands;
}
