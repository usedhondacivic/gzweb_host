import { SceneManager } from "gzweb";

let wsUrl = "ws://localhost:9002";

let sceneManager;

sceneManager = new SceneManager({
	elementId: "container",
});
sceneManager.connect(wsUrl);

var poll_connect;

let was_connected = true;
sceneManager.getConnectionStatusAsObservable().subscribe((connected) => {
	if (!document.getElementById("info_splash")) return;
	if (connected) {
		document.getElementById("info_splash").style.visibility = "hidden";
		clearInterval(poll_connect);
	} else {
		document.getElementById("info_splash").style.visibility = "visible";
		document.getElementById("info").innerHTML =
			"Cannot connect to server, retrying.<br><br>Waiting for connection on " +
			wsUrl +
			"...";
		if (was_connected) {
			poll_connect = setInterval(function () {
				sceneManager.destroy();
				document.getElementById("container").innerHTML = "";
				sceneManager.connect(wsUrl);
			}, 5000);
		}
	}
	was_connected = connected;
});

function resize() {
	if (sceneManager) {
		sceneManager.resize();
	}
}
window.onresize = resize;
