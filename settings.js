(function initSettings() {
    //automatically disable animations if prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion)').matches && localStorage.getItem("disable_anime") === null)
        localStorage.setItem("disable_anime", "true");

    $w.always_maxxed        = localStorage.getItem("w_always_maxed") === "true";
    container.className     = localStorage.getItem("w_disable_dropshadow") === "true" ? "disable-window-dropshadows" : "";
    document.body.className = localStorage.getItem("disable_anime") === "true" ? " disable-animation" : "";

    if (localStorage.getItem("accent_color"))
        SetAccentColor(localStorage.getItem("accent_color").split(",").map(o => parseInt(o)));
    else
        SetAccentColor([255, 51, 34]);
       
    if (localStorage.getItem("background"))
        main.style.background = localStorage.getItem("background");

    if (localStorage.getItem("font") && localStorage.getItem("font").length > 0)
        document.documentElement.style.setProperty("--global-font-family", localStorage.getItem("font"));
})();

class Settings extends Tabs {
    constructor(args) {
        super();

        this.args = args ? args : "";

        this.SetTitle("Settings");
        this.SetIcon("res/tool02.svg");

        this.tabsContainer.style.width = "150px";
        this.subContent.style.left = "175px";
        this.subContent.style.padding = "24px";
        this.subContent.style.overflowY = "auto";

        this.tabGui     = this.AddTab("Appearance", "res/tv.svg");
        this.tabSession = this.AddTab("Session", "res/hourglass.svg");
        this.tabLegal   = this.AddTab("License", "res/gpl.svg");

        this.tabGui.onclick = () => this.ShowGui();
        this.tabSession.onclick = () => this.ShowSession();
        this.tabLegal.onclick = () => this.ShowLegal();

        switch (this.args) {
            case "icons":
                this.tabIcons.className = "v-tab-selected";
                this.ShowIcons();
                break;

            case "session":
                this.tabSession.className = "v-tab-selected";
                this.ShowSession();
                break;

            case "legal":
                this.tabLegal.className = "v-tab-selected";
                this.ShowLegal();
                break;

            default:
                this.tabGui.className = "v-tab-selected";
                this.ShowGui();
        }
    }

