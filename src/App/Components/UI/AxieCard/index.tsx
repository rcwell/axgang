import cx from 'classnames';

export const AxieCard = ({ axie, className }: any) => {
	return (
		<div className={cx(className, "flex justify-center items-center flex-col")}>
			<img src={axie.image} className={"w-full md:w-1/2"}/>
			<span className="absolute top-3 left-3 bg-blue-500 text-white font-bold text-xs px-2 py-1 rounded-md" >{axie.name}</span>
			<span className="absolute top-10 left-3 bg-blue-500 bg-opacity-80 text-white font-bold text-xs px-2 py-1 rounded-md" >{axie.id}</span>
		</div>
	);
};