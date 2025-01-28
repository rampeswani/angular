import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { DynamicExportServiceService } from 'src/app/dynamic-export-service.service';

@Component({
  selector: 'app-print-table',
  templateUrl: './print-table.component.html',
  styleUrls: ['./print-table.component.css']
})
export class PrintTableComponent implements OnInit {

  @Input() tableTitle: string = '';
  @Input() jsonArray: any[] = [];
  @Input() columnLabelNames: any[] = [];

  filteredJsonArray: any[] = [];
  isTotalAvail: boolean = false; // Declare the isTotalAvail property once

  constructor(
    @Inject(MAT_DIALOG_DATA) public tableData: any,
    private dynamicExportExcelService: DynamicExportServiceService
  ) {}

  ngOnInit(): void {
    this.tableTitle = (this.tableData && this.tableData?.title) ? this.tableData?.title : this.tableTitle;
    this.jsonArray = (this.tableData && this.tableData?.data) ? this.tableData?.data : this.jsonArray;
    this.columnLabelNames = (this.tableData && this.tableData?.columnLabelNames) ? this.tableData?.columnLabelNames : this.columnLabelNames;

    if (this.jsonArray && this.jsonArray.length > 0) {
      if (this.columnLabelNames && this.columnLabelNames.length > 0) {
        this.filterJsonArray(this.jsonArray, this.columnLabelNames);
      }

      if (this.filteredJsonArray && this.filteredJsonArray.length > 0) {
        this.columnLabelNames = [{ key: 'Index', label: 'S. No.' }, ...this.columnLabelNames];
      }

      this.columnLabelNames = this.columnLabelNames.filter((x) => (x.key !== 'select'));
    }
  }

  filterJsonArray(jsonArray: any[], columnName: { key: string, totalRequired?: boolean }[]) {
    this.filteredJsonArray = jsonArray.map((item, index) => {
      const filteredItem: any = { Index: index + 1 };
      columnName.forEach((column: { key: string, totalRequired?: boolean }) => {
        if (column.totalRequired) {
          this.isTotalAvail = true; // Set isTotalAvail when totalRequired is true
        }
        filteredItem[column.key] = item[column.key];
      });
      return filteredItem;
    });
  }

  calculateTotal(header: any): number {
    return this.filteredJsonArray.reduce((total, item) => {
      if (header && header['totalRequired'] != undefined && header['totalRequired']) {
        return Number(total) + Number(item[header['key']]);
      }
      return total;
    }, 0);
  }

  formatToTwoDecimal(value: number): string | number {
    if (Number.isFinite(value)) {
      return value % 1 !== 0 ? value.toFixed(2) : value;
    }
    return value;
  }

  exportToExcel(tableId: string, reportFileName: string): void {
    const returnColumnForExcelExport = this.transformData(this.columnLabelNames);
    this.downloadExcel(this.jsonArray, returnColumnForExcelExport, reportFileName, reportFileName);
  }

  transformData(inputArray: any[]): any[] {
    return inputArray.map(item => ({
      key: item.key === 'Index' ? 'index' : item.key,
      columnName: item.label,
      totalRequired: item.totalRequired == undefined ? false : item.totalRequired
    }));
  }

  downloadExcel(dataSet: any, desiredColumn: any, title: any, reportFileName: string) {
    this.dynamicExportExcelService.GenerateExcelFile(dataSet, desiredColumn, title, reportFileName);
  }

  printTable(tableId: string): void {
    const table = document.getElementById(tableId);
    if (table) {
      const printWindow = window.open('Report', '_blank');
      if (printWindow) {
        printWindow.document.write('<html><head><title>.</title></head><body>');
        printWindow.document.write('<style>table, th, td { border: 1px solid #ddd; border-collapse: collapse; padding: 8px;text-align: left; } th { background-color: #f2f2f2; }</style>');
        printWindow.document.write(table.outerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      } else {
        console.error('Unable to open a new window for printing.');
      }
    } else {
      console.error(`Table with ID ${tableId} not found.`);
    }
  }
}
