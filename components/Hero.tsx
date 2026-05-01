import Link from "next/link"

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6">

      <img
        src="/shahhanov.jpg"
        className="w-40 h-40 object-cover rounded-full mb-6 border-4 border-white"
      />

      <h1 className="text-3xl md:text-5xl font-bold mb-4">
        Алматыда Мұхтар Шаханов атымен көше болуы керек пе?
      </h1>

      <p className="text-gray-300 max-w-xl mb-6">
        “Ұлтсыздану – ұлы қасірет.  
        Ұлтынан айырылған халық – тамырсыз ағаш.”
      </p>

      <Link href="/submit">
        <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl text-lg">
          Өтініш жіберу
        </button>
      </Link>
    </section>
  )
}
