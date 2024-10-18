import Explosion from "./explosion";

const TYPES = { points: 20000, lives: 120 };

export default class PinkSouse extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, shadow = false) {
        super(scene, x, y, 'pink_souse');
        this.id = Math.random();
        this.name = 'pink_souse';
        this.points = TYPES.points;
        this.lives = TYPES.lives;
        this.depth = 1;
        scene.add.existing(this);

        if (shadow) {
            this.x = this.x + 30;
            this.y = this.y + 30;
            this.setScale(0.8);
            this.setTint(0x000000);
            this.setAlpha(0.5);
            this.depth = 0.5;
        } else {
            scene.physics.add.existing(this);
            this.body.setAllowGravity(false);
            this.body.setImmovable(true);
            this.body.setSize(130, 100);
            this.counter = 0;
            this.spawnFoeEvent();
            scene.game.sound.stopAll();
            this.scene.time.delayedCall(300,
                () => {
                    this.scene.playAudio('pink');
                },
                null, this);
        }
        this.strategyOneCounter = 1;
        this.strategyOneY = 350;

        this.init();
    }


    setShadow(shadow) {
        this.shadow = shadow;
    }

    dead() {
        let radius = 60;
        let explosionRad = 20;
        radius = 220;
        explosionRad = 220;
        this.scene.cameras.main.shake(500);

        const explosion = this.scene.add
            .circle(this.x, this.y, 5)
            .setStrokeStyle(20, 0xffffff);
        this.scene.tweens.add({
            targets: explosion,
            radius: { from: 10, to: radius },
            alpha: { from: 1, to: 0.3 },
            duration: 250,
            onComplete: () => {
                explosion.destroy();
            },
        });

        new Explosion(this.scene, this.x, this.y, explosionRad);

        this.scene.playAudio("explosion");
        this.scene.endScene();

        this.scene.foes.foeCount--;
        this.scene.spawnShake(this.x, this.y);

        this.spawnFoes.destroy();
        this.shadow.destroy();
        this.destroy();
    }

    spawnFoeEvent() {
        this.spawnFoes = this.scene.time.addEvent({
            delay: 3000,
            callback: () => {
                if (this.active) {
                    this.scene.foes.slider();
                    this.scene.foes.slider();
                    this.scene.foes.slider();
                }
            },
            loop: true,
            callbackScope: this
        });
    }

    init() {
        if (this.scene.anims.exists(this.name)) {
            this.anims.play(this.name, true);
            this.direction = -1;
            return;
        }
        this.scene.anims.create({
            key: this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name),
            frameRate: 15,
            repeat: -1,
        });
        this.anims.play(this.name, true);
        this.direction = -1;
    }

    movementTo(x, y, time = 5000) {
        if (this.active) {
            this.scene.physics.moveTo(
                this,
                x,
                y,
                10,
                time
            );
            this.scene.time.delayedCall(time + 10, () => { if (this.active) { this.body.setVelocityX(0); this.body.setVelocityY(0); } }, null, this);
        }
    }

    brainManager() {
        if(this.strategyOneCounter % 5 == 0) {
            this.strategyOneY = 250;
        } else if (this.strategyOneCounter % 10 == 0){
            this.strategyOneY = 150;
        } else if (this.strategyOneCounter % 20 == 0){
            this.strategyOneY = 100;
        }

        this.strategyOne();
        this.strategyOneCounter++;
    }

    updateShadow() {
        this.shadow.x = this.x + 30;
        this.shadow.y = this.y + 30;
    };

    update() {
        if (this.counter == 0) {
            this.counter++
            this.brainManager();;
        }

        this.updateShadow();
    }

    strategyOne() {
        this.movementTo(this.scene.width - 120, this.strategyOneY);
        this.scene.time.delayedCall(
            5100,
            () => {
                this.movementTo(120, this.strategyOneY);
            },
            null,
            this
        );
        this.scene.time.delayedCall(
            10250,
            () => {
                this.counter = 0;
            },
            null,
            this
        );
    }
}