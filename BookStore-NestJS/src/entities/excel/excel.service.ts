/* eslint-disable @typescript-eslint/no-require-imports */
import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { ExcelBookDto } from '../books/dto/excel-book.dto';

@Injectable()
export class ExcelService {
  async extractDataFromExcel(file: Express.Multer.File) {
    const workbook = new ExcelJS.Workbook();

    try {
      await workbook.xlsx.load(file.buffer);
    } catch (error) {
      throw new Error(error);
    }

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new Error('Worksheet not found');
    }

    const data: ExcelBookDto[] = [];
    const images = [];

    // Extract and upload images
    for (const image of worksheet.getImages()) {
      const imageFile = workbook.getImage(+image.imageId);
      if (imageFile) {
        const buffer = imageFile.buffer;

        const mimeType = 'image/png';
        const extension = 'png';

        const file = {
          buffer: buffer,
          mimetype: mimeType,
          originalname: `image-${image.imageId}.${extension}`,
        } as Express.Multer.File;

        images.push(file);
      }
    }

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const rowData = row.values as Array<ExcelJS.CellValue>;

      const book: ExcelBookDto = {
        name: String(rowData[2]),
        category: String(rowData[3]),
        type: String(rowData[4]),
        brand: String(rowData[5]),
        description: String(rowData[6]),
        price: Number(rowData[7]),
        sale: Number(rowData[8]),
        inventory: Number(rowData[9]),
        file: null
      };

      data.push(book);
    });

    for (let i = 0; i < data.length; i++) {
      data[i].file = images[i];
    }

    return data;
  }
}