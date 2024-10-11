import FoeShot from "./foe_shot";
import Explosion from "./explosion";

const TYPES = {
  foe0: { points: 400, lives: 1, circle: 19, offestX: 12 },
  foe1: { points: 500, lives: 3, circle: 19, offestX: 12 },
  foe2: { points: 800, lives: 2, circle: 19, offestX: 12 },
  sultan: { points: 1500, lives: 80, circle: 45, offestX: 40 },
  guinxu: { points: 10000, lives: 100, circle: 19, offestX: 12 },
  wraith: { points: 3000, lives: 60, circle: 30, offestX: 12},
};

class Foe extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, name = "foe0", velocityX = 0, velocityY = 0) {
    super(scene, x, y, name);
    this.name = name;
    this.points = TYPES[name].points;
    this.lives = TYPES[name].lives;
    this.id = Math.random();

    if (this.name !== "foe2") {
      this.spawnShadow(x, y);
    }

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.setSizeFoe(name);
    this.body.setVelocityX(velocityX);
    this.body.setVelocityY(velocityY);
    this.setData("vector", new Phaser.Math.Vector2());

    if (this.name === "guinxu") {
      this.setGuinxuShot();
    }
    
    this.init();
    this.guinxuShotCounter = 1;
    this.guinxuRandShotParam = 6;
  }

  setSizeFoe(name) {
    if (name === 'sultan') {
      this.body.setSize(125, 80);
    } else if(name === 'guinxu') {
      this.body.setSize(90, 110);
    } else if(name === 'wraith') {
      this.body.setSize(100, 125);
      
    } else {
      this.body.setCircle(TYPES[name].circle);
      this.body.setOffset(TYPES[name].offestX, 12);
    }
  }

  changeVelocityY(velocity) {
    this.body.setVelocityY(velocity);
  }

  setGuinxuShot() {
    this.patternIndex = 0;
    this.pattern = Phaser.Utils.Array.NumberArrayStep(-300, 300, 50);
    this.pattern = this.pattern.concat(
      Phaser.Utils.Array.NumberArrayStep(300, -300, -50)
    );
    this.scene.tweens.add({
      targets: this,
      duration: 2000,
      y: { from: this.y, to: this.y + Phaser.Math.Between(100, -100) },
      x: { from: this.x, to: this.x + Phaser.Math.Between(100, -100) },
      yoyo: true,
      repeat: -1,
    });
  }

  spawnShadow(x, y) {
    this.shadow = this.scene.add
      .image(x + 20, y + 20, this.name)
      .setScale(0.7)
      .setTint(0x000000)
      .setAlpha(0.4);
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
      frameRate: 10,
      repeat: -1,
    });
    this.anims.play(this.name, true);
    this.direction = -1;
  }

  randPlayerFoeShot(shot) {
    let xMarkSpread = Phaser.Math.Between(-100, 100);
    let yMarkSpread = Phaser.Math.Between(-100, 100);
    this.scene.players.shuffle();
    if (this.scene.players.getLength() > 0) {
      let player = this.scene.players.getFirstAlive();
      this.scene.physics.moveTo(
        shot,
        player.x+xMarkSpread,
        player.y+yMarkSpread,
        300
      );
      this.scene.physics.moveTo(
        shot.shadow,
        player.x+xMarkSpread,
        player.y+yMarkSpread,
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

  update() {
    if (this.y > this.scene.height + 64) {
      if (this.name !== "foe2") this.shadow.destroy();
      this.scene.foes.foeCount--;
      this.destroy();
    }

    if (this.name === "guinxu" && Phaser.Math.Between(1, this.guinxuRandShotParam) > this.guinxuRandShotParam -1) {
      if(this.guinxuShotCounter % 500 == 0){
        this.guinxuRandShotParam = 100;
        this.guinxuShotCounter = 1;
        //todo добавить звук поломки гуинксу

         this.scene.time.delayedCall(3000, () => this.guinxuRandShotParam = 6, null, this)
        };
        this.guinxuShotCounter++;
      this.guinxuShot();
    } else if (this.name === "sultan" && Phaser.Math.Between(1, 55) > 54) {
      if (!this.scene || !this.scene.player) return;
      this.scene.playAudio("foeshot");
      let shot = new FoeShot(this.scene, this.x + 30, this.y, "sultan", this.name);
      this.scene.foeShots.add(shot);
      this.randPlayerFoeShot(shot);
      let shot2 = new FoeShot(this.scene, this.x - 30, this.y, "sultan", this.name);
      this.scene.foeShots.add(shot2);
      this.randPlayerFoeShot(shot2);
    }


    else if (Phaser.Math.Between(1, 251) > 250) {
      if (!this.scene || !this.scene.player) return;
      this.scene.playAudio("foeshot");
      let shot = new FoeShot(this.scene, this.x, this.y, "foe", this.name);
      this.scene.foeShots.add(shot);
      this.randPlayerFoeShot(shot);
    }

    if (this.name !== "foe2") {
      this.updateShadow();
    }
  }

  guinxuShot() {
    if (!this.scene || !this.scene.player) return;

    this.scene.playAudio("foeshot");
    let shot = new FoeShot(
      this.scene,
      this.x,
      this.y,
      "foe",
      this.name,
      this.pattern[this.patternIndex],
      300
    );
    this.scene.foeShots.add(shot);
    this.patternIndex =
      this.patternIndex + 1 === this.pattern.length ? 0 : ++this.patternIndex;
  }

  dead() {
    let radius = 60;
    let explosionRad = 20;
    if (this.name === "guinxu" || this.name === "sultan") {
      radius = 220;
      explosionRad = 220;
      this.scene.cameras.main.shake(500);
    }

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

    if (this.name === "guinxu") {
      this.scene.number = 5;
      this.scene.playAudio("explosion");
      this.scene.endScene();
    }
    if (this.name === "sultan") {
      this.scene.playAudio("explosion");
      this.scene.endScene();
    }
    this.scene.foes.foeCount--;
    if (Phaser.Math.Between(1, 15) > 14) {
      this.scene.spawnShake(this.x, this.y);
    }
    this.destroy();
  }

  sliderDead() {
    this.shadow.destroy();
    this.scene.foes.foeCount--;
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

export default Foe;