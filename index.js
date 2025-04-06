// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('volumeButton');
    const canvas = document.getElementById('volumeCanvas');
    const ctx = canvas.getContext('2d');

    let rotationAngle = 0;
    let isDragging = false;
    let lastX = 0;
    let holdStart = 0;
    let holding = false;
    let balls = [];
    let volume = 0;
    let mouseX = 0;
    let mouseY = 0;

    // Load the volume icon image
    const volumeIcon = new Image();
    volumeIcon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADdgAAA3YBfdWCzAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHWSURBVGiB7Zm9TsMwFIXPTdKSULXqwI8YYGBhQUKCgYGRx2DiYZB4Bl6CiYGHQIKJDYmfASTExsDCwMKABKhSS0vTOgM/UocIcH4c5X7SSWzF0v3O9U1sR1QUBZ6TyHcCvhkEwDuDAHhnsAK8M1gB3nEKYIxp/K2UglKqfm6MgTEGWmuIyOI8IpRSUEqBiEBEtfhaa2itF/fmnJFS6tR5YwyCIIA2xpw5qRNEBBFZCI9zhhCiPrdtG1prxHEMpRSyLEOe58jzHHmeI01TJEmCOI6RZRnyPK/XhmGINE2RJAmiKKrfiaIIaZoiSRIkSYI0TZFlGfI8R57nWFtbw/b2NpaXl0FEp67FGHO2AiLSqNBJkS3Lqj9SSsRxDCklpJSI4xhSSggha/FSSggha9FSSiRJAillvTZJEkgpIaVEkiRI0xRxHCNJEqRpijiOsbm5iZ2dHdi2XefQWIHzCGmtsbKygq2tLTiOc9FFnWPbNhzHwfr6OhzHQRAEcF0XQRDAcRw4jgPP8+B5HlzXhed58DwPrusuzt/wfR++78P3fbiuW5/7vg/P8+D7fu1/fn6O4XCIMAyRZRnSNMXR0RF6vR4cx8Hu7i52dnbgeR5c14XruvB9/9K9/UhE5LsCvhkEwDuDAHjnT3wDK5Ep4yWpGZ8AAAAASUVORK5CYII=';

    // Track mouse position
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    button.addEventListener('mousedown', () => {
        holdStart = Date.now();
        holding = true;
    });

    button.addEventListener('mouseup', () => {
        holding = false;
        const holdTime = Date.now() - holdStart;
        const power = Math.min(holdTime / 10, 100); // cap to 100%

        volume = Math.round(power); // for UI feedback
        balls.push(createBall(power));
    });

    function getIconPosition() {
        return {
            x: 80,
            y: canvas.height - 80,
            scale: 1
        };
    }

    function createBall(power) {
        const { x: iconX, y: iconY } = getIconPosition();
        
        // Calculate angle based on mouse position relative to icon
        const dx = mouseX - iconX;
        const dy = mouseY - iconY;
        const angle = Math.atan2(-dy, dx);
        
        const speed = Math.min(power, 100) * 0.2;

        return {
            x: iconX,
            y: iconY,
            radius: 10,
            vx: speed * Math.cos(angle),
            vy: speed * Math.sin(angle),
            gravity: 0.2
        };
    }

    function drawVolumeBar() {
        const barY = canvas.height - 10;
        const startX = 40;
        const endX = canvas.width - 40;

        ctx.beginPath();
        ctx.moveTo(startX, barY);
        ctx.lineTo(endX, barY);
        ctx.strokeStyle = '#aaa';
        ctx.stroke();

        for (let i = 0; i <= 10; i++) {
            const x = startX + i * ((endX - startX) / 10);
            ctx.beginPath();
            ctx.moveTo(x, barY - 5);
            ctx.lineTo(x, barY + 5);
            ctx.stroke();

            ctx.fillStyle = '#000';
            ctx.font = '10px Arial';
            ctx.fillText(`${i * 10}%`, x - 10, barY - 10);
        }
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw the volume icon
        const { x, y, scale } = getIconPosition();
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.drawImage(volumeIcon, -20, -20, 40, 40);
        ctx.restore();

        drawVolumeBar();

        balls.forEach((ball, index) => {
            ball.vy += ball.gravity;
            ball.x += ball.vx;
            ball.y += ball.vy;

            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
            ctx.fillStyle = 'black';
            ctx.fill();

            ctx.fillStyle = 'black';
            ctx.font = '10px Arial';
            ctx.fillText(`${Math.min(100, Math.round((ball.x - 40) / (canvas.width - 80) * 100))}%`, ball.x - 10, ball.y - 15);
        });

        requestAnimationFrame(update);
    }

    // Start animation loop
    update();
});