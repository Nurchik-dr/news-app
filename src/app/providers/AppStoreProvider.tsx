import { useEffect, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useAppDispatch } from '../hooks';
import { hydrateFavorites } from '../../features/favorites/model/favoritesThunks';

const AppBootstrap = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateFavorites());
  }, [dispatch]);

  return <>{children}</>;
};

export const AppStoreProvider = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>
    <AppBootstrap>{children}</AppBootstrap>
  </Provider>
);
