package main

import (
	"errors"
	"strconv"
	"strings"
	"syscall/js"
)

type game struct {
	placement [][]string
	color     byte
	castling  string
	enpassant string
	halfmove  string
	fullmove  string
}

func main() {
	c := make(chan struct{}, 0)
	js.Global().Set("calc", js.FuncOf(calculate))
	<-c
}

func loadFen(fen string) (game, error) {
	var placement [][]string
	var color byte
	var castling string
	var enpassant string
	var halfmove string
	var fullmove string

	var array []string = strings.Split(fen, " ")

	if len(array) < 4 {
		return game{}, errors.New("invalid fen")
	}

	placement = make([][]string, 8)
	for i := 0; i < 8; i++ {
		placement[i] = make([]string, 8)
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

		placement[pos_x][pos_y] = target
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

	return game{placement, color, castling, enpassant, halfmove, fullmove}, nil
}

func calculate(this js.Value, i []js.Value) interface{} {
	var fen string = i[0].String()
	var depth int = i[1].Int()

	game, err := loadFen(fen)

	if err != nil {
		return err.Error()
	}

	//TODO:

	println(game.color)
	println(depth)

	return nil
}

func evaluate(g game) int {
	return 0
}
