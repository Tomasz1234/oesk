jsonData = {
"insert": {
"mysql": {
"2500": [
{
"time": 0.68666100502014,
"measured_at": "2022-01-21 22:17:03"
}
],
"5000": [
{
"time": 1.2965428829193,
"measured_at": "2022-01-21 21:19:07"
}
]
},
"mongodb": {
"2500": [
{
"time": 2.7680230140686,
"measured_at": "2022-01-21 22:17:10"
}
],
"5000": [
{
"time": 4.7095651626587,
"measured_at": "2022-01-21 21:19:20"
}
]
}
},
"select": {
"mysql": {
"2500": [
{
"time": 0.055603742599487,
"measured_at": "2022-01-21 22:17:04"
}
],
"5000": [
{
"time": 0.11325693130493,
"measured_at": "2022-01-21 21:19:07"
}
]
},
"mongodb": {
"2500": [
{
"time": 0.38271880149841,
"measured_at": "2022-01-21 22:17:11"
}
],
"5000": [
{
"time": 0.79431819915771,
"measured_at": "2022-01-21 21:19:20"
}
]
}
},
"update": {
"mysql": {
"2500": [
{
"time": 0.47152209281921,
"measured_at": "2022-01-21 22:17:04"
}
],
"5000": [
{
"time": 1.7106709480286,
"measured_at": "2022-01-21 21:19:09"
}
]
},
"mongodb": {
"2500": [
{
"time": 1.6990346908569,
"measured_at": "2022-01-21 22:17:12"
}
],
"5000": [
{
"time": 3.3800339698792,
"measured_at": "2022-01-21 21:19:24"
}
]
}
},
"delete": {
"mysql": {
"2500": [
{
"time": 0.58999514579773,
"measured_at": "2022-01-21 22:17:05"
}
],
"5000": [
{
"time": 0.57951498031616,
"measured_at": "2022-01-21 21:19:09"
}
]
},
"mongodb": {
"2500": [
{
"time": 1.1947767734528,
"measured_at": "2022-01-21 22:17:14"
}
],
"5000": [
{
"time": 2.4008667469025,
"measured_at": "2022-01-21 21:19:26"
}
]
}
}
}

async function getData() {
  const data = await fetch('http://database-test.ddns.net/api/get-data');
  const textData = await data.text();
  const removeDelete = await textData.replaceAll('delete', 'remove');
  const jsonData = await JSON.parse(removeDelete);
  console.log(jsonData)  
  return jsonData;
}


getData().then(result=>{
  if(result === ''){result = this.jsonData};
  const {insert, remove, select, update} = result;
  const {mongodb: insertMongo, mysql: insertMysql} = insert;
  const {mongodb: removeMongo, mysql: removeMysql} = remove;
  const {mongodb: selectMongo, mysql: selectMysql} = select;
  const {mongodb: updateMongo, mysql: updateMysql} = update;
  drawChart(insertMongo, insertMysql, 0)
  drawChart(removeMongo, removeMysql, 1)
  drawChart(selectMongo, selectMysql, 2)
  drawChart(updateMongo, updateMysql, 3)
});


function mean(arr){
  let sum = 0;
  arr.forEach(e=>{
    sum +=e;
    console.log(sum)
  })
  return sum / length(arr);
};



function getTime(x){
  const timeTable = [0];
  x.forEach((element) => {
      timeTable.push(element[0].time);
  });
  return timeTable;
}

function deleteRecord(){
  var xhr = new XMLHttpRequest();
xhr.open("DELETE", "http://database-test.ddns.net/api/remove-all-data", true);

xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

// xhr.onreadystatechange = function () {
// if (xhr.readyState === 4) {
// console.log(xhr.responseText);
// }}
xhr.send();
}


function startBenchmark() {
const records = document.getElementById('records').value;
var xhr = new XMLHttpRequest();
xhr.open("POST", "http://database-test.ddns.net/api/order-benchmark", true);

xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

xhr.onreadystatechange = function () {
if (xhr.readyState === 4) {
console.log(xhr.responseText);
}}
const data = `usersRecord=${records}`;
xhr.send(data);
}

function checkBenchmark() {
var xhr = new XMLHttpRequest();
xhr.open("GET", "http://database-test.ddns.net/api/is-benchmark-done/1", true);

xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

xhr.onreadystatechange = function () {
if (xhr.readyState === 4) {
console.log(xhr.responseText);
}}
xhr.send();
}

checkBenchmark();


function drawChart(mongo, mysql, id){
const ctx = document.getElementById(`chart${id}`).getContext("2d");
      const myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: [0, ...Object.keys(mongo)],
          datasets: [
            {
              label: "MongoDB",
              fill: false,
              data: getTime(Object.values(mongo)),
              borderColor: [
                "rgba(255, 99, 132, 1)",
              ],
              borderWidth: 5,
            },
            {
              label: "MySQL",
              fill: false,
              data: getTime(Object.values(mysql)),
              borderColor: [
                "rgba(255, 150, 0, 1)",
              ],
              borderWidth: 5,
            }
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
            yAxes: [{
              scaleLabel:{
              display: true,
              labelString: 'Czas[s]'
                }
              }],
            xAxes: [{
              scaleLabel:{
              display: true,
              labelString: 'Liczba rekordów'
                }
              }]
            }     
    }
  })
}