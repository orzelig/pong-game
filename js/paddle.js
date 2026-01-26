class Paddle {
    constructor(x, y, width = 15, height = 100) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 400; // pixels per second
        this.dy = 0; // vertical velocity
    }

    moveUp() {
        this.dy = -this.speed;
    }

    moveDown() {
        this.dy = this.speed;
    }

    stop() {
        this.dy = 0;
    }

    update(deltaTime, canvasHeight) {
        this.y += this.dy * deltaTime;

        // Clamp to canvas boundaries
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y + this.height > canvasHeight) {
            this.y = canvasHeight - this.height;
        }
    }

    // Get center Y position of paddle
    getCenterY() {
        return this.y + this.height / 2;
    }

    // Get collision bounds
    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }

    // Reset paddle to initial position
    reset(canvasHeight) {
        this.y = (canvasHeight - this.height) / 2;
        this.dy = 0;
    }
}
