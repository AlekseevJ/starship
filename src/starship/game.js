import FoeGenerator from './foe_generator';
import Player from './player';
import PowerUp from './power_up';
import SceneEffect from './scene_effect';
import PlayerEvent from './player_event';
import BarrierGenerator from "./barrier_generator";

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game" });
    this.player = null;
    this.player2 = null;
    this.score = 0;
    this.scoreText = null;
  }

  init(data) {
    this.name = data.name;
    this.number = data.number;
    this.next = data.next;
    this.playersNumber = data.players;
    this.atomic = data.atomic ? data.atomic : false;
    if (this.playersNumber == 1) {
      if (this.number === 1) {
        this.registry.set("currentPowerUp" + 'player1', 'water');
        this.registry.set("player1hp", 3);
        this.registry.set("player1life", 2);
      }
    } else {
      if (this.number === 1) {
        this.registry.set("currentPowerUp" + 'player1', 'water');
        this.registry.set("currentPowerUp" + 'player2', 'water');
        this.registry.set("player1hp", 3);
        this.registry.set("player1life", 2);
        this.registry.set("player2hp", 3);
        this.registry.set("player2life", 2);
      }
    }
    this.volume = { volume: 0.5 };
  }

  create() {
    if (!this.atomic) {
      this.duration = this.time * 1000;
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      new SceneEffect(this).simpleOpen(() => 0);
      this.addBackground();
      this.cameras.main.setBackgroundColor(0x333333);
      this.lights.enable();
      this.lights.setAmbientColor(0x666666);
      this.addScores();
      this.addFoes();
      this.addPowerUps();
      this.addPlayers();
      this.addShots();
      this.loadAudios();
      this.addColliders();
      this.tilePosition = 10
      // this.spawnShake(150, 150);
      // this.spawnShake(250, 150);
      // this.spawnShake(350, 150);
      // this.spawnShake(450, 150);
      this.distanceIncrement = 1;
    } else {
      this.foeGroup = this.add.group();
      this.duration = this.time * 1000;
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      new SceneEffect(this).simpleOpen(() => 0);
      this.addBackgroundAtomic();
      this.cameras.main.setBackgroundColor(0x333333);
      this.lights.enable();
      this.lights.setAmbientColor(0x666666);

      this.tilePosition = 20;
      this.addScores();
      this.addPowerUps();
      this.addPlayersEvent();
      this.addShots();
      this.loadAudios();
      this.initBarierGenerator();
      this.distanceIncrement = 1;
      this.addCollidersAtomic();
    }
  }

  initBarierGenerator() {
    this.barrierGroup = this.add.group();
    this.foes = new BarrierGenerator(this);
  }

  addBackgroundAtomic() {
    this.background = this.add
      .tileSprite(0, 0, this.width, this.height, "stage_atomic")
      .setOrigin(0)
      .setScrollFactor(0, 1)
      ;
  }
  addBackground() {
    this.background = this.add
      .tileSprite(0, 0, this.width, this.height, "stage" + this.number)
      .setOrigin(0)
      .setScrollFactor(0, 1);
  }
  sultanDefeat() {
    this.scene.time.delayedCall(2000, () => this.finishScene(), null, this);
  }

  spawnShake(x, y) {
    let shake = new PowerUp(this, x, y);
    this.powerUps.add(shake);
    this.time.delayedCall(7000, () => { this.powerUps.remove(shake); shake.destroy() }, null, this)
  }


  addScores() {
    this.scores = {
      player1: {},
      player2: {},
    };

    this.scores["player1"]["scoreText"] = this.add
      .bitmapText(
        150,
        16,
        "wendy",
        String(this.registry.get("score_player1")).padStart(6, "0"),
        50
      )
      .setOrigin(0.5)
      .setScrollFactor(0);
    this.scores["player2"]["scoreText"] = this.add
      .bitmapText(this.width - 150, 16, "wendy", "0".padStart(6, "0"), 50)
      .setOrigin(0.5)
      .setScrollFactor(0);
  }
  addPlayersEvent() {
    this.trailLayer = this.add.layer();
    this.players = this.add.group();
    this.player = new PlayerEvent(this,
      this.center_width,
      this.center_height + 280,
      'player1',
      this.registry.get("currentPowerUp" + 'player1'),
      this.registry.get('player1hp'),
      this.registry.get('player1life'));
    this.players.add(this.player);

    if (this.playersNumber > 1) {
      this.player2 = new PlayerEvent(this,
        this.center_width + 70,
        this.center_height + 280,
        'player2',
        this.registry.get("currentPowerUp" + 'player2'),
        this.registry.get('player2hp'),
        this.registry.get('player2life'));
      this.players.add(this.player2);
    }
  }

  addPlayers() {
    this.trailLayer = this.add.layer();
    this.players = this.add.group();
    this.player = new Player(this,
      this.center_width,
      this.center_height,
      'player1',
      this.registry.get("currentPowerUp" + 'player1'),
      this.registry.get('player1hp'),
      this.registry.get('player1life'));
    this.players.add(this.player);

    if (this.playersNumber > 1) {
      this.player2 = new Player(this,
        this.center_width - 10,
        this.center_height - 10,
        'player2',
        this.registry.get("currentPowerUp" + 'player2'),
        this.registry.get('player2hp'),
        this.registry.get('player2life'));
      this.players.add(this.player2);
    }

  }

  addShots() {
    this.shotsLayer = this.add.layer();
    this.shots = this.add.group();
  }

  addFoes() {
    this.foeGroup = this.add.group();
    this.foeWaveGroup = this.add.group();
    this.foeShots = this.add.group();
    this.foes = new FoeGenerator(this);
  }

  addPowerUps() {
    this.available = ["water", "fruit", "vanila", "chocolate"];
    this.powerUps = this.add.group();
  }
  addCollidersAtomic() {
    this.physics.add.collider(
      this.players,
      this.barrierGroup,
      this.hitPlayer,
      () => {
        return true;
      },
      this
    );

    this.physics.world.on("worldbounds", this.onWorldBoundsAtomic);
  }
  addColliders() {
    this.physics.add.collider(
      this.players,
      this.foeGroup,
      this.crashFoe,
      () => {
        return true;
      },
      this
    );

    this.physics.add.collider(
      this.players,
      this.foeWaveGroup,
      this.crashFoe,
      () => {
        return true;
      },
      this
    );

    this.physics.add.overlap(
      this.shots,
      this.foeGroup,
      this.destroyFoe,
      () => {
        return true;
      },
      this
    );

    this.physics.add.overlap(
      this.shots,
      this.foeWaveGroup,
      this.destroyFoe,
      () => {
        return true;
      },
      this
    );

    this.physics.add.collider(
      this.players,
      this.powerUps,
      this.pickPowerUp,
      () => {
        return true;
      },
      this
    );

    this.physics.add.overlap(
      this.players,
      this.foeShots,
      this.hitPlayer,
      () => {
        return true;
      },
      this
    );

    this.physics.add.collider(
      this.shots,
      this.foeShots,
      this.destroyShot,
      () => {
        return true;
      },
      this
    );
    this.physics.world.on("worldbounds", this.onWorldBounds);
  }

  hitByHpPlayer(player) {
    if (this.atomic) {
      if (this.distanceIncrement > 1)
        this.distanceIncrement--;
    }
    if (player.blinking === false) {
      player.hp--;
      this.downPowerUp(player);
      player.downHpBar();
      this.playAudio('playerhit');
      this.registry.set(player.name + "hp", player.hp);
      player.blinking = true;
      this.tweens.add({
        targets: player,
        duration: 100,
        alpha: { from: 0, to: 1 },
        repeat: 10,
        onComplete: () => {
          player.blinking = false;
        },
      });
      if (player.hp == 0) {
        player.life--;
        player.lifeCounter.setText(player.life);

        if (player.life < 0) {
          this.players.remove(player);
          player.dead();
          this.playAudio("explosion");
          if (this.players.countActive() <= 0) {
            this.time.delayedCall(
              2000,
              () => {
                if (!this.atomic) {
                  this.gameOverScene();
                }
                else this.gameOverSceneAtomic();
              },
              null,
              this
            );
          }
        } else {
          this.registry.set(player.name + "life", player.life);
          this.players.remove(player);
          this.time.delayedCall(
            2000,
            () => {
              this.respawnPlayer(player.name);
            },
            null,
            this
          );
          player.dead();
          this.playAudio("explosion");
        }
        // this.time.delayedCall(1000, () => this.respawnPlayer(player.name), null, this);

      }
      else {
        // todo добавить звук снижения hp
      }
    }
  }
  onWorldBoundsAtomic(body, t) {
    const name = body.gameObject.name.toString();
    if (["foeshot", "shot"].includes(name)) {
      body.gameObject.destroy();
    }
  }
  onWorldBounds(body, t) {
    const name = body.gameObject.name.toString();
    if (["foeshot", "shot"].includes(name)) {
      body.gameObject.shadow.destroy();
      body.gameObject.destroy();
    }
  }


  destroyShot(shot, foeShot) {
    const point = this.lights.addPointLight(shot.x, shot.y, 0xffffff, 10, 0.7);
    this.tweens.add({
      targets: point,
      duration: 400,
      scale: { from: 1, to: 0 },
    });
    this.playAudio("foexplosion");
    shot.shadow.destroy();
    shot.destroy();
    foeShot.shadow.destroy();
    foeShot.shot();
    this.updateScore(shot.playerName, 50);
  }



  destroyFoe(shot, foe) {
    foe.lives--;
    this.playAudio("foexplosion");
    const point = this.lights.addPointLight(shot.x, shot.y, 0xffffff, 10, 0.7);
    this.tweens.add({
      targets: point,
      duration: 400,
      scale: { from: 1, to: 0 },
    });
    if (!foe.name === "wraith") {
      this.tweens.add({
        targets: foe,
        duration: 400,
        tint: { from: 0xffffff, to: 0xff0000 },
      });
    }
    this.updateScore(shot.playerName, 50);
    this.tweens.add({ targets: foe, y: "-=10", yoyo: true, duration: 100 });

    shot.shadow.destroy();
    shot.destroy();
    if (foe.lives === 0) {
      this.playAudio("foedestroy");
      const point = this.lights.addPointLight(
        shot.x,
        shot.y,
        0xffffff,
        10,
        0.7
      );
      this.tweens.add({
        targets: point,
        duration: 400,
        scale: { from: 1, to: 0 },
      });
      this.updateScore(shot.playerName, foe.points);
      foe.dead();
    }
  }


  hitPlayer(player, shot) {
    this.hitByHpPlayer(player);

    shot.shadow.destroy();
    shot.destroy();
  }

  crashFoe(player, foe) {
    this.hitByHpPlayer(player);

    if (foe.name === "guinxu") {
      foe.lives = foe.lives - 5; if (foe.lives < 0) foe.dead();
    }
    else if (foe.name === "wraith") {
      foe.lives = foe.lives - 1; if (foe.lives < 0) foe.dead();
    }
    else
      foe.dead();
  }


  pickPowerUp(player, powerUp) {
    this.playAudio("stageclear1");
    this.updatePowerUp(player, powerUp);
    this.tweens.add({
      targets: player,
      duration: 200,
      alpha: { from: 0.5, to: 1 },
      scale: { from: 1.4, to: 1 },
      repeat: 3,
    });
    powerUp.destroy();
  }

  boost() {
    if (this.distanceIncrement < 5) {
      this.distanceIncrement++;
    }
  }
  respawnPlayer(name) {
    this.registry.set(name + 'hp', 3);
    this.registry.set("currentPowerUp" + name, 'water');
    if (name == "player2") {
      if (!this.atomic) {
        this.player2 = new Player(this, this.center_width, this.center_height, name, 'water',
          this.registry.get(name + 'hp'), this.registry.get(name + 'life'));
      } else {
        this.player2 = new PlayerEvent(this, this.center_width + 70,
          this.center_height + 280, name, 'water',
          this.registry.get(name + 'hp'), this.registry.get(name + 'life'));
      }
      this.player2.blinking = true;
      this.players.add(this.player2);
      this.tweens.add({
        targets: this.player2,
        duration: 100,
        alpha: { from: 0, to: 1 },
        repeat: 10,
        onComplete: () => {
          this.player2.blinking = false;
        },
      });
    } else {
      if (!this.atomic) {
        this.player = new Player(this, this.center_width, this.center_height, name, 'water',
          this.registry.get(name + 'hp'), this.registry.get(name + 'life'));
      }
      else this.player = new PlayerEvent(this, this.center_width, this.center_height + 280, name, 'water',
        this.registry.get(name + 'hp'), this.registry.get(name + 'life'));

      this.player.blinking = true;
      this.players.add(this.player);
      this.tweens.add({
        targets: this.player,
        duration: 100,
        alpha: { from: 0, to: 1 },
        repeat: 10,
        onComplete: () => {
          this.player.blinking = false;
        },
      });
    }
  }

  loadAudios() {
    this.audios = {
      shot: this.sound.add("shot", this.volume),
      foeshot: this.sound.add("foeshot", this.volume),
      explosion: this.sound.add("explosion", this.volume),
      foexplosion: this.sound.add("foexplosion", this.volume),
      foedestroy: this.sound.add("foedestroy", this.volume),
      stageclear1: this.sound.add("stageclear1", this.volume),
      stageclear2: this.sound.add("stageclear2", this.volume),
      boss: this.sound.add("boss", this.volume),
      dash: this.sound.add("dash", this.volume),
      sultanarrive: this.sound.add("sultanarrive", this.volume),
      playerhit: this.sound.add('playerhit', this.volume),
      sultan_fight: this.sound.add("sultan_fight", { volume: 0.5, loop: true }),
      wraith: this.sound.add("wraith", { volume: 0.5, loop: true }),
      wraithFast: this.sound.add("wraithFast", this.volume),
    };
  }

  playAudio(key) {
    this.audios[key].play();
  }

  update() {
    if (this.player){this.player.update();}
    if (this.player2) this.player2.update();
    this.foes.update();
    this.background.tilePositionY -= this.tilePosition * this.distanceIncrement;
  }

  shadowDestroy() {
    this.foeWaveGroup.children.entries.forEach((foe) => foe.shadow.destroy());
    this.shots.children.entries.forEach((shot) => shot.shadow.destroy());
    this.foeShots.children.entries.forEach((shot) => shot.shadow.destroy());
  }
  endScene(i = 0) {
    if (!this.atomic)
      this.shadowDestroy();
    if (i == 0) {
      if (!this.atomic) {
        this.players.getChildren().forEach((player) => {
          player.destroyControl();
          player.body.setVelocity(0);
          player.blinking = true;
          this.tweens.add({
            targets: player,
            y: { from: player.y, to: 541 },
            x: { from: player.x, to: 498 },
            duration: 3000,
            ease: "Power2",
            repeat: 0,
          })
        });
      }
      this.time.delayedCall(
        5000,
        () => {
          this.finishScene();
        },
        null,
        this
      );
    }
    else {
      this.time.delayedCall(
        2000,
        () => {
          this.finishSceneAtomic();
        },
        null,
        this
      );
    }
  }
  gameOverSceneAtomic() {
    this.time.delayedCall(
      400,
      () => {
        this.game.sound.stopAll();
        this.scene.stop("game");
        this.scene.start("gameover", { playerCount: this.playersNumber });
      },
      null,
      this
    );
  }

  gameOverScene() {
    this.shadowDestroy();
    this.time.delayedCall(
      2000,
      () => {
        this.game.sound.stopAll();
        this.scene.stop("game");
        this.scene.start("gameover", { playerCount: this.playersNumber });
      },
      null,
      this
    );
  }

  finishSceneAtomic() {
    this.players.getChildren().forEach((chilg) => { if (chilg.active) chilg.playerHpBar.forEach((chilg) => chilg.destroy()) });
    this.game.sound.stopAll();
    this.scene.stop("game");
    const scene = 'atomic_level_intro';
    this.scene.start(scene, {
      next: "game",
      name: "STAGE",
      number: this.number,
      players: this.playersNumber,
      player1hp: this.player.hp,
      player1life: this.player.life,
      atomic: true,
    });
  }

  finishScene() {
    this.players.getChildren().forEach((chilg) => { if (chilg.active) chilg.playerHpBar.forEach((chilg) => chilg.destroy()) });
    this.game.sound.stopAll();
    this.scene.stop("game");
    const scene = this.number < 5 ? "transition" : "outro";
    this.scene.start(scene, {
      next: "game",
      name: "STAGE",
      number: this.number + 1,
      players: this.playersNumber,
      player1hp: this.player.hp,
      player1life: this.player.life,
      atomic: false,
    });
  }

  updatePowerUp(player, powerUp) {
    let lvlUp = this.available.findIndex(value => value == player.powerUp) + 1;
    if (lvlUp + 1 <= this.available.length) {
      player.powerUp = this.available[lvlUp];
      player.actualCurrentPowerUp();
      this.registry.set("currentPowerUp" + player.name, player.powerUp);
    } else {
      this.updateScore(player.name, 5000);
    }
  }
  downPowerUp(player, powerUp) {
    let lvlUp = this.available.findIndex(value => value == player.powerUp) + 1;
    if (lvlUp > 1) {
      player.powerUp = this.available[lvlUp - 2];
      player.actualCurrentPowerUp();
      this.registry.set("currentPowerUp" + player.name, player.powerUp);
    }
  }

  updateScore(playerName, points = 0) {
    const score = +this.registry.get("score_" + playerName) + points;
    this.registry.set("score_" + playerName, score);
    this.scores[playerName]["scoreText"].setText(
      String(score).padStart(6, "0")
    );
    this.tweens.add({
      targets: this.scores[playerName]["scoreText"],
      duration: 200,
      tint: { from: 0x0000ff, to: 0xffffff },
      scale: { from: 1.2, to: 1 },
      repeat: 2,
    });
  }
}