import { useContent } from '../context/ContentContext';

export default function TickerRibbon() {
  const { content } = useContent();

  const items = [...content.ticker.items, ...content.ticker.items, ...content.ticker.items];

  return (
    <section className="relative overflow-hidden py-3.5 border-y border-white/5"
      style={{ background: 'linear-gradient(135deg, var(--clr-fire-maroon), var(--clr-fire-crimson))' }}
    >
      <div
        className="flex w-max"
        style={{
          animation: `ticker ${content.ticker.speed}s linear infinite`,
        }}
      >
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center shrink-0 px-6">
            <span className="font-cond text-[13px] tracking-[2px] uppercase font-bold text-white/90 whitespace-nowrap">
              {item}
            </span>
            <span className="w-1 h-1 rounded-full bg-fire-gold ml-6 shrink-0" />
          </div>
        ))}
      </div>
    </section>
  );
}
