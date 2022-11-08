<script>
  import { createEventDispatcher } from "svelte";
  import { createForm } from "svelte-forms-lib";
  import { toast } from "@zerodevx/svelte-toast";
  import { sendMessageToWebsocket } from "../Webservice/store.js";
  import ModernDurakButton from "../component/ModernDurakButton.svelte";
  let dispatch = createEventDispatcher();
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

<div class="grid grid-cols-1 space-y-4 px-4">
  <h1 class="text-center text-lg font-bold">Create or Join Game Lobby</h1>
  <form class="grid grid-cols-1 space-y-4" on:submit={form1.handleSubmit}>
    <label for="name">Channel Name</label>
    <input
      class="border-2"
      id="name"
      name="name"
      on:change={form1.handleChange}
      bind:value={form1.name}
    />

    <label for="password">Password</label>
    <input
      class="border-2"
      type="password"
      id="password"
      name="password"
      on:change={form1.handleChange}
      bind:value={form1.password}
    />

    <ModernDurakButton type="submit" buttonText="Create Game Lobby" />
  </form>
  <form class="grid grid-cols-1 space-y-4" on:submit={form2.handleSubmit}>
    <label for="name">Channel Name</label>
    <input
      class="border-2"
      id="name"
      name="name"
      on:change={form2.handleChange}
      bind:value={form2.form.name}
    />

    <label for="password">Password</label>
    <input
      class="border-2"
      type="password"
      id="password"
      name="password"
      on:change={form2.handleChange}
      bind:value={form2.form.password}
    />

    <ModernDurakButton type="submit" buttonText="Join Game Lobby" />
  </form>
  <ModernDurakButton
    onClick={() => {
      dispatch("stateMachineEvent", "Cancel");
    }}
    buttonText="Cancel"
  />
</div>
