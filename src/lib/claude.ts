import Anthropic from "@anthropic-ai/sdk";

type LeadScoringInput = {
  name: string;
  phone: string;
  country?: string | null;
  treatment_interest: string;
  timeline?: string | null;
  message?: string | null;
};

type LeadScoringResult = {
  score: number;
  explanation: string;
};

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function scoreLeadWithClaude(
  lead: LeadScoringInput
): Promise<LeadScoringResult> {
  const prompt = `
You are an AI lead qualification assistant for a medical tourism clinic in Istanbul.

Your task is to score a potential patient lead from 0 to 100.

Use these factors:
- Clear treatment interest
- Valid phone / WhatsApp presence
- Urgency of timeline
- Country / international patient fit
- Message intent and seriousness
- Likelihood to move toward consultation or deposit

Lead details:
Name: ${lead.name}
Phone: ${lead.phone}
Country: ${lead.country || "Not provided"}
Treatment interest: ${lead.treatment_interest}
Timeline: ${lead.timeline || "Not provided"}
Message: ${lead.message || "Not provided"}

Return only valid JSON in this exact format:
{
  "score": 82,
  "explanation": "Short explanation here."
}

Do not include markdown.
Do not include extra text.
`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");

    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Claude did not return text");
    }

    const parsed = JSON.parse(textBlock.text) as LeadScoringResult;

    return {
      score: Math.max(0, Math.min(100, Number(parsed.score))),
      explanation: parsed.explanation || "AI score generated successfully.",
    };
  } catch (error) {
    console.error("Claude scoring error:", error);

    return {
      score: 50,
      explanation:
        "Fallback score used because AI scoring failed. This lead should be manually reviewed.",
    };
  }
}