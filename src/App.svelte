<script>
    import {interpret} from "xstate";
    import {toggleMachine} from "./machine";

    const toggleService = interpret(toggleMachine)
        .onTransition((state) => {
            console.log("Screen: " + state.value.Screens);
        })
        .start();
    const stateMachineEvent = (e) => {
        console.log("event: " + e.detail);
        toggleService.send(e.detail);
    };
    import {webSocket} from "./Webservice/store.js";

    webSocket.addEventListener("message", function (event) {
        console.log("webservice message: " + event.data);
        const words = event.data.split("|");
        if (words.length == 2) {
            if (words[0].includes("Error")) {
                const someValue = JSON.parse(words[1]);
                toast.push(someValue.error, {target: "Error"});
            } else {
                const someValue = JSON.parse(words[1]);
                someValue["type"] = words[0];
                toggleService.send(someValue);
            }
        } else if (words[0].includes("UnhandledEventError")) {
            toast.push("Unhandled Event please check Console Output.", {
                target: "Error",
            });
        } else {
            console.log(
                "Message from server is not valid." +
                "It should have exactly one '|' symbol message: " +
                event.data
            );
        }
    });
    import {sendMessageToWebsocket} from "./Webservice/store.js";

    let message;

    function onSendMessage() {
        if (message.length > 0) {
            sendMessageToWebsocket(message);
            message = "";
        }
    }

    import {toast, SvelteToast} from "@zerodevx/svelte-toast";

    //TODO fix problems with autofill passwords
    import {createForm} from "svelte-forms-lib";
    import ModernDurakButton from "./component/ModernDurakButton.svelte";

    const {form, errors, state, handleChange, handleSubmit} = createForm({
        initialValues: {
            message: "",
        },

        validate: (values) => {
            let errs = {};
            if (values.message === "") {
                errs["message"] = "message is required";
                toast.push(errs["message"], {target: "Error"});
            }

            return errs;
        },
        onSubmit: (values) => {
            sendMessageToWebsocket(values.message);
        },
    });
    const isProduction = process.env === "production";
</script>

<main>
    <div class="my-container">
        {#if $toggleService.context.popUp}
            <svelte:component
                    this={$toggleService.context.popUp}
                    class="mainScreen"
                    {...$toggleService.context.popUpProps}
                    on:stateMachineEvent={stateMachineEvent}
            />
        {:else}
            <svelte:component
                    this={$toggleService.context.component}
                    {...$toggleService.context.props}
                    on:stateMachineEvent={stateMachineEvent}
            />
        {/if}
    </div>
    <SvelteToast
            target="Error"
            options={{
      reversed: true,
      intro: {},
      dismissable: false,
      theme: {
        "font-size": "1.5em",
        "--toastColor": "#cb2d6f",
        "--toastProgressBackground": "#cb2d6f",
      },
    }}
    />
    <SvelteToast
            target="Message"
            options={{
      reversed: true,
      duration: 6000,
      intro: {},
      dismissable: false,
      theme: {
        "font-size": "1.5em",
        "--toastColor": "#0e3b93",
        "--toastProgressBackground": "#cccccc",
        opacity: 1,
      },
    }}
    />

    {#if !isProduction}
        <form class="p-8" on:submit={handleSubmit}>
            <label for="accountName">Message: </label>
            <input class="border-2"
                   id="accountName"
                   name="accountName"
                   on:change={handleChange}
                   bind:value={$form.message}
            />
            <ModernDurakButton type="submit" buttonText="Send"/>
        </form>
    {/if}


</main>

<style global>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

</style>