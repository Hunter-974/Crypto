import { NgModule, ModuleWithProviders } from "@angular/core";
import { HubManager } from "./hub-manager";

@NgModule({
    imports: [],
    exports: [],
    declarations: []
})
export class HubsModule {

    public static forRoot(): ModuleWithProviders {
        return { 
            ngModule: HubsModule, 
            providers: [HubManager] 
        };
    }

}