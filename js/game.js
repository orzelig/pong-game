class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.renderer = new Renderer(this.canvas);
        this.input = new InputHandler();

        // Game constants
        this.WINNING_SCORE = 11;
        this.PADDLE_MARGIN = 30;

        // Initialize game objects
        this.paddle1 = new Paddle(
            this.PADDLE_MARGIN,
            (this.canvas.height - 100) / 2
        );
        this.paddle2 = new Paddle(
            this.canvas.width - this.PADDLE_MARGIN - 15,
            (this.canvas.height - 100) / 2
        );
        this.ball = new Ball(
            this.canvas.width / 2,
            this.canvas.height / 2
        );
        this.ai = new AI(this.paddle2);

        // Game state
        this.state = 'menu'; // menu, ready, playing, paused, gameOver
        this.singlePlayer = true;
        this.score1 = 0;
        this.score2 = 0;
        this.lastTime = 0;
        this.servingPlayer = 1;

        // Start game loop
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    gameLoop(timestamp) {
        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        // Cap delta time to prevent large jumps
        const cappedDelta = Math.min(deltaTime, 0.05);

        this.handleInput();
        this.update(cappedDelta);
        this.render();

        this.input.update();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    handleInput() {
        // Menu state - mode selection
        if (this.state === 'menu') {
            if (this.input.isSinglePlayer()) {
                this.singlePlayer = true;
                this.state = 'ready';
            } else if (this.input.isTwoPlayer()) {
                this.singlePlayer = false;
                this.state = 'ready';
            }
            return;
        }

        // Reset game
        if (this.input.isReset()) {
            this.resetGame();
            return;
        }

        // Start/Pause toggle
        if (this.input.isStartPause()) {
            if (this.state === 'ready') {
                this.startGame();
            } else if (this.state === 'playing') {
                this.state = 'paused';
            } else if (this.state === 'paused') {
                this.state = 'playing';
            }
        }

        // Player 1 controls
        if (this.input.isPlayer1Up()) {
            this.paddle1.moveUp();
        } else if (this.input.isPlayer1Down()) {
            this.paddle1.moveDown();
        } else {
            this.paddle1.stop();
        }

        // Player 2 controls (only in two-player mode)
        if (!this.singlePlayer) {
            if (this.input.isPlayer2Up()) {
                this.paddle2.moveUp();
            } else if (this.input.isPlayer2Down()) {
                this.paddle2.moveDown();
            } else {
                this.paddle2.stop();
            }
        }
    }

    update(deltaTime) {
        if (this.state !== 'playing') return;

        // Update paddles
        this.paddle1.update(deltaTime, this.canvas.height);

        if (this.singlePlayer) {
            // AI controls paddle 2
            this.ai.update(deltaTime, this.ball, this.canvas.height);
        }
        this.paddle2.update(deltaTime, this.canvas.height);

        // Update ball
        this.ball.update(deltaTime);

        // Check collisions
        this.checkCollisions();

        // Check scoring
        this.checkScoring();
    }

    checkCollisions() {
        // Ball vs top/bottom walls
        if (this.ball.y - this.ball.radius <= 0) {
            this.ball.y = this.ball.radius;
            this.ball.bounceY();
        }
        if (this.ball.y + this.ball.radius >= this.canvas.height) {
            this.ball.y = this.canvas.height - this.ball.radius;
            this.ball.bounceY();
        }

        // Ball vs paddle 1 (left)
        if (this.checkPaddleCollision(this.ball, this.paddle1)) {
            // Move ball outside paddle to prevent sticking
            this.ball.x = this.paddle1.x + this.paddle1.width + this.ball.radius;
            this.ball.bounceOffPaddle(this.paddle1);
        }

        // Ball vs paddle 2 (right)
        if (this.checkPaddleCollision(this.ball, this.paddle2)) {
            // Move ball outside paddle to prevent sticking
            this.ball.x = this.paddle2.x - this.ball.radius;
            this.ball.bounceOffPaddle(this.paddle2);
        }
    }

    checkPaddleCollision(ball, paddle) {
        const ballBounds = ball.getBounds();
        const paddleBounds = paddle.getBounds();

        return (
            ballBounds.right > paddleBounds.left &&
            ballBounds.left < paddleBounds.right &&
            ballBounds.bottom > paddleBounds.top &&
            ballBounds.top < paddleBounds.bottom
        );
    }

    checkScoring() {
        // Ball passed left edge - Player 2 scores
        if (this.ball.isOutLeft()) {
            this.score2++;
            this.servingPlayer = 1;
            this.handleScore();
        }
        // Ball passed right edge - Player 1 scores
        else if (this.ball.isOutRight(this.canvas.width)) {
            this.score1++;
            this.servingPlayer = 2;
            this.handleScore();
        }
    }

    handleScore() {
        // Check for winner
        if (this.score1 >= this.WINNING_SCORE) {
            this.state = 'gameOver';
            this.winner = 'PLAYER 1';
        } else if (this.score2 >= this.WINNING_SCORE) {
            this.state = 'gameOver';
            this.winner = this.singlePlayer ? 'AI' : 'PLAYER 2';
        } else {
            // Reset for next round
            this.ball.reset(this.canvas.width, this.canvas.height);
            this.paddle1.reset(this.canvas.height);
            this.paddle2.reset(this.canvas.height);
            this.ai.reset();
            this.state = 'ready';
        }
    }

    startGame() {
        this.state = 'playing';
        // Launch ball toward the player who was scored on
        this.ball.launch(this.servingPlayer === 1 ? -1 : 1);
    }

    resetGame() {
        this.score1 = 0;
        this.score2 = 0;
        this.ball.reset(this.canvas.width, this.canvas.height);
        this.paddle1.reset(this.canvas.height);
        this.paddle2.reset(this.canvas.height);
        this.ai.reset();
        this.servingPlayer = 1;
        this.state = 'menu';
    }

    render() {
        this.renderer.clear();

        if (this.state === 'menu') {
            this.renderer.drawMenu();
            return;
        }

        // Draw game elements
        this.renderer.drawCenterLine();
        this.renderer.drawPaddle(this.paddle1);
        this.renderer.drawPaddle(this.paddle2);
        this.renderer.drawBall(this.ball);
        this.renderer.drawScores(this.score1, this.score2);

        // Draw state-specific overlays
        if (this.state === 'ready') {
            this.renderer.drawStartPrompt();
        } else if (this.state === 'paused') {
            this.renderer.drawPaused();
        } else if (this.state === 'gameOver') {
            this.renderer.drawGameOver(this.winner);
        }
    }
}

// Start the game when page loads
window.addEventListener('load', () => {
    new Game();
});
