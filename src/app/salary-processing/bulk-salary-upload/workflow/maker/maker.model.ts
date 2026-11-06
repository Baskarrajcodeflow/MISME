import { WritableSignal } from "@angular/core";
import { Corp,  } from "../../corp-chooser/corp-chooser.model";

export interface MakerCreate{
    selectedCorp: WritableSignal<Corp|null>;
    fileUploaded:WritableSignal<boolean>;
    fileValidated:WritableSignal<boolean>;
    fileAnalysed:WritableSignal<boolean>;
    fileScheduled:WritableSignal<boolean>;
}