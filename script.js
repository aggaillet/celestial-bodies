// Define earth object
const earth = {
    "sso": {
        "num": "3",
        "name": "Earth",
        "type": "planet"
    },
    "data": [
        {
            "px": 0.0,
            "py": 0.0,
            "pz": 0.0
        }
    ]
}

// Bind functions to form buttons
document.getElementById('buttonForm1').addEventListener('click', onFormSubmit);

function onFormSubmit(){
    var planet1 = document.getElementById("Form1-1").value
    var type1 = document.getElementById("Form1-1-type").value
    planet1 = type1 + ":" + planet1
    var planet2 = document.getElementById("Form1-2").value
    var type2 = document.getElementById("Form1-2-type").value
    planet2 = type2 + ":" + planet2
    var date = document.getElementById("Form1-3").value
    console.log(date)
    if (planet1 == "p:earth" || planet1 == "p:Earth"){
        retrieveData(planet2)
    }else if (planet2 == "p:earth" || planet2 == "p:Earth"){
        retrieveData(planet1)
    }else{
        retrieveData2(planet1, planet2, date)
    }
}

function retrieveData2(planet1, planet2, date){
    const requestBase = "https://ssp.imcce.fr/webservices/miriade/api/ephemcc.php?"
    const requestSuffix = "&-mime=json&-tcoor=2&-date=" + date
    let request1 = requestBase + "&-name=" + planet1 + requestSuffix
    let request2 = requestBase + "&-name=" + planet2 + requestSuffix
        
    try{
        Promise.all([
            fetch(request1),
            fetch(request2)
          ]).then(responses =>
            Promise.all(responses.map(response => response.json()))
          ).then(data =>{
            console.log(data)
            elaborateData(data)
            }
          )
    } catch(err) {
        console.log(err)
        alert("Unable to get data on given celestial bodies, please check provided codes")
    }
}

function retrieveData(planet, date){
    const requestBase = "https://ssp.imcce.fr/webservices/miriade/api/ephemcc.php?"
    const requestSuffix = "&-mime=json&-tcoor=2&-date=" + date
    let request = requestBase + "&-name=" + planet + requestSuffix

    try{
            fetch(request).then(response => response.json())
            .then(data => {
                console.log(data)
                elaborateData([data, earth])
            })
    } catch(err) {
        console.log(err)
        alert("Unable to get data on given celestial bodies, please check provided codes")
    }
}

function elaborateData(planets){
    try{
        let p1 = planets[0]
        let p2 = planets[1]
        data1 = p1.data[0]
        data2 = p2.data[0]
        Promise.all(calculateDistance(data1.px, data1.py, data1.pz, data2.px, data2.py, data2.pz))
        .then(distance => {
            displayResult(distance, p1.sso.name, p2.sso.name)
        })
    } catch(err) {
        console.log(err)
        alert("Unable to get data on given celestial bodies, please check provided codes")
    }

}

function calculateDistance(x1, y1, z1, x2, y2, z2){
    const au2km = 149597870.691
    const au2mi = 92955807.273026
    let x = Math.pow(x2 - x1, 2)
    let y = Math.pow(y2 - y1, 2)
    let z = Math.pow(z2 - z1, 2)
    let au = Math.sqrt(x + y +z)
    console.log("au: " + au)
    let km = Math.round(au * au2km)
    let mi = Math.round(au * au2mi)
    distance = [au, km, mi]
    return distance
}

function displayResult(distance, name1, name2, date){
    let str ="The distance between " + name1 + " and " + name2 + " is of:<ul><li>" + distance[0] + " au</li><li>"+ distance[1] + " km</li><li>" + distance[2] + " mi</li></ul>"
    document.getElementById("paragraph_result").innerHTML = str
}