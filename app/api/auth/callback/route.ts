import type { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/app'

    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('Auth callback error:', error)
        return redirect(`/login?error=${encodeURIComponent(error.message)}`)
      }

      if (data.user) {
        // Create or update user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: data.user.email!,
            name:
              data.user.user_metadata?.full_name ||
              data.user.email!.split('@')[0],
            avatar_url: data.user.user_metadata?.avatar_url,
            updated_at: new Date().toISOString(),
            is_verified: true,
          })
          .select()

        if (profileError) {
          console.error('Profile creation error:', profileError)
          // Continue even if profile creation fails
        }
      }
    }

    return redirect(next)
  } catch (error) {
    console.error('Auth callback error:', error)
    return redirect('/login?error=Authentication failed')
  }
}
