"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, XCircle } from "lucide-react";

interface Request {
  id: string;
  userName: string;
  email: string;
  role: "Performer" | "Host";
  submittedAt: Date;
  message?: string;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  action: "accept" | "decline";
  request: Request;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  isOpen,
  action,
  request,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const isAccept = action === "accept";
  const Icon = isAccept ? CheckCircle2 : XCircle;
  const iconColor = isAccept ? "text-primary" : "text-destructive";
  const buttonColor = isAccept
    ? "bg-primary text-primary-foreground hover:bg-primary/90"
    : "bg-destructive text-destructive-foreground hover:bg-destructive/90";

  const handleConfirm = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    onConfirm();
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="mx-auto mb-4 rounded-full bg-muted p-3">
            <Icon className={`h-8 w-8 ${iconColor}`} />
          </div>
          <DialogTitle className="text-center">
            {isAccept ? "Accept Request?" : "Decline Request?"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isAccept
              ? `Approve ${request.userName} as a ${request.role.toLowerCase()}`
              : `Reject the request from ${request.userName}`}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg bg-muted p-4">
          <div className="space-y-2 text-sm">
            <div>
              <p className="font-medium text-foreground">{request.userName}</p>
              <p className="text-muted-foreground">{request.email}</p>
            </div>
            <p className="text-xs font-medium text-muted-foreground">
              Role: {request.role}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            onClick={onCancel}
            variant="outline"
            disabled={isLoading}
            className="flex-1 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 ${buttonColor}`}
          >
            {isLoading ? "Processing..." : isAccept ? "Accept" : "Decline"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
