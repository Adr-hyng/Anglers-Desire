export class FishingOutputHandler {
    static get Caught() {
        return {
            particle: "show_fish_caught_particle",
            text: "yn.fishing_got_reel.on_caught_message"
        };
    }
    static get Escaped() {
        return {
            particle: "show_fish_escaped_particle",
            text: "yn.fishing_got_reel.on_drop_hook"
        }
    }
}
