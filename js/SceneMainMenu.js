class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super({ key: "SceneMainMenu" });
  }

  preload() {
    // Buttons
    this.load.image("sprBtnPlay", "content/sprBtnPlay.png");
    this.load.image("sprBtnPlayHover", "content/sprBtnPlayHover.png");
    this.load.image("sprBtnPlayDown", "content/sprBtnPlayDown.png");

    // Sounds
    this.load.audio("sndBtnOver", "content/sndBtnOver.wav");
    this.load.audio("sndBtnDown", "content/sndBtnDown.wav");
  }

  create() {
    // Sounds
    this.sfx = {
      btnOver: this.sound.add("sndBtnOver"),
      btnDown: this.sound.add("sndBtnDown")
    };

    // Dynamic Stars
    this.stars = [];

    for (let i = 0; i < 250; i++) {
      let star = this.add.rectangle(
        Phaser.Math.Between(0, this.game.config.width),
        Phaser.Math.Between(0, this.game.config.height),
        Phaser.Math.Between(1, 3),
        Phaser.Math.Between(1, 3),
        0xffffff
      );

      star.speed = Phaser.Math.FloatBetween(0.5, 3);

      this.stars.push(star);
    }

    // Dark Overlay
    this.add.rectangle(
      this.game.config.width / 2,
      this.game.config.height / 2,
      this.game.config.width,
      this.game.config.height,
      0x000814,
      0.35
    );

    // Main Title
    this.title = this.add.text(
      this.game.config.width * 0.5,
      150,
      "STARPULSE",
      {
        fontFamily: "monospace",
        fontSize: "64px",
        fontStyle: "bold",
        color: "#22d3ee",
        align: "center"
      }
    );

    this.title.setOrigin(0.5);

    // Floating Animation
    this.tweens.add({
      targets: this.title,
      y: 165,
      duration: 2000,
      yoyo: true,
      repeat: -1
    });

    // Subtitle
    this.subtitle = this.add.text(
      this.game.config.width * 0.5,
      220,
      "NEURAL REFLEX SYSTEM",
      {
        fontFamily: "monospace",
        fontSize: "24px",
        color: "#ffffff",
        align: "center"
      }
    );

    this.subtitle.setOrigin(0.5);

    // Credits
    this.credit = this.add.text(
      this.game.config.width - 20,
      this.game.config.height - 20,
      "NEURO REFLEX GAMING",
      {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#22d3ee",
        align: "right"
      }
    );

    this.credit.setOrigin(1, 1);

    // Status
    this.status = this.add.text(
      this.game.config.width * 0.5,
      360,
      "STATUS : PLAYER ONLINE",
      {
        fontFamily: "monospace",
        fontSize: "18px",
        color: "#00ff99",
        align: "center"
      }
    );

    this.status.setOrigin(0.5);

    // Play Button
    this.btnPlay = this.add.sprite(
      this.game.config.width * 0.5,
      this.game.config.height * 0.5 + 120,
      "sprBtnPlay"
    );

    this.btnPlay.setScale(1.3);

    this.btnPlay.setInteractive();

    // Hover
    this.btnPlay.on(
      "pointerover",
      function () {
        this.btnPlay.setTexture("sprBtnPlayHover");
        this.sfx.btnOver.play();
      },
      this
    );

    // Out
    this.btnPlay.on(
      "pointerout",
      function () {
        this.btnPlay.setTexture("sprBtnPlay");
      },
      this
    );

    // Down
    this.btnPlay.on(
      "pointerdown",
      function () {
        this.btnPlay.setTexture("sprBtnPlayDown");
        this.sfx.btnDown.play();
      },
      this
    );

    // Go To Briefing
    this.btnPlay.on(
      "pointerup",
      function () {
        this.btnPlay.setTexture("sprBtnPlay");

        this.cameras.main.fade(500, 0, 0, 0);

        this.time.delayedCall(500, () => {
          this.scene.start("SceneBriefing");
        });
      },
      this
    );
  }

  update() {
    // Animate Stars
    for (let i = 0; i < this.stars.length; i++) {
      this.stars[i].y += this.stars[i].speed;

      if (this.stars[i].y > this.game.config.height) {
        this.stars[i].y = 0;

        this.stars[i].x = Phaser.Math.Between(
          0,
          this.game.config.width
        );
      }
    }
  }
}