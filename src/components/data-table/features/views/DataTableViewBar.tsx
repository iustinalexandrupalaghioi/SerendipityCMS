import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChevronDownIcon,
  Trash2,
  Pencil,
  PlusIcon,
  CheckIcon,
  XIcon,
  SaveIcon,
  RotateCcw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useDataTableContext } from "../../DataTableContext"

// No props — everything comes from context.

export function TableViewsBar() {
  const { views: viewsApi } = useDataTableContext()
  const {
    views,
    activeView,
    hasChanges,
    switchView,
    saveChanges,
    discardChanges,
    saveAsView,
    deleteView,
    renameView,
  } = viewsApi

  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const [creatingNew, setCreatingNew] = useState(false)
  const [newName, setNewName] = useState("")
  const [open, setOpen] = useState(false)

  const handleRename = (id: string) => {
    if (renameValue.trim()) renameView(id, renameValue.trim())
    setRenamingId(null)
  }

  const handleSaveAs = () => {
    if (!newName.trim()) return
    saveAsView(newName.trim())
    setNewName("")
    setCreatingNew(false)
  }

  return (
    <div className="flex items-center gap-2 py-1">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <p className="flex items-center gap-1 text-lg font-medium text-primary transition-opacity hover:opacity-70">
            {activeView.name}
            <ChevronDownIcon
              className={cn(
                "h-5 w-5 text-muted-foreground transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </p>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-52">
          {/* ── View list ── */}
          {views.map((view) => (
            <DropdownMenuItem
              key={view.id}
              onSelect={() => switchView(view.id)}
              className={cn(
                "flex items-center justify-between gap-2",
                view.id === activeView.id && "font-medium text-primary"
              )}
            >
              {renamingId === view.id ? (
                <Input
                  autoFocus
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={() => handleRename(view.id)}
                  onKeyDown={(e) => {
                    e.stopPropagation()
                    if (e.key === "Enter") handleRename(view.id)
                    if (e.key === "Escape") setRenamingId(null)
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="h-6 text-xs"
                />
              ) : (
                <>
                  <span className="flex-1 truncate">{view.name}</span>

                  {view.id !== "__default__" && (
                    <span className="flex shrink-0 items-center gap-1">
                      <button
                        title="Edit view"
                        className="rounded p-0.5"
                        onClick={(e) => {
                          e.stopPropagation()
                          setRenamingId(view.id)
                          setRenameValue(view.name)
                        }}
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        title="Delete view"
                        className="rounded p-0.5"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteView(view.id)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </>
              )}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          {/* ── Save as new view ── */}
          {creatingNew ? (
            <div className="flex items-center gap-1 px-2 py-1">
              <Input
                autoFocus
                placeholder="View name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation()
                  if (e.key === "Enter") handleSaveAs()
                  if (e.key === "Escape") setCreatingNew(false)
                }}
                className="h-6 text-xs"
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 shrink-0"
                onClick={handleSaveAs}
              >
                <CheckIcon className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 shrink-0"
                onClick={() => setCreatingNew(false)}
              >
                <XIcon className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <DropdownMenuItem
              disabled={!hasChanges}
              onSelect={(e) => {
                e.preventDefault()
                setCreatingNew(true)
              }}
              className="text-muted-foreground"
            >
              <PlusIcon className="h-3 w-3" />
              Save view
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ── Inline save / discard — only when there are changes ── */}
      {hasChanges && (
        <>
          <Button
            title="Save changes"
            variant="ghost"
            size="icon"
            onClick={() => {
              if (activeView.id === "__default__") {
                setCreatingNew(true)
                setOpen(true)
              } else {
                saveChanges()
              }
            }}
          >
            <SaveIcon />
          </Button>
          <Button
            title="Discard changes"
            size="icon"
            variant="ghost"
            onClick={discardChanges}
          >
            <RotateCcw />
          </Button>
        </>
      )}
    </div>
  )
}
