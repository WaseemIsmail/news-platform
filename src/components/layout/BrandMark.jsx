import Image from "next/image";

export default function BrandMark({ className = "" }) {
  return (
    <span
      className={`relative block shrink-0 overflow-hidden bg-slate-950 ${className}`}
      aria-hidden="true"
    >
      <Image
        src="/contextra-app-icon-v2-192.png"
        alt=""
        fill
        sizes="48px"
        className="object-cover"
      />
    </span>
  );
}
