<script>
    import { Form, Field, ErrorMessage } from "svelte-forms-lib";
    import * as yup from "yup";
    import { createEventDispatcher } from "svelte";

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
</script>

<div class="container">
    <h1>Sign in to Modern Durak</h1>
    <Form {...formProps}>
        <div>
            <Field type="text" name="accountName" placeholder="Account Name" />
            <ErrorMessage name="accountName" />
        </div>
        <div>
            <Field type="password" name="password" placeholder="Password" />
            <ErrorMessage name="password" />
        </div>
        <div>
            <Field
                type="password"
                name="repeatPassword"
                placeholder="Repeat Password"
            />
            <ErrorMessage name="repeatPassword" />
        </div>
        <button
            on:click={() => {
                backToLogin();
            }}>Back</button
        >
        <button type="submit">Create Account and Login</button>
    </Form>
    <div>
        <button on:click={cancel}>Cancel</button>
    </div>
</div>
