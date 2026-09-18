import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getOrg, deleteOrg } from "../api/organization";
import { getAvatarColor } from "../utils/avatarColor";
import CreateOrgModal from "../components/CreateOrgModel";
import type { Org } from "../types";
import "../styles/organization.css";
import { MessageBox } from "../components/MessageBox";
//need to add delete option and minor change in css when data is present
export default function OrgListPage() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadOrgs();
  }, []);

  const loadOrgs = async () => {
    setLoading(true);
    setError("");
    try {
      const data:any = await getOrg();
      setOrgs(data??[]);
    } catch (err: any) {
      // setError(err.message || "Failed to load organizations");
      MessageBox({title:"Error",message:err.message,type:"error"});
    } finally {
      setLoading(false);
    }
  };

  const handleOrgClick = (orgId: number) => {
    navigate(`/organizations/${orgId}/boards`);
  };

  const handleDeleteOrg = async (orgId: number) => {
    try {
      await deleteOrg(orgId);
      await loadOrgs();
    } catch (err: any) {
      setError(err.message || "Failed to delete organization");
    }
  }
  if (loading) return <div className="org-loading">Loading organizations...</div>;
  if (error) return <div className="org-error">{error}</div>;

  return (
    <div className="org-page">
      <div className="org-page-header">
        <h1 className="body-wrapper">Your organizations</h1>
        {orgs.length>0 &&(
        <button className="org-create-btn" onClick={() => setShowCreateModal(true)}>
          + New organization
        </button>)}
      </div>

      {orgs?.length === 0 ? (
        <div className="org-empty-wrapper">
          <div className="body-wrapper">
            <div className="org-empty-icon">🗂️</div>
          </div>
          <div className="org-empty-title">No organizations yet</div>
          <div className="org-empty-subtitle">
            You're not part of any organization yet. Create one to get started.
          </div>
          <div className="body-wrapper">
          <button className="org-create-btn"  onClick={() => setShowCreateModal(true)}>
            + New organization
          </button>

          </div>
        </div>
      ) : (
        <div className="org-list">
          {orgs?.map((org) => (
            <div key={org.id} className="org-card" onClick={() => handleOrgClick(org.id)}>
              <div className="org-card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="org-avatar" style={{backgroundColor: getAvatarColor(JSON.stringify(org.name))}}>{org.name.slice(0, 2)}</div>
                {org.role === "admin" && (
                  <button className="delete-btn"  onClick={(e) => {e.stopPropagation(); handleDeleteOrg(org.id);}} title="Delete Organization">
                    🗑️
                  </button>
                )}
              </div>
              <div>
                <div className="org-card-name">{org.name}</div>
                {org.description && <div className="org-card-desc">{org.description}</div>}
              </div>
              {org.role && (
                <span className={`org-card-role ${org.role === "admin" ? "role-admin" : ""}`}>
                  {org.role}
                </span>
              )}
            </div>
          ))}
          <div className="org-card org-card-new" onClick={() => setShowCreateModal(true)}>
            + Create new organization
          </div>
        </div>
      )}

      {showCreateModal && (
        <CreateOrgModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(newOrg) => setOrgs((prev) => [...prev, newOrg])}
        />
      )}
    </div>
  );
}