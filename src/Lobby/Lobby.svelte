<script>
    import { createEventDispatcher } from "svelte";
    import { createForm } from "svelte-forms-lib";
    import { toast } from "@zerodevx/svelte-toast";
    import { sendMessageToWebsocket } from "../Webservice/store.js";
    const logout = () => {
        sendMessageToWebsocket("LogoutAccount|{}");
    };

    const form1 = createForm({
        initialValues: {
            name: "",
            password: "",
        },

        validate: (values) => {
            let errs = {};
            if (values.name === "") {
                errs["name"] = "Channel Name is required";
                toast.push(errs["name"], { target: "Error" });
            }
            return errs;
        },
        onSubmit: (values) => {
            sendMessageToWebsocket("CreateGameLobby|" + JSON.stringify(values));
        },
    });

    const form2 = createForm({
        initialValues: {
            name: "",
            password: "",
        },

        validate: (values) => {
            let errs = {};
            if (values.name === "") {
                errs["name"] = "Channel Name is required";
                toast.push(errs["name"], { target: "Error" });
            }
            return errs;
        },
        onSubmit: (values) => {
            sendMessageToWebsocket("JoinGameLobby|" + JSON.stringify(values));
        },
    });
</script>

<div class="container">
    <h1>Create or Join Game Lobby</h1>
    <form on:submit={form1.handleSubmit}>
        <label for="name">Channel Name</label>
        <input
            id="name"
            name="name"
            on:change={form1.handleChange}
            bind:value={form1.name}
        />
        <label for="password">Password</label>
        <input
            type="password"
            id="password"
            name="password"
            on:change={form1.handleChange}
            bind:value={form1.password}
        />
        <button type="submit">Create Game Lobby</button>
    </form>
    <form on:submit={form2.handleSubmit}>
        <label for="name">Channel Name</label>
        <input
            id="name"
            name="name"
            on:change={form2.handleChange}
            bind:value={form2.form.name}
        />
        <label for="password">Password</label>
        <input
            type="password"
            id="password"
            name="password"
            on:change={form2.handleChange}
            bind:value={form2.form.password}
        />
        <button type="submit">Join Game Lobby</button>
    </form>
    <button on:click={logout}>Logout</button>
</div>
