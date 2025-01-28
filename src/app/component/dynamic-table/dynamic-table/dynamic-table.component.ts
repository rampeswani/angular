
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Optional,
  Output,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { XlsxExporterService } from "mat-table-exporter";
import * as XLSX from "xlsx";
import * as jspdf from "jspdf";
import html2canvas from "html2canvas";

// import * as uuid from 'uuid';


import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// import { PrintTableComponent } from "../print-table/print-table.component";
import { PrintTableComponent } from "../../print-table/print-table/print-table.component";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { SelectionModel } from "@angular/cdk/collections";
// import { HindiFontBase64 } from "/HindiFont";
import { HindiFontBase64 } from "../HindiFont";


if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
  (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
  

(pdfMake as any).vfs = {
  ...pdfFonts.pdfMake.vfs,
  'NotoSans': HindiFontBase64,
};

(pdfMake as any).fonts = {
  NotoSansFontHindi: {
    normal: 'NotoSans',
    bold: 'NotoSans',
    italics: 'NotoSans',
    bolditalics: 'NotoSans'
  },
};

} else {
  console.error('pdfFonts or pdfMake.vfs is undefined');
}



const INDEX_COLUMN = "INDEX_COLUMN";
const ACTION_COLUMN = "ACTION_COLUMN";

export interface ToolOption {
  actionName: string;
  actionTaken: string;
  actionIcon: string;
}
@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css']
})
export class DynamicTableComponent implements OnInit {
  TOOL_OPTIONS: ToolOption[] = [];

  @ViewChild("tableRef") tableRef!: ElementRef;
  @Input() watermarkShow: boolean = false;
  @Input() selectedActionBtnText!: string;
  @Input() watermarkPosition: number[] = [175, 120];
  @Input() watermarkSize: number[] = [350, 350];
  @Input() pdfPageSize: number[] = [1000, 650];
  @Input() watermarkLogoURL: string = 'https://services.mp.gov.in/main/assets/logo.png';
  @Input() serviceName!: string;
  @Output() selectedActionResponse = new EventEmitter<any>();
  @Output() responseAction = new EventEmitter<any>();
  @Output() singleColumnAction = new EventEmitter<any>();
  @Input() tableTitleForExport: string = '-';
  @Input() customTableStyle: string = "";
  @Input() columnsHeaderName: any[] = [];
  @Input() actionColumnVisibility: boolean = false;
  @Input() singleAction: boolean = false;
  @Input() tableHeaderResizable: boolean = false;
  @Input() searchBoxResizable: boolean = false;
  @Input() paginationVisibility: boolean = true;
  @Input() paginationVisibilityTop: boolean = false;
  @Input() toolOptionVisibility: boolean = true;
  @Input() toolOptionColumnVisibility: boolean = true;
  @Input() exportOptions: string[] = ['PRINT_PREVIEW', 'EXCEL_EXPORT'];
  @Input() searchBoxVisibility: boolean = true;
  @Input() fontSizeIncrementVisibility: boolean = true;
  @Input() myTableActionMenu!: any[];
  @Input() pageSizeOptions: any[] = [10, 25, 50, 100];
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @Input() dataSetForTable!: any[];
  displayedColumns!: string[];
  dataSource!: MatTableDataSource<any>;

  search_key_word!: string;
  toggleSearch: boolean = false;
  columnTotalVisibility: boolean = false;
  myUniqueId: any;
  columnNameForPrintPreview: any;
  isAvailableSelectKey: boolean = false;

