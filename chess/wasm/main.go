package main

import (
	"syscall/js"
)

func main() {
	c := make(chan struct{}, 0)
	js.Global().Set("calc", js.FuncOf(calc))
	<-c
}

func calc(this js.Value, i []js.Value) interface{} {
	var fen string = i[0].String()

	game, err := loadFen(&fen)

	if err != nil {
		return err.Error()
	}

	var move Move = randomMove(&game)
	return move
}

/*
func main() {
	var initialPosition string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
	game, err := loadFen(&initialPosition)

	if err != nil {
		println(err.Error())
	}

	calculate(&game, Move{}, 5)
}
*/
