/* eslint-disable @typescript-eslint/no-require-imports */
import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { ExcelBookDto } from '../books/dto/excel-book.dto';
import { Book } from '../books/entities/book.entity';
import { Workbook } from 'exceljs';
import { Response } from 'express';
import moment from 'moment';
import axios from 'axios';

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
  };

  async exportDataToExcel(books: Book[], res: Response) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Books');

    worksheet.addRow([
      'ID', 'Created At', 'Updated At', 'Name', 'Price', 'Current Price', 'Sale', 'Inventory', 'Available', 'Rating', 'Type', 'Brand', 'Category', 'Description', 'Image'
    ]);

    for (const book of books) {

      worksheet.addRow([
        book.id,
        book.createdAt,
        book.updatedAt,
        book.name,
        book.price,
        book.currentPrice,
        book.sale,
        book.inventory,
        book.isAvailable ? 'Yes' : 'No',
        book.rating,
        book.type?.typeName,
        book.brand?.brandName,
        book.category?.categoryName,
        book.description,
      ]);

      if (book.imageUrl) {
        const imageBuffer = await this.getImageBuffer(book.imageUrl);

        if (imageBuffer) {
          const imageId = workbook.addImage({
            buffer: imageBuffer,
            extension: 'png',
          });

          // Set the row number (adjust as needed to match the row with data)
          const rowNum = worksheet.lastRow.number;

          worksheet.addImage(imageId, {
            tl: { col: 13, row: rowNum - 1 }, // Position for the image (column 14, rowNum)
            ext: { width: 100, height: 100 },
          });
        }
      }
    }

    const now = moment().format('YYYYMMDD_HHmmss');
    const filename = `book_${now}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    await workbook.xlsx.write(res);
    res.end();
  }

  private async getImageBuffer(imageUrl: string): Promise<Buffer | null> {
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      return Buffer.from(response.data, 'binary');
    } catch (error) {
      console.error(`Failed to download image from URL: ${imageUrl}`, error);
      return null;
    }
  }
}