  constructor(public exporterService: XlsxExporterService, public dialog: MatDialog, @Optional() @Inject(MAT_DIALOG_DATA) public tableDataFromDailog: any) { }
  ngOnInit(): void {

    this.myUniqueId ="dfdfdf";
    // console.log("myUniqueId : ", this.myUniqueId);

    //console.log("columnsHeaderName :", this.columnsHeaderName);

    //console.log("tableDataFromDailog : ", this.tableDataFromDailog);

    if (this.tableDataFromDailog != null && this.tableDataFromDailog != undefined) {
      this.initiFromDialogData(this.tableDataFromDailog);
    }

    this.columnNameForPrintPreview = this.columnsHeaderName?.filter(item => (item.key !== 'INDEX_COLUMN' && item.key !== 'ACTION_COLUMN'));
    //console.log("columnNameForPrintPreview : ", this.columnNameForPrintPreview);
    //  console.log("dataSetForTable init() : ", this.dataSetForTable);

    if (this.actionColumnVisibility) {
          /* this.columnsHeaderName.push({
            key: ACTION_COLUMN,
            label: "Action",
          }); */
      this.columnsHeaderName = this.updateColumnHeader(this.columnsHeaderName, this.actionColumnVisibility);

      this.displayedColumns = this.columnsHeaderName.map((col) => col.key);

      this.dataSetForTable.forEach((value, key) => {
        this.dataSetForTable[key]["ACTION_COLUMN"] = "ACTION_SHOW";
      });
    } else {
      this.displayedColumns = this.columnsHeaderName.map((col) => col.key);
    }

    /* if (false) {
      this.columnsHeaderName.splice(0, 0, {
        "key": "select",
        "label": "Select",
      });
    } */

    this.columnsHeaderName.forEach((value, key) => {

      if (value.key === 'select' || value.label === 'Select') {
        this.isAvailableSelectKey = true;
      }

      if (value.visible === undefined) {
        this.columnsHeaderName[key]["visible"] = true;
      }

      // this.columnsHeaderName[key]["style"] = (value.style===undefined || value.style===null) ?{'columnValue':[], 'color':[]}:value.style;
      if (value!.totalRequired && value!.totalRequired === true) {
        this.columnsHeaderName[key]["totalRequired"] = true;
        this.columnTotalVisibility = true;
      } else {
        this.columnsHeaderName[key]["totalRequired"] = false;
      }

    });

    this.dataSource = new MatTableDataSource<any>(this.dataSetForTable);
    this.dataSource.paginator = this.paginator;
    this.pageSizeOptions.push(this.dataSetForTable.length);
    //  console.log('dataSource : ', this.dataSource);
    // console.log('columnsHeaderName : ', this.columnsHeaderName);

    this.exportOptions!.forEach((x) => {
      if (x === 'PRINT') {
        this.TOOL_OPTIONS.push({
          actionName: 'Print',
          actionTaken: 'PRINT',
          actionIcon: 'print'
        });
      }
      if (x === 'PRINT_PREVIEW') {
        this.TOOL_OPTIONS.push({
          actionName: "Print Preview",
          actionTaken: "PRINT_PREVIEW",
          actionIcon: "print",
        });
      }
      if (x === 'VIEW_EXPORT') {
        this.TOOL_OPTIONS.push({
          actionName: "Print Preview | Excel Export",
          actionTaken: "PRINT_PREVIEW",
          actionIcon: "open_in_new",
        });
      }
      if (x === 'PDF_EXPORT') {
        this.TOOL_OPTIONS.push({
          actionName: 'PDF Export',
          actionTaken: 'PDF_EXPORT',
          actionIcon: 'picture_as_pdf',
        });
      }
      if (x === 'EXCEL_EXPORT') {
        this.TOOL_OPTIONS.push({
          actionName: "Excel Export",
          actionTaken: "EXCEL_EXPORT",
          actionIcon: "download_for_offline",
        });
      }

    });

    this.columnsHeaderName = this.columnsHeaderName.filter((obj, index, arr) => {
      return arr.map(mapObj =>
        mapObj.key).indexOf(obj.key) == index;
    });
    // console.log("columnsHeaderName : ", this.columnsHeaderName);

    //this.fetchImageFromURL(this.watermarkLogoURL);

  }

  updateColumnHeader(columnHeaderName: any[], actionColumnVisibility: boolean): any[] {
    const actionColumnExists = columnHeaderName.some(column => column.key === 'ACTION_COLUMN');
    if (actionColumnVisibility && !actionColumnExists) {
      // Add ACTION_COLUMN to columnHeaderName
      columnHeaderName.push({
        key: 'ACTION_COLUMN',
        label: 'Action'
      });
    }
    return columnHeaderName;
  }

  /* getHeaderCellStyle(column: any, value: any) {
    if (column?.style?.color) {
      const colorConfig = column?.style?.color.find((c: any) => c.value === value);
      return { ...column?.style, color: colorConfig?.color };
    }
    return column?.style || {};
  } */

