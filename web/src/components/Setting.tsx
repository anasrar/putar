import { type FC } from "react";
import { Group, Modal, Select, Slider, Stack, Text } from "@mantine/core";
import { IconScanEye } from "@tabler/icons";
import StateSetting from "../states/setting";
import StateCanvas from "../states/canvas";

const ComponentSetting: FC = () => {
	const stateSetting = StateSetting();
	const stateCanvas = StateCanvas();

	return (
		<Modal
			opened={stateSetting.modal}
			onClose={stateSetting.toggleModal}
			title="Setting"
			overflow="inside"
			centered
		>
			<Stack>
				<Group position="apart">
					<Text size="sm">Zoom</Text>
					<Group>
						<Slider
							color="violet"
							label={null}
							size="sm"
							style={{
								width: "16.25rem",
							}}
							min={0.25}
							max={4}
							step={0.05}
							value={stateCanvas.zoom}
							marks={[{ value: 1, label: "default" }]}
							onChange={stateCanvas.setZoom}
						/>
					</Group>
				</Group>
				<Group position="apart">
					<Text size="sm">Pan Speed</Text>
					<Group>
						<Slider
							color="violet"
							label={null}
							size="sm"
							style={{
								width: "16.25rem",
							}}
							min={1}
							max={2}
							step={0.05}
							value={1 + stateCanvas.panSpeed}
							marks={[
								{ value: 1.1, label: "slow" },
								{ value: 1.5, label: "normal" },
								{ value: 1.9, label: "fast" },
							]}
							onChange={stateCanvas.setPanSpeed}
						/>
					</Group>
				</Group>
				<Group position="apart">
					<Text size="sm">FOV</Text>
					<Group>
						<Slider
							color="violet"
							size="sm"
							style={{
								width: "16.25rem",
							}}
							min={20}
							max={160}
							step={1}
							value={stateCanvas.fov}
							marks={[{ value: 90, label: "90" }]}
							onChange={stateCanvas.setFov}
						/>
					</Group>
				</Group>
				<Group position="apart">
					<Text size="sm">Projection</Text>
					<Select
						value={stateCanvas.projection}
						icon={<IconScanEye size={14} />}
						data={[
							{ value: "cubemap", label: "Cube Map" },
							{ value: "equirectangular", label: "Equirectangular" },
						]}
						onChange={stateCanvas.setProjection}
					/>
				</Group>
			</Stack>
		</Modal>
	);
};

export default ComponentSetting;
