package main

import (
	"errors"
	"math"
	"strconv"
	"strings"
	"syscall/js"
)

type Game struct {
	placement [8][8]Piece
	color     bool
	castling  string
	enpassant string
	halfmove  string
	fullmove  string
}

type Piece struct {
	piece byte
	color bool
}

type Position struct {
	x, y int
}

type Move struct {
	p0, p1 Position
}

func main() {
	c := make(chan struct{}, 0)
	js.Global().Set("calc", js.FuncOf(calc))
	<-c
}

func loadFen(fen *string) (Game, error) {
	var placement [8][8]Piece
	var color bool
	var castling string
	var enpassant string
	var halfmove string
	var fullmove string

	var array []string = strings.Split(*fen, " ")

	if len(array) < 4 {
		return Game{}, errors.New("invalid fen")
	}

	var pos_x int = 0
	var pos_y int = 0

	for i := 0; i < len(array[0]); i++ {
		var target string = string(array[0][i])

		if target == "/" {
			pos_x = 0
			pos_y++
			continue
		}

		if v, err := strconv.Atoi(target); err == nil { //is a number
			pos_x += v
			continue
		}

		switch target {
		case "p":
			placement[pos_x][pos_y] = Piece{piece: 0b00000001, color: false}
		case "n":
			placement[pos_x][pos_y] = Piece{piece: 0b00000010, color: false}
		case "b":
			placement[pos_x][pos_y] = Piece{piece: 0b00000100, color: false}
		case "r":
			placement[pos_x][pos_y] = Piece{piece: 0b00001000, color: false}
		case "q":
			placement[pos_x][pos_y] = Piece{piece: 0b00010000, color: false}
		case "k":
			placement[pos_x][pos_y] = Piece{piece: 0b00100000, color: false}

		case "P":
			placement[pos_x][pos_y] = Piece{piece: 0b00000001, color: true}
		case "N":
			placement[pos_x][pos_y] = Piece{piece: 0b00000010, color: true}
		case "B":
			placement[pos_x][pos_y] = Piece{piece: 0b00000100, color: true}
		case "R":
			placement[pos_x][pos_y] = Piece{piece: 0b00001000, color: true}
		case "Q":
			placement[pos_x][pos_y] = Piece{piece: 0b00010000, color: true}
		case "K":
			placement[pos_x][pos_y] = Piece{piece: 0b00100000, color: true}
		}

		pos_x++
	}

	if array[1] == "w" {
		color = true
	} else {
		color = false
	}

	castling = array[2]
	enpassant = array[3]
	halfmove = array[4]
	fullmove = array[5]

	return Game{placement, color, castling, enpassant, halfmove, fullmove}, nil
}

func pawnMoves(game *Game, color bool, p *Position) []Move {
	var moves []Move

	if game.placement[p.x][p.y].color { //white

		if game.placement[p.x][p.y-1].piece == 0 { //1 squares forward
			moves = append(moves, Move{Position{p.x, p.y}, Position{p.x, p.y - 1}})
		}

		if p.y == 6 && //2 squares forward
			game.placement[p.x][p.y-2].piece == 0 && game.placement[p.x][p.y-1].piece == 0 {
			moves = append(moves, Move{Position{p.x, p.y}, Position{p.x, p.y - 2}})
		}

		if p.x > 0 && //capture left
			game.placement[p.x-1][p.y-1].piece != 0 &&
			game.placement[p.x-1][p.y-1].color != color {
			moves = append(moves, Move{Position{p.x, p.y}, Position{p.x - 1, p.y - 1}})
		}

		if p.x < 7 && //capture right
			game.placement[p.x+1][p.y-1].piece != 0 &&
			game.placement[p.x+1][p.y-1].color != color {
			moves = append(moves, Move{Position{p.x, p.y}, Position{p.x + 1, p.y - 1}})
		}

		if game.enpassant != "-" { //enpassant
			var enpassant_x int = int(byte(game.enpassant[0]) - 97)
			var enpassant_y int = int(8 - byte(game.enpassant[1]))
			if enpassant_y == p.y && math.Abs(float64(enpassant_x-p.x)) == 1 {
				moves = append(moves, Move{Position{p.x, p.y}, Position{enpassant_x, enpassant_y - 1}})
			}
		}

	} else { //black

		if game.placement[p.x][p.y+1].piece == 0 { //1 squares forward
			moves = append(moves, Move{Position{p.x, p.y}, Position{p.x, p.y + 1}})
		}

		if p.y == 1 && //2 squares forward
			game.placement[p.x][p.y+2].piece == 0 && game.placement[p.x][p.y+1].piece == 0 {
			moves = append(moves, Move{Position{p.x, p.y}, Position{p.x, p.y + 2}})
		}

		if p.x > 0 && //capture left
			game.placement[p.x-1][p.y+1].piece != 0 &&
			game.placement[p.x-1][p.y+1].color != color {
			moves = append(moves, Move{Position{p.x, p.y}, Position{p.x - 1, p.y + 1}})
		}

		if p.x < 7 && //capture right
			game.placement[p.x+1][p.y+1].piece != 0 &&
			game.placement[p.x+1][p.y+1].color != color {
			moves = append(moves, Move{Position{p.x, p.y}, Position{p.x + 1, p.y + 1}})
		}

		if game.enpassant != "-" { //enpassant
			var enpassant_x int = int(byte(game.enpassant[0]) - 97)
			var enpassant_y int = 8 - int(game.enpassant[1])
			if enpassant_y == p.y && math.Abs(float64(enpassant_x-p.x)) == 1 {
				moves = append(moves, Move{Position{p.x, p.y}, Position{enpassant_x, enpassant_y + 1}})
			}
		}
	}

	return moves
}