  getCellStyles(element: any, column: any, columnKey: any) {
    if (column && column.style !== undefined) {
      if (column.key === columnKey && column?.style?.color) {
        if (Array.isArray(column?.style?.color)) {
          // Handling style with specific values and colors
          const value = element[column.key];
          const styleEntry = column?.style?.color.find((entry: { value: string }) => entry.value === value);

          return styleEntry ? { 'color': styleEntry.color, 'text-align': column?.style?.textAlign, 'cursor': column?.style?.cursor, 'font-style': column?.style?.fontStyle, 'font-weight': column?.style?.fontWeight, 'text-decoration': column?.style?.textDecoration, 'font-size': column?.style?.fontSize, 'display': column?.style?.display, 'padding': column?.style?.padding, 'background-color': column?.style?.backgroundColor, 'border-radius': column?.style?.borderRadius,'width':column?.style?.width, 'vertical-align':column?.style?.verticalAlign } : {};
        } else {
          // Handling style with a single color for the entire column
          return { 'color': column?.style?.color, 'cursor': column?.style?.cursor,'text-align': column?.style?.textAlign, 'font-style': column?.style?.fontStyle, 'font-weight': column?.style?.fontWeight, 'text-decoration': column?.style?.textDecoration, 'font-size': column?.style?.fontSize, 'display': column?.style?.display, 'padding': column?.style?.padding, 'background-color': column?.style?.backgroundColor, 'border-radius': column?.style?.borderRadius,'width':column?.style?.width, 'vertical-align':column?.style?.verticalAlign };
          // return { 'color': column?.style?.color };
        }

      }
      return {};
    }
    return {};
  }

  getTotalCellStyles(column: any, columnKey: any) {
   // console.log("column : ", column);
    //console.log("columnKey : ", columnKey);
    
    if (column && column.totalStyle !== undefined) {
      if (column.key === columnKey && column?.totalStyle) {
          // Handling Total style with a single color for the entire column
          return { 'color': column?.totalStyle?.color, 'cursor': column?.totalStyle?.cursor,'text-align': column?.totalStyle?.textAlign, 'font-style': column?.totalStyle?.fontStyle, 'font-weight': column?.totalStyle?.fontWeight, 'text-decoration': column?.totalStyle?.textDecoration, 'font-size': column?.totalStyle?.fontSize, 'display': column?.totalStyle?.display, 'padding': column?.totalStyle?.padding, 'background-color': column?.totalStyle?.backgroundColor, 'border-radius': column?.totalStyle?.borderRadius,'width':column?.style?.width, 
            'vertical-align':column?.style?.verticalAlign };
 
        }
      }
      return {};
  }

  isDialog : boolean = false;
  initiFromDialogData(tableDataFromDailog: any) {

    this.watermarkShow = tableDataFromDailog ? tableDataFromDailog?.watermarkShow : this.watermarkShow;
    this.watermarkPosition = (tableDataFromDailog && tableDataFromDailog?.watermarkPosition) ? tableDataFromDailog?.watermarkPosition : this.watermarkPosition;
    this.watermarkSize = (tableDataFromDailog && tableDataFromDailog?.watermarkSize) ? tableDataFromDailog?.watermarkSize : this.watermarkSize;

    this.pdfPageSize = (tableDataFromDailog && tableDataFromDailog?.pdfPageSize) ? tableDataFromDailog?.pdfPageSize : this.pdfPageSize;
    this.watermarkLogoURL = (tableDataFromDailog && tableDataFromDailog?.watermarkLogoURL) ? tableDataFromDailog?.watermarkLogoURL : this.watermarkLogoURL;
    this.serviceName = (tableDataFromDailog && tableDataFromDailog?.serviceName) ? tableDataFromDailog?.serviceName : this.serviceName;

    this.tableTitleForExport = (tableDataFromDailog && tableDataFromDailog?.tableTitleForExport) ? tableDataFromDailog?.tableTitleForExport : this.tableTitleForExport;
    this.customTableStyle = (tableDataFromDailog && tableDataFromDailog?.customTableStyle) ? tableDataFromDailog?.customTableStyle : this.customTableStyle;
    this.columnsHeaderName = (tableDataFromDailog && tableDataFromDailog?.columnsHeaderName) ? tableDataFromDailog?.columnsHeaderName : this.columnsHeaderName;
    this.actionColumnVisibility = tableDataFromDailog ? tableDataFromDailog?.actionColumnVisibility : this.actionColumnVisibility;
    this.singleAction = tableDataFromDailog ? tableDataFromDailog?.singleAction : this.singleAction;

    this.paginationVisibility = tableDataFromDailog ? tableDataFromDailog?.paginationVisibility : this.paginationVisibility;
    this.paginationVisibilityTop = tableDataFromDailog ? tableDataFromDailog?.paginationVisibilityTop : this.paginationVisibilityTop;

    this.tableHeaderResizable = tableDataFromDailog ? tableDataFromDailog?.tableHeaderResizable : this.tableHeaderResizable;
    this.searchBoxResizable = tableDataFromDailog ? tableDataFromDailog?.searchBoxResizable : this.searchBoxResizable;

    this.toolOptionVisibility = tableDataFromDailog ? tableDataFromDailog?.toolOptionVisibility : this.toolOptionVisibility;
    this.toolOptionColumnVisibility = tableDataFromDailog ? tableDataFromDailog?.toolOptionColumnVisibility : this.toolOptionColumnVisibility;
    this.exportOptions = (tableDataFromDailog && tableDataFromDailog?.exportOptions) ? tableDataFromDailog?.exportOptions : this.exportOptions;
    this.searchBoxVisibility = tableDataFromDailog ? tableDataFromDailog?.searchBoxVisibility : this.searchBoxVisibility;
    this.myTableActionMenu = (tableDataFromDailog && tableDataFromDailog?.myTableActionMenu) ? tableDataFromDailog?.myTableActionMenu : this.myTableActionMenu;
    this.pageSizeOptions = (tableDataFromDailog && tableDataFromDailog?.pageSizeOptions) ? tableDataFromDailog?.pageSizeOptions : this.pageSizeOptions;
    this.dataSetForTable = (tableDataFromDailog && tableDataFromDailog?.dataSetForTable) ? tableDataFromDailog?.dataSetForTable : this.dataSetForTable;

    this.isDialog =  (tableDataFromDailog && tableDataFromDailog?.isDialog) ? tableDataFromDailog?.isDialog : false; 
  }


