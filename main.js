import Phaser, { Physics } from "phaser";
import Splash from "./src/starship/splash";
import Transition from "./src/starship/transition";
import Game from "./src/starship/game";
import Outro from "./src/starship/outro";
import Bootloader from "./src/starship/bootloader";

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
            debug: false,
        },
    },
    scene: [Bootloader, Splash, Transition, Game, Outro],
}

const game = new Phaser.Game(config);
