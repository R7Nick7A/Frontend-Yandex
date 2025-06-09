import { FC } from 'react';
import { Link } from 'react-router-dom';
export const NotFound404: FC = () => (
  <>
    <h3 className={`pb-6 pt-6 text text_type_main-large`}>
      Страница не найдена. Ошибка 404.
    </h3>
    <div className='text text_type_main-default pb-6'>
      Вернутся на{' '}
      <Link to='/' className='pl-2'>
        главную старницу
      </Link>
    </div>
  </>
);
