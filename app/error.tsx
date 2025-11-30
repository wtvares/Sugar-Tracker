'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="section max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
        <p className="text-warmgray-600 mb-4">{error.message}</p>
        <button
          onClick={() => reset()}
          className="btn btn-primary"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
