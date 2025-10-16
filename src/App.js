import { useState ,useEffect} from 'react';

function Square({ value, onSquareClick , isDisabled}) {
  let classColor='';
  if(value=== 'X'){
    classColor='red'
  }else{
    classColor='blue'
  }
  return (
    
    <button className="square" style={{ color: classColor }}  onClick={onSquareClick} disabled={isDisabled} >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay ,isGameActive,setIsActive}) {
  
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);

  //a partir del segundo renderizado, el useeffect comparará el valor del campo winner con el del renderizado anterior.
  //Si hubo modificación, es decir que se ha determinado un ganador, por lo que se setea el estado isactive a false
  useEffect(() => {
        if (winner) {
            setIsActive(false); 
            setTimeout(() => {
                alert(`¡El juego ha terminado! El ganador es: ${winner}`);
            }, 0); 
        }
    }, [winner]); 

  let status;
  if (winner) {
    status = 'Ganador: ' + winner;
  } else {
    status = 'Siguiente jugador: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} isDisabled={!isGameActive} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} isDisabled={!isGameActive} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} isDisabled={!isGameActive} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} isDisabled={!isGameActive} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} isDisabled={!isGameActive} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} isDisabled={!isGameActive} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} isDisabled={!isGameActive} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} isDisabled={!isGameActive} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} isDisabled={!isGameActive} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const [time, setTime] = useState(120); 
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    
    console.log(time)
    if (!isActive || time === 0) {
      return;
    } 

    const intervalId = setInterval(() => {

        setTime(prevTime => prevTime - 1); 
      }, 1000);
      console.log(intervalId);
      // FUNCIÓN DE LIMPIEZA: Detiene el setInterval
      // Se ejecuta SOLAMENTE cuando [isActive] cambia de true a false (pausa/fin) 
      // o cuando el componente se desmonta.
      return () => clearInterval(intervalId);
    
  }, [isActive]);


  useEffect(() => {
      if (time === 0 && isActive) {
          setIsActive(false); 

      }
  }, [time, isActive]);

  const resetTime = () => {
    setTime(120);
    setIsActive(false);
    jumpTo(0);
    setHistory([Array(9).fill(null)]);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }


  const moves = history.map((squares, move) => {
    let description;
    let buttonClass = ""
    if (move > 0) {
      description = 'Ir al movimiento #' + move;
      buttonClass = "btn btn-secondary"

    } else {
      description = 'Ir al inicio del juego';
      buttonClass = "btn btn-primary"

    }
  return(
    <li key={move} className="mb-2">
      <button onClick={() => jumpTo(move)} className={buttonClass}>
        {description}
      </button>
    </li>
  );
    
  });

  return (
    <div className="game">
      <div className="game-state mb-4">
        <span className="h4 text-center">Tiempo de juego: </span>
        <span id="timer" className="h3 text-danger text-center mt-3">{formatTime(time)}</span>
        
      </div>
      <div className="game-wrapper d-flex">
        <div className="game-board mt-2">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} isGameActive={isActive} setIsActive={setIsActive}/>
        </div>
        <div className="game-info">
          <ol className='mt-4'>{moves}</ol>
        </div>
      </div>
       <div className="game-controls mt-5 ">
          <button className="btn btn-success" onClick={() => setIsActive(true)}> Iniciar/Reanudar</button>
          <button className="btn btn-success" onClick={() => setIsActive(false)}>Pausar</button>
          <button className="btn btn-success" onClick={() => resetTime()}>Reiniciar</button>
        </div>
    </div>
  );
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
