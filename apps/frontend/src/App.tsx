import { BrowserRouter,Routes,Route,Navigate } from "react-router";
import {AuthProvider} from "./context/AuthContext";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import ProtectedRoute from "./components/ProtectedRoute";
import OrgListPage from "./pages/OrgListPage";
import BoardListPage from "./pages/BoardListPage";
import KanbanBoardPage from "./pages/KanbanBoardPage";
import IssueDetailPage from "./pages/IssueDetailPage";
import MembersPage from "./pages/MembersPage";
import AcceptInvitePage from "./pages/AcceptInvitePage";

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
          <Route path="/organizations/:orgId/boards/:boardId/lists" element={
            <ProtectedRoute>
              <KanbanBoardPage/>
            </ProtectedRoute>  
          }/>
          <Route  path="/issue/:issueId" element={
            <ProtectedRoute>
              <IssueDetailPage/>
            </ProtectedRoute>
          }/>
          <Route path="/organizations/:orgId/members" 
            element={
              <ProtectedRoute>
                <MembersPage/>
              </ProtectedRoute>
          }/>
          <Route path="/accept-invite" 
            element={
              <AcceptInvitePage />
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}