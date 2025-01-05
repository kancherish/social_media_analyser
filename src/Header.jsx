function Header() {
  return (
    <header className="relative w-full bg-gray-800 border-b border-gray-700 py-4 shadow-lg">
      <div className="container mx-auto px-4">
        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          SOCIAL MEDIA ANALYZER
        </h1>
      </div>
      {/* Decorative bottom border with gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-purple-600"></div>
    </header>
  )
}

export default Header