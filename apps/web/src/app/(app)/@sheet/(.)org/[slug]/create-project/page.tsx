import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { InterceptedSheetContent } from "@/components/intercepted-sheet-content";
import { ProjectForm } from "@/app/(app)/org/[slug]/create-project/project-form";

export default function CreateProject() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent >
        <SheetHeader>
          <SheetTitle>Create project</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <ProjectForm />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}