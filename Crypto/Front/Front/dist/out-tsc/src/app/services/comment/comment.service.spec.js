import { TestBed, inject } from '@angular/core/testing';
import { CommentService } from './comment.service';
describe('CommentService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [CommentService]
        });
    });
    it('should be created', inject([CommentService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=comment.service.spec.js.map