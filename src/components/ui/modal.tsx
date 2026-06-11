import { X } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

export function Modal({ open, title, description, onClose, children, className }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid min-w-0 place-items-center bg-background/80 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? "modal-description" : undefined}
        className={cn(
          "max-h-[min(90vh,48rem)] w-full max-w-2xl min-w-0 overflow-y-auto rounded-lg border border-border bg-background p-4 shadow-lg sm:p-6",
          className
        )}
      >
        <div className="mb-4 flex min-w-0 items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 id="modal-title" className="text-xl font-semibold break-words">
              {title}
            </h2>
            {description ? (
              <p
                id="modal-description"
                className="mt-1 text-sm leading-6 break-words text-muted-foreground"
              >
                {description}
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Fechar modal"
            className="shrink-0"
          >
            <X aria-hidden="true" />
          </Button>
        </div>
        {children}
      </section>
    </div>
  );
}
