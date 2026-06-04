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

Your job is to score a potential patient lead from 0 to 100 based on how likely they are to move toward a consultation, appointment, or deposit.

Use the full 0-100 range. Do not default to 50 unless the lead is truly neutral or unclear.

Scoring guide:

90-100:
Very high-intent lead. They are serious, urgent, specific, and close to booking. They mention pricing, dates, deposit, procedure plan, travel, or consultation availability.

75-89:
Strong lead. They show clear treatment intent, provide useful details, have a realistic timeline, and are likely worth fast follow-up.

60-74:
Moderate lead. They are interested but still researching, have some missing details, or are not urgent yet.

40-59:
Low-to-medium lead. The message is vague, casual, unclear, or mostly exploratory.

0-39:
Poor lead. Missing key information, no clear treatment interest, invalid-looking contact details, joke/spam-like message, or very low intent.

Evaluate these factors:
- Phone / WhatsApp presence and whether it looks usable
- Treatment specificity
- Timeline urgency
- Message seriousness
- Mentions of pricing, consultation dates, recovery, deposit, travel, or treatment plan
- International patient fit
- Likelihood to move to appointment or deposit

Important calibration:
- Do not give every normal lead 85+.
- A short message like "I want a new nose :)" should not receive a high score just because treatment interest exists.
- A serious message asking about pricing, dates, recovery, and deposit should usually score above 80.
- A facial aesthetics consultation can score high if the message shows serious intent and asks about treatment options, timing, pricing, or deposit.
- If the lead is valid but vague, use 50-65.
- If the lead is serious but not urgent, use 65-78.
- If the lead is urgent and commercially strong, use 80-95.

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

The explanation should be 1-2 sentences and should mention the main reason for the score.

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

    const rawText = textBlock.text.trim();

const jsonMatch = rawText.match(/\{[\s\S]*\}/);

if (!jsonMatch) {
  throw new Error(`Claude did not return valid JSON. Raw response: ${rawText}`);
}

const parsed = JSON.parse(jsonMatch[0]) as LeadScoringResult;

const score = Math.max(0, Math.min(100, Number(parsed.score)));

if (Number.isNaN(score)) {
  throw new Error(`Claude returned an invalid score. Raw response: ${rawText}`);
}

return {
  score,
  explanation: parsed.explanation || "AI score generated successfully.",
};
  } catch (error) {
    console.error("Claude scoring error:", error);

    return {
  score: 50,
  explanation:
    "Fallback score used because the AI scoring request could not be completed or parsed. This lead should be manually reviewed.",
};
  }
}