import { memo, useMemo, useState, useEffect } from "react";
import { Line } from 'react-chartjs-2';
import moment from "moment";
import { slp_price_php } from "../../../../utils/constants/api";
import { ISlpRates } from "../../../../hooks/useSlpRates";

export const SlpPriceChart = memo(({ slpRates }: { slpRates: ISlpRates }) => {
	const [sparkLineData, setSparkLineData] = useState<Array<number[]>>(Array);

	useEffect(() => {
		(async () => {
			try {
				const res = await fetch(slp_price_php);
				const data = await res.json();
				if (data) {
					const { prices } = data;
					setSparkLineData([
						...prices.splice(0, 6),
						[
							new Date()
								.getTime(),
							slpRates.php
						]
					]);
				}

			} catch (error) {
				console.error(error);
			}
		})();
	}, [slpRates]);
	const data = useMemo(() => {
		return {
			labels: sparkLineData.map(([date]: any) => moment(new Date(date))
				.format("YYYY/MM/DD")),
			datasets: [
				{
					label: '',
					backgroundColor: "rgba(255, 255, 255, 0.1)",
					borderColor: "rgba(255, 255, 255, 1)",
					pointBackgroundColor: "rgba(255, 255, 255, 1)",
					data: sparkLineData.map(([, price]: any) => price),
					fill: false,
				},
			]
		};
	}, [sparkLineData]);

	const options = useMemo(() => {
		return {
			scales: {
				yAxes: {
					display: false,
				},
				xAxes: {
					display: false,
				}
			},
			layout: {
				padding: 20
			},
			plugins: {
				legend: {
					display: false
				},
				tooltip: {
					interaction: {
						intersect: false
					},
				}
			},
			responsive: true,
			maintainAspectRatio: false,
			tension: 0,
		};
	}, []);
	return (
		<div className="flex w-full">
			<Line data={data} options={options} />
		</div>
	);
});
