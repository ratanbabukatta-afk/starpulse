
class SceneBriefing extends Phaser.Scene {

    constructor() {
        super({ key: "SceneBriefing" });
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

            star.speed = Phaser.Math.FloatBetween(0.4, 2);

            star.setAlpha(
                Phaser.Math.FloatBetween(0.3, 1)
            );

            this.tweens.add({
                targets: star,
                alpha: Phaser.Math.FloatBetween(0.2, 1),
                duration: Phaser.Math.Between(1200, 2600),
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
            py(0.08),
            "— NEURAL REFLEX SYSTEM —",
            {
                fontFamily: "monospace",
                fontSize: "14px",
                color: "#94a3b8"
            }
        ).setOrigin(0.5);

        const title = this.add.text(
            W / 2,
            py(0.16),
            "MISSION BRIEFING",
            {
                fontFamily: "monospace",
                fontSize: "46px",
                fontStyle: "bold",
                color: "#ffffff"
            }
        ).setOrigin(0.5);

        // divider
        const line = this.add.graphics();

        line.lineStyle(1, 0x334155, 0.7);

        line.lineBetween(
            px(0.22),
            py(0.24),
            px(0.78),
            py(0.24)
        );

        // =====================================================
        // MAIN PANEL
        // =====================================================

        const panel = this.add.graphics();

        panel.fillStyle(0x0f172a, 0.98);

        panel.fillRoundedRect(
            px(0.20),
            py(0.30),
            px(0.60),
            py(0.42),
            12
        );

        panel.lineStyle(2, 0x334155, 0.8);

        panel.strokeRoundedRect(
            px(0.20),
            py(0.30),
            px(0.60),
            py(0.42),
            12
        );

        // =====================================================
        // DESCRIPTION
        // =====================================================

        this.add.text(
            W / 2,
            py(0.35),

            "STARPULSE is a reflex-based survival system.\n\n" +

            "Navigate asteroid waves and survive as long\n" +
            "as possible under increasing pressure.\n\n" +

            "The neural tracker measures:\n\n" +

            "• Reaction Speed\n" +
            "• Movement Accuracy\n" +
            "• Focus Consistency\n\n" +

            "Every movement matters.\n" +
            "Every second counts.",

            {
                fontFamily: "monospace",
                fontSize: "18px",
                color: "#e2e8f0",
                align: "center",
                lineSpacing: 10
            }

        ).setOrigin(0.5, 0);

        // =====================================================
        // TEAM SECTION
        // =====================================================

        const teamPanel = this.add.graphics();

        teamPanel.fillStyle(0x111827, 0.98);

        teamPanel.fillRoundedRect(
            px(0.33),
            py(0.66),
            px(0.34),
            py(0.07),
            8
        );

        teamPanel.lineStyle(1, 0x334155, 0.8);

        teamPanel.strokeRoundedRect(
            px(0.33),
            py(0.66),
            px(0.34),
            py(0.07),
            8
        );

        this.add.text(
            W / 2,
            py(0.695),
            "PROJECT BY  •  RATAN  •  SRIHARI  •  ANURAG",
            {
                fontFamily: "monospace",
                fontSize: "13px",
                color: "#94a3b8"
            }
        ).setOrigin(0.5);

        // =====================================================
        // BUTTON
        // =====================================================

        const btnY = py(0.86);

        const btnFill = this.add.rectangle(
            W / 2,
            btnY,
            280,
            52,
            0x111827,
            0.98
        );

        const btnBorder = this.add.graphics();

        const drawBorder = (a) => {

            btnBorder.clear();

            btnBorder.lineStyle(2, 0x475569, a);

            btnBorder.strokeRoundedRect(
                W / 2 - 140,
                btnY - 26,
                280,
                52,
                8
            );
        };

        drawBorder(0.8);

        const btn = this.add.text(
            W / 2,
            btnY,
            "LAUNCH MISSION  ›",
            {
                fontFamily: "monospace",
                fontSize: "24px",
                color: "#94a3b8",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        btn.setInteractive({ useHandCursor: true });

        // hover
        btn.on("pointerover", () => {

            btn.setColor("#ffffff");

            btnFill.setFillStyle(
                0x1e293b,
                1
            );

            drawBorder(1);
        });

        // out
        btn.on("pointerout", () => {

            btn.setColor("#94a3b8");

            btnFill.setFillStyle(
                0x111827,
                0.98
            );

            drawBorder(0.8);
        });

        // click
        btn.on("pointerdown", () => {

            this.cameras.main.fadeOut(
                250,
                0,
                0,
                0
            );

            this.time.delayedCall(250, () => {

                this.scene.start("SceneMain");

            });
        });

        // =====================================================
        // FOOTER
        // =====================================================

        this.add.text(
            W - 20,
            H - 18,
            "STARPULSE v1.0",
            {
                fontFamily: "monospace",
                fontSize: "12px",
                color: "#475569"
            }
        ).setOrigin(1, 1);

        // =====================================================
        // INTRO ANIMATION
        // =====================================================

        this.cameras.main.fadeIn(
            700,
            0,
            0,
            0
        );

        title.setAlpha(0);

        this.tweens.add({
            targets: title,
            alpha: 1,
            y: title.y - 10,
            duration: 700,
            ease: "Power2"
        });
    }

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

