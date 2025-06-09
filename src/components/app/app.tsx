import { useEffect } from 'react';
import { useDispatch } from '../../services/hooks';
import { getIngredients, checkUser } from '@slices';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  useMatch
} from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';

/**
 * Вспомогательная функция для форматирования номера заказа в модальном окне
 * @param {string} profileOrderNum - Номер заказа из профиля
 * @param {string} feedOrderNum - Номер заказа из ленты
 * @returns {string} Отформатированный номер заказа с префиксом #
 */
const getModalOrderTitle = (
  profileOrderNum?: string,
  feedOrderNum?: string
) => {
  let result = profileOrderNum || feedOrderNum || '';
  if (result) {
    return `#${result.padStart(6, '0')}`;
  }
  return ' ';
};

/**
 * Корневой компонент приложения
 * Реализует основную маршрутизацию и управление модальными окнами
 *
 * Особенности реализации:
 * 1. Использует React Router v6 для маршрутизации
 * 2. Поддерживает модальные окна с сохранением истории навигации
 * 3. Реализует защищенные маршруты через компонент ProtectedRoute
 * 4. Загружает начальные данные при монтировании (ингредиенты и проверка авторизации)
 */
const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // Состояние фона для модальных окон, сохраняется в location.state
  const modalBackground = location.state?.background;

  // Получение номера заказа из URL для отображения в модальном окне
  const profileOrderNum = useMatch('/profile/orders/:number')?.params.number;
  const feedOrderNum = useMatch('/feed/:number')?.params.number;
  const modalOrderTitle = getModalOrderTitle(profileOrderNum, feedOrderNum);

  // Загрузка начальных данных при монтировании компонента
  useEffect(() => {
    dispatch(getIngredients());
    dispatch(checkUser());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      {/* Основные маршруты приложения */}
      <Routes location={modalBackground || location}>
        {/* Публичные маршруты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        {/* Маршруты с детальной информацией */}
        <Route
          path='/feed/:number'
          element={
            <main className={styles.containerMain}>
              <h3 className={`${styles.title} text text_type_digits-default`}>
                {modalOrderTitle}
              </h3>
              <OrderInfo />
            </main>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <main className={styles.containerMain}>
              <h1 className={`${styles.title} text text_type_main-large`}>
                Детали ингредиента
              </h1>
              <IngredientDetails />
            </main>
          }
        />

        {/* Защищенные маршруты профиля */}
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <main className={styles.containerMain}>
                <h3 className={`${styles.title} text text_type_digits-default`}>
                  {modalOrderTitle}
                </h3>
                <OrderInfo />
              </main>
            </ProtectedRoute>
          }
        />

        {/* Маршруты аутентификации (доступны только неавторизованным пользователям) */}
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* Защищенные маршруты профиля */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        {/* Маршрут для несуществующих страниц */}
        <Route
          path='*'
          element={
            <main className={`${styles.containerMain} mt-4`}>
              <NotFound404 />
            </main>
          }
        />
      </Routes>

      {/* Модальные окна, отображаемые поверх основного контента */}
      {modalBackground && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={modalOrderTitle} onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Детали ингредиента'} onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title={modalOrderTitle} onClose={() => navigate(-1)}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
