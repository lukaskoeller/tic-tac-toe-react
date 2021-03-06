import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="game__square" onClick={ props.onClick }>
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
                key={i}
            />
        );
    }

    renderAllSquares() {
        var allSquares = [];
        for (let i = 0; i <= 8; i++) {
            allSquares.push(this.renderSquare(i));
        }
        return allSquares;
    }

    render() {
        return (
        <div className="game__board-component">
            {this.renderAllSquares()}
        </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                { squares: Array(9).fill(null) },
            ],
            stepNumber: 0,
            maxStep: 0,
            xIsNext: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({ 
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            maxStep: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            maxStep: step >= this.state.maxStep ? step : this.state.maxStep,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                `Go to move #${move}` :
                'Go to game start';
            return (
                <option key={move} value={move}>
                    {desc}
                </option>
            )
        })

        let status;
        if(winner) {
            status = `Winner is: ${winner}`
        } else if (!winner && this.state.stepNumber === 9) { 
            status = 'It\'s a draw!'; 
        } else {
            status = `Next Player: ${this.state.xIsNext ? 'X' : 'O'}`;
        }

        return (
        <div>
            <h1 className="title">Tic Tac Toe</h1>
            <div className="game">
                <div className="game__board">
                <Board
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                />
                </div>
                <div className="game-info">
                    <div className="game-info__box">
                        <label className="label">Status</label>
                        {status}
                    </div>
                    <div className="game-info__box">
                        <label className="label">Protocol</label>
                        <select onChange={(e) => this.jumpTo(parseInt(e.target.value))} value={this.state.stepNumber}>{moves}</select>
                    </div>
                    <div className="game-info__box">
                        <label className="label">Time Machine</label>
                        <input type="range" disabled={!(this.state.stepNumber)} step="1" min="0" max={this.state.maxStep} value={this.state.stepNumber} onChange={e => this.jumpTo(parseInt(e.target.value))}></input>
                    </div>
                    <div className="game-info__box">
                        <label className="label">Current Step</label>
                        {this.state.stepNumber ? `Step #${this.state.stepNumber}` : 'Start'}
                    </div>
                    <div className="game-info__box game-info__box--btn" onClick={() => this.jumpTo(0)}>New Game</div>
                </div>
            </div>
        </div>
        );
    }
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
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
        
    }
    return null
}

// ========================================

Square.propTypes = {
    onClick: PropTypes.func,
    value: PropTypes.string,
};

Board.propTypes = {
    squares: PropTypes.array,
    onClick: PropTypes.func,
};

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
    