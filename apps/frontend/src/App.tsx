import { BrowserRouter,Routes,Route,Navigate } from "react-router";
import {AuthProvider} from "./context/AuthContext";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import ProtectedRoute from "./components/ProtectedRoute";
import OrgListPage from "./pages/OrgListPage";
import BoardListPage from "./pages/BoardListPage";
export default function App(){
  return(
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/organizations" replace />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/organizations" element={
            <ProtectedRoute>
              <OrgListPage/>
            </ProtectedRoute>
          } />
          <Route path="/organizations/:orgId/boards" element={
            <ProtectedRoute>
              <BoardListPage/>
            </ProtectedRoute>
          }/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}