func knightMoves(game *Game, color bool, p *Position) []Move {
	var moves []Move

	var offsets [8][2]int = [8][2]int{
		{-2, -1},
		{-2, 1},
		{-1, -2},
		{-1, 2},
		{1, -2},
		{1, 2},
		{2, -1},
		{2, 1},
	}

	for _, offset := range offsets {
		var x int = p.x + offset[0]
		var y int = p.y + offset[1]

		if (x < 0 || x > 7) || (y < 0 || y > 7) {
			continue
		}

		if game.placement[x][y].piece != 0 && game.placement[x][y].color == color {
			continue
		}

		moves = append(moves, Move{Position{p.x, p.y}, Position{x, y}})
	}

	return moves
}

func bishopMoves(game *Game, color bool, p *Position) []Move {
	var moves []Move

	for i := 1; i < 8; i++ {
		var x int = p.x - i
		var y int = p.y - i

		if x < 0 || y < 0 {
			break
		}
		if game.placement[x][y].piece != 0 && game.placement[x][y].color == color {
			break
		}
		moves = append(moves, Move{Position{p.x, p.y}, Position{x, y}})
		if game.placement[x][y].piece != 0 && game.placement[x][y].color != color {
			break
		}
	}

	for i := 1; i < 8; i++ {
		var x int = p.x - i
		var y int = p.y + i
		if x < 0 || y > 7 {
			break
		}
		if game.placement[x][y].piece != 0 && game.placement[x][y].color == color {
			break
		}
		moves = append(moves, Move{Position{p.x, p.y}, Position{x, y}})
		if game.placement[x][y].piece != 0 && game.placement[x][y].color != color {
			break
		}
	}

	for i := 1; i < 8; i++ {
		var x int = p.x + i
		var y int = p.y - i
		if x > 7 || y < 0 {
			break
		}
		if game.placement[x][y].piece != 0 && game.placement[x][y].color == color {
			break
		}
		moves = append(moves, Move{Position{p.x, p.y}, Position{x, y}})
		if game.placement[x][y].piece != 0 && game.placement[x][y].color != color {
			break
		}
	}

	for i := 1; i < 8; i++ {
		var x int = p.x + i
		var y int = p.y + i
		if x > 7 || y > 7 {
			break
		}
		if game.placement[x][y].piece != 0 && game.placement[x][y].color == color {
			break
		}
		moves = append(moves, Move{Position{p.x, p.y}, Position{x, y}})
		if game.placement[x][y].piece != 0 && game.placement[x][y].color != color {
			break
		}
	}

	return moves
}

