import { Activity } from "lucide-react";

export function Header() {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center justify-center p-3 bg-primary-500/10 rounded-2xl mb-6 ring-1 ring-primary-500/20">
        <Activity className="w-8 h-8 text-primary-500" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
        Uji Normalitas Data
      </h1>
      <p className="text-gray-400 max-w-2xl mx-auto text-lg">
        Lakukan uji normalitas data statistik secara cepat dan otomatis tanpa perlu software tambahan.
      </p>
    </div>
  );
}
