import { type FC } from "react";
import { useHotkeys, useMove } from "@mantine/hooks";
import { type Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Canvas, useThree, useLoader } from "@react-three/fiber";
import StateSource from "../states/source";
import StateCanvas from "../states/canvas";

const Projection: FC = () => {
	const stateSource = StateSource();
	const stateCanvas = StateCanvas();

	useThree(({ camera }) => {
		// I don't know why eslint complaint that fov not found on camera
		(camera as typeof camera & { fov: number }).fov = stateCanvas.fov;
		camera.zoom = stateCanvas.zoom;
		camera.lookAt(stateCanvas.lookAt);
		camera.updateProjectionMatrix();
	});

	// TODO: error handling
	const { nodes } = useLoader(GLTFLoader, "./models/projections.glb");

	return (
		<>
			{!stateSource.dropZone && (
				<>
					<mesh
						// eslint-disable-next-line react/no-unknown-property
						position={[0, 0, 0]}
						// eslint-disable-next-line react/no-unknown-property
						geometry={(nodes[stateCanvas.projection] as Mesh).geometry}
						// eslint-disable-next-line react/no-unknown-property
						material={stateCanvas.material}
					></mesh>
				</>
			)}
		</>
	);
};

export type TProps = {
	className: string;
	classNameActive: string;
};

const ComponentCanvas: FC<TProps> = ({ className, classNameActive }) => {
	const stateCanvas = StateCanvas();

	const { active, ref } = useMove(
		({ x, y }) => {
			stateCanvas.setPan({ x, y });
		},
		{
			onScrubStart: () => {
				stateCanvas.setPan({ x: 0, y: 0 });
			},
		}
	);

	useHotkeys([
		[
			"r",
			() => {
				stateCanvas.setFov(90);
				stateCanvas.setZoom(1);
				stateCanvas.setYaw(0);
				stateCanvas.setPitch(0);
			},
		],
		[
			"shift+w",
			() => {
				stateCanvas.addZoom(0.25);
			},
		],
		[
			"shift+s",
			() => {
				stateCanvas.addZoom(-0.25);
			},
		],
		[
			"w",
			() => {
				stateCanvas.addPitch(-1);
			},
		],
		[
			"s",
			() => {
				stateCanvas.addPitch(1);
			},
		],
		[
			"shift+a",
			() => {
				stateCanvas.addFov(-1);
			},
		],
		[
			"shift+d",
			() => {
				stateCanvas.addFov(1);
			},
		],
		[
			"a",
			() => {
				stateCanvas.addYaw(1);
			},
		],
		[
			"d",
			() => {
				stateCanvas.addYaw(-1);
			},
		],
	]);

	return (
		<div ref={ref} className={`${className} ${active ? classNameActive : ""}`}>
			<Canvas
				camera={{
					fov: stateCanvas.fov,
					position: [0, 0, 0],
					rotation: [0, 0, 0],
				}}
			>
				<Projection />
			</Canvas>
		</div>
	);
};

export default ComponentCanvas;
