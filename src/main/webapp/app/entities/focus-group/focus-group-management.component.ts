import {Component, OnInit} from '@angular/core';
import {IParticipant, Participant} from 'app/shared/model/participant.model';
import {IMeeting} from 'app/shared/model/meeting.model';
import {UserService} from 'app/core';
import {FocusGroupService} from 'app/entities/focus-group/focus-group.service';
import {MeetingService} from 'app/entities/meeting';
import {ParticipantService} from 'app/entities/participant';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {IFocusGroup} from 'app/shared/model/focus-group.model';
import {filter, map} from 'rxjs/operators';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';

@Component({
    selector: 'jhi-focus-group-management',
    templateUrl: './focus-group-management.component.html'
})
export class FocusGroupManagementComponent implements OnInit {
    private participants: Participant[];
    private meetings: IMeeting[];
    private participant: IParticipant;
    private focusGroup: IFocusGroup;
    private focusGroups: IFocusGroup[];
    searchText;

    constructor(
        protected userService: UserService,
        protected focusGroupService: FocusGroupService,
        protected meetingsService: MeetingService,
        protected participantService: ParticipantService,
        protected modalService: NgbModal
    ) {
    }

    ngOnInit() {
        this.loadAllFocusGroups();
        this.userService.getUserWithAuthorities().subscribe(user => {
            this.focusGroupService.findByCode(user.email).subscribe(data => {
                console.log(data);
                this.focusGroup = data.body;
                this.participantService.findByGroupId(data.body.id).subscribe(participants => {
                    this.participants = participants.map((participant: IParticipant) => this.mapParticipants(participant));
                });

                this.meetingsService.findByGroupId(data.body.id).subscribe(meetings => {
                    this.meetings = meetings.body;
                });
            });
        });
    }

    private mapParticipants(p: IParticipant) {
        let newParticipant = new Participant(p.id, p.birthdate, p.gender, p.civilStatus, p.picture, p.user, p.categories, p.focusGroups);

        return newParticipant;
    }

    expulsion(participant, modalToDisplay) {
        this.participant = participant;
        this.openModal(modalToDisplay);
    }

    openModal(content) {
        this.modalService.open(content).result.then(
            result => {
                console.log(`Closed with: ${result}`);
            },
            reason => {
                console.log(`Dismissed ${this.getDismissReason(reason)}`);
            }
        );
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    loadAllFocusGroups() {
        this.focusGroupService
            .query()
            .pipe(
                filter((res: HttpResponse<IFocusGroup[]>) => res.ok),
                map((res: HttpResponse<IFocusGroup[]>) => res.body)
            )
            .subscribe(
                (res: IFocusGroup[]) => {
                    this.focusGroups = res;
                }
            );
    }

    sendExpulsionMotive(input) {
        for (let i = 0; i < this.focusGroups.length; i++) {
            if (this.focusGroup.id === this.focusGroups[i].id) {
                this.focusGroup = this.focusGroups[i];
            }
        }
        this.focusGroup.participants.splice(this.focusGroup.participants.indexOf(this.participant), 1);
        this.focusGroupService.update(this.focusGroup).subscribe(data => {
            this.ngOnInit();
            this.ngOnInit();
        });
    }
}
