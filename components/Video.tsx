export default function Video() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <iframe
        className="w-full h-[400px] rounded-xl"
        src="https://www.youtube.com/embed/VIDEO_ID"
        title="Инструкция"
      />
    </div>
  )
}
