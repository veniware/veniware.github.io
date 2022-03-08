const FEN_START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

class Chess extends Window {

    constructor(args) {
        super([64,64,64]);

        this.args = args ? args : null;

        this.AddCssDependencies("chess/chess.css");

        this.SetTitle("Chess");
        this.SetIcon("chess/king.svg");
        this.content.style.overflow = "hidden";

        this.sounds = {
            move    : new Audio("chess/move.webm"),
            capture : new Audio("chess/capture.webm"),
            check   : new Audio("chess/check.webm"),
            illegal : new Audio("chess/illegal.webm"),
        };

        this.board = document.createElement("div");
        this.board.className = "chess-board";
        
        this.board.onmousemove  = event => this.Board_mousemove(event, false);
        this.board.onmouseup    = event => this.Board_mouseup(event, false);
        this.board.onmouseleave = event => this.Board_mouseleave(event, false);
        
        this.board.ontouchmove   = event => this.Board_mousemove(event, true);
        this.board.ontouchend    = event => this.Board_mouseup(event, true);
        this.board.ontouchcancel = event => this.Board_mouseleave(event, true);
        
        this.content.appendChild(this.board);

        this.game = {
            fen: null,
            placement: [],
            activecolor: "w",
            castling: "KQkq",
            enpassant: "-",
            //halfmove: 0,
            //fullmove: 1,
            lastmove: null
        };

        this.squares = [[], [], [], [], [], [], [], []];
        for (let y = 0; y < 8; y++)
            for (let x = 0; x < 8; x++) {
                const square = document.createElement("div");
                square.className = "chess-square";
                square.style.left = x * 100 / 8 + "%";
                square.style.top = y * 100 / 8 + "%";
                square.style.backgroundColor = (x + y) % 2 === 0 ? "rgb(112,112,112)" : "rgb(88,88,88)";
                this.board.appendChild(square);
                this.squares[x][y] = square;
            }

        this.legalMoves = [];
        this.indicators = [];

        for (let i = 0; i < 8; i++) {
            const coord_f = document.createElement("div");
            coord_f.className = "chess-coord";
            coord_f.innerHTML = 8-i;
            coord_f.style.color = i % 2 === 0 ? "rgb(84,84,84)" : "rgb(108,108,108)";
            coord_f.style.left = "0";
            coord_f.style.top = i * 100 / 8 + "%";
            this.board.appendChild(coord_f);

            const coord_r = document.createElement("div");
            coord_r.className = "chess-coord";
            coord_r.innerHTML = String.fromCharCode(97 + i);
            coord_r.style.color = i % 2 === 0 ? "rgb(108,108,108)" : "rgb(84,84,84)";
            coord_r.style.left = `calc(${(i+1) * 12.5}% - 20px)`;
            coord_r.style.bottom = "0";
            coord_r.style.verticalAlign = "bottom";
            this.board.appendChild(coord_r);
        }
        
        if (this.args)
            this.LoadFen(this.args);
        else 
            this.LoadFen(FEN_START);

        this.sidepanel = document.createElement("div");
        this.sidepanel.className = "chess-sidepanel";
        this.content.appendChild(this.sidepanel);

        this.moveslist = document.createElement("div");
        this.moveslist.className = "chess-moveslist";
        this.sidepanel.appendChild(this.moveslist);

        setTimeout(() => { this.AfterResize(); }, ANIM_DURATION);
        setTimeout(() => { this.AfterResize(); }, 1000);
    }

    AfterResize() { //override
        let w = this.content.clientWidth;
        let h = this.content.clientHeight;
        let min = Math.min(w, h) * .96;
        let offset = 0;

        if (w > h && w - min > 250) {
            this.sidepanel.style.visibility = "visible";
            this.sidepanel.style.opacity = "1";
            this.sidepanel.style.transform = "none";
            offset = -125;
        } else {
            this.sidepanel.style.visibility = "hidden";
            this.sidepanel.style.opacity = "0";
            this.sidepanel.style.transform = "translateX(100%)";
            offset = 0;
        }

        if (min < 400)
            for (const element of this.board.querySelectorAll(".chess-coord"))
                element.style.opacity = "0";            
        else
            for (const element of this.board.querySelectorAll(".chess-coord"))
                element.style.opacity = "1";

        this.board.style.width = min + "px";
        this.board.style.height = min + "px";
        this.board.style.left = (w - min) / 2 + offset + "px";
        this.board.style.top = (h - min) / 2 + "px";
    }

