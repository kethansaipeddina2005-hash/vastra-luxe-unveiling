import logoAsset from "@/assets/vastralogo.asset.json";

export function VastraLogo({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <img
      src={logoAsset.url}
      alt="Vastra Luxe"
      className={className}
      style={{ filter: "drop-shadow(0 2px 8px rgba(110,31,42,0.15))" }}
    />
  );
}
