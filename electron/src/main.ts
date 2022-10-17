import { app } from "electron";
import WindowMain from "./windows/main";

app.whenReady().then(() => {
	WindowMain.create();
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
