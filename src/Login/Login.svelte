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

<style>
    :global(.form-error) {
        color: #ff3e00;
        margin: 5px;
    }
</style>
