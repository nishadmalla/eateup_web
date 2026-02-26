import Link from "next/link";

interface RestaurantCardProps {
    id: string;
    name: string;
    address: string;
    description?: string;
    imageUrl?: string;
}

export default function RestaurantCard({ id, name, address, description, imageUrl }: RestaurantCardProps) {
    return (
        <Link 
            href={`/restaurant/${id}`} 
            className="group block bg-[#0f151d] border border-slate-800/60 rounded-2xl overflow-hidden hover:border-slate-600 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_-5px_rgba(30,58,138,0.2)] relative"
        >
            {/* Image Block */}
            <div className="w-full h-56 bg-slate-900 relative overflow-hidden">
                {imageUrl ? (
                    <img 
                        src={`http://localhost:5050${imageUrl}`} 
                        alt={name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 saturate-50 group-hover:saturate-100"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                        No Image
                    </div>
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f151d] via-transparent to-transparent"></div>
            </div>

            {/* Details Block */}
            <div className="p-6 relative">
                <h2 className="text-xl font-medium text-slate-100 tracking-wide mb-1 group-hover:text-blue-400 transition-colors">{name}</h2>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">{address}</p>
                
                {description && (
                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
        </Link>
    );
}