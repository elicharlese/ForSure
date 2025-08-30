import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Webhook to handle Vercel deployment notifications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Verify the webhook signature if needed
    const signature = request.headers.get('x-vercel-signature')
    // TODO: Implement signature verification for production

    const { type, data } = body

    switch (type) {
      case 'deployment.created':
        await handleDeploymentCreated(data)
        break
      case 'deployment.ready':
        await handleDeploymentReady(data)
        break
      case 'deployment.error':
        await handleDeploymentError(data)
        break
      default:
        console.log(`Unknown webhook type: ${type}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleDeploymentCreated(data: any) {
  console.log('Deployment created:', data.url)

  // Log deployment event
  await supabaseAdmin.from('deployment_logs').insert({
    deployment_id: data.id,
    url: data.url,
    status: 'created',
    created_at: new Date().toISOString(),
  })
}

async function handleDeploymentReady(data: any) {
  console.log('Deployment ready:', data.url)

  // Update deployment status
  await supabaseAdmin
    .from('deployment_logs')
    .update({
      status: 'ready',
      ready_at: new Date().toISOString(),
    })
    .eq('deployment_id', data.id)

  // Notify relevant users
  await notifyDeploymentReady(data)
}

async function handleDeploymentError(data: any) {
  console.error('Deployment error:', data.url, data.error)

  // Update deployment status
  await supabaseAdmin
    .from('deployment_logs')
    .update({
      status: 'error',
      error_message: data.error,
      error_at: new Date().toISOString(),
    })
    .eq('deployment_id', data.id)

  // Notify relevant users
  await notifyDeploymentError(data)
}

async function notifyDeploymentReady(data: any) {
  // Get admin users to notify
  const { data: admins } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('role', 'admin')

  if (admins) {
    const notifications = admins.map(admin => ({
      user_id: admin.id,
      type: 'system',
      title: 'Deployment Ready',
      content: `Deployment ${data.url} is now ready`,
      read: false,
      created_at: new Date().toISOString(),
    }))

    await supabaseAdmin.from('notifications').insert(notifications)
  }
}

async function notifyDeploymentError(data: any) {
  // Get admin users to notify
  const { data: admins } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('role', 'admin')

  if (admins) {
    const notifications = admins.map(admin => ({
      user_id: admin.id,
      type: 'system',
      title: 'Deployment Error',
      content: `Deployment ${data.url} failed: ${data.error}`,
      read: false,
      created_at: new Date().toISOString(),
    }))

    await supabaseAdmin.from('notifications').insert(notifications)
  }
}
