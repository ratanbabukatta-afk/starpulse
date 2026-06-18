
class SceneGameOver extends Phaser.Scene {

    constructor() {
        super({ key: "SceneGameOver" });
    }

    init(data) {

        this.finalScore = data.score || 0;
        this.waves = data.waves || 0;
        this.kills = data.kills || 0;
        this.accuracy = data.accuracy || 0;
    }

    create() {

        const W = this.scale.width;
        const H = this.scale.height;

        const px = (p) => W * p;
        const py = (p) => H * p;

        // =====================================================
        // BACKGROUND
        // =====================================================

        this.add.rectangle(
            W / 2,
            H / 2,
            W,
            H,
            0x020617
        );

        // =====================================================
        // STARS
        // =====================================================

        this.stars = [];

        for (let i = 0; i < 220; i++) {

            const star = this.add.rectangle(
                Phaser.Math.Between(0, W),
                Phaser.Math.Between(0, H),
                Phaser.Math.Between(1, 3),
                Phaser.Math.Between(1, 3),
                0xffffff
            );

            star.speed = Phaser.Math.FloatBetween(0.3, 2);

            star.setAlpha(
                Phaser.Math.FloatBetween(0.3, 1)
            );

            this.tweens.add({
                targets: star,
                alpha: Phaser.Math.FloatBetween(0.2, 1),
                duration: Phaser.Math.Between(1000, 2500),
                yoyo: true,
                repeat: -1
            });

            this.stars.push(star);
        }

        // =====================================================
        // HEADER
        // =====================================================

        this.add.text(
            W / 2,
            py(0.07),
            "— NEURAL REFLEX SYSTEM —",
            {
                fontFamily: "monospace",
                fontSize: "14px",
                color: "#94a3b8"
            }
        ).setOrigin(0.5);

        const title = this.add.text(
            W / 2,
            py(0.15),
            "MISSION OVER",
            {
                fontFamily: "monospace",
                fontSize: "56px",
                fontStyle: "bold",
                color: "#ffffff"
            }
        ).setOrigin(0.5);

        // =====================================================
        // DIVIDER
        // =====================================================

        const line = this.add.graphics();

        line.lineStyle(1, 0x334155, 0.5);

        line.lineBetween(
            px(0.25),
            py(0.23),
            px(0.75),
            py(0.23)
        );

        // =====================================================
        // SCORE PANEL
        // =====================================================

        const scorePanel = this.add.graphics();

        scorePanel.fillStyle(0x0f172a, 0.98);

        scorePanel.fillRoundedRect(
            W / 2 - 180,
            py(0.33) - 50,
            360,
            100,
            12
        );

        scorePanel.lineStyle(2, 0x334155, 0.8);

        scorePanel.strokeRoundedRect(
            W / 2 - 180,
            py(0.33) - 50,
            360,
            100,
            12
        );

        this.add.text(
            W / 2,
            py(0.29),
            "FINAL SCORE",
            {
                fontFamily: "monospace",
                fontSize: "14px",
                color: "#94a3b8"
            }
        ).setOrigin(0.5);

        this.scoreText = this.add.text(
            W / 2,
            py(0.34),
            "000000",
            {
                fontFamily: "monospace",
                fontSize: "46px",
                fontStyle: "bold",
                color: "#ffffff"
            }
        ).setOrigin(0.5);

        // =====================================================
        // STATS
        // =====================================================

        const stats = [
            {
                label: "WAVES",
                value: this.waves,
                suffix: ""
            },
            {
                label: "ENEMIES",
                value: this.kills,
                suffix: ""
            },
            {
                label: "ACCURACY",
                value: this.accuracy,
                suffix: "%"
            }
        ];

        stats.forEach((s, i) => {

            const x = px(0.35 + i * 0.15);

            const panel = this.add.graphics();

            panel.fillStyle(0x111827, 0.98);

            panel.fillRoundedRect(
                x - 70,
                py(0.49) - 40,
                140,
                80,
                10
            );

            panel.lineStyle(2, 0x334155, 0.7);

            panel.strokeRoundedRect(
                x - 70,
                py(0.49) - 40,
                140,
                80,
                10
            );

            this.add.text(
                x,
                py(0.465),
                s.label,
                {
                    fontFamily: "monospace",
                    fontSize: "12px",
                    color: "#94a3b8"
                }
            ).setOrigin(0.5);

            this.add.text(
                x,
                py(0.51),
                `${s.value}${s.suffix}`,
                {
                    fontFamily: "monospace",
                    fontSize: "24px",
                    color: "#ffffff",
                    fontStyle: "bold"
                }
            ).setOrigin(0.5);
        });

        // =====================================================
        // RANK PANEL
        // =====================================================

        const rank = this._calcRank(this.finalScore);

        const rankPanel = this.add.graphics();

        rankPanel.fillStyle(0x052e2b, 0.98);

        rankPanel.fillRoundedRect(
            W / 2 - 140,
            py(0.61) - 24,
            280,
            48,
            8
        );

        rankPanel.lineStyle(2, 0x00ff99, 0.3);

        rankPanel.strokeRoundedRect(
            W / 2 - 140,
            py(0.61) - 24,
            280,
            48,
            8
        );

        this.add.text(
            W / 2,
            py(0.61),
            `RANK : ${rank}`,
            {
                fontFamily: "monospace",
                fontSize: "20px",
                color: "#00ff99",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

      
        // =====================================================
        // BUTTONS
        // =====================================================

        this._makeButton(
    W / 2 - 120,
    py(0.78),
    "📊  AI REPORT",
    () => {

        this.scene.start(
            "SceneAIReport",
            {
                score: this.finalScore,
                waves: this.waves,
                kills: this.kills,
                accuracy: this.accuracy
            }
        );
    }
);

this._makeButton(
    W / 2 + 120,
    py(0.78),
    "↺  RETRY",
    () => {
        this.scene.start("SceneBriefing");
    }
);
        // =====================================================
        // FOOTER
        // =====================================================

        this.add.text(
            W - 20,
            H - 18,
            "STARPULSE • AI ANALYTICS",
            {
                fontFamily: "monospace",
                fontSize: "12px",
                color: "#475569"
            }
        ).setOrigin(1, 1);

        // =====================================================
        // INTRO
        // =====================================================

        this.cameras.main.fadeIn(700, 0, 0, 0);

        title.setAlpha(0);

        this.tweens.add({
            targets: title,
            alpha: 1,
            y: title.y - 10,
            duration: 700,
            ease: "Power2"
        });

        this.time.delayedCall(
            400,
            () => this._countUp()
        );
    }

    // =====================================================
    // BUTTONS
    // =====================================================

    _makeButton(cx, cy, label, cb) {

        const border = this.add.graphics();

        const draw = (a) => {

            border.clear();

            border.lineStyle(2, 0x475569, a);

            border.strokeRoundedRect(
                cx - 90,
                cy - 20,
                180,
                40,
                6
            );
        };

        draw(0.7);

        const fill = this.add.rectangle(
            cx,
            cy,
            176,
            36,
            0x111827,
            0.98
        );

        const btn = this.add.text(
            cx,
            cy,
            label,
            {
                fontFamily: "monospace",
                fontSize: "16px",
                color: "#94a3b8",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        btn.setInteractive({ useHandCursor: true });

        btn.on("pointerover", () => {

            btn.setColor("#ffffff");

            draw(1);

            fill.setFillStyle(0x1e293b, 1);
        });

        btn.on("pointerout", () => {

            btn.setColor("#94a3b8");

            draw(0.7);

            fill.setFillStyle(0x111827, 0.98);
        });

        btn.on("pointerdown", () => {

            this.cameras.main.fadeOut(
                250,
                0,
                0,
                0
            );

            this.time.delayedCall(
                250,
                cb
            );
        });
    }

    // =====================================================
    // SCORE COUNTUP
    // =====================================================

    _countUp() {

        const target = this.finalScore;

        const duration = 1800;

        let current = 0;

        const step = target / (duration / 16);

        this.time.addEvent({

            delay: 16,

            repeat: Math.ceil(duration / 16),

            callback: () => {

                current = Math.min(
                    current + step,
                    target
                );

                this.scoreText.setText(
                    String(Math.round(current))
                    .padStart(6, "0")
                );
            }
        });
    }

    // =====================================================
    // RANK
    // =====================================================

    _calcRank(score) {

        if (score >= 80000) return "LEGENDARY";
        if (score >= 50000) return "PHANTOM";
        if (score >= 25000) return "HUNTER";
        if (score >= 10000) return "RECRUIT";

        return "CADET";
    }

    // =====================================================
    // UPDATE
    // =====================================================

    update() {

        this.stars.forEach(star => {

            star.y += star.speed;

            if (star.y > this.scale.height) {

                star.y = 0;

                star.x = Phaser.Math.Between(
                    0,
                    this.scale.width
                );
            }
        });
    }
}
