<script>
    import { Form, Field, ErrorMessage } from "svelte-forms-lib";
    import * as yup from "yup";
    import { createEventDispatcher } from "svelte";
    import { toast } from "@zerodevx/svelte-toast";
    let dispatch = createEventDispatcher();
    const schema = yup.object().shape({
        accountName: yup.string().required("Account Name is required"),
        password: yup.string().required("Password is required"),
        repeatPassword: yup
            .string()
            .required("Password is required")
            .oneOf([yup.ref("password"), null], "Passwords must match"),
    });
    const backToLogin = () => {
        dispatch("stateMachineEvent", "Login");
    };
    const cancel = () => {
        dispatch("stateMachineEvent", "Cancel");
    };
    import { sendMessageToWebsocket } from "../Webservice/store.js";
    const formProps = {
        initialValues: {
            accountName: "",
            password: "",
            repeatPassword: "",
        },
        validationSchema: schema,
        onSubmit: (values) => {
            const createAccount = JSON.parse(JSON.stringify(values));
            delete createAccount.repeatPassword;
            sendMessageToWebsocket(
                "CreateAccount|" + JSON.stringify(createAccount)
            );
        },
    };
    import { createForm } from "svelte-forms-lib";
    const { form, errors, state, handleChange, handleSubmit } = createForm({
        initialValues: {
            accountName: "",
            password: "",
            repeatPassword: "",
        },
        validate: (values) => {
            let errs = {};
            return errs;
        },
        onSubmit: (values) => {
            if (values.accountName === "") {
                toast.push("Account Name is required", { target: "Error" });
            } else if (values.password === "") {
                toast.push("Password is required", { target: "Error" });
            } else if (values.repeatPassword !== values.password) {
                toast.push("Repeat Password needs to be equal to Password", {
                    target: "Error",
                });
            } else {
                sendMessageToWebsocket(
                    "CreateAccount|" + JSON.stringify(values)
                );
            }
        },
    });
</script>

<div class="container">
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
        <label for="repeatPassword">Repeat Password</label>
        <input
            type="password"
            id="repeatPassword"
            name="repeatPassword"
            on:change={handleChange}
            bind:value={$form.repeatPassword}
        />
        <button type="submit">Sign in</button>
    </form>
    <button
        on:click={() => {
            backToLogin();
        }}>Back</button
    >

    <div>
        <button on:click={cancel}>Cancel</button>
    </div>
</div>
