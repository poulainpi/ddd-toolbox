import { useChangeTracking } from '../hooks/use-change-tracking'
import { changeHappened } from '../hooks/use-document-persistence'

export function OnMountListener() {
  useChangeTracking(changeHappened)
  return null
}
