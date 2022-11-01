const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

let inputLines = [],
    height,
    width,
    idCounter,
    field = [];

readline.on("line", (line) => {
    inputLines.push(line); //считывание входных данных в массив
});

readline.on('close', function() {

    let firstLineArr = inputLines[0].split(" "),
        curLineArr,
        regionsInfo = []; //информация о регионах

    idCounter = 2; //плодородные земли, принадлежащие одному региону начнут менять свои значения на id региона. Т.к. значения 0 и 1 заняты, начинаем с 2
    width = firstLineArr[0]; // n - Ширина
    height = firstLineArr[1]; // m - Высота	

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
                markNeighbour(field, i, j);
                regionsInfo.push({"id": idCounter});
                idCounter++;
            }
        }
    }

    regionsInfo.forEach((element) => { //сбор информации о регионах
        element['leftTopCorner'] = getRegionCorners(field, element['id'])[0]['leftTopCorner'];
        element['rightBottomCorner'] = getRegionCorners(field, element['id'])[0]['rightBottomCorner'];
        element['area'] = calculateRegionArea(element['leftTopCorner'], element['rightBottomCorner']);
        element['fertility'] = countFertileLands(element['leftTopCorner'], element['rightBottomCorner'], element['id']); //подсчет плодородных земель в регионе
        element['effiency'] = element['fertility'] / element['area'];
    })

    //рассмотреть более раннюю фильтрацию
    let filteredRegionsInfo = regionsInfo.filter((element) => { //фильтрация регионов, площадь которых не больше 1
          return element['area']>1;
    });

    let mostEffectiveRegion = findMostEfectiveRegion(filteredRegionsInfo);

  	if(mostEffectiveRegion){
      console.log(mostEffectiveRegion['area']);
    }
  	else{
      console.log(0);
    }
    
});


function markNeighbour(field, i, j) {
    field[i][j] = idCounter;
    if ((j - 1) >= 0 && field[i][j - 1] === 1) { markNeighbour(field, i, j - 1) }
    if ((j + 1) < width && field[i][j + 1] === 1) { markNeighbour(field, i, j + 1) }
    if ((i + 1) < height && field[i + 1][j] === 1) { markNeighbour(field, i + 1, j) }
    if ((i - 1) >= 0 && field[i - 1][j] === 1) { markNeighbour(field, i - 1, j) }
    if ((i + 1) < height && (j + 1) < width && field[i + 1][j + 1] === 1) { markNeighbour(field, i + 1, j + 1) }
    if ((i - 1) >= 0 && (j - 1) >= 0 && field[i - 1][j - 1] === 1) { markNeighbour(field, i - 1, j - 1) }
    if ((i + 1) < height && (j - 1) >= 0 && field[i + 1][j - 1] === 1) { markNeighbour(field, i + 1, j - 1) }
    if ((i - 1) >= 0 && (j + 1) < width && field[i - 1][j + 1] === 1) { markNeighbour(field, i - 1, j + 1) }
}

function getRegionCorners(_field, regionId) {
    let latList = [],
        longList = [],
        leftTopCorner = [],
        rightBottomCorner = [];

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (_field[i][j] == regionId) {
                latList.push(i);
                longList.push(j);
            }
        }
    }

    leftTopCorner = [Math.min.apply(null, latList), Math.min.apply(null, longList)];
    rightBottomCorner = [Math.max.apply(null, latList), Math.max.apply(null, longList)];

    return [{
        "leftTopCorner": leftTopCorner,
        "rightBottomCorner": rightBottomCorner
    }];
}

function calculateRegionArea(topLeftCorner, bottomRightCorner) {
    return (bottomRightCorner[0] - topLeftCorner[0] + 1) * (bottomRightCorner[1] - topLeftCorner[1] + 1);
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

function countFertileLands(topLeftCorner, bottomRightCorner, regionId) {
    let fertileLands = 0;
    for (let i = topLeftCorner[0]; i <= bottomRightCorner[0]; i++) {
        for (let j = topLeftCorner[1]; j <= bottomRightCorner[1]; j++) {
            if (field[i][j] !== 0) {
                fertileLands++;
            }
        }
    }

    return fertileLands;
}
