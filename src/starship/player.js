import { Game } from "phaser";
import Explosion from "./explosion";
import { LightParticle } from "./light_particle";
import ShootingPatterns from "./shooting_pattern";

class Player extends Phaser.GameObjects.Sprite {
    constructor(
        scene,
        x, y,
        name = "player1",
        powerUp = "water",
        hp = 3,
        life = 2,
    ) {
        super(scene, x, y, name);
        this.signalEvent = Array();
        this.name = name;
        this.spawnShadow(x, y);
        this.powerUp = powerUp;
        this.id = Math.random();
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
        this.body.setAllowGravity(false);
        this.body.setCircle(26);
        this.body.setOffset(6, 9);
        this.power = 0;
        this.blinking = false;
        this.shootingPatterns = new ShootingPatterns(this.scene, this.name);
        this.init();
        this.setControls();
        this.actions = {
            up: [() => this.y - 400, () => this.x],
            down: [() => this.y + 400, () => this.x],
            left: [() => this.y, () => this.x - 400],
            right: [() => this.y, () => this.x + 400],
        };
        this.hp = hp;
        this.life = life;
        this.addHpCounter();
        this.addLifeCounter();
    }

    addLifeCounter() {
        this.lifeCounter = this.scene.add
        .bitmapText(
            175,
            165,
            "wendy",
            String(this.life),
            50
        )
        .setOrigin(0.5)
        .setScrollFactor(0);
    }

    addTextForHpLife(x,y,text) {
       return this.scene.add
            .bitmapText(
                x,
                y,
                "wendy",
                String(text),
                50
            )
            .setOrigin(0.5)
            .setScrollFactor(0);
    }

    addHpCounter() {
        if(this.name == 'player1'){
        this.hpCounterBar = this.scene.add
            .bitmapText(
                150,
                160,
                "wendy",
                String(this.hp),
                50
            )
            .setOrigin(0.5)
            .setScrollFactor(0);
        }
        else {
            this.hpCounterBar = this.scene.add
            .bitmapText(
                this.scene.width -150,
                160,
                "wendy",
                String(this.hp),
                50
            )
            .setOrigin(0.5)
            .setScrollFactor(0);
        }
    }

    spawnShadow(x, y) {
        this.shadow = this.scene.add
            .image(x + 20, y + 20, this.name)
            .setTint(0x000000)
            .setAlpha(0.4);
    }

