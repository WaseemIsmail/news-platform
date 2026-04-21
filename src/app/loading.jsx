export default function Loading() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-white px-6">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />

        {/* Text */}
        <p className="mt-4 text-sm text-gray-600">
          Loading content...
        </p>
      </div>
    </main>
  );
}