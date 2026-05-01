"use client"

export default function CopyText() {
  const text = `Алматы қаласы әкімдігіне

Мен, Қазақстан азаматы ретінде, Мұхтар Шахановтың есімін Алматы қаласындағы бір көшеге беруіңізді сұраймын.

Бұл – ұлттық рух пен тарихи әділеттіліктің белгісі болар еді.`

  return (
    <div className="max-w-xl mx-auto text-center py-10">
      <p className="mb-4 whitespace-pre-line text-gray-300">
        {text}
      </p>

      <button
        onClick={() => navigator.clipboard.writeText(text)}
        className="bg-white text-black px-4 py-2 rounded-lg"
      >
        Мәтінді көшіру
      </button>
    </div>
  )
}
