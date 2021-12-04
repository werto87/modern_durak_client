<script>
    import { createEventDispatcher } from "svelte";
    import { toast } from "@zerodevx/svelte-toast";
    let dispatch = createEventDispatcher();
    const createNewAccount = () => {
        dispatch("stateMachineEvent", "CreateAccount");
    };
    const cancel = () => {
        dispatch("stateMachineEvent", "Cancel");
    };
    import { sendMessageToWebsocket } from "../Webservice/store.js";

    import { createForm } from "svelte-forms-lib";

    const { form, errors, state, handleChange, handleSubmit } = createForm({
        initialValues: {
            accountName: "",
            password: "",
        },

        validate: (values) => {
            let errs = {};
            if (values.accountName === "") {
                errs["accountName"] = "Account Name is required";
                toast.push(errs["accountName"], { target: "Error" });
            }
            if (values.password === "") {
                errs["password"] = "Password is required";
                toast.push(errs["password"], { target: "Error" });
            }
            return errs;
        },
        onSubmit: (values) => {
            sendMessageToWebsocket("LoginAccount|" + JSON.stringify(values));
        },
    });
</script>

<h1>Sign in to Modern Durak</h1>
<form on:submit={handleSubmit}>
    <label for="accountName">Account Name</label>
    <input
        id="accountName"
        name="accountName"
        on:change={handleChange}
        bind:value={$form.accountName}
    />
    <label for="password">Password</label>
    <input
        type="password"
        id="password"
        name="password"
        on:change={handleChange}
        bind:value={$form.password}
    />
    <button type="submit">Sign in</button>
</form>
<button on:click={createNewAccount}>Create new Account</button>
<button on:click={cancel}>Cancel</button>

<style>
    :global(.form-error) {
        color: #ff3e00;
        margin: 5px;
    }
</style>
