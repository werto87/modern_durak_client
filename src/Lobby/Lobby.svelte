<script>
    import { Form, Field, ErrorMessage } from "svelte-forms-lib";
    import * as yup from "yup";
    import { sendMessageToWebsocket } from "../Webservice/store.js";
    const logout = () => {
        sendMessageToWebsocket("LogoutAccount|{}");
    };
    const createGameLobbySchema = yup.object().shape({
        name: yup.string().required("Create Game Lobby Name"),
        password: yup.string(),
    });

    const createGameLobbyProps = {
        initialValues: {
            name: "",
            password: "",
        },
        validationSchema: createGameLobbySchema,
        onSubmit: (values) => {
            sendMessageToWebsocket("CreateGameLobby|" + JSON.stringify(values));
        },
    };

    const joinGameLobbySchema = yup.object().shape({
        name: yup.string().required("Join Game Lobby Name"),
        password: yup.string(),
    });

    const joinGameLobbyProps = {
        initialValues: {
            name: "",
            password: "",
        },
        validationSchema: joinGameLobbySchema,
        onSubmit: (values) => {
            sendMessageToWebsocket("JoinGameLobby|" + JSON.stringify(values));
        },
    };
</script>

<div class="container">
    <Form {...createGameLobbyProps} autoComplete="false">
        <h1>Create Game Lobby</h1>
        <div>
            <Field
                type="text"
                name="name"
                placeholder="Create Game Lobby Name"
                autoComplete="false"
            />
            <ErrorMessage name="name" />
        </div>
        <div>
            <Field
                type="password"
                name="password"
                placeholder="Create Game Lobby Password"
                autoComplete="false"
            />
            <ErrorMessage name="gameLobbyPassword" />
        </div>
        <div>
            <button type="submit">Create Game Lobby</button>
        </div>
    </Form>
    <Form {...joinGameLobbyProps} autoComplete="false">
        <h1>Join Game Lobby</h1>
        <div>
            <Field
                type="text"
                name="name"
                placeholder="Join Game Lobby Name"
                autoComplete="false"
            />
            <ErrorMessage name="name" />
        </div>
        <div>
            <Field
                type="password"
                name="password"
                placeholder="Join Game Lobby Password"
                autoComplete="false"
            />
            <ErrorMessage name="password" />
        </div>
        <div>
            <button type="submit">Join Game Lobby</button>
        </div>
    </Form>
    <button on:click={logout}>Logout</button>
</div>
