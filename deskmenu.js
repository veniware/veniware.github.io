const MONTHS_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

let analog_h   = document.getElementById("analog_clock_h");
let analog_m   = document.getElementById("analog_clock_m");
let date_month = document.getElementById("date_month");
let date_date  = document.getElementById("date_date");
let date_day   = document.getElementById("date_day");

let category = document.getElementById("category");
let grid     = document.getElementById("grid");
let icoTools = document.getElementById("icoTools");

icoTools.onclick = () => { showCategory("tools"); };

let $menu = [
    { name:"Password generator", ico:"ico/passgen.svgz",   f:()=>new Passgen(),   key:["tools", "js"] },
    { name:"Network calculator", ico:"ico/netcalc.svgz",   f:()=>new Netcalc(),   key:["tools", "js"] },
    { name:"MAC lookup",         ico:"ico/maclookup.svgz", f:()=>new MacLookup(), key:["tools", "js"] },
    { name:"Locate IP",          ico:"ico/locate.svgz",    f:()=>LocateIp(),      key:["tools", "js"] }
];

function showCategory(key) {
    grid.innerHTML = "";

    let count = 0;

    for (let i = 0; i < $menu.length; i++)
        if ($menu[i].key.includes(key)) {
            let newIcon = document.createElement("div");
            newIcon.style.animation = "task-icon-open " + ++count * .1 + "s ease-in 1";
            grid.appendChild(newIcon);

            let ico = document.createElement("img");
            ico.src = $menu[i].ico;
            newIcon.appendChild(ico);

            let name = document.createElement("div");
            name.innerHTML = $menu[i].name;
            newIcon.appendChild(name);

            newIcon.onclick = () => { $menu[i].f(); };
        }
}

(()=> { //init clock
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

