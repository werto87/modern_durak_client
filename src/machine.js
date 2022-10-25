import { createMachine, assign } from 'xstate';
import Login from './Login/Login.svelte'
import Lobby from './Lobby/Lobby.svelte'
import Game from './Game/Game.svelte'
import CreateAccount from './CreateAccount/CreateAccount.svelte'
import CreateGame from './CreateGame/CreateGame.svelte'
import RelogTo from './PopUp/RelogTo.svelte'
import WantToJoinGame from './PopUp/WantToJoinGame.svelte'
import PopUp from './PopUp/PopUp.svelte'
import LandingPage from './LandingPage/LandingPage.svelte'
import { toast } from "@zerodevx/svelte-toast";
import WaitingForGame from "./WaitingForGame/WaitingForGame.svelte"
import { sendMessageToWebsocket } from "./Webservice/store.js";


const matchMakingState = (isRanked) => {
    return {
        on: {
            StartGameSuccess: "Game", LandingPage: "LandingPage", LeaveQuickGameQueueSuccess: "LandingPage",
            JoinMatchMakingQueueSuccess: {
                actions: [
                    (context) => {
                        context.props = { waitingState: "waitForGame", isRanked: isRanked }
                    }
                ],
            },
            AskIfUserWantsToJoinGame: {
                actions: [
                    (context) => {
                        context.props = { waitingState: "waitForAnswer", isRanked: isRanked }
                    }
                ],
            },
            GameStartCanceled: {
                actions: [
                    (context) => {
                        context.props = { waitingState: "waitForGame", isRanked: isRanked }
                    }
                ],
            },
            GameStartCanceledRemovedFromQueue: {
                actions: [
                    (context) => {
                        context.props = { waitingState: "retryAfterStartGameFailed", isRanked: isRanked }
                    }
                ],
            },
            AskIfUserWantsToJoinGameTimeOut: {
                actions: [
                    (context) => {
                        context.props = { waitingState: "retryAfterStartGameFailed", isRanked: isRanked };
                    }
                ],
            },
        },
        entry: assign(
            {
                component: (ctx) => ctx.component = WaitingForGame,
                popUp: (ctx) => ctx.popUp = null,
                props: (ctx) => ctx.props = { isRanked: isRanked },
                popUpProps: (ctx) => ctx.popUpProps = {}

            }
        ),
    }
}

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
                            context.popUpProps = { destination: event.destination };
                            context.popUp = RelogTo;
                            context.accountName = event.accountName;
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
        loginState: null,
    },
    states: {
        Screens: {
            initial: "LandingPage",
            states: {
                LandingPage: {
                    on: {
                        Custom: "Lobby", Quick: "Quick", Ranked: "Ranked", LandingPageLogin: "LandingPageLogin", RankedLogin: "RankedLogin",Puzzle: "Puzzle",
                        RatingChanged: {
                            actions: [
                                (unusedButNeededSoEventGetsSetWithTheCorrectValue, event) => {
                                    toast.push("Your rating changed from " + event.oldRating + " to " + event.newRating, { target: 'Message' });
                                }
                            ],
                        }
                    },
                    entry: assign(
                        {
                            component: (ctx) => ctx.component = LandingPage,
                            popUp: (ctx) => ctx.popUp = null,
                            popUpProps: (ctx) => ctx.popUpProps = {},
                            props: (ctx) => ctx.props = { loginState: ctx.loginState },
                        }
                    ),
                },
                LandingPageLogin: {
                    on: {
                        LoginAccountSuccess: "LandingPage",
                        Cancel: "LandingPage"
                    },
                    ...loginStates,
                },
                RankedLogin: {
                    on: {
                        LoginAccountSuccess: {
                            actions: [
                                () => {
                                    sendMessageToWebsocket('JoinMatchMakingQueue|{"isRanked": true}');
                                }
                            ],
                            target: "Ranked"
                        },
                        Cancel: "LandingPage",
                    },
                    ...loginStates,
                },
                Ranked: matchMakingState(true),
                Quick: matchMakingState(false),
                //TODO implement puzzle
                Puzzle: {
                    on: {
                        JoinGameLobbySuccess: "CreateGame", LogoutAccountSuccess: "LandingPage"
                    },
                    entry: assign(
                        {
                            component: (ctx) => ctx.component = Lobby,
                            popUp: (ctx) => ctx.popUp = null,
                            props: (ctx) => ctx.props = {},
                            popUpProps: (ctx) => ctx.popUpProps = {}
                        }
                    ),
                },
                Lobby: {
                    on: {
                        JoinGameLobbySuccess: "CreateGame", LogoutAccountSuccess: "LandingPage"
                    },
                    entry: assign(
                        {
                            component: (ctx) => ctx.component = Lobby,
                            popUp: (ctx) => ctx.popUp = null,
                            props: (ctx) => ctx.props = {},
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
                                    if (event.durakGameOption.gameOption.customCardDeck == null) {
                                        context.props["deckOptionSelected"] = 0;
                                    } else {
                                        context.props["deckOptionSelected"] = 1;
                                    }

                                }
                            ],
                        },
                        AskIfUserWantsToJoinGame: {
                            actions: [
                                (context) => {
                                    if (context.props["isCreateGameLobbyAdmin"]) {
                                        sendMessageToWebsocket('WantsToJoinGame|{"answer":true}');
                                    } else {
                                        toast.push({
                                            component: {
                                                src: WantToJoinGame,
                                                props: {
                                                    title: 'A Dummy Cookie Component'
                                                },
                                                sendIdTo: 'Message' // send toast id to `toastId` prop
                                            },
                                            target: 'Message',
                                            dismissable: false,
                                            initial: 0,
                                            theme: {
                                                '--toastPadding': '0',
                                                '--toastMsgPadding': '0'
                                            }
                                        })
                                    }
                                }
                            ],
                        },
                        GameStartCanceled: {
                            actions: [
                                () => {
                                    toast.pop();
                                }
                            ],
                        },
                        GameOption: {
                            actions: [
                                (context, event) => {
                                    context.props[event.type] = event
                                    if (event.gameOption.customCardDeck == null) {
                                        context.props["deckOptionSelected"] = 0;
                                    } else {
                                        context.props["deckOptionSelected"] = 1;
                                    }
                                    if (event.timerOption.timerType == "resetTimeOnNewRound") {
                                        context.props["timerOptionSelected"] = 1;
                                    } else if (event.timerOption.timerType == "addTimeOnNewRound") {
                                        context.props["timerOptionSelected"] = 2;
                                    } else {
                                        context.props["timerOptionSelected"] = 0;
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
                    },
                    entry: assign(
                        {
                            component: (ctx) => ctx.component = CreateGame,
                            popUp: (ctx) => ctx.popUp = null,
                            props: (ctx) => ctx.props = {},
                            popUpProps: (ctx) => ctx.popUpProps = {}
                        }
                    ),
                },
                Game: {
                    on: {
                        Lobby: "Lobby",
                        DurakGameOverWon: {
                            actions: [
                                () => {
                                    toast.push("You Won", { target: 'Message' });
                                }
                            ],
                            target: "LandingPage"
                        },
                        DurakGameOverLose: {
                            actions: [
                                () => {
                                    toast.push("You Lose", { target: 'Message' });
                                }
                            ],
                            target: "LandingPage"
                        },
                        DurakGameOverDraw: {
                            actions: [
                                () => {
                                    toast.push("It is a Draw", { target: 'Message' });
                                }
                            ],
                            target: "LandingPage"
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
                                () => {
                                    toast.push("Attack is over. Take or discard Cards from Tabel", { target: 'Message' });
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
                                    toast.push("Defend wants to take Cards from table. Add Cards and press 'Done adding Cards' when you are done", { target: 'Message' });
                                }
                            ],
                        },
                    },
                    entry: assign(
                        {
                            component: (ctx) => ctx.component = Game,
                            popUp: (ctx) => ctx.popUp = null,
                            props: (ctx) => ctx.props = {},
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
        },
        LoginSuccess: {
            initial: "LoginAccountSuccess",
            states: {
                LoginAccountSuccess: {
                    on: {
                        LoginAccountSuccess: {
                            actions: [
                                (context, event) => {
                                    context.accountName = event.accountName;
                                    context.loginState = "registered";
                                    context.props["loginState"] = context.loginState;
                                }
                            ],
                        },
                    }
                }
            }
        },
        LoginGuestSuccess: {
            initial: "LoginAsGuestSuccess",
            states: {
                LoginAsGuestSuccess: {
                    on: {
                        LoginAsGuestSuccess: {
                            actions: [
                                (context, event) => {
                                    context.accountName = event.accountName;
                                    context.loginState = "guest";
                                    context.props["loginState"] = context.loginState;
                                }
                            ],
                        },
                    }
                }
            }
        },
        LogoutAccount: {
            initial: "LogoutAccountSuccess",
            states: {
                LogoutAccountSuccess: {
                    on: {
                        LogoutAccountSuccess: {
                            actions: [
                                (context) => {
                                    context.accountName = null;
                                    context.loginState = null;
                                    context.props["loginState"] = context.loginState;
                                }
                            ],
                        },
                    }
                }
            }
        },

    }


});