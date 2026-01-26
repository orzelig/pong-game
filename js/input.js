class InputHandler {
    constructor() {
        this.keys = {};

        // Bind event listeners
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(e) {
        this.keys[e.code] = true;

        // Prevent default for game keys to avoid scrolling
        if (['ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
            e.preventDefault();
        }
    }

    handleKeyUp(e) {
        this.keys[e.code] = false;
    }

    isPressed(keyCode) {
        return this.keys[keyCode] === true;
    }

    // Check if a key was just pressed (for single actions)
    wasJustPressed(keyCode) {
        if (this.keys[keyCode] && !this.keys[keyCode + '_handled']) {
            this.keys[keyCode + '_handled'] = true;
            return true;
        }
        return false;
    }

    // Reset handled state when key is released
    resetHandled(keyCode) {
        if (!this.keys[keyCode]) {
            this.keys[keyCode + '_handled'] = false;
        }
    }

    // Player 1 controls (W/S)
    isPlayer1Up() {
        return this.isPressed('KeyW');
    }

    isPlayer1Down() {
        return this.isPressed('KeyS');
    }

    // Player 2 controls (Arrow keys)
    isPlayer2Up() {
        return this.isPressed('ArrowUp');
    }

    isPlayer2Down() {
        return this.isPressed('ArrowDown');
    }

    // Game controls
    isStartPause() {
        return this.wasJustPressed('Space');
    }

    isReset() {
        return this.wasJustPressed('KeyR');
    }

    isSinglePlayer() {
        return this.wasJustPressed('Digit1');
    }

    isTwoPlayer() {
        return this.wasJustPressed('Digit2');
    }

    // Update handled states
    update() {
        this.resetHandled('Space');
        this.resetHandled('KeyR');
        this.resetHandled('Digit1');
        this.resetHandled('Digit2');
    }
}
