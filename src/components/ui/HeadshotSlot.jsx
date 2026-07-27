import pfp from '../../assets/pfp.jpeg';

export default function HeadshotSlot() {
  return (
    <div className="aspect-square w-full max-w-[220px] self-end overflow-hidden border border-base-border bg-base-surface/30">
      <img
        src={pfp}
        alt="Abdulla Alasmawi"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
