import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { scoreLeadWithClaude } from "@/lib/claude";
import { assignLeadToAgent } from "@/lib/assignment";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, phone, country, treatment_interest, timeline, message } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    const aiScore = await scoreLeadWithClaude({
      name,
      phone,
      country,
      treatment_interest,
      timeline,
      message,
    });

    const assignment = await assignLeadToAgent({
  treatment_interest,
  score: aiScore.score,
});

    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
  name,
  phone,
  country,
  treatment_interest,
  timeline,
  message,
  stage: "Lead",
  score: aiScore.score,
  score_explanation: aiScore.explanation,
  agent_id: assignment.agentId,
  assignment_reason: assignment.reason,
},
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);

      return NextResponse.json(
        { error: "Could not create lead" },
        { status: 500 }
      );
    }

    return NextResponse.json({ lead: data }, { status: 201 });
  } catch (error) {
    console.error("API error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}