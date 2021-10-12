<script>
    import { Form, Field, ErrorMessage } from "svelte-forms-lib";
    import * as yup from "yup";
    import { createEventDispatcher } from "svelte";

    let dispatch = createEventDispatcher();
    const schema = yup.object().shape({
        accountName: yup.string().required("Account Name is required"),
        password: yup.string().required("Password is required"),
    });
    const createNewAccount = () => {
        dispatch("stateMachineEvent", "CreateAccount");
    };
    const cancel = () => {
        dispatch("stateMachineEvent", "Cancel");
    };
    import { sendMessageToWebsocket } from "../Webservice/store.js";
    const formProps = {
        initialValues: {
            accountName: "",
            password: "",
        },
        validationSchema: schema,
        onSubmit: (values) => {
            sendMessageToWebsocket("LoginAccount|" + JSON.stringify(values));
        },
    };
</script>

<div class="my-container">
    <h1>Sign in to Modern Durak</h1>
    <Form {...formProps} autoComplete="false" class="form-container">
        <label for="accountName">Account Name</label>
        <Field
            class="form-field"
            type="text"
            name="accountName"
            placeholder="Account Name"
            autoComplete="false"
        />
        <ErrorMessage name="accountName" class="form-error" />
        <label for="accountName">Password</label>
        <Field
            class="form-field"
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="false"
        />
        <ErrorMessage name="password" class="form-error" />
        <button type="submit">Sign in</button>
    </Form>
    <button on:click={createNewAccount}>Create new Account</button>
    <button on:click={cancel}>Cancel</button>
</div>

<style>
    .my-container {
        width: 75%;
        display: inline-block;
        box-sizing: border-box;
    }
    :global(.form-field:focus) {
        width: 100%;
        border-width: 3px;
        border-radius: 5%;
        border-color: #cccccc;
    }
    :global(.form-error) {
        width: 100%;
        color: red;
        border-radius: 5%;
        border-width: 3px;
        border-color: #cccccc;
    }
    :global(.form-field) {
        width: 100%;
        background: #0e3b93;
        color: #4ed93f;
        border-radius: 5%;
        border-width: 3px;
        border-color: #cccccc;
    }
    label {
        text-align: left;
    }
</style>
