console.log("P18 Home render:", new Date().toISOString())
export default function Home() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="text-4xl font-bold mb-3">Home</h1>
        <p className="text-gray-600">Minimal home; we default to /about.</p>
      </div>
    </section>
  )
}
