package com.java.bookstore.utils;

import java.io.*;
import java.net.URL;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.ClientAnchor;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Drawing;
import org.apache.poi.ss.usermodel.PictureData;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.util.IOUtils;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.java.bookstore.entities.BookEntity;
import com.java.bookstore.entities.BookStatus;
import com.java.bookstore.entities.UserEntity;
import com.java.bookstore.services.CloudinaryService;

import lombok.RequiredArgsConstructor;

@Service
public class ExcelUtility {

	@Autowired
	private CloudinaryService cloudinaryService;

	public static String TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

	static String SHEET = "product";

	public static boolean hasExcelFormat(MultipartFile file) {
		if (!TYPE.equals(file.getContentType())) {
			return false;
		}
		return true;
	}

	public List<BookEntity> excelToProductList(InputStream is) {
		try {
			Workbook workbook = new XSSFWorkbook(is);
			List pictures = workbook.getAllPictures();
			List<String> cloudinaryUrls = new ArrayList<>();
			List<String> imageIds = new ArrayList<>();

			String url = "";
			String imageId = "";

			// Process pictures
			for (Iterator it = pictures.iterator(); it.hasNext();) {
				PictureData pict = (PictureData) it.next();

				byte[] data = pict.getData();

				File tempFile = File.createTempFile("temp", null);
				try (FileOutputStream fos = new FileOutputStream(tempFile)) {
					fos.write(data);
				}
				Map result = cloudinaryService.uploadFile(tempFile);
				url = (String) result.get("url");
				imageId = (String) result.get("public_id");
				cloudinaryUrls.add(url);
				imageIds.add(imageId);
			}

			Sheet sheet = workbook.getSheet(SHEET);
			Iterator<Row> rows = sheet.iterator();
			List<BookEntity> productList = new ArrayList<BookEntity>();
			int rowNumber = 0;
			int i = 0;
			while (rows.hasNext()) {
				Row currentRow = rows.next();
				// skip header
				if (rowNumber == 0) {
					rowNumber++;
					continue;
				}
				Iterator<Cell> cellsInRow = currentRow.iterator();
				BookEntity product = new BookEntity();
				int cellIdx = 0;
				product.setImage_url(cloudinaryUrls.get(i));
				product.setImage_id(imageIds.get(i));
				product.setStatus(BookStatus.Availabled);
				while (cellsInRow.hasNext()) {
					Cell currentCell = cellsInRow.next();
					switch (cellIdx) {
					case 1:
						product.setName(currentCell.getStringCellValue());
						break;
					case 2:
						product.setCategory(currentCell.getStringCellValue());
						break;
					case 3:
						product.setType(currentCell.getStringCellValue());
						break;
					case 4:
						product.setBranch(currentCell.getStringCellValue());
						break;
					case 5:
						product.setDescription(currentCell.getStringCellValue());
						break;
					case 6:
						product.setPrice((int) currentCell.getNumericCellValue());
						break;
					case 7:
						product.setSale((int) currentCell.getNumericCellValue());
						break;
					case 8:
						product.setSalePrice((double) currentCell.getNumericCellValue());
						break;
					case 9:
						product.setInventory_quantity((int) currentCell.getNumericCellValue());
						break;
					default:
						break;
					}
					cellIdx++;
				}
				productList.add(product);
				i++;
			}
			workbook.close();
			return productList;
		} catch (IOException e) {
			throw new RuntimeException("fail to parse Excel file: " + e.getMessage());
		}
	}

	public static ByteArrayInputStream dataUserToExcel(List<UserEntity> data) throws IOException {
		Workbook workbook = new XSSFWorkbook();
		ByteArrayOutputStream output = new ByteArrayOutputStream();
		try {
			Sheet sheet = workbook.createSheet("sheet_user");

			Row row = sheet.createRow(0);

			String[] headers = { "id", "email", "user_name", "phone", "role", "account" };

			for (int i = 0; i < headers.length; i++) {
				Cell cell = row.createCell(i);
				cell.setCellValue(headers[i]);
			}

			int rowIndex = 1;
			for (UserEntity user : data) {
				Row dataRow = sheet.createRow(rowIndex);
				rowIndex++;

				dataRow.createCell(0).setCellValue(user.getId());
				dataRow.createCell(1).setCellValue(user.getEmail());
				dataRow.createCell(2).setCellValue(user.getUserName());
				dataRow.createCell(3).setCellValue(user.getPhone());
				dataRow.createCell(4).setCellValue(user.getRole().name());
				dataRow.createCell(5).setCellValue(user.getEmail());
			}

			workbook.write(output);

			return new ByteArrayInputStream(output.toByteArray());

		} finally {
			output.close();
			workbook.close();
		}
	}

	public static ByteArrayInputStream dataBookToExcel(List<BookEntity> data) throws IOException {
		Workbook workbook = new XSSFWorkbook();
		ByteArrayOutputStream output = new ByteArrayOutputStream();
		try {
			Sheet sheet = workbook.createSheet("sheet_book");

			Row row = sheet.createRow(0);

			String[] headers = { "Mã sản phẩm", "Thương hiệu", "Danh mục", "Tên sản phẩm", "Mô tả", "Số lượng tồn kho",
					"Giá", "Sale", "Giá sale", "Thể loại sản phẩm", "Hình ảnh" };

			for (int i = 0; i < headers.length; i++) {
				Cell cell = row.createCell(i);
				cell.setCellValue(headers[i]);
			}

			int rowIndex = 1;
			for (BookEntity book : data) {
				Row dataRow = sheet.createRow(rowIndex);
				rowIndex++;

				dataRow.createCell(0).setCellValue(book.getId());
				dataRow.createCell(1).setCellValue(book.getBranch());
				dataRow.createCell(2).setCellValue(book.getCategory());
				dataRow.createCell(3).setCellValue(book.getName());
				dataRow.createCell(4).setCellValue(book.getDescription());
				dataRow.createCell(5).setCellValue(book.getInventory_quantity());
				dataRow.createCell(6).setCellValue(book.getPrice());
				dataRow.createCell(7).setCellValue(book.getSale());
				dataRow.createCell(8).setCellValue(book.getSalePrice());
				dataRow.createCell(9).setCellValue(book.getType());
				if (book.getImage_url() != null) {
					addImageToExcel(sheet, rowIndex - 1, 10, book.getImage_url());
				}
			}

			workbook.write(output);

			return new ByteArrayInputStream(output.toByteArray());

		} finally {
			output.close();
			workbook.close();
		}
	}

	private static void addImageToExcel(Sheet sheet, int rowNum, int column, String imageUrl) throws IOException {
		InputStream inputStream = null;
		try {
			inputStream = new URL(imageUrl).openStream();
			byte[] bytes = IOUtils.toByteArray(inputStream);
			int pictureIdx = sheet.getWorkbook().addPicture(bytes, Workbook.PICTURE_TYPE_PNG); 
			CreationHelper helper = sheet.getWorkbook().getCreationHelper();
			Drawing drawing = sheet.createDrawingPatriarch();
			ClientAnchor anchor = helper.createClientAnchor();
			anchor.setCol1(column);
			anchor.setRow1(rowNum);
			anchor.setCol2(column + 1);
			anchor.setRow2(rowNum + 1);
			drawing.createPicture(anchor, pictureIdx);
		} finally {
			if (inputStream != null) {
				inputStream.close();
			}
		}
	}
}
