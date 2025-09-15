(() => {
        const canvas = document.getElementById("canvas");
        if (canvas === null) {
                console.error("Error: Cannot find canvas element");
                return;
        }

        const context = canvas.getContext("2d");
        if (context === null) {
                console.error("Error: Failed to get canvas 2D context");
                return;
        }

        const HEX_SIZE   = 40;
        const HEX_WIDTH  = HEX_SIZE * 2;
        const HEX_HEIGHT = Math.sqrt(3) / 2 * HEX_WIDTH;
        const GRID_ROWS  = 8;
        const GRID_COLS  = 8;

        function hexToPixel(q, r) {
                return {
                        x: HEX_SIZE * 3 / 2 * q,
                        y: HEX_HEIGHT * (r + q / 2)
                };
        }

        function drawHex(x, y) {
                context.beginPath();

                for (let index = 0; index < 6; ++index) {
                        const angle = index * 60 * (Math.PI / 180);
                        const px = x + HEX_SIZE * Math.cos(angle);
                        const py = y + HEX_SIZE * Math.sin(angle);
                        context[index === 0 ? "moveTo" : "lineTo"]?.(px, py);
                }

                context.closePath();
                context.fillStyle = "yellow";
                context.fill();
                context.strokeStyle = "black";
                context.stroke();
        }

        function renderGrid() {
                context.clearRect(0, 0, canvas.width, canvas.height);
                for (let r = 0; r < GRID_ROWS; ++r) {
                        for (let q = 0; q < GRID_COLS; ++q) {
                                const {x, y} = hexToPixel(q, r);
                                drawHex(x + 50, y + 50);
                        }
                }
        }

        renderGrid();
})();