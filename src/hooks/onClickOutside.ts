import { useEffect } from "react";

export const useOnClickOutside = (
	ref: React.MutableRefObject<HTMLElement | null>,
	callback: any
) => {
	useEffect(() => {
		if (!ref.current) return;
		const listener = (event: any) => {
			if (!ref.current || ref.current.contains(event.target)) {
				return;
			}
			callback(event);
		};
		document.addEventListener("mousedown", listener);
		document.addEventListener("touchstart", listener);
		return () => {
			document.removeEventListener("mousedown", listener);
			document.removeEventListener("touchstart", listener);
		};
	}, [ref, callback]);
};
