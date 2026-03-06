export default function Loading() {
    return (
        <div className="flex h-[calc(100vh-8rem)] w-full items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#333] border-t-[#4ade80]"></div>
                <p className="text-gray-400 font-medium animate-pulse">Loading...</p>
            </div>
        </div>
    );
}
