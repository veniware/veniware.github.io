const SUBMENU_WIDTH = 360;

const TOOLS = [

{ lbl:"Password generator", ico:"res/passgen.svg",       grp:"*",         sqr:true,  f:arg=> new Passgen() },
{ lbl:"Network calculator", ico:"res/netcalc.svg",       grp:"utilities", sqr:true,  f:arg=> new Netcalc(arg) },
{ lbl:"MAC lookup",         ico:"res/maclookup.svg",     grp:"utilities", sqr:true,  f:arg=> new MacLookup(arg) },
{ lbl:"Locate IP",          ico:"res/locate.svg",        grp:"utilities", sqr:true,  f:arg=> new LocateIp(arg) },
{ lbl:"Encoder",            ico:"res/encoder.svg",       grp:"*",         sqr:true,  f:arg=> new Encoder() },

{ lbl:"Settings",           ico:"res/tool02.svg",        grp:"*", sqr:false, f:arg=> new Settings() },
{ lbl:"Appearrance",        ico:"res/tv.svg",            grp:"*", sqr:false, f:arg=> new Settings() },
{ lbl:"Session",            ico:"res/hourglass.svg",     grp:"*", sqr:false, f:arg=> new Settings("session") },
{ lbl:"License",            ico:"res/gpl.svg",           grp:"*", sqr:false, f:arg=> new Settings("legal") },

{ lbl:"Chess",              ico:"chess/king.svg",        grp:"*", sqr:true, f:arg=> new Chess()}
];

let AUTHORIZATION = {};

let menu_isopen = false;
let menu_button_drag = false;
let menu_button_moved = false;
let menu_startPos = [0, 0];
let menu_lastAltPress = 0;
let menu_index = -1;
let menu_list = [];

let menu_session = [];

let menu_lastShiftPress = 0;
let lastSearchValue = "";

btnMenu.onclick = event => {
    if (menu_button_moved) return;
    if (event.button == 0) Menu_Toogle();
};

