"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function Home() {
  const [count, setCount] = useState(0)
  const [copied, setCopied] = useState(false)

  // 1. Дауыс санау логикасы
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
        () => fetchCount()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const petitionText = `ҚР Президенті
Қасым-Жомарт Тоқаев мырзаға,

Қалмақанұлы Мейрманнан

Мекенжайы:

ӨТІНІШ

Құрметті Президент мырза!
Қазіргі таңда Алматы қаласындағы Розыбакиев көшесінің атауын Мұхтар Шаханов есімімен атау туралы бастама қоғамда кеңінен қолдау тауып, әлеуметтік желілерде қызу талқылануда.
Республикалық маңызы бар қалаларда көше атауын беру Қазақстан Республикасының «Әкімшілік-аумақтық құрылысы туралы» Заңының 14-1, 14-2-баптарына және 2023 жылғы №211 бұйрыққа сәйкес, тиісті аумақ халқының пікірін ескере отырып жүзеге асырылады.
Сонымен қатар, «Тіл туралы» Заңның 25-5-бабына сәйкес, аса көрнекті тұлғалардың есімін беру қайтыс болған күннен бастап кемінде бес жыл өткен соң ғана мүмкін. Алайда ерекше жағдай ретінде, ел тарихында Астана қаласының Нұр-Сұлтан болып өзгеруі және Алматыдағы Фурманов көшесінің Назарбаев атымен аталуы орын алған.
Осы тұрғыда , Мұхтар Шаханов мырзаның ел алдындағы еңбегі мұндай ерекше құрметке толық лайық деп есептейміз.
Мұхтар Шаханов — қазақ әдебиеті мен руханиятының ірі тұлғасы, ұлттық намыстың, мемлекеттік тілдің, тарихи әділеттің символы. Оның Желтоқсан оқиғасына саяси баға берілуіне қосқан үлесі, мемлекеттік тілді қорғаудағы табандылығы және ұлттық мүдде жолындағы қызметі халық жадында мәңгі сақталады.
Сондай-ақ, Алматы қаласының Әуезов ауданында Розыбакиев есімімен тағы бір көше бар. Бір адамның атымен бір қалада екі көшенің болуы заң талаптарына қайшы. Сондықтан орталықтағы Розыбакиев көшесінің атауын Мұхтар Шаханов есімімен өзгерту Розыбакиев есімін жоймайды, керісінше заң талаптарының сақталуын қамтамасыз етеді.
Осыған байланысты, Сізден Алматы қаласындағы халық сұрап отырған Розыбакиев көшесінің атауын Мұхтар Шаханов есімімен атау мәселесін ерекше жағдай ретінде қарастырып, халықтың сұранысын қанағаттандыруыңызды сұраймын.`

  const handleCopy = () => {
    navigator.clipboard.writeText(petitionText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans scroll-smooth">
      
      {/* --- HERO SECTION --- */}
      <section className="bg-white border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-50/20"></div>
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-24 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
              Мұхтар Шаханов атындағы <span className="text-blue-600">көше</span>
            </h1>
            
            <div className="bg-white/80 backdrop-blur-sm border-l-4 border-blue-600 p-6 rounded-r-2xl mb-8 italic text-gray-800 shadow-md">
              <p className="font-semibold text-blue-700 mb-2 uppercase tracking-wide text-xs text-nowrap">"Төрт ана" өлеңінен</p>
              <div className="text-sm md:text-base space-y-1">
                <p>Тағдырыңды тамырсыздық індетінен қалқала,</p>
                <p>Мазмұн жоқта мазмұнсыздық шығады екен ортаға.</p>
                <p>...Болу керек құдіретті төрт ана:</p>
                <p className="font-bold text-gray-900 mt-2 text-blue-600">
                  Туған жері, Туған тілі, Туған дәстүрі, Туған тарихы!
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/submit" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg w-full sm:w-auto text-center">
                Қолдау білдіру ✊
              </Link>
              <a href="#how-to" className="px-8 py-4 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition-all w-full sm:w-auto text-center border border-gray-200">
                Нұсқаулықты көру
              </a>
            </div>
          </div>

          <div className="flex-1 w-full flex justify-center md:justify-end">
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl ring-8 ring-white">
              <img src="/shakhanov.jpg" alt="Мұхтар Шаханов" className="object-cover w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6">
                <p className="text-white font-bold text-2xl">Мұхтар Шаханов</p>
                <p className="text-gray-300 text-sm italic">Мұхтар Шаханов — қазақ ақыны, драматургі, қоғам қайраткері, Қазақстанның Еңбек Ері, Қазақстанның халық жазушысы және Қырғызстан халық ақыны.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- COUNTER SECTION (Жөнделген нұсқа) --- */}
      <section className="max-w-4xl mx-auto px-6 py-12 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center border border-blue-50">
          <h2 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-[0.2em]">Жиналған дауыс саны</h2>
          <div className="text-7xl md:text-9xl font-black text-blue-600 tabular-nums">
            {count.toLocaleString()}
          </div>
          <div className="mt-4 inline-flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-full text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            REAL-TIME
          </div>
        </div>
      </section>

      {/* --- VIDEO & INSTRUCTIONS --- */}
      <section id="how-to" className="bg-gray-900 py-24 text-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
              Бейне-нұсқаулық:<br/>
              <span className="text-blue-400 font-light italic">Қалай дауыс береміз?</span>
            </h2>

            <div className="space-y-6 mb-10 text-left">
              <div className="flex items-start gap-4 bg-white/5 p-5 rounded-2xl border border-white/10">
                <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                <div className="w-full">
                  <p className="text-gray-300 font-medium mb-3">Төмендегі батырманы басып, арыз мәтінін көшіріп алыңыз және оны e-Otinish-ке жіберіңіз.</p>
                  
                  <button
                    onClick={handleCopy}
                    className={`flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 text-sm w-full sm:w-auto ${
                      copied ? "bg-green-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {copied ? "Мәтін көшірілді! ✅" : "Арыз мәтінін көшіру 📋"}
                  </button>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-white/5 p-5 rounded-2xl border border-white/10">
                <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                <p className="text-gray-300 font-medium text-left">Жіберілген соң берілетін ресми талонды (PDF немесе скриншот) сақтап алыңыз.</p>
              </div>

              <div className="flex items-start gap-4 bg-white/5 p-5 rounded-2xl border border-white/10">
                <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">3</div>
                <p className="text-gray-300 font-medium text-left">Сайттың басындағы "Қолдау білдіру" батырмасын басып, талонды бізге жүктеңіз.</p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex justify-center w-full">
            <div className="w-full max-w-[300px] aspect-[9/16] bg-black rounded-[2.5rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden relative">
              <video 
                src="/instruction.mp4" 
                controls 
                autoPlay 
                muted 
                loop 
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t bg-white text-center text-gray-400 text-sm italic">
        © 2026 Meir Halyk Zangeri компаниясы. Барлық құқықтар қорғалған.
      </footer>
    </main>
  )
}