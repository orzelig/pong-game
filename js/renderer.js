class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
    }

    clear() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawPaddle(paddle) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }

    drawBall(ball) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawCenterLine() {
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2, 0);
        this.ctx.lineTo(this.width / 2, this.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    drawScores(score1, score2) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';

        // Player 1 score (left side)
        this.ctx.fillText(score1.toString(), this.width / 4, 60);

        // Player 2 score (right side)
        this.ctx.fillText(score2.toString(), (this.width / 4) * 3, 60);
    }

    drawMessage(message, subMessage = '') {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(message, this.width / 2, this.height / 2);

        if (subMessage) {
            this.ctx.font = '24px Arial';
            this.ctx.fillStyle = '#4ecdc4';
            this.ctx.fillText(subMessage, this.width / 2, this.height / 2 + 40);
        }
    }

    drawMenu() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PONG', this.width / 2, this.height / 3);

        this.ctx.font = '24px Arial';
        this.ctx.fillStyle = '#4ecdc4';
        this.ctx.fillText('Press 1 for Single Player (vs AI)', this.width / 2, this.height / 2);
        this.ctx.fillText('Press 2 for Two Players', this.width / 2, this.height / 2 + 40);
    }

    drawPaused() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', this.width / 2, this.height / 2);

        this.ctx.font = '24px Arial';
        this.ctx.fillStyle = '#4ecdc4';
        this.ctx.fillText('Press SPACE to continue', this.width / 2, this.height / 2 + 40);
    }

    drawGameOver(winner) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${winner} WINS!`, this.width / 2, this.height / 2);

        this.ctx.font = '24px Arial';
        this.ctx.fillStyle = '#4ecdc4';
        this.ctx.fillText('Press R to play again', this.width / 2, this.height / 2 + 40);
    }

    drawStartPrompt() {
        this.ctx.fillStyle = '#4ecdc4';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Press SPACE to start', this.width / 2, this.height - 50);
    }
}
