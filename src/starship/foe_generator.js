import Foe from "./foe";

export default class FoeGenerator {
    constructor(scene) {
        this.scene = scene;
        this.waveFoes = [];
        this.generate();
        this.activeWave = false;
        this.waves = 0;
        this.foeCount = 0;
        // this.addFoeCounter();
        this.eventCounter = 0;
        this.markSultan = false;

    }

    addFoeCounter() {
        this.foeCounter = this.scene.add
            .bitmapText(
                150,
                160,
                "wendy",
                String(this.foeCount),
                50
            )
            .setOrigin(0.5)
            .setScrollFactor(0);
    }

    generate() {
        // this.scene.time.delayedCall(2000, () => this.spawnSultan(), null, this); return;
        if (this.scene.number === 4) {
            this.scene.time.delayedCall(2000, () => this.generateGuinxu(), null, this);
        } else {
            this.masterGenerator = this.scene.time.addEvent(
                {
                    delay: 1300,
                    callback: () => {
                        if (this.waves < 3) {
                            if (this.foeCount < 10) {
                                this.generateManager();
                            }
                        } else if (this.foeCount == 0)
                            if (this.scene.number === 1 ) {
                                this.spawnSultan();
                                this.masterGenerator.destroy();
                            } else this.finishScene();
                    },
                    callbackScope: this,
                    loop: true,
                }
            );
        }
    }



    generateManager() {
        this.scene.time.delayedCall(100 * Phaser.Math.Between(5, 20), () => this.orderedWave(), null, this);
        this.scene.time.delayedCall(100 * Phaser.Math.Between(5, 20), () => this.wave(), null, this);
        if (this.scene.number > 1)
            this.scene.time.delayedCall(2000, () => this.tank(), null, this);
        if (this.scene.number > 2)
            this.scene.time.delayedCall(2000, () => this.slider(), null, this);
    }

    spawnSultan() {
        this.scene.playAudio("sultanarrive");
        this.scene.time.addEvent(
            {
                delay: 100,
                callback: () => {
                    this.scene.sound.get('music1').stop();
                },
                callbackScope: this,
                loop: false,
            }
        );
        this.scene.time.delayedCall(4040, () => this.arriveSultan(), null, this);
    }

    arriveSultan() {
        this.scene.playAudio("sultan_fight");
        const sultan = new Foe(
            this.scene,
            this.scene.width - this.scene.width + 40,
            5,
            "sultan",
            0,
            20
        );
        this.scene.time.delayedCall(6000, () => { if (sultan.active) sultan.changeVelocityY(0) }, null, this);
        this.scene.tweens.add({
            targets: sultan,
            x: { from: sultan.x, to: this.scene.width - 40 },
            duration: 1500,
            repeat: -1,
            yoyo: true,
        });
        this.foeCount++;
        this.scene.foeGroup.add(sultan);
    }

    generateGuinxu() {
        const guinxu = new Foe(
            this.scene,
            Phaser.Math.Between(200, 600),
            200,
            "guinxu",
            0,
            20
        );
        this.foeCount++;
        this.scene.playAudio("boss");
        this.laughterEvent = this.scene.time.addEvent({
            delay: 10000,
            callback: () => {
                this.scene.playAudio("boss");
            },
            callbackScope: this,
            loop: true,
        });
        this.guinxuMove(guinxu);
        this.scene.foeGroup.add(guinxu);
    }

    guinxuMove(guinxu) {
        this.guinxuMoved = true;
        this.scene.time.delayedCall(2000, () => this.guinxuLeftRight(guinxu), null, this);
    }

