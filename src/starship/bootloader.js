export default class BootLoader extends Phaser.Scene {
    constructor() {
        super({ key: 'bootloader' });
    }

    preload() {
        this.createBars();
        this.setLoadEvents();
        this.loadAudios();
        this.loadFonst();
        this.loadImages();
        this.loadSpritesheets();
        this.setRegistry();
    }

    createBars() {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0xd40000, 1);

        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }

    setLoadEvents() {
        this.load.on(
            "progress",
            function (value) {
                this.progressBar.clear();
                this.progressBar.fillStyle(0x0088aa, 1);
                this.progressBar.fillRect(
                    this.cameras.main.width / 4,
                    this.cameras.main.height / 2 - 16,
                    (this.cameras.main.width / 2) * value,
                    16
                );
            },
            this
        );
        this.load.on(
            "complete",
            () => {
                this.scene.start("splash");
            },
            this
        );
    }

    loadFonst() {
        this.load.bitmapFont(
            "wendy",
            "starship/assets/fonts/wendy.png",
            "starship/assets/fonts/wendy.xml"
        );
    }

    loadImages() {
        this.load.image("logo", "starship/assets/images/logo.png");
        this.load.image("background", "starship/assets/images/background.png");
        Array(4)
            .fill(0)
            .forEach((_, i) => {
                this.load.image(`stage${i + 1}`, `starship/assets/images/stage${i + 1}.png`);
            });
    }

    loadAudios() {
        this.load.audio("shot", "starship/assets/sounds/shot.mp3");
        this.load.audio("foeshot", "starship/assets/sounds/foeshot.mp3");
        this.load.audio("foedestroy", "starship/assets/sounds/foedestroy.mp3");
        this.load.audio("foexplosion", "starship/assets/sounds/foexplosion.mp3");
        this.load.audio("explosion", "starship/assets/sounds/explosion.mp3");
        this.load.audio("stageclear1", "starship/assets/sounds/stageclear1.mp3");
        this.load.audio("stageclear2", "starship/assets/sounds/stageclear2.mp3");
        this.load.audio("boss", "starship/assets/sounds/boss.mp3");
        this.load.audio("splash", "starship/assets/sounds/splash.mp3");
        this.load.audio('dash', "starship/assets/sounds/dash.mp3");
        this.load.audio('sultanarrive', "starship/assets/sounds/sultan_arrive2.mp3");
        this.load.audio('sultan_fight', "starship/assets/sounds/sultan_fight.mp3");
        this.load.audio('playerhit', "starship/assets/sounds/playerhit.mp3");
        this.load.audio('game_over', "starship/assets/sounds/game_over.mp3");
        this.load.audio('wraith', "starship/assets/sounds/wraith.mp3");
        this.load.audio('wraithFast', "starship/assets/sounds/wraithFast.mp3");
        
        Array(3)
            .fill(0)
            .forEach((_, i) => {
                this.load.audio(`music${i + 1}`, `starship/assets/sounds/music${i + 1}.mp3`);
            });
    }

    loadSpritesheets() {
        this.load.spritesheet("player1", "starship/assets/images/player1.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("player2", "starship/assets/images/player2.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("foe0", "starship/assets/images/foe0.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("foe1", "starship/assets/images/foe1.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("foe2", "starship/assets/images/foe2.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("guinxu", "starship/assets/images/guinxu2.png", {
            frameWidth: 128,
            frameHeight: 144,
        });
        this.load.spritesheet("plenny0", "starship/assets/images/plenny0.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("sultan", "starship/assets/images/sultan.png", {
            frameWidth: 166,
            frameHeight: 120,
        });
        this.load.spritesheet("heart1", "starship/assets/images/heart1.png", {
            frameWidth: 22,
            frameHeight: 22,
        });
        this.load.spritesheet("heart2", "starship/assets/images/heart2.png", {
            frameWidth: 22,
            frameHeight: 22,
        });
        this.load.spritesheet("miniplayer1", "starship/assets/images/miniplayer1.png", {
            frameWidth: 22,
            frameHeight: 22,
        });
        this.load.spritesheet("miniplayer2", "starship/assets/images/miniplayer2.png", {
            frameWidth: 22,
            frameHeight: 21,
        });
        this.load.spritesheet("wraith", "starship/assets/images/wraith1.png", {
            frameWidth: 200,
            frameHeight: 200,
        });
    }

    setRegistry() {
        this.registry.set("score_player1", 0);
        this.registry.set("score_player2", 0);
    }
}