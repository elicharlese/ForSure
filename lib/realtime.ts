import { supabase } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

export interface RealtimeMessage {
  id: string
  content: string
  user_id: string
  chat_room: string
  created_at: string
}

export interface RealtimeNotification {
  id: string
  user_id: string
  type: 'message' | 'project_update' | 'system'
  title: string
  content: string
  read: boolean
  created_at: string
}

export class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map()

  // Subscribe to chat messages in a specific room
  subscribeToChatRoom(roomId: string, onMessage: (message: RealtimeMessage) => void) {
    const channelName = `chat:${roomId}`
    
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_room=eq.${roomId}`
        },
        (payload) => {
          onMessage(payload.new as RealtimeMessage)
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  // Subscribe to user notifications
  subscribeToNotifications(userId: string, onNotification: (notification: RealtimeNotification) => void) {
    const channelName = `notifications:${userId}`
    
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          onNotification(payload.new as RealtimeNotification)
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  // Subscribe to project updates
  subscribeToProjectUpdates(projectId: string, onUpdate: (update: any) => void) {
    const channelName = `project:${projectId}`
    
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${projectId}`
        },
        (payload) => {
          onUpdate(payload.new)
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  // Send a chat message
  async sendChatMessage(roomId: string, content: string, userId: string) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        chat_room: roomId,
        content,
        user_id: userId,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to send message: ${error.message}`)
    }

    return data
  }

  // Send a notification
  async sendNotification(userId: string, type: string, title: string, content: string) {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        content,
        read: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to send notification: ${error.message}`)
    }

    return data
  }

  // Unsubscribe from a specific channel
  unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName)
    if (channel) {
      supabase.removeChannel(channel)
      this.channels.delete(channelName)
    }
  }

  // Unsubscribe from all channels
  unsubscribeAll() {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel)
    })
    this.channels.clear()
  }

  // Get the status of a channel
  getChannelStatus(channelName: string) {
    const channel = this.channels.get(channelName)
    return channel ? channel.state : 'not_subscribed'
  }

  // List all active channels
  getActiveChannels() {
    return Array.from(this.channels.keys())
  }
}

// Export a singleton instance
export const realtimeService = new RealtimeService()