    ShowGui() {
        this.args = "appearance";
        this.subContent.innerHTML = "";

        this.chkWinMaxxed = document.createElement("input");
        this.chkWinMaxxed.type = "checkbox";
        this.subContent.appendChild(this.chkWinMaxxed);
        this.AddCheckBoxLabel(this.subContent, this.chkWinMaxxed, "Always maximize windows").style.fontWeight = "600";
        this.subContent.appendChild(document.createElement("br"));
        this.subContent.appendChild(document.createElement("br"));

        this.chkDisableAnime = document.createElement("input");
        this.chkDisableAnime.type = "checkbox";
        this.subContent.appendChild(this.chkDisableAnime);
        this.AddCheckBoxLabel(this.subContent, this.chkDisableAnime, "Disable animations").style.fontWeight = "600";
        this.subContent.appendChild(document.createElement("br"));
        this.subContent.appendChild(document.createElement("br"));

        this.chkWindowShadows = document.createElement("input");
        this.chkWindowShadows.type = "checkbox";
        this.subContent.appendChild(this.chkWindowShadows);
        this.AddCheckBoxLabel(this.subContent, this.chkWindowShadows, "Disable window drop-shadows").style.fontWeight = "600";
        this.subContent.appendChild(document.createElement("br"));

        this.subContent.appendChild(document.createElement("br"));
        this.subContent.appendChild(document.createElement("hr"));

        const divColor = document.createElement("div");
        divColor.innerHTML = "Accent color: ";
        divColor.style.fontWeight = "600";
        divColor.style.paddingBottom = "8px";
        this.subContent.appendChild(divColor);

        this.accentIndicators = [];
        let selected_accent = [255, 51, 34];
        if (localStorage.getItem("accent_color"))
            selected_accent = localStorage.getItem("accent_color").split(",").map(o => parseInt(o));

        const accentColors = [[255,51,34], [255,102,0], [255,186,0], [96,192,32], [36,176,244]];

        for (let i = 0; i < accentColors.length; i++) {
            let rgbString = `rgb(${accentColors[i][0]},${accentColors[i][1]},${accentColors[i][2]})`;
            let hsl = RgbToHsl(accentColors[i]);

            let step1 = `hsl(${hsl[0]-4},${hsl[1]}%,${hsl[2]*.78}%)`;
            let step2 = `hsl(${hsl[0]+7},${hsl[1]}%,${hsl[2]*.9}%)`; //--select-color
            let step3 = `hsl(${hsl[0]-4},${hsl[1]}%,${hsl[2]*.8}%)`;
            let gradient = `linear-gradient(to bottom, ${step1}0%, ${step2}92%, ${step3}100%)`;

            const themeBox = document.createElement("div");
            themeBox.style.display = "inline-block";
            themeBox.style.margin = "2px 4px";
            this.subContent.appendChild(themeBox);

            const gradientBox = document.createElement("div");
            gradientBox.style.width = "48px";
            gradientBox.style.height = "48px";
            gradientBox.style.borderRadius = "4px";
            gradientBox.style.background = gradient;
            gradientBox.style.border = step1 + " 1px solid";
            themeBox.appendChild(gradientBox);

            let isSelected = selected_accent[0] == accentColors[i][0] && selected_accent[1] == accentColors[i][1] && selected_accent[2] == accentColors[i][2];

            const indicator = document.createElement("div");
            indicator.style.width = isSelected ? "48px" : "8px";
            indicator.style.height = "8px";
            indicator.style.borderRadius = "8px";
            indicator.style.marginTop = "4px";
            indicator.style.marginLeft = isSelected ? "0" : "20px";
            indicator.style.backgroundColor = rgbString;
            indicator.style.border = step1 + " 1px solid";
            indicator.style.transition = ".4s";
            themeBox.appendChild(indicator);

            this.accentIndicators.push(indicator);

            themeBox.onclick = () => {
                localStorage.setItem("accent_color", `${accentColors[i][0]},${accentColors[i][1]},${accentColors[i][2]}`);
                SetAccentColor(accentColors[i]);

                for (let j = 0; j < $w.array.length; j++) //update other setting windows
                    if ($w.array[j] instanceof Settings && $w.array[j].args === "appearance") {
                        for (let k = 0; k < this.accentIndicators.length; k++) {
                            $w.array[j].accentIndicators[k].style.width = "8px";
                            $w.array[j].accentIndicators[k].style.marginLeft = "20px";
                        }
                        $w.array[j].accentIndicators[i].style.width = "48px";
                        $w.array[j].accentIndicators[i].style.marginLeft = "0px";
                    }
            };
        }

        this.subContent.appendChild(document.createElement("hr"));

        const divBackground = document.createElement("div");
        divBackground.innerHTML = "Background: ";
        divBackground.style.fontWeight = "600";
        divBackground.style.paddingBottom = "8px";
        this.subContent.appendChild(divBackground);

        this.bgIndicators = [];
        let selected_bg = "";
        if (localStorage.getItem("background"))
            selected_bg = localStorage.getItem("background");

        const background_list = [
            ["System",   ""],
            ["Light",    "var(--bg-light)"],
            ["Sky blue", "var(--bg)"],
            ["Dark",     "var(--bg-dark)"],
            ["Blue",     "var(--bg-blue)"],
            ["Green",    "var(--bg-green)"],
            ["Carbon",   "var(--bg-carbon)"],
            ["Metal",    "var(--bg-metal)"]
        ];

        for (let i = 0; i < background_list.length; i++) {
            const bgBox = document.createElement("div");
            bgBox.style.display = "inline-block";
            bgBox.style.margin = "2px 4px";
            this.subContent.appendChild(bgBox);

            const previewBox = document.createElement("div");
            previewBox.innerHTML = background_list[i][0];
            previewBox.style.textAlign = "center";
            previewBox.style.lineHeight = "72px";
            previewBox.style.fontWeight = "700";
            previewBox.style.textShadow = "#fff 0px 0px 2px";
            previewBox.style.width = "96px";
            previewBox.style.height = "80px";
            previewBox.style.borderRadius = "4px";
            previewBox.style.background = background_list[i][1];
            previewBox.style.border = "rgb(96,96,96) 2px solid";
            bgBox.appendChild(previewBox);

            let isSelected = selected_bg == background_list[i][1];

            const indicator = document.createElement("div");
            indicator.style.width = isSelected ? "96px" : "8px";
            indicator.style.height = "8px";
            indicator.style.borderRadius = "8px";
            indicator.style.marginTop = "4px";
            indicator.style.marginLeft = isSelected ? "0" : "44px";
            indicator.style.backgroundColor = "rgb(64,64,64)";
            indicator.style.border = "transparent 1px solid";
            indicator.style.transition = ".4s";
            bgBox.appendChild(indicator);

            this.bgIndicators.push(indicator);

            bgBox.onclick = () => {
                localStorage.setItem("background", background_list[i][1]);
                main.style.background = background_list[i][1];

                for (let j = 0; j < $w.array.length; j++) //update other setting windows
                    if ($w.array[j] instanceof Settings && $w.array[j].args === "appearance") {
                        for (let k = 0; k < this.bgIndicators.length; k++) {
                            $w.array[j].bgIndicators[k].style.width = "8px";
                            $w.array[j].bgIndicators[k].style.marginLeft = "44px";
                        }
                        $w.array[j].bgIndicators[i].style.width = "96px";
                        $w.array[j].bgIndicators[i].style.marginLeft = "0px";
                    }
            };
        }

        this.chkWinMaxxed.checked     = localStorage.getItem("w_always_maxed") === "true";
        this.chkDisableAnime.checked  = localStorage.getItem("disable_anime") === "true";
        this.chkWindowShadows.checked = localStorage.getItem("w_disable_dropshadow") === "true";

        const Apply = ()=> {
            $w.always_maxxed = this.chkWinMaxxed.checked;
            container.className = this.chkWindowShadows.checked ? "disable-window-dropshadows" : "";
            document.body.className = this.chkDisableAnime.checked ? " disable-animation" : "";

            localStorage.setItem("w_always_maxed", this.chkWinMaxxed.checked);
            localStorage.setItem("disable_anime", this.chkDisableAnime.checked);
            localStorage.setItem("w_disable_dropshadow", this.chkWindowShadows.checked);

            for (let i = 0; i < $w.array.length; i++) //update other setting windows
                if ($w.array[i] instanceof Settings && $w.array[i].args === "appearance") {
                    $w.array[i].chkWinMaxxed.checked         = this.chkWinMaxxed.checked;
                    $w.array[i].chkDisableAnime.checked      = this.chkDisableAnime.checked;
                    $w.array[i].chkWindowShadows.checked     = this.chkWindowShadows.checked;
                }
        };

        this.chkWinMaxxed.onchange         = Apply;
        this.chkDisableAnime.onchange      = Apply;
        this.chkWindowShadows.onchange     = Apply;

        Apply();
    }

