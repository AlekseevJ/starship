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
        this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name, 60));
        this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name, -60));
    }

    massacre(x, y, powerUp) {
       this.oneMassacreShoot(x, y, powerUp);
       this.oneMassacreShoot(x, y+15, powerUp, 2);
    }

    oneMassacreShoot(x, y, powerUp, rectangle = 1) {
        this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name, -10* rectangle));
        this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name, 10 * rectangle));
        this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name));
        this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name, 30* rectangle));
        this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name, -30 * rectangle));
    }
}