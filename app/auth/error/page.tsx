import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthErrorPage({
    searchParams,
}: {
    searchParams: { message: string };
}) {
    const errorMessage = searchParams.message || 'An authentication error occurred';

    return (
        <div className="container max-w-md min-h-screen flex items-center justify-center p-4">
            <div className="w-full space-y-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Authentication Error</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
                
                <div className="flex justify-center">
                    <Button asChild>
                        <Link href="/auth/login">
                            Return to Login
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}