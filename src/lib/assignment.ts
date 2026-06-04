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
      existingLeads?.filter((leadItem) => leadItem.agent_id === agent.id)
        .length || 0;

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
      const agentName = agent.name.toLowerCase();

      // Treatment expertise matching
      if (
        treatment.includes("facial") &&
        expertiseText.includes("facial")
      ) {
        routingScore += 55;
        reasons.push("facial aesthetics expertise match");
      }

      if (
        treatment.includes("dental") &&
        expertiseText.includes("dental")
      ) {
        routingScore += 45;
        reasons.push("dental-facial expertise match");
      }

      if (
        treatment.includes("rhinoplasty") &&
        expertiseText.includes("rhinoplasty")
      ) {
        routingScore += 40;
        reasons.push("rhinoplasty expertise match");
      }

      if (
        treatment.includes("revision") &&
        expertiseText.includes("rhinoplasty")
      ) {
        routingScore += 35;
        reasons.push("revision rhinoplasty fit");
      }

      if (
        (treatment.includes("body") || treatment.includes("liposuction")) &&
        expertiseText.includes("body")
      ) {
        routingScore += 50;
        reasons.push("body treatment expertise match");
      }

      if (expertiseText.includes("general")) {
        routingScore += 10;
        reasons.push("general patient coordination fit");
      }

      // High score routing logic
      if (lead.score >= 85) {
        routingScore += 15;
        reasons.push("high-intent lead");

        if (expertiseText.includes("rhinoplasty") && treatment.includes("rhinoplasty")) {
          routingScore += 10;
          reasons.push("high-score treatment fit");
        }
      }

      // Workload balancing: this is intentionally strong
      if (agent.lead_count === 0) {
        routingScore += 35;
        reasons.push("currently has no assigned leads");
      } else if (agent.lead_count === 1) {
        routingScore += 25;
        reasons.push("very low current workload");
      } else if (agent.lead_count === 2) {
        routingScore += 15;
        reasons.push("low current workload");
      } else if (agent.lead_count >= 4) {
        routingScore -= 25;
        reasons.push("higher current workload");
      }

      // Small manual calibration for demo balance
      // Can should be strong for facial aesthetics.
      if (agentName.includes("can") && treatment.includes("facial")) {
        routingScore += 25;
        reasons.push("best fit for facial consultation demo flow");
      }

      // Ayşe is good, but avoid assigning every facial/rhinoplasty lead to her.
      if (agentName.includes("ayşe") && agent.lead_count >= 2) {
        routingScore -= 20;
        reasons.push("load balancing away from already busy agent");
      }

      // Sara and Leyla should be viable alternatives for rhinoplasty leads.
      if (
        (agentName.includes("sara") || agentName.includes("leyla")) &&
        treatment.includes("rhinoplasty")
      ) {
        routingScore += 15;
        reasons.push("secondary rhinoplasty routing option");
      }

      routingScore -= agent.lead_count * 6;

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
    }. Current assigned leads: ${selectedAgent.lead_count}. Routing score: ${selectedAgent.routingScore}.`,
  };
}