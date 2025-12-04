"use client";

import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import RequestsList from "./ProfiledAshilgah3";
import ConfirmationModal from "./ProfiledAshiglah";
import { Header } from "@/components/us/Header";

interface Request {
  id: string;
  userName: string;
  email: string;
  role: "Performer" | "Host";
  submittedAt: Date;
  message?: string;
}

const mockRequests: Request[] = [
  {
    id: "1",
    userName: "Sarah Johnson",
    email: "sarah@example.com",
    role: "Performer",
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    message: "I would love to perform at your platform",
  },
  {
    id: "2",
    userName: "Marcus Chen",
    email: "marcus@example.com",
    role: "Host",
    submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    message: "Interested in hosting events",
  },
  {
    id: "3",
    userName: "Emily Rodriguez",
    email: "emily@example.com",
    role: "Performer",
    submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

export default function AdminDashboard() {
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<{
    id: string;
    action: "accept" | "decline";
  } | null>(null);

  const handleActionClick = (
    requestId: string,
    action: "accept" | "decline"
  ) => {
    setSelectedRequest({ id: requestId, action });
  };

  const handleConfirm = () => {
    if (!selectedRequest) return;

    const request = requests.find((r) => r.id === selectedRequest.id);
    if (!request) return;

    setRequests(requests.filter((r) => r.id !== selectedRequest.id));
    setSelectedRequest(null);
  };

  const handleCancel = () => {
    setSelectedRequest(null);
  };

  return (
    <div>
      <Header></Header>
      <main className="min-h-screen bg-linear-to-br from-background via-background to-muted/30 p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Pending Requests
            </h1>
            <p className="mt-2 text-muted-foreground">
              Review and manage user-submitted join requests from performers and
              hosts
            </p>
          </div>

          {/* Stats Bar */}
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <Card className="border border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Pending Requests
                    </p>
                    <p className="text-2xl font-bold">{requests.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-accent/10 p-3">
                    <XCircle className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Performers</p>
                    <p className="text-2xl font-bold">
                      {requests.filter((r) => r.role === "Performer").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Requests List or Empty State */}
          {requests.length > 0 ? (
            <RequestsList
              requests={requests}
              onActionClick={handleActionClick}
            />
          ) : (
            <Card className="border border-border bg-card text-center">
              <CardContent className="py-16">
                <div className="flex justify-center">
                  <div className="rounded-full bg-muted p-3">
                    <CheckCircle2 className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  All caught up!
                </h3>
                <p className="mt-2 text-muted-foreground">
                  You have no pending requests at the moment. Check back later
                  for new submissions.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Confirmation Modal */}
        {selectedRequest && (
          <ConfirmationModal
            isOpen={!!selectedRequest}
            action={selectedRequest.action}
            request={requests.find((r) => r.id === selectedRequest.id)!}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        )}
      </main>
    </div>
  );
}
