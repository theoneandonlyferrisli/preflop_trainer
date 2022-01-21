import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Container } from '@mui/material';
import Fab from '@mui/material/Fab';
import { useState } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

import './App.css';

/* Roboto fonts */
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const positions = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
const hands = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suited = ['Suited', 'Off-suit'];

const getRandomItemFromList = (items) => items[Math.floor(Math.random() * items.length)];
const getRandomPosition = () => getRandomItemFromList(positions);
const getRandomHand = () => getRandomItemFromList(suited) + ' ' + getRandomItemFromList(hands) + ' and ' + getRandomItemFromList(hands);

export default function App() {
    return <Game />;
}

function Game() {
    const [gameState, setGameState] = useState({
        playerPosition: getRandomPosition(),
        hand: getRandomHand(),
        message: '',
        actionButtonsDisabled: false,
    });

    return (
        <Container className='game'>
            {console.log('message: ' + gameState.message + '; pos: ' + gameState.playerPosition + '; hand: ' + gameState.hand)}
            <h1> Welcome to Preflop Trainer v0.1.1! </h1>
            <p> Your position: <strong>{gameState.playerPosition}</strong> </p>
            <p> Your hand: <strong>{gameState.hand}</strong> </p>
            <p> Your Actions: </p>
            <Container>
                <ButtonGroup variant="outlined" aria-label="outlined button group">
                    <Button variant='outlined' size='large' disabled={gameState.actionButtonsDisabled} onClick={() => {
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
                    }}>Call</Button>
                    <Button variant='outlined' size='large' disabled={gameState.actionButtonsDisabled} onClick={() => {
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
                    }}>Fold</Button>
                    <RaiseAction
                        betSizes={['3BB', '6BB', '9BB', 'All-in']}
                        isDisabled={gameState.actionButtonsDisabled}
                        gameStateSetter={setGameState}
                    />
                    {/*<Button variant='outlined' size='large' disabled={gameState.actionButtonsDisabled} onClick={() => {
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
                    }}>Raise</Button>*/}
                </ButtonGroup>
            </Container>
            <br />
            <br />
            <Container>
                <Fab variant='extended' size='large' color='primary' onClick={() => {
                    setGameState({
                        playerPosition: getRandomPosition(),
                        hand: getRandomHand(),
                        message: '',
                    });
                }}>
                    Restart Game
                </Fab>
            </Container>
            <br />
            <br />
            <Container>
                <GameMessage message={gameState.message} />
            </Container>
        </Container>
    );
}

function GameMessage({message}) {
    console.log("Message received by GameMessage: " + message);
    if (message) {
        return (
            <Alert severity='success'>
                <strong>{message}</strong>
            </Alert>
        );
    } else {
        return <div></div>;
    }
}

function RaiseActionDialog(props) {
    const { onClose, selectedValue, open, betSizes } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Select a bet size:</DialogTitle>
            <List sx={{ pt: 0 }}>
                {betSizes.map((betSize) => (
                    <ListItem button onClick={() => handleListItemClick(betSize)} key={betSize}>
                        <ListItemText primary={betSize} />
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}

function RaiseAction({ betSizes, isDisabled, gameStateSetter }) {
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(betSizes[0]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
        gameStateSetter(
            (currentState) => {
                return {
                    playerPosition: currentState.playerPosition,
                    hand: currentState.hand,
                    message: 'Congrats! You won by raising ' + value + '! :)',
                    actionButtonsDisable: true,
                };
            }
        );
    };

    return (
        <div>
        {console.log('Raised by ' + selectedValue)}
        <Button variant='outlined' size='large' disabled={isDisabled} onClick={() => {
            handleClickOpen();
            gameStateSetter(
                (currentState) => {
                    return {
                        playerPosition: currentState.playerPosition,
                        hand: currentState.hand,
                        message: '',
                        actionButtonsDisabled: true,
                    };
                }
            );
        }}>Raise</Button>
        <RaiseActionDialog
            selectedValue={selectedValue}
            open={open}
            onClose={handleClose}
            betSizes={betSizes}
        />
        </div>
    );
}
