import { createPubSub } from 'graphql-yoga'

// Keep pubsub untyped for maximal flexibility across clients
export const pubSub = createPubSub()