    AddPiece(type, position) {
        this.game.placement[position.x][position.y] = type;

        const piece = document.createElement("div");
        piece.className = "chess-piece";

        switch (type.toLowerCase()) {
            case "k": piece.style.backgroundImage = "url(chess/king.svg)"; break;
            case "q": piece.style.backgroundImage = "url(chess/queen.svg)"; break;
            case "r": piece.style.backgroundImage = "url(chess/rook.svg)"; break;
            case "n": piece.style.backgroundImage = "url(chess/knight.svg)"; break;
            case "b": piece.style.backgroundImage = "url(chess/bishop.svg)"; break;
            case "p": piece.style.backgroundImage = "url(chess/pawn.svg)"; break;
        }

        piece.style.left = position.x * 12.5 + "%";
        piece.style.top = position.y * 12.5 + "%";

        if (type === type.toUpperCase())
            piece.style.filter = "invert(1) brightness(.9)";

        piece.onmousedown = event => this.Piece_mousedown(event, false);
        piece.ontouchstart = event => this.Piece_mousedown(event, true);

        this.board.appendChild(piece);
    }

    LoadFen(notation) {
        //clear all pieces
        const pieces = this.board.querySelectorAll(".chess-piece");
        for (const element of pieces)
            this.board.removeChild(element);

        this.game.placement = [];
        for (let i = 0; i < 8; i++)
            this.game.placement[i] = [null, null, null, null, null, null, null, null];


        let array = notation.split(" ");
        if (array.length < 4) return;
        let placement = array[0];

        let position = { x: 0, y: 0 };
        for (let i = 0; i < placement.length; i++) {
            if (placement[i] == "/") {
                position.x = 0;
                position.y += 1;
                continue;
            }

            if (!isNaN(placement[i])) {
                position.x += parseInt(placement[i]);
                continue;
            }

            this.AddPiece(placement[i], position);
            this.game.placement[position.x][position.y] = placement[i];
            position.x += 1;
        }

        this.game.fen = notation;
        this.game.activecolor = array[1];
        this.game.castling = array[2];
        this.game.enpassant = array[3];
    }

    GetCurrentFen() {
        let notaion = "";
        let x = 0, y = 0, blank = 0;

        while (true) {
            if (this.game.placement[x][y] === null) {
                blank++;
            } else {
                if (blank > 0) {
                    notaion += blank;
                    blank = 0;
                }
                notaion += this.game.placement[x][y];
            }

            x++;

            if (x > 7) {
                if (blank > 0) {
                    notaion += blank;
                    blank = 0;
                }
                if (y !== 7) notaion += "/";
                y++;
                x = 0;
            }

            if (y > 7) break;
        }

        notaion += " " + this.game.activecolor;
        notaion += " " + this.game.castling;
        notaion += " " + this.game.enpassant;

        return notaion;
    }

