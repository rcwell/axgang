import { useState, useRef, useEffect, forwardRef } from "react";
import { Listbox, Transition } from "@headlessui/react";
import classNames from "classnames";

interface IMultiselect<T> {
	options: Array<T>,
	selected?: Array<T>,
	onChange: (selected: Array<T>) => void,
	placeholder?: string,
	className?: string,
	optionDisplayKey?: string,
	optionValueKey?: string,
}
export function MultiSelect<T>({ options, selected = [], onChange, placeholder, className, optionDisplayKey, optionValueKey }: IMultiselect<T>) {
	const node = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		document.addEventListener("mousedown", handleClick);

		return () => {
			document.removeEventListener("mousedown", handleClick);
		};
	}, []);

	function isSelected(value: any) {
		if (optionValueKey) {
			return selected.find((el: any) => el[optionValueKey] === (value)[optionValueKey]);
		}
		return selected.find((el) => el === value);
	}

	function handleSelect(value: any) {
		if (!isSelected(value)) {
			let found = undefined;
			if (optionValueKey) {
				found = selected.find((el: any) => el[optionValueKey] === (value)[optionValueKey]);
			} else {
				found = selected.find((el) => el === value);
			}
			if (found) {
				onChange([...selected, found]);
			}
		} else {
			handleDeselect(value);
		}
		setIsOpen(true);
	}

	function handleDeselect(value: any) {
		let selectedUpdated = selected;
		if (optionValueKey) {
			selectedUpdated = selected.filter((el: any) => el[optionValueKey] === (value)[optionValueKey]);
		} else {
			selectedUpdated = selected.filter((el) => el === value);
		}
		onChange(selectedUpdated);
		setIsOpen(true);
	}

	const handleClick = (e: any) => {
		if (node.current?.contains(e.target)) {
			return;
		}
		setIsOpen(false);
	};

	return (
		<Listbox
			as="div"
			className={classNames("relative", className)}
			ref={node}
			value={selected}
			onChange={(value: any) => handleSelect(value)}>
			{() => (
				<>
					<span className="inline-block w-full rounded">
						<Listbox.Button
							as={Btn}
							setIsOpen={setIsOpen}
							isOpen={isOpen}
							selected={selected}
							placeholder={placeholder} />
					</span>
					<Transition
						unmount={false}
						show={isOpen}
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
						className="z-10 absolute mt-1 w-full rounded-md bg-white shadow-lg">
						<Listbox.Options
							static
							className="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5">
							{options.map((option: any, index) => {
								const selected = isSelected(option);
								return (
									<Listbox.Option
										key={index}
										value={option}
										className="focus:outline-none">
										{({ active }) => (
											<div
												className={`${active ? "text-white bg-blue-600" : "text-grey-900"} cursor-pointer select-none relative py-1.5 pl-7 pr-4 text-xs`}>
												<span
													className={`${selected ? "font-semibold" : "font-normal"} block truncate`}>
													{optionDisplayKey ? option[optionDisplayKey] : option}
												</span>
												{selected && (
													<span
														className={`${active ? "text-white" : "text-blue-600"} absolute inset-y-0 left-0 flex items-center pl-1.5`}>
														<svg
															className="h-4 w-4"
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 20 20"
															fill="currentColor">
															<path
																fillRule="evenodd"
																d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
																clipRule="evenodd" />
														</svg>
													</span>
												)}
											</div>
										)}
									</Listbox.Option>
								);
							})}
						</Listbox.Options>
					</Transition>
				</>
			)}
		</Listbox>
	);
}

const Btn = forwardRef<HTMLButtonElement, any>((props, ref) => {
	return (
		<button
			className={`cursor-default relative border rounded pl-3 pr-10 py-2 text-left  transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${props.isOpen ? "border-blue-500 ring-blue-500 ring-1" : "border-grey-300"}`}
			onClick={() => props.setIsOpen(!props.isOpen)}
			ref={ref}>
			<span className="block truncate">
				{props.selected.length < 1
					? props.placeholder
					: props.selected
						.sort()
						.join(", ")}
			</span>
			<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
				<svg
					className="h-5 w-5 text-grey-400"
					viewBox="0 0 20 20"
					fill="none"
					stroke="currentColor">
					<path
						d="M7 7l3-3 3 3m0 6l-3 3-3-3"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round" />
				</svg>
			</span>
		</button>
	);
});