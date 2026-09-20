import type { Issue } from "../types";

interface Props {
  issue: Issue;
  onClick: () => void;
}

export default function IssueCard({ issue, onClick }: Props) {
  return (
    <div className="kanban-card" onClick={onClick}>
      <div className="kanban-card-title">{issue.title}</div>
      {issue.description && <div className="kanban-card-desc">{issue.description}</div>}
    </div>
  );
}