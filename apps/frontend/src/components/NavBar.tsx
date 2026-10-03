import { useNavigate,useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getAvatarColor } from "../utils/avatarColor";
import OrgSwitcher from "./OrgSwitcher";
import "../styles/navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { orgId } = useParams();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };
  if (!user) return null;
  const username=user?.username??user;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand" onClick={() => navigate("/organizations")}>
          Trello School
        </div>
        <OrgSwitcher />
      </div>

      <div className="navbar-right">
         {orgId && (
          <button
            className="navbar-link"
            onClick={() => navigate(`/organizations/${orgId}/members`)}
          >
            Members
          </button>
        )}
        <div className="navbar-user">
          <div className="navbar-avatar" style={{ background: getAvatarColor(JSON.stringify(username)) }}>
            {username?.slice(0, 2)}
          </div>
          <span className="navbar-username">{username}</span>
          <button className="navbar-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}