import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/hooks';
import { Preloader } from '@ui';
import { selectIsAuthChecked, selectUserAuthenticated } from '@slices';

/**
 * Компонент для защиты маршрутов от неавторизованного доступа
 * @component
 * @param {Object} props - Свойства компонента
 * @param {React.ReactElement} props.children - Дочерние элементы, которые нужно защитить
 * @param {boolean} [props.onlyUnAuth] - Флаг, указывающий что маршрут доступен только неавторизованным пользователям
 * @example
 * // Защита маршрута профиля (только для авторизованных)
 * <ProtectedRoute>
 *   <Profile />
 * </ProtectedRoute>
 * @example
 * // Защита маршрута логина (только для неавторизованных)
 * <ProtectedRoute onlyUnAuth>
 *   <Login />
 * </ProtectedRoute>
 */
export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
}) => {
  // Получаем состояние авторизации из Redux store
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUserAuthenticated);
  const location = useLocation();

  // Показываем прелоадер, пока проверяется авторизация
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Если маршрут защищен и пользователь не авторизован,
  // перенаправляем на страницу логина с сохранением текущего пути
  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  // Если маршрут только для неавторизованных и пользователь авторизован,
  // перенаправляем на предыдущую страницу или главную
  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  // Если все проверки пройдены, отображаем защищенный контент
  return children;
};
