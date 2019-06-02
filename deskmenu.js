const MONTHS_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

var analog_h = document.getElementById("analog_clock_h");
var analog_m = document.getElementById("analog_clock_m");
var date_month = document.getElementById("date_month");
var date_date = document.getElementById("date_date");
var date_day = document.getElementById("date_day");


(function () { //init clock
    let svg_analog = document.getElementById("analog_clock");
    for (let i = 0; i < 12; i++) {
        let newDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        newDot.setAttribute("r", i % 3 == 0 ? 2.5 : 1.5);
        newDot.setAttribute("cx", 48 + Math.sin(i * 30 / 57.29577951) * 36);
        newDot.setAttribute("cy", 48 - Math.cos(i * 30 / 57.29577951) * 36);
        newDot.setAttribute("fill", "#202020");
        svg_analog.appendChild(newDot);
    }
})();

(function updateClock() {
    const S = 96;
    let now = new Date();
    let m = now.getMinutes();
    let h = (now.getHours() % 12) + m / 60;

    analog_m.style.transform = "rotate(" + m * 6 + "deg)";
    analog_h.style.transform = "rotate(" + h * 30 + "deg)";

    date_month.innerHTML = MONTHS_NAMES[now.getMonth()];
    date_date.innerHTML = now.getDate();
    date_day.innerHTML = DAYS_NAMES[now.getDay()];

    setTimeout(() => updateClock(), 60000);
})();