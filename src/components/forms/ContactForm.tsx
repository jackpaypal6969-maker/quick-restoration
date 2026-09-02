"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, m } from "motion/react";
import { CalendarClock, CheckCircle2, ChevronDown, ClipboardList, LoaderCircle, Phone, Siren } from "lucide-react";
import { z } from "zod";
import { services, siteConfig } from "@/config/site";
import { cn, telHref } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/components/layout/hooks";
import { Button } from "@/components/ui/Button";
import {
  contactSchema,
  formatPhoneDisplay,
  HONEYPOT_FIELD,
  normalizeUsPhone,
  NOT_SURE_SERVICE,
  URGENCY_LABELS,
  type Urgency,
} from "@/lib/contact-schema";

interface FormValues {
  urgency: Urgency;
  name: string;
  phone: string;
  email: string;
  address: string;
  service: string;
  message: string;
  consent: boolean;
  website: string;
}

type FieldName = keyof FormValues;
type TextFieldName = Exclude<FieldName, "consent" | "urgency">;
type Errors = Partial<Record<FieldName, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const INITIAL: FormValues = {
  urgency: "emergency",
  name: "",
  phone: "",
  email: "",
  address: "",
  service: "",
  message: "",
  consent: false,
  website: "",
};

const FIELD_ORDER: FieldName[] = ["urgency", "name", "phone", "email", "address", "service", "message", "consent"];

const URGENCY_OPTIONS: { value: Urgency; label: string; hint: string; icon: typeof Siren }[] = [
  { value: "emergency", label: URGENCY_LABELS.emergency, hint: "Active water, fire, sewage or storm damage", icon: Siren },
  { value: "soon", label: URGENCY_LABELS.soon, hint: "Contained, but needs a crew this week", icon: CalendarClock },
  { value: "quote", label: URGENCY_LABELS.quote, hint: "Pricing, insurance or general questions", icon: ClipboardList },
];

/** Example number for the phone field: the business line's area code with a reserved 555 exchange. */
const PHONE_PLACEHOLDER = `(${normalizeUsPhone(siteConfig.phone)?.slice(0, 3) ?? "555"}) 555-0123`;

const inputClass =
  "h-12 w-full rounded-xl border border-ink-900/50 bg-white px-4 text-base text-ink-950 placeholder:text-ink-500 " +
  "transition-[border-color,box-shadow] duration-200 ease-out-expo " +
  "focus:border-royal-500 focus:ring-4 focus:ring-royal-500/15 focus-visible:outline-royal-500 " +
  "aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/15";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

function toErrors(fieldErrors: Record<string, string[] | undefined>): Errors {
  const next: Errors = {};
  for (const key of FIELD_ORDER) {
    const first = fieldErrors[key]?.[0];
    if (first) next[key] = first;
  }
  return next;
}

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: (describedBy: string | undefined, invalid: boolean) => ReactNode;
}

