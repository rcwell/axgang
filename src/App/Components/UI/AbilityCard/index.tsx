export const AbilityCard = ({ ability, className }: any) => {
	return (
		<div className={className} key={ability.id}>
			<div className="relative">
				<img className="w-full" src={ability.backgroundUrl} />
				<div
					className="absolute flex justify-center items-center font-game font-black"
					style={{
						color: "rgb(255, 255, 255)",
						textShadow: "black 0px 0px 10px",
						top: "3%",
						left: "3%",
						width: "22%",
						height: "16%",
						fontSize: 27.5,
					}}>
					{ability.energy}
				</div>
				<div
					className="absolute flex justify-center items-center whitespace-nowrap overflow-ellipsis"
					style={{
						top: "5.5%",
						left: "26%",
						width: "59%",
						height: "10%",
						fontSize: 12.7128,
						color: "#ffff",
						fontWeight: "bold",
						textShadow: "0 0 10px black",
					}}>
					{ability.name}
				</div>
				<div
					className="absolute flex justify-center items-center"
					style={{
						width: "14%",
						height: "11.5%",
						top: "76%",
						left: "3%",
					}}>
					<img className="w-1/2" src={ability.effectIconUrl} />
				</div>
				<div
					className="absolute flex justify-center items-center font-semibold"
					style={{
						top: "68%",
						left: "20%",
						height: "28%",
						width: "70%",
						fontSize: 10.1702,
						color: "#fff",
					}}>
					{ability.description}
				</div>
				<div className="absolute w-full flex justify-between">
					<span>Attack: {ability.attack}</span>
					<span>Defense: {ability.defense}</span>
				</div>
			</div>
		</div>
	);
};
