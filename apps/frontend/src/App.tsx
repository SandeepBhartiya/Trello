import { BrowserRouter,Routes,Route,Navigate } from "react-router";
import {AuthProvider} from "./context/AuthContext";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";

export default function App(){
  return(
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}