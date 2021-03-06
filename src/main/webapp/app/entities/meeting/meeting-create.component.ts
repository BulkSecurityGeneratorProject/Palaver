import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IMeeting } from 'app/shared/model/meeting.model';
import { MeetingService } from './meeting.service';
import { IFocusGroup } from 'app/shared/model/focus-group.model';
import { FocusGroupService } from 'app/entities/focus-group';
import { UserService } from 'app/core';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'jhi-meeting-create',
    templateUrl: './meeting-create.component.html'
})
export class MeetingCreateComponent implements OnInit {
    meeting: IMeeting;
    isSaving: boolean;
    dateDp: any;
    time: string;
    focusGroup: IFocusGroup;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected meetingService: MeetingService,
        protected focusGroupService: FocusGroupService,
        protected activatedRoute: ActivatedRoute,
        protected userService: UserService,
        protected config: NgbDatepickerConfig
    ) {
        const current = new Date();
        config.minDate = {
            year: current.getFullYear(),
            month: current.getMonth() + 1,
            day: current.getDate()
        };
        config.maxDate = { year: 2099, month: 12, day: 31 };
        config.outsideDays = 'hidden';
    }

    ngOnInit() {
        this.meeting = new class implements IMeeting {
            callCode: string;
            callURL: string;
            date: moment.Moment;
            description: string;
            focusGroup: IFocusGroup;
            id: number;
            name: string;
            time: moment.Moment;
        }();
        this.isSaving = false;
        this.userService.getUserWithAuthorities().subscribe(user => {
            this.focusGroupService
                .query()
                .pipe(
                    filter((res: HttpResponse<IFocusGroup[]>) => res.ok),
                    map((res: HttpResponse<IFocusGroup[]>) => res.body)
                )
                .subscribe(
                    (res: IFocusGroup[]) => {
                        for (let i = 0; i < res.length; i++) {
                            if (res[i].code === user.login) {
                                this.focusGroup = res[i];
                            }
                        }
                    },
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.meeting.time = this.time != null ? moment(this.time, 'LT') : null;
        if (this.meeting.id !== undefined) {
            this.subscribeToSaveResponse(this.meetingService.update(this.meeting));
        } else {
            this.subscribeToSaveResponse(this.meetingService.create(this.meeting));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IMeeting>>) {
        result.subscribe((meeting: HttpResponse<IMeeting>) => {
            this.focusGroup.meeting = meeting.body;
            this.focusGroupService.update(this.focusGroup).subscribe(
                focusGroup => {
                    this.onSaveSuccess();
                },
                (res: HttpErrorResponse) => this.onSaveError()
            );
        });
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    validateDate(): boolean {
        return this.meeting.date.isAfter(this.focusGroup.endDate) || this.meeting.date.isBefore(this.focusGroup.beginDate);
    }
}
