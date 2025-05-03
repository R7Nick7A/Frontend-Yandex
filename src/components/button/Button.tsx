import { Text } from 'components/text';
import styles from './Button.module.scss';

interface ButtonProps {
	title: string;
	onClick?: () => void;
	type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

export const Button = ({
	title,
	onClick,
	type,
}: ButtonProps) => {
	return (
		<button className={styles.button} type={type} onClick={onClick}>
			<Text weight={800} uppercase>
				{title}
			</Text>
		</button>
	);
};
