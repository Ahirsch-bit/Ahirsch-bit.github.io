
//Credentials:
var APIURL = "https://api.myzmanim.com/engine1.json.aspx"
var APIUSER = "0014325890"
var APIKEY = "6d5f171a6727444017d7e4305c358869cc1b3d114583db44010582d9a76eec1495489933aa061f3f"

function main() {
    // Uncomment one of the following examples:

    //findPostal("48237");     //Typical US zip code
    //findPostal("M6B2K9")   //Typical Canadian postal code
    //findPostal("NW118AU")  //Typical UK postcode
    findPostal("27526341")    //Typical 5-digit Israel Mikud code
    //findPostal("JFK")      //Typical airport code
    //findPostal("27526341") //Typical MyZmanim LocationID
    //findGps(48.86413211779521324, 2.32941612345133754)   //Typical GPS coordinates
}


function findPostal(query) {
    var clientTimeZone = getClientTimeZone();    // Pass the client's time zone. Optional, but if provided is sometimes used to resolve ambiguous queries.
    var coding = "JS";
    var params = "coding=" + coding + "&timezone=" + clientTimeZone + "&query=" + query + "&key=" + APIKEY + "&user=" + APIUSER;
    var method = "searchPostal";
    var url = APIURL + "/" + method;
    doCall(url, params, findPostal_callback);
}
function findPostal_callback(response) {
    var result = JSON.parse(response);
    if (result.ErrMsg) {
        document.write("Error: " + result.ErrMsg);
        return;
    }
    displayZmanim(result.LocationID);
}


function findGps(latitude, longitude) {
    var clientTimeZone = getClientTimeZone();    // Pass the client's time zone. Optional, but if provided is sometimes used to resolve ambiguous queries.
    var coding = "JS";
    var params = "coding=" + coding + "&latitude=" + latitude + "&longitude=" + longitude + "&key=" + APIKEY + "&user=" + APIUSER;
    var method = "searchGps";
    var url = APIURL + "/" + method;
    doCall(url, params, findGps_callback);
}
function findGps_callback(response) {
    var result = JSON.parse(response);
    if (result.ErrMsg) {
        document.write("Error: " + result.ErrMsg);
        return;
    }
    displayZmanim(result.LocationID);
}