func rockMoves(game *Game, color bool, p *Position) []Move {
	var moves []Move

	for i := int(p.x) - 1; i > -1; i-- {
		if game.placement[i][p.y].piece != 0 && game.placement[i][p.y].color == color {
			break
		}
		moves = append(moves, Move{Position{p.x, p.y}, Position{i, p.y}})
		if game.placement[i][p.y].piece != 0 && game.placement[i][p.y].color != color {
			break
		}
	}

	for i := int(p.x) + 1; i < 8; i++ {
		if game.placement[i][p.y].piece != 0 && game.placement[i][p.y].color == color {
			break
		}
		moves = append(moves, Move{Position{p.x, p.y}, Position{i, p.y}})
		if game.placement[i][p.y].piece != 0 && game.placement[i][p.y].color != color {
			break
		}
	}

	for i := int(p.y) - 1; i > -1; i-- {
		if game.placement[p.x][i].piece != 0 && game.placement[p.x][i].color == color {
			break
		}
		moves = append(moves, Move{Position{p.x, p.y}, Position{p.x, i}})
		if game.placement[p.x][i].piece != 0 && game.placement[p.x][i].color != color {
			break
		}
	}

	for i := int(p.y) + 1; i < 8; i++ {
		if game.placement[p.x][i].piece != 0 && game.placement[p.x][i].color == color {
			break
		}
		moves = append(moves, Move{Position{p.x, p.y}, Position{p.x, i}})
		if game.placement[p.x][i].piece != 0 && game.placement[p.x][i].color != color {
			break
		}
	}

	return moves
}

func kingMoves(game *Game, color bool, p *Position) []Move {
	var moves []Move

	var offset [8][2]int = [8][2]int{
		{-1, -1}, {0, -1}, {1, -1},
		{-1, 0}, {1, 0},
		{-1, 1}, {0, 1}, {1, 1},
	}

	for i := 0; i < 8; i++ {
		var x int = p.x + offset[i][0]
		var y int = p.y + offset[i][1]

		if x < 0 || x > 7 || y < 0 || y > 7 {
			continue
		}
		if game.placement[x][y].piece != 0 && game.placement[x][y].color == color {
			continue
		}
		moves = append(moves, Move{Position{p.x, p.y}, Position{x, y}})
	}

	if color { //white king
		if strings.Index(game.castling, "Q") > -1 &&
			game.placement[0][7].piece == 0b00001000 && game.placement[0][7].color &&
			game.placement[1][7].piece == 0 &&
			game.placement[2][7].piece == 0 &&
			game.placement[3][7].piece == 0 { //white queenside castling
			moves = append(moves, Move{Position{p.x, p.y}, Position{1, p.y}})
		}

		if strings.Index(game.castling, "K") > -1 &&
			game.placement[7][7].piece == 0b00001000 && game.placement[7][7].color &&
			game.placement[5][7].piece == 0 &&
			game.placement[6][7].piece == 0 { //white kingside castling
			moves = append(moves, Move{Position{p.x, p.y}, Position{6, p.y}})
		}

	} else { //black king
		if strings.Index(game.castling, "q") > -1 &&
			game.placement[0][0].piece == 0b00001000 && !game.placement[0][7].color &&
			game.placement[1][0].piece == 0 &&
			game.placement[2][0].piece == 0 &&
			game.placement[3][0].piece == 0 { //black queenside castling
			moves = append(moves, Move{Position{p.x, p.y}, Position{1, p.y}})
		}

		if strings.Index(game.castling, "k") > -1 &&
			game.placement[7][0].piece == 0b00001000 && !game.placement[7][7].color &&
			game.placement[5][0].piece == 0 &&
			game.placement[6][0].piece == 0 { //black kingside castling
			moves = append(moves, Move{Position{p.x, p.y}, Position{6, p.y}})
		}
	}

	return moves
}

func getPieces(game *Game, color bool) []Position {
	var pieces []Position

	if color { //white
		for y := 0; y < 8; y++ {
			for x := 0; x < 8; x++ {
				if game.placement[x][y].color {
					pieces = append(pieces, Position{x: x, y: y})
				}
			}
		}
	} else { //black
		for y := 0; y < 8; y++ {
			for x := 0; x < 8; x++ {
				if !game.placement[x][y].color {
					pieces = append(pieces, Position{x: x, y: y})
				}
			}
		}
	}

	return pieces
}

func peudolegalMoves(game *Game, color bool) []Move {
	var pieces []Position = getPieces(game, color)

	var moves []Move

	for i := 0; i < len(pieces); i++ {
		var piece Piece = game.placement[pieces[i].x][pieces[i].y]

		switch piece.piece {
		case 0b00000001: //p
			var tmp []Move = pawnMoves(game, piece.color, &pieces[i])
			moves = append(moves, tmp...)

		case 0b00000010: //n
			var tmp []Move = knightMoves(game, piece.color, &pieces[i])
			moves = append(moves, tmp...)

		case 0b00000100: //b
			var tmp []Move = bishopMoves(game, piece.color, &pieces[i])
			moves = append(moves, tmp...)

		case 0b00001000: //r
			var tmp []Move = rockMoves(game, piece.color, &pieces[i])
			moves = append(moves, tmp...)

		case 0b00010000: //q
			var tmp []Move = bishopMoves(game, piece.color, &pieces[i])
			moves = append(moves, tmp...)

			tmp = rockMoves(game, piece.color, &pieces[i])
			moves = append(moves, tmp...)

		case 0b00100000: //k
			var tmp []Move = kingMoves(game, piece.color, &pieces[i])
			moves = append(moves, tmp...)
		}
	}

	return moves
}

