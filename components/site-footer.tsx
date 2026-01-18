import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">
              <span className="text-black">Query</span>
              <span className="text-red-600">Tube</span>
            </h1>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">Videos hide knowledge. We unlock it.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <Link href="/about" className="hover:text-black transition-colors">
              About
            </Link>
            <Link href="/pricing" className="hover:text-black transition-colors">
              Pricing
            </Link>
            <Link href="/docs" className="hover:text-black transition-colors">
              Docs
            </Link>
            <Link href="/faq" className="hover:text-black transition-colors">
              FAQ
            </Link>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500">
          © 2026 QueryTube. Built by Vivek Kumar Singh.
        </div>
      </div>
    </footer>
  );
}
