import cx from 'classnames';

export const AxieCard = ({ axie, className }: any) => {
	return (
		<div className={cx(className, "flex justify-center items-center flex-col")}>
			<img src={axie.image} className={"w-1/2"}/>
			<span>{axie.name}</span>
			<span>{axie.id}</span>
		</div>
	);
};