export default class AtomicLevelIntro extends Phaser.Scene {
    constructor() {
        super({ key: "atomic_level_intro" });
    }

    init(data) {
        this.name = data.name;
        this.number = data.number;
        this.next = data.next;
        this.players = data.players;
        this.player1hp = data.player1hp;
        this.player1life = data.player1life;
        this.atomic = data.atomic;
    }

    create() {

        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.playMusic('self_destruction');
        this.time.delayedCall(2000, () => this.loadAtomic(), null, this);
    }

    create() {
        this.messages = [
            " A deafening roar fills the sky as the massive Wraith ship plummets.",
            "Its shadow casting fear over the landscape.",
            "In an instant, it crashes, sending shockwaves and debris flying.",
            "From the wreckage, a blinding light erupts—an atomic bomb, ready to detonate.",
        ];
        this.lastMessage =
            "A atomic bomb! Get as far away as you can! Every second counts!";
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.introLayer = this.add.layer();
        this.splashLayer = this.add.layer();
        this.playMusic();
        this.showStory();
    }
    playMusic(theme = "self_destruction") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
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

    showStory() {
        this.showImage();
        this.showHistory();
    }

    showBomb() {
        this.introLayer.removeAll(true);
        this.showImageBomb();
        let line = this.introLayer.add(
            this.add
                .bitmapText(this.center_width, 50, "wendy", this.lastMessage, 35)
                .setOrigin(0.5)
                .setAlpha(0)
        );
        this.tweens.add({
            targets: line,
            duration: 2000,
            alpha: 1,
        });
        this.time.delayedCall(4000,
            () => this.startAtomicRun(),
            null,
            this
        );
    }

    startAtomicRun() {
        this.scene.start('game', {
            name: this.name,
            number: this.number,
            time: this.time,
            players: this.players,
            player1hp: this.player1hp,
            player1life: this.player1life,
            atomic: true,
        });
    }

    showImageBomb() {
        this.image = this.introLayer.add(
            this.add.image(this.center_width, this.center_height + 100, "wraith_atomic_bomb").setOrigin(0.5).setScale(0.7, 0.7)
        );
        this.tweens.add({
            targets: this.image,
            duration: 2000,
            alpha: { from: 0, to: 1 },
        }
        );
    }

    showImage() {
        this.image = this.introLayer.add(
            this.add.image(this.center_width, this.center_height + 100, "wraith_down").setOrigin(0.5).setScale(0.7, 0.7)
        );
        this.tweens.add({
            targets: this.image,
            duration: 2000,
            alpha: { from: 0, to: 1 },
        }
        );
    }

    showHistory() {
        this.messages.forEach((line, i) => {
            this.time.delayedCall((i + 1) * 2000,
                () => this.showLine(line, (i + 1) * 25 + 40),
                null,
                this
            );
        });
        this.time.delayedCall(20000,
            () => this.showBomb(),
            null,
            this
        );

    }
    showLine(text, y) {
        let line = this.introLayer.add(
            this.add
                .bitmapText(this.center_width, y, "wendy", text, 30)
                .setOrigin(0.5)
                .setAlpha(0)
        );
        this.tweens.add({
            targets: line,
            duration: 2000,
            alpha: 1,
        });
    }
}