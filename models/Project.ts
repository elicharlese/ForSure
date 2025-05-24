import mongoose, { Document, Schema } from 'mongoose'

export interface IProject extends Document {
  _id: string
  name: string
  type: string
  framework: string
  languages: string[]
  description: string
  industry: string
  stage: string
  teamSize: string
  timeline: string
  goals: string[]
  owner: mongoose.Types.ObjectId
  collaborators: mongoose.Types.ObjectId[]
  fileStructure: any
  forSureFiles: any[]
  tags: string[]
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  lastAccessedAt: Date
  version: number
  versions: any[]
}

const ProjectSchema = new Schema<IProject>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
  },
  framework: {
    type: String,
    required: true,
  },
  languages: [{
    type: String,
    required: true,
  }],
  description: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  stage: {
    type: String,
    required: true,
  },
  teamSize: {
    type: String,
    required: true,
  },
  timeline: {
    type: String,
    required: true,
  },
  goals: [{
    type: String,
    required: true,
  }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  collaborators: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  fileStructure: {
    type: Schema.Types.Mixed,
    default: { name: 'root', type: 'directory', children: [] },
  },
  forSureFiles: [{
    name: String,
    content: String,
    isActive: Boolean,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  }],
  tags: [{
    type: String,
    trim: true,
  }],
  isPublic: {
    type: Boolean,
    default: false,
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now,
  },
  version: {
    type: Number,
    default: 1,
  },
  versions: [{
    version: Number,
    fileStructure: Schema.Types.Mixed,
    forSureFiles: Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    description: String,
  }],
}, {
  timestamps: true,
})

// Create indexes
ProjectSchema.index({ owner: 1, createdAt: -1 })
ProjectSchema.index({ collaborators: 1 })
ProjectSchema.index({ tags: 1 })
ProjectSchema.index({ isPublic: 1, createdAt: -1 })
ProjectSchema.index({ name: 'text', description: 'text' })

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)