<script>
    import ModernDurakButton from "../component/ModernDurakButton.svelte";
    import { createEventDispatcher } from "svelte";
    let dispatch = createEventDispatcher();
    const cancel = () => {
        dispatch("stateMachineEvent", "Cancel");
    };
</script>

<div>
    <h1 class="grow text-center text-lg font-bold">About</h1>
    <span>
        Modern Durak models the russian card game Durak. Durak is russian and
        means fool. The name Modern Durak is a joke combining 'modern' from
        modern c++ and 'durak' from the game Durak. You can play online against
        other players (Quick, Ranked, Custom) or play against a computer
        controlled opponent (Puzzle). Feel free to create an issue if something
        is not working or you have a question at
    </span>

    <a
        href="https://github.com/werto87/modern_durak/issues"
        target="_blank"
        class="font-medium text-greenCardValue hover:underline"
    >
        Modern Durak Github Issues</a
    >
    <span>.</span>
    <span>The source code of this project can be found on</span>
    <a
        href="https://github.com/werto87/modern_durak"
        target="_blank"
        class="font-medium text-greenCardValue hover:underline"
    >
        Modern Durak Github</a
    >
    <span>.</span>
    <div class="grid grid-cols-1 gap-4 ">
        <ModernDurakButton
            onClick={cancel}
            buttonText="Back to the Landing Page"
        />
    </div>
</div>
