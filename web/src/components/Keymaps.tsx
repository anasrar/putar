import { type ReactNode, type FC } from "react";
import { Group, Kbd, Modal, Stack, Text } from "@mantine/core";
import StateKeymaps from "../states/keymaps";

const items: { label: string; items: { text: string; keys: string[] }[] }[] = [
	{
		label: "3D",
		items: [
			{
				text: "Rotate To Left",
				keys: ["A"],
			},
			{
				text: "Rotate To Right",
				keys: ["D"],
			},
			{
				text: "Rotate To Up",
				keys: ["W"],
			},
			{
				text: "Rotate To Down",
				keys: ["S"],
			},
			{
				text: "Zoom In",
				keys: ["shift", "W"],
			},
			{
				text: "Zoom Out",
				keys: ["shift", "S"],
			},
			{
				text: "Increase FOV",
				keys: ["shift", "D"],
			},
			{
				text: "Decrease FOV ",
				keys: ["shift", "A"],
			},
			{
				text: "Reset View",
				keys: ["R"],
			},
		],
	},
	{
		label: "Control",
		items: [
			{
				text: "Toggle Hideo Control",
				keys: ["H"],
			},
			{
				text: "Seek -5 Seconds",
				keys: ["ArrowLeft"],
			},
			{
				text: "Seek +5 Seconds",
				keys: ["ArrowRight"],
			},
			{
				text: "Toggle Play / Pause",
				keys: ["space"],
			},
			{
				text: "Toggle Mute / Unmute",
				keys: ["M"],
			},
			{
				text: "Increase Volume",
				keys: ["ArrowUp"],
			},
			{
				text: "Decrease Volume",
				keys: ["ArrowDown"],
			},
			{
				text: "Keymaps",
				keys: ["I"],
			},
			{
				text: "Clear File",
				keys: ["C"],
			},
			{
				text: "Open File",
				keys: ["O"],
			},
			{
				text: "Setting",
				keys: ["T"],
			},
			{
				text: "Full Screen",
				keys: ["F"],
			},
		],
	},
];

const ComponentKeymaps: FC = () => {
	const stateKeymaps = StateKeymaps();

	const nodes: ReactNode[] = [];
	for (const item of items) {
		nodes.push(
			<Text key={item.label} size="md" weight={600}>
				{item.label}
			</Text>
		);
		for (const { text, keys } of item.items) {
			const keyNodes: ReactNode[] = [];
			keys.forEach((val, i) => {
				keyNodes.push(<Kbd key={val}>{val}</Kbd>);
				if (i + 1 !== keys.length) {
					keyNodes.push(
						<Text key={`key_${val}`} size="sm">
							+
						</Text>
					);
				}
			});

			nodes.push(
				<Group key={text} position="apart">
					<Text size="sm">{text}</Text>
					<Group spacing="xs" position="right">
						{keyNodes}
					</Group>
				</Group>
			);
		}
	}

	return (
		<Modal
			opened={stateKeymaps.modal}
			onClose={stateKeymaps.toggleModal}
			title="Keymaps"
			overflow="inside"
			centered
		>
			<Stack>{nodes}</Stack>
		</Modal>
	);
};

export default ComponentKeymaps;
