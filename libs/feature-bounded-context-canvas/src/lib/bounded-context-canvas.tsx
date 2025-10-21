import './index.css'

interface BoundedContextCanvasProps {
  licenseKey?: string
  children?: React.ReactNode
}

export function BoundedContextCanvas({ licenseKey, children }: BoundedContextCanvasProps) {
  return (
    <div className="h-screen w-screen">
      <h1>Bounded Context Canvas</h1>
      {/* Canvas implementation will go here */}
    </div>
  )
}

export default BoundedContextCanvas
