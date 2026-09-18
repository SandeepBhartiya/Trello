import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { getOrg } from "../api/organization";
import { getAvatarColor } from "../utils/avatarColor";
import type { Org } from "../types";
import "../styles/orgSwitcher.css";

export default function OrgSwitcher() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { orgId } = useParams(); // reads the :id segment from the current URL

  useEffect(() => {
    getOrg().then((data) => setOrgs(data ?? [])).catch(() => {});
  }, []);

  // close dropdown when clicking outside it
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeOrg = orgs.find((o) => String(o.id) === orgId);

  const handleSelect = (id: number) => {
    setOpen(false);
    navigate(`/organizations/${id}/boards`);
  };

  if (orgs.length === 0) return null;

  return (
    <div className="org-switcher" ref={dropdownRef}>
      <button className="org-switcher-trigger" onClick={() => setOpen((o) => !o)}>
        {activeOrg ? (
          <>
            <div
              className="org-switcher-avatar"
              style={{ background: getAvatarColor(JSON.stringify(activeOrg.name)) }}
            >
              {activeOrg.name.slice(0, 2)}
            </div>
            <span>{activeOrg.name}</span>
          </>
        ) : (
          <span>Select organization</span>
        )}
        <span className="org-switcher-caret">▾</span>
      </button>

      {open && (
        <div className="org-switcher-menu">
          {orgs.map((org) => (
            <div
              key={org.id}
              className={`org-switcher-item ${String(org.id) === orgId ? "active" : ""}`}
              onClick={() => handleSelect(org.id)}
            >
              <div className="org-switcher-avatar" style={{ background: getAvatarColor(JSON.stringify(org.name)) }}>
                {org.name.slice(0, 2)}
              </div>
              <span>{org.name}</span>
            </div>
          ))}
          <div className="org-switcher-divider" />
          <div
            className="org-switcher-item org-switcher-all"
            onClick={() => {
              setOpen(false);
              navigate("/organizations");
            }}
          >
            View all organizations
          </div>
        </div>
      )}
    </div>
  );
}