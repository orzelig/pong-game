class Ball {
    constructor(x, y, radius = 10) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.baseSpeed = 300; // pixels per second
        this.speed = this.baseSpeed;
        this.dx = 0;
        this.dy = 0;
        this.maxSpeed = 600;
        this.speedIncrement = 20; // Speed increase per paddle hit
    }

    // Launch the ball in a random direction
    launch(direction = null) {
        // Random angle between -45 and 45 degrees
        const angle = (Math.random() * 90 - 45) * (Math.PI / 180);

        // Direction: 1 for right, -1 for left
        if (direction === null) {
            direction = Math.random() > 0.5 ? 1 : -1;
        }

        this.dx = Math.cos(angle) * this.speed * direction;
        this.dy = Math.sin(angle) * this.speed;
    }

    update(deltaTime) {
        this.x += this.dx * deltaTime;
        this.y += this.dy * deltaTime;
    }

    // Bounce off top or bottom wall
    bounceY() {
        this.dy = -this.dy;
    }

    // Bounce off paddle with angle based on hit location
    bounceOffPaddle(paddle) {
        // Calculate where the ball hit the paddle (0 = top, 1 = bottom)
        const hitPosition = (this.y - paddle.y) / paddle.height;

        // Convert to angle: -60 to +60 degrees based on hit position
        const angle = (hitPosition - 0.5) * 120 * (Math.PI / 180);

        // Increase speed slightly with each hit
        this.speed = Math.min(this.speed + this.speedIncrement, this.maxSpeed);

        // Determine direction based on which side of the paddle
        const direction = this.x < paddle.x + paddle.width / 2 ? -1 : 1;

        this.dx = Math.cos(angle) * this.speed * direction;
        this.dy = Math.sin(angle) * this.speed;
    }

    // Check if ball is out of bounds (left or right)
    isOutLeft(canvasWidth) {
        return this.x + this.radius < 0;
    }

    isOutRight(canvasWidth) {
        return this.x - this.radius > canvasWidth;
    }

    // Reset ball to center
    reset(canvasWidth, canvasHeight) {
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;
        this.dx = 0;
        this.dy = 0;
        this.speed = this.baseSpeed;
    }

    // Get collision bounds
    getBounds() {
        return {
            left: this.x - this.radius,
            right: this.x + this.radius,
            top: this.y - this.radius,
            bottom: this.y + this.radius
        };
    }
}
