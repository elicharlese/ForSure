import mongoose, { Document, Schema } from 'mongoose'

export interface ITeam extends Document {
  _id: string
  name: string
  description: string
  owner: mongoose.Types.ObjectId
  members: {
    user: mongoose.Types.ObjectId
    role: 'admin' | 'member'
    joinedAt: Date
  }[]
  projects: mongoose.Types.ObjectId[]
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

const TeamSchema = new Schema<ITeam>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project',
  }],
  isPublic: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

// Create indexes
TeamSchema.index({ owner: 1 })
TeamSchema.index({ 'members.user': 1 })
TeamSchema.index({ name: 'text', description: 'text' })

export default mongoose.models.Team || mongoose.model<ITeam>('Team', TeamSchema)