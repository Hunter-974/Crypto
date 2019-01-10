import { TestBed, inject } from '@angular/core/testing';
import { ReactionService } from './reaction.service';
describe('ReactionService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [ReactionService]
        });
    });
    it('should be created', inject([ReactionService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=reaction.service.spec.js.map