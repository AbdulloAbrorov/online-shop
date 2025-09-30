import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-provaider";
import { AppRoutes } from "./layouts/app-routes";

function App() {
  return (
    <Router>
      <AuthProvider>
          <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
