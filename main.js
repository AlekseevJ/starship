import Phaser, { Physics } from "phaser";
import Splash from "./src/starship/splash";
import Transition from "./src/starship/transition";
import Game from "./src/starship/game";
import Outro from "./src/starship/outro";
import Bootloader from "./src/starship/bootloader";
import GameOver from "./src/starship/gameover";
import AtomicLevelIntro from "./src/starship/atomic_level_intro";

localStorage.clear();
const config = {
    width: 1000,
    height: 800,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    autoRound:false,
    parent: "contenedor",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true,
            fps: 60,
        },
    },
    scene: [Bootloader, Splash, Transition, Game, Outro, GameOver, AtomicLevelIntro],
}

const game = new Phaser.Game(config);