document.body.addEventListener("mousemove", event => {
    if (event.buttons != 1) menu_button_drag = false;

    if (!menu_button_drag) return;

    if (Math.abs(menu_startPos[0] - event.clientX) > 2 || Math.abs(menu_startPos[1] - event.clientY) > 2) {
        menu_button_moved = true;
    }

    let px = event.x / container.clientWidth;
    let py = event.y / container.clientHeight;

    if (event.x < 56 && event.y < 56) {
        btnMenu.style.borderRadius = "4px 8px 48px 8px";
        btnMenu.style.left = "0px";
        btnMenu.style.top = "0px";
        btnMenu.style.width = "48px";
        btnMenu.style.height = "48px";

        divIcon.style.left = "8px";
        divIcon.style.top = "6px";
        divIcon.style.width = "26px";
        divIcon.style.height = "26px";

    } else if (event.x < 56 && event.y > container.clientHeight - 48) {
        btnMenu.style.borderRadius = "8px 48px 8px 4px";
        btnMenu.style.left = "0px";
        btnMenu.style.top = "calc(100% - 48px)";
        btnMenu.style.width = "48px";
        btnMenu.style.height = "48px";

        divIcon.style.left = "8px";
        divIcon.style.top = "16px";
        divIcon.style.width = "26px";
        divIcon.style.height = "26px";

    } else if (event.x > container.clientWidth - 48 && event.y < 56) {
        btnMenu.style.borderRadius = "8px 4px 8px 64px";
        btnMenu.style.left = "calc(100% - 48px)";
        btnMenu.style.top = "0px";
        btnMenu.style.width = "48px";
        btnMenu.style.height = "48px";

        divIcon.style.left = "16px";
        divIcon.style.top = "6px";
        divIcon.style.width = "26px";
        divIcon.style.height = "26px";

    } else if (event.x > container.clientWidth - 48 && event.y > container.clientHeight - 48) {
        btnMenu.style.borderRadius = "64px 8px 4px 8px";
        btnMenu.style.left = "calc(100% - 48px)";
        btnMenu.style.top = "calc(100% - 48px)";
        btnMenu.style.width = "48px";
        btnMenu.style.height = "48px";

        divIcon.style.left = "16px";
        divIcon.style.top = "16px";
        divIcon.style.width = "26px";
        divIcon.style.height = "26px";

    } else if (px < py && 1 - px > py) { //left
        let y = 100 * (event.y - 32) / container.clientHeight;

        btnMenu.style.borderRadius = "14px 40px 40px 14px";
        btnMenu.style.left = "0px";
        btnMenu.style.top = `${y}%`;
        btnMenu.style.width = "48px";
        btnMenu.style.height = "64px";

        divIcon.style.left = "8px";
        divIcon.style.top = "18px";
        divIcon.style.width = "28px";
        divIcon.style.height = "28px";

    } else if (px > py && 1 - px > py) { //top
        let x = 100 * (event.x - 32) / container.clientWidth;

        btnMenu.style.borderRadius = "14px 14px 40px 40px";
        btnMenu.style.left = `${x}%`;
        btnMenu.style.top = "0px";
        btnMenu.style.width = "64px";
        btnMenu.style.height = "48px";

        divIcon.style.left = "19px";
        divIcon.style.top = "6px";
        divIcon.style.width = "28px";
        divIcon.style.height = "28px";

    } else if (px < py && 1 - px < py) { //bottom
        let x = 100 * (event.x - 32) / container.clientWidth;

        btnMenu.style.borderRadius = "40px 40px 14px 14px";
        btnMenu.style.left = `${x}%`;
        btnMenu.style.top = "calc(100% - 48px)";
        btnMenu.style.width = "64px";
        btnMenu.style.height = "48px";

        divIcon.style.left = "19px";
        divIcon.style.top = "16px";
        divIcon.style.width = "28px";
        divIcon.style.height = "28px";

    } else if (px > py && 1 - px < py) { //right
        let y = 100 * (event.y - 32) / container.clientHeight;

        btnMenu.style.borderRadius = "40px 14px 14px 40px";
        btnMenu.style.left = "calc(100% - 48px)";
        btnMenu.style.top = `${y}%`;
        btnMenu.style.width = "48px";
        btnMenu.style.height = "64px";

        divIcon.style.left = "14px";
        divIcon.style.top = "18px";
        divIcon.style.width = "28px";
        divIcon.style.height = "28px";
    }

    Menu_UpdatePosition();
});

document.body.addEventListener("mouseup", event => {
    if (menu_button_moved) {
        localStorage.setItem("menu_button_pos", JSON.stringify({
            borderRadius: btnMenu.style.borderRadius,
            left: btnMenu.style.left,
            top: btnMenu.style.top,
            width: btnMenu.style.width,
            height: btnMenu.style.height,
            l_left: divIcon.style.left,
            l_top: divIcon.style.top,
            l_width: divIcon.style.width,
            l_height: divIcon.style.height
        }));
    }

    menu_button_drag = false;
    setTimeout(() => {
        menu_button_moved = false;
    }, 0);
});

btnMenu.onmousedown = event => {
    menu_startPos = [event.clientX, event.clientY];
    menu_button_drag = true;
};


container.onclick = event => {
    if (event == null) return;
    if (event.clientX > 2) return;
    else if (event.clientY < window.innerHeight / 4 && event.clientY > 0) Menu_Open();
};

document.body.onkeyup = event => {
    if (event.code == "ShiftLeft") {
        if (Date.now() - menu_lastShiftPress < 400) {
            menu_lastShiftPress = 0;
            Toogle();
        } else {
            menu_lastShiftPress = Date.now();
        }
    } else
        menu_lastShiftPress = 0;
};

