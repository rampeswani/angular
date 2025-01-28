import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class DynamicExportServiceService {

  /**
   * Generates an Excel file dynamically based on the provided data and configurations.
   * 
   * @param data - Array of data objects to populate the Excel sheet
   * @param columns - Array of column definitions with keys and configurations
   * @param title - Title of the Excel sheet (optional)
   * @param downloadFileName - Name of the file to be downloaded (default: 'download')
   * @param totalLabel - Label for the total row (default: 'Total')
   * @param titleAlignment - Alignment of the title ('left', 'center', 'right') (default: 'center')
   * @param generateDateTime - Whether to add a "Generated on" row (default: true)
   */
  GenerateExcelFile(
    data: any[],
    columns: any[],
    title: string = '',
    downloadFileName: string = 'download',
    totalLabel: string = 'Total',
    titleAlignment: 'left' | 'right' | 'center' = 'center',
    generateDateTime: boolean = true
  ) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Calculate the last column letter
    const lastColumnLetter = String.fromCharCode(64 + columns.length);

    // Add title
    if (title) {
      worksheet.mergeCells(`A1:${lastColumnLetter}1`);
      const titleCell = worksheet.getCell('A1');
      titleCell.value = title;
      titleCell.font = { bold: true, size: 14 };
      titleCell.alignment = { horizontal: titleAlignment, vertical: 'middle' };
    }

    // Add column headers
    const headerRow = worksheet.addRow(columns.map(col => col.columnName));
    headerRow.eachCell((cell, colNumber) => {
      const col = columns[colNumber - 1];
      cell.font = { bold: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.alignment = { horizontal: col.alignment as 'center' | 'left' | 'right' || 'left' };
    });

    // Add data rows
    const totals: { [key: string]: number } = {}; // Defined totals with specific type
    data.forEach((item, index) => {
      const row = worksheet.addRow([]);
      columns.forEach((col, colIndex) => {
        if (col.key === 'index') {
          row.getCell(colIndex + 1).value = index + 1;
        } else {
          row.getCell(colIndex + 1).value = item[col.key];
          if (col.totalRequired) {
            totals[col.key] = (totals[col.key] || 0) + item[col.key];
          }
        }
        row.getCell(colIndex + 1).alignment = { horizontal: col.alignment as 'center' | 'left' | 'right' || 'left' };
      });

      // Style cells
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Add total row if required
    const totalRequired = columns.some(col => col.totalRequired);
    if (totalRequired) {
      const totalRow = worksheet.addRow([]);
      totalRow.getCell(1).value = totalLabel;
      totalRow.getCell(1).font = { bold: true };
      totalRow.getCell(1).alignment = { horizontal: 'left' };

      columns.forEach((col, colIndex) => {
        if (col.totalRequired) {
          totalRow.getCell(colIndex + 1).value = totals[col.key];
          totalRow.getCell(colIndex + 1).font = { bold: true };
          totalRow.getCell(colIndex + 1).alignment = { horizontal: col.alignment as 'center' | 'left' | 'right' || 'left' };
        }
      });

      totalRow.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    }

    // Add generated date and time
    if (generateDateTime) {
      const dateTimeRow = worksheet.addRow([]);
      const dateTimeCell = dateTimeRow.getCell(1);
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-GB'); // Format as DD/MM/YYYY
      const formattedTime = now.toLocaleTimeString('en-GB'); // Format as HH:MM:SS
      dateTimeCell.value = `Generated on: ${formattedDate}, ${formattedTime}`;
      dateTimeCell.font = { bold: true };
      dateTimeCell.alignment = { horizontal: 'left' };
      worksheet.mergeCells(`A${dateTimeRow.number}:${lastColumnLetter}${dateTimeRow.number}`);
    }

    // Adjust column widths
    columns.forEach((col, index) => {
      worksheet.getColumn(index + 1).width = col.columnWidth || 15;
    });

    // Save the file
    workbook.xlsx.writeBuffer().then(buffer => {
      saveAs(new Blob([buffer]), `${downloadFileName}.xlsx`);
    });
  }
}
