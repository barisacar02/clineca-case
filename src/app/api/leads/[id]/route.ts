import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const allowedStages = ["Lead", "Called", "Reached", "Deposit"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { stage } = body;

    if (!allowedStages.includes(stage)) {
      return NextResponse.json(
        { error: "Invalid stage" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("leads")
      .update({ stage })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);

      return NextResponse.json(
        { error: "Could not update lead stage" },
        { status: 500 }
      );
    }

    return NextResponse.json({ lead: data });
  } catch (error) {
    console.error("API error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}