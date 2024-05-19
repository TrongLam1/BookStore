package com.java.bookstore.services;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.java.bookstore.dtos.BookDTO;
import com.java.bookstore.responses.PaginationResult;

public interface IBookService {

	String addNewBook(BookDTO book); 
	String updateImgBook(Long id, String imgUrl, String imgId); 
	String changeStatusBook(Long id, String status); 
	void importFromExcel(MultipartFile file) throws IOException; 
	BookDTO findById(Long id); 
	PaginationResult<BookDTO> getTop5BooksByType(String type); 
	PaginationResult<BookDTO> getTop5Books();
	PaginationResult<BookDTO> findByNameContaining(String name);
	List<BookDTO> getRandomBooksByCategory(String category);
	List<String> getDistinctAllCategories();
	List<List<String>> getDistinctTypesAndBranchesOfCategory(String category); 
	List<List<String>> getDistinctAllTypesAndBranches(); //
	PaginationResult<BookDTO> getAllBook(int pageNo, int pageSize, String sortBy, String sortDirection); 
	PaginationResult<BookDTO> getBooksByCategory(int pageNo, int pageSize, String category, String sortBy, String sortDirection);
	PaginationResult<BookDTO> getBooksByCategoryAndTypesAndBranches(
			int pageNo, int pageSize, 
			String category, List<String> types, 
			List<String> branches, String sortBy, String sortDirection); 
	PaginationResult<BookDTO> getBooksByTypesAndBranches(
			int pageNo, int pageSize, 
			List<String> types, List<String> branches, String sortBy, String sortDirection);
	ByteArrayInputStream getActualData() throws IOException;
}
