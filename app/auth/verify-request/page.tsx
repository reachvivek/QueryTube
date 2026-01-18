import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-black">Query</span>
              <span className="text-red-600">Tube</span>
            </h1>
          </div>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-gray-700" />
            </div>
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription className="text-base">
            We've sent you a magic link to sign in
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            Click the link in the email to sign in to your account.
            The link will expire in 24 hours.
          </p>
          <p className="text-sm text-gray-600">
            If you don't see the email, check your spam folder.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
