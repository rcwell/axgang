import cx from 'classnames';
import { Listbox, Switch, Transition } from '@headlessui/react';
import { AcademicCapIcon } from '@heroicons/react/outline';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { Fragment, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useOnClickOutside } from '../../../../hooks/onClickOutside';
import { emailValidator } from '../../../../utils/constants/rgx';
import { useData } from '../../../../contexts/dataContext';
import { useAlert } from '../../../../contexts/alertContext';
import { AlertTypes } from '../../../../utils/constants/models';
import { ISlp } from '../../../../utils/constants/models/slp';
import DatePicker from "react-datepicker";
import moment from 'moment';

interface ReportFormProps {
	onCancel: () => void;
	onSuccess: () => void;
	todaysReportAdded?: boolean;
}
type IForm<T = number, K = Date> = ISlp<T, K>

export const ReportForm = ({
	onCancel,
	onSuccess,
	todaysReportAdded,
}: ReportFormProps) => {
	const { saveSlpData } = useData();

	const formRef = useRef<HTMLFormElement>(null);
	const [form, setForm] = useState<IForm>({
		count: 0,
		datetime: new Date()
	});
	const [errors, setErrors] = useState<IForm<boolean, boolean>>(Object);
	const [isAdding, setIsAdding] = useState(Boolean);

	const { addAlert } = useAlert();

	useOnClickOutside(formRef, onCancel);

	const validateForm = () => {
		return [
			'count',
			'datetime',
		].reduce((err, key) => {
			const value = { ...form }[key] ?? "";
			return {
				...err,
				[key]: value === ""
			};
		}, {
			count: false,
			datetime: false,
		});
	};

	const handleOnSubmit = async () => {
		setIsAdding(true);
		const validationResult = validateForm();

		if (Object
			.values(validationResult)
			.filter(x => x)
			.length === 0) {

			const success = await saveSlpData(form);

			if (success) {
				addAlert({
					title: "Success",
					message: `SLP data successfully saved`,
					type: AlertTypes.Success,
					show: true,
				});
			} else {
				addAlert({
					title: "Failed",
					message: "Something went wrong saving SLP data",
					type: AlertTypes.Error,
					show: true,
				});
			}
			onSuccess();
			resetForm();
			setIsAdding(false);
			return;
		}

		setErrors(validationResult);
		setIsAdding(false);
	};

	const handleOnCountChange = (event: KeyboardEvent<HTMLInputElement>) => {
		const { currentTarget: { value } } = event;
		setForm((p) => ({
			...p,
			count: Number(value)
		}));
	};

	const resetForm = () => {
		setForm({
			datetime: new Date(),
			count: 0,
		});
	};

	const minMaxDateTime = useMemo(() => ({
		min: moment()
			.subtract(6, 'hours')
			.toDate(),
		max: moment()
			.add(1, 'hours')
			.toDate(),
	}), []);

	return (
		<form ref={formRef} className="text-left w-full">
			<div className="flex flex-col px-4 pt-5">
				<div className="flex flex-row items-center gap-2">
					<div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 ">
						<AcademicCapIcon className="h-6 w-6 text-blue-600" />
					</div>
					<h3 className="text-lg leading-6 font-medium text-gray-900">
						Save SLP data
					</h3>
				</div>
				<div className="w-full pt-4 pb-4">
					<div className="mb-4 relative">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
							Count
						</label>
						<input
							onKeyUp={handleOnCountChange}
							autoComplete="off"
							type="number"
							min={0}
							defaultValue={form.count ?? ''}
							placeholder="Count"
							className={cx("appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline", {
								"border-red-500 ": errors.count
							})} />
						{errors.count && (
							<p style={{ bottom: -4 }} className="text-red-500 text-xs italic absolute">Please enter valid count.</p>
						)}
					</div>
					<div className="mb-4 relative">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
							Date Time
						</label>
						<DatePicker
							showTimeInput
							minDate={minMaxDateTime.min}
							maxDate={minMaxDateTime.max}
							selected={form.datetime ?? new Date()}
							className={cx("appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline", {
								"border-red-500 ": errors.datetime || todaysReportAdded
							})}
							value={moment(form.datetime)
								.format('lll')}
							onChange={(date: Date) =>
								setForm(p => ({
									...p,
									datetime: new Date(date)
								}))} />
						{errors.datetime && (
							<p style={{ bottom: -4 }} className="text-red-500 text-xs italic absolute">Please enter valid datetime.</p>
						)}
						{todaysReportAdded && (
							<p style={{ bottom: -20 }} className="text-red-500 text-xs italic absolute">
								Report for selected date has already been added.
							</p>
						)}
					</div>
				</div>
			</div>
			<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
				<button
					disabled={todaysReportAdded}
					onClick={handleOnSubmit}
					type="button"
					className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
					{
						isAdding
							? "Saving"
							: "Save"
					}
				</button>
				<button type="button" onClick={onCancel} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
					Cancel
				</button>
			</div>
		</form>
	);
};