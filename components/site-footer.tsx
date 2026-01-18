import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Brand Section - Compact on mobile */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            <span className="text-black">Query</span>
            <span className="text-red-600">Tube</span>
          </h2>
          <p className="text-sm text-gray-700 font-medium mb-1">
            Videos hide knowledge. We unlock it.
          </p>
          <p className="text-xs text-gray-600 mb-4">
            Timestamp-grounded answers. No hallucinations.
          </p>

          {/* Footer CTA - More compact on mobile */}
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-gray-700 hover:underline decoration-2 underline-offset-4 transition-all group"
          >
            <span className="hidden sm:inline">Start asking smarter questions from videos</span>
            <span className="sm:hidden">Start asking smarter questions</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </div>

        {/* Navigation Links - 2 cols on mobile, 3 cols on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8 max-w-4xl">
          {/* Product Column */}
          <div>
            <h3 className="text-sm font-semibold text-black mb-3">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Docs
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-sm font-semibold text-black mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-black transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-600 hover:text-black transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column - Compact */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-sm font-semibold text-black mb-3">Legal</h3>
            <ul className="flex sm:flex-col gap-4 sm:gap-2 sm:space-y-0">
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>© 2026 QueryTube · Built by Vivek Kumar Singh</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
