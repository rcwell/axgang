import { useWindowDimensions } from "./useWindowDimensions";
import { useMemo } from "react";

export enum DeviceType {
	Desktop,
	Tablet,
	Mobile,
}

/**
 * Retrieve device by window size
 * @returns {DeviceType}
 */
export const useGetDeviceType = (): DeviceType => {
	const windowSize = useWindowDimensions();

	const device = useMemo(
		() =>
			windowSize.width > 991
				? DeviceType.Desktop
				: windowSize.width > 425
					? DeviceType.Tablet
					: DeviceType.Mobile,
		[windowSize]
	);

	return device;
};