  // Function to fetch image from URL and convert to dataURL
  fetchImageFromURL(imageURL: string): void {
    fetch(imageURL)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.watermarkLogoURL = reader.result as string;
        };
        reader.readAsDataURL(blob);
      })
      .catch((error) => {
        this.watermarkShow = false;
        console.error('Error fetching image from URL:', error);
      });
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  /* getTotalColumnTotal() {
    return this.dataSetForTable.map(t => t.enterydone).reduce((acc, value) => acc + value, 0);
  }

  getColumnTotal(column: string): number {
    return this.dataSetForTable.reduce((acc, item) => acc + item[column], 0);
  } */

  isNumeric(value: any): boolean {
    return !isNaN(value) && isFinite(value);
  }

  /* getColumnTotal(column: string): any {
    return this.dataSetForTable.reduce((acc, item) => {
      const value = item[column];
      if (this.isNumeric(value)) {
        acc += value;
      }
      return acc === 0 ? '' : acc;
    }, 0);
  } */

  getColumnTotal(column: string): number {
    return this.dataSource?.filteredData?.reduce((acc, item) => {
      const value = item[column];
      if (this.isNumeric(value)) {
        acc += Number(value);
      }
      // return acc === 0 ? '' : acc;
      return acc;
    }, 0);
  }

  formatToTwoDecimal(value: number): string | number {
    if (Number.isFinite(value)) {
      return value % 1 !== 0 ? value.toFixed(2) : value;
    }
    return value;
  }

  toolOptionkAction(actionTaken: any) {
    // alert('action taken : ' + actionTaken);
    // this.exporterService.export(this.dataSetForTable);
    if (actionTaken === "EXCEL_EXPORT") {
      this.exportExcel();
    }

    if (actionTaken === "PDF_EXPORT") {
      this.generateDynamicPDF();
    }

    if (actionTaken === "PRINT") {
      this.printTable();
    }

    if (actionTaken === "PRINT_PREVIEW") {
      //this.printPreview();
      this.openPrintDialog();
    }
  }

  onTableAction(e: any, element: any): void {
    //alert("E : " + JSON.stringify(e))
    //  console.log("E : ", e);
    //  console.log("element : ", element);

    this.responseAction.emit({ actionName: e, rowData: element });
  }

  onSingleColumnAction(e: any, element: any): void {
    this.singleColumnAction.emit({ actionName: e, rowData: element });
  }

  /*  applyFilter(event: Event) {
     const filterValue = (event.target as HTMLInputElement).value;
     this.dataSource.filter = filterValue.trim().toLowerCase();
   } */

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  exportExcel(): void {

    // let element = document.getElementById("my-data-table-id");
    let element = document.getElementById("tableRef_" + this.myUniqueId);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    //delete (ws['G']);
    ws["!cols"] = [];
    ws["!cols"][6] = { hidden: true };
    // console.log("ws : ", ws);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "table-data.xlsx");
  }

  exportToPdf() {
    // const tableElement = this.table.nativeElement;
    let DATA: any = document.getElementById("tableRef_" + this.myUniqueId);
    // console.log("DATA : ", DATA);

    const pdf = new jspdf.jsPDF();

    html2canvas(DATA).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("filename" + ".pdf");
    });
  }

  printTable() {
    //const printWindow = window.open('', '_blank');
    var printWindow = window.open("", "", "height=600,width=800");
    if (!printWindow) {
      console.error("Failed to open print preview window. Please disable your popup blocker and try again.");
      return; // Exit the function if the print window couldn't be opened
    }
    printWindow.document.write("<html><head><title>" + this.tableTitleForExport!.replace(/\s+/g, '-') + "</title>");
    printWindow.document.write(
      '<style type = "text/css">#export_table_title_id { padding: 0 10px 10px 0px; font-weight: bold; display: block;} .total-footer-display{display: none;} table{-fs-table-paginate: paginate;}.mat-header-row { font-weight: bold; background-color: #a5a5a5; color: white; font-weight: bold; } button{  border: none;font-weight: bold;background-color: #a5a5a5;color: white;border: white;} .mat-column-ACTION_COLUMN { display:none;}table {font-family: arial, sans-serif;border-collapse: collapse;width: 100%;}td, th { border: 1px solid black;text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #F2F3F4;}</style>'
    );
    printWindow.document.write("</head>");
    printWindow.document.write("<body>");
    // printWindow.document.write('<div style="padding: 0 10px 10px 0px; font-weight: bold;">वर्तमान कार्यालय उपयोकर्ताओं की सूची</div>');
    const div = document.getElementById("tableRef_" + this.myUniqueId);

if (div) {
  const divContents = div.innerHTML;
  const printWindow = window.open("", "", "width=800,height=600");
  if(printWindow){
    printWindow.document.write("<html><head><title>Print</title></head><body>");
  printWindow.document.write(divContents);
  printWindow.document.write("</body>");
  printWindow.document.write("</html>");
  printWindow.document.close();
  }
  
} else {
  console.error("Element with the specified ID not found.");
}

    // printWindow.document.close();
    printWindow.print();
  }

  generatePDF3() {
    const doc = new jspdf.jsPDF();

    // const table = document.getElementById("tableRef");

    //console.log("table : ", table);

    let table: HTMLElement | null = document.getElementById("tableRef_" + this.myUniqueId);

    if (table) {
      html2canvas(table).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = doc.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
        doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        doc.save("table.pdf");
      }).catch((error) => {
        console.error("Error generating canvas:", error);
      });
    } else {
      console.error("Table element not found");
    }

  }

  printPreview() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      console.error("Failed to open print preview window. Please disable your popup blocker and try again.");
      return; // Exit the function if the print window couldn't be opened
    }
    printWindow.document.write("<html><head><title>" + this.tableTitleForExport!.replace(/\s+/g, '-') + "</title>");
    printWindow.document.write(
      '<style type = "text/css">#export_table_title_id { padding: 0 10px 10px 0px; font-weight: bold; display: block;} .total-footer-display{display: none;} table{-fs-table-paginate: paginate;}.mat-header-row { font-weight: bold; background-color: #a5a5a5; color: white; font-weight: bold; } button{  border: none;font-weight: bold;background-color: #a5a5a5;color: white;border: white;} .mat-column-ACTION_COLUMN { display:none;}table {font-family: arial, sans-serif;border-collapse: collapse;width: 100%;}td, th { border: 1px solid black;text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #F2F3F4;}</style>'
    );
    printWindow.document.write("</head>");
    printWindow.document.write("<body>");
    const div = document.getElementById("tableRef_" + this.myUniqueId);
