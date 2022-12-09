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
  import ModernDurakButton from "../component/ModernDurakButton.svelte";

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
    <ModernDurakButton type="submit" buttonText="Sign in" />
  </form>
  <ModernDurakButton
    onClick={createNewAccount}
    buttonText="Create new Account"
  />
  <ModernDurakButton onClick={cancel} buttonText="Cancel" />
</div>