function Field({ id, label, error, hint, optional, children }: FieldProps) {
  const showHint = Boolean(hint) && !error;
  const hintId = showHint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink-950">
        {label}
        {optional && <span className="ml-1.5 font-normal text-ink-500">(optional)</span>}
      </label>
      {children(describedBy, Boolean(error))}
      {showHint && (
        <p id={hintId} className="text-[13px] leading-snug text-ink-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-[13px] font-medium leading-snug text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

interface ContactFormProps {
  className?: string;
  /**
   * Heading block rendered above the form. Owned by the form so it disappears
   * with the fields once a request has been received.
   */
  intro?: ReactNode;
}

/**
 * Lead form. Renders as a plain, fully visible <form> on the server: no entrance
 * animation, no observer, nothing a slow or failed script could leave hidden.
 * Motion is limited to the emergency notice and the success panel.
 */
export function ContactForm({ className, intro }: ContactFormProps) {
  const reduce = usePrefersReducedMotion();
  const uid = useId();
  const [values, setValues] = useState<FormValues>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [banner, setBanner] = useState<string | null>(null);
  /** Ten-digit phone from the validated payload, shown on the success screen. */
  const [sentPhone, setSentPhone] = useState("");
  const startedAt = useRef<number>(0);
  const formRef = useRef<HTMLFormElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === "success") {
      successRef.current?.focus();
    } else if (status === "error") {
      // Network and rate-limit failures have no field to land on, so the banner
      // takes focus. Validation failures keep focus on the first invalid field
      // (set in onSubmit); their banner is still announced through role="alert".
      bannerRef.current?.focus();
    }
  }, [status]);

  const fid = (name: FieldName) => `${uid}-${name}`;
  const urgencyErrorId = `${fid("urgency")}-error`;
  const phoneHref = telHref(siteConfig.phone);
  const submitting = status === "submitting";

  function update<K extends FieldName>(name: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function onText(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    update(e.target.name as TextFieldName, e.target.value);
  }

  function focusFirstError(errs: Errors) {
    const first = FIELD_ORDER.find((k) => errs[k]);
    if (!first) return;
    const target =
      first === "urgency"
        ? formRef.current?.querySelector<HTMLInputElement>('input[name="urgency"]:checked')
        : document.getElementById(fid(first));
    target?.focus();
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return; // double-submit guard; the button stays focusable (aria-disabled)
    setBanner(null);

    const payload = { ...values, startedAt: startedAt.current || Date.now() };

    const check = contactSchema.safeParse(payload);
    if (!check.success) {
      const errs = toErrors(z.flattenError(check.error).fieldErrors);
      setErrors(errs);
      setBanner("A few fields need attention before we can send this.");
      setStatus("idle");
      focusFirstError(errs);
      return;
    }

    setSentPhone(check.data.phone);
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      let data: { ok?: boolean; errors?: Record<string, string[]>; error?: string } = {};
      try {
        data = await res.json();
      } catch {
        // Non-JSON reply (proxy error page); handled by status below.
      }

      if (res.ok && data.ok) {
        setStatus("success");
        return;
      }

      if (res.status === 400 && data.errors) {
        const errs = toErrors(data.errors);
        setErrors(errs);
        setBanner("Please check the highlighted fields and send again.");
        setStatus("idle");
        focusFirstError(errs);
        return;
      }

      if (res.status === 429) {
        setBanner(`Too many requests from this connection. Please call ${siteConfig.phone} and we will help right away.`);
        setStatus("error");
        return;
      }

      setBanner(`We couldn't send your request. Your details are still here; try again, or call ${siteConfig.phone}.`);
      setStatus("error");
    } catch {
      setBanner(`Connection problem. Nothing was lost; try again in a moment, or call ${siteConfig.phone}.`);
      setStatus("error");
    }
  }

  const shell = cn("rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink-900/5 sm:p-8 lg:p-10", className);

  if (status === "success") {
    return (
      <m.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.5, ease }}
        className={shell}
        role="status"
        aria-live="polite"
        tabIndex={-1}
        ref={successRef}
      >
        <div className="flex flex-col items-start gap-5">
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-royal-100 text-royal-600">
            <CheckCircle2 aria-hidden className="size-7" />
          </span>
          <h2 className="font-display text-2xl font-bold leading-tight text-ink-950 sm:text-3xl">Request received.</h2>
          <p className="max-w-prose text-base leading-relaxed text-ink-700">
            If this is an emergency, call now - the dispatcher already has your details. Otherwise we will call you at{" "}
            <span className="font-semibold text-ink-950">{formatPhoneDisplay(sentPhone)}</span> the same day.
          </p>
          <Button variant="primary" size="lg" href={phoneHref}>
            <Phone aria-hidden className="size-5" />
            Call {siteConfig.phone}
          </Button>
        </div>
      </m.div>
    );
  }

  return (
    <>
      {intro}
      <form ref={formRef} onSubmit={onSubmit} noValidate className={cn(shell, "relative")} aria-busy={submitting}>
        {/* Honeypot: off-screen, never focusable, ignored by assistive tech. */}
        <div aria-hidden="true" className="absolute -left-[9999px] top-0 size-px overflow-hidden">
          <label htmlFor={fid("website")}>Website</label>
          <input
            id={fid("website")}
            name={HONEYPOT_FIELD}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={onText}
          />
        </div>

        <div className="flex flex-col gap-7">
          <fieldset className="flex flex-col gap-3" aria-describedby={errors.urgency ? urgencyErrorId : undefined}>
            <legend className="mb-3 text-sm font-semibold text-ink-950">How urgent is this?</legend>
            <div className="grid gap-2.5 sm:grid-cols-3">
              {URGENCY_OPTIONS.map(({ value, label, hint, icon: Icon }) => {
                const checked = values.urgency === value;
                return (
                  <label
                    key={value}
                    className={cn(
                      "group flex min-h-[44px] cursor-pointer flex-col gap-1 rounded-2xl border px-4 py-3.5 select-none",
                      "transition-[background-color,border-color,color,box-shadow] duration-200 ease-out-expo",
                      "has-focus-visible:ring-4 has-focus-visible:ring-royal-500/25",
                      checked
                        ? "border-midnight-900 bg-midnight-900 text-white shadow-card"
                        : "border-ink-900/15 bg-white text-ink-950 hover:border-ink-900/40 hover:bg-ice-50",
                    )}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={value}
                      checked={checked}
                      onChange={() => update("urgency", value)}
                      className="sr-only"
                    />
                    <span className="flex items-center gap-2 text-sm font-semibold leading-tight">
                      <Icon aria-hidden className={cn("size-4 shrink-0", checked ? "text-electric-300" : "text-royal-600")} />
                      {label}
                    </span>
                    <span className={cn("text-xs leading-snug", checked ? "text-white/65" : "text-ink-500")}>{hint}</span>
                  </label>
                );
              })}
            </div>
            {errors.urgency && (
              <p id={urgencyErrorId} className="text-[13px] font-medium text-red-600" role="alert">
                {errors.urgency}
              </p>
            )}

            {/* Slim inline notice directly under the selector: the phone is the fastest path for an emergency. */}
            <AnimatePresence initial={false}>
              {values.urgency === "emergency" && (
                <m.div
                  key="emergency-notice"
                  initial={reduce ? false : { opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 1 } : { opacity: 0, y: -4 }}
                  transition={{ duration: reduce ? 0 : 0.3, ease }}
                  className="surface-dark flex items-center gap-3 rounded-xl bg-midnight-900 px-4 py-1 text-sm text-white ring-1 ring-white/10"
                >
                  <Siren aria-hidden className="size-4 shrink-0 text-electric-300" />
                  <p className="leading-snug">
                    Fastest path: call{" "}
                    <a
                      href={phoneHref}
                      className="inline-flex min-h-11 items-center font-semibold text-electric-300 underline decoration-electric-300/40 underline-offset-4 transition-colors hover:text-electric-200 hover:decoration-electric-200"
                    >
                      {siteConfig.phone}
                    </a>{" "}
                    now. A dispatcher answers 24/7.
                  </p>
                </m.div>
              )}
            </AnimatePresence>
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id={fid("name")} label="Full name" error={errors.name}>
              {(describedBy, invalid) => (
                <input
                  id={fid("name")}
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={80}
                  value={values.name}
                  onChange={onText}
                  aria-describedby={describedBy}
                  aria-invalid={invalid || undefined}
                  className={inputClass}
                />
              )}
            </Field>
            <Field id={fid("phone")} label="Phone" error={errors.phone} hint="We call this number back.">
              {(describedBy, invalid) => (
                <input
                  id={fid("phone")}
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  placeholder={PHONE_PLACEHOLDER}
                  maxLength={40}
                  value={values.phone}
                  onChange={onText}
                  aria-describedby={describedBy}
                  aria-invalid={invalid || undefined}
                  className={inputClass}
                />
              )}
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id={fid("email")} label="Email" error={errors.email} optional hint="For the written estimate and photos.">
              {(describedBy, invalid) => (
                <input
                  id={fid("email")}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={120}
                  value={values.email}
                  onChange={onText}
                  aria-describedby={describedBy}
                  aria-invalid={invalid || undefined}
                  className={inputClass}
                />
              )}
            </Field>
            <Field id={fid("address")} label="Property address" error={errors.address} optional hint="Street and town helps us route the nearest crew.">
              {(describedBy, invalid) => (
                <input
                  id={fid("address")}
                  name="address"
                  type="text"
                  autoComplete="street-address"
                  maxLength={160}
                  value={values.address}
                  onChange={onText}
                  aria-describedby={describedBy}
                  aria-invalid={invalid || undefined}
                  className={inputClass}
                />
              )}
            </Field>
          </div>

          <Field id={fid("service")} label="What kind of damage?" error={errors.service}>
            {(describedBy, invalid) => (
              <div className="relative">
                <select
                  id={fid("service")}
                  name="service"
                  required
                  value={values.service}
                  onChange={onText}
                  aria-describedby={describedBy}
                  aria-invalid={invalid || undefined}
                  className={cn(inputClass, "appearance-none pr-11", values.service === "" && "text-ink-500")}
                >
                  <option value="" disabled>
                    Select the closest match
                  </option>
                  {services.map((service) => (
                    <option key={service.slug} value={service.slug}>
                      {service.name}
                    </option>
                  ))}
                  <option value={NOT_SURE_SERVICE}>Not sure / something else</option>
                </select>
                <ChevronDown
                  aria-hidden
                  className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-ink-500"
                />
              </div>
            )}
          </Field>

          <Field
            id={fid("message")}
            label="What happened?"
            error={errors.message}
            hint="Where the damage is, when it started, and whether the water or power is still on."
          >
            {(describedBy, invalid) => (
              <textarea
                id={fid("message")}
                name="message"
                required
                rows={5}
                minLength={10}
                maxLength={2000}
                value={values.message}
                onChange={onText}
                aria-describedby={describedBy}
                aria-invalid={invalid || undefined}
                className={cn(inputClass, "h-auto min-h-[8.5rem] resize-y py-3 leading-relaxed")}
              />
            )}
          </Field>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={fid("consent")}
              className="flex min-h-11 cursor-pointer items-start gap-3 py-2.5 text-sm leading-snug text-ink-700"
            >
              <input
                id={fid("consent")}
                name="consent"
                type="checkbox"
                checked={values.consent}
                onChange={(e) => update("consent", e.target.checked)}
                aria-describedby={errors.consent ? `${fid("consent")}-error` : undefined}
                aria-invalid={errors.consent ? true : undefined}
                className="mt-0.5 size-5 shrink-0 cursor-pointer rounded border-ink-900/30 accent-royal-600"
              />
              <span>OK to contact me by phone or text about this request.</span>
            </label>
            {errors.consent && (
              <p id={`${fid("consent")}-error`} className="pl-8 text-[13px] font-medium text-red-600">
                {errors.consent}
              </p>
            )}
          </div>

          {banner && (
            <div
              ref={bannerRef}
              tabIndex={-1}
              role="alert"
              className={cn(
                "rounded-2xl px-4 py-3 text-sm font-medium",
                status === "error" ? "bg-red-50 text-red-700 ring-1 ring-red-200" : "bg-ice-100 text-ink-900 ring-1 ring-ink-900/10",
              )}
            >
              {banner}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* aria-disabled rather than disabled: focus stays on the button while sending; onSubmit guards re-entry. */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              aria-disabled={submitting}
              className="w-full aria-disabled:opacity-60 sm:w-auto"
            >
              {submitting ? (
                <>
                  <LoaderCircle aria-hidden className="size-5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send request"
              )}
            </Button>
            <p className="text-[13px] leading-snug text-ink-500">
              Same-day reply. Emergencies: call {siteConfig.phone}.
            </p>
          </div>
        </div>
      </form>
    </>
  );
}
