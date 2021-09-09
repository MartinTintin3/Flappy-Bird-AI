export class Pipe {
	constructor(x, y, image, is_top_pipe, config) {
		this.config = config;
		this.position = { x, y };
		this.size = { width: image.width, height: image.height };
		this.is_top_pipe = is_top_pipe;
		this.out = false;
	}

	update() {
		this.position.x -= this.config.pipe_speed;
		if(this.position.x + this.size.width < 0) {
			this.out = true;
		}
	}
}