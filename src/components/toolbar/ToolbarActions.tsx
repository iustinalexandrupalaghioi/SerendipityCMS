import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

interface ToolbarActionsProps {
  children: React.ReactNode
}

const ToolbarActions = ({ children }: ToolbarActionsProps) => {
  const [slot, setSlot] = useState<Element | null>(null)

  useEffect(() => {
    setSlot(document.getElementById("toolbar-slot"))
  }, [])

  if (!slot) return null
  return createPortal(children, slot)
}

export default ToolbarActions
