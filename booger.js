let isBoogerOpen = false;

let $menu = [
    { name: "Password generator", ico: "ico/passgen.svgz",   f: () => new Passgen(),   key: ["tools", "js"] },
    { name: "Network calculator", ico: "ico/netcalc.svgz",   f: () => new Netcalc(),   key: ["tools", "js"] },
    { name: "MAC lookup",         ico: "ico/maclookup.svgz", f: () => new MacLookup(), key: ["tools", "js"] },
    { name: "Locate IP",          ico: "ico/locate.svgz",    f: () => new LocateIp(),  key: ["tools", "js"] }
];

document.body.addEventListener("mousemove", event => {
    if (onMobile) return;

    let y = 0;
    if (event.x < 128) y = event.y - 32;
    if (event.x > 96) y *= (192 - event.x) / 96;
       
    if (y < 8) {
        y = 0;
        booger.style.borderRadius = "4px 8px 48px 8px";
        booger.style.height = "48px";

    } else if (y > container.clientHeight - 72) {
        y = container.clientHeight - 48;
        booger.style.borderRadius = "8px 48px 8px 4px";
        booger.style.height = "48px";

    } else {
        booger.style.height = "64px";
        booger.style.borderRadius = "12px 40px 40px 12px";
    }    

    booger.style.transform = "translateY(" + y + "px)";
});

document.body.onmouseleave = () => {
    booger.style.transform = "translateY(0)";
    booger.style.borderRadius = "4px 8px 48px 8px";
    booger.style.height = "48px";
};

booger.onclick = ()=> { openBooger(); };

function openBooger() {
    if (isBoogerOpen) return;
    isBoogerOpen = true;

    booger.style.visibility = "hidden";
    booger.style.opacity = "0";
    backcolor.style.transform = "none";
    sidemenu.style.transform = "none";
    sidemenu.style.visibility = "visible";

    setTimeout(() => {
        if (!isBoogerOpen) return;
        container.style.filter = "blur(4px)";
        bottombar.style.filter = "blur(2px)";
        txtSearch.focus();
    }, 200);
}

function closeBooger() {
    if (!isBoogerOpen) return;
    isBoogerOpen = false;

    booger.style.visibility = "visible";
    booger.style.opacity = "1";
    container.style.filter = "none";
    bottombar.style.filter = "none";
    backcolor.style.transform = "translate(-100%)";
    sidemenu.style.transform = "translate(-100%)";
    sidemenu.style.visibility = "hidden";
}

txtSearch.oninput = () => {
    txtSearch.style.backgroundPositionX = (txtSearch.value.length > 0) ? "-40px" : "4px";
};


function showCategory(key) {
    grid.innerHTML = "";

    let count = 0;

    for (let i = 0; i < $menu.length; i++)
        if ($menu[i].key.includes(key) || true) {
            let newIcon = document.createElement("div");
            newIcon.setAttribute("tabindex", "0");
            newIcon.setAttribute("role", "button");
            newIcon.setAttribute("aria-label", $menu[i].name);
            newIcon.style.animation = "task-icon-open " + ++count * .1 + "s ease-in 1";
            grid.appendChild(newIcon);

            let ico = document.createElement("div");
            ico.style.backgroundImage = "url(" + $menu[i].ico + ")";
            newIcon.appendChild(ico);

            let name = document.createElement("div");
            name.innerHTML = $menu[i].name;
            newIcon.appendChild(name);

            newIcon.onmousedown = event => {
                if (event.button == 0 || event.button == 1) $menu[i].f();
                if (event.button == 0) closeBooger();
                event.preventDefault();
            };
            
            newIcon.onkeypress = event => {
                if (event.code == "Enter" || event.code == "NumpadEnter" || event.code == "Space") {
                    $menu[i].f();
                    if (!event.ctrlKey) closeBooger();
                }
            };
        }
}

close_box.onclick = () => {
    closeBooger();
};

showCategory("");
openBooger();