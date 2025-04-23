
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { Twilio } from "npm:twilio@4.23.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const twilio = new Twilio(
  Deno.env.get("TWILIO_ACCOUNT_SID"),
  Deno.env.get("TWILIO_AUTH_TOKEN")
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  from?: string;
  whatsapp?: boolean;
  phone?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: EmailPayload = await req.json();
    const { to, subject, html, from = "Notificaciones RRHH <onboarding@resend.dev>", whatsapp = false, phone } = payload;

    if (!to || !subject || !html) {
      throw new Error("Faltan campos obligatorios: to, subject, html");
    }

    console.log(`Enviando email a ${to} con asunto "${subject}"`);

    const emailResponse = await resend.emails.send({
      from,
      to: [to],
      subject,
      html,
    });

    console.log("Email enviado:", emailResponse);

    // Si se solicita envío por WhatsApp y hay un número de teléfono
    if (whatsapp && phone) {
      try {
        console.log(`Enviando WhatsApp a ${phone}`);
        
        // Convertir HTML a texto plano simple
        const plainText = html.replace(/<[^>]*>/g, '')
                            .replace(/&nbsp;/g, ' ')
                            .replace(/\s+/g, ' ')
                            .trim();

        const whatsappResponse = await twilio.messages.create({
          body: `${subject}\n\n${plainText}`,
          from: `whatsapp:${Deno.env.get("TWILIO_WHATSAPP_NUMBER")}`,
          to: `whatsapp:${phone}`
        });

        console.log("WhatsApp enviado:", whatsappResponse.sid);
      } catch (whatsappError) {
        console.error("Error al enviar WhatsApp:", whatsappError);
        // No lanzamos el error para que no afecte la respuesta del email
      }
    }

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error en la función send-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
