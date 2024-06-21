import { Subscription } from 'rxjs';
import { Component, OnInit, OnChanges, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

@Component({
    selector: 'app-history-form',
    standalone: true,
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    imports: [
        CommonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatToolbarModule,
        MatButtonModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatRadioModule
    ]
})
export class DialogForm implements OnInit {
    data_type:any;
    data_balance:any;
    data_date:any;
    data_time:any;
    data_shopname:any;
    data_channel:any;
    data_list:any[] = [];

    constructor(
        private dialogRef: MatDialogRef<DialogForm>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}

    ngOnInit(): void {
        this.data_type = this.data.type
        this.data_date = this.data.date
        this.data_balance = this.data.balance
        this.data_time = this.data.time
        this.data_list = this.data.list
        this.data_shopname = this.data.shopName
        this.data_channel = this.data.channel
        if (this.data_channel == "")
            this.data_channel = "CARD"
    }

    onClose() {
        this.dialogRef.close();
    }
}