    MovePiece(p0, p1) {
        if (p0.x === p1.x && p0.y === p1.y) return;

        let isCapture = false;

        if (this.game.placement[p0.x][p0.y].toLowerCase() === "p" && Math.abs(p0.y - p1.y) === 2) { //en passant flag
            this.game.enpassant = String.fromCharCode(97 + p1.x) + (8 - p1.y);
        } else {
            this.game.enpassant = "-";
        }

        if (this.game.placement[p0.x][p0.y].toLowerCase() === "p" && p0.x !== p1.x && this.game.placement[p1.x][p1.y] === null) { //en passant
            this.game.placement[p1.x][p0.y] = null;
            isCapture = true;

            const pieces = this.board.querySelectorAll(".chess-piece");
            for (const element of pieces)
                if (element.style.left === p1.x * 12.5 + "%" &&
                    element.style.top === p0.y * 12.5 + "%") {
                    this.board.removeChild(element);
                    break;
                }
        }

        //castling flags
        if (this.game.placement[p0.x][p0.y] === "k") this.game.castling = this.game.castling.replace("k", "").replace("q", "");
        if (this.game.placement[p0.x][p0.y] === "K") this.game.castling = this.game.castling.replace("K", "").replace("Q", "");
        if (this.game.placement[p0.x][p0.y] === "r" && p0.x === 0 && p0.y === 0) this.game.castling = this.game.castling.replace("q", "");
        if (this.game.placement[p0.x][p0.y] === "r" && p0.x === 7 && p0.y === 0) this.game.castling = this.game.castling.replace("k", "");
        if (this.game.placement[p0.x][p0.y] === "R" && p0.x === 0 && p0.y === 7) this.game.castling = this.game.castling.replace("Q", "");
        if (this.game.placement[p0.x][p0.y] === "R" && p0.x === 7 && p0.y === 7) this.game.castling = this.game.castling.replace("K", "");
        if (this.game.castling === "") this.game.castling = "-";

        //castling
        if (this.game.placement[p0.x][p0.y] === "k" && Math.abs(p0.x - p1.x) === 2) {
            if (p0.x - p1.x === 2) { //queenside
                this.game.placement[3][0] === "r";
                this.game.placement[0][0] === null;

            } else if (p0.x - p1.x === -2) { //kingside
                this.game.placement[5][0] === "r";
                this.game.placement[7][0] === null;
            }
        }

        const pieces = Array.from(this.board.querySelectorAll(".chess-piece"));
        
        if (this.game.placement[p0.x][p0.y] === "k" && Math.abs(p0.x - p1.x) === 2) { //black castling
            if (p0.x - p1.x === 2) { //queenside
                this.game.placement[3][0] = "r";
                this.game.placement[0][0] = null;

                const rock = pieces.find(ele=>ele.style.left === "0%" && ele.style.top === "0%");
                rock.style.left = "37.5%";

            } else if (p0.x - p1.x === -2) { //kingside
                this.game.placement[5][0] = "r";
                this.game.placement[7][0] = null;

                const rock = pieces.find(ele=>ele.style.left === "87.5%" && ele.style.top === "0%");
                rock.style.left = "62.5%";
            }
        }

        if (this.game.placement[p0.x][p0.y] === "K" && Math.abs(p0.x - p1.x) === 2) { //white castling
            if (p0.x - p1.x === 2) { //queenside
                this.game.placement[3][7] = "R";
                this.game.placement[0][7] = null;

                const rock = pieces.find(ele=>ele.style.left === "0%" && ele.style.top === "87.5%");
                rock.style.left = "37.5%";

            } else if (p0.x - p1.x === -2) { //kingside
                this.game.placement[5][7] = "R";
                this.game.placement[7][7] = null;

                const rock = pieces.find(ele=>ele.style.left === "87.5%" && ele.style.top === "87.5%");
                rock.style.left = "62.5%";
            }
        }

        if (this.game.placement[p1.x][p1.y] !== null) { //capture a piece
            const captured = pieces.find(ele => ele !== this.selected && ele.style.left === p1.x * 12.5 + "%" && ele.style.top === p1.y * 12.5 + "%");
            if (captured) this.board.removeChild(captured);
            this.sounds.capture.play();
            isCapture = true;
        } else {
            this.sounds.move.play();
        }

        this.game.placement[p1.x][p1.y] = this.game.placement[p0.x][p0.y];
        this.game.placement[p0.x][p0.y] = null;
        this.game.activecolor = this.game.activecolor === "w" ? "b" : "w";
        this.game.lastmove = [p0.x, p0.y, p1.x, p1.y];

        if (this.game.placement[p1.x][p1.y] === "P" && p1.y === 0 || 
            this.game.placement[p1.x][p1.y] === "p" && p1.y === 7) { //promote
            this.PromoteDialog(p1, this.selected);
        }

        this.AddChessNotation(p0, p1, isCapture);

        for (let y = 0; y < 8; y++)
            for (let x = 0; x < 8; x++)
                this.squares[x][y].style.boxShadow = "none";

        setTimeout(()=>{
            this.squares[p0.x][p0.y].style.boxShadow = "inset var(--theme-color) 0 0 2px 2px";
            this.squares[p1.x][p1.y].style.boxShadow = "inset var(--theme-color) 0 0 2px 2px";
        }, 0);

        
        this.args = this.GetCurrentFen();
    }

