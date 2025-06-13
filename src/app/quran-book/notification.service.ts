import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { TajweedInfo } from "../models/TajweedID";

@Injectable({
    providedIn: 'root'  // Provides service in AppModule
})
export class NotificationService
{
    // ==========================
    // Observable sources
    // ==========================
    // private optionsRequestedSource = new Subject<number>();
    // private optionsUpdatedSource   = new Subject<IOptions>();

    private TajweedIDSource           = new Subject<TajweedInfo | null>();
    private AyahSource                = new Subject<number>();
    private QuranPageSource           = new Subject<number>();
    

    // ==========================
    // Observable string streams
    // ==========================

    
    TajweedIDChanged$         = this.TajweedIDSource.asObservable();
    AyahChanged$              = this.AyahSource.asObservable();
    QuranPageChanged$         = this.QuranPageSource.asObservable();


    // ==========================
    // Service message commands
    // ==========================
    // Reserved for future use
    // saveOptions(newOptions: IOptions) { this.optionsUpdatedSource.next(newOptions); }

    TajweedID(TajweedID: TajweedInfo)
    {
        this.TajweedIDSource.next(TajweedID);
    }
    updateAyah(ayahNumber: number)
    {
        this.AyahSource.next(ayahNumber);
    }
}