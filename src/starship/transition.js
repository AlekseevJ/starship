export default class Transition extends Phaser.Scene {
    constructor() {
        super({ key: "transition" });
    }

    init(data) {
        this.name = data.name;
        this.number = data.number;
        this.next = data.next;
        this.players = data.players;
    }

    create() {
        const messages = [
            "Fire at will",
            "Beware the tanks",
            "Shoot down the UFOs",
            "FINAL BOSS",
        ];
        if( this.players == 1) {
            var readyText = "Ready player 1";
        } else {
            var readyText = "Players 1 2 ready";
        }
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.sound.add("stageclear2").play();
        this.add
            .bitmapText(
                this.center_width,
                this.center_height - 50,
                "wendy",
                messages[this.number - 1],
                100
            )
            .setOrigin(0.5);
        this.add
            .bitmapText(
                this.center_width,
                this.center_height + 50,
                "wendy",
                readyText,
                80
            )
            .setOrigin(0.5);
        this.playMusic("music" + (this.number !== 4 ? this.number : 1));
        this.time.delayedCall(2000, () => this.loadNext(), null, this);
    }
    loadNext() {
        this.scene.start(this.next, {
            name: this.name,
            number: this.number,
            time: this.time,
            players: this.players,
        });
    }

    playMusic(theme = "music1") {
        this.theme = this.sound.add(theme);
        this.theme.play({
            mute: false,
            volume: 0.2,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0,
        });
    }
}