    init() {
        if (this.scene.anims.exists(this.name)) {
            this.anims.play(this.name, true);
            return;
        }
        this.scene.anims.create({
            key: this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name, {
                start: 0,
                end: 0,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.scene.anims.create({
            key: this.name + "right",
            frames: this.scene.anims.generateFrameNumbers(this.name,
                {
                    start: 1,
                    end: 1,
                }
            ),
            frameRate: 10,
            repeat: -1,
        });
        this.scene.anims.create({
            key: this.name + "left",
            frames: this.scene.anims.generateFrameNumbers(this.name,
                {
                    start: 2,
                    end: 2,
                }
            ),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.play(this.name, true);
    }

    setControls() {
        if (this.name == "player1") {
            this.SPACE = this.scene.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.SPACE
            );
            this.cursor = this.scene.input.keyboard.createCursorKeys();

            this.up = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
            this.left = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
            this.down = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
            this.right = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);


            let lastTimeUp = 0;
            this.dashUp = this.scene.input.keyboard.on("keydown-UP", () => {

                let clickDelayUp = performance.now() - lastTimeUp;
                lastTimeUp = performance.now();
                if (clickDelayUp < 200) {
                    this.signalEvent.push(['dash', 'up']);
                }

            });
            let lastTimeLeft = 0;
            this.dashLeft = this.scene.input.keyboard.on("keydown-LEFT", () => {
                let clickDelayLeft = performance.now() - lastTimeLeft;
                lastTimeLeft = performance.now();
                if (clickDelayLeft < 200) {
                    this.signalEvent.push(['dash', 'left']);
                }
            });
            let lastTimeDown = 0;
            this.dashDown = this.scene.input.keyboard.on("keydown-DOWN", () => {
                let clickDelayDown = performance.now() - lastTimeDown;
                lastTimeDown = performance.now();
                if (clickDelayDown < 200) {
                    this.signalEvent.push(['dash', 'down']);
                }
            });
            let lastTimeRight = 0;
            this.dashRight = this.scene.input.keyboard.on("keydown-RIGHT", () => {
                let clickDelayRight = performance.now() - lastTimeRight;
                lastTimeRight = performance.now();
                if (clickDelayRight < 200) {
                    this.signalEvent.push(['dash', 'right']);
                }
            });
        }
        else {
            this.SPACE = this.scene.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.C
            );

            this.up = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
            this.left = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
            this.down = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
            this.right = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        }
    }

    shoot() {
        this.scene.playAudio("shot");
        this.shootingPatterns.shoot(this.x, this.y, this.powerUp);
    }

    update(timestep, delta) {
        if (this.death) return;
        this.hpCounterBar.setText(this.hp);
        this.lifeCounter.setText(this.life);
        if (this.signalEvent.length > 0) {
            this.dash();
        }
        if (this.left.isDown) {
            this.x -= 5;
            this.anims.play(this.name + "left", true);
            this.shadow.setScale(0.5, 1);
        } else if (this.right.isDown) {
            this.x += 5;
            this.anims.play(this.name + "right", true);
            this.shadow.setScale(0.5, 1);
        } else {
            this.anims.play(this.name, true);
            this.shadow.setScale(1, 1);
        }

        if (this.up.isDown) {
            this.y -= 5;
        } else if (this.down.isDown) {
            this.y += 5;
        }

        if (Phaser.Input.Keyboard.JustDown(this.SPACE)) {
            this.shoot();
        }


        this.scene.trailLayer.add(
            new LightParticle(this.scene, this.x, this.y, 0xffffff, 10)
        );
        this.updateShadow();
    }

    updateShadow() {
        this.shadow.x = this.x + 20;
        this.shadow.y = this.y + 20;
    }

    showPoints(score, color = 0xff0000) {
        let text = this.scene.add
            .bitmapText(this.x + 20, this.y - 30, "starshipped", score, 20, 0xfffd37)
            .setOrigin(0.5);
        this.scene.tweens.add({
            targets: text,
            duration: 2000,
            alpha: { from: 1, to: 0 },
            y: { from: text.y - 10, to: text.y - 100 },
        });
    }

    dead() {
        const explosion = this.scene.add
            .circle(this.x, this.y, 5)
            .setStrokeStyle(40, 0xffffff);
        this.scene.tweens.add({
            targets: explosion,
            radius: { from: 10, to: 512 },
            alpha: { from: 1, to: 0.3 },
            duration: 300,
            onComplete: () => {
                explosion.destroy();
            },
        });
        this.hpCounterBar.destroy();
        this.lifeCounter.destroy();
        this.scene.cameras.main.shake(500);
        this.death = true;
        this.shadow.destroy();
        this.scene.registry.set("currentPowerUp" + this.name, "water");
        new Explosion(this.scene, this.x, this.y, 40);
        super.destroy();
    }

    penis(action) {
        return this.actions[action];
    }

    dash() {
        let action = this.signalEvent.pop()[1];

        this.blinking = true;
        this.scene.tweens.add({
            targets: this,
            duration: 450,
            y: { from: this.y, to: this.actions[action][0] },
            x: { from: this.x, to: this.actions[action][1] },
            alpha: { from: 0, to: 1 },
            scale: { from: 0.8, to: 1 },
            onComplete: () => {
                this.blinking = false;
            },
        });
        this.updateShadow();
        this.scene.playAudio("dash");
        this.signalEvent = Array();
        return;


    }
}

export default Player;