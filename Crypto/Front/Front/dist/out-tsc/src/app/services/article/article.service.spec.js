import { TestBed, inject } from '@angular/core/testing';
import { ArticleService } from './article.service';
describe('ArticleService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [ArticleService]
        });
    });
    it('should be created', inject([ArticleService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=article.service.spec.js.map