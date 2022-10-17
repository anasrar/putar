import { useEffect, useRef, type FC } from "react";
import { Group, Stack, Text, useMantineTheme } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import StateSource from "../states/source";
import StateControl from "../states/control";
import StateCanvas from "../states/canvas";
import EventControl from "../events/control";

export type TProps = {
	className: string;
	classNameDrop: string;
};

const ComponentSource: FC<TProps> = ({ className, classNameDrop }) => {
	const stateSource = StateSource();
	const stateControl = StateControl();
	const stateCanvas = StateCanvas();
	const openFileRef = useRef<() => void>(null);
	const videoElement = useRef<HTMLVideoElement>(null);
	const theme = useMantineTheme();

	const listenerFile = (files: FileWithPath[]) => {
		const file = files[0];
		if (!file) return;

		if (
			import.meta.env.VITE_PUTAR_TARGET === "electron" &&
			file.type.startsWith("video")
		) {
			stateSource.setType(file.type);
			stateSource.setBlob("file:///" + file.path);

			if (videoElement.current) {
				videoElement.current.currentTime = 0;
				stateControl.setCurrentTime(0);
			}

			stateCanvas.setTextureVideo();
			stateSource.setDropZone(false);

			return;
		}

		const reader = new FileReader();

		reader.addEventListener("load", async (event) => {
			const blob = new Blob(
				event.target?.result ? [event.target.result] : undefined,
				{
					type: file.type,
				}
			);

			const isImage = file.type.startsWith("image");
			const blobUrl = window.URL.createObjectURL(blob);
			stateSource.setType(file.type);
			stateSource.setBlob(blobUrl);

			if (isImage) {
				videoElement.current?.pause();
				stateControl.pause();
			}

			if (videoElement.current) {
				videoElement.current.currentTime = 0;
				stateControl.setCurrentTime(0);
			}

			if (isImage) {
				stateCanvas.setTextureImage(blobUrl);
			} else {
				stateCanvas.setTextureVideo();
			}

			stateSource.setDropZone(false);
		});

		reader.readAsArrayBuffer(file);
	};

	useEffect(() => {
		const removeListenerSeek = EventControl.addEventListener("seek", (val) => {
			if (videoElement.current) {
				videoElement.current.currentTime = val;
			}
		});
		const removeListenerTogglePlayPause = EventControl.addEventListener(
			"togglePlayPause",
			() => {
				if (videoElement.current?.paused) {
					videoElement.current?.play();
				} else {
					videoElement.current?.pause();
				}
			}
		);
		const removeListenerToggleMute = EventControl.addEventListener(
			"toggleMute",
			() => {
				stateControl.toggleMute();
			}
		);
		const removeListenerVolume = EventControl.addEventListener(
			"volume",
			(val) => {
				if (videoElement.current) {
					videoElement.current.volume = val / 100;
				}
			}
		);
		const removeListenerInputFileClick = EventControl.addEventListener(
			"openFile",
			() => {
				if (openFileRef.current) {
					openFileRef.current();
				}
			}
		);
		const removeListenerClearFile = EventControl.addEventListener(
			"clearFile",
			() => {
				stateSource.setDropZone(true);
				stateSource.setType("image/png");
				stateSource.setBlob("");
				stateControl.pause();
				stateCanvas.cleanTexture();
			}
		);

		const listenerVideoPlay = () => {
			stateControl.play();
		};
		videoElement.current?.addEventListener("play", listenerVideoPlay);

		const listenerVideoPause = () => {
			stateControl.pause();
		};
		videoElement.current?.addEventListener("pause", listenerVideoPause);

		const listenerVideoEnded = () => {
			stateControl.pause();
		};
		videoElement.current?.addEventListener("ended", listenerVideoEnded);

		const listenerVideoDurationChange = (event: Event) => {
			const target = event.target as HTMLVideoElement;
			stateControl.setDuration(target.duration);
		};
		videoElement.current?.addEventListener(
			"durationchange",
			listenerVideoDurationChange
		);

		const listenerVideoTimeUpdate = (event: Event) => {
			const target = event.target as HTMLVideoElement;
			stateControl.setCurrentTime(target.currentTime);
		};
		videoElement.current?.addEventListener(
			"timeupdate",
			listenerVideoTimeUpdate
		);

		return () => {
			removeListenerSeek();
			removeListenerTogglePlayPause();
			removeListenerToggleMute();
			removeListenerVolume();
			removeListenerInputFileClick();
			removeListenerClearFile();

			videoElement.current?.removeEventListener("play", listenerVideoPlay);
			videoElement.current?.removeEventListener("pause", listenerVideoPause);
			videoElement.current?.removeEventListener("ended", listenerVideoEnded);
			videoElement.current?.removeEventListener(
				"durationchange",
				listenerVideoDurationChange
			);
			videoElement.current?.removeEventListener(
				"timeupdate",
				listenerVideoTimeUpdate
			);
		};
	}, []);

	return (
		<>
			<div
				className={`${className} ${stateSource.dropZone ? classNameDrop : ""}`}
			>
				<video
					hidden
					ref={videoElement}
					id="textureVideo"
					src={stateSource.blob}
					width="300px"
					autoPlay
					muted={stateControl.muted}
				/>
				<Stack m="md" p="xl">
					<Dropzone
						openRef={openFileRef}
						onDrop={listenerFile}
						useFsAccessApi={false}
						accept={{ "image/*": [], "video/*": [] }}
					>
						<Group
							position="center"
							spacing="xl"
							style={{ pointerEvents: "none" }}
						>
							<Dropzone.Accept>
								<IconUpload
									size={50}
									stroke={1.5}
									color={
										theme.colors[theme.primaryColor][
											theme.colorScheme === "dark" ? 4 : 6
										]
									}
								/>
							</Dropzone.Accept>
							<Dropzone.Reject>
								<IconX
									size={50}
									stroke={1.5}
									color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
								/>
							</Dropzone.Reject>
							<Dropzone.Idle>
								<IconPhoto size={50} stroke={1.5} />
							</Dropzone.Idle>

							<Stack spacing="xs">
								<Text size="xl" inline>
									Drag image or video here or click to select file
								</Text>
								{import.meta.env.VITE_PUTAR_TARGET === "web" && (
									<Text size="sm" color="dimmed">
										File size above 600MB might slow to open.
										<br />
										We recommend using application version for big file size.
									</Text>
								)}
							</Stack>
						</Group>
					</Dropzone>
				</Stack>
			</div>
			<Dropzone.FullScreen
				onDrop={listenerFile}
				accept={{ "image/*": [], "video/*": [] }}
			>
				<Group
					position="center"
					spacing="xl"
					style={{ minHeight: "100vh", pointerEvents: "none" }}
				>
					<Dropzone.Accept>
						<IconUpload
							size={50}
							stroke={1.5}
							color={
								theme.colors[theme.primaryColor][
									theme.colorScheme === "dark" ? 4 : 6
								]
							}
						/>
					</Dropzone.Accept>
					<Dropzone.Reject>
						<IconX
							size={50}
							stroke={1.5}
							color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
						/>
					</Dropzone.Reject>
					<Dropzone.Idle>
						<IconPhoto size={50} stroke={1.5} />
					</Dropzone.Idle>

					<Stack spacing="xs">
						<Text size="xl" inline>
							Drag image or video here or click to select file
						</Text>
						{import.meta.env.VITE_PUTAR_TARGET === "web" && (
							<Text size="sm" color="dimmed">
								File size above 600MB might slow to open.
								<br />
								We recommend using application version for big file size.
							</Text>
						)}
					</Stack>
				</Group>
			</Dropzone.FullScreen>
		</>
	);
};

export default ComponentSource;
