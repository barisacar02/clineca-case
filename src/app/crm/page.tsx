export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import StageSelect from "@/components/StageSelect";

type CRMLead = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  country: string | null;
  treatment_interest: string;
  timeline: string | null;
  message: string | null;
  stage: "Lead" | "Called" | "Reached" | "Deposit";
  score: number | null;
  score_explanation: string | null;
  agent_id: string | null;
  assignment_reason: string | null;
  agents: {
    name: string;
  } | null;
};

export default async function CRMPage() {
  const { data: leads, error } = await supabase
    .from("leads")
    .select(`
      *,
      agents (
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("CRM load error:", error);

    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-6xl rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-red-600">CRM Error</h1>
          <p className="mt-2 text-slate-600">Could not load leads.</p>
        </div>
      </main>
    );
  }

  const leadList = (leads || []) as CRMLead[];

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">Clineca Mini CRM</p>
            <h1 className="text-3xl font-bold">Incoming Leads</h1>
            <p className="mt-2 text-slate-600">
              Leads submitted from the rhinoplasty landing page, scored by AI and routed to agents.
            </p>
          </div>

          <a
            href="/"
            className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
          >
            Back to landing page
          </a>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total leads</p>
            <p className="mt-2 text-3xl font-bold">{leadList.length}</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Lead</p>
            <p className="mt-2 text-3xl font-bold">
              {leadList.filter((lead) => lead.stage === "Lead").length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Reached</p>
            <p className="mt-2 text-3xl font-bold">
              {leadList.filter((lead) => lead.stage === "Reached").length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Deposit</p>
            <p className="mt-2 text-3xl font-bold">
              {leadList.filter((lead) => lead.stage === "Deposit").length}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {leadList.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-slate-500">No leads yet. Submit the landing page form first.</p>
            </div>
          ) : (
            leadList.map((lead) => (
              <div key={lead.id} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-bold">{lead.name}</h2>

                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        Score: {lead.score ?? "Not scored"}
                      </span>

                      <StageSelect leadId={lead.id} currentStage={lead.stage} />
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      {lead.phone} · {lead.country || "Country not provided"} ·{" "}
                      {new Date(lead.created_at).toLocaleDateString()}
                    </p>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Treatment
                        </p>
                        <p className="mt-1 font-medium">{lead.treatment_interest}</p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Timeline
                        </p>
                        <p className="mt-1 font-medium">{lead.timeline || "-"}</p>
                      </div>
                    </div>

                    {lead.message && (
                      <div className="mt-4 rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Message
                        </p>
                        <p className="mt-1 text-sm text-slate-700">{lead.message}</p>
                      </div>
                    )}
                  </div>

                  <div className="w-full rounded-2xl border border-slate-200 p-4 lg:max-w-sm">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Assigned Agent
                    </p>

                    <p className="mt-1 text-lg font-bold">
                      {lead.agents?.name || "Not assigned"}
                    </p>

                    <p className="mt-4 text-xs font-semibold uppercase text-slate-400">
                      AI Score Explanation
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {lead.score_explanation || "No explanation yet."}
                    </p>

                    <p className="mt-4 text-xs font-semibold uppercase text-slate-400">
                      Assignment Reason
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {lead.assignment_reason || "No assignment reason yet."}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}