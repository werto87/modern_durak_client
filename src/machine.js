import { createMachine, assign } from 'xstate';
import Login from './Login/Login.svelte'
import Lobby from './Lobby/Lobby.svelte'
import Game from './Game/Game.svelte'
import CreateAccount from './CreateAccount/CreateAccount.svelte'
import CreateGame from './CreateGame/CreateGame.svelte'
import RelogTo from './PopUp/RelogTo.svelte'
import WantToTakeCards from './PopUp/WantToTakeCards.svelte'
import PopUp from './PopUp/PopUp.svelte'


export const toggleMachine = createMachine({
    id: 'toggle',
    type: 'parallel',
    context: {
        component: Login,
        popUp: null,
        props: {},
        errors: [],
        accountName: null
    },
    states: {
        Screens: {
            initial: "Login",
            states: {
                Login: {
                    on: {
                        Lobby: "Lobby",
                        LoginAccountSuccess: {
                            actions: [
                                (context, event) => {
                                    context.accountName = event.accountName;
                                }
                            ],
                            target: "Lobby"
                        },
                        RelogToCreateGameLobbySuccess: "CreateGame",
                        RelogToGameSuccess: "Game",
                        CreateAccount: "CreateAccount",
                        WantToRelog: {
                            actions: [
                                (context, event) => {
                                    context.popUpProps = { destination: event.destination };
                                    context.popUp = RelogTo;
                                    context.errors = [];
                                    context.accountName = event.accountName;
                                }
                            ],
                        }
                    },
                    entry: assign(
                        {
                            component: (ctx) => ctx.component = Login,
                            popUp: (ctx) => ctx.popUp = null,
                            props: (ctx) => ctx.props = {},
                            errors: (ctx) => ctx.errors = [],
                            popUpProps: (ctx) => ctx.popUpProps = {}

                        }
                    ),
                },
                CreateAccount: {
                    on: { Login: "Login", LoginAccountSuccess: "Lobby" },
                    entry: assign(
                        {
                            component: (ctx) => ctx.component = CreateAccount,
                            popUp: (ctx) => ctx.popUp = null,
                            props: (ctx) => ctx.props = {},
                            errors: (ctx) => ctx.errors = [],
                            popUpProps: (ctx) => ctx.popUpProps = {}
                        }
                    ),
                },
                Lobby: {
                    on: {
                        LogoutAccountSuccess: {
                            target: "Login",
                            actions: [
                                (context) => {
                                    context.accountName = null;
                                }
                            ],
                        },
                        JoinGameLobbySuccess: "CreateGame"
                    },
                    entry: assign(
                        {
                            component: (ctx) => ctx.component = Lobby,
                            popUp: (ctx) => ctx.popUp = null,
                            props: (ctx) => ctx.props = {},
                            errors: (ctx) => ctx.errors = [],
                            popUpProps: (ctx) => ctx.popUpProps = {}
                        }
                    ),
                },
                CreateGame: {
                    on: {
                        StartGame: "Game", LeaveGameLobbySuccess: "Lobby",
                        UsersInGameLobby: {
                            actions: [
                                (context, event) => {
                                    const users = [];
                                    event.users.forEach(element => {
                                        users.push(element.UserInGameLobby.accountName);
                                    });
                                    context.props[event.type] = event;
                                    context.props["isCreateGameLobbyAdmin"] = users[0] == context.accountName;
                                }
                            ],
                        },
                        MaxUserSizeInCreateGameLobby: {
                            actions: [
                                (context, event) => {
                                    context.props.UsersInGameLobby["maxUserSize"] = event.maxUserSize
                                }
                            ],
                        },
                        MaxCardValueInCreateGameLobby: {
                            actions: [
                                (context, event) => {
                                    context.props.UsersInGameLobby.durakGameOption["maxCardValue"] = event.maxCardValue
                                }
                            ],
                        },
                        SetTimerOption: {
                            actions: [
                                (context, event) => {
                                    if (event.timerType == "resetTimeOnNewRound") {
                                        context.props["selected"] = 1;
                                    } else if (event.timerType == "addTimeOnNewRound") {
                                        context.props["selected"] = 2;
                                    } else {
                                        context.props["selected"] = 0;
                                    }
                                    context.props[event.type] = event;
                                }
                            ],
                        },
                    },
                    entry: assign(
                        {
                            component: (ctx) => ctx.component = CreateGame,
                            popUp: (ctx) => ctx.popUp = null,
                            props: (ctx) => ctx.props = {},
                            errors: (ctx) => ctx.errors = [],
                            popUpProps: (ctx) => ctx.popUpProps = {}
                        }
                    ),
                },
                Game: {
                    on: {
                        Lobby: "Lobby",
                        DurakGameOverWon: {
                            actions: [
                                (context) => {
                                    context.popUp = PopUp;
                                    context.popUpProps["message"] = "You Won";
                                }
                            ],
                            target: "Lobby"
                        },
                        DurakGameOverLose: {
                            actions: [
                                (context) => {
                                    context.popUp = PopUp;
                                    context.popUpProps["message"] = "You Lose";
                                }
                            ],
                            target: "Lobby"
                        },
                        DurakGameOverDraw: {
                            actions: [
                                (context) => {
                                    context.popUp = PopUp;
                                    context.popUpProps["message"] = "It is a Draw";
                                }
                            ],
                            target: "Lobby"
                        },
                        GameData: {
                            actions: [
                                (context, event) => {
                                    context.props[event.type] = event;
                                    const currentPlayer = event.players.filter(player => player.PlayerData.name == context.accountName);
                                    if (currentPlayer?.length) {
                                        context.props["playerRole"] = currentPlayer[0].PlayerData.playerRole;
                                    }
                                }
                            ],
                        },
                        DurakAllowedMoves: {
                            actions: [
                                (context, event) => {
                                    context.props[event.type] = event;
                                }
                            ],
                        },
                        DurakAskDefendWantToTakeCards: {
                            actions: [
                                (context) => {
                                    context.popUp = WantToTakeCards;
                                }
                            ],
                        },
                        DurakDefendWantsToTakeCardsFromTableDoYouWantToAddCards: {
                            actions: [
                                (context) => {
                                    context.props["defenderWantsToTakeCards"] = true;
                                    context.popUp = PopUp;
                                    context.popUpProps["message"] = "Defending player wants to take cards from table. Add cards and press 'Pass' if you are done";
                                }
                            ],
                        },
                    },
                    entry: assign(
                        {
                            component: (ctx) => ctx.component = Game,
                            popUp: (ctx) => ctx.popUp = null,
                            props: (ctx) => ctx.props = {},
                            errors: (ctx) => ctx.errors = [],
                            popUpProps: (ctx) => ctx.popUpProps = {}
                        }
                    ),
                },
            }
        },
        ErrorHandling: {
            initial: "HandleError",
            states: {
                HandleError: {
                    on: {
                        GenericError: {
                            actions: [
                                (context, event) => {
                                    context.errors.push(event.error);
                                }
                            ],
                        },
                        ClosePopUp: {
                            actions: [
                                (context) => {
                                    context.popUp = null;
                                    context.popUpProps = {};
                                }
                            ],
                        }
                    }
                }
            }
        }
    }

});