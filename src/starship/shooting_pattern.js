import Shot from './shot';

export default class ShootingPatterns {
    constructor(scene, name) {
        this.scene = scene;
        this.name = name;
        this.shootingMethods = {
            water: this.single.bind(this),
            fruit: this.tri.bind(this),
            vanila: this.quintus.bind(this),
            chocolate: this.massacre.bind(this),
            wiggle: this.wiggle.bind(this),
        };
    }

    shoot(x, y, powerUp) {
        this.shootingMethods[powerUp](x, y, powerUp);
    }

    single(x, y, powerUp) {
        this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name));
    }

    tri(x, y, powerUp) {
        this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name, -60));
        this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name));
        this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name, 60));
    }

    quintus(x, y, powerUp) {
        this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name, -30));
        this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name, 30));
        this.scene.shots.add(new Shot(this.scene, x+15, y, powerUp, this.name, 60));
        this.scene.shots.add(new Shot(this.scene, x-15, y, powerUp, this.name, -60));
    }

    massacre(x, y, powerUp) {
       this.oneMassacreShoot(x, y, powerUp);
    //    this.oneMassacreShoot(x, y+15, powerUp, 2);
    }

    oneMassacreShoot(x, y, powerUp, rectangle = 1) {
        this.scene.shots.add(new Shot(this.scene, x-15, y, powerUp, this.name, -10* rectangle));
        this.scene.shots.add(new Shot(this.scene, x+15, y, powerUp, this.name, 10 * rectangle));
        this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name));
        this.scene.shots.add(new Shot(this.scene, x+25, y, powerUp, this.name, 30* rectangle));
        this.scene.shots.add(new Shot(this.scene, x-25, y, powerUp, this.name, -30 * rectangle));
    }

    wiggle(x, y, powerUp) {
        let shot = new Shot(this.scene, x, y, powerUp, this.name);
        shot.eventTweens = this.scene.tweens.add({
            targets: [shot, shot.shadow],
            radius: 200,
            ease: 'Circ.easeIn',
            duration: 500,
            yoyo: true,
            // onUpdate: function ()
            // {
            //     if(shot.active && shot.shadow.active) {
            //     Phaser.Actions.RotateAroundDistance(shot, { x: shot.x, y: shot.y }, 0.02, 50);}
            // }
        });
    
    }
}