export default function SimpleMovieBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-6 gap-4 p-4">
        {[1, 2, 3, 4, 5, 6].map((col) => (
          <div key={col} className="flex flex-col gap-4">
            {[1, 2, 3, 4, 5].map((row) => (
              <div
                key={`${col}-${row}`}
                className={`aspect-[2/3] rounded-lg bg-white opacity-20 ${
                  col % 2 === 0 ? "animate-float-up" : "animate-float-down"
                }`}
                style={{
                  animationDelay: `${(col + row) * 0.5}s`,
                  animationDuration: `${20 + col * 2}s`,
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

