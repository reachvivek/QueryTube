import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";
import prisma from "@/lib/db";
import nodemailer from "nodemailer";

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET!,
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
  },
  user: {
    // Only allow 1 active session per user
    additionalFields: {},
  },
  plugins: [
    magicLink({
      expiresIn: 60 * 15, // 15 minutes
      sendMagicLink: async ({ email, url }) => {
        console.log("[Magic Link] Sending to:", email);
        console.log("[Magic Link] Full URL:", url);

        const transport = nodemailer.createTransport({
          host: process.env.EMAIL_SERVER_HOST,
          port: Number(process.env.EMAIL_SERVER_PORT),
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        });

        try {
          await transport.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Sign in to QueryTube",
            html: `
            <!DOCTYPE html>
            <html>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 40px 0;">
                    <table role="presentation" style="width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                      <tr>
                        <td style="padding: 40px; text-align: center; border-bottom: 1px solid #e5e7eb;">
                          <h1 style="margin: 0; font-size: 32px; font-weight: 700;">
                            <span style="color: #000000;">Query</span><span style="color: #dc2626;">Tube</span>
                          </h1>
                          <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 14px;">Turn YouTube Videos into AI-Powered Q&A</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 40px; text-align: center;">
                          <h2 style="margin: 0 0 16px 0; font-size: 24px; color: #111827;">Sign in to Your Account</h2>
                          <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px;">Click the button below to securely sign in to QueryTube.</p>
                          <a href="${url}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                            Sign in to QueryTube
                          </a>
                          <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px;">This link will expire in 15 minutes.</p>
                          <p style="margin: 16px 0 0 0; color: #6b7280; font-size: 12px;">If the button doesn't work, copy and paste this link:<br/><span style="word-break: break-all;">${url}</span></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `,
          });
          console.log("[Magic Link] ✅ Email sent successfully to:", email);
        } catch (error) {
          console.error("[Magic Link] ❌ Failed to send email:", error);
          throw error;
        }
      },
    }),
  ],
});

// Helper functions for API routes
export async function getCurrentUser() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  // Convert cookies to header string format
  const cookieHeader = cookieStore.getAll()
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join('; ');

  const session = await auth.api.getSession({
    headers: new Headers({
      cookie: cookieHeader,
    }),
  });

  // Invalidate old sessions for this user (keep only most recent session)
  if (session?.session) {
    try {
      const allSessions = await prisma.session.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
      });

      if (allSessions.length > 1) {
        const sessionsToDelete = allSessions.slice(1);
        await prisma.session.deleteMany({
          where: {
            id: { in: sessionsToDelete.map(s => s.id) },
          },
        });
        console.log(`[Auth] Cleaned up ${sessionsToDelete.length} old sessions for user:`, session.user.email);
      }
    } catch (error) {
      console.error("[Auth] Failed to clean up old sessions:", error);
    }
  }

  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
