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

<div class="container">
    <h1>Sign in to Modern Durak</h1>
    <Form {...formProps} autoComplete="false">
        <div>
            <Field
                type="text"
                name="accountName"
                placeholder="Account Name"
                autoComplete="false"
            />
            <ErrorMessage name="accountName" />
        </div>
        <div>
            <Field
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="false"
            />
            <ErrorMessage name="password" />
        </div>

        <div>
            <button type="submit">Sign in</button>
        </div>
        <div>
            <button on:click={createNewAccount}>Create new Account</button>
        </div>
    </Form>
</div>
