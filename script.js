jsonData = {
  "insert": {
    "mysql": {
      "2500": [
{
"time": 0,
"measured_at": "2022-01-21 22:17:03"
}
],
"5000": [
{
"time": 0,
"measured_at": "2022-01-21 21:19:07"
}
]
},
"mongodb": {
"2500": [
{
"time": 0,
"measured_at": "2022-01-21 22:17:10"
}
],
"5000": [
{
"time": 0,
"measured_at": "2022-01-21 21:19:20"
}
]
}
},
"select": {
"mysql": {
"2500": [
{
"time": 0,
"measured_at": "2022-01-21 22:17:04"
}
],
"5000": [
{
"time": 0,
"measured_at": "2022-01-21 21:19:07"
}
]
},
"mongodb": {
"2500": [
{
"time": 0,
"measured_at": "2022-01-21 22:17:11"
}
],
"5000": [
{
"time": 0,
"measured_at": "2022-01-21 21:19:20"
}
]
}
},
"update": {
"mysql": {
"2500": [
{
"time": 0,
"measured_at": "2022-01-21 22:17:04"
}
],
"5000": [
{
"time": 0,
"measured_at": "2022-01-21 21:19:09"
}
]
},
"mongodb": {
"2500": [
{
"time": 0,
"measured_at": "2022-01-21 22:17:12"
}
],
"5000": [
{
"time": 0,
"measured_at": "2022-01-21 21:19:24"
}
]
}
},
"remove": {
"mysql": {
"2500": [
{
"time": 0,
"measured_at": "2022-01-21 22:17:05"
}
],
"5000": [
{
"time": 0,
"measured_at": "2022-01-21 21:19:09"
}
]
},
"mongodb": {
"2500": [
{
"time": 0,
"measured_at": "2022-01-21 22:17:14"
}
],
"5000": [
{
"time": 0,
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
  return jsonData;
}


getData().then(result=>{
  if(result == false){
    result = this.jsonData
    const {insert, remove, select, update} = result;
    const {mongodb: insertMongo, mysql: insertMysql} = insert;
    const {mongodb: removeMongo, mysql: removeMysql} = remove;
    const {mongodb: selectMongo, mysql: selectMysql} = select;
    const {mongodb: updateMongo, mysql: updateMysql} = update;
    drawChart(insertMongo, insertMysql, 0)
    drawChart(removeMongo, removeMysql, 1)
    drawChart(selectMongo, selectMysql, 2)
    drawChart(updateMongo, updateMysql, 3)
  };
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
setTimeout(() => {
  window.location.reload(true);
  document.getElementById('warning').innerHTML = ""

}, 500);}


function startBenchmark() {
const records = document.getElementById('records').value;
if(records >= 0 && records <= 20000){
document.getElementById('records').value = '';
var xhr = new XMLHttpRequest();
xhr.open("POST", "http://database-test.ddns.net/api/order-benchmark", true);

xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

xhr.onreadystatechange = function () {
if (xhr.readyState === 4) {
responseId = JSON.parse(xhr.responseText).id;
console.log(responseId);
setInterval( function() {checkBenchmark(responseId)}, 1000);
  }
}

const data = `usersRecord=${records}`;
xhr.send(data);
document.getElementById('warning').innerHTML = "wait for the result"

}
}

function checkBenchmark(id) {
var xhr = new XMLHttpRequest();
xhr.open("GET", `http://database-test.ddns.net/api/is-benchmark-done/${id}`, true);

xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

xhr.onreadystatechange = function () {
if (xhr.readyState === 4) {
if (JSON.parse(xhr.responseText).done===true){
  document.getElementById('warning').innerHTML = ""
  window.location.reload(true);
}
else {console.log(xhr.responseText)}
}}
xhr.send();
}



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
              labelString: 'Time[s]'
                }
              }],
            xAxes: [{
              scaleLabel:{
              display: true,
              labelString: 'Number of records'
                }
              }]
            }     
    }
  })
}