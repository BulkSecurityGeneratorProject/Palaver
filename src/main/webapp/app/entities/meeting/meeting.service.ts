import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IMeeting } from 'app/shared/model/meeting.model';

type EntityResponseType = HttpResponse<IMeeting>;
type EntityArrayResponseType = HttpResponse<IMeeting[]>;

@Injectable({ providedIn: 'root' })
export class MeetingService {
    public resourceUrl = SERVER_API_URL + 'api/meetings';

    constructor(protected http: HttpClient) {}

    create(meeting: IMeeting): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(meeting);
        return this.http
            .post<IMeeting>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(meeting: IMeeting): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(meeting);
        return this.http
            .put<IMeeting>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IMeeting>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IMeeting[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(meeting: IMeeting): IMeeting {
        const copy: IMeeting = Object.assign({}, meeting, {
            date: meeting.date != null && meeting.date.isValid() ? meeting.date.format(DATE_FORMAT) : null,
            time: meeting.time != null && meeting.time.isValid() ? meeting.time.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.date = res.body.date != null ? moment(res.body.date) : null;
            res.body.time = res.body.time != null ? moment(res.body.time) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((meeting: IMeeting) => {
                meeting.date = meeting.date != null ? moment(meeting.date) : null;
                meeting.time = meeting.time != null ? moment(meeting.time) : null;
            });
        }
        return res;
    }

    findAllByParticipantId(idParticipant: number): Observable<EntityArrayResponseType> {
        return this.http
            .get<IMeeting[]>(`${this.resourceUrl}/by-participant/${idParticipant}`, { observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    findByGroupId(id: number) {
        return this.http
            .get<IMeeting[]>(`${this.resourceUrl}/by-group/${id}`, { observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }
}
