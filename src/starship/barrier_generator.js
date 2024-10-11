import FoeShot from './foe_shot';

export default class BarrierGenerator {
    constructor(scene) {
        this.scene = scene;
        this.waveFoes = [];
        this.activeWave = false;
        this.waves = 0;
        this.foeCount = 0;
        // this.addFoeCounter();
        this.eventCounter = 0;
        this.markSultan = false;
        this.distance = 0;
        this.addTimerCounter();
        this.addDistanceMeter();
        this.generateBarriers();
        this.distanceMax = 180;
    }


    generateBarriers() {
        
        this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                let c =Phaser.Math.Between(1,15);
                this.generateBarrier(c);
            },
            loop: true
        });
    }

    generateBarrier(c) {
        const x = Phaser.Math.Between(25, this.scene.width-25);
        let array = [];
        let distance =  this.scene.width / 15;
        let j = 1;

        for(let i = 0; i < c; i++){
            if(x+ i* distance < this.scene.width -24){
            array.push(x + i* distance);
        }
            else if(x -j * distance > 24) {
                array.push(x -j * distance);
                j++;
            }
        }

        array = this.sortedBarrier(array);
        
        array.forEach((valueX) => {
            const barrier = new FoeShot(this.scene, valueX, 50, 'barrier', 'foe0');
            this.scene.barrierGroup.add(barrier)
            this.scene.physics.moveTo(
                barrier,
                valueX,
                this.scene.height+200,
                300*this.scene.distanceIncrement
            );
            barrier.shadow.destroy();
        });
    }

    sortedBarrier(array)
    {
        let target = this.scene.player.x;
        let sorted = array.sort((a, b) => Math.abs(a - target) - Math.abs(b - target));
        if(sorted.length <5){
            return array;
        } else {
            array.splice(3, 1);
            array.splice(2,1);
            return array;
        }
    }



    addTimerCounter() {
        this.timeLeft = 90;
        this.timerText = this.scene.add.text(this.scene.center_width - 35, 20, `${this.timeLeft}`, {
            font: '32px Arial',
            fill: '#ffffff'
        });
        this.timerEvent = this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                this.timeLeft--;
                this.timerText.setText(`${this.timeLeft}`);
                if (this.timeLeft <= 0) {
                    this.timerText.setText('Time is up!');
                    this.timerEvent.destroy();
                    this.distanceEvent.destroy();
                    this.scene.gameOverSceneAtomic();
                }
            },
            loop: true
        });
    }

    addDistanceMeter() {
        this.phoneBar = this.scene.add.graphics();
        this.phoneBar.fillStyle(0x000000, 1);
        this.phoneBar.fillRect(10, 100, 200, 20);
        this.progressBar = this.scene.add.graphics();
        this.progressBar.fillStyle(0xff0000, 1);
        this.progressBar.fillRect(10, 100, 200, 20);
        this.distanceEvent = this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                this.distance += this.scene.distanceIncrement;
                this.updateProgressBar();
                if (this.distance > this.distanceMax) {
                    this.timerEvent.destroy(); 
                    this.distanceEvent.destroy();
                    this.scene.endScene();
                }
            },
            loop: true
        });
    }

    updateProgressBar() {
        const barWidth = 200;
        const fillWidth = (this.distance / this.distanceMax) * barWidth;
        this.progressBar.clear();
        this.progressBar.fillStyle(0xff0000, 1);
        this.progressBar.fillRect(10, 100, fillWidth, 20);
    }

    
    update() {
        this.scene.foeGroup.children.entries.forEach((foe) => {
            foe.update();
        });
    }
}