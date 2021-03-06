/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PalaverTestModule } from '../../../test.module';
import { AptitudeTestComponent } from 'app/entities/aptitude-test/aptitude-test.component';
import { AptitudeTestService } from 'app/entities/aptitude-test/aptitude-test.service';
import { AptitudeTest } from 'app/shared/model/aptitude-test.model';

describe('Component Tests', () => {
    describe('AptitudeTest Management Component', () => {
        let comp: AptitudeTestComponent;
        let fixture: ComponentFixture<AptitudeTestComponent>;
        let service: AptitudeTestService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [AptitudeTestComponent],
                providers: []
            })
                .overrideTemplate(AptitudeTestComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(AptitudeTestComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AptitudeTestService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new AptitudeTest(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.aptitudeTests[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
