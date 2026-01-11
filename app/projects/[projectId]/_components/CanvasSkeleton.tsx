import { Skeleton } from "@/components/ui/skeleton";

const CanvasSkeleton = () => {
    return (
        <div className="w-full h-screen bg-gray-200 p-6 space-y-8">
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className="bg-white rounded-xl p-4 shadow space-y-4"
                >
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-[400px] w-full rounded-lg" />
                </div>
            ))}
        </div>
    );
};

export default CanvasSkeleton;
