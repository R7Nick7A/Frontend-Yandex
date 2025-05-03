import { useState } from 'react';
import clsx from 'clsx';
import arrow from 'src/images/arrow.svg';

import styles from './ArrowButton.module.scss';

export type OnClick = () => void;

interface ArrowButtonProps {
	onClick?: OnClick;
	isOpen?: boolean;
}

export const ArrowButton = ({ onClick, isOpen }: ArrowButtonProps) => {
	return (
		<div
			role='button'
			aria-label='Открыть/Закрыть форму параметров статьи'
			tabIndex={0}
			className={clsx(styles.arrowButton, { [styles.arrowButton_open]: isOpen })}
			onClick={onClick}
		>
			<img
				src={arrow}
				alt='иконка стрелочки'
				className={clsx(styles.arrow, { [styles.arrowButton_open]: isOpen })}
			/>
		</div>
	);
};
