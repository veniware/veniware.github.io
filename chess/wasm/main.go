package main

import (
	"errors"
	"strconv"
	"strings"
	"syscall/js"
)

type Game struct {
	placement [8][8]byte
	color     byte
	castling  string
	enpassant string
	halfmove  string
	fullmove  string
}

type Position struct {
	x, y byte
}

type Move struct {
	p0, p1 Position
}

func main() {
	c := make(chan struct{}, 0)
	js.Global().Set("calc", js.FuncOf(calculate))
	<-c
}

/*
	00000001 : p
	00000010 : n
	00000100 : b
	00001000 : r
	00010000 : q
	00100000 : k

	00xxxxxx : b
	01xxxxxx : w
*/

func loadFen(fen *string) (Game, error) {
	var placement [8][8]byte
	var color byte
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

		var bTarget byte

		switch target {
		case "p":
			bTarget = 1 //00000001
		case "n":
			bTarget = 2 //00000010
		case "b":
			bTarget = 4 //00000100
		case "r":
			bTarget = 8 //00001000
		case "q":
			bTarget = 16 //00010000
		case "k":
			bTarget = 32 //00100000

		case "P":
			bTarget = 65 //01000001
		case "N":
			bTarget = 66 //01000010
		case "B":
			bTarget = 68 //01000100
		case "R":
			bTarget = 72 //01001000
		case "Q":
			bTarget = 80 //01010000
		case "K":
			bTarget = 96 //01100000
		}

		placement[pos_x][pos_y] = bTarget
		pos_x++
	}

	if array[1] == "w" {
		color = 1
	} else {
		color = 0
	}

	castling = array[2]
	enpassant = array[3]
	halfmove = array[4]
	fullmove = array[5]

	return Game{placement, color, castling, enpassant, halfmove, fullmove}, nil
}

func calculate(this js.Value, i []js.Value) interface{} {
	var fen string = i[0].String()
	var depth int = i[1].Int()

	game, err := loadFen(&fen)

	if err != nil {
		return err.Error()
	}

	//TODO:

	println(game.color)
	println(depth)

	return nil
}

func peudolegalMoves() []Move {
	var v Move
	v.p0 = Position{x: 0, y: 0}
	v.p1 = Position{x: 0, y: 0}

	var x []Move
	x = append(x, v)

	return x
}

func legalMoves() []Move {
	return nil
}

func evaluate(g *Game) int {
	return 0
}
