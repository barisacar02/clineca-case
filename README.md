# Clineca Case Study — AI-Powered Lead Conversion MVP

This is a technical case study built for Clineca.

The project is a working MVP for the clinic lead conversion flow:

ad → landing page → lead capture → AI qualification → agent assignment → CRM follow-up

I built a rhinoplasty-focused landing page, a lead capture form, AI-powered lead scoring, automatic agent assignment, a mini CRM, and an agent workload view.

---

## Links

Live demo: https://clineca-case.vercel.app/

GitHub repository: https://github.com/barisacar02/clineca-case

CRM dashboard: https://clineca-case.vercel.app/crm

Agent workspace: https://clineca-case.vercel.app/agents

---

## What I Built

### Landing Page

The landing page focuses on rhinoplasty in Istanbul and is designed for international patient inquiries.

It includes:

- Patient-facing treatment copy
- A consultation request form
- Treatment interest selection
- Timeline and message fields
- Mobile-responsive layout

I removed internal CRM and agent links from the landing page because, in a real product, patients should not access internal operational screens.

### Lead Capture Form

The form collects:

- Name
- Phone / WhatsApp
- Country
- Treatment interest
- Timeline
- Message

When the form is submitted, the lead is saved in Supabase, scored by AI, assigned to an agent, and displayed in the CRM.

### Mini CRM

The CRM dashboard shows:

- Incoming leads
- AI lead score
- AI score explanation
- Assigned agent
- Assignment reason
- Pipeline stage
- Dashboard metrics

Pipeline stages:

Lead → Called → Reached → Deposit

### Agent Workspace

The agent workspace shows the five fictional agents and their assigned leads.

This was built to demonstrate how leads are distributed across agents based on treatment fit, AI score, workload, and expertise.

---

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase
- Anthropic Claude API
- Vercel
- GitHub

---

## How It Works

1. A patient submits the form on the landing page.
2. The app sends the lead to the `/api/leads` route.
3. Claude generates a lead score from 0 to 100 and explains the score.
4. The assignment logic selects the best agent based on score, treatment interest, expertise, and workload.
5. The lead is saved in Supabase.
6. The CRM displays the lead, AI score, explanation, assigned agent, and routing reason.
7. The team can update the lead stage through the pipeline.
8. The assigned lead is also visible in the agent workspace.

---

## AI Usage

AI was used in two ways.

### Runtime AI Lead Scoring

The application uses the Anthropic Claude API to score each new lead.

The scoring considers:

- Treatment intent
- Phone / WhatsApp presence
- Timeline urgency
- Message seriousness
- Pricing, consultation, travel, recovery, or deposit signals
- International patient fit
- Likelihood to move toward appointment or deposit

Claude returns both a numeric score and a short explanation.

This is not a hardcoded if/else score. A real LLM API is called when a new lead is submitted.

### AI-Assisted Development

I also used AI as a development partner during the case study.

I used AI to help with:

- Breaking the case into product requirements
- Planning the MVP flow
- Creating the Supabase schema
- Building the Next.js pages and API routes
- Writing and refining the Claude scoring prompt
- Debugging issues
- Improving the agent assignment logic
- Polishing the landing page and CRM copy

My role was to guide the product decisions, test the system, identify issues, and iterate quickly with AI support.

---

## Agent Assignment Logic

Each lead is automatically assigned to one of five fictional agents.

The assignment considers:

- AI lead score
- Treatment interest
- Agent expertise
- Current workload
- Treatment-agent fit

I intentionally used explainable deterministic logic for assignment instead of another AI call.

The reason is that operational lead routing should be predictable, auditable, and easier to debug. AI is used for qualification, while assignment uses clear business rules.

In this MVP, all valid form submissions are assigned to an agent so the full routing flow can be demonstrated.

In a production version, I would add a minimum score threshold and a review queue for very low-quality leads, so agents are not overloaded with spam or weak inquiries.

---

## Local Setup

Install dependencies:

```bash
npm install

Run locally:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Build check:

```bash
npm run build
```

---

## Trade-Offs and What I Did Not Build

I treated this as a focused MVP rather than a production-ready system.

I prioritized the core flow:

landing page → lead capture → AI scoring → CRM → agent assignment

I did not build:

- Authentication
- Role-based permissions
- Real WhatsApp integration
- Real deposit/payment flow
- Advanced analytics
- Admin controls for editing agents
- A review queue for low-quality leads

These would be the next improvements if the project were developed further.

---

## Where I Got Stuck / What I Improved

A few issues came up during development:

- The CRM initially did not update immediately on the live Vercel version because the page was being treated as static. I fixed this by making the CRM and agent pages dynamic.
- The first AI scoring behavior was too narrow and produced similar scores. I improved the Claude prompt so different lead scenarios receive more varied and realistic scores.
- Claude responses can sometimes be difficult to parse if they include extra text, so I made the JSON parsing more robust.
- The landing page originally had internal demo links to the CRM and agent pages. I removed them because a real patient-facing page should not expose internal tools.

---

## Important Prompts Used

### Claude Lead Scoring Prompt

The runtime scoring prompt asks Claude to act as a lead qualification assistant for a medical tourism clinic in Istanbul.

It gives Claude clear scoring ranges:

- 90–100: Very high-intent lead
- 75–89: Strong lead
- 60–74: Moderate lead
- 40–59: Low-to-medium lead
- 0–39: Poor or unclear lead

The prompt asks Claude to evaluate treatment intent, timeline urgency, message seriousness, pricing/deposit/travel signals, and likelihood to move toward consultation or deposit.

Claude must return valid JSON with:

```json
{
  "score": 82,
  "explanation": "Short explanation here."
}
```

### AI Development Prompting

During development, I used AI prompts to:

- Plan the MVP structure
- Generate the Supabase schema
- Build the lead form and CRM pages
- Create the API route for lead submission
- Connect Claude scoring
- Improve the scoring calibration
- Debug deployment and parsing issues
- Polish the final product copy

---

## Final Note

This project is a case study prototype, not a production medical system.

The goal was to demonstrate a working end-to-end lead conversion workflow with AI-powered lead qualification and explainable agent routing.