    guinxuLeftRight(guinxu) {
        this.scene.tweens.add({
            targets: guinxu,
            alpha: { from: 0.3, to: 5 },
            x: { from: guinxu.x, to: this.scene.width - this.scene.width + 35 },
            duration: 1500,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: guinxu,
                    alpha: { from: 0.3, to: 5 },
                    x: { from: guinxu.x, to: this.scene.width - 35 },
                    duration: 1800,
                    repeat: 1,
                    yoyo: true,
                    onComplete: () => {
                        this.guinxuMid(guinxu);
                    },
                });
            },
        });

    }

    guinxuMid(guinxu) {
        this.scene.tweens.add({
            targets: guinxu,
            alpha: { from: 0.3, to: 5 },
            x: { from: this.scene.width - this.scene.width - 35, to: this.scene.width / 2 },
            duration: 5680,
            onComplete: () => {
                guinxu.x = this.scene.width / 2;
                guinxu.y = this.scene.height - this.scene.height + 40;
                this.guinxuLeftRight(guinxu)
            },
        });
    }


    finishScene() {
        this.masterGenerator.destroy();
        this.scene.endScene();
    }

    createPath() {
        this.waves++;
        const start = Phaser.Math.Between(100, 600);
        this.path = new Phaser.Curves.Path(start, 0);

        this.path.lineTo(start, Phaser.Math.Between(20, 50));

        let max = 44;
        let h = 500 / max;

        for (let i = 0; i < h; i++) {
            if (i % 2 === 0) {
                this.path.lineTo(start, 50 + h * (i + 1));
            } else {
                this.path.lineTo(start + 300, 50 + h * (i + 1));
            }
        }

        this.path.lineTo(start, this.scene.height + 50);
        this.graphics = this.scene.add.graphics();
        this.graphics.lineStyle(0, 0xffffff, 0);
    }

    orderedWave(difficulty = 5) {
        const x = Phaser.Math.Between(64, this.scene.width - 200);
        const y = Phaser.Math.Between(-100, 0);
        const minus = Phaser.Math.Between(-1, 1) > 0 ? 1 : -1;

        Array(difficulty)
            .fill()
            .forEach((_1, i) => this.addOrder(i, x, y, minus));
    }

    wave(difficulty = 5) {
        if (this.activeWave == true) return;
        this.createPath();
        const x = Phaser.Math.Between(64, this.scene.width - 200);
        const y = Phaser.Math.Between(-100, 0);
        const minus = Phaser.Math.Between(-1, 1) > 0 ? 1 : -1;

        Array(difficulty)
            .fill()
            .forEach((_1, i) => this.addToWave(i));
        this.activeWave = true;
    }

    tank() {
        this.scene.foeGroup.add(
            new Foe(
                this.scene,
                Phaser.Math.Between(100, 600),
                -100,
                "foe2",
                0,
                620
            )
        );

        this.foeCount++;
    }

    slider() {
        let velocity = -200;
        let x = 0;
        if (Phaser.Math.Between(-1, 1) > 0) {
            velocity = 200;
            x = -100;
        } else {
            x = this.scene.width + 100;
        }

        const foe = new Foe(
            this.scene,
            x,
            Phaser.Math.Between(100, 600),
            "foe1",
            velocity,
            0
        );

        this.foeCount++;

        this.scene.tweens.add({
            targets: [foe, foe.shadow],
            duration: 500,
            rotation: "+=5",
            repeat: -1,
        });
        this.scene.foeGroup.add(foe);
        this.scene.time.delayedCall(8000, () => { if (foe.active) { foe.sliderDead(); } }, null, this);
    }

    add() {
        const foe = new Foe(
            this.scene,
            Phaser.Math.Between(32, this.scene.width - 32),
            0
        );

        this.foeCount++;
        this.scene.foeGroup.add(foe);
    }

    addOrder(i, x, y, minus) {
        const offset = minus * 70;

        this.scene.foeGroup.add(
            new Foe(
                this.scene,
                x + i * 70,
                i * y + offset,
                "foe0",
                0,
                300
            )
        );

        this.foeCount++;
    }

    addToWave(i) {
        const foe = new Foe(
            this.scene,
            Phaser.Math.Between(32, this.scene.width - 32),
            0,
            "foe0"
        );

        this.foeCount++;
        this.scene.tweens.add({
            targets: foe,
            z: 1,
            ease: "Linear",
            duration: 12000,
            repeat: -1,
            delay: i * 100,
        });
        this.scene.foeWaveGroup.add(foe);
    }

    update() {
        // this.foeCounter.setText(this.foeCount);
        if (this.path) {
            this.path.draw(this.graphics);
            this.scene.foeWaveGroup.children.entries.forEach((foe) => {
                if (foe === null || !foe.active) return;
                let t = foe.z;
                let vec = foe.getData("vector");
                this.path.getPoint(t, vec);
                foe.setPosition(vec.x, vec.y);
                foe.shadow.setPosition(vec.x + 20, vec.y + 20);
                foe.setDepth(foe.y);

            });
            if (this.activeWave && this.checkIfWaveDestroyed()) {

                this.activeWave = false;
                this.scene.spawnShake();
                this.path.destroy();
            }


        }

        this.scene.foeGroup.children.entries.forEach((foe) => {
            foe.update();
        });
    }

    checkIfWaveDestroyed() {
        const foes = this.scene.foeWaveGroup.children.entries;

        return foes.length === foes.filter((foe) => !foe.active).length;
    }
}