import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useLoading } from "../context/LoadingContext";
import { getOrg, deleteOrg } from "../api/organization";
import { getAvatarColor } from "../utils/avatarColor";
import CreateOrgModal from "../components/CreateOrgModel";
import type { Org } from "../types";
import "../styles/organization.css";
import { MessageBox } from "../components/MessageBox";
//need to add delete option and minor change in css when data is present
export default function OrgListPage() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const {loading, setLoading} = useLoading();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadOrgs();
  }, []);

  const loadOrgs = async () => {
    setLoading(true);
    try {
      const data:any = await getOrg();
      setOrgs(data??[]);
    } catch (err: any) {
      MessageBox({title:"Error",message:err.message,type:"error"});
    } finally {
      setLoading(false);
    }
  };

  const handleOrgClick = (orgId: number) => {
    navigate(`/organizations/${orgId}/boards`);
  };

  const handleDeleteOrg = async (orgId: number) => {
    MessageBox({
      title:"Delete Organization",
      message:"Are you sure you want to delete this organization?",
      type:"confirm",
      onConfirm: async () => {
        setLoading(true);
        try {
          await deleteOrg(orgId);
          MessageBox({title:"Success",message:"Organization deleted successfully",type:"success"});
          await loadOrgs();
        } catch (err: any) {
          MessageBox({title:"Error",message:err.message||"Failed to delete organization",type:"error"});
        }finally{
          setLoading(false);
        }      
      }
    });
  }

  return (
    <div className="page-container">
      {orgs?.length === 0 ? (
        <div className="empty-state">
            <div className="empty-state-icon">🗂️</div>
          {/* <div className="body-wrapper">
          </div> */}
          <div className="empty-state-title">No organizations yet</div>
          <div className="empty-state-subtitle">
            You're not part of any organization yet. Create one to get started.
          </div>
          <button className="btn-primary"  onClick={() => setShowCreateModal(true)}>
            + New organization
          </button>
          {/* <div className="body-wrapper">

          </div> */}
        </div>
      ) : (
        <div className="card-grid">
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
          onCreated={(newOrg) => setOrgs((prev) => [...prev, {...newOrg,role:newOrg.role||"admin"}])}
        />
      )}
    </div>
  );
}