import Emittery from 'emittery'

export const NEW_DOCUMENT_CREATED = Symbol('newDocumentCreated')

export const events = new Emittery()
