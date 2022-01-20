import { useState } from 'react';
import './App.css';

const positions = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
const hands = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suited = ['Suited', 'Off-suit'];

const getRandomItemFromList = (items) => items[Math.floor(Math.random() * items.length)];
const getRandomPosition = () => getRandomItemFromList(positions);
const getRandomHand = () => getRandomItemFromList(suited) + ' ' + getRandomItemFromList(hands) + ' and ' + getRandomItemFromList(hands);

export default function App() {
    return Game();
}

function Game() {
    const [gameState, setGameState] = useState({
        playerPosition: getRandomPosition(),
        hand: getRandomHand(),
        message: '',
        actionButtonsDisabled: false,
    });

    return (
        <div class="game">
            {console.log('message: ' + gameState.message + '; pos: ' + gameState.playerPosition + '; hand: ' + gameState.hand)}
            <h1> Welcome to Preflop Trainer v0.1.1! </h1>
            <p> Your position: {gameState.playerPosition} </p>
            <p> Your hand: <strong>{gameState.hand}</strong> </p>
            <p> Your Actions: </p>
            <div>
                <button disabled={gameState.actionButtonsDisabled} onClick={() => {
                    setGameState(
                        (currentState) => {
                            return {
                                playerPosition: currentState.playerPosition,
                                hand: currentState.hand,
                                message: 'Congrats! You won by calling! :)',
                                actionButtonsDisabled: true,
                            };
                        }
                    );
                }}>Call</button>
                <button disabled={gameState.actionButtonsDisabled} onClick={() => {
                    setGameState(
                        (currentState) => {
                            return {
                                playerPosition: currentState.playerPosition,
                                hand: currentState.hand,
                                message: 'Congrats! You won by folding! :)',
                                actionButtonsDisabled: true,
                            };
                        }
                    );
                }}>Fold</button>
                <button disabled={gameState.actionButtonsDisabled} onClick={() => {
                    setGameState(
                        (currentState) => {
                            return {
                                playerPosition: currentState.playerPosition,
                                hand: currentState.hand,
                                message: 'Congrats! You won by raising! :)',
                                actionButtonsDisabled: true,
                            };
                        }
                    );
                }}>Raise</button>
            </div>
            <div>
                <button onClick={() => {
                    setGameState({
                        playerPosition: getRandomPosition(),
                        hand: getRandomHand(),
                        message: '',
                    });
                }}>
                    Restart Game
                </button>
            </div>
            <div>
                <p> <strong>{gameState.message}</strong> </p>
            </div>
        </div>
    );
}
