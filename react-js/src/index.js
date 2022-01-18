import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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
        {[0,3,6].map(elt => 
          <div key = {elt} className="board-row">
            {[0,1,2].map(elt1 => 
              <React.Fragment  key = {elt + elt1}>
                  {this.renderSquare(elt + elt1) } 
              </React.Fragment> )}
          </div>
        )}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        position: Array(2).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0,
      orderHistory: true,
    };
  }

  
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const position = getCoordinates(i);

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    
    this.setState({
      history: history.concat([{
        squares: squares,
        position: position,
      }]),
      stepNumber : history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step, 
      xIsNumber: (step % 2) === 0,
    })
  }

  switchHistoryOrder(){
    this.setState({
      orderHistory: !this.state.orderHistory
    })
  }


  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    
    const moves = history.map((step, move) => {
      const desc = move ? displayHistory(this.state.stepNumber, step, move) : 
      'Revenir au début de la partie';
      return (
        <li key={move}>
          <button onClick = {() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    let status
    if (winner) {
      status = winner + ' a gagné';
    } else {
      status = 'Prochain joueur : ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
          squares = {current.squares} 
          onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.switchHistoryOrder()}>Switch</button>
          <ol>{this.state.orderHistory ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function historySentence(step, move){
  return 'Revenir au tour n°' + move + ' à l\'emplacement joué ('+step.position[0]+','+step.position[1]+')';
}

function displayHistory(stepNumber, step, move){
  return  move === stepNumber ? <strong>{ historySentence(step,move)} </strong> : historySentence(step,move);
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
  return null;
}

function getCoordinates(index){
    if([0,1,2].includes(index)){
      return [index + 1, 1]
    }
    if([3,4,5].includes(index)){
      return [index - 2, 2]
    }
    if([6,7,8].includes(index)){
      return [index - 5, 3]
    }
}
