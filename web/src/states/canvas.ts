import {
	MathUtils,
	ShaderMaterial,
	Texture,
	TextureLoader,
	Vector3,
	VideoTexture,
} from "three";
import zustand from "zustand";
import vertexShader from "../shaders/vertexDefault.glsl";
import fragmentShader from "../shaders/fragmentDefault.glsl";

const targetFromYawPitch = (yaw: number, pitch: number) => {
	const x = -Math.sin(yaw) * Math.cos(pitch);
	const y = -Math.sin(pitch);
	const z = -Math.cos(yaw) * Math.cos(pitch);
	return new Vector3(x, y, z);
};

export type TStructure = {
	material: ShaderMaterial;
	textureImage: Texture;
	setTextureImage: (val: string) => Texture;
	textureVideo: VideoTexture | null;
	setTextureVideo: () => VideoTexture;
	cleanTexture: () => void;

	projection: "equirectangular" | "cubemap";
	setProjection: (val: TStructure["projection"]) => TStructure["projection"];

	zoom: number;
	setZoom: (val: number) => number;
	addZoom: (val: number) => number;

	lookAt: Vector3;
	yaw: number;
	setYaw: (val: number) => number;
	addYaw: (val: number) => number;
	pitch: number;
	setPitch: (val: number) => number;
	addPitch: (val: number) => number;
	pan: { x: number; y: number };
	setPan: (val: TStructure["pan"]) => TStructure["pan"];
	panSpeed: number;
	setPanSpeed: (val: number) => number;

	fov: number;
	setFov: (val: number) => number;
	addFov: (val: number) => number;
};

const StateCanvas = zustand<TStructure>((set) => ({
	material: new ShaderMaterial({
		uniforms: {
			U_IS_IMAGE: {
				value: 1.0,
			},
			U_TEXTURE_IMAGE: {
				value: null,
			},
			U_TEXTURE_VIDEO: {
				value: null,
			},
		},
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
	}),
	textureImage: new Texture(),
	setTextureImage: (val) => {
		const result = new TextureLoader().load(val);
		set(({ cleanTexture, material }) => {
			cleanTexture();
			material.uniforms.U_IS_IMAGE.value = 1.0;
			material.uniforms.U_TEXTURE_IMAGE.value = result;
			material.uniforms.U_TEXTURE_VIDEO.value = null;
			return {
				textureImage: result,
			};
		});
		return result;
	},
	textureVideo: null,
	setTextureVideo: () => {
		const result = new VideoTexture(
			document.getElementById("textureVideo") as HTMLVideoElement
		);
		set(({ cleanTexture, material }) => {
			cleanTexture();
			material.uniforms.U_IS_IMAGE.value = 0.0;
			material.uniforms.U_TEXTURE_IMAGE.value = null;
			material.uniforms.U_TEXTURE_VIDEO.value = result;
			return {
				textureVideo: result,
			};
		});
		return result;
	},
	cleanTexture: () => {
		set(({ textureImage, textureVideo }) => {
			textureImage.dispose();
			textureVideo?.dispose();
			return {};
		});
	},

	projection: "equirectangular",
	setProjection: (val) => {
		set({ projection: val });
		return val;
	},

	zoom: 1,
	setZoom: (val) => {
		set({ zoom: MathUtils.clamp(val, 0.25, 4) });
		return val;
	},
	addZoom: (val) => {
		let result = val;
		set(({ zoom }) => {
			result = MathUtils.clamp(zoom + val, 0.25, 4);
			return { zoom: result };
		});
		return result;
	},

	lookAt: new Vector3(0, 0, -1),
	yaw: 0,
	setYaw: (val) => {
		set(({ pitch }) => {
			const lookAt = targetFromYawPitch(val, pitch);
			return {
				lookAt,
				yaw: val,
			};
		});
		return val;
	},
	addYaw: (val) => {
		let result = val;
		set(({ yaw, pitch }) => {
			result = yaw + MathUtils.degToRad(val);
			const lookAt = targetFromYawPitch(result, pitch);
			return {
				lookAt,
				yaw: result,
			};
		});
		return result;
	},
	pitch: 0,
	setPitch: (val) => {
		set(({ yaw }) => {
			const lookAt = targetFromYawPitch(
				yaw,
				MathUtils.clamp(val, -Math.PI / 2, Math.PI / 2)
			);
			return {
				lookAt,
				pitch: val,
			};
		});
		return val;
	},
	addPitch: (val) => {
		let result = val;
		set(({ yaw, pitch }) => {
			result = MathUtils.clamp(
				pitch + MathUtils.degToRad(val),
				-Math.PI / 2,
				Math.PI / 2
			);
			const lookAt = targetFromYawPitch(yaw, result);
			return {
				lookAt,
				pitch: result,
			};
		});
		return result;
	},
	pan: { x: 0, y: 0 },
	setPan: (val) => {
		set(({ addYaw, addPitch, pan: lookAround, panSpeed }) => {
			const { x: oldX, y: oldY } = lookAround;
			const { x: newX, y: newY } = val;

			if (!(oldX + oldY === 0 || newX + newY === 0)) {
				addYaw((newX - oldX) * (50 + panSpeed * 300));
				addPitch((newY - oldY) * -(50 + panSpeed * 300));
			}

			return {
				pan: val,
			};
		});
		return val;
	},
	panSpeed: 0.5,
	setPanSpeed: (val) => {
		set({
			panSpeed: val - 1,
		});
		return val;
	},

	fov: 90,
	setFov: (val) => {
		set({
			fov: val,
		});
		return val;
	},
	addFov: (val) => {
		let result = val;
		set(({ fov }) => {
			result = MathUtils.clamp(fov + val, 20, 160);
			return { fov: result };
		});
		return result;
	},
}));

export default StateCanvas;
