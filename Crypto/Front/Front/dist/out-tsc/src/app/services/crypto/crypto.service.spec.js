import { TestBed, inject } from '@angular/core/testing';
import { CryptoService } from './crypto.service';
describe('CryptoService', function () {
    beforeEach(function () {
        TestBed.configureTestingModule({
            providers: [CryptoService]
        });
    });
    it('should be created', inject([CryptoService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=crypto.service.spec.js.map