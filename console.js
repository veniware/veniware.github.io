class Console extends Window {
    constructor() {
        super();

        this.history = [];

        this.list = document.createElement("div");
        this.list.style.position = "absolute";
        this.list.style.overflowY = "auto";
        this.list.style.left = "0";
        this.list.style.right = "0";
        this.list.style.top = "0";
        this.list.style.bottom = "40px";
        this.list.className = "no-entries";
        this.content.appendChild(this.list);

        this.txtInput = document.createElement("input");
        this.txtInput.type = "text";
        this.txtInput.placeholder = "hostname or ip";
        this.txtInput.style.position  = "absolute";
        this.txtInput.style.left      = "40px";
        this.txtInput.style.bottom    = "40px";
        this.txtInput.style.width     = "calc(100% - 80px)";
        this.txtInput.style.margin    = "0";
        this.txtInput.style.border    = "0";
        this.txtInput.style.outline   = "none";
        this.txtInput.style.boxSizing = "border-box";
        this.content.appendChild(this.txtInput);

        let historyIndex = -1;
        this.txtInput.onkeydown = (event) => {

            if (event.keyCode === 13) { //enter
                if (this.txtInput.value.length == 0) return;
                this.Push(this.txtInput.value.trim().toLocaleLowerCase());
                this.list.scrollTop = this.list.scrollHeight;
                this.txtInput.value = "";
                event.preventDefault();
            }

            if (event.keyCode == 38 || event.keyCode == 40) { //up or down
                if (this.history.length == 0) return;

                if (event.keyCode == 38) historyIndex--; //up
                if (event.keyCode == 40) historyIndex++; //down

                if (historyIndex < 0) historyIndex = this.history.length - 1;
                historyIndex %= this.history.length;
                this.txtInput.value = this.history[historyIndex];

                event.preventDefault();

            } else if (event.keyCode != 37 && event.keyCode != 39) { // not left nor right
                historyIndex = -1;
            }

        };

        this.defaultElement = this.txtInput;
        this.txtInput.focus();

        this.txtInput.onfocus = () => { this.BringToFront(); };
        this.escAction = () => { this.txtInput.value = ""; };
    }

    Push(command) { //overridable 
        if (command === "") return;
        if (command === "!!" && this.history.length === 0) return false;

        if (command === "!!") {
            this.Push(this.history[this.history.length - 1]);
            return false;
        }

        this.txtInput.style.left = "8px";
        this.txtInput.style.bottom = "8px";
        this.txtInput.style.width = "calc(100% - 16px)";

        if (this.history.includes(command))
            this.history.splice(this.history.indexOf(command), 1);

        this.history.push(command);

        return true;
    }

}