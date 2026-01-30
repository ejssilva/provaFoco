import { trpc } from "@/lib/trpc";
import { useEffect, useRef } from "react";

interface AdDisplayProps {
  placement: string;
  className?: string;
}

export default function AdDisplay({ placement, className }: AdDisplayProps) {
  const { data: ads } = trpc.ads.getByPlacement.useQuery(placement);
  const initialized = useRef(false);

  useEffect(() => {
    if (ads && ads.length > 0 && !initialized.current) {
      try {
        // Tenta inicializar o anúncio
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        initialized.current = true;
      } catch (e) {
        console.error("AdSense push error:", e);
      }
    }
  }, [ads]);

  if (!ads || ads.length === 0) return null;

  // Renderiza o primeiro anúncio ativo para esta posição
  const ad = ads[0];

  return (
    <div className={`ad-container flex justify-center my-4 ${className || ""}`}>
      <div 
        className="w-full max-w-[728px] overflow-hidden"
        dangerouslySetInnerHTML={{ __html: ad.adCode }} 
      />
    </div>
  );
}
