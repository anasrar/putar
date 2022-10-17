import { type FC } from "react";
import { MantineProvider } from "@mantine/core";
import styles from "./styles/base.module.scss";
import ComponentCanvas from "./components/Canvas";
import ComponentControl from "./components/Control";
import ComponentKeymaps from "./components/Keymaps";
import ComponentSetting from "./components/Setting";
import ComponentSource from "./components/Source";

const App: FC = () => {
	return (
		<MantineProvider
			theme={{ colorScheme: "dark" }}
			withGlobalStyles
			withNormalizeCSS
		>
			<div className={styles.app}>
				<ComponentCanvas
					className={styles.canvas}
					classNameActive={styles.canvasActive}
				/>
				<ComponentSource
					className={styles.source}
					classNameDrop={styles.sourceDrop}
				/>
				<ComponentControl className={styles.control} />
				<ComponentKeymaps />
				<ComponentSetting />
			</div>
		</MantineProvider>
	);
};

export default App;
