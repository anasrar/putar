import { type FC } from "react";
import { useFullscreen, useHotkeys } from "@mantine/hooks";
import {
	ActionIcon,
	Button,
	Group,
	Slider,
	Stack,
	Text,
	Tooltip,
} from "@mantine/core";
import {
	IconArrowsMaximize,
	IconArrowsMinimize,
	IconFileOff,
	IconFileUpload,
	IconInfoSquare,
	IconPlayerPause,
	IconPlayerPlay,
	IconSettings,
	IconVolume,
	IconVolumeOff,
} from "@tabler/icons";
import ComponentDownloadMenu from "./DownloadMenu";
import StateSource from "../states/source";
import StateControl from "../states/control";
import StateKeymaps from "../states/keymaps";
import StateSetting from "../states/setting";
import EventControl from "../events/control";
import parserDuration from "../utils/parsers/duration";

export type TProps = {
	className: string;
};

const ComponentControl: FC<TProps> = ({ className }) => {
	const stateSource = StateSource();
	const stateControl = StateControl();
	const stateKeymaps = StateKeymaps();
	const stateSetting = StateSetting();
	const { toggle, fullscreen } = useFullscreen();

	useHotkeys([
		[
			"H",
			() => {
				stateControl.toggleHide();
			},
		],
		[
			"ArrowLeft",
			() => {
				if (stateSource.type.startsWith("video")) {
					EventControl.emmit("seek", stateControl.addCurrentTime(-5));
				}
			},
		],
		[
			"ArrowRight",
			() => {
				if (stateSource.type.startsWith("video")) {
					EventControl.emmit("seek", stateControl.addCurrentTime(5));
				}
			},
		],
		[
			"space",
			() => {
				if (stateSource.type.startsWith("video")) {
					EventControl.emmit("togglePlayPause");
				}
			},
		],
		[
			"M",
			() => {
				EventControl.emmit("toggleMute");
			},
		],
		[
			"ArrowUp",
			() => {
				EventControl.emmit("volume", stateControl.addVolume(5));
			},
		],
		[
			"ArrowDown",
			() => {
				EventControl.emmit("volume", stateControl.addVolume(-5));
			},
		],
		["I", stateKeymaps.toggleModal],
		[
			"C",
			() => {
				EventControl.emmit("clearFile");
			},
		],
		[
			"O",
			() => {
				EventControl.emmit("openFile");
			},
		],
		["T", stateSetting.toggleModal],
		["F", toggle],
	]);

	return (
		(stateControl.hide && <></>) || (
			<div className={className}>
				<Stack p="xs" spacing="xs">
					{stateSource.type.startsWith("video") && (
						<Slider
							color="violet"
							size="md"
							radius="xl"
							label={parserDuration}
							defaultValue={stateControl.currentTime}
							value={stateControl.currentTime}
							min={0}
							max={stateControl.duration}
							onChange={(val) => {
								stateControl.setCurrentTime(val);
								EventControl.emmit("seek", val);
							}}
						/>
					)}
					<Group spacing="xs" position="apart">
						<Group spacing="xs">
							<Tooltip
								label={`${stateControl.paused ? "Play" : "Pause"} (space)`}
								position="top-start"
							>
								<ActionIcon
									onClick={() => {
										EventControl.emmit("togglePlayPause");
									}}
									color="violet"
									variant="filled"
									size="lg"
									disabled={!stateSource.type.startsWith("video")}
								>
									{(stateControl.paused && <IconPlayerPlay />) || (
										<IconPlayerPause />
									)}
								</ActionIcon>
							</Tooltip>
							<Tooltip
								label={`${stateControl.muted ? "Unmute" : "Mute"} (m)`}
								position="top"
							>
								<ActionIcon
									onClick={stateControl.toggleMute}
									color="violet"
									variant="filled"
									size="lg"
								>
									{(stateControl.muted && <IconVolumeOff />) || <IconVolume />}
								</ActionIcon>
							</Tooltip>
							<Slider
								color="violet"
								size="sm"
								radius="xl"
								defaultValue={stateControl.volume}
								value={stateControl.volume}
								min={0}
								max={100}
								onChange={(value) => {
									stateControl.setVolume(value);
									EventControl.emmit("volume", value);
								}}
								style={{ width: "4rem" }}
							/>
							<Text size="sm" weight={500}>
								{stateSource.type.startsWith("video") && (
									<>
										{`${parserDuration(
											~~stateControl.currentTime
										)} / ${parserDuration(stateControl.duration)}`}
									</>
								)}
							</Text>
						</Group>
						<Group spacing="xs">
							<Text weight={600} size="xs">
								{import.meta.env.VITE_PUTAR_VERSION ?? "Development"}
							</Text>
							{import.meta.env.VITE_PUTAR_TARGET === "web" && (
								<ComponentDownloadMenu>
									<Button color="violet">Download</Button>
								</ComponentDownloadMenu>
							)}
							<Tooltip label="Keymaps (i)" position="top">
								<ActionIcon
									onClick={stateKeymaps.toggleModal}
									color="violet"
									variant="filled"
									size="lg"
								>
									<IconInfoSquare />
								</ActionIcon>
							</Tooltip>
							<Tooltip label="Clear File (c)" position="top">
								<ActionIcon
									onClick={() => {
										if (stateSource.blob !== "") {
											EventControl.emmit("clearFile");
										}
									}}
									color="violet"
									variant="filled"
									size="lg"
								>
									<IconFileOff />
								</ActionIcon>
							</Tooltip>
							<Tooltip label="Open File (o)" position="top">
								<ActionIcon
									onClick={() => {
										EventControl.emmit("openFile");
									}}
									color="violet"
									variant="filled"
									size="lg"
								>
									<IconFileUpload />
								</ActionIcon>
							</Tooltip>
							<Tooltip label="Open Setting (t)" position="top">
								<ActionIcon
									onClick={stateSetting.toggleModal}
									color="violet"
									variant="filled"
									size="lg"
								>
									<IconSettings />
								</ActionIcon>
							</Tooltip>
							<Tooltip
								label={`${fullscreen ? "Close" : "Open"} Full Screen (f)`}
								position="top-end"
							>
								<ActionIcon
									onClick={toggle}
									color="violet"
									variant="filled"
									size="lg"
								>
									{fullscreen ? <IconArrowsMinimize /> : <IconArrowsMaximize />}
								</ActionIcon>
							</Tooltip>
						</Group>
					</Group>
				</Stack>
			</div>
		)
	);
};

export default ComponentControl;
