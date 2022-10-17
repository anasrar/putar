import CreateEventEmitter from "../utils/CreateEventEmitter";

type TEvents = {
	seek: (val: number) => void;
	togglePlayPause: () => void;
	toggleMute: () => void;
	clearFile: () => void;
	openFile: () => void;
	volume: (val: number) => void;
};

const EventControl = CreateEventEmitter<TEvents>();

export default EventControl;
