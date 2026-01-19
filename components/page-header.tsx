import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  backLink?: string;
  backText?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
}

export default function PageHeader({
  title,
  description,
  icon: Icon,
  backLink,
  backText,
  action,
}: PageHeaderProps) {
  return (
    <div className="hidden lg:block bg-white border-b border-gray-200 px-4 sm:px-8 py-6 lg:px-8">
      {/* Back Link */}
      {backLink && backText && (
        <Link
          href={backLink}
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-black transition-colors mb-4 lg:ml-0 ml-12"
        >
          <ArrowLeft className="w-4 h-4" />
          {backText}
        </Link>
      )}

      {/* Title Section - Added pl-20 lg:pl-0 for mobile hamburger menu space */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pl-20 lg:pl-0 pr-4 sm:pr-8">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {Icon && (
            <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="text-gray-600 mt-1.5 text-sm max-w-2xl">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        {action && (
          <Button
            onClick={action.onClick}
            className="bg-black text-white hover:bg-gray-800 flex-shrink-0 w-full sm:w-auto"
          >
            {action.icon && <action.icon className="w-4 h-4 mr-2" />}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}
