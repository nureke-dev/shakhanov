"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { extractTicketNumber } from "@/lib/utils"
import Link from "next/link"

const CITIES = [
  "Алматы", "Астана", "Шымкент", "Қарағанды", 
  "Ақтөбе", "Тараз", "Павлодар", "Өскемен", "Семей", "Атырау", "Ақтау", "Орал", "Қызылорда", "Қостанай", "Талдықорған"
]

export default function Submit() {
  const [name, setName] = useState("")
  const [city, setCity] = useState("Алматы")
  const [file, setFile] = useState<File | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file || !name) {
      alert("Барлық өрістерді толтырыңыз!")
      return
    }
    if (!agreed) {
      alert("Пайдаланушы келісімшартымен келісуіңіз қажет!")
      return
    }

    setLoading(true)

    try {
      const ticketNumber = extractTicketNumber(file.name)
      if (!ticketNumber) {
        alert("Файл атынан талон нөмірі табылмады. Дұрыс e-Otinish талонын жүктеңіз.")
        setLoading(false)
        return
      }

      const { data: existing } = await supabase
        .from("petitions")
        .select("id")
        .eq("ticket_number", ticketNumber)
        .limit(1)

      if (existing && existing.length > 0) {
        alert(`Бұл талон (№${ticketNumber}) бұрын тіркелген! Қайтадан дауыс беру мүмкін емес.`)
        setLoading(false)
        return
      }

      const cleanName = file.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "")
      const path = `uploads/${Date.now()}-${cleanName}`

      const { error: uploadError } = await supabase.storage
        .from("files")
        .upload(path, file)

      if (uploadError) throw new Error("Файл жүктеу қатесі")

      const { data } = supabase.storage.from("files").getPublicUrl(path)
      const fileUrl = data.publicUrl

      const { error: insertError } = await supabase
        .from("petitions")
        .insert({
          full_name: name,
          city,
          file_url: fileUrl,
          ticket_number: ticketNumber
        })

      if (insertError) throw new Error("Базаға жазу қатесі")

      setSuccess(true)
      setName("")
      setCity("Алматы")
      setFile(null)
      setAgreed(false)

    } catch (err: any) {
      console.error(err)
      alert(err.message || "Белгісіз қате шықты. Қайта көріңіз.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-xl p-10 text-center">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            ✓
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Рақмет!</h2>
          <p className="text-gray-600 mb-8">Сіздің дауысыңыз сәтті қабылданды. Еліміздің тарихына қосқан үлесіңізге алғыс білдіреміз.</p>
          <Link href="/" className="inline-block w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all">
            Басты бетке қайту
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <Link href="/" className="text-blue-600 hover:text-blue-800 mb-8 font-medium mr-auto max-w-2xl w-full">
        ← Артқа қайту
      </Link>
      
      <div className="bg-white max-w-2xl w-full rounded-3xl shadow-xl p-8 sm:p-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Өтініш тіркеу</h2>
        <p className="text-gray-500 mb-8">e-Otinish арқылы алған талоныңызды жүктеп, өз дауысыңызды растаңыз.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Толық Аты-жөніңіз</label>
            <input
              type="text"
              required
              placeholder="Мысалы: Серікұлы Нұрбек"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Тұратын қалаңыз</label>
            <select 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
              value={city} 
              onChange={(e) => setCity(e.target.value)}
            >
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">e-Otinish талоны (PDF, JPG, PNG)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-400 transition-colors bg-gray-50">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 px-2 py-1">
                    <span>Файлды таңдау</span>
                    <input 
                      id="file-upload" 
                      name="file-upload" 
                      type="file" 
                      className="sr-only"
                      accept=".pdf, image/jpeg, image/png"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">{file ? file.name : "Файл таңдалмаған"}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700 cursor-pointer">Пайдаланушы келісімшарты</label>
              <p className="text-gray-500">Мен өз мәліметтерімнің өңделуіне және дауыс санау процесіне қатысуына келісім беремін.</p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all`}
          >
            {loading ? "Жіберілуде..." : "Дауысты растау"}
          </button>
        </form>
      </div>
    </div>
  )
}