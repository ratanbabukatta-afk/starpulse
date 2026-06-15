
class SceneBriefing extends Phaser.Scene {

  constructor() {
    super('SceneBriefing');
  }

  create() {

    const { width, height } = this.cameras.main;
    const centerX = width / 2;

    // =====================================================
    // BACKGROUND
    // =====================================================

    this.add.rectangle(
      0,
      0,
      width,
      height,
      0x060814
    ).setOrigin(0, 0);

    // =====================================================
    // STARFIELD
    // =====================================================

    this.stars = [];

    for (let i = 0; i < 60; i++) {

      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const radius = Phaser.Math.Between(1, 2);

      const star = this.add.circle(
        x,
        y,
        radius,
        0xffffff,
        Phaser.Math.FloatBetween(0.5, 1)
      );

      star.speed =
        Phaser.Math.FloatBetween(0.2, 1.2) * radius;

      this.stars.push(star);
    }

    // =====================================================
    // HEADER
    // =====================================================

    this.add.text(
      centerX,
      60,
      '— NEURAL REFLEX SYSTEM —',
      {
        fontFamily: 'Courier New',
        fontSize: '14px',
        color: '#5dcaa5',
        letterSpacing: 4
      }
    ).setOrigin(0.5);

    // =====================================================
    // TITLE
    // =====================================================

    this.add.text(
      centerX,
      110,
      'MISSION BRIEFING',
      {
        fontFamily: 'Courier New',
        fontSize: '40px',
        fontStyle: 'bold',
        color: '#eaf6f2',
        letterSpacing: 8
      }
    ).setOrigin(0.5);

    // =====================================================
    // DIVIDER
    // =====================================================

    const divider = this.add.graphics();

    divider.lineStyle(2, 0x1d9e75, 0.6);

    divider.lineBetween(
      centerX - 90,
      160,
      centerX + 90,
      160
    );

    // =====================================================
    // MAIN PANEL
    // =====================================================

    const panelWidth = 540;
    const panelHeight = 500;

    const panelX = centerX - panelWidth / 2;
    const panelY = 210;

    const panel = this.add.graphics();

    panel.fillStyle(0x0f1628, 0.88);

    panel.fillRoundedRect(
      panelX,
      panelY,
      panelWidth,
      panelHeight,
      12
    );

    panel.lineStyle(1.5, 0x4ade80, 0.8);

    panel.strokeRoundedRect(
      panelX,
      panelY,
      panelWidth,
      panelHeight,
      12
    );

    let cursorY = panelY + 45;

    // =====================================================
    // INTRO
    // =====================================================

    this.add.text(
      centerX,
      cursorY,
      'STARPULSE is a reflex-based survival system.',
      {
        fontFamily: 'Courier New',
        fontSize: '18px',
        color: '#d8fff2',
        align: 'center'
      }
    ).setOrigin(0.5);

    cursorY += 70;

    this.add.text(
      centerX,
      cursorY,
      'Navigate asteroid waves and survive as long\nas possible under increasing pressure.',
      {
        fontFamily: 'Courier New',
        fontSize: '18px',
        color: '#ffffff',
        align: 'center',
        lineSpacing: 10
      }
    ).setOrigin(0.5);

    cursorY += 110;

    // =====================================================
    // TRACKER TITLE
    // =====================================================

    this.add.text(
      centerX,
      cursorY,
      'THE NEURAL TRACKER MEASURES',
      {
        fontFamily: 'Courier New',
        fontSize: '15px',
        color: '#ffd166',
        fontStyle: 'bold',
        letterSpacing: 1
      }
    ).setOrigin(0.5);

    cursorY += 50;

    // =====================================================
    // STAT PILLS
    // =====================================================

    this.createStatPill(
      centerX,
      cursorY,
      'Reaction Speed',
      0x38bdf8
    );

    cursorY += 60;

    this.createStatPill(
      centerX,
      cursorY,
      'Movement Accuracy',
      0xfb7185
    );

    cursorY += 45;

    // =====================================================
    // CONTROLS TITLE
    // =====================================================

    this.add.text(
      centerX,
      cursorY,
      'CONTROLS',
      {
        fontFamily: 'Courier New',
        fontSize: '15px',
        color: '#ffd166',
        fontStyle: 'bold',
        letterSpacing: 1
      }
    ).setOrigin(0.5);

    cursorY += 70;

    // =====================================================
    // CONTROLS DESCRIPTION
    // =====================================================

    this.add.text(
      centerX,
      cursorY,

      'Use W  A  S  D to navigate the ship.\nPress ENTER to begin the simulation.',

      {
        fontFamily: 'Courier New',
        fontSize: '18px',
        color: '#ffffff',
        align: 'center',
        lineSpacing: 14
      }
    ).setOrigin(0.5);

    // =====================================================
    // TAGLINES
    // =====================================================

    this.add.text(
      centerX,
      panelY + panelHeight + 30,
      'Every movement matters.',
      {
        fontFamily: 'Courier New',
        fontSize: '18px',
        color: '#93c5fd',
        letterSpacing: 2
      }
    ).setOrigin(0.5);

    this.add.text(
      centerX,
      panelY + panelHeight + 60,
      'Every second counts.',
      {
        fontFamily: 'Courier New',
        fontSize: '18px',
        color: '#93c5fd',
        letterSpacing: 2
      }
    ).setOrigin(0.5);

    // =====================================================
    // PLAY BUTTON
    // =====================================================

    this.createLaunchButton(
      centerX,
      panelY + panelHeight + 110
    );

    // =====================================================
    // ENTER INDICATOR
    // =====================================================

    this.add.text(
      centerX,
      panelY + panelHeight + 170,
      '[ PRESS ENTER ]',
      {
        fontFamily: 'Courier New',
        fontSize: '16px',
        color: '#4ade80',
        fontStyle: 'bold',
        letterSpacing: 3
      }
    ).setOrigin(0.5);

    // =====================================================
    // ENTER KEY START
    // =====================================================

    this.input.keyboard.on(
      'keydown-ENTER',
      () => {

        this.cameras.main.fadeOut(
          300,
          0,
          0,
          0
        );

        this.time.delayedCall(
          300,
          () => {

            this.scene.start('SceneMain');

          }
        );

      }
    );

    // =====================================================
    // FOOTER
    // =====================================================

    this.add.text(
      width - 20,
      height - 20,
      'STARPULSE v1.0',
      {
        fontFamily: 'Courier New',
        fontSize: '12px',
        color: '#64748b'
      }
    ).setOrigin(1, 1);
  }

