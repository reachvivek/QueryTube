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
    <div className="bg-white border-b border-gray-200 -mx-8 -mt-8 px-8 pt-6 pb-6 mb-8">
      {/* Back Link */}
      {backLink && backText && (
        <Link
          href={backLink}
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-black transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {backText}
        </Link>
      )}

      {/* Title Section */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {Icon && (
            <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-3xl font-bold text-black tracking-tight">
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
            className="bg-black text-white hover:bg-gray-800 flex-shrink-0"
          >
            {action.icon && <action.icon className="w-4 h-4 mr-2" />}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}
