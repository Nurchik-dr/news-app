import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
  //   useEffect(() => {
//   if (!state.notification) return;

//   const timer = setTimeout(() => {
//     dispatch({ type: 'CLEAR_NOTIFICATION' });
//   }, 2500);

//   return () => clearTimeout(timer);
// }, [state.notification]);
// dispatch({type: 'SHOW_NOTIFICATION', payload: '...'});