txtSearch.onkeydown = event => {
    if (event.keyCode == 27) { //esc
        event.stopPropagation();
        if (txtSearch.value.length > 0) {
            txtSearch.value = "";
           Menu_Update("");
        } else {
            Menu_Close();
        }
        return;
    }

    if (event.keyCode == 13) { //enter
        if (event.ctrlKey) {
            menu_list[menu_index].onmousedown(null);
            txtSearch.focus();
            setTimeout(txtSearch.focus(), 10);
        } else {
            if (menu_index > -1)
                menu_list[menu_index].onclick(event);
        }
    }

    if (event.keyCode == 38) { //up
        event.preventDefault();
        if (menu_list.length > 0) {
            if (menu_index > -1) menu_list[menu_index].style.backgroundColor = "rgb(208,208,208)";
            menu_index--;
            if (menu_index < 0) menu_index = menu_list.length - 1;
            if (menu_index > -1) menu_list[menu_index].style.backgroundColor = "var(--select-color)";
        }
    }

    if (event.keyCode == 40) { //down
        event.preventDefault();
        if (menu_list.length > 0) {
            if (menu_index > -1) menu_list[menu_index].style.backgroundColor = "rgb(208,208,208)";
            menu_index++;
            if (menu_index >= menu_list.length) menu_index = 0;
            menu_list[menu_index].style.backgroundColor = "var(--select-color)";
        }
    }

    if (menu_list.length > 0 && (event.keyCode == 38 || event.keyCode == 40)) //scroll into view
        menu_list[menu_index].scrollIntoView({ behavior: "smooth", block: "center" });
};

txtSearch.oninput = event => {
    if (lastSearchValue == txtSearch.value.trim()) return;

    lastSearchValue = txtSearch.value.trim();

    let current = txtSearch.value;
    setTimeout(() => {
        if (current != txtSearch.value) return;
        Menu_Update(txtSearch.value.toLocaleLowerCase());
    }, 200);
};

txtSearch.onclick = event => { event.stopPropagation(); };
searchbox.onclick = event => { txtSearch.focus(); };

btnSearchClear.onclick = event => {
    event.stopPropagation();

    if (txtSearch.value.length > 0) {
        txtSearch.value = "";
        Menu_Update("");
    } else
        Menu_Close();
};

btnSettings.onclick = () => {
    Menu_Close();
    new Settings();
};

cap.onclick = () => { Menu_Close(); };

function NewEquip() {
    let win = new Equip();
    return win;
}

function NewUser() {
    let win = new User();
    return win;
}


function CreateSideItem(label, icon, t1, t2, func) {
    let item = document.createElement("div");
    item.style.backgroundImage = "url(" + icon + ")";
    item.className = "sidemenu-item";

    let divLabel = document.createElement("div");
    divLabel.innerHTML = label;
    item.appendChild(divLabel);

    if (t1.length > 0) {
        let divDescription = document.createElement("div");
        divDescription.innerHTML = t1;
        item.appendChild(divDescription);
    }

    if (t2.length > 0) {
        let divMore = document.createElement("div");
        divMore.innerHTML = t2;
        item.appendChild(divMore);
    }

    CreateItemEvents(item, func);

    return item;
}

function CreateGroupLabel(name) {
    const label = document.createElement("div");
    label.innerHTML = name + ":";
    label.style.padding = "4px 0px 2px 8px";
    label.style.fontWeight = "700";
    label.style.color = "rgb(224,224,224)";
    label.style.backgroundColor = "rgb(32,32,32)";
    label.style.position = "sticky";
    label.style.top = "0";
    menulist.appendChild(label);
}

function CreateSquareItem(label, icon, func) {
    let item = document.createElement("div");
    item.style.backgroundImage = "url(" + icon + ")";
    item.className = "sidemenu-square-item";

    let divLabel = document.createElement("div");
    divLabel.innerHTML = label;
    item.appendChild(divLabel);

    CreateItemEvents(item, func);

    return item;
}

