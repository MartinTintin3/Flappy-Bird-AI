export class Renderer {
	constructor(ctx, config) {
		this.ctx = ctx;
	}

	render_pipes(pipes, pipe_image_top, pipe_image_bottom, debug_mode) {
		for(let i = 0; i < pipes.length; i++) {
			const pipe = pipes[i];
			this.ctx.drawImage(pipe.is_top_pipe ? pipe_image_top : pipe_image_bottom, pipe.position.x, pipe.position.y, pipe.size.width, pipe.size.height);
			if(debug_mode) {
				this.ctx.strokeStyle = "red";
				this.ctx.strokeRect(pipe.position.x, pipe.position.y, pipe.size.width, pipe.size.height);
			}
		}
	}

	render_bird(bird, bird_image, should_animte, debug_mode) {
		const angle = should_animte ? Math.PI / 2 * bird.velocity / 20 : 0;
		this.ctx.translate(bird.position.x + bird.size.width / 2, bird.position.y + bird.size.height / 2);
		this.ctx.rotate(angle);
		this.ctx.drawImage(bird_image, -bird.size.width / 2, -bird.size.height / 2, bird.size.width, bird.size.height);
		this.ctx.rotate(-angle);
		this.ctx.translate(-bird.position.x - bird.size.width / 2, -bird.position.y - bird.size.height / 2);

		if(debug_mode) {
			this.ctx.strokeStyle = "red";
			this.ctx.strokeRect(bird.position.x, bird.position.y, bird.size.width, bird.size.height);
		}
	}

	draw_text(text, x, y, text_color, outline_color) {
		this.ctx.fillText(text, x, y);
		this.ctx.strokeText(text, x, y);
	}
}