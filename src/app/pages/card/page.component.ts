import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { DateTime } from 'luxon';
import { TopUpService } from '../top-up/topUp.service';
import { HistoryService } from '../history/page.service';
import { NavbarComponent } from 'src/app/navbar/navbar.component';
import { UserService } from '../top-up/user.service';
import { ActivatedRoute } from '@angular/router'

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        RouterLink,
        ReactiveFormsModule,
        FormsModule,
        MatSelectModule,
        NavbarComponent
    ],

    templateUrl: './page.component.html',
    //styleUrl: './selectCard.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class CardComponent implements OnInit {
    users: any[] = []
    role: any
    balance: number = 1400
    card: any
    transactions:any[] = []
    cards: any[] = []
    //translate_y: string = 'translate-y-[119px]'
    display_popup: string = 'hidden'
    display_left: any
    display_right: any
    slice_src: any
    sn: any
    cards_family: any;

    constructor(
        public dialog: MatDialog,
        private _fb: FormBuilder,
        private _router: Router,
        private _topup: TopUpService,
        private _historyService: HistoryService,
        private activityroute: ActivatedRoute 
    ) {
        this.sn = this.decodeBase64(this.activityroute.snapshot.params['sn'])
    }
    ngOnInit(): void {
        this._topup.get_card_by_SN(123123213).subscribe((resp: any) =>{
            //this.card = resp
            console.log(this.card);
           
            this.card = {
                id: resp.sn, 
                role: resp.role, 
                name: resp.name, 
                balance: parseInt(resp.remain).toLocaleString(), 
                update: (DateTime.fromISO(resp.at)).toFormat('HH:mm')
            }
            console.log(this.cards , 'data1');
        })
        //this.card = this._topup.getCardData()
        //this.cards = this._topup.getAllCard()
        this._topup.get_family_card(123123213).subscribe((resp: any) =>{
            this.cards_family = resp
            console.log(this.cards_family);
           
          for (let index = 0; index <  this.cards_family.persons.length; index++) {
            const element =  this.cards_family.persons[index];
            const data = {
                id: element.sn, 
                role: element.role, 
                name: element.name, 
                balance: parseInt(element.remain).toLocaleString(), 
                update: DateTime.fromISO(element.at).toFormat('HH:mm')
            }
            this.cards.push(data)
            }
        })
        this.buttonL()
        this.buttonR()
        this.slice_card()
        console.log(this.cards.length);

        console.log(this.cards);

        this.role = 'parent'

        this.transactions = this._historyService.get_transactions()
    }

    decodeBase64(input: string): string {
        return atob(input);
    }

    encodeBase64(input: string): string {
        return btoa(input);
    }

    buttonL(){
        const index = this._topup.getSelectIndex()
        console.log('L' + index);

        console.log('buttonL');

        if (index > 0){
            this.display_left = "block"
        }
        else{
            this.display_left = "hidden"
        }
    }

    buttonR(){
        const index = this._topup.getSelectIndex()
        console.log('R' + index);
        console.log('buttonR');
        if (index < this.cards.length - 1){
            this.display_right = "block"
            console.log(index + '<' + this.cards.length +'R block');
        }
        else{
            this.display_right = "hidden"
            console.log(index + '<' + this.cards.length +'R hidden');
        }
    }

    slice_card(){
        const index = this._topup.getSelectIndex()
        if (this.cards.length == 1)
            this.slice_src = "assets/images/logo/card/slide_card0.svg"
        else if (index == 0)
            this.slice_src = "assets/images/logo/card/slide_card1.svg"
        else if ((index < this.cards.length - 1) && (index > 0))
            this.slice_src = "assets/images/logo/card/slide_card2.svg"
        else if (index == this.cards.length - 1)
            this.slice_src = "assets/images/logo/card/slide_card3.svg"
    }

    change_left(){
        const index = this._topup.getSelectIndex() - 1
        console.log('this._topup.getSelectIndex() - 1 = ' + index);
        this._topup.setCardData(index)
        this.buttonL()
        this.buttonR()
        this.card = this.cards[index]
        this.slice_card()
    }

    change_right(){
        const index = this._topup.getSelectIndex() + 1
        console.log('this._topup.getSelectIndex() + 1 = ' + index);
        this._topup.setCardData(index)
        this.buttonL()
        this.buttonR()
        this.card = this.cards[index]
        this.slice_card()
    }

    change_card(index: number){
        this._topup.setCardData(index)
        this.toggle_popup()
        this.card = this.cards[index]
        console.log(index);
        this.slice_card()
    }

    toggle_popup(){
        if (this.display_popup == "hidden")
            this.display_popup = "block"
        else if (this.display_popup == "block")
            this.display_popup = "hidden"
        this.buttonL()
        this.buttonR()
    }

    bg_card(): string{
        console.log("this.card.role",this.card.role);
        
        return this._topup.get_bg_card(this.card.role)
    }

    //translate_y_popup(){
    //    const len = this._topup.getAllCard().length
    //    console.log('len'+len);
    //    if (len == 1)
    //        this.translate_y = 'translate-y-[110%]'
    //    else if (len == 2)
    //        this.translate_y = 'translate-y-[171px]'
    //    else if (len > 2)
    //        this.translate_y = 'translate-y-[230px]'
    //    else
    //        this.translate_y = 'translate-y-[0px]'
    //    console.log(this.translate_y); 
    //}

    clickForUpdateTime(){
      const date = DateTime.local()
      this.card.update = date.toFormat('HH:mm')
      this._topup.setUpdateCard(this.card.update)
    //  this.card = this._topup.getCardData()
    }

    gototopup(){
        this._router.navigate(['/top-up',this.encodeBase64(this.card.id)])
        console.log('top-up');
    }

    gotohistory(){
        this._router.navigate(['/history',this.encodeBase64(this.sn)])
        console.log('history');
    }
}
