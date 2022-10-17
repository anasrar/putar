import { intervalToDuration } from "date-fns";

const parserDuration = (seconds: number) =>
	Object.values(
		intervalToDuration({
			start: 0,
			end: seconds * 1000,
		})
	)
		.reduce<string[]>((acc, val) => {
			if (val !== 0 || (acc.length && val === 0)) {
				if (acc.length) {
					acc.push(String(val).padStart(2, "0"));
				} else {
					acc.push(String(val));
				}
			}
			return acc;
		}, [])
		.join(":");

export default parserDuration;
