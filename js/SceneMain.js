
  class SceneMain extends Phaser.Scene {

    constructor() {
      super({ key: "SceneMain" });
    }

    preload() {

      this.load.spritesheet(
        "sprExplosion",
        "content/sprExplosion.png",
        {
          frameWidth: 32,
          frameHeight: 32
        }
      );

      this.load.spritesheet(
        "sprEnemy0",
        "content/sprEnemy0.png",
        {
          frameWidth: 16,
          frameHeight: 16
        }
      );

      this.load.image(
        "sprEnemy1",
        "content/sprEnemy1.png"
      );

      this.load.spritesheet(
        "sprEnemy2",
        "content/sprEnemy2.png",
        {
          frameWidth: 16,
          frameHeight: 16
        }
      );

      this.load.image(
        "sprLaserEnemy0",
        "content/sprLaserEnemy0.png"
      );

      this.load.image(
        "sprLaserPlayer",
        "content/sprLaserPlayer.png"
      );

      this.load.spritesheet(
        "sprPlayer",
        "content/sprPlayer.png",
        {
          frameWidth: 16,
          frameHeight: 16
        }
      );

      this.load.audio(
        "sndExplode0",
        "content/sndExplode0.wav"
      );

      this.load.audio(
        "sndExplode1",
        "content/sndExplode1.wav"
      );

      this.load.audio(
        "sndLaser",
        "content/sndLaser.wav"
      );
    }

    create() {

      // =====================================================
      // ANIMATIONS
      // =====================================================

      this.anims.create({
        key: "sprEnemy0",
        frames: this.anims.generateFrameNumbers(
          "sprEnemy0"
        ),
        frameRate: 20,
        repeat: -1
      });

      this.anims.create({
        key: "sprEnemy2",
        frames: this.anims.generateFrameNumbers(
          "sprEnemy2"
        ),
        frameRate: 20,
        repeat: -1
      });

      this.anims.create({
        key: "sprExplosion",
        frames: this.anims.generateFrameNumbers(
          "sprExplosion"
        ),
        frameRate: 20,
        repeat: 0
      });

      this.anims.create({
        key: "sprPlayer",
        frames: this.anims.generateFrameNumbers(
          "sprPlayer"
        ),
        frameRate: 20,
        repeat: -1
      });

      // =====================================================
      // SOUND
      // =====================================================

      this.sfx = {
        explosions: [
          this.sound.add("sndExplode0"),
          this.sound.add("sndExplode1")
        ],

        laser: this.sound.add("sndLaser")
      };

      // =====================================================
      // GAME STATS
      // =====================================================

      // GAME STATS

  this.score = 0;
  this.killCount = 0;
  this.shotsFired = 0;
  this.hitsLanded = 0;
  this.waveNumber = 0;
  this.gameOverTriggered = false;

  // AI METRICS

  // AI METRICS

this.playerMovement = 0;
this.playerCollisions = 0;
this.playerSkill = null;

// NEW REAL GAME METRICS

this.nearMisses = 0;
this.dodgedEnemies = 0;
this.survivalStartTime = this.time.now;


      // =====================================================
      // STARFIELD
      // =====================================================

      this.stars = [];

      for (let i = 0; i < 300; i++) {

        let star = this.add.rectangle(

          Phaser.Math.Between(
            0,
            this.game.config.width
          ),

          Phaser.Math.Between(
            0,
            this.game.config.height
          ),

          Phaser.Math.Between(1, 3),

          Phaser.Math.Between(1, 3),

          0xffffff
        );

        star.speed = Phaser.Math.FloatBetween(
          2,
          7
        );

        this.stars.push(star);
      }

      // =====================================================
      // PLAYER
      // =====================================================

      this.player = new Player(

        this,

        this.game.config.width * 0.5,

        this.game.config.height * 0.8,

        "sprPlayer"
      );
      this.player.setScale(2.5);

      // =====================================================
      // INPUTS
      // =====================================================

      this.keyW = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.W
      );

      this.keyS = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.S
      );

      this.keyA = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.A
      );

      this.keyD = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.D
      );

      this.keySpace = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
      );

      // =====================================================
      // GROUPS
      // =====================================================

      this.enemies = this.add.group();

      this.enemyLasers = this.add.group();

      this.playerLasers = this.add.group();
  this.aiText = this.add.text(

      this.game.config.width / 2,

      50,

      "",

      {
          font: "24px Arial",
          fill: "#00ff00"
      }

  );

  this.aiText.setOrigin(0.5);

      // =====================================================
      // DIFFICULTY TIMER
      // =====================================================
  this.gameTime = 0;
  this.enemySpawnRate = 1000;
  this.enemySpeedMultiplier = 1;
  this.liveAttention = 100;
  this.liveStress = 0;
  this.liveBlinks = 0;
  this.liveDistraction = "LOW";
  this.time.addEvent({

    delay: 1000,

    callback: function () {

        fetch("ai_output.json")

            .then(response => response.json())

            .then(data => {

                this.liveAttention = data.attention_score;
                this.liveStress = data.stress_score;
                this.liveBlinks = data.blink_count;
                this.liveDistraction = data.distraction;

                console.log(
                    "LIVE AI:",
                    this.liveAttention,
                    this.liveStress,
                    this.liveBlinks,
                    this.liveDistraction
                );

            });

    },

    callbackScope: this,

    loop: true
});
      // =====================================================
  // ENEMY SPAWNING
  // =====================================================

  this.enemySpawner = this.time.addEvent({

      delay: 1000,

      callback: function () {

          if (this.gameOverTriggered) return;

          this.gameTime++;

          console.log("Game Time =", this.gameTime);

          if (this.gameTime ===15) {

              console.log("REACHED 30 SECONDS");

              this.evaluatePlayerSkill();
          }

          this.waveNumber++;

          let enemy = null;

          // =================================================
          // EASY MODE
          // 0 - 10 sec
          // ONLY GUNSHIPS
          // =================================================

          if (this.gameTime <= 10) {

            enemy = new GunShip(

              this,

              Phaser.Math.Between(
                0,
                this.game.config.width
              ),

              0
            );
          }

          // =================================================
          // MEDIUM MODE
          // 10 - 20 sec
          // STILL ONLY GUNSHIPS
          // =================================================

          else if (this.gameTime <= 20) {

            enemy = new GunShip(

              this,

              Phaser.Math.Between(
                0,
                this.game.config.width
              ),

              0
            );

            enemy.setScale(1.4);
          }

          // =================================================
          // HARD MODE
          // 20 - 35 sec
          // CHASERS START
          // =================================================

          else if (this.gameTime <= 35) {

            let rand = Phaser.Math.Between(
              0,
              10
            );

            // normal enemies
            if (rand >= 4) {

              enemy = new GunShip(

                this,

                Phaser.Math.Between(
                  0,
                  this.game.config.width
                ),

                0
              );
            }

            // chasers
            else {

              if (

                this.getEnemiesByType(
                  "ChaserShip"
                ).length < 2

              ) {

                enemy = new ChaserShip(

                  this,

                  Phaser.Math.Between(
                    0,
                    this.game.config.width
                  ),

                  0
                );
              }
            }
          }

          // =================================================
          // INSANE MODE
          // 35+ sec
          // EVERYTHING
          // =================================================

          else {

            let rand = Phaser.Math.Between(
              0,
              10
            );

            // gunships
            if (rand >= 5) {

              enemy = new GunShip(

                this,

                Phaser.Math.Between(
                  0,
                  this.game.config.width
                ),

                0
              );
            }

            // chasers
            else if (rand >= 2) {

              if (

                this.getEnemiesByType(
                  "ChaserShip"
                ).length < 4

              ) {

                enemy = new ChaserShip(

                  this,

                  Phaser.Math.Between(
                    0,
                    this.game.config.width
                  ),

                  0
                );
              }
            }

            // carrier ships
            else {

              enemy = new CarrierShip(

                this,

                Phaser.Math.Between(
                  0,
                  this.game.config.width
                ),

                0
              );
            }
          }

          // =================================================
          // ADD ENEMY
          // =================================================

          if (enemy !== null) {

    enemy.setScale(

      Phaser.Math.FloatBetween(
        1,
        1.8
      )
    );

    enemy.setData("nearMissCounted", false);
    enemy.setData("dodgedCounted", false);

    this.enemies.add(enemy);
}

        },

        callbackScope: this,

        loop: true
      });

      // =====================================================
      // COLLISIONS
      // =====================================================

      this.physics.add.collider(

        this.playerLasers,

        this.enemies,

        function (playerLaser, enemy) {

          if (enemy) {

            if (
              enemy.onDestroy !== undefined
            ) {
              enemy.onDestroy();
            }

            enemy.explode(true);

            playerLaser.destroy();

            this.killCount++;

            this.hitsLanded++;

            this.score += 100;
            console.log("Score:", this.score);
          }
        },

        null,

        this
      );

      this.physics.add.overlap(

        this.player,

        this.enemies,

        function (player, enemy) {

          if (

            !player.getData("isDead") &&
            !enemy.getData("isDead")

          ) {
            this.playerCollisions++;
            player.explode(false);

            enemy.explode(true);

            this.triggerGameOver();
          }
        },

        null,

        this
      );

      this.physics.add.overlap(

        this.player,

        this.enemyLasers,

        function (player, laser) {

          if (

            !player.getData("isDead") &&
            !laser.getData("isDead")

          ) {
            this.playerCollisions++;
            player.explode(false);

            laser.destroy();

            this.triggerGameOver();
          }
        },

        null,

        this
      );
    }

    // =====================================================
    // GAME OVER
    // =====================================================

    triggerGameOver() {

    if (this.gameOverTriggered) return;

    this.gameOverTriggered = true;

    this.time.delayedCall(1000, () => {

        let survivalTime = Math.round(
            (this.time.now - this.survivalStartTime) / 1000
        );

        let dodgeEfficiency =
            this.waveNumber > 0
                ? Math.round(
                    (this.dodgedEnemies / this.waveNumber) * 100
                )
                : 0;

        let accuracy =
            this.shotsFired > 0
                ? Math.round(
                    (this.hitsLanded / this.shotsFired) * 100
                )
                : 0;

        localStorage.setItem(
            "gameplay_metrics",
            JSON.stringify({

                score: this.score,

                survival_time: survivalTime,

                collisions: this.playerCollisions,

                near_misses: this.nearMisses,

                movement_count: this.playerMovement,

                dodge_efficiency: dodgeEfficiency,

                kills: this.killCount,

                waves: this.waveNumber,

                accuracy: accuracy,

                attention_score: this.liveAttention,

                stress_score: this.liveStress,

                blink_count: this.liveBlinks,

                distraction: this.liveDistraction,

                player_skill: this.playerSkill
            })
        );

        this.scene.start(
            "SceneGameOver",
            {
                score: this.score,

                waves: this.waveNumber,

                kills: this.killCount,

                accuracy: accuracy
            }
        );

    });
}

    // =====================================================
    // GET ENEMIES BY TYPE
    // =====================================================

    getEnemiesByType(type) {

      let arr = [];

      for (
        let i = 0;
        i < this.enemies.getChildren().length;
        i++
      ) {

        let enemy =
          this.enemies.getChildren()[i];

        if (
          enemy.getData("type") == type
        ) {
          arr.push(enemy);
        }
      }

      return arr;
    }

    // =====================================================
    // UPDATE
    // =====================================================
  evaluatePlayerSkill() {

      let accuracy =
          this.shotsFired > 0
          ? (this.hitsLanded / this.shotsFired) * 100
          : 0;

      console.log("AI FUNCTION CALLED");


      console.log("Accuracy:", accuracy);
      console.log("Kills:", this.killCount);
      console.log("Collisions:", this.playerCollisions);
      

      if (
      accuracy > 70 &&
      this.killCount > 10
  ) {

      this.playerSkill = "ADVANCED";
      this.aiText.setText(
      "AI DETECTED: ADVANCED"
  );

      this.enemySpawnRate = 500;
      this.enemySpeedMultiplier = 1.5;

      console.log(
          "ADVANCED PLAYER DETECTED"
      );
  }

  else if (
      accuracy > 40
  ) {

      this.playerSkill = "INTERMEDIATE";
      this.aiText.setText(
      "AI DETECTED: INTERMEDIATE"
  );

      this.enemySpawnRate = 1000;
      this.enemySpeedMultiplier = 1;

      console.log(
          "INTERMEDIATE PLAYER DETECTED"
      );
  }

  else {

      this.playerSkill = "BEGINNER";
      this.aiText.setText(
      "AI DETECTED: BEGINNER"
  );
      this.enemySpawnRate = 1500;
      this.enemySpeedMultiplier = 0.7;

      console.log(
          "BEGINNER PLAYER DETECTED"
      );
  }

  console.log(
      "NEW SPAWN RATE:",
      this.enemySpawnRate
  );
  this.enemySpawner.remove();

  this.enemySpawner.remove();

  this.enemySpawner = this.time.addEvent({

      delay: this.enemySpawnRate,

      callback: function () {

          console.log(
              "NEW SPAWN RATE ACTIVE:",
              this.enemySpawnRate
          );

          this.spawnEnemy();

      },

      callbackScope: this,

      loop: true
  });

  console.log(
      "SPAWNER RESTARTED"
  );
  this.time.delayedCall(

      5000,

      () => {

          this.aiText.setText("");

      }

  );
  }
  spawnEnemy() {

      this.waveNumber++;

      let enemy = null;

      if (this.gameTime <= 10) {

          enemy = new GunShip(
              this,
              Phaser.Math.Between(
                  0,
                  this.game.config.width
              ),
              0
          );
      }

      else if (this.gameTime <= 20) {

          enemy = new GunShip(
              this,
              Phaser.Math.Between(
                  0,
                  this.game.config.width
              ),
              0
          );

          enemy.setScale(1.4);
      }

      else if (this.gameTime <= 35) {

          let rand = Phaser.Math.Between(
              0,
              10
          );

          if (rand >= 4) {

              enemy = new GunShip(
                  this,
                  Phaser.Math.Between(
                      0,
                      this.game.config.width
                  ),
                  0
              );
          }

          else {

              if (
                  this.getEnemiesByType(
                      "ChaserShip"
                  ).length < 2
              ) {

                  enemy = new ChaserShip(
                      this,
                      Phaser.Math.Between(
                          0,
                          this.game.config.width
                      ),
                      0
                  );
              }
          }
      }

      else {

          let rand = Phaser.Math.Between(
              0,
              10
          );

          if (rand >= 5) {

              enemy = new GunShip(
                  this,
                  Phaser.Math.Between(
                      0,
                      this.game.config.width
                  ),
                  0
              );
          }

          else if (rand >= 2) {

              if (
                  this.getEnemiesByType(
                      "ChaserShip"
                  ).length < 4
              ) {

                  enemy = new ChaserShip(
                      this,
                      Phaser.Math.Between(
                          0,
                          this.game.config.width
                      ),
                      0
                  );
              }
          }

          else {

              enemy = new CarrierShip(
                  this,
                  Phaser.Math.Between(
                      0,
                      this.game.config.width
                  ),
                  0
              );
          }
      }

      if (enemy !== null) {

    enemy.setVisible(true);

    enemy.setAlpha(1);

    enemy.setDepth(10);

    enemy.setScale(2);

    this.enemies.add(enemy);
}
  }
  update() {

      // =================================================
      // STAR MOVEMENT
      // =================================================

      for (
        let i = 0;
        i < this.stars.length;
        i++
      ) {

        this.stars[i].y +=
          this.stars[i].speed;

        if (
          this.stars[i].y >
          this.game.config.height
        ) {

          this.stars[i].y = 0;

          this.stars[i].x =
            Phaser.Math.Between(
              0,
              this.game.config.width
            );
        }
      }

      // =================================================
      // PLAYER
      // =================================================

      if (
        !this.player.getData("isDead")
      ) {

        this.player.update();

      if (this.keyW.isDown) {

      this.player.moveUp();

      this.playerMovement++;
      }

        if (this.keyS.isDown) {

      this.player.moveDown();

      this.playerMovement++;
  }

        if (this.keyA.isDown) {

      this.player.moveLeft();

      this.playerMovement++;
  }
      if (this.keyD.isDown) {

      this.player.moveRight();

      this.playerMovement++;
  }

        if (this.keySpace.isDown) {

          this.player.setData(
            "isShooting",
            true
          );
        }

        else {

          this.player.setData(
            "timerShootTick",

            this.player.getData(
              "timerShootDelay"
            ) - 1
          );

          this.player.setData(
            "isShooting",
            false
          );
        }
      }

      // =================================================
      // ENEMIES
      // =================================================

      for (
        let i = 0;
        i < this.enemies.getChildren().length;
        i++
      ) {

        let enemy =
          this.enemies.getChildren()[i];
          let distance = Phaser.Math.Distance.Between(
    enemy.x,
    enemy.y,
    this.player.x,
    this.player.y
);

if (
    distance < 90 &&
    !enemy.getData("nearMissCounted") &&
    !enemy.getData("isDead") &&
    !this.player.getData("isDead")
) {
    this.nearMisses++;
    enemy.setData("nearMissCounted", true);
}

if (
    enemy.y > this.game.config.height &&
    !enemy.getData("dodgedCounted") &&
    !enemy.getData("isDead")
) {
    this.dodgedEnemies++;
    enemy.setData("dodgedCounted", true);
}

        enemy.update();

        if (

          enemy.x <
            -enemy.displayWidth ||

          enemy.x >
            this.game.config.width +
            enemy.displayWidth ||

          enemy.y <
            -enemy.displayHeight * 4 ||

          enemy.y >
            this.game.config.height +
            enemy.displayHeight

        ) {

          if (enemy) {

            if (
              enemy.onDestroy !== undefined
            ) {
              enemy.onDestroy();
            }

            enemy.destroy();
          }
        }
      }

      // =================================================
      // ENEMY LASERS
      // =================================================

      for (
        let i = 0;
        i <
        this.enemyLasers.getChildren().length;
        i++
      ) {

        let laser =
          this.enemyLasers.getChildren()[i];

        laser.update();

        if (

          laser.x <
            -laser.displayWidth ||

          laser.x >
            this.game.config.width +
            laser.displayWidth ||

          laser.y <
            -laser.displayHeight * 4 ||

          laser.y >
            this.game.config.height +
            laser.displayHeight

        ) {

          laser.destroy();
        }
      }

      // =================================================
      // PLAYER LASERS
      // =================================================

      for (
        let i = 0;
        i <
        this.playerLasers.getChildren().length;
        i++
      ) {

        let laser =
          this.playerLasers.getChildren()[i];

        laser.update();

        if (

          laser.x <
            -laser.displayWidth ||

          laser.x >
            this.game.config.width +
            laser.displayWidth ||

          laser.y <
            -laser.displayHeight * 4 ||

          laser.y >
            this.game.config.height +
            laser.displayHeight

        ) {

          laser.destroy();
        }
      }
    }
  }