function CreateItemEvents(item, func) {
    item.onclick = event => {
        event.stopPropagation();
        Menu_Close();
        txtSearch.value = "";
        Menu_Update("");
        func();
    };

    item.onmousedown = event => {
        if (event !== null && event.button != 1) return;
        if (event !== null) event.preventDefault();

        //minimize other windows
        if (menu_session.length == 0)
            for (let i = 0; i < $w.array.length; i++)
                if (!$w.array[i].isMinimized) $w.array[i].Minimize(true);

        //check if listed already
        let listed = false;
        let win = func();
        if (!menu_session.includes(win))
            menu_session.push(win);

        //reposition
        let w = Math.ceil(Math.sqrt(menu_session.length));
        let h;
        for (h = w; h > 0; h--)
            if (w * h < menu_session.length) break;
        h++;

        for (let i = 0; i < menu_session.length; i++)
            menu_session[i].win.style.transition = ".2s";

        if (menu_session.length > 1)
            for (let y = 0; y < h; y++)
                for (let x = 0; x < w; x++) {
                    let index = y * w + x;
                    if (index >= menu_session.length) break;
                    menu_session[index].win.style.left = 100 * x / w + "%";
                    menu_session[index].win.style.top = 100 * y / h + "%";
                    menu_session[index].win.style.width = (100 / w) + "%";
                    menu_session[index].win.style.height = (100 / h) + "%";
                    menu_session[index].isMaximized = false;
                }

        setTimeout(() => {
            for (let i = 0; i < menu_session.length; i++)
                menu_session[i].AfterResize();
        }, 400);
    };
}

function Menu_Update(filter) {
    menulist.innerHTML = "";
    menu_list = [];
    menu_index = -1;

    if (filter.length == 0) { //menu
        for (let i = 0; i < TOOLS.length; i++) {
            if (TOOLS[i].isGroup) {
                if (menulist.childNodes.length > 0 && menulist.childNodes[menulist.childNodes.length - 1].className === "")
                    menulist.removeChild(menulist.childNodes[menulist.childNodes.length - 1]);

                CreateGroupLabel(TOOLS[i].lbl);
                continue;
            }

            if (!TOOLS[i].sqr) continue;
            if (TOOLS[i].grp != "*" && AUTHORIZATION[TOOLS[i].grp] == 0) continue;

            const item = CreateSquareItem(TOOLS[i].lbl, TOOLS[i].ico, TOOLS[i].f);
            menu_list.push(item);
            menulist.appendChild(item);
        }

    } else {
        for (let i = 0; i < TOOLS.length; i++)
            if (TOOLS[i].lbl.toLocaleLowerCase().indexOf(filter) > -1) {
                if (TOOLS[i].grp != "*" && AUTHORIZATION[TOOLS[i].grp] == 0) continue;
                if (!TOOLS[i].ico) continue;

                const item = CreateSideItem(TOOLS[i].lbl, TOOLS[i].ico, "", "", TOOLS[i].f);
                menu_list.push(item);
                menulist.appendChild(item);
            }
    }

    if (filter.length == 0) return;

    let keywords = filter.toLowerCase().split(" ");

    for (let i = 0; i < db_equip.length; i++) { //find equip
        let match = true;

        for (let j = 0; j < keywords.length; j++) {
            let flag = false;
            for (let k in db_equip[i]) {
                if (db_equip[i][k][0].toLowerCase().indexOf(keywords[j]) > -1)
                    flag = true;
            }
            if (!flag) {
                match = false;
                continue;
            }
        }

        if (!match) continue;

        let current = db_equip[i];
        const f = () => {
            for (let j = 0; j < $w.array.length; j++)
                if ($w.array[j] instanceof Equip && $w.array[j].filename == current[".FILENAME"][0]) {
                    $w.array[j].Pop();
                    return $w.array[j];
                }
            return new Equip(current[".FILENAME"][0]);
        };

        let label = current.hasOwnProperty("NAME") ? current["NAME"][0] : (current.hasOwnProperty("HOSTNAME") ? current["HOSTNAME"][0] : "");
        let type = current.hasOwnProperty("TYPE") ? current["TYPE"][0] : "";
        let ip = current.hasOwnProperty("IP") ? current["IP"][0] : "";

        let item = CreateSideItem(label, GetEquipIcon([type]), type, ip, f);
        menu_list.push(item);
        menulist.appendChild(item);
    }

    for (let i = 0; i < db_users.length; i++) { //find users
        let match = true;

        for (let j = 0; j < keywords.length; j++) {
            let flag = false;
            for (let k in db_users[i]) {
                if (db_users[i][k][0].toLowerCase().indexOf(keywords[j]) > -1)
                    flag = true;
            }
            if (!flag) {
                match = false;
                continue;
            }
        }

        if (!match) continue;

        let current = db_users[i];
        const f = () => {
            for (let j = 0; j < $w.array.length; j++)
                if ($w.array[j] instanceof User && $w.array[j].filename == current[".FILENAME"][0]) {
                    $w.array[j].Pop();
                    return $w.array[j];
                }
            return new User(current[".FILENAME"][0]);
        };

        let label = current.hasOwnProperty("DISPLAY NAME") ? current["DISPLAY NAME"][0] : (current.hasOwnProperty("TITLE") ? current["TITLE"][0] : "");
        let department = current.hasOwnProperty("DEPARTMENT") ? current["DEPARTMENT"][0] : "";
        let contact = current.hasOwnProperty("TELEPHONE NUMBER") ? current["TELEPHONE NUMBER"][0] : "";

        let item = CreateSideItem(label, "res/user.svg", department, contact, f);
        menu_list.push(item);
        menulist.appendChild(item);
    }

    if (menu_list.length > 0) {
        menu_index = 0;
        menu_list[0].style.backgroundColor = "var(--select-color)";
    }
}

