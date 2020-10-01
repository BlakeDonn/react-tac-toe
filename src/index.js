// @format
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}
class Game extends React.Component{  
    constructor(props) {  
        super(props);
        this.state = {  //original state as far as I can tell
            history: [
                {
                    squares: Array(9).fill(null),
                    placement: Array(9).fill(null),
                },
            ],
            stepNumber: 0,
            xIsNext: true,
        };
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({        
            history: history.concat([   //rewriting history
                {
                    squares: squares,
                    placement: determineLocation(i),
                    active: false,
                },
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            boardLocation: i,
        });
    }
    jumpTo(step) {      //adjusting stepNumber and xIsNext
        this.state.history.forEach(x => x.active ? x.active = false : null)
        this.state.history[step].active = !this.state.history[step].active
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0,
        });
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const desc = move ? "Go to move #" + move + ` ${this.state.history[move].placement}`: "Go to game start";
            console.log(this.state.history[move].active)
            const target = this.state.history[move].active ? <b>{desc}</b> : desc;
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{target}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}
function determineLocation(spot){
    let column = spot < 3 ? 1 : spot < 6 ? 2 : 3 ;
    let row = spot % 3 === 0 ? 1 : [1,4,7].includes(spot) ? 2 : 3;
    return `column ${column} row ${row}`
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return squares[a];
        }
    }
    return null;
}
// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