    PromoteDialog(p, piece) {
        const cover = document.createElement("div");
        cover.className = "chess-cover";
        this.content.appendChild(cover);

        const container = document.createElement("div");
        cover.appendChild(container);

        const q = document.createElement("div");
        q.style.backgroundImage = "url(chess/queen.svg)";
        container.appendChild(q);

        const r = document.createElement("div");
        r.style.backgroundImage = "url(chess/rook.svg)";
        container.appendChild(r);

        const b = document.createElement("div");
        b.style.backgroundImage = "url(chess/bishop.svg)";
        container.appendChild(b);

        const n = document.createElement("div");
        n.style.backgroundImage = "url(chess/knight.svg)";
        container.appendChild(n);

        let color = this.GetPieceColor(p);

        q.onclick = ()=>{
            this.content.removeChild(cover);
            this.game.placement[p.x][p.y] = color === "w" ? "Q" : "q";
            piece.style.backgroundImage = "url(chess/queen.svg)";
            this.args = this.GetCurrentFen();
        };

        r.onclick = ()=>{
            this.content.removeChild(cover);
            this.game.placement[p.x][p.y] = color === "w" ? "R" : "r";
            piece.style.backgroundImage = "url(chess/rook.svg)";
            this.args = this.GetCurrentFen();
        };

        b.onclick = ()=>{
            this.content.removeChild(cover);
            this.game.placement[p.x][p.y] = color === "w" ? "B" : "b";
            piece.style.backgroundImage = "url(chess/bishop.svg)";
            this.args = this.GetCurrentFen();
        };

        n.onclick = ()=>{
            this.content.removeChild(cover);
            this.game.placement[p.x][p.y] = color === "w" ? "N" : "n";
            piece.style.backgroundImage = "url(chess/knight.svg)";
            this.args = this.GetCurrentFen();
        };
    }

    AddChessNotation(p0, p1, isCapture) {
        let piece = this.game.placement[p1.x][p1.y];
        if (piece.toLowerCase() === "p") piece = "";

        const move = document.createElement("div");
        move.className = "chess-move";

        if (isCapture)
            move.innerHTML = `${piece.toUpperCase()}${String.fromCharCode(97+p0.x)}${8-p0.y}x${String.fromCharCode(97+p1.x)}${8-p1.y}`;
        else
            move.innerHTML = `${piece.toUpperCase()}${String.fromCharCode(97+p0.x)}${8-p0.y}-${String.fromCharCode(97+p1.x)}${8-p1.y}`;

        this.moveslist.appendChild(move);
    }

    ClearIndicators() {
        for (let i = 0; i < this.indicators.length; i++)
            this.indicators[i].parentElement.removeChild(this.indicators[i]);

        this.indicators = [];
    }

