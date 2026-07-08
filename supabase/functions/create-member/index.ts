import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { email, full_name, phone, church_id, birth_date, gender, address, city, state, baptized_at, joined_at } = await req.json()

    if (!email || !full_name || !church_id) {
      return new Response(
        JSON.stringify({ success: false, error: "Email, nome e igreja são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
    let userId = users?.find(u => u.email === email)?.id

    if (!userId) {
      const { data, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        password: crypto.randomUUID(),
        user_metadata: { full_name },
      })
      if (createError) throw new Error(createError.message)
      userId = data.user.id

      const { error: profileError } = await supabaseAdmin.from("profiles").insert({
        id: userId,
        email,
        full_name,
        phone: phone || null,
      })
      if (profileError) throw profileError
    } else {
      await supabaseAdmin.from("profiles").update({
        full_name,
        phone: phone || null,
      }).eq("id", userId)
    }

    const { data: existingMember } = await supabaseAdmin
      .from("members")
      .select("id")
      .eq("user_id", userId)
      .eq("church_id", church_id)
      .maybeSingle()

    if (existingMember) {
      return new Response(
        JSON.stringify({ success: false, error: "Este usuário já é membro desta igreja." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const { data: existingCU } = await supabaseAdmin
      .from("church_users")
      .select("id")
      .eq("user_id", userId)
      .eq("church_id", church_id)
      .maybeSingle()

    if (!existingCU) {
      await supabaseAdmin.from("church_users").insert({
        church_id,
        user_id: userId,
        role: "member",
      })
    }

    const { data: member, error: memberError } = await supabaseAdmin
      .from("members")
      .insert({
        church_id,
        user_id: userId,
        birth_date: birth_date || null,
        gender: gender || null,
        address: address || null,
        city: city || null,
        state: state || null,
        baptized_at: baptized_at || null,
        joined_at: joined_at || null,
      })
      .select("id, user_id, is_active")
      .single()

    if (memberError) throw memberError

    return new Response(
      JSON.stringify({ success: true, member, user_id: userId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
