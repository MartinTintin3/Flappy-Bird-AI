export class Bird {
	constructor(image, config) {
		this.config = config;
		this.size = {
			width: image.width,
			height: image.height,
		}
		this.position = {
			x: this.config.bird_x,
			y: this.config.height / 4,
		}
		this.y_position_before_flap = null;
		this.velocity = 0;
		this.alive = true;
	}

	flap() {
		if(Math.random() > 0.7) return;
		this.velocity = this.config.flap;
		this.y_position_before_flap = this.position.y;
	}

	update(pipes) {
		this.position.x = this.config.bird_x;
		this.velocity += this.config.gravity;
		this.position.y += this.velocity;

		if(this.y_position_before_flap != null && this.position.y > this.y_position_before_flap) {
			this.y_position_before_flap = null;
		}

		if(this.position.y + this.size.height > this.config.height || (this.position.y < 0 && this.config.ceiling_kills)) {
			this.alive = false;
		} else if(this.position.y < 0 && !this.config.ceiling_kills) {
			this.position.y = 0;
			this.velocity = 0;
		}

		for(let i = 0; i < pipes.length; i++) {
			const pipe = pipes[i];
			if(this.position.x + this.size.width > pipe.position.x && this.position.x < pipe.position.x + pipe.size.width) {
				if(this.position.y + this.size.height > pipe.position.y && this.position.y < pipe.position.y + pipe.size.height) {
					this.alive = false;
				}
			}
		}
	}
}