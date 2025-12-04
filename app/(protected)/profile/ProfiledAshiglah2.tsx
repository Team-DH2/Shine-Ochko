"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

interface Request {
  id: string;
  userName: string;
  email: string;
  role: "Performer" | "Host";
  submittedAt: Date;
  message?: string;
}

interface RequestCardProps {
  request: Request;
  onActionClick: (requestId: string, action: "accept" | "decline") => void;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export default function RequestCard({
  request,
  onActionClick,
}: RequestCardProps) {
  const roleColors = {
    Performer: "bg-primary/10 text-primary hover:bg-primary/20",
    Host: "bg-accent/10 text-accent hover:bg-accent/20",
  };

  return (
    <Card className="border border-border bg-card transition-all hover:shadow-sm">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Request Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {request.userName}
                </h3>
                <p className="text-sm text-muted-foreground">{request.email}</p>
              </div>
              <Badge
                variant="secondary"
                className={`shrink-0 ${roleColors[request.role]}`}
              >
                {request.role}
              </Badge>
            </div>

            {/* Message Preview */}
            {request.message && (
              <p className="text-sm text-muted-foreground italic">
                "{request.message}"
              </p>
            )}

            {/* Metadata */}
            <p className="text-xs text-muted-foreground">
              Submitted {formatTimeAgo(request.submittedAt)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 md:flex-col lg:flex-row">
            <Button
              onClick={() => onActionClick(request.id, "accept")}
              size="sm"
              className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span className="hidden sm:inline">Accept</span>
              <span className="sm:hidden">OK</span>
            </Button>
            <Button
              onClick={() => onActionClick(request.id, "decline")}
              size="sm"
              variant="outline"
              className="flex-1 gap-2 border-border text-foreground hover:bg-muted"
            >
              <XCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Decline</span>
              <span className="sm:hidden">No</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