function displayZmanim(locationid) {
    var today = new Date();
    var method = "getDay";
    var url = APIURL + "/" + method;
    var params = "coding=JS&language=he&locationid=" + locationid + "&inputdate=" + formatDate(today) + "&key=" + APIKEY + "&user=" + APIUSER;
    doCall(url, params, displayZmanim_callback);
}
function displayZmanim_callback(response) {
    var day = JSON.parse(response);

    if (day.ErrMsg) {
        document.write("Error: " + day.ErrMsg);
        return;
    }

    var out = "";
    out += "<div class='w3-container'>";
    out += " <h2>זמני היום לירושלים</h2>";
    // out += "    <br/> <span style='font-size:12pt;'>זמני היום לירושלים";
    out += "<p>" + day.Time.DateSemiLong;
    out += "    <br/>" + day.Time.Weekday;
    // if (!zmanIsNull(day.Zman.CurrentTime)) out += "    <br/>" + formatZman(day.Zman.CurrentTime);    // Display current time if available and applicable.
    if (day.Time.ParshaAndHoliday) out += "<br/>" + day.Time.ParshaAndHoliday;
    if (day.Time.Omer != 0) out += "<br/>Omer count " + day.Time.Omer.toString();
    switch (day.Time.DaylightTime) {
        case 0: out += ""; break;
        case 1: out += "<br/>שעון קיץ"; break;
        case 2: out += "<br/>Add 1 hr for DST when applicable."; break;
        case 3: out += "<br/>Add 1 hr for DST if/when applicable"; break;
    }
    out += "</p><br/>-----------";
    out += "<table class='w3-table w3-bordered'>"
    if(day.Time.IsErevShabbos || day.Time.IsErevYomTov || day.Time.IsErevYomKipper){
        out += "<tr>";
        out += "<th class ='w3-right-align'>הדלקת נרות</th>";
        out += "<th>" + formatZman(day.Zman.Candles) + "</th>";
        out += "</tr>";
        out += "<tr>";
        out += "<th class ='w3-right-align'>צאת שבת</th>";
        out += "<th>" + formatZman(day.Zman.NightShabbos) + "</th>";
        out += "</tr>";
    }
    out += "<tr>";
    out += "<th>" + formatZman(day.Zman.Dawn72) + "</th>";
    out += "<th class ='w3-right-align'>עלות השחר</th>";
    out += "</tr>";
    out += "<tr>";
    out += "<th>" + formatZman(day.Zman.SunriseDefault) + "</th>";
    out += "<th class ='w3-right-align'>זריחה</th>";
    out += "</tr>";
    out += "<tr>";
    out += "<th>" + formatZman(day.Zman.ShemaMA72) + "</th>";
    out += "<th class ='w3-right-align'>סוף זמן ק\"ש מ\"א</th>";
    out += "</tr>";
    //   out += "<br/>עלות השחר: " + formatZman(day.Zman.Dawn72);
    // out += "<br/>Earliest Talis (" + day.Place.YakirDegreesDefault + "&deg;): " + formatZman(day.Zman.YakirDefault);
    //   out += "<br/>זריחה: " + formatZman(day.Zman.SunriseDefault);
    // out += "<br/>סוף זמן ק\"ש מ\"א: " + formatZman(day.Zman.ShemaMA72);
    // out += "<br/>סוף זמן ק\"ש גר\"א: " + formatZman(day.Zman.ShemaGra);
    out += "<br/>סוף זמן תפילה גר\"א: " + formatZman(day.Zman.ShachrisGra);
    out += "<br/>חצות: " + formatZman(day.Zman.Midday);
    out += "<br/>מנחה גדולה: " + formatZman(day.Zman.MinchaStrict);
    // out += "<br/>Plag Hamincha: " + formatZman(day.Zman.PlagGra);
    // if (!zmanIsNull(day.Zman.Candles)) {
    //     out += "<br/>Candlelighting (" + day.Place.CandlelightingMinutes + " min): " + formatZman(day.Zman.Candles);     // Display candlelighting time if available and applicable.
    // }
    out += "<br/>שקיעה: " + formatZman(day.Zman.SunsetDefault);
    out += "<br/>צאת הכוכבים: " + formatZman(day.Zman.NightShabbos);
    out += "<br/>Night 72 minutes: " + formatZman(day.Zman.Night72fix);
    out += "<br/>";
    out += "<br/>Minyan for Mincha at: " + formatZman(addMinutes(day.Zman.SunsetDefault, -20));
    out += "<br/>";

    document.getElementById("myresult").innerHTML = out;

}

function addMinutes(date, minutes) {
    var newdate = new Date(date);
    return new Date(newdate.getTime() + (minutes * 60000));
}

function ticksToMinutes(ticks) {
    sec = ticks * 1 / 10000000;
    min = sec / 60;
    min = round(min);
    return min;
}

function doCall(endpoint, parameters, callBack) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) { callBack(xmlhttp.responseText); }
    }
    xmlhttp.open("POST", endpoint, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(parameters);
}

function formatDate(date) {
    var newdate = new Date(date);
    var theday = ("0" + newdate.getDate()).slice(-2);
    var themonth = ("0" + (newdate.getMonth() + 1)).slice(-2);
    var theyear = newdate.getFullYear();
    var strdate = theyear + '-' + themonth + '-' + theday;    //Note: Do not replace with .toISOString()
    strdate = strdate.substring(0, 10);
    return strdate;
}

function formatZman(zman) {
    d = new Date(zman);
    var hr = d.getUTCHours();
    var min = d.getUTCMinutes();
    var sec = d.getUTCSeconds();
    if (min < 10) {
        min = "0" + min;
    }
    if (sec < 10) {
        sec = "0" + sec;
    }
    // var ampm = hr < 12 ? " AM" : " PM";
    // if (hr == 0) hr = 12;
    // if (hr > 12) hr -= 12;
    var result = hr + ":" + min
    // if (sec > 0) result += ":" + sec;
    // result += ampm;
    return result
}

function getClientTimeZone() {
    var d = new Date();
    var tz = d.getTimezoneOffset() / 60;
    return tz;
}

function round(num) { return parseFloat(num).toFixed(1); }
function zmanIsNull(zman) { return formatDate(zman) == "0001-01-01"; }