    ShowSession() {
        this.args = "session";
        this.subContent.innerHTML = "";

        this.chkRestoreSession = document.createElement("input");
        this.chkRestoreSession.type = "checkbox";
        this.subContent.appendChild(this.chkRestoreSession);
        this.AddCheckBoxLabel(this.subContent, this.chkRestoreSession, "Reopen previous windows on-load").style.fontWeight = "600";

        this.subContent.appendChild(document.createElement("br"));
        this.subContent.appendChild(document.createElement("br"));
        this.subContent.appendChild(document.createElement("hr"));
        this.subContent.appendChild(document.createElement("br"));

        const btnClearLocalCache = document.createElement("input");
        btnClearLocalCache.type = "button";
        btnClearLocalCache.value = "Clear local storage";
        btnClearLocalCache.style.height = "36px";
        btnClearLocalCache.style.padding = "8px";
        this.subContent.appendChild(btnClearLocalCache);

        this.chkRestoreSession.checked = localStorage.getItem("restore_session") === "true";

        btnClearLocalCache.onclick = () => { this.ClearCache() };

        const timeMapping = { 1:15, 2:30, 3:60, 4:2*60, 5:4*60, 6:8*60, 7:24*60, 8:Infinity };
        const cookieMapping = { 1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:14, 9:21, 10:28, 11:60, 12:90 };
        const Apply = () => {
            localStorage.setItem("restore_session", this.chkRestoreSession.checked);
            
            for (let i = 0; i < $w.array.length; i++) //update other setting windows
                if ($w.array[i] instanceof Settings && $w.array[i].args === "session") {
                    $w.array[i].chkRestoreSession.checked = this.chkRestoreSession.checked;
                }
        };

        this.chkRestoreSession.onchange = Apply;

        Apply();
    }

    ShowLegal() {
        this.args = "legal";
        this.subContent.innerHTML = "";

        const box = document.createElement("div");
        box.style.fontFamily = "monospace";
        box.style.userSelect = "text";
        this.subContent.appendChild(box);

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.status == 403) location.reload(); //authorization

            if (xhr.readyState == 4 && xhr.status == 200) {
                let license = xhr.responseText;
                license = license.replaceAll(" ", "&nbsp;");
                license = license.replaceAll("<", "&lt;");
                license = license.replaceAll(">", "&gt;");
                license = license.replaceAll("\n", "<br>");
                box.innerHTML = license;
            } 
        };
        xhr.open("GET", "license.txt", true);
        xhr.send();
    }

    ClearCache() {
        const btnOK = this.ConfirmBox("Are you sure you want clear local storage? The page will reload after the cleaning.", false);
        if (btnOK) btnOK.addEventListener("click", () => {
            localStorage.clear();
            location.reload();
        });
    }
}