func legalMoves(game *Game, color bool) []Move {
	var pseudolegal []Move = peudolegalMoves(game, color)
	var moves []Move

	for i := 0; i < len(pseudolegal); i++ {
		var temp Game = makeMove(*game, pseudolegal[i])
		if !inCheck(temp, color) {
			moves = append(moves, pseudolegal[i])
		}
	}

	//TODO:
	return moves
}

func makeMove(game Game, move Move) Game {
	//TODO: en passant
	//TODO: castling
	//TODO: ...

	if game.placement[move.p0.x][move.p0.y].piece == 0b00000001 && math.Abs(float64(move.p0.y-move.p1.y)) == 2 { //en passant flag
		game.enpassant = string([]byte{97 + byte(move.p1.x), 8 - byte(move.p1.y)})
	} else {
		game.enpassant = "-"
	}

	if game.placement[move.p0.x][move.p0.y].piece == 0b00000001 && move.p0.x != move.p1.x && game.placement[move.p1.x][move.p1.y].piece == 0 { //en passant
		game.placement[move.p1.x][move.p0.y] = Piece{0, false}
	}

	//castling flags
	if game.placement[move.p0.x][move.p0.y].piece == 0b00100000 { //king
		if game.placement[move.p0.x][move.p0.y].color { //white king
			game.castling = strings.Replace(game.castling, "K", "", 1)
			game.castling = strings.Replace(game.castling, "R", "", 1)
		} else { //black king
			game.castling = strings.Replace(game.castling, "k", "", 1)
			game.castling = strings.Replace(game.castling, "r", "", 1)
		}
	}
	if game.placement[move.p0.x][move.p0.y].piece == 0b00001000 { //rock
		if game.placement[move.p0.x][move.p0.y].color { //white rock
			if move.p0.x == 0 && move.p0.y == 7 { //queenside
				game.castling = strings.Replace(game.castling, "Q", "", 1)
			}
			if move.p0.x == 7 && move.p0.y == 7 { //kingside
				game.castling = strings.Replace(game.castling, "K", "", 1)
			}
		} else { //black rock
			if move.p0.x == 0 && move.p0.y == 0 { //queenside
				game.castling = strings.Replace(game.castling, "q", "", 1)
			}
			if move.p0.x == 7 && move.p0.y == 0 { //kingside
				game.castling = strings.Replace(game.castling, "k", "", 1)
			}
		}
	}
	if len(game.castling) == 0 {
		game.castling = "-"
	}

	//castling
	if game.placement[move.p0.x][move.p0.y].piece == 0b00100000 {
		if game.placement[move.p0.x][move.p0.y].color { //white king
			if int(move.p0.x)-int(move.p1.x) == 2 { //queenside
				game.placement[3][7] = Piece{0b00001000, true}
				game.placement[0][7] = Piece{0, false}
			} else if int(move.p0.x)-int(move.p1.x) == -2 { //kingside
				game.placement[5][7] = Piece{0b00001000, true}
				game.placement[7][7] = Piece{0, false}
			}

		} else { //black king
			if int(move.p0.x)-int(move.p1.x) == 2 { //queenside
				game.placement[3][0] = Piece{0b00001000, false}
				game.placement[0][0] = Piece{0, false}
			} else if int(move.p0.x)-int(move.p1.x) == -2 { //kingside
				game.placement[5][0] = Piece{0b00001000, false}
				game.placement[7][0] = Piece{0, false}
			}
		}
	}

	game.placement[move.p1.x][move.p1.y] = game.placement[move.p0.x][move.p0.y]
	game.placement[move.p0.x][move.p0.y] = Piece{0, false}

	//promote
	if game.placement[move.p1.x][move.p1.y].piece == 0b00000001 {
		if game.placement[move.p1.x][move.p1.y].color && move.p1.y == 0 { //white pawn
			game.placement[move.p1.x][move.p1.y].piece = 0b00010000
		} else if !game.placement[move.p1.x][move.p1.y].color && move.p1.y == 7 { //black pawn
			game.placement[move.p1.x][move.p1.y].piece = 0b00010000
		}
	}

	game.color = !game.color

	return game
}

