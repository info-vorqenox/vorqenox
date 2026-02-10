export function AdSlot({
  position,
}: {
  position: "top" | "middle" | "bottom"
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-4">
      <div className="flex items-center justify-center rounded-xl border border-dashed border-primary/20 bg-card/50 p-6">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-primary/40">
            Advertisement
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground/50">
            {position} ad slot - 728x90
          </p>
        </div>
      </div>
    </div>
  )
}
