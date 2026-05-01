"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Counter() {
  const [count, setCount] = useState(0)

  const fetchCount = async () => {
    const { count } = await supabase
      .from("petitions")
      .select("*", { count: "exact", head: true })

    setCount(count || 0)
  }

  useEffect(() => {
    fetchCount()

    const channel = supabase
      .channel("realtime petitions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "petitions" },
        () => {
          fetchCount()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="text-center py-10">
      <h2 className="text-2xl">
        Қолдаушылар саны:
      </h2>

      <p className="text-5xl font-bold text-red-500 mt-2">
        {count}
      </p>
    </div>
  )
}
