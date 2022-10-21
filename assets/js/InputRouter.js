export default class InputRouter {
	constructor() {
		this.receivers = new Set();
	}

	addReceiver(receivers) {
		this.receivers.add(receivers);
	}

	dropReceiver(receiver) {
		this.receivers(receiver);
	}

	route(routeInput) {
		for(const receiver of this.receivers) {
			routeInput(receiver);
		}
	}
}