import {resend} from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponce } from "@/types/ApiResponce";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponce>{
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Next Advance Auth Project Verification Code',
            react: VerificationEmail({username: username, otp: verifyCode}),
            // react: <Email url="https://example.com" />,
          });

        return{success: true, message: "Verification email send successfully"}
    } catch (emailError) {
        console.error("Error sending verification email", emailError);
        return{success: false, message: "field to send verification email"}
    }
}


function EmailTemplate(arg0: { firstName: string; }): import("react").ReactNode {
    throw new Error("Function not implemented.");
}
  