if (div) {
  var divContents = div.innerHTML;
  const printWindow = window.open('', '', 'height=600,width=800');
  if(printWindow)
  {
    printWindow.document.write(divContents);
    printWindow.document.write("</body>");
    printWindow.document.write("</html>");
  }
  
} else {
  // Handle the case where the element is not found
  console.error("Element not found");
}
    
    // printWindow.document.write(divContents);
  }

  getDisplayedColumns(eventValue : any, value: any) {
    console.log("eventValue : ",eventValue.checked);
     console.log("value : ",value);
  }

  generateDynamicPDF() {

    let watermark;
    if (this.watermarkShow) {

      if (!this.watermarkLogoURL) {
        console.error('watermarkLogoURL image URL is not available.');
        return;
      }

      watermark = {
        image: this.watermarkLogoURL,
        width: this.watermarkSize[0],
        height: this.watermarkSize[1],
        opacity: 0.1,
      };
    }

    let pdfColumnHeader: any[] = [];

    const rows = this.dataSetForTable.map((item, index) => {
      const row = [index + 1]; // Index number (starts from 1)
      this.columnsHeaderName.slice(1).forEach((column) => {
        row.push(item[column.key]==null || item[column.key] == undefined ? '--': item[column.key]);
      });
      return row;
    });

    // console.log("rows : ", rows);

    this.columnsHeaderName.forEach((x) => {
      pdfColumnHeader.push({
        text: x.label,
        bold: true,
        fillColor: "#848884",
        color: "white",
      });
    });

    const docDefinition = {

      background: [
        {
          ...watermark,
          absolutePosition: { x: this.watermarkPosition[0], y: this.watermarkPosition[1] },
        },
      ],
      content: [
        {
          // style: "tableStyle",
          table: {
            headerRows: 1,
            body: [
              // pdfColumnHeader.map((col) => col.text),
              pdfColumnHeader,
              ...rows,
            ],
          },
        },
      ],
      margins: [120, 180, 120, 150],// [left, top, right, bottom] margins
      info: {
        title: this.tableTitleForExport//"My PDF Title", // Set the title here
      },
      //pageSize: 'A4',
      //pageOrientation: 'landscape',
      /*  header: {
         image: this.logoDataURL,
         //image: './logo.png', // Replace with the path to your logo image
         width: 100, // Adjust the width of the image as needed
       
       }, */
      header: {
        columns: [
          /*  {
             image: this.logoDataURL, // Logo image
             width: 70, // Adjust the width of the image as needed
             margin: [0, 10, 0, 0],
           }, */
          {
            text: this.tableTitleForExport,//"My PDF header Title",
            style: "heading",
            margin: [40, 15, 0, 5], // [left, top, right, bottom] margins
          },
        ],
        columnGap: 1, // Add gap between the logo and text
      },
      footer: (currentPage : any, pageCount : any) => {
        return {
          text:
            "Page " + currentPage.toString() + " of " + pageCount.toString(),
          alignment: "center",
          margin: [0, 10],
        };
      },
      styles: {
        heading: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10], // [left, top, right, bottom] margins
          font: 'NotoSansFontHindi'
        },
        /*  tableStyle: {
           margin: [150, 155, 160, 175]
         } */
      }, defaultStyle: {
        font: 'NotoSansFontHindi'
      },
      pageSize: {
        width: this.pdfPageSize[0],
        height: this.pdfPageSize[1], // A4 width: 841.995,height: 595.35, 
        orientation: "landscape",
      },
    };

    if (!this.watermarkShow) {
      delete (docDefinition as { background?: any }).background;
    }
    

    pdfMake.createPdf(docDefinition as any).download(this.tableTitleForExport!.replace(/\s+/g, '-') + "_.pdf");
    // pdfMake.createPdf(docDefinition as any).open();
  }

  openPrintDialog(): void {
    const columnName = this.columnNameForPrintPreview;
    const dialogRef = this.dialog.open(PrintTableComponent, {
      width: '1600px',
      //height: '70%',
      disableClose: false,
      panelClass: 'icon-outside',
      data: { title: this.tableTitleForExport, data: this.dataSetForTable, columnLabelNames: columnName }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('Dialog closed');
    });
  }


  incrementalFontSize: number = 14;
  incrementFontSize() {
    if (this.incrementalFontSize < 26) {
      this.incrementalFontSize += 2;
    }
  }

  decrementFontSize() {
    if (this.incrementalFontSize > 10) {
      this.incrementalFontSize -= 2;
    }
  }

  selection = new SelectionModel<any>(true, []);
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }


  selectedDataModel: any[] =[];
  actionOnSelectedRows() {
    this.selectedDataModel = [];
    this.selectedActionResponse.emit({ selectedData: this.selection.selected });
    /* this.selection.selected.forEach(s => {
      console.log("s => ", s); 
    }); */
    //console.log("selectedDataModel : ", this.selectedDataModel);

  }
}
