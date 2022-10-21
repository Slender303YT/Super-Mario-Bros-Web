export default class AudioBoard {
	constructor() {
		this.buffers = new Map();
	}

	addAudio(name, buffer) {
		this.buffers.set(name, buffer);
	}

	playAudio(name, audioCtx) {
		const source = audioCtx.createBufferSource();
		source.connect(audioCtx.destination);
		source.buffer = this.buffers.get(name);
		source.start(0);
	}
}