import { createMachine, assign } from 'xstate';
import Login from './Login/Login.svelte'
import Lobby from './Lobby/Lobby.svelte'
import Game from './Game/Game.svelte'
import CreateAccount from './CreateAccount/CreateAccount.svelte'
import CreateGame from './CreateGame/CreateGame.svelte'
import RelogTo from './PopUp/RelogTo.svelte'
import PopUp from './PopUp/PopUp.svelte'
import LandingPage from './LandingPage/LandingPage.svelte'
import { toast } from "@zerodevx/svelte-toast";

const loginStates = {
    id: "LoginMachine",
    initial: "Login",
    states: {
        Login: {
            on: {
                RelogToCreateGameLobbySuccess: "#toggle.Screens.CreateGame",
                RelogToGameSuccess: "#toggle.Screens.Game",
                CreateAccount: "CreateAccount",
                WantToRelog: {
                    actions: [
                        (context, event) => {
                            console.log(context.popUpProps)
                            context.popUpProps = { destination: event.destination };
                            context.popUp = RelogTo;
                            context.errors = [];
                            context.accountName = event.accountName;
                            console.log(context.popUpProps)
                        }
                    ],
                },
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
            on: {
                Login: "Login",
            },
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

    },
};

export const toggleMachine = createMachine({
    id: 'toggle',
    type: 'parallel',
    context: {
        component: LandingPage,
        popUp: null,
        props: {},
        errors: [],
        accountName: null,
    },
    states: {
        Screens: {
            initial: "LandingPage",
            states: {

                LandingPage: {
                    on: {
                        CustomLogin: "CustomLogin", Custom: "Lobby",
                    },
                    entry: assign(
                        {
                            component: (ctx) => ctx.component = LandingPage,
                            popUp: (ctx) => ctx.popUp = null,
                            props: (ctx) => ctx.props = { isLoggedIn: ctx.accountName != null },
                            errors: (ctx) => ctx.errors = [],
                            popUpProps: (ctx) => ctx.popUpProps = {}
                        }
                    ),
                },
                CustomLogin: {
                    on: {
                        LoginSuccess: "Lobby",
                        LoginAccountSuccess: {
                            actions: [
                                (context, event) => {
                                    context.accountName = event.accountName;
                                }
                            ],
                            target: "Lobby"
                        },

                        Cancel: "LandingPage"
                    },
                    ...loginStates,
                },
                // TODO Ranked Login
                // RankedLogin: {
                //     on: { LoginSuccess: "../Lobby", Cancel: "../LandingPage" },
                //     ...loginStates,

                Lobby: {
                    on: {
                        LogoutAccountSuccess: {
                            target: "LandingPage",
                            actions: [
                                (context) => {
                                    context.accountName = null;
                                    //I do not know why I have to reset this here
                                    context.component = LandingPage
                                    context.props = { isLoggedIn: context.accountName != null }
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
                                    if (event.durakGameOption.customCardDeck == null) {
                                        context.props["deckOptionSelected"] = 0;
                                    } else {
                                        context.props["deckOptionSelected"] = 1;
                                    }

                                }
                            ],
                        },
                        GameOption: {
                            actions: [
                                (context, event) => {
                                    context.props.UsersInGameLobby.durakGameOption["maxCardValue"] = event.maxCardValue;
                                    context.props.UsersInGameLobby.durakGameOption["customCardDeck"] = event.customCardDeck;
                                    if (event.customCardDeck == null) {
                                        context.props["deckOptionSelected"] = 0;
                                    } else {
                                        context.props["deckOptionSelected"] = 1;
                                    }
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
                        SetTimerOption: {
                            actions: [
                                (context, event) => {
                                    if (event.timerType == "resetTimeOnNewRound") {
                                        context.props["timerOptionSelected"] = 1;
                                    } else if (event.timerType == "addTimeOnNewRound") {
                                        context.props["timerOptionSelected"] = 2;
                                    } else {
                                        context.props["timerOptionSelected"] = 0;
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
                                    context.props["accountName"] = context.accountName;
                                    const currentPlayer = event.players.filter(player => player.PlayerData.name == context.accountName);
                                    if (currentPlayer?.length) {
                                        context.props["playerRole"] = currentPlayer[0].PlayerData.playerRole;
                                        context.props["playerCards"] = currentPlayer[0].PlayerData.cards;
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
                        DurakTimers: {
                            actions: [
                                (context, event) => {
                                    context.props[event.type] = event;
                                }
                            ],
                        },
                        DurakDefendWantsToTakeCardsFromTableDoYouWantToAddCards: {
                            actions: [
                                () => {
                                    toast.push("Defend wants to take Cards from table. Add Cards - Press 'Pass' when you are done", { target: 'Message' });
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

}, {
    guards: {
        loggedIn: context => context.accountName != null
    }
});