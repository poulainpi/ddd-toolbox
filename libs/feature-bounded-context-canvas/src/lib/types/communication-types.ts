import { Cloud, Cog, Monitor, User, type LucideIcon } from 'lucide-react'
import { TLSectionBaseProps } from '../shapes/abstract-section-shape-util'

export type MessageType = 'command' | 'event' | 'query'
export type CollaboratorType = 'bounded-context' | 'external-system' | 'frontend' | 'direct-user-interaction'
export type RelationshipType = 'CF' | 'OHS' | 'ACL' | 'PNR' | 'SK' | 'CUS' | 'SUP'

export type CommunicationMessage = {
  id: string
  label: string
  type: MessageType
}

export type Communication = {
  id: string
  collaboratorName: string
  collaboratorType: CollaboratorType
  leftRelationshipType?: RelationshipType
  rightRelationshipType?: RelationshipType
  messages: CommunicationMessage[]
}

export type CommunicationSectionProps = TLSectionBaseProps & {
  communications: Communication[]
}

export const RELATIONSHIP_TYPES: RelationshipType[] = ['CF', 'OHS', 'ACL', 'PNR', 'SK', 'CUS', 'SUP']

export const RELATIONSHIP_DESCRIPTIONS: Record<RelationshipType, string> = {
  CF: 'Conformist: The downstream team conforms to the upstream model',
  OHS: 'Open Host Service: The upstream provides a well-defined open protocol',
  ACL: 'Anti-Corruption Layer: Translates between models to protect the downstream',
  PNR: 'Partnership: Both teams cooperate on the interface',
  SK: 'Shared Kernel: A subset of the domain model is shared',
  CUS: 'Customer: The downstream team defines requirements for the upstream',
  SUP: 'Supplier: The upstream team fulfills requirements from the downstream',
}

export const COLLABORATOR_TYPES: CollaboratorType[] = [
  'bounded-context',
  'external-system',
  'frontend',
  'direct-user-interaction',
]

export const COLLABORATOR_ICONS: Record<CollaboratorType, LucideIcon> = {
  'bounded-context': Cloud,
  'external-system': Cog,
  frontend: Monitor,
  'direct-user-interaction': User,
}

export const COLLABORATOR_TYPE_LABELS: Record<CollaboratorType, string> = {
  'bounded-context': 'Bounded Context',
  'external-system': 'External System',
  frontend: 'Frontend',
  'direct-user-interaction': 'Direct User',
}

export const MESSAGE_TYPE_COLORS: Record<MessageType, string> = {
  command: 'bg-blue-100 text-blue-800',
  event: 'bg-orange-100 text-orange-800',
  query: 'bg-green-100 text-green-800',
}
