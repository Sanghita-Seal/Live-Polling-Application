import { getStatusLabel } from "../../utils/poll.utils.js";

function StatusBadge({ status }) {
  return <span className={`status-badge status-${status || "draft"}`}>{getStatusLabel(status)}</span>;
}

export default StatusBadge;
