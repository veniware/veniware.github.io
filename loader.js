let db_equip = [], db_users = [];
let db_equip_ver = 0, db_users_ver = 0;

let loader_styles = [
    "sidemenu.css",
    "window.css",
    "tip.css",
    "button.css",
    "textbox.css",
    "checkbox.css",
    "range.css",
    "tools.css"
];

(function LoadStuff() {
    const loader = document.createElement("div");
    loader.className = "loader";
    document.body.appendChild(loader);

    const loader_container = document.createElement("div");
    loader_container.className = "loader-container";
    loader.appendChild(loader_container);
    
    const loader_progress = document.createElement("div");
    loader_progress.className = "loader-progress";
    loader_container.appendChild(loader_progress);

    const loader_decr = document.createElement("div");
    loader_decr.className = "loader-description";
    loader.appendChild(loader_decr);

    const primaryScripts = [
        "sidemenu.js",
        "window.js"
    ];

    const secondaryScripts = [
        "ipbox.js",
        "console.js",
        "tabs.js"
    ];

    const tertiaryScripts = [
        "settings.js",
        "tools/passwordgen.js",
        "tools/netcalc.js",
        "tools/maclookup.js",
        "tools/locateip.js",
        "tools/encoder.js",
        "chess/chess.js"
    ];

    let count = 0;
    let total = loader_styles.length + primaryScripts.length + secondaryScripts.length + tertiaryScripts.length;
    const callbackHandle = (status, filename)=> {
        loader_progress.style.width = 100 * ++count / total + "%";
        loader_decr.innerHTML = filename;

        if (loader_styles.length + primaryScripts.length === count) { //load secondary
            for (let i = 0; i < secondaryScripts.length; i++)
                LoadScript(secondaryScripts[i], callbackHandle);

        } else if (loader_styles.length + primaryScripts.length + secondaryScripts.length === count) { //load tertiary
            for (let i = 0; i < tertiaryScripts.length; i++)
                LoadScript(tertiaryScripts[i], callbackHandle);

        } else if (count === total) { //all done
            btnMenu.style.filter = "none";
            loader.style.filter = "opacity(0)";

            setTimeout(() => {
                setTimeout(() => { document.body.removeChild(loader); }, 200);
                setTimeout(() => { RestoreSession(); }, 250); //restore previous session
            }, 200);
        }
    };

    for (let i=0; i<loader_styles.length; i++)
        LoadStyle(loader_styles[i], callbackHandle);

    for (let i=0; i<primaryScripts.length; i++)
        LoadScript(primaryScripts[i], callbackHandle);

})();

function LoadStyle(filename, callback) {
    if (document.head.querySelectorAll(`link[href$='${filename}']`).length > 0) {
        callback("exists", filename);
        return;
    }

    const csslink = document.createElement("link");
    csslink.rel = "stylesheet";
    csslink.href = filename;
    document.head.appendChild(csslink);
    
    csslink.onload = ()=> callback("ok", filename);
    csslink.onerror = ()=> callback("error", filename);
}

function LoadScript(filename, callback) {
    if (document.head.querySelectorAll(`script[src$='${filename}']`).length > 0) {
        callback("exists", filename);
        return;
    }

    const script = document.createElement("script");
    script.setAttribute("defer", true);
    script.src = filename;
    document.body.appendChild(script);

    script.onload = ()=> callback("ok", filename);
    script.onerror = ()=> callback("error", filename);
}

function StoreSession() {
    let session = [];

    if (localStorage.getItem("restore_session") === "true")
        for (let i = 0; i < $w.array.length; i++)
            session.push({
                class       : $w.array[i].constructor.name,
                args        : $w.array[i].args,
                isMaximized : $w.array[i].isMaximized,
                isMinimized : $w.array[i].isMinimized,
                position    : $w.array[i].position,
                left        : $w.array[i].win.style.left,
                top         : $w.array[i].win.style.top,
                width       : $w.array[i].win.style.width,
                height      : $w.array[i].win.style.height
            });

    localStorage.setItem("session", JSON.stringify(session));

    return session;
}

function RestoreSession() {
    let session = JSON.parse(localStorage.getItem("session") ?? {});

    if (localStorage.getItem("restore_session") != "true") {
        fragment = window.location.href.substring(window.location.href.indexOf("#") + 1, window.location.href.length);
        switch (fragment) {
            case "passgen"  : new Passgen(); break;
            case "netcalc"  : new Netcalc(); break;
            case "maclookup": new MacLookup(); break;
            case "locateip" : new LocateIp(); break;
            case "chess"    : new Chess(); break;
        }
        return;
    }

    if (session == null || session.length == 0) return;    

    for (let i = 0; i < session.length; i++) {
        let win;
        switch (session[i].class) {
            case "Passgen"   : win = new Passgen(); break;
            case "Netcalc"   : win = new Netcalc(); break;
            case "MacLookup" : win = new MacLookup(session[i].args); break;
            case "LocateIp"  : win = new LocateIp(session[i].args); break;
            case "Encoder"   : win = new Encoder(session[i].args); break;
            case "Chess"     : win = new Chess(session[i].args); break;
            case "Settings"  : win = new Settings(session[i].args); break;
        }

        if (win) {
            if (session[i].isMaximized) win.Toogle();
            if (session[i].isMinimized) win.Minimize();
            win.position = session[i].position;

            if (!$w.always_maxxed) {
                win.win.style.left   = session[i].left;
                win.win.style.top    = session[i].top;
                win.win.style.width  = session[i].width;
                win.win.style.height = session[i].height;
            }
        }
    }

}