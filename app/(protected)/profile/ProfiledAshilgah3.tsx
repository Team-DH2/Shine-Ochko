"use client";

import RequestCard from "./ProfiledAshiglah2";

interface Request {
  id: string;
  userName: string;
  email: string;
  role: "Performer" | "Host";
  submittedAt: Date;
  message?: string;
}

interface RequestsListProps {
  requests: Request[];
  onActionClick: (requestId: string, action: "accept" | "decline") => void;
}

export default function RequestsList({
  requests,
  onActionClick,
}: RequestsListProps) {
  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          onActionClick={onActionClick}
        />
      ))}
    </div>
  );
}
