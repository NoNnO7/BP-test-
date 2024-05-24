import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';


import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DateTime } from 'luxon';
import { DialogForm } from './form-dialog/dialog.component';
import { BottomSheetForm } from './form-bottomsheet/bottomsheet.component';
import { TopUpService } from '../top-up/topUp.service';
import { HistoryService } from './page.service';
import { UserService } from '../top-up/user.service';
import { NavbarComponent } from 'src/app/navbar/navbar.component';

//history: {date: string, data: {type:string,balance: number, time: string, list:{payment:string, order:string,amount:number,total:number}
type History = {
  date: string
  data: {
    time: string, // date แปลง
    balance: number, // amount
    type: string,
    //channel: string,
    //shopName: string,
    list: {
      payment: string //transactions.channel
      order: string // == itemName
      amount: number //same
      total: number //same
    }[]
  }[]
};

@Component({
    selector: 'app-history',
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
    //styleUrl: './page.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class HistoryComponent implements OnInit {
  isMobile: boolean = window.innerWidth < 768;
  orders: any[] = [];
  users: any[] = []
  role: any
  total: any[] = []
  //history: any[] = []
  history: History[] = []
  isPlatformBrowser: boolean = window.innerWidth > 768;
  monthsYears: string[] = [];
  selectedDate: any
	card: any
  showTransactions: boolean = false;
  k: any;
  sn: any;
  bgCard: string='';

  toggleTransactions() {
    this.showTransactions = !this.showTransactions;
  }

  getReversedHistory(): any[] {
    return this.history?.slice().reverse();
}

constructor(
  private dialog: MatDialog,
  private bottomSheet: MatBottomSheet,
  private _router: Router,
  private _topup: TopUpService,
  private _historyService: HistoryService,
  private _userService: UserService,
  private activityroute: ActivatedRoute,

  @Inject(PLATFORM_ID) private platformId: any
) {
  this.sn = this.decodeBase64(this.activityroute.snapshot.params['sn'])
}


  ngOnInit(): void {
    this.generateMonthsYears();
    this.setDefaultMonthYear();


    //this.role = this._userService.get_role()
    this.role = 'staff'
    this._topup.get_card_by_SN(123123213).subscribe((resp: any) =>{
      this.card = {
          id: resp.sn, 
          role: resp.role, 
          name: resp.name, 
          balance: parseInt(resp.remain).toLocaleString(), 
          update: (DateTime.fromISO(resp.at)).toFormat('HH:mm')
      }
      this.bgCard = this.bg_card()
    })
    
    this._historyService.get_transactionsCard().subscribe(
      (resp: any) => {
        this.total[0] = resp.totalTopUp
        this.total[1] = resp.totalSpending
        const historys = resp.history// ยังไม่เสร็จ
        if (!this.history){

        }
        for (let i = 0; i < historys.length; i++) {
          const history = historys[i];
          let temp_history = {
            date: DateTime.fromISO(history.date).toLocaleString({ month: 'long', day: '2-digit', year: 'numeric' }),
            data: []
          }
          this.history.push(temp_history)
          console.log('this.history[i].date',this.history[i].date);

          for (let j = 0; j < history.transactions.length; j++) {
            const transaction = history.transactions[j];
            let temp_data ={
              time: (DateTime.fromISO(transaction.date)).toFormat('HH:mm'),
              balance: transaction.amount,
              type: transaction.type,
              list: []
            }
            this.history[i].data.push(temp_data)
            for (let k = 0; k < transaction.items.length; k++) {
              console.log('test',i,j,k);
              const item = transaction.items[k];
              let temp_list ={
                payment: transaction.channel,
                order: item.itemName,
                amount: item.amount,
                total: item.total
              }
              this.history[i].data[j].list.push(temp_list)
            }
            
          }
        }
        console.log('history',this.history);
        console.log('resp',resp.history);
      },
      (error) => {
        console.error('Error fetching transactions:', error);
      }
    );
  }

  decodeBase64(input: string): string {
    return atob(input);
  }

  encodeBase64(input: string): string {
      return btoa(input);
  }

  bg_card(): string{
    return this._topup.get_bg_card(this.card.role)
  }

  openDialog(i: number, j: number): void {
    const dialogRef = this.dialog.open(DialogForm, {
      disableClose: true,
      width: '595px',
      height: '400px',
      data: this.getData(i, j)
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed with result:', result);
    });
  }

  openBottomSheet(i: number, j: number): void {
    const bottomSheetRef = this.bottomSheet.open(BottomSheetForm, {
      disableClose: true,
      panelClass: ['custom-bottom-sheet'],
      data: this.getData(i, j)
    });

    bottomSheetRef.afterDismissed().subscribe(result => {
      console.log('The bottom sheet was dismissed with result:', result);
    })

  }

  getData(i: number, j: number): any {
    console.log('test ,',this.history.slice().reverse());
    
    return {
      history: this.history.slice().reverse(),
      date: this.history.slice().reverse()[i].date,
      type: this.history.slice().reverse()[i].data[j].type,
      balance: this.history.slice().reverse()[i].data[j].balance,
      time: this.history.slice().reverse()[i].data[j].time,
      list: this.history.slice().reverse()[i].data[j].list
    };
  }

  openDialogOrBottomSheet(i: number, j: number): void {
    if (isPlatformBrowser(this.platformId)) {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        this.openBottomSheet(i, j);
      } else {
        this.openDialog(i, j);
      }
    }
  }

  clickForUpdateTime(){
    const date = DateTime.local()
    this.card.update = date.toFormat('HH:mm')
  }

  generateMonthsYears(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 1; year--) {
      for (let month = 1; month <= 12; month++) {
        this.monthsYears.push(`${this.getMonthName(month)} ${year}`);
      }
    }
  }

  getMonthName(month: number): string {
    return new Date(0, month - 1).toLocaleString('default', { month: 'long' });
  }

  setDefaultMonthYear(): void {
    const currentDate = new Date();
    const currentMonthYear = `${this.getMonthName(currentDate.getMonth() + 1)} ${currentDate.getFullYear()}`;
    this.selectedDate = currentMonthYear;
  }

  backto(){
    this._router.navigate(['/card',this.encodeBase64(this.sn)])
  }

}

