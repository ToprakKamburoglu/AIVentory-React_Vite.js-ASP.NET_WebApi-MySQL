import { AuthProvider } from './contexts/AuthContext.jsx';
import AppRoutes from './Routes/Routes.jsx';

function App() {
  return (
    
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>

  );
}

export default App;