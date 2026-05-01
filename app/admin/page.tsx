"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

function AdminPanel() {
  const [data, setData] = useState<any[]>([])
  const [search, setSearch] = useState("")

  const load = async () => {
    let query = supabase
      .from("petitions")
      .select("*")
      .order("created_at", { ascending: false })

    if (search) {
      query = query.ilike("full_name", `%${search}%`)
    }

    const { data, error } = await query
    if (!error) setData(data || [])
  }

  useEffect(() => {
    load()
  }, [search])

  const remove = async (id: string) => {
    if (!confirm("Бұл өтінішті өшіруге сенімдісіз бе?")) return

    const { error } = await supabase
      .from("petitions")
      .delete()
      .eq("id", id)

    if (!error) load()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">Админ панелі</h1>

          <input
            placeholder="Аты-жөні бойынша іздеу..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Аты-жөні</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Қала</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Талон</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Құжат</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Уақыты</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Әрекет</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {data.map((u) => (
                <tr key={u.id}>
                  <td className="px-6 py-4 font-medium">{u.full_name}</td>
                  <td className="px-6 py-4">{u.city}</td>
                  <td className="px-6 py-4 font-mono text-sm">
                    {u.ticket_number || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <a href={u.file_url} target="_blank" className="text-blue-600">
                      Ашу
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => remove(u.id)}
                      className="text-red-600"
                    >
                      Өшіру
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {data.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              Мәлімет жоқ
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminWrapper() {
  const [auth, setAuth] = useState(false)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("settings")
      .select("admin_password")
      .eq("id", 1)
      .single()

    if (error) {
      alert("Қате")
      setLoading(false)
      return
    }

    if (input === data.admin_password) {
      setAuth(true)
    } else {
      alert("Қате пароль")
    }

    setLoading(false)
  }

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl w-80 text-center shadow">
          <h2 className="text-xl mb-4">Кіру</h2>

          <input
            type="password"
            placeholder="Пароль"
            className="border p-2 w-full mb-4"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin()
            }}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-black text-white w-full py-2"
          >
            {loading ? "..." : "Кіру"}
          </button>
        </div>
      </div>
    )
  }

  return <AdminPanel />
}