    GetPseudolegalMoves(p) {
        let piece = this.game.placement[p.x][p.y];
        let color = this.GetPieceColor(p);
        let moves = [];

        if (color !== this.game.activecolor) return moves;

        const pawnMoves = () => {
            if (color === "w") {
                if (this.game.placement[p.x][p.y - 1] === null)
                    moves.push({ x: p.x, y: p.y - 1 });

                if (p.y === 6 &&
                    this.game.placement[p.x][p.y - 1] === null &&
                    this.game.placement[p.x][p.y - 2] === null)
                    moves.push({ x: p.x, y: p.y - 2 });

                if (p.x > 0 &&
                    this.game.placement[p.x - 1][p.y - 1] !== null &&
                    this.GetPieceColor({ x: p.x - 1, y: p.y - 1 }) !== color)
                    moves.push({ x: p.x - 1, y: p.y - 1 });

                if (p.x < 7 &&
                    this.game.placement[p.x + 1][p.y - 1] !== null &&
                    this.GetPieceColor({ x: p.x + 1, y: p.y - 1 }) !== color)
                    moves.push({ x: p.x + 1, y: p.y - 1 });

                if (this.game.enpassant !== "-") { //en passant
                    let x = this.game.enpassant.charCodeAt(0) - 97;
                    let y = 8 - parseInt(this.game.enpassant[1]);

                    if (y === p.y && Math.abs(x - p.x) === 1)
                        moves.push({ x: x, y: y - 1 });                    
                }

            } else {
                if (this.game.placement[p.x][p.y + 1] === null)
                    moves.push({ x: p.x, y: p.y + 1 });

                if (p.y === 1 &&
                    this.game.placement[p.x][p.y + 1] === null &&
                    this.game.placement[p.x][p.y + 2] === null)
                    moves.push({ x: p.x, y: p.y + 2 });

                if (p.x > 0 &&
                    this.game.placement[p.x - 1][p.y + 1] !== null &&
                    this.GetPieceColor({ x: p.x - 1, y: p.y + 1 }) !== color)
                    moves.push({ x: p.x - 1, y: p.y + 1 });

                if (p.x < 7 &&
                    this.game.placement[p.x + 1][p.y + 1] !== null &&
                    this.GetPieceColor({ x: p.x + 1, y: p.y + 1 }) !== color)
                    moves.push({ x: p.x + 1, y: p.y + 1 });

                if (this.game.enpassant !== "-") { //en passant
                    let x = this.game.enpassant.charCodeAt(0) - 97;
                    let y = 8 - parseInt(this.game.enpassant[1]);

                    if (y === p.y && Math.abs(x - p.x) === 1)
                        moves.push({ x: x, y: y + 1 });
                }
                
            }
        };

        const knightMoves = () => {
            let offset = [
                { x: -2, y: -1 },
                { x: -2, y: 1 },
                { x: -1, y: -2 },
                { x: -1, y: 2 },
                { x: 1, y: -2 },
                { x: 1, y: 2 },
                { x: 2, y: -1 },
                { x: 2, y: 1 }
            ];

            for (let i = 0; i < offset.length; i++) {
                let x = p.x + offset[i].x, y = p.y + offset[i].y;
                if (x < 0 || x > 7 || y < 0 || y > 7) continue;
                if (this.GetPieceColor({ x: x, y: y }) === color) continue;
                moves.push({ x: x, y: y });
            }
        };

        const bishopMoves = () => {
            for (let i = 1; i < 8; i++) {
                if (p.x - i < 0 || p.y - i < 0) break;
                if (this.GetPieceColor({ x: p.x - i, y: p.y - i }) === color) break;
                moves.push({ x: p.x - i, y: p.y - i });
                if (this.game.placement[p.x - i][p.y - i] !== null && this.GetPieceColor({ x: p.x - i, y: p.y - i }) !== color) break;
            }
            for (let i = 1; i < 8; i++) {
                if (p.x - i < 0 || p.y + i > 7) break;
                if (this.GetPieceColor({ x: p.x - i, y: p.y + i }) === color) break;
                moves.push({ x: p.x - i, y: p.y + i });
                if (this.game.placement[p.x - i][p.y + i] !== null && this.GetPieceColor({ x: p.x - i, y: p.y + i }) !== color) break;
            }
            for (let i = 1; i < 8; i++) {
                if (p.x + i > 7 || p.y - i < 0) break;
                if (this.GetPieceColor({ x: p.x + i, y: p.y - i }) === color) break;
                moves.push({ x: p.x + i, y: p.y - i });
                if (this.game.placement[p.x + i][p.y - i] !== null && this.GetPieceColor({ x: p.x + i, y: p.y - i }) !== color) break;
            }
            for (let i = 1; i < 8; i++) {
                if (p.x + i > 7 || p.y + i > 7) break;
                if (this.GetPieceColor({ x: p.x + i, y: p.y + i }) === color) break;
                moves.push({ x: p.x + i, y: p.y + i });
                if (this.game.placement[p.x + i][p.y + i] !== null && this.GetPieceColor({ x: p.x + i, y: p.y + i }) !== color) break;
            }
        };

        const rockMoves = () => {
            for (let i = p.x - 1; i > -1; i--) {
                if (this.GetPieceColor({ x: i, y: p.y }) === color) break;
                moves.push({ x: i, y: p.y });
                if (this.game.placement[i][p.y] !== null && this.GetPieceColor({ x: i, y: p.y }) !== color) break;
            }
            for (let i = p.x + 1; i < 8; i++) {
                if (this.GetPieceColor({ x: i, y: p.y }) === color) break;
                moves.push({ x: i, y: p.y });
                if (this.game.placement[i][p.y] !== null && this.GetPieceColor({ x: i, y: p.y }) !== color) break;
            }
            for (let i = p.y - 1; i > -1; i--) {
                if (this.GetPieceColor({ x: p.x, y: i }) === color) break;
                moves.push({ x: p.x, y: i });
                if (this.game.placement[p.x][i] !== null && this.GetPieceColor({ x: p.x, y: i }) !== color) break;
            }
            for (let i = p.y + 1; i < 8; i++) {
                if (this.GetPieceColor({ x: p.x, y: i }) === color) break;
                moves.push({ x: p.x, y: i });
                if (this.game.placement[p.x][i] !== null && this.GetPieceColor({ x: p.x, y: i }) !== color) break;
            }
        };

        const kingMoves = () => {
            let offset = [
                { x: -1, y: -1 },
                { x: -1, y: 0 },
                { x: -1, y: 1 },
                { x: 0, y: -1 },
                { x: 0, y: 1 },
                { x: 1, y: -1 },
                { x: 1, y: 0 },
                { x: 1, y: 1 }
            ];

            for (let i = 0; i < offset.length; i++) {
                let x = p.x + offset[i].x, y = p.y + offset[i].y;
                if (x < 0 || x > 7 || y < 0 || y > 7) continue;
                if (this.GetPieceColor({ x: x, y: y }) === color) continue;
                moves.push({ x: x, y: y });
            }

             //TODO: castling if in check
            if (color === "b") {
                if (this.game.castling.indexOf("q") > -1 &&
                    this.game.placement[0][0] === "r" &&
                    this.game.placement[1][0] === null &&
                    this.game.placement[2][0] === null &&
                    this.game.placement[3][0] === null) { //black queenside castling
                    moves.push({ x: p.x - 2, y: p.y });
                }

                if (this.game.castling.indexOf("k") > -1 &&
                    this.game.placement[7][0] === "r" &&
                    this.game.placement[5][0] === null &&
                    this.game.placement[6][0] === null) { //black kingside castling
                    moves.push({ x: p.x + 2, y: p.y });
                }

            } else if (color === "w") {
                if (this.game.castling.indexOf("Q") > -1 &&
                    this.game.placement[0][7] === "R" &&
                    this.game.placement[1][7] === null &&
                    this.game.placement[2][7] === null &&
                    this.game.placement[3][7] === null) { //white queenside castling
                    moves.push({ x: p.x - 2, y: p.y });
                }

                if (this.game.castling.indexOf("K") > -1 &&
                    this.game.placement[7][7] === "R" &&
                    this.game.placement[5][7] === null &&
                    this.game.placement[6][7] === null) { //white kingside castling
                    moves.push({ x: p.x + 2, y: p.y });
                }
            }
        };

        switch (piece.toLowerCase()) {
            case "p":
                pawnMoves();
                break;

            case "n":
                knightMoves();
                break;

            case "b":
                bishopMoves();
                break;

            case "r":
                rockMoves();
                break;

            case "q":
                bishopMoves();
                rockMoves();
                break;

            case "k":
                kingMoves();
                break;
        }

        return moves;
    }

    GetPieceColor(p) {
        if (this.game.placement[p.x][p.y] === null) return null;
        if (this.game.placement[p.x][p.y] === this.game.placement[p.x][p.y].toLowerCase()) return "b";
        return "w";
    }

    Piece_mousedown(event, isTouch) {
        if (event.buttons !== 1 && !isTouch) {
            this.Board_mouseleave();
            return;
        }

        this.selected = event.srcElement;
        this.selectedPosition = {
            x: parseFloat(event.srcElement.style.left) * this.board.getBoundingClientRect().width / 100,
            y: parseFloat(event.srcElement.style.top) * this.board.getBoundingClientRect().height / 100
        };

        this.x0 = isTouch ? event.touches[0].clientX : event.x;
        this.y0 = isTouch ? event.touches[0].clientY : event.y;

        this.file0 = this.selectedPosition.x * 8 / this.board.getBoundingClientRect().width;
        this.rank0 = this.selectedPosition.y * 8 / this.board.getBoundingClientRect().height;

        this.selected.style.left = parseFloat(event.srcElement.style.left) * this.board.getBoundingClientRect().width / 100 + "px";
        this.selected.style.top = parseFloat(event.srcElement.style.top) * this.board.getBoundingClientRect().height / 100 + "px";
        this.selected.style.zIndex = "1";
        this.selected.style.transition = "none";

        if (isTouch) this.selected.style.transform = "scale(1.2)";

        this.board.style.cursor = "none";
        if (this.GetPieceColor({x:this.file0, y:this.rank0}) === this.game.activecolor)
            this.squares[this.file0][this.rank0].style.boxShadow = `inset rgba(192,192,192,.5) 0 0 0 ${this.board.getBoundingClientRect().width / 120}px`;

        this.ClearIndicators();

        this.legalMoves = this.GetPseudolegalMoves({ x: this.file0, y: this.rank0 });
        for (let i = 0; i < this.legalMoves.length; i++) {
            const indicator = document.createElement("div");
            indicator.classList = "chess-move-indicator";
            this.indicators.push(indicator);
            this.squares[this.legalMoves[i].x][this.legalMoves[i].y].appendChild(indicator);

            if (this.game.placement[this.legalMoves[i].x][this.legalMoves[i].y] !== null ||
                this.game.placement[this.file0][this.rank0].toLowerCase() === "p" && this.file0 !== this.legalMoves[i].x) {
                indicator.style.width  = "70%";
                indicator.style.height = "70%";
                indicator.style.margin = "15%";
                indicator.style.backgroundColor = "transparent";
                indicator.style.boxShadow = `rgb(192,192,192) 0 0 0 ${this.board.getBoundingClientRect().width / 100}px`;
            }
        }
    }

