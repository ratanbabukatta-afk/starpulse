class SceneAIReport extends Phaser.Scene {

    constructor() {
        super({ key: "SceneAIReport" });
    }

    create() {

        const W = this.scale.width;
        const H = this.scale.height;

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

        for (let i = 0; i < 180; i++) {

            const star = this.add.circle(
                Phaser.Math.Between(0, W),
                Phaser.Math.Between(0, H),
                Phaser.Math.Between(1, 2),
                0xffffff
            );

            star.speed =
                Phaser.Math.FloatBetween(0.2, 1.2);

            star.setAlpha(
                Phaser.Math.FloatBetween(0.2, 1)
            );

            this.stars.push(star);
        }

        // =====================================================
        // HEADER
        // =====================================================

        this.add.text(
            W / 2,
            py(0.06),
            "— AI NEURAL ANALYTICS —",
            {
                fontFamily: "monospace",
                fontSize: "15px",
                color: "#94a3b8"
            }
        ).setOrigin(0.5);

        this.add.text(
            W / 2,
            py(0.12),
            "AI REPORT CARD",
            {
                fontFamily: "monospace",
                fontSize: "46px",
                color: "#00ffaa",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        // =====================================================
        // MAIN PANEL
        // =====================================================

        const panel = this.add.graphics();

        panel.fillStyle(0x0b1220, 0.97);

        panel.fillRoundedRect(
            W / 2 - 420,
            py(0.56) - 250,
            840,
            500,
            12
        );

        panel.lineStyle(2, 0x00ffaa, 0.25);

        panel.strokeRoundedRect(
            W / 2 - 420,
            py(0.56) - 250,
            840,
            500,
            12
        );

        // =====================================================
        // TABLE HEADER
        // =====================================================

        this.add.text(
            W / 2 - 250,
            py(0.24),
            "METRIC",
            {
                fontFamily: "monospace",
                fontSize: "18px",
                color: "#64748b",
                fontStyle: "bold"
            }
        );

        this.add.text(
            W / 2 + 140,
            py(0.24),
            "RESULT",
            {
                fontFamily: "monospace",
                fontSize: "18px",
                color: "#64748b",
                fontStyle: "bold"
            }
        );

        // =====================================================
        // LOADING
        // =====================================================

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

        // =====================================================
        // LOAD AI DATA
        // =====================================================

        fetch("ai_output.json")

        .then(response => response.json())

        .then(data => {

            loadingText.destroy();

            const rows = [

                {
                    label: "ATTENTION SCORE",
                    value: data.attention_score,
                    color: 0x00ffaa
                },

                {
                    label: "STRESS LEVEL",
                    value: data.stress_score,
                    color: 0xf59e0b
                },

                {
                    label: "BLINK COUNT",
                    value: data.blink_count,
                    color: 0x38bdf8
                },

                {
                    label: "DISTRACTION INDEX",
                    value: data.distraction,
                    color: 0xef4444
                },

                {
                    label: "FOCUS IQ",
                    value: data.focus_intelligence + " IQ",
                    color: 0x00ffaa
                },

                {
                    label: "REACTION IQ",
                    value: data.reaction_intelligence + " IQ",
                    color: 0x00ffaa
                },

                {
                    label: "COGNITIVE STABILITY",
                    value: data.cognitive_stability,
                    color: 0x38bdf8
                },

                {
                    label: "DECISION STYLE",
                    value: data.decision_style,
                    color: 0xfacc15
                },

                {
                    label: "PLAYER TYPE",
                    value: data.player_type,
                    color: 0xa78bfa
                },

                {
                    label: "RISK ANALYSIS",
                    value: data.performance_risk,
                    color: 0xef4444
                }
            ];

            let startY = py(0.30);

            rows.forEach((r, i) => {

                this.createMetricRow(

                    W / 2,
                    startY + i * 38,

                    r.label,
                    r.value,
                    r.color

                );
            });
        })

        .catch(error => {

            loadingText.setText(
                "FAILED TO LOAD AI REPORT"
            );

            console.log(error);

        });

        // =====================================================
        // BUTTON
        // =====================================================

        this.makeButton(
            W / 2,
            py(0.90),
            "↺ RETURN",
            () => {

                this.scene.start(
                    "SceneGameOver"
                );

            }
        );

        // =====================================================
        // FADE IN
        // =====================================================

        this.cameras.main.fadeIn(
            500,
            0,
            0,
            0
        );
    }

    // =====================================================
    // METRIC ROW
    // =====================================================

    createMetricRow(
        centerX,
        y,
        label,
        value,
        accent
    ) {

        const row = this.add.graphics();

        row.fillStyle(0x111827, 0.95);

        row.fillRoundedRect(
            centerX - 350,
            y - 15,
            700,
            30,
            6
        );

        row.lineStyle(
            1,
            0x1e293b,
            1
        );

        row.strokeRoundedRect(
            centerX - 350,
            y - 15,
            700,
            30,
            6
        );

        // LEFT LABEL

        this.add.text(
            centerX - 320,
            y,
            label,
            {
                fontFamily: "monospace",
                fontSize: "16px",
                color: "#cbd5e1",
                fontStyle: "bold"
            }
        ).setOrigin(0, 0.5);

        // VALUE BOX

        const valueBox = this.add.graphics();

        valueBox.fillStyle(accent, 0.18);

        valueBox.fillRoundedRect(
            centerX + 120,
            y - 12,
            180,
            24,
            5
        );

        valueBox.lineStyle(
            1,
            accent,
            0.7
        );

        valueBox.strokeRoundedRect(
            centerX + 120,
            y - 12,
            180,
            24,
            5
        );

        this.add.text(
            centerX + 210,
            y,
            value,
            {
                fontFamily: "monospace",
                fontSize: "15px",
                color: "#ffffff",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);
    }

    // =====================================================
    // BUTTON
    // =====================================================

    makeButton(
        x,
        y,
        label,
        callback
    ) {

        const bg = this.add.rectangle(
            x,
            y,
            240,
            56,
            0x111827
        );

        bg.setStrokeStyle(
            2,
            0x00ffaa,
            0.4
        );

        const txt = this.add.text(
            x,
            y,
            label,
            {
                fontFamily: "monospace",
                fontSize: "18px",
                color: "#cbd5e1",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        bg.setInteractive({
            useHandCursor: true
        });

        bg.on(
            "pointerover",
            () => {

                bg.setFillStyle(
                    0x1e293b
                );

                txt.setColor(
                    "#ffffff"
                );
            }
        );

        bg.on(
            "pointerout",
            () => {

                bg.setFillStyle(
                    0x111827
                );

                txt.setColor(
                    "#cbd5e1"
                );
            }
        );

        bg.on(
            "pointerdown",
            callback
        );
    }

    // =====================================================
    // UPDATE
    // =====================================================

    update() {

        this.stars.forEach(star => {

            star.y += star.speed;

            if (
                star.y >
                this.scale.height
            ) {

                star.y = 0;
            }
        });
    }
}