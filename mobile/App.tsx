import React from 'react';
import AppRoutes from './src/routes/AppRoutes';
import { AppStateProvider } from './src/context/AppState';
import { ActivityTypeProvider } from './src/context/ActivityTypeContext';
import Toast from 'react-native-toast-message';

function App(): React.JSX.Element {
  return (
    <AppStateProvider>
      <ActivityTypeProvider>
        <AppRoutes />
        <Toast autoHide={true} visibilityTime={2000} />
      </ActivityTypeProvider>
    </AppStateProvider>
  );
}

export default App;