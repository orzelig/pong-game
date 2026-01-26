class AI {
    constructor(paddle) {
        this.paddle = paddle;
        this.reactionDelay = 0.1; // seconds before AI starts reacting
        this.reactionTimer = 0;
        this.targetY = paddle.getCenterY();
        this.accuracy = 0.8; // How accurately AI tracks the ball (0-1)
        this.predictionError = 30; // Random error in pixels
    }

    update(deltaTime, ball, canvasHeight) {
        // Only react when ball is moving toward AI paddle
        if (ball.dx <= 0) {
            // Ball moving away, move paddle toward center
            this.targetY = canvasHeight / 2;
        } else {
            // Update reaction timer
            this.reactionTimer += deltaTime;

            if (this.reactionTimer >= this.reactionDelay) {
                // Predict where ball will be when it reaches paddle
                this.targetY = this.predictBallPosition(ball, canvasHeight);
                this.reactionTimer = 0;
            }
        }

        // Move paddle toward target
        const paddleCenter = this.paddle.getCenterY();
        const deadZone = 10; // Don't move if close enough

        if (paddleCenter < this.targetY - deadZone) {
            this.paddle.moveDown();
        } else if (paddleCenter > this.targetY + deadZone) {
            this.paddle.moveUp();
        } else {
            this.paddle.stop();
        }
    }

    predictBallPosition(ball, canvasHeight) {
        // Simple prediction: calculate where ball will be at paddle's x position
        if (ball.dx === 0) return canvasHeight / 2;

        const timeToReach = (this.paddle.x - ball.x) / ball.dx;
        if (timeToReach < 0) return ball.y;

        let predictedY = ball.y + ball.dy * timeToReach;

        // Account for bounces off top/bottom walls
        const ballRadius = ball.radius;
        while (predictedY < ballRadius || predictedY > canvasHeight - ballRadius) {
            if (predictedY < ballRadius) {
                predictedY = ballRadius + (ballRadius - predictedY);
            }
            if (predictedY > canvasHeight - ballRadius) {
                predictedY = (canvasHeight - ballRadius) - (predictedY - (canvasHeight - ballRadius));
            }
        }

        // Add some imperfection based on accuracy
        if (Math.random() > this.accuracy) {
            predictedY += (Math.random() - 0.5) * this.predictionError * 2;
        }

        return predictedY;
    }

    reset() {
        this.reactionTimer = 0;
    }
}
