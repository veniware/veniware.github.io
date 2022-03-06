 
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const isSecure = window.location.href.toLowerCase().startsWith("https://");
const onMobile = (/Android|webOS|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent));

const favicon   = document.getElementById("favicon");

const main      = document.getElementById("main");
const cap       = document.getElementById("cap");
const container = document.getElementById("container");
const bottombar = document.getElementById("bottombar");
const sidemenu  = document.getElementById("menu");
const menulist = document.getElementById("menulist");

const btnMenu   = document.getElementById("btnMenu");
const divIcon   = document.getElementById("divIcon");

const searchbox = document.getElementById("searchbox");
const txtSearch      = document.getElementById("txtSearch");
const btnSearchClear = document.getElementById("btnSearchClear");

const analog_h   = document.getElementById("analog_clock_h");
const analog_m   = document.getElementById("analog_clock_m");
const date_month = document.getElementById("date_month");
const date_date  = document.getElementById("date_date");
const date_day   = document.getElementById("date_day");

main.style.transition = "filter 1s";
main.style.filter = "none";

(function() { //init clock
    let svg_analog = document.getElementById("analog_clock");
    for (let i = 0; i < 12; i++) {
        let newDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        newDot.setAttribute("r", i%3==0 ? 2.5 : 1.5);
        newDot.setAttribute("cx", 48 + Math.sin(i*30/57.29577951)*36);
        newDot.setAttribute("cy", 48 - Math.cos(i*30/57.29577951)*36);
        newDot.setAttribute("fill", "#202020");
        svg_analog.appendChild(newDot);
    }
})();

(function updateClock() {
    let now = new Date();
    let m = now.getMinutes();
    let h = (now.getHours() % 12) + m / 60;

    analog_m.style.transform = "rotate(" + m * 6 + "deg)";
    analog_h.style.transform = "rotate(" + h * 30 + "deg)";

    date_month.innerHTML = monthNames[now.getMonth()];
    date_date.innerHTML = now.getDate();
    date_day.innerHTML = dayNames[now.getDay()];

    setTimeout(() => updateClock(), 60000);
})();

function RgbToHsl(color) {
    let r = color[0] / 255;
    let g = color[1] / 255;
    let b = color[2] / 255;

    let cmin = Math.min(r, g, b);
    let cmax = Math.max(r, g, b);
    let delta = cmax - cmin;

    let h, s, l;

    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return [h, s, l];
}
function SetAccentColor(accent) {
    let rgbString = `rgb(${accent[0]},${accent[1]},${accent[2]})`;
    let hsl = this.RgbToHsl(accent);

    let step1 = `hsl(${hsl[0]-4},${hsl[1]}%,${hsl[2]*.78}%)`;
    let step2 = `hsl(${hsl[0]+7},${hsl[1]}%,${hsl[2]*.9}%)`; //--select-color
    let step3 = `hsl(${hsl[0]-4},${hsl[1]}%,${hsl[2]*.8}%)`;
    let gradient = `linear-gradient(to bottom, ${step1}0%, ${step2}92%, ${step3}100%)`;

    let root = document.documentElement;
    root.style.setProperty("--theme-color", rgbString);
    root.style.setProperty("--select-color", step2);
    root.style.setProperty("--toolbar-bg", gradient);
    root.style.setProperty("--toolbar-bg-rev", `linear-gradient(to bottom, ${step3}0%, ${step2}2%, ${step1}100%)`);
}