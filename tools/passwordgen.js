class Passgen extends Window {
    constructor() {
        super();

        this.SetTitle("Password generator");
        this.SetIcon("res/passgen.svg");

        this.content.style.padding = "32px 16px 0 16px";
        this.content.style.overflowY = "auto";
        this.content.style.textAlign = "center";

        this.txtPassword = document.createElement("input");
        this.txtPassword.type = "text";
        this.txtPassword.maxLength = "64";
        this.txtPassword.style.fontSize = "larger";
        this.txtPassword.style.width = "60%";
        this.txtPassword.style.maxWidth = "720px";
        this.txtPassword.style.margin = "2px calc(20% - 32px)";
        this.txtPassword.style.fontFamily = "monospace";
        this.content.appendChild(this.txtPassword);

        this.divStrength = document.createElement("div");
        this.divStrength.style.marginTop = "4px";
        this.divStrength.style.marginTop = "4px";
        this.divStrength.style.marginTop = "4px";
        this.content.appendChild(this.divStrength);

        this.divBar = document.createElement("div");
        this.divBar.className = "passwors-strength-bar";
        this.divBar.style.display = "inline-block";
        this.divBar.style.width = "40px";
        this.divBar.style.height = "12px";
        this.divBar.style.transition = "box-shadow .2s";
        this.divBar.style.border = "1px solid rgb(127,127,127)";
        this.divBar.style.borderRadius = "2px";
        this.divStrength.appendChild(this.divBar);

        this.lblComment = document.createElement("div");
        this.lblComment.style.display = "inline-block";
        this.lblComment.style.minWidth = "100px";
        this.lblComment.style.textAlign = "left";
        this.lblComment.style.marginLeft = "8px";
        this.lblComment.style.marginTop = "0px";
        this.divStrength.appendChild(this.lblComment);

        const grid = document.createElement("div");
        grid.style.display = "grid";
        grid.style.width = "424px";
        grid.style.margin = "40px auto 20px auto";
        grid.style.padding = "40px";
        grid.style.backgroundColor = "var(--pane-color)";
        grid.style.color = "rgb(16,16,16)";
        grid.style.fontWeight = "600";
        grid.style.borderRadius = "4px";
        grid.style.gridTemplateColumns = "208px 96px 120px";
        grid.style.gridTemplateRows = "40px repeat(5, 32px)";
        grid.style.alignItems = "center";
        this.content.appendChild(grid);

        this.cmbOptions = document.createElement("select");
        this.cmbOptions.style.margin = "0 80px 12px 80px";
        this.cmbOptions.style.gridArea = "1 / 1 / auto / 3";
        grid.appendChild(this.cmbOptions);

        let optPin = document.createElement("option");
        optPin.value = "pin";
        optPin.text = "Pin";
        this.cmbOptions.appendChild(optPin);

        let optRandom = document.createElement("option");
        optRandom.value = "rnd";
        optRandom.text = "Random";
        this.cmbOptions.appendChild(optRandom);

        this.cmbOptions.value = "rnd";

        let lblLength = document.createElement("div");
        lblLength.innerHTML = "Length:";
        lblLength.style.textDecoration = "underline";
        lblLength.style.width = "100%";
        lblLength.style.marginBottom = "4px";
        lblLength.style.textAlign = "left";
        lblLength.style.gridArea = "2 / 1";
        grid.appendChild(lblLength);

        this.rngLength = document.createElement("input");
        this.rngLength.type = "range";
        this.rngLength.min = "6";
        this.rngLength.max = this.txtPassword.maxLength;
        this.rngLength.value = "16";
        this.rngLength.style.width = "200px";
        this.rngLength.style.float = "left";
        this.rngLength.style.gridArea = "3 / 1";
        grid.appendChild(this.rngLength);

        this.txtLength = document.createElement("input");
        this.txtLength.type = "number";
        this.txtLength.min = this.rngLength.min;
        this.txtLength.max = this.txtPassword.maxLength;
        this.txtLength.value = this.rngLength.value;
        this.txtLength.style.width = "48px";
        this.txtLength.style.gridArea = "3 / 2";
        grid.appendChild(this.txtLength);

        let divLowercase = document.createElement("div");
        divLowercase.style.gridArea = "2 / 3";
        grid.appendChild(divLowercase);

        this.chkLowercase = document.createElement("input");
        this.chkLowercase.type = "checkbox";
        this.chkLowercase.checked = true;
        divLowercase.appendChild(this.chkLowercase);
        this.AddCheckBoxLabel(divLowercase, this.chkLowercase, "Lowercase");


        let divUppercase = document.createElement("div");
        divUppercase.style.gridArea = "3 / 3";
        grid.appendChild(divUppercase);

        this.chkUppercase = document.createElement("input");
        this.chkUppercase.type = "checkbox";
        this.chkUppercase.checked = true;
        divUppercase.appendChild(this.chkUppercase);
        this.AddCheckBoxLabel(divUppercase, this.chkUppercase, "Uppercase");


        let divNumbers = document.createElement("div");
        divNumbers.style.gridArea = "4 / 3";
        grid.appendChild(divNumbers);

        this.chkNumbers = document.createElement("input");
        this.chkNumbers.type = "checkbox";
        this.chkNumbers.checked = true;
        divNumbers.appendChild(this.chkNumbers);
        this.AddCheckBoxLabel(divNumbers, this.chkNumbers, "Numbers");

        let divSymbols = document.createElement("div");
        divSymbols.style.gridArea = "5 / 3";
        grid.appendChild(divSymbols);

        this.chkSymbols = document.createElement("input");
        this.chkSymbols.type = "checkbox";
        this.chkSymbols.checked = false;
        divSymbols.appendChild(this.chkSymbols);
        this.AddCheckBoxLabel(divSymbols, this.chkSymbols, "Symbols");

        const lblEntropy = document.createElement("div");
        lblEntropy.innerHTML = "Entropy (bits):";
        lblEntropy.style.gridArea = "4 / 1";
        lblEntropy.style.textAlign = "right";
        lblEntropy.style.paddingRight = "4px";
        lblEntropy.style.color = "#808080";
        grid.appendChild(lblEntropy);

        this.lblEntropyValue = document.createElement("div");
        this.lblEntropyValue.style.gridArea = "4 / 2";
        this.lblEntropyValue.style.textAlign = "left";
        this.lblEntropyValue.style.fontWeight = "normal";
        this.lblEntropyValue.style.paddingLeft = "12px";
        this.lblEntropyValue.style.color = "#808080";
        grid.appendChild(this.lblEntropyValue);

        this.rngLength.oninput = () => {
            this.txtLength.value = this.rngLength.value;
            this.Generate();
        };

        this.txtLength.oninput = () => {
            this.rngLength.value = this.txtLength.value;
            this.Generate();
        };

        let divButtons = document.createElement("div");
        divButtons.style.width = "100%";
        divButtons.style.textAlign = "center";
        divButtons.style.paddingTop = "32px";
        divButtons.style.gridArea = "5 / 1 / 7 / 3";
        grid.appendChild(divButtons);

        const btnGenerate = document.createElement("input");
        btnGenerate.type = "button";
        btnGenerate.value = "Generate";
        divButtons.appendChild(btnGenerate);

        const btnCopy = document.createElement("input");
        btnCopy.type = "button";
        btnCopy.value = "Copy";
        divButtons.appendChild(btnCopy);

        btnGenerate.style.width = btnCopy.style.width = "96px";
        btnGenerate.style.height = btnCopy.style.height = "40px";
        btnGenerate.style.margin = btnCopy.style.margin = "2px";
        btnGenerate.style.borderRadius = "4px 0 0 4px";
        btnCopy.style.borderRadius = "0 4px 4px 0";

        this.lblTtc = document.createElement("div");
        this.lblTtc.innerHTML = "";
        this.lblTtc.style.color = "#808080";
        this.content.appendChild(this.lblTtc);

        this.cmbOptions.onchange = () => {
            switch (this.cmbOptions.value) {
                case "pin":
                    this.rngLength.min = 4;
                    this.rngLength.value = 4;
                    this.rngLength.max = 64;
                    this.chkNumbers.checked = true;
                    this.chkLowercase.checked = false;
                    this.chkUppercase.checked = false;
                    this.chkSymbols.checked = false;
                    this.chkLowercase.setAttribute("disabled", true);
                    this.chkUppercase.setAttribute("disabled", true);
                    this.chkNumbers.setAttribute("disabled", true);
                    this.chkSymbols.setAttribute("disabled", true);
                    lblLength.innerHTML = "Lenght:";
                    break;

                case "rnd":
                    this.rngLength.value = 16;
                    this.rngLength.min = 6;
                    this.rngLength.max = 64;
                    this.chkLowercase.checked = true;
                    this.chkUppercase.checked = true;
                    this.chkNumbers.checked = false;
                    this.chkSymbols.checked = false;
                    this.chkLowercase.removeAttribute("disabled");
                    this.chkUppercase.removeAttribute("disabled");
                    this.chkNumbers.removeAttribute("disabled");
                    this.chkSymbols.removeAttribute("disabled");
                    lblLength.innerHTML = "Lenght:";
                    break;

                case "mem":
                    this.rngLength.min = 2;
                    this.rngLength.value = 4;
                    this.rngLength.max = 32;
                    this.chkLowercase.checked = true;
                    this.chkUppercase.checked = false;
                    this.chkNumbers.checked = false;
                    this.chkSymbols.checked = false;
                    this.chkLowercase.removeAttribute("disabled");
                    this.chkUppercase.removeAttribute("disabled");
                    this.chkNumbers.removeAttribute("disabled");
                    this.chkSymbols.setAttribute("disabled", true);
                    lblLength.innerHTML = "Words:";
                    break;
            }



            this.txtLength.min = this.rngLength.min;
            this.txtLength.value = this.rngLength.value;

            this.Generate();
        };

        this.chkLowercase.onchange = this.chkUppercase.onchange = this.chkNumbers.onchange = this.chkSymbols.onchange = () => { this.Generate(); };

        btnGenerate.onclick = () => { this.Generate(); };

        btnCopy.onclick = () => {
            this.txtPassword.focus();
            this.txtPassword.select();
            document.execCommand("copy");
        };

        this.txtPassword.oninput = () => {
            if (this.cmbOptions.value == "mem") {
                let phrase = this.txtPassword.value.split("-");
                this.rngLength.value = phrase.length;
                this.txtLength.value = phrase.length;
                return;
            }

            let word = this.txtPassword.value;

            this.rngLength.value = word.length;
            this.txtLength.value = word.length;

            let hasUppercase = false;
            let hasLowercase = false;
            let hasNumbers = false;
            let hasSymbols = false;

            for (let i = 0; i < word.length; i++) {
                let b = word.charCodeAt(i);
                if (b > 47 && b < 58) hasNumbers = true;
                else if (b > 64 && b < 91) hasUppercase = true;
                else if (b > 96 && b < 123) hasLowercase = true;
                else hasSymbols = true;
            }

            this.chkLowercase.checked = hasLowercase;
            this.chkUppercase.checked = hasUppercase;
            this.chkNumbers.checked = hasNumbers;
            this.chkSymbols.checked = hasSymbols;


            this.Strength();
        };

        this.Generate();

        this.LoadWords();
    }

    LoadWords() {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.status == 403) location.reload(); //authorization

            if (xhr.readyState == 4 && xhr.status == 200) {
                let words = xhr.responseText.split("\n");
                if (words.length > 2) this.words = words;

                let optMemorable = document.createElement("option");
                optMemorable.value = "mem";
                optMemorable.text = "Memorable";
                this.cmbOptions.appendChild(optMemorable);
            }
        };

        xhr.open("GET", "bin/wordslist.txt", true);
        xhr.send();
    }

    Generate() {
        if (!this.chkLowercase.checked && !this.chkUppercase.checked && !this.chkNumbers.checked && !this.chkSymbols.checked)
            this.chkLowercase.checked = true;

        if (this.cmbOptions.value == "mem") {
            let word = "";
            if (this.words)
                for (let i = 0; i < this.rngLength.value; i++) {
                    if (this.chkLowercase.checked && this.chkUppercase.checked) {
                        let w = this.words[Math.round(Math.random() * this.words.length)];
                        word += w[0].toUpperCase() + w.substring(1);

                    } else if (this.chkUppercase.checked) 
                        word += this.words[Math.round(Math.random() * this.words.length)].toUpperCase();

                    else
                        word += this.words[Math.round(Math.random() * this.words.length)];

                    if (i+1 < this.rngLength.value)word += "-";
                }

            if (this.chkNumbers.checked) {
                let temp = word;
                word = "";
                for (let i = 0; i < temp.length; i++)
                    if (Math.random() > .4) {
                        let c = temp[i].toLowerCase();

                        if (c == "i") word += "1";
                        else if (c == "e") word += "3";
                        else if (c == "a") word += "4";
                        else if (c == "s") word += "5";
                        else if (c == "t") word += "7";
                        else word += temp[i];                        

                    } else {
                        word += temp[i];
                    }
            }

            this.txtPassword.value = word;
            this.Strength();
            return;
        }

        let pool = [];
        let flag = [];

        if (this.chkLowercase.checked) {
            pool.push("abcdefghijkmnopqrstuvwxyz");
            flag.push(false);
        }

        if (this.chkUppercase.checked) {
            pool.push("ABCDEFGHJKLMNOPQRSTUVWXYZ");
            flag.push(false);
        }

        if (this.chkSymbols.checked) {
            pool.push("!#$%&()*+-<=>?@^_~,./[\\]{|}");
            flag.push(false);
        }

        if (this.chkNumbers.checked) {
            pool.push("0123456789");
            flag.push(false);
        }

        let word = "";
        for (let i = 0; i < this.rngLength.value; i++) {
            let dice = Math.round(Math.random() * (pool.length + 1));
            if (dice < pool.length) {
                word += pool[dice][Math.round(Math.random() * (pool[dice].length - 1))];
                flag[dice] = true;

            } else {
                let ok = false;

                for (let j = 0; j < flag.length; j++)
                    if (!flag[j]) {
                        word += pool[j][Math.round(Math.random() * (pool[j].length - 1))];
                        flag[j] = true;
                        ok = true;
                        break;
                    }

                if (!ok) {
                    dice = Math.round(Math.random() * (pool.length - 1));
                    word += pool[dice][Math.round(Math.random() * (pool[dice].length - 1))];
                    flag[dice] = true;
                }
            }
        }

        this.txtPassword.value = word;
        this.Strength();
    }

    Strength() {
        let pool = 0;
        if (this.chkNumbers.checked) pool += 10;
        if (this.chkUppercase.checked) pool += 26;
        if (this.chkLowercase.checked) pool += 26;
        if (this.chkSymbols.checked) pool += 30;

        let entropy = Math.log(pool, 2) * this.txtPassword.value.length;
        //same as     Math.log(Math.pow(pool, this.txtPassword.value.length), 2))

        let strength = StrengthBar(entropy);
        let color    = strength[0];
        let fill     = strength[1];
        let comment  = strength[2];

        this.divBar.style.boxShadow = `${color} ${Math.round(fill)}px 0 0 inset`;
        this.lblComment.innerHTML = comment;
        this.lblEntropyValue.innerHTML = Math.round(entropy);

        let combinations = Math.pow(pool, this.txtPassword.value.length);
        let ttc = combinations / 350000000000; //time to crack in seconds

        let eon = Math.floor(ttc / (1000000000 * 365 * 24 * 3600));
        ttc -= eon * 1000000000 * 365 * 24 * 3600;

        let years = Math.floor(ttc / (365 * 24 * 3600));
        ttc -= years * (365 * 24 * 3600);

        let days = Math.floor(ttc / (24 * 3600));
        ttc -= days * (24 * 3600);

        let hours = Math.floor(ttc / 3600);
        ttc -= hours * 3600;

        let minutes = Math.floor(ttc / 60);
        ttc -= minutes * 60;

        let seconds = Math.round(ttc);

        let etc = ""; //Estimated Time to Crack
        if (eon != 0)     etc  = eon == 1     ? `1 eon, `    : `${eon} eons, `;
        if (years != 0)   etc += years == 1   ? `1 year, `   : `${years} years, `;
        if (days != 0)    etc += days == 1    ? `1 day, `    : `${days} days, `;
        if (hours != 0)   etc += hours == 1   ? `1 hour, `   : `${hours} hours, `;
        if (minutes != 0) etc += minutes == 1 ? `1 minute, ` : `${minutes} minutes, `;

        if (seconds != 0) {
            if (etc.length == 0) {
                etc += seconds == 1 ? `a second` : `${seconds} seconds`;
            } else {
                etc += seconds == 1 ? `and 1 second` : `and ${seconds} seconds`;
            }
        }

        if (etc.length == 0) etc = "less then a second";

        if (eon > 999999999999999)
            this.lblTtc.innerHTML = "<u>TTC:</u>&nbsp;Infinity";
        else
            this.lblTtc.innerHTML = `<u>TTC:</u>&nbsp;${etc}`;
    }
}

function StrengthBar(entropy) {
    let comment = "";
    let color = "";

    if (entropy < 19) {
        comment = "Forbidden";
        color = "#f00";

    } else if (entropy < 28) {
        comment = "Very weak";
        color = "#d00";

    } else if (entropy < 36) {
        comment = "Weak";
        color = "#d70";

    } else if (entropy < 60) {
        comment = "Reasonable";
        color = "#dc0";

    } else if (entropy < 128) {
        comment = "Strong";
        color = "#8c2";

    } else {
        comment = "Overkill";
        color = "#07d";
    }

    return [color, 32 * entropy / 96, comment];
}