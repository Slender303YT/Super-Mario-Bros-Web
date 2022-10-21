import Go from "./traits/Go.js";
import Jump from "./traits/Jump.js";
import PipeTraveller from "./traits/PipeTraveller.js";

export const mobile = {
	isInMobile: false,
	pressedAnyButton: false,
	ifIsOnMobile: function() {
		if(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
 			mobile.isInMobile = true;
 		}
	},
	setup: function() {
		mobile.ifIsOnMobile();
		if(mobile.isInMobile != false) {
			const arrowB = document.createElement("div");
			arrowB.id = "arrowsButtons";
			arrowB.style.position = "absolute";
			arrowB.style.top = window.innerHeight - 72 + "px";
			document.body.appendChild(arrowB);
			const controlsB = document.createElement("div");
			controlsB.id = "controlsbuttons";
			controlsB.style.position = "absolute";
			controlsB.style.top = window.innerHeight + 64 + "px";
			controlsB.style.left = window.innerWidth - 156 + "px";
			document.body.appendChild(controlsB);
			const leftArrow = document.createElement("div");
			leftArrow.id = "leftbutton";
			leftArrow.style.position = "absolute";
			leftArrow.style.top = "-64px";
			const leftImg = document.createElement("img");
			leftImg.src = "assets/images/mobile/leftbutton.png";
			leftArrow.appendChild(leftImg);
			arrowB.appendChild(leftArrow);
			const rightArrow = document.createElement("div");
			rightArrow.id = "rightbutton";
			rightArrow.style.position = "absolute";
			rightArrow.style.left = "128px";
			rightArrow.style.top = "-64px";
			const rightImg = document.createElement("img");
			rightImg.src = "assets/images/mobile/rightbutton.png";
			rightArrow.appendChild(rightImg);
			arrowB.appendChild(rightArrow);
			const upArrow = document.createElement("div");
			upArrow.id = "upbutton";
			upArrow.style.position = "absolute";
			upArrow.style.left = "64px";
			upArrow.style.top = "-128px";
			const upImg = document.createElement("img");
			upImg.src = "assets/images/mobile/upbutton.png";
			upArrow.appendChild(upImg);
			arrowB.appendChild(upArrow);
			const downArrow = document.createElement("div");
			downArrow.id = "downbutton";
			downArrow.style.position = "absolute";
			downArrow.style.left = "64px";
			const downImg = document.createElement("img");
			downImg.src = "assets/images/mobile/downbutton.png";
			downArrow.appendChild(downImg);
			arrowB.appendChild(downArrow);
			const bButton = document.createElement("div");
			bButton.id = "bbutton";
			bButton.style.position = "absolute";
			bButton.style.top = "-64px";
			const bbuttonImg = document.createElement("img");
			bbuttonImg.src = "assets/images/mobile/bbutton.png";
			bButton.appendChild(bbuttonImg);
			controlsB.appendChild(bButton);
			const aButton = document.createElement("div");
			aButton.id = "abutton";
			aButton.style.position = "absolute";
			aButton.style.left = "80px";
			aButton.style.top = "-64px";
			const abuttonImg = document.createElement("img");
			abuttonImg.src = "assets/images/mobile/abutton.png";
			aButton.appendChild(abuttonImg);
			controlsB.appendChild(aButton);
		}
	},
	mobileUpdate: function(gameCtx) {
		const entity = gameCtx.mario;
		const arrowB = document.getElementById("arrowsButtons");
		arrowB.style.top = window.innerHeight - 72 + "px";
		const controlsB = document.getElementById("controlsbuttons");
		controlsB.style.top = window.innerHeight - 72 + "px";
		controlsB.style.left = window.innerWidth - 156 + "px";
		["mousedown", "mouseup"].forEach(eventName => {
			document.getElementById("leftbutton").addEventListener(eventName, e => {
				mobile.pressedAnyButton = true;
				if(e.type === "mousedown") {
					entity.traits.get(Go).dir = -1;
					entity.traits.get(PipeTraveller).direction.x = -1;
				}
				if(e.type === "mouseup") {
					entity.traits.get(Go).dir = 0;
					entity.traits.get(Go).distance = 0;
					entity.traits.get(PipeTraveller).direction.x = 0;
				}
			});
			document.getElementById("rightbutton").addEventListener(eventName, e => {
				mobile.pressedAnyButton = true;
				if(e.type === "mousedown") {
					entity.traits.get(Go).dir = 1;
					entity.traits.get(PipeTraveller).direction.x = 1;
				}
				if(e.type === "mouseup") {
					entity.traits.get(Go).dir = 0;
					entity.traits.get(Go).distance = 0;
					entity.traits.get(PipeTraveller).direction.x = 0;
				}
			});
			document.getElementById("upbutton").addEventListener(eventName, e => {
				mobile.pressedAnyButton = true;
				if(e.type === "mousedown") {
					entity.traits.get(PipeTraveller).direction.y = -1;
				}
				if(e.type === "mouseup") {
					entity.traits.get(PipeTraveller).direction.y = 0;
				}
			});
			document.getElementById("downbutton").addEventListener(eventName, e => {
				mobile.pressedAnyButton = true;
				if(e.type === "mousedown") {
					entity.traits.get(PipeTraveller).direction.y = 1;
				}
				if(e.type === "mouseup") {
					entity.traits.get(PipeTraveller).direction.y = 0;
				}
			});
			document.getElementById("bbutton").addEventListener(eventName, e => {
				mobile.pressedAnyButton = true;
				if(e.type === "mousedown") {
					entity.turbo(true);
				}
				if(e.type === "mouseup") {
					entity.turbo(false);
				}
			});
			document.getElementById("abutton").addEventListener(eventName, e => {
				mobile.pressedAnyButton = true;
				if(e.type === "mousedown") {
					entity.traits.get(Jump).start();
				}
				if(e.type === "mouseup") {
					entity.traits.get(Jump).cancel();
				}
			});
		});

		document.getElementById("leftbutton").addEventListener("contextmenu", event => {
			event.preventDefault();
		});
		document.getElementById("rightbutton").addEventListener("contextmenu", event => {
			event.preventDefault();
		});
		document.getElementById("bbutton").addEventListener("contextmenu", event => {
			event.preventDefault();
		});
		document.getElementById("abutton").addEventListener("contextmenu", event => {
			event.preventDefault();
		});
	}
};