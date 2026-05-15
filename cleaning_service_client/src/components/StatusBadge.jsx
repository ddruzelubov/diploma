import React from 'react';
import './StatusBadge.css';

const STATUS_MAP = {
    pending:     { text: 'Ожидает',  cls: 'status-badge--pending' },
    assigned:    { text: 'Назначен', cls: 'status-badge--assigned' },
    in_progress: { text: 'В работе', cls: 'status-badge--progress' },
    completed:   { text: 'Выполнен', cls: 'status-badge--done' },
};

const StatusBadge = ({ status }) => {
    const s = STATUS_MAP[status] || { text: status, cls: 'status-badge--pending' };
    return <span className={`status-badge ${s.cls}`}>{s.text}</span>;
};

export default StatusBadge;