  // =====================================================
  // UPDATE
  // =====================================================

  update() {

    if (!this.stars) return;

    const { height, width } = this.cameras.main;

    for (const star of this.stars) {

      star.y += star.speed;

      if (star.y > height) {

        star.y = 0;
        star.x = Phaser.Math.Between(0, width);
      }
    }
  }

  // =====================================================
  // STAT PILL
  // =====================================================

  createStatPill(
    centerX,
    y,
    label,
    borderColor
  ) {

    const pillWidth = 320;
    const pillHeight = 42;

    const pill = this.add.graphics();

    pill.fillStyle(borderColor, 0.08);

    pill.fillRoundedRect(
      centerX - pillWidth / 2,
      y - pillHeight / 2,
      pillWidth,
      pillHeight,
      8
    );

    pill.lineStyle(2, borderColor, 1);

    pill.strokeRoundedRect(
      centerX - pillWidth / 2,
      y - pillHeight / 2,
      pillWidth,
      pillHeight,
      8
    );

    this.add.text(
      centerX,
      y,
      label,
      {
        fontFamily: 'Courier New',
        fontSize: '18px',
        color: '#ffffff'
      }
    ).setOrigin(0.5);
  }

  // =====================================================
  // PLAY BUTTON
  // =====================================================

  createLaunchButton(centerX, y) {

    const btnWidth = 360;
    const btnHeight = 64;

    const btn = this.add.graphics();

    btn.fillStyle(0x163322, 0.95);

    btn.fillRoundedRect(
      centerX - btnWidth / 2,
      y - btnHeight / 2,
      btnWidth,
      btnHeight,
      8
    );

    btn.lineStyle(2, 0x4ade80, 1);

    btn.strokeRoundedRect(
      centerX - btnWidth / 2,
      y - btnHeight / 2,
      btnWidth,
      btnHeight,
      8
    );

    const label = this.add.text(
      centerX,
      y,
      '▶ PLAY GAME',
      {
        fontFamily: 'Courier New',
        fontSize: '24px',
        color: '#d8fff2',
        fontStyle: 'bold',
        letterSpacing: 4
      }
    ).setOrigin(0.5);

    const hitArea = this.add.zone(
      centerX,
      y,
      btnWidth,
      btnHeight
    )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    hitArea.on('pointerover', () => {

      btn.clear();

      btn.fillStyle(0x1d9e75, 0.35);

      btn.fillRoundedRect(
        centerX - btnWidth / 2,
        y - btnHeight / 2,
        btnWidth,
        btnHeight,
        8
      );

      btn.lineStyle(2, 0xffffff, 1);

      btn.strokeRoundedRect(
        centerX - btnWidth / 2,
        y - btnHeight / 2,
        btnWidth,
        btnHeight,
        8
      );

      label.setColor('#ffffff');
    });

    hitArea.on('pointerout', () => {

      btn.clear();

      btn.fillStyle(0x163322, 0.95);

      btn.fillRoundedRect(
        centerX - btnWidth / 2,
        y - btnHeight / 2,
        btnWidth,
        btnHeight,
        8
      );

      btn.lineStyle(2, 0x4ade80, 1);

      btn.strokeRoundedRect(
        centerX - btnWidth / 2,
        y - btnHeight / 2,
        btnWidth,
        btnHeight,
        8
      );

      label.setColor('#d8fff2');
    });

    hitArea.on('pointerdown', () => {

      this.cameras.main.fadeOut(
        300,
        0,
        0,
        0
      );

      this.time.delayedCall(
        300,
        () => {

          this.scene.start('SceneMain');

        }
      );
    });
  }
}