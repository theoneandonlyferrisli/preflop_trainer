import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Container } from '@mui/material';
import Fab from '@mui/material/Fab';
import React, { useState, useEffect } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import Typography from '@mui/material/Typography';

import './App.css';

/* Roboto fonts */
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

/* Icons */
import FolderIcon from '@mui/icons-material/Folder';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const positions = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
const hands = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const handsVal = {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14};
const suited = ['Suited', 'Off-suit'];
const suit_unicode_mapping = {'heart':'\u2665', 'diamond':'\u2666', 'club':'\u2663', 'spade':'\u2660'};
const suits = ['heart', 'diamond', 'club', 'spade'];

const getRandomItemFromList = (items) => items[Math.floor(Math.random() * items.length)];
const getRandomPosition = () => getRandomItemFromList(positions);
const getRandomHand = () => suit_unicode_mapping[getRandomItemFromList(suits)] + getRandomItemFromList(hands) + ' ' + suit_unicode_mapping[getRandomItemFromList(suits)] + getRandomItemFromList(hands);
const getHandAdviceKey = (handString) => {
    let hands = handString.split(' ');
    let suit1 = hands[0][0];
    let suit2 = hands[1][0];
    let hand1 = hands[0][1];
    let hand2 = hands[1][1];

    /*
    console.log('hand1: ' + hand1);
    console.log('hand2: ' + hand2);
    console.log('suit1: ' + suit1);
    console.log('suit2: ' + suit2);
    console.log('index 1 : ' + handsVal[hand1]);
    console.log('index 2 : ' + handsVal[hand2]);
    */

    if (handsVal[hand1] < handsVal[hand2]) {
        let tempHand = hand1;
        hand1 = hand2;
        hand2 = tempHand;

        let tempSuit = suit1;
        suit1 = suit2;
        suit2 = tempSuit;
    }

    if (hand1 === hand2) {
        return hand1 + hand2;
    } else if (suit1 === suit2) {
        return hand1 + hand2 + 's';
    } else {
        return hand1 + hand2 + 'o';
    }
};

export default function App() {

    return (
        <MainUiHolder />
    );
}

function MainUiHolder() {
    const [value, setValue] = useState(0);
    const [currentUI, setCurrentUI] = useState(<Game />);    // Default to game page

    useEffect(() => {
        if (value === 0) {
            setCurrentUI(<Game />);
            console.log("Set UI to <Game />!");
        } else if (value === 1) {
            setCurrentUI(<HistoricalTrends />);
            console.log("Set UI to Historical!");
        } else {
            setCurrentUI(<Settings />);
            console.log("Set UI to Settings!");
        }
    }, [value]);

    return (
        <Container className="game">
            <Typography gutterBottom variant='h2' component='div'>
                Welcome to Preflop Trainer v0.0.1! &hearts;&diams;&spades;&clubs;
            </Typography>
            <br />
            <br />
            {currentUI}
            <br />
            <br />
            <Box>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                }}>
                    <BottomNavigationAction label="Training" />
                    <BottomNavigationAction label="My Trends" />
                    <BottomNavigationAction label="Settings" />
                </BottomNavigation>
            </Box>
        </Container>
    );
}

function Game() {
    const [gameState, setGameState] = useState({
        playerPosition: getRandomPosition(),
        hand: getRandomHand(),
        message: '',
        actionButtonsDisabled: false,
    });

    const [advice, setAdvice] = useState({});

    useEffect(() => {
        const fetchAdviceFromFile = async () => {
            let response = await fetch('RFI_100bb.csv');
            let data = await response.text();
            let lines = data.split(/(?:\r\n|\n)+/);
            let res = {};

            for (let i = 1; i < lines.length; i++) {
                let line = lines[i];
                let tokens = line.split(',');
                let key = tokens[1];
                let attributes = {};

                attributes['marginal'] = tokens[3];
                attributes['UTG'] = tokens[7];
                attributes['HJ'] = tokens[8];
                attributes['CO'] = tokens[9];
                attributes['BTN'] = tokens[10];

                // BB SB default action: fold
                attributes['BB'] = 'CALL';
                attributes['SB'] = 'CALL';

                attributes['UTG_advice'] = tokens[11];
                attributes['HJ_advice'] = tokens[12];
                attributes['CO_advice'] = tokens[13];
                attributes['BTN_advice'] = tokens[14];

                // BB SB default advice: check
                attributes['BB_advice'] = 'Call (Check) since you are BB';
                attributes['SB_advice'] = 'Call (Check) since you are SB';

                res[key] = attributes;
            }

            setAdvice(res);
            console.log('Set advice state in Game');
        };

        // this will lead to synchronization issues if advice is referenced before parsing completes
        fetchAdviceFromFile();
    }, []);

    return (
        <Container className='game'>
            {console.log('message: ' + gameState.message + '; pos: ' + gameState.playerPosition + '; hand: ' + gameState.hand)}
            <Card sx={{ maxWidth:1500 }}>
                <CardMedia
                    component="img"
                    height="680"
                    image="fullring-table-poker-positions.png"
                    alt="poker-table"
                />
                <br />
                <Typography gutterBottom variant='h4' component='div'>
                    Your position: <strong>{gameState.playerPosition}</strong>
                </Typography>
                <br />
                <Typography gutterBottom variant='h4' component='div'>
                    Your hand: <strong>{gameState.hand}</strong> ({getHandAdviceKey(gameState.hand)})
                </Typography>
                <br />
                <Typography gutterBottom variant='h4' component='div'>
                    Your Actions:
                </Typography>
                <CardActions>
                    <Container>
                        <ButtonGroup variant="outlined" aria-label="outlined button group">
                            <Button variant='outlined' size='large' disabled={gameState.actionButtonsDisabled} onClick={() => {
                                setGameState(
                                    (currentState) => {
                                        let handAdviceKey = getHandAdviceKey(currentState.hand);
                                        let adviceAttributeKey = currentState.playerPosition + '_advice';
                                        let action = advice[handAdviceKey][currentState.playerPosition];
                                        let posAdvice = advice[handAdviceKey][adviceAttributeKey];

                                        return {
                                            playerPosition: currentState.playerPosition,
                                            hand: currentState.hand,
                                            message: 'Your action: CALL; Expected action: ' + action + '. ' + posAdvice,
                                            actionButtonsDisabled: true,
                                        };
                                    }
                                );
                            }}>Call</Button>
                            <Button variant='outlined' size='large' disabled={gameState.actionButtonsDisabled} onClick={() => {
                                setGameState(
                                    (currentState) => {
                                        let handAdviceKey = getHandAdviceKey(currentState.hand);
                                        let adviceAttributeKey = currentState.playerPosition + '_advice';
                                        let action = advice[handAdviceKey][currentState.playerPosition];
                                        let posAdvice = advice[handAdviceKey][adviceAttributeKey];

                                        return {
                                            playerPosition: currentState.playerPosition,
                                            hand: currentState.hand,
                                            message: 'Your action: FOLD; Expected action: ' + action + '. ' + posAdvice,
                                            actionButtonsDisabled: true,
                                        };
                                    }
                                );
                            }}>Fold</Button>
                            <RaiseAction
                                betSizes={['3BB', '6BB', '9BB', 'All-in']}
                                isDisabled={gameState.actionButtonsDisabled}
                                gameStateSetter={setGameState}
                                gameAdvice={advice}
                            />
                            <Button variant='outlined' size='large' disabled={gameState.actionButtonsDisabled} onClick={() => {
                                setGameState(
                                    (currentState) => {
                                        let handAdviceKey = getHandAdviceKey(currentState.hand);
                                        let adviceAttributeKey = currentState.playerPosition + '_advice';
                                        let action = advice[handAdviceKey][currentState.playerPosition];
                                        let posAdvice = advice[handAdviceKey][adviceAttributeKey];

                                        return {
                                            playerPosition: currentState.playerPosition,
                                            hand: currentState.hand,
                                            message: 'Your action: MIXED; Expected action: ' + action + '. ' + posAdvice,
                                            actionButtonsDisabled: true,
                                        };
                                    }
                                );
                            }}>Mixed</Button>
                        </ButtonGroup>
                    </Container>
                </CardActions>
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
            </Card>
            <br />
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
            /*return (
                <Alert severity='error'>
                    <strong>{message}</strong>
                </Alert>
            );*/
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

function RaiseAction({ betSizes, isDisabled, gameStateSetter, gameAdvice }) {
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
                let handAdviceKey = getHandAdviceKey(currentState.hand);
                let adviceAttributeKey = currentState.playerPosition + '_advice';
                let action = gameAdvice[handAdviceKey][currentState.playerPosition];
                let posAdvice = gameAdvice[handAdviceKey][adviceAttributeKey];

                return {
                    playerPosition: currentState.playerPosition,
                    hand: currentState.hand,
                    message: 'Your action: RAISE (' + value + '); Expected action: ' + action + '. ' + posAdvice,
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

function HistoricalTrends() {
    return (
        <Typography gutterBottom variant='h4' component='div'>
            {"This is user's historical trend data. Probably some fancy charts here."}
        </Typography>
    );
}

function Settings() {
    return (
        <Typography gutterBottom variant='h4' component='div'>
            {"This is the app setting page where the user will be able to configure how they'd like to play the game."}
        </Typography>
    );
}

async function ReadAdviceFromFile(filePath) {
    let response = await fetch('RFI_100bb.csv');
    let data = await response.text();

    return data;
}
