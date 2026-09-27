import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Issue } from "../types";

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
    </div>
  );
}