import { TestBed, inject } from '@angular/core/testing';
import { CategoryService } from './category.service';
describe('CategoryService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [CategoryService]
        });
    });
    it('should be created', inject([CategoryService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=category.service.spec.js.map