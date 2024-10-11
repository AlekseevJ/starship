import FoeShot from "./foe_shot";
import Explosion from "./explosion";

const TYPES = {
    wraith: { points: 3000, lives: 60, circle: 30, offestX: 12 },
};

class Wraith extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name = "foe0", velocityX = 0, velocityY = 0) {
        super(scene, x, y, name);
        this.name = name;
        this.points = TYPES[name].points;
        this.lives = TYPES[name].lives;
        this.id = Math.random();
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.setSizeFoe(name);
        this.body.setVelocityX(velocityX);
        this.body.setVelocityY(velocityY);
        this.body.setImmovable(true);
        this.setData("vector", new Phaser.Math.Vector2());
        if (this.name === "guinxu") {
            this.setGuinxuShot();
        }
        this.init();
        this.spawnShadow(this.x, this.y);
        this.counter = 0;
        this.movementCounter = 3;
        this.booster = true;
        this.difficulty = 3;
    }

    setSizeFoe(name) {
        if (name === 'sultan') {
            this.body.setSize(125, 80);
        } else if (name === 'guinxu') {
            this.body.setSize(90, 110);
        } else if (name === 'wraith') {
            this.body.setSize(100, 125);
        } else {
            this.body.setCircle(TYPES[name].circle);
            this.body.setOffset(TYPES[name].offestX, 12);
        }
    }

    spawnShadow(x, y) {
        this.shadow = this.scene.add
            .image(x + 30, y + 30, this.name)
            .setScale(0.8)
            .setTint(0x000000)
            .setAlpha(0.2);
    }

    updateShadow() {
        this.shadow.x = this.x + 20;
        this.shadow.y = this.y + 20;
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
            frameRate: 3,
            repeat: -1,
        });
        this.anims.play(this.name, true);
        this.direction = -1;
    }


    randPlayerFoeShot(shot) {
        let xMarkSpread = Phaser.Math.Between(-10, 10);
        let yMarkSpread = Phaser.Math.Between(-10, 10);
        this.scene.players.shuffle();

        if (this.scene.players.getLength() > 0) {
            let player = this.scene.players.getFirstAlive();
            this.scene.physics.moveTo(
                shot,
                player.x + xMarkSpread,
                player.y + yMarkSpread,
                300
            );
            this.scene.physics.moveTo(
                shot.shadow,
                player.x + xMarkSpread,
                player.y + yMarkSpread,
                300
            );
        } else {
            this.scene.physics.moveTo(
                shot,
                this.scene.width + 50,
                this.scene.height + 50,
                300
            );
            this.scene.physics.moveTo(
                shot.shadow,
                this.scene.width + 50,
                this.scene.height + 50,
                300
            );
        }
    }

    movementManager() {
        if (this.movementCounter % 3 == 0) {
            this.movementOne();
            this.movementCounter++;
        } else if (this.movementCounter % 4 == 0) {
            this.movementCounter++;
            this.movementTwo();
        } else if (this.movementCounter % 5 == 0) {
            this.restokCounter();
            this.movementTree();
        }
    }

    restokCounter() {
        this.movementCounter = this.difficulty;
    }

    movementTree() {
        this.movementTo(900, -500, 1000);

        const shootEvent = this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                if (this.active) {
                    this.backShoots();
                }
            },
            loop: true,
            callbackScope: this
        });
        this.scene.time.delayedCall(
            5000,
            () => {
                shootEvent.destroy();
            },
            null,
            this
        );
        this.scene.time.delayedCall(
            9000,
            () => {
                this.counter = 0;
            },
            null,
            this
        );
        // this.lives++;
        // this.lives++;
        // this.lives++;
    }

    backShoots() {
        let x = Phaser.Math.Between(10, this.scene.weight - 10);
        let teleportY = this.scene.height - 15;
        let array = [];
        let spacing = (this.scene.width - 20) / 20
        let j = 0;

        for (let i = 0; i < 20; i++) {
            if (x + i * spacing < this.scene.width - 10)
                array.push(x + i * spacing);
            else if (10 + j * spacing < x)
                array.push(10 + j * spacing);
        }

        array = this.sortedBackShots(array);
        array.forEach(element => {
            this.backShoot(element, teleportY);
        });
        this.backShoot(shotX, shotY);
    }

    sortedBackShots(array) {
        let target = this.scene.player.x;
        let sorted = array.sort((a, b) => Math.abs(a - target) - Math.abs(b - target));
        sorted.splice(5, 1);
        sorted.splice(6, 1);

        return sorted;
    }


    backShoot(x, y) {
        let shot = new FoeShot(this.scene, x, y, "wraith", this.name);
        this.scene.foeShots.add(shot);
        this.scene.physics.moveTo(
            shot,
            x,
            y - 10,
            300
        );
        shot.shadow.destroy();
    }

    movementTwo() {
        let i;

        for (i = 0; i < 6; i++) {
            this.twoTeleportMove(i);
            i++;
        }

        this.scene.time.delayedCall(
            i * 1000 + 200,
            () => {
                this.counter = 0;
            },
            null,
            this
        );
    }

    twoTeleportMove(i) {
        this.scene.time.delayedCall(
            1000 * i,
            () => {
                this.teleport(150, 150);
            },
            null,
            this
        );
        this.scene.time.delayedCall(
            1000 * (i + 1),
            () => {

                this.teleport(850, 200);
            },
            null,
            this
        );
    }

    teleport(x, y) {
        if (this.active) {
            let razbros = Phaser.Math.Between(-100, 500);
            this.scene.playAudio("wraithFast");
            this.scene.tweens.add({
                targets: this,
                x: { from: this.x, to: x },
                y: { from: this.y, to: y + razbros },
                alpha: { from: 0, to: 1 },
                scale: { from: 0.4, to: 1 },
                duration: 100,
                onComplete: () => {
                    if (this.active) {
                        this.massiveShoot();
                        // this.scene.time.delayedCall(150, 
                        //     this.massiveShoot(),
                        //     null,
                        //     this
                        // );this.scene.time.delayedCall(300, 
                        //     this.massiveShoot(),
                        //     null,
                        //     this
                        // );
                    }
                }
            });
        }
    }

    massiveShoot() {
        for (let i = 0; i < 20; i++) {
            let angle = (2 * Math.PI * i) / 20;
            let pointX = this.x + 10 * Math.cos(angle);
            let pointY = this.y + 10 * Math.sin(angle);
            let shot = new FoeShot(this.scene, this.x, this.y, "wraith", this.name);
            this.scene.foeShots.add(shot);
            this.scene.physics.moveTo(
                shot,
                pointX,
                pointY,
                300
            );
            shot.shadow.destroy();
        }
    }

    movementOne() {
        let razbros = Phaser.Math.Between(0, 100);

        const shootEvent = this.scene.time.addEvent({
            delay: 200,
            callback: () => {
                if (this.active) {
                    let shot = new FoeShot(this.scene, this.x, this.y, "wraith", this.name);
                    this.scene.foeShots.add(shot);
                    this.randPlayerFoeShot(shot);
                }
            },
            loop: true,
            callbackScope: this
        });
        this.scene.time.delayedCall(
            0,
            () => {
                if (this.active) {
                    this.movementTo(200 - razbros, 200 - razbros, 2000);
                }
            },
            null,
            this
        );
        this.scene.time.delayedCall(
            2100,
            () => {
                if (this.active) {
                    this.movementTo(this.scene.width - 90 - razbros, 150 - razbros, 2000);
                }
            },
            null,
            this
        );
        this.scene.time.delayedCall(
            4150,
            () => {
                if (this.active) {
                    this.movementTo(this.scene.center_width + 200 - razbros, 450 - razbros, 2000);
                }
            },
            null,
            this
        );
        this.scene.time.delayedCall(
            6150,
            () => {
                shootEvent.destroy();
                this.counter = 0;
            },
            null,
            this
        );
    }

    movementTo(x, y, time) {
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

    rage() {
        this.scene.tweens.add({
            targets: this,
            duration: 1000,
            tint: { from: 0xffffff, to: 0xff0000 },
        });
        this.difficulty++;
    }

    update() {
        // if (this.lives <= 20 && this.booster === true) {
        //     this.lives = 40;
        //     this.rage();
        //     this.booster = false;
        // }
        if (this.counter == 0) {
            this.counter++
            this.movementManager();;
        }
        this.updateShadow();
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
        this.showPoints(this.points);
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
        if (
            this.name !== "foe2" &&
            this.scene &&
            this.scene.scene.isActive() &&
            this.shadow &&
            this.shadow.active
        )
            this.shadow.destroy();

        this.scene.playAudio("explosion");
        this.scene.endScene(1);

        this.scene.foes.foeCount--;
        this.scene.spawnShake(this.x, this.y);
        this.destroy();
    }

    showPoints(score, color = 0xff0000) {
        let text = this.scene.add
            .bitmapText(this.x + 20, this.y - 30, "wendy", "+" + score, 40, color)
            .setOrigin(0.5);
        this.scene.tweens.add({
            targets: text,
            duration: 800,
            alpha: { from: 1, to: 0 },
            y: { from: this.y - 20, to: this.y - 80 },
            onComplete: () => {
                text.destroy();
            },
        });
    }
}

export default Wraith;