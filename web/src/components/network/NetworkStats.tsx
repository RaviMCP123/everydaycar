type NetworkStat = {
  number: string;
  label: string;
};

type NetworkStatsProps = {
  stats?: NetworkStat[];
};

export function NetworkStats({ stats: items }: NetworkStatsProps = {}) {
  const list = (items ?? []).filter(
    (stat) => stat.number.trim() && stat.label.trim(),
  );

  if (list.length === 0) {
    return null;
  }

  return (
    <section className="!bg-[var(--color-primary-navy)] text-center text-white">
      <div className="container grid min-h-[180px] items-center gap-8 py-9 md:grid-cols-3">
        {list.map((stat) => (
          <div key={stat.label}>
            <p className="text-[clamp(26px,3vw,42px)] font-bold leading-none !text-[var(--color-yellow)]">
              {stat.number}
            </p>
            <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.08em] text-white/75 lg:text-[12px]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