func inCheck(game Game, color bool) bool {
	var kingsPosition Position
	for y := 0; y < 8; y++ { //find king
		for x := 0; x < 8; x++ {
			if game.placement[x][y].piece == 0b00100000 && game.placement[x][y].color == color {
				kingsPosition = Position{x, y}
				break
			}
		}
	}

	var pieces []Position = getPieces(&game, color)

	for i := 0; i < len(pieces); i++ {
		var piece Piece = game.placement[pieces[i].x][pieces[i].y]

		switch piece.piece {
		case 0b00000001: //p
			var moves []Move = pawnMoves(&game, piece.color, &pieces[i])
			for i := 0; i < len(moves); i++ {
				if moves[i].p1.x == kingsPosition.x && moves[i].p1.y == kingsPosition.y {
					return true
				}
			}

		case 0b00000010: //n
			var moves []Move = knightMoves(&game, piece.color, &pieces[i])
			for i := 0; i < len(moves); i++ {
				if moves[i].p1.x == kingsPosition.x && moves[i].p1.y == kingsPosition.y {
					return true
				}
			}

		case 0b00000100: //b
			var moves []Move = bishopMoves(&game, piece.color, &pieces[i])
			for i := 0; i < len(moves); i++ {
				if moves[i].p1.x == kingsPosition.x && moves[i].p1.y == kingsPosition.y {
					return true
				}
			}

		case 0b00001000: //r
			var moves []Move = rockMoves(&game, piece.color, &pieces[i])
			for i := 0; i < len(moves); i++ {
				if moves[i].p1.x == kingsPosition.x && moves[i].p1.y == kingsPosition.y {
					return true
				}
			}

		case 0b00010000: //q
			var moves []Move = bishopMoves(&game, piece.color, &pieces[i])
			for i := 0; i < len(moves); i++ {
				if moves[i].p1.x == kingsPosition.x && moves[i].p1.y == kingsPosition.y {
					return true
				}
			}

			moves = rockMoves(&game, piece.color, &pieces[i])
			for i := 0; i < len(moves); i++ {
				if moves[i].p1.x == kingsPosition.x && moves[i].p1.y == kingsPosition.y {
					return true
				}
			}

		case 0b00100000: //k
			var moves []Move = kingMoves(&game, piece.color, &pieces[i])
			for i := 0; i < len(moves); i++ {
				if moves[i].p1.x == kingsPosition.x && moves[i].p1.y == kingsPosition.y {
					return true
				}
			}
		}
	}

	return false
}

func evaluate(game *Game) int {
	var whitePieces []Position = getPieces(game, true)
	var blackPieces []Position = getPieces(game, false)

	var score int = 0

	for i := 0; i < len(whitePieces); i++ {
		switch game.placement[whitePieces[i].x][whitePieces[i].y].piece {
		case 0b00000001: //pawn
			score += 100
			break

		case 0b00000010: //night
			score += 300
			break

		case 0b00000100: //bishop
			score += 301
			break

		case 0b00001000: //rook
			score += 500
			break

		case 0b00010000: //queen
			score += 900
			break

			//case 0b00100000: //king
			//	score += 0
			//break
		}
	}

	for i := 0; i < len(blackPieces); i++ {
		switch game.placement[blackPieces[i].x][blackPieces[i].y].piece {
		case 0b00000001: //pawn
			score -= 100

		case 0b00000010: //night
			score -= 300
			break

		case 0b00000100: //bishop
			score -= 301
			break

		case 0b00001000: //rook
			score -= 500
			break

		case 0b00010000: //queen
			score -= 900
			break

			//case 0b00100000: //king
			//	score += 0
			//break
		}
	}

	var perspective int
	if game.color {
		perspective = 1
	} else {
		perspective = -1
	}

	//TODO:

	return score * perspective
}

func calculate(game *Game, depth int) (Move, int) {
	var bestMove Move = Move{}
	var bestScore int = math.MinInt32

	if depth == 0 {
		return bestMove, evaluate(game)
	}

	moves := legalMoves(game, game.color)

	for i := 0; i < len(moves); i++ {
		var next Game = makeMove(*game, moves[i])
		_, score := calculate(&next, depth-1)

		if score > bestScore {
			bestMove = moves[i]
			bestScore = score
		}
	}

	return bestMove, bestScore
}

func calc(this js.Value, i []js.Value) interface{} {
	var fen string = i[0].String()
	var depth int = i[1].Int()

	game, err := loadFen(&fen)

	if err != nil {
		return err.Error()
	}

	move, _ := calculate(&game, depth)
	return move
}
