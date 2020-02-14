const MONTHS_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

(()=> { //init clock
    for (let i = 0; i < 12; i++) {
        let newDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        newDot.setAttribute("r", i % 3 == 0 ? 2.5 : 1.5);
        newDot.setAttribute("cx", 48 + Math.sin(i * 30 / 57.29577951) * 36);
        newDot.setAttribute("cy", 48 - Math.cos(i * 30 / 57.29577951) * 36);
        newDot.setAttribute("fill", "#202020");
        analog_clock.appendChild(newDot);
    }
})();

(function updateClock() {
    const S = 96;
    let now = new Date();
    let m = now.getMinutes();
    let h = (now.getHours() % 12) + m / 60;

    analog_clock_m.style.transform = "rotate(" + m * 6 + "deg)";
    analog_clock_h.style.transform = "rotate(" + h * 30 + "deg)";

    date_month.innerHTML = MONTHS_NAMES[now.getMonth()];
    //date_date.innerHTML = now.getDate();
    date_day.innerHTML = DAYS_NAMES[now.getDay()];
    
    if (now.getMonth() === 0 && now.getDate() === 1) { //new year
        date_date.innerHTML = "&#129346;";
    } else if (now.getMonth() === 1 && now.getDate() === 14) { //valentines day
        date_date.innerHTML = "&#10084;";        
    } else if (now.getMonth() === 2 && now.getDate() === 14) { //PI day
        date_date.innerHTML = "&#120645;";
    } else if (now.getMonth() === 6 && now.getDate() === 31) { //sys admin day
        date_date.innerHTML = "&#128374;";
    } else {
        date_date.innerHTML = now.getDate();
    }

    setTimeout(() => updateClock(), 60000);
})();
