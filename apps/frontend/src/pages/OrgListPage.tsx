import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getOrg } from "../api/organization";
import CreateOrgModal from "../component/CreateOrgModel";
import type { Org } from "../types";
import "../styles/organization.css";

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
      console.log("Inside ORG Process");
      const data:any = await getOrg();
      console.log("data",data);
      setOrgs(data??[]);
    } catch (err: any) {
      setError(err.message || "Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  const handleOrgClick = (orgId: number) => {
    navigate(`/organizations/${orgId}/boards`);
  };

  if (loading) return <div className="org-loading">Loading organizations...</div>;
  if (error) return <div className="org-error">{error}</div>;

  return (
    <div className="org-page">
      <div className="org-page-header">
        <h1>Your organizations</h1>
        <button className="org-create-btn" onClick={() => setShowCreateModal(true)}>
          + New organization
        </button>
      </div>

      {orgs?.length === 0 ? (
        <div className="org-empty">
          You're not part of any organization yet. Create one to get started.
        </div>
      ) : (
        <div className="org-list">
          {orgs?.map((org) => (
            <div key={org.id} className="org-card" onClick={() => handleOrgClick(org.id)}>
              <div>
                <div className="org-card-name">{org.name}</div>
                {org.description && <div className="org-card-desc">{org.description}</div>}
              </div>
              {org.role && <span className="org-card-role">{org.role}</span>}
            </div>
          ))}
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