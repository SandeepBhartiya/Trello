import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Issue } from "../types";
import { getAvatarColor } from "../utils/avatarColor";

interface Props {
  issue: Issue;
  onClick: () => void;
}

export default function IssueCard({ issue, onClick }: Props) {
  const{attributes,listeners,setNodeRef,transform,transition,isDragging}=useSortable({
    id:issue.id,
    data:{type:"issue",issue}
  });

  const style={
    transform:CSS.Translate.toString(transform),
    transition
  };
  
  return (
    <div  
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`kanban-card ${isDragging?"dragging":""}`}
      onClick={onClick}
    >
      <div className="kanban-card-title">{issue.title}</div>
      {issue.description && <div className="kanban-card-desc">{issue.description}</div>}
      {issue.issuesMapping && issue.issuesMapping.length > 0 && (
        <div className="kanban-card-assignees">
          {issue.issuesMapping.map((a) => (
            <div
              key={a.userId}
              className="kanban-card-avatar"
              title={a.user?.username}
              style={{ background: getAvatarColor(a.user?.username || "?") }}
            >
              {(a.user?.username || "?").slice(0, 2)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}