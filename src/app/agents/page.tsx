import { supabase } from "@/lib/supabase";

type Agent = {
  id: string;
  name: string;
  expertise: string[];
  languages: string[];
};

type Lead = {
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
};

export default async function AgentsPage() {
  const { data: agentsData, error: agentsError } = await supabase
    .from("agents")
    .select("*")
    .order("name", { ascending: true });

  const { data: leadsData, error: leadsError } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (agentsError || leadsError) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-6xl rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-red-600">Agent View Error</h1>
          <p className="mt-2 text-slate-600">Could not load agents or leads.</p>
        </div>
      </main>
    );
  }

  const agents = (agentsData || []) as Agent[];
  const leads = (leadsData || []) as Lead[];

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">Clineca Agent View</p>
            <h1 className="text-3xl font-bold">Agent Lead Assignments</h1>
            <p className="mt-2 text-slate-600">
              Each agent can see the leads automatically assigned to them.
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="/"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-center font-semibold hover:bg-slate-100"
            >
              Landing Page
            </a>

            <a
              href="/crm"
              className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
            >
              CRM
            </a>
          </div>
        </div>

        <div className="grid gap-6">
          {agents.map((agent) => {
            const assignedLeads = leads.filter((lead) => lead.agent_id === agent.id);

            return (
              <section key={agent.id} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{agent.name}</h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Expertise: {agent.expertise.join(", ")}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Languages: {agent.languages.join(", ")}
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-50 px-4 py-3 text-blue-700">
                    <p className="text-sm font-semibold">Assigned leads</p>
                    <p className="text-3xl font-bold">{assignedLeads.length}</p>
                  </div>
                </div>

                {assignedLeads.length === 0 ? (
                  <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                    No leads assigned to this agent yet.
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {assignedLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="rounded-2xl border border-slate-200 p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-bold">{lead.name}</h3>
                            <p className="mt-1 text-sm text-slate-500">
                              {lead.phone} · {lead.country || "No country"}
                            </p>
                          </div>

                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                            {lead.score ?? "No score"}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase text-slate-400">
                              Stage
                            </p>
                            <p className="mt-1 font-medium">{lead.stage}</p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase text-slate-400">
                              Treatment
                            </p>
                            <p className="mt-1 font-medium">
                              {lead.treatment_interest}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase text-slate-400">
                              Timeline
                            </p>
                            <p className="mt-1 font-medium">
                              {lead.timeline || "-"}
                            </p>
                          </div>

                          {lead.message && (
                            <div>
                              <p className="text-xs font-semibold uppercase text-slate-400">
                                Message
                              </p>
                              <p className="mt-1 text-sm text-slate-600">
                                {lead.message}
                              </p>
                            </div>
                          )}

                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-xs font-semibold uppercase text-slate-400">
                              Assignment Reason
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                              {lead.assignment_reason || "No reason saved."}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}