import { BrowserWindow } from "electron";
import { join } from "path";

let win: BrowserWindow | null = null;

export const create = (): boolean => {
	if (win !== null) return false;

	win = new BrowserWindow({});
	win.setMenu(null);
	win.loadFile(join(__dirname, "../../../web/dist/index.html"));

	return true;
};

const WindowMain = {
	create: create,
};

export default WindowMain;
