class SceneAIReport extends Phaser.Scene {

    constructor() {
        super({ key: "SceneAIReport" });
    }

    create() {

        const W = this.scale.width;
        const H = this.scale.height;
        const py = (p) => H * p;

        this.add.rectangle(W / 2, H / 2, W, H, 0x020617);

        this.stars = [];

        for (let i = 0; i < 180; i++) {

            const star = this.add.circle(
                Phaser.Math.Between(0, W),
                Phaser.Math.Between(0, H),
                Phaser.Math.Between(1, 2),
                0xffffff
            );

            star.speed = Phaser.Math.FloatBetween(0.2, 1.2);
            star.setAlpha(Phaser.Math.FloatBetween(0.2, 1));

            this.stars.push(star);
        }

        this.add.text(W / 2, py(0.06), "— AI NEURAL ANALYTICS —", {
            fontFamily: "monospace",
            fontSize: "15px",
            color: "#94a3b8"
        }).setOrigin(0.5);

        this.add.text(W / 2, py(0.12), "AI REPORT CARD", {
            fontFamily: "monospace",
            fontSize: "46px",
            color: "#00ffaa",
            fontStyle: "bold"
        }).setOrigin(0.5);

        const panel = this.add.graphics();

        panel.fillStyle(0x0b1220, 0.97);
        panel.fillRoundedRect(W / 2 - 420, py(0.56) - 250, 840, 500, 12);
        panel.lineStyle(2, 0x00ffaa, 0.25);
        panel.strokeRoundedRect(W / 2 - 420, py(0.56) - 250, 840, 500, 12);

        this.add.text(W / 2 - 250, py(0.24), "METRIC", {
            fontFamily: "monospace",
            fontSize: "18px",
            color: "#64748b",
            fontStyle: "bold"
        });

        this.add.text(W / 2 + 140, py(0.24), "RESULT", {
            fontFamily: "monospace",
            fontSize: "18px",
            color: "#64748b",
            fontStyle: "bold"
        });

        const loadingText = this.add.text(
            W / 2,
            py(0.55),
            "SCANNING PLAYER NEURAL DATA...",
            {
                fontFamily: "monospace",
                fontSize: "20px",
                color: "#cbd5e1"
            }
        ).setOrigin(0.5);

        const rows = [

    { label: "SCORE", key: "score", suffix: "", color: 0x00ffaa },

    { label: "SURVIVAL TIME", key: "survival_time", suffix: " sec", color: 0x38bdf8 },

    { label: "KILLS", key: "kills", suffix: "", color: 0x00ffaa },

    { label: "ACCURACY", key: "accuracy", suffix: "%", color: 0xfacc15 },

    { label: "COLLISIONS", key: "collisions", suffix: "", color: 0xef4444 },

    { label: "NEAR MISSES", key: "near_misses", suffix: "", color: 0xf59e0b },

    { label: "MOVEMENT COUNT", key: "movement_count", suffix: "", color: 0x38bdf8 },

    { label: "DODGE EFFICIENCY", key: "dodge_efficiency", suffix: "%", color: 0x00ffaa },

    { label: "ATTENTION SCORE", key: "attention_score", suffix: "", color: 0x00ffaa },

    { label: "STRESS LEVEL", key: "stress_score", suffix: "", color: 0xf59e0b },

    { label: "BLINK COUNT", key: "blink_count", suffix: "", color: 0x38bdf8 },

    { label: "DISTRACTION", key: "distraction", suffix: "", color: 0xef4444 }

];

        const values = {};
        let startY = py(0.30);

        rows.forEach((r, i) => {

            values[r.key] = this.createMetricRow(
                W / 2,
                startY + i * 38,
                r.label,
                "Loading",
                r.color
            );
        });

        const updateAIReport = () => {

    const gameplayData = JSON.parse(
        localStorage.getItem("gameplay_metrics")
    );

    if (!gameplayData) {
        return;
    }

    if (loadingText.active) {
        loadingText.destroy();
    }

    rows.forEach(r => {

        let value = gameplayData[r.key];

        if (value === undefined || value === null) {
            value = "N/A";
        }

        values[r.key].setText(value + r.suffix);
    });
};

        updateAIReport();

        this.time.addEvent({
            delay: 1000,
            callback: updateAIReport,
            callbackScope: this,
            loop: true
        });

        this.makeButton(
            W / 2,
            py(0.90),
            "↺ RETURN",
            () => {
                this.scene.start("SceneGameOver");
            }
        );

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    createMetricRow(centerX, y, label, value, accent) {

        const row = this.add.graphics();

        row.fillStyle(0x111827, 0.95);
        row.fillRoundedRect(centerX - 350, y - 15, 700, 30, 6);
        row.lineStyle(1, 0x1e293b, 1);
        row.strokeRoundedRect(centerX - 350, y - 15, 700, 30, 6);

        this.add.text(centerX - 320, y, label, {
            fontFamily: "monospace",
            fontSize: "16px",
            color: "#cbd5e1",
            fontStyle: "bold"
        }).setOrigin(0, 0.5);

        const valueBox = this.add.graphics();

        valueBox.fillStyle(accent, 0.18);
        valueBox.fillRoundedRect(centerX + 120, y - 12, 180, 24, 5);
        valueBox.lineStyle(1, accent, 0.7);
        valueBox.strokeRoundedRect(centerX + 120, y - 12, 180, 24, 5);

        const valueText = this.add.text(centerX + 210, y, value, {
            fontFamily: "monospace",
            fontSize: "15px",
            color: "#ffffff",
            fontStyle: "bold"
        }).setOrigin(0.5);

        return valueText;
    }

    makeButton(x, y, label, callback) {

        const bg = this.add.rectangle(x, y, 240, 56, 0x111827);
        bg.setStrokeStyle(2, 0x00ffaa, 0.4);

        const txt = this.add.text(x, y, label, {
            fontFamily: "monospace",
            fontSize: "18px",
            color: "#cbd5e1",
            fontStyle: "bold"
        }).setOrigin(0.5);

        bg.setInteractive({ useHandCursor: true });

        bg.on("pointerover", () => {
            bg.setFillStyle(0x1e293b);
            txt.setColor("#ffffff");
        });

        bg.on("pointerout", () => {
            bg.setFillStyle(0x111827);
            txt.setColor("#cbd5e1");
        });

        bg.on("pointerdown", callback);
    }

    update() {

        this.stars.forEach(star => {

            star.y += star.speed;

            if (star.y > this.scale.height) {
                star.y = 0;
            }
        });
    }
}