function Menu_UpdatePosition() {
    menu.style.visibility = menu_isopen ? "visible" : "hidden";
    cap.style.visibility = menu_isopen ? "visible" : "hidden";

    let left = parseInt(btnMenu.style.left);

    if (btnMenu.style.left == "0px" || left < 10 || btnMenu.style.top == "") {
        menu.style.left = "20px";
        menu.style.top = "20px";
        menu.style.bottom = "20px";
        menu.style.transform = menu_isopen ? "none" : "translateX(calc(-100% - 24px))";

    } else if (btnMenu.style.left == "calc(100% - 48px)" || left > 90) {
        menu.style.left = "calc(100% - var(--sidemenu-width) - 20px)";
        menu.style.top = "20px";
        menu.style.bottom = "20px";
        menu.style.transform = menu_isopen ? "none" : "translateX(100%)";

    } else {
        menu.style.left = `max(20px, min(calc(${left}% - var(--sidemenu-width) / 2) + 32px, calc(100% - var(--sidemenu-width) - 20px)))`;

        if (btnMenu.style.top == "0px") {
            menu.style.top = "20px";
            menu.style.bottom = "min(200px, 20%)";
            menu.style.transform = menu_isopen ? "none" : "translateY(-100%)";
        } else {
            menu.style.top = "min(200px, 20%)";
            menu.style.bottom = "20px";
            menu.style.transform = menu_isopen ? "none" : "translateY(100%)";
        }
    }
}

function Menu_Open() {
    menu_isopen = true;
    Menu_UpdatePosition();

    if (menu_isopen) {
        setTimeout(() => { txtSearch.focus(); }, 150);
    }
}
function Menu_Close() {
    menu_isopen = false;
    Menu_UpdatePosition();
    menu_session = [];
}
function Menu_Toogle() {
    menu_isopen = !menu_isopen;
    Menu_UpdatePosition();

    if (menu_isopen) {
        setTimeout(() => { txtSearch.focus(); }, 150);
    }
}

Menu_Update("");
Menu_UpdatePosition();