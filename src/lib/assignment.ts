import { supabase } from "@/lib/supabase";

type AssignmentInput = {
  treatment_interest: string;
  score: number;
};

type AgentWithLoad = {
  id: string;
  name: string;
  expertise: string[];
  languages: string[];
  lead_count: number;
};

type AssignmentResult = {
  agentId: string | null;
  reason: string;
};

export async function assignLeadToAgent(
  lead: AssignmentInput
): Promise<AssignmentResult> {
  const { data: agents, error: agentsError } = await supabase
    .from("agents")
    .select("id, name, expertise, languages");

  if (agentsError || !agents || agents.length === 0) {
    console.error("Agent fetch error:", agentsError);

    return {
      agentId: null,
      reason: "No available agents found. Lead should be manually assigned.",
    };
  }

  const { data: existingLeads, error: leadsError } = await supabase
    .from("leads")
    .select("agent_id");

  if (leadsError) {
    console.error("Lead workload fetch error:", leadsError);
  }

  const agentsWithLoad: AgentWithLoad[] = agents.map((agent) => {
    const leadCount =
      existingLeads?.filter((lead) => lead.agent_id === agent.id).length || 0;

    return {
      id: agent.id,
      name: agent.name,
      expertise: agent.expertise || [],
      languages: agent.languages || [],
      lead_count: leadCount,
    };
  });

  const treatment = lead.treatment_interest.toLowerCase();

  const rankedAgents = agentsWithLoad
    .map((agent) => {
      let routingScore = 0;
      const reasons: string[] = [];

      const expertiseText = agent.expertise.join(" ").toLowerCase();

      if (treatment.includes("rhinoplasty") && expertiseText.includes("rhinoplasty")) {
        routingScore += 40;
        reasons.push("treatment expertise match");
      }

      if (treatment.includes("facial") && expertiseText.includes("facial")) {
        routingScore += 25;
        reasons.push("facial aesthetics expertise match");
      }

      if (lead.score >= 80 && expertiseText.includes("rhinoplasty")) {
        routingScore += 20;
        reasons.push("high-score rhinoplasty lead");
      }

      if (agent.lead_count === 0) {
        routingScore += 20;
        reasons.push("currently has no assigned leads");
      } else if (agent.lead_count <= 2) {
        routingScore += 10;
        reasons.push("low current workload");
      }

      routingScore -= agent.lead_count * 3;

      return {
        ...agent,
        routingScore,
        reasons,
      };
    })
    .sort((a, b) => b.routingScore - a.routingScore);

  const selectedAgent = rankedAgents[0];

  return {
    agentId: selectedAgent.id,
    reason: `Assigned to ${selectedAgent.name} based on ${
      selectedAgent.reasons.length > 0
        ? selectedAgent.reasons.join(", ")
        : "balanced workload and general fit"
    }. Current assigned leads: ${selectedAgent.lead_count}.`,
  };
}