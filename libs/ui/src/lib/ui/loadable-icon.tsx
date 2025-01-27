import { memo } from 'react'
import { LucideProps } from 'lucide-react'
import { DynamicIcon, IconName } from 'lucide-react/dynamic'

interface LoadableIconProps extends Omit<LucideProps, 'ref'> {
  name: IconName
}

export const LoadableIcon = memo(({ name, ...props }: LoadableIconProps) => {
  return <DynamicIcon name={name} {...props} />
})