    Board_mousemove(event, isTouch) {
        if (event.buttons !== 1 && !isTouch) return;

        if (this.selected) {
            let x = isTouch ? this.selectedPosition.x + event.touches[0].clientX - this.x0 : this.selectedPosition.x + event.x - this.x0;
            let y = isTouch ? this.selectedPosition.y + event.touches[0].clientY -  this.board.getBoundingClientRect().height / 8 - this.y0 : this.selectedPosition.y + event.y - this.y0;

            x = Math.max(x, -this.board.getBoundingClientRect().width / 16);
            x = Math.min(x, this.board.getBoundingClientRect().width - this.board.getBoundingClientRect().height / 16);
            y = Math.max(y, -this.board.getBoundingClientRect().height / 16);
            y = Math.min(y, this.board.getBoundingClientRect().height - this.board.getBoundingClientRect().height / 16);

            this.selected.style.left = x + "px";
            this.selected.style.top = y + "px";
        }
    }

    Board_mouseup(event, isTouch) {
        if (this.selected) {
            let x = Math.min(Math.max(parseFloat(event.srcElement.style.left), 0), this.board.getBoundingClientRect().width);
            let y = Math.min(Math.max(parseFloat(event.srcElement.style.top), 0), this.board.getBoundingClientRect().height);
            
            let file1 = Math.round(x * 8 / this.board.getBoundingClientRect().width);
            let rank1 = Math.round(y * 8 / this.board.getBoundingClientRect().height);
            file1 = Math.max(0, Math.min(7, file1));
            rank1 = Math.max(0, Math.min(7, rank1));

            this.selected.style.transition = ".2s";
            this.selected.style.transform = "none";
            this.selected.style.zIndex = "0";

            this.board.style.cursor = "inherit";

            let isLegal = this.legalMoves.find(move => move.x === file1 && move.y === rank1);
            if (isLegal) {
                this.selected.style.left = file1 * 100 / 8 + "%";
                this.selected.style.top = rank1 * 100 / 8 + "%";

                this.MovePiece({ x: this.file0, y: this.rank0 }, { x: file1, y: rank1 });

            } else { //undo
                this.selected.style.left = this.file0 * 100 / 8 + "%";
                this.selected.style.top = this.rank0 * 100 / 8 + "%";
                //this.sounds.illegal.play();
            }
            
            if (this.GetPieceColor({x:this.file0, y:this.rank0}) === this.game.activecolor)
                this.squares[this.file0][this.rank0].style.boxShadow = "none";

            this.legalMoves = [];
        }

        this.selected = null;
        this.ClearIndicators();
    }

    Board_mouseleave(event, isTouch) {
        if (!this.selected) return;

        this.selected.style.transition = ".2s";
        this.selected.style.left = this.selectedPosition.x * 100 / this.board.getBoundingClientRect().width + "%";
        this.selected.style.top = this.selectedPosition.y * 100 / this.board.getBoundingClientRect().height + "%";
        this.selected.style.transform = "none";
        this.selected.style.zIndex = "0";
        this.selected.style.cursor = "inherit";
        this.selected = null;

        if (this.GetPieceColor({x:this.file0, y:this.rank0}) === this.game.activecolor)
            this.squares[this.file0][this.rank0].style.boxShadow = "none";

        this.board.style.cursor = "inherit";

        this.legalMoves = [];
        this.ClearIndicators();
    }

}