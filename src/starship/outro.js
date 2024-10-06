export default class Outro extends Phaser.Scene {
    constructor() {
        super({ key: "outro" });
    }
    create() {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.introLayer = this.add.layer();
        this.splashLayer = this.add.layer();
        this.text = [
            "Score: " + this.registry.get("score_player1"),
            "The evil forces among with",
            "their tyrannical leader GUINXU",
            "were finally wiped out.",
            "Thanks to commander Alva",
            "And the powah of the Plenny Shakes",
            " - press enter - ",
        ];
        this.showHistory();
        this.showPlayer();
        this.input.keyboard.on("keydown-ENTER", this.startSplash, this);
    }
    showHistory() {
        this.text.forEach((line, i) => {
            this.time.delayedCall((i + 1) * 2000,
                () => this.showLine(line, (i + 1) * 60),
                null,
                this
            );
        });
        this.time.delayedCall(4000, () => this.showPlayer(), null, this);
    }
    showLine(text, y) {
        let line = this.introLayer.add(
            this.add
                .bitmapText(this.center_width, y, "wendy", text, 50)
                .setOrigin(0.5)
                .setAlpha(0)
        );
        this.tweens.add({
            targets: line,
            duration: 2000,
            alpha: 1,
        });
    }
    showPlayer() {
        this.player1 = this.add
            .sprite(this.center_width, this.height - 200, "player1")
            .setOrigin(0.5);
    }
    startSplash() {
        this.scene.start("splash");
    }
}