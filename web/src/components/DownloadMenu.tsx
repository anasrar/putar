import { type FC, type ReactNode } from "react";
import { Menu } from "@mantine/core";
import { IconDeviceDesktop } from "@tabler/icons";

export type TProps = {
	children: ReactNode;
};

const ComponentDownloadMenu: FC<TProps> = ({ children }) => {
	return (
		<Menu shadow="md" width={200}>
			<Menu.Target>{children}</Menu.Target>

			<Menu.Dropdown>
				<Menu.Label>Desktop</Menu.Label>
				<Menu.Item
					icon={<IconDeviceDesktop size={14} />}
					rightSection="zip"
					component="a"
					href={`https://github.com/anasrar/putar/releases/download/${
						import.meta.env.VITE_PUTAR_VERSION
					}/Putar-Windows-${import.meta.env.VITE_PUTAR_VERSION}.zip`}
					target="_blank"
				>
					Windows
				</Menu.Item>
				<Menu.Item
					icon={<IconDeviceDesktop size={14} />}
					rightSection="tar.gz"
					component="a"
					href={`https://github.com/anasrar/putar/releases/download/${
						import.meta.env.VITE_PUTAR_VERSION
					}/Putar-Linux-${import.meta.env.VITE_PUTAR_VERSION}.tar.gz`}
					target="_blank"
				>
					Linux
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
};

export default ComponentDownloadMenu;
