import { ContactInfoItem } from "@/src/components/contact/ContactInfoItem";
import { Icon } from "@/src/components/ui/Icon";
import { getLocalizedText } from "@/lib/cms/content";
import type { PageDetail } from "@/lib/api/types";
import type { ContactStructuredContent } from "@/lib/cms/parse-contact-content";

type ContactInfoCardProps = {
  page: PageDetail;
  structured?: ContactStructuredContent | null;
};

export function ContactInfoCard({ page, structured = null }: ContactInfoCardProps) {
  const phone =
    structured?.infoPhone?.trim() || page.phone?.trim();
  const email =
    structured?.infoEmail?.trim() || page.email?.trim();
  const address =
    structured?.infoAddress?.trim() ||
    (page.address ? getLocalizedText(page.address).trim() : "");
  const phoneLabel = structured?.infoPhoneLabel?.trim() || "Primary Inbound Number";
  const hoursLine1 = structured?.infoHoursLine1?.trim() || "";
  const hoursLine2 = structured?.infoHoursLine2?.trim() || "";
  const hasHours = Boolean(hoursLine1 || hoursLine2);

  const phoneDisplay =
    phone && phone.length === 10
      ? phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")
      : phone;

  if (!phone && !email && !address) {
    return null;
  }

  return (
    <aside className="h-auto rounded-[8px] border !border-[#e3eaf2] bg-white px-7 py-[30px] shadow-[0_12px_30px_rgba(7,29,51,0.07)] md:h-[296px] flex flex-col gap-5">
      {phone ? (
        <div className="flex flex-col gap-2">
          <h2 className="flex items-center gap-2.5 text-[clamp(28px,3vw,34px)] font-bold leading-none tracking-[-0.02em] !text-[var(--color-primary-navy)]">
            <Icon name="phone" className="h-[22px] w-[22px] !text-[#247dca]" />
            {phoneDisplay}
          </h2>
          <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.04em] !text-[#667085]">
            {phoneLabel}
          </p>
        </div>
      ) : null}

      <div className={`flex flex-col gap-[22px] ${phone ? "mt-8" : ""}`}>
        {email ? (
          <ContactInfoItem icon="mail" title="Email Us">
            <a href={`mailto:${email}`} className="text-[13px] !text-[#247dca]">
              {email}
            </a>
          </ContactInfoItem>
        ) : null}
        {address ? (
          <ContactInfoItem icon="location" title="Head Office">
            {address}
          </ContactInfoItem>
        ) : null}
        {hasHours ? (
          <ContactInfoItem icon="clock" title="Business Hours">
            <div className="space-y-0.5">
              {hoursLine1 ? <p>{hoursLine1}</p> : null}
              {hoursLine2 ? <p>{hoursLine2}</p> : null}
            </div>
          </ContactInfoItem>
        ) : null}
      </div>
    </aside>
  );
}
