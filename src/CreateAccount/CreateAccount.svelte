<script>
  import * as yup from "yup";
  import { createEventDispatcher } from "svelte";

  let dispatch = createEventDispatcher();
  import { toast } from "@zerodevx/svelte-toast";

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
      sendMessageToWebsocket("CreateAccount|" + JSON.stringify(createAccount));
    },
  };
  import { createForm } from "svelte-forms-lib";
  import ModernDurakButton from "../component/ModernDurakButton.svelte";

  const { form, errors, state, handleChange, handleSubmit } = createForm({
    initialValues: {
      accountName: "",
      password: "",
      repeatPassword: "",
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
        sendMessageToWebsocket("CreateAccount|" + JSON.stringify(values));
      }
    },
  });
</script>

<div class="grid grid-cols-1 gap-4 ">
  <h1 class="text-center text-lg font-bold">Sign in to Modern Durak</h1>
  <form class="grid grid-cols-1 gap-4" on:submit={handleSubmit}>
    <label for="accountName">Account Name</label>
    <input
      class="border-2 bg-background"
      id="accountName"
      name="accountName"
      on:change={handleChange}
      bind:value={$form.accountName}
    />
    <label for="password">Password</label>
    <input
      class="border-2 bg-background"
      type="password"
      id="password"
      name="password"
      on:change={handleChange}
      bind:value={$form.password}
    />
    <label for="repeatPassword">Repeat Password</label>
    <input
      class="border-2 bg-background"
      type="password"
      id="repeatPassword"
      name="repeatPassword"
      on:change={handleChange}
      bind:value={$form.repeatPassword}
    />
    <ModernDurakButton type="submit" buttonText="Sign in" />
  </form>
  <ModernDurakButton
    buttonText="Back"
    onClick={() => {
      backToLogin();
    }}
  />
  <ModernDurakButton onClick={cancel} buttonText="Cancel" />
</div>
