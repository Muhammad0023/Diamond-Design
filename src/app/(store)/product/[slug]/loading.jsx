export default function Loading() {
  return (
    <div className="min-h-screen bg-white mt-20 lg:mt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 w-full">
            <div className="w-full aspect-[3/4] bg-gray-200 animate-pulse rounded-sm mb-4" />
            <div className="grid grid-cols-5 gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-sm" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 space-y-6">
            <div className="h-10 bg-gray-200 animate-pulse rounded-full w-3/4" />
            <div className="h-8 bg-gray-200 animate-pulse rounded-full w-1/4" />
            <div className="h-5 bg-gray-200 animate-pulse rounded-full w-1/5" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 animate-pulse rounded-full w-full" />
              <div className="h-4 bg-gray-200 animate-pulse rounded-full w-5/6" />
              <div className="h-4 bg-gray-200 animate-pulse rounded-full w-4/6" />
            </div>
            <div className="flex gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-11 h-11 bg-gray-200 animate-pulse rounded-full" />
              ))}
            </div>
            <div className="space-y-4 pt-2">
              <div className="h-16 bg-gray-200 animate-pulse rounded-full w-full" />
              <div className="h-16 bg-gray-200 animate-pulse rounded-full w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
