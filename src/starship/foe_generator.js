import Foe from "./foe";import Wraith from "./wraith";

export default class FoeGenerator {
    constructor(scene) {
        this.scene = scene;
        this.waveFoes = [];
        this.generate();
        this.activeWave = false;
        this.waves = 2;
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
        // this.scene.time.delayedCall(2000, () => this.spawnWraith(), null, this); return;
        // this.scene.time.delayedCall(2000, () => this.generateGuinxu(), null, this); return;
        // this.scene.time.delayedCall(100 * Phaser.Math.Between(5, 20), () => this.wave(), null, this); return;
        if (this.scene.number === 4) {
            this.scene.time.delayedCall(2000, () => this.generateGuinxu(), null, this);
        } else {
            this.masterGenerator = this.scene.time.addEvent(
                {
                    delay: 5000,
                    callback: () => {
                        if (this.waves < 5) {
                            if (this.foeCount < 10) {
                                this.generateManager();
                            }
                        } else if (this.foeCount == 0)
                            if (this.scene.number === 1 ) {
                                this.spawnSultan();
                                this.masterGenerator.destroy();
                            } 
                            else if(this.scene.number === 2){
                                this.spawnWraith();
                                this.masterGenerator.destroy();
                            }
                            else this.finishScene();
                    },
                    callbackScope: this,
                    loop: true,
                }
            );
        }
    }

    generateManager() {
         this.orderedWave();
          this.orderedWave(5, 400);
        // this.scene.time.delayedCall(100 * Phaser.Math.Between(5, 20), () => this.wave(), null, this);
        if (this.scene.number > 1)
             this.tank();
        if (this.scene.number > 2)
           this.slider();
        if(Phaser.Math.Between(1,6) >3){this.waves++;}
    }

    spawnWraith() {
        this.scene.playAudio("wraith");
        this.scene.time.addEvent(
            {
                delay: 200,
                callback: () => {
                    this.scene.sound.get('music2').stop();
                },
                callbackScope: this,
                loop: false,
            }
        );

        this.scene.time.delayedCall(
            300,
            () => this.spawnFoeWraith(),
            null,
            this
        );
    }

    spawnFoeWraith() {
        const wraith = new Wraith(
            this.scene,
            350,
            -90,
            "wraith",
            0,
            5
        ).setAlpha(1);
        this.scene.foeGroup.add(wraith);
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
            5
        );
        this.scene.time.delayedCall(6000, () => { if (sultan.active) sultan.changeVelocityY(1) }, null, this);
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

    orderedWave(difficulty = 5, startY = 0) {
        const x = Phaser.Math.Between(64, this.scene.width - 200);
        const y = Phaser.Math.Between(-100, 0) - startY;
        const minus = Phaser.Math.Between(-1, 1) > 0 ? 1 : -1;

        Array(difficulty)
            .fill()
            .forEach((_1, i) => this.addOrder(i, x, y, minus));
    }

    tank() {
        this.scene.foeGroup.add(
            new Foe(
                this.scene,
                Phaser.Math.Between(100, 600),
                -50,
                "foe2",
                0,
                470
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
                (x + i * 70 <= this.scene.width) ?  x + i * 70 : Phaser.Math.Between(30 , this.scene.width- 30),
                i * y + offset - 100,
                "foe0",
                0,
                200
            )
        );

        this.foeCount++;
    }

    update() {
        this.scene.foeGroup.children.entries.forEach((foe) => {
            foe.update();
        });
    }
}