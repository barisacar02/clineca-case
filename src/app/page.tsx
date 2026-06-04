"use client";

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    country: "",
    treatment_interest: "Rhinoplasty in Istanbul",
    timeline: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Lead could not be created");
      }

      setStatus("success");
      setFormData({
        name: "",
        phone: "",
        country: "",
        treatment_interest: "Rhinoplasty in Istanbul",
        timeline: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-12 md:grid-cols-2 md:items-center md:py-14">
        <div>
          <p className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            Premium Medical Travel
          </p>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Plan Your Rhinoplasty Journey in Istanbul
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Connect with a patient coordination team, receive guidance on treatment options, travel planning,
  recovery expectations, and the next steps toward your consultation.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-lg font-bold leading-tight text-slate-900">Personalized Plan</p>
              <p className="text-sm text-slate-500">Treatment options, travel timing, and next steps reviewed together.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-lg font-bold leading-tight text-slate-900">International Care</p>
              <p className="text-sm text-slate-500">Support for patients planning treatment from abroad.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-lg font-bold leading-tight text-slate-900">AI-Prioritized Assistant</p>
              <p className="text-sm text-slate-500">Your inquiry is reviewed and routed to the right coordinator faster.</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-xl">
          <h2 className="text-2xl font-bold">Request Your Personalized Consultation Plan</h2>
          <p className="mt-2 text-sm text-slate-500">
            Share your details and our patient coordination team will review your inquiry and contact you with suitable treatment guidance, availability, and next steps.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Full name</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Sarah Johnson"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Phone / WhatsApp</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                placeholder="+44 7000 000000"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Country</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="United Kingdom"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Treatment interest</label>
              <select
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                value={formData.treatment_interest}
                onChange={(e) =>
                  setFormData({ ...formData, treatment_interest: e.target.value })
                }
              >
                <option>Rhinoplasty in Istanbul</option>
                <option>Revision Rhinoplasty</option>
                <option>Facial Aesthetics Consultation</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">When are you planning treatment?</label>
              <select
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
              >
                <option value="">Select timeline</option>
                <option>As soon as possible</option>
                <option>Within 1 month</option>
                <option>Within 3 months</option>
                <option>Just researching</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Message</label>
              <textarea
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us what you would like to know..."
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {status === "loading" ? "Submitting..." : "Request consultation"}
            </button>

            {status === "success" && (
              <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">
                Thank you. Your lead was created successfully.
              </p>
            )}

            {status === "error" && (
              <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="font-bold">1. Share your details</h3>
            <p className="mt-2 text-sm text-slate-600">
              Submit your contact information and treatment interest.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="font-bold">2. Get contacted</h3>
            <p className="mt-2 text-sm text-slate-600">
              A patient coordinator reviews your request and reaches out.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="font-bold">3. Move toward consultation</h3>
            <p className="mt-2 text-sm text-slate-600">
              Qualified leads are moved through the clinic pipeline.
            </p>
          </div>
        </div>
      </section>
            <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-bold">Demo navigation</h3>
            <p className="text-sm text-slate-500">
              Quick links for reviewing the case study flow.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/crm"
              className="rounded-xl bg-slate-900 px-5 py-3 text-center font-semibold text-white hover:bg-slate-800"
            >
              Open CRM
            </a>

            <a
              href="/agents"
              className="rounded-xl border border-slate-300 px-5 py-3 text-center font-semibold hover:bg-slate-100"
            >
              Open Agent View
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}