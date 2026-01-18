import Link from "next/link";
import { ArrowRight, Github, Linkedin, Twitter } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Brand Section - Compact on mobile */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">
              <span className="text-black">Query</span>
              <span className="text-red-600">Tube</span>
            </h2>
            <p className="text-sm text-gray-700 font-medium mb-1">
              Videos hide knowledge. We unlock it.
            </p>
            <p className="text-xs text-gray-600 mb-5">
              Timestamp-grounded answers. No hallucinations.
            </p>

            {/* Subtle divider before CTA */}
            <div className="w-12 h-px bg-gradient-to-r from-gray-300 to-transparent mb-4" />

            {/* Footer CTA - Mobile */}
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-gray-700 transition-all group"
            >
              <span className="group-hover:underline decoration-2 underline-offset-4 transition-all">Start asking smarter questions</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-all duration-300 ease-out" />
            </Link>
          </div>

          {/* Navigation Links - 2 cols on mobile */}
          <div className="grid grid-cols-2 gap-6 mb-6">
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

            {/* Legal Column */}
            <div className="col-span-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Legal</h3>
              <ul className="flex gap-4">
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

          {/* Bottom Bar - Mobile */}
          <div className="pt-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-500">
              <p>© 2026 QueryTube · Built by Vivek Kumar Singh</p>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="grid grid-cols-12 gap-12 mb-12">
            {/* Brand Section - Takes more space on desktop */}
            <div className="col-span-5">
              <h2 className="text-2xl font-bold mb-3">
                <span className="text-black">Query</span>
                <span className="text-red-600">Tube</span>
              </h2>
              <p className="text-base text-gray-700 font-medium mb-2">
                Videos hide knowledge. We unlock it.
              </p>
              <p className="text-sm text-gray-600 mb-8 max-w-md">
                Timestamp-grounded answers. No hallucinations.
              </p>

              {/* Footer CTA - Desktop */}
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 text-base font-medium text-black hover:text-gray-700 transition-all group"
              >
                <span className="group-hover:underline decoration-2 underline-offset-4 transition-all">Start asking smarter questions from videos</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-all duration-300 ease-out" />
              </Link>
            </div>

            {/* Navigation Links - 3 columns */}
            <div className="col-span-7 grid grid-cols-3 gap-8">
              {/* Product Column */}
              <div>
                <h3 className="text-sm font-semibold text-black mb-4">Product</h3>
                <ul className="space-y-3">
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
                <h3 className="text-sm font-semibold text-black mb-4">Company</h3>
                <ul className="space-y-3">
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

              {/* Legal Column */}
              <div>
                <h3 className="text-sm font-semibold text-black mb-4">Legal</h3>
                <ul className="space-y-3">
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
          </div>

          {/* Bottom Bar - Desktop */}
          <div className="pt-8 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              © 2026 QueryTube · Built by Vivek Kumar Singh
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/reachvivek/QueryTube"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-black transition-colors"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="https://linkedin.com/in/reachvivek"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-black transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link
                href="https://twitter.com/reachvivek"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-black transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
