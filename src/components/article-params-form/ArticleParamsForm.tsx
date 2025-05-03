import { useState } from 'react';
import clsx from 'clsx';
import { Button } from 'components/button';
import { Select } from 'components/select';
import { RadioGroup } from 'components/radio-group';
import { Separator } from 'components/separator';
import { Text } from 'components/text';
import { Spacing } from 'components/spacing';
import { ArrowButton } from '../arrow-button';
import { defaultArticleState, ArticleStateType } from 'src/constants/articleProps';
import { fontFamilyOptions, fontColors, backgroundColors, contentWidthArr, fontSizeOptions } from 'src/constants/articleProps';
import arrow from 'src/images/arrow.svg';

import styles from './ArticleParamsForm.module.scss';

export const ArticleParamsForm = ({ onApply }: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [formState, setFormState] = useState<ArticleStateType>(defaultArticleState);
	
	const handleReset = () => {
		setFormState(defaultArticleState);
		onApply(defaultArticleState);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onApply(formState);
	};

	const handleToggle = () => {
		setIsOpen(!isOpen);
	};

	return (
		<>
			<ArrowButton onClick={handleToggle} isOpen={isOpen} />
			<aside className={clsx(styles.container, { [styles.container_open]: isOpen })}>
				<form className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
					<Text size={31} weight={800} uppercase>
						Задайте параметры
					</Text>
					<Spacing size={50} />
					
					<Select
						title="Цвет фона"
						selected={formState.backgroundColor}
						options={backgroundColors}
						onChange={(option) => setFormState({ ...formState, backgroundColor: option })}
					/>
					<Spacing size={50} />
					
					<Select
						title="Шрифт"
						selected={formState.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={(option) => setFormState({ ...formState, fontFamilyOption: option })}
					/>
					<Spacing size={50} />
					
					<Select
						title="Цвет шрифта"
						selected={formState.fontColor}
						options={fontColors}
						onChange={(option) => setFormState({ ...formState, fontColor: option })}
					/>
					<Spacing size={50} />
					
					<RadioGroup
						name="fontSize"
						title="Размер шрифта"
						selected={formState.fontSizeOption}
						options={fontSizeOptions}
						onChange={(option) => setFormState({ ...formState, fontSizeOption: option })}
					/>
					<Spacing size={50} />
					
					<Select
						title="Ширина контента"
						selected={formState.contentWidth}
						options={contentWidthArr}
						onChange={(option) => setFormState({ ...formState, contentWidth: option })}
					/>
					<Spacing size={50} />
					
					<Separator />
					<Spacing size={50} />
					
					<div className={styles.bottomContainer}>
						<Button title="Применить" type="submit" />
						<Button title="Сбросить" type="reset" />
					</div>
				</form>
			</aside>
		</>
	);
};

interface ArticleParamsFormProps {
	onApply: (state: ArticleStateType) => void;
}
