export default class Outro extends Phaser.Scene {
    constructor() {
        super({ key: "gameover" });
        
    }
    init(data) {
        this.playersCount = data.playerCount;
    }
    create() {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.gameOverLayer = this.add.layer();
        this.showPlayer();
        this.input.keyboard.on("keydown-ENTER", this.startSplash, this);
        this.text = ["Game Over", "Your ship has suffered a catastrophe...", "The End?"];
        this.showText();
    }

    showText() {
        this.text.forEach((line, i) => {
            this.time.delayedCall((i + 1) * 2000,
                () => this.showLine(line, (i + 1) * 60),
                null,
                this
            );
        });
    }

    startSplash() {
        this.scene.start("splash");
    }
    showLine(text, y) {
        let line = this.gameOverLayer.add(
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
        if(this.playersCount > 1){
            this.player1 = this.add
            .sprite(this.center_width- 50, this.height - 200, "player1")
            .setOrigin(0.5);
            this.player2 = this.add
            .sprite(this.center_width + 50, this.height - 200, "player2")
            .setOrigin(0.5);
        } else{
        this.player1 = this.add
            .sprite(this.center_width, this.height - 200, "player1")
            .setOrigin(0.5);}
    }
}