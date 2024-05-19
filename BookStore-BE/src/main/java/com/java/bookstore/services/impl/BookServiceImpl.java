package com.java.bookstore.services.impl;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.java.bookstore.dtos.BookDTO;
import com.java.bookstore.entities.BookEntity;
import com.java.bookstore.entities.BookStatus;
import com.java.bookstore.exceptions.InvalidPageException;
import com.java.bookstore.exceptions.NotFoundException;
import com.java.bookstore.repositories.BookRepository;
import com.java.bookstore.responses.PaginationResult;
import com.java.bookstore.services.CloudinaryService;
import com.java.bookstore.services.IBookService;
import com.java.bookstore.utils.ExcelUtility;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class BookServiceImpl extends BaseRedisServiceImpl implements IBookService {
	
	@Autowired
	private ModelMapper mapper;

	@Autowired
	private BookRepository bookRepo;
	
	@Autowired
	private CloudinaryService cloudinaryService;
	
	@Autowired
	private ExcelUtility excel;
	
	private final static String DATA_TYPE_LIST = "books";
	
	private final static String DATA_TYPE_ONE = "book";
	
	@Override
	public String addNewBook(BookDTO book) {
		try {
			BookEntity bookEntity = new BookEntity();
			book.setStatus(BookStatus.Availabled);
			
			if (book.getId() == null) {
				bookEntity = mapper.map(book, BookEntity.class);
				bookRepo.save(bookEntity);
			} else {
				bookEntity = bookRepo.findById(book.getId()).get();
				book.setImage_id(bookEntity.getImage_id());
				book.setImage_url(bookEntity.getImage_url());
				mapper.map(book, bookEntity);
				bookRepo.save(bookEntity);
			}
			
			return "Success.";
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}
	
	@Override
	public String updateImgBook(Long id, String imgUrl, String imgId) {
		try {
			BookEntity book = bookRepo.findById(id).orElseThrow(() -> new NotFoundException("Not found book."));
			
			if (book.getImage_id() != null) {
				cloudinaryService.delete(book.getImage_id());
			}
			
			book.setImage_id(imgId);
			book.setImage_url(imgUrl);
			bookRepo.save(book);
			
			if (isRedisAvailable()) {
				clearCacheWithPrefix(DATA_TYPE_LIST);
				clearCacheWithPrefix(DATA_TYPE_ONE);
			}
			
			return "Update img success.";
		} catch (Exception e) {
			throw new RuntimeException(e.getMessage());
		}
	}
	
	@Override
	public String changeStatusBook(Long id, String status) {
		try {
			BookEntity book = bookRepo.findById(id).orElseThrow(() -> new NotFoundException("Not found book."));
			if (status.equals("Remove")) {
				book.setStatus(BookStatus.Removed);
			} else if (status.equals("SoldOut")) {
				book.setStatus(BookStatus.SoldOut);
			} else {
				book.setStatus(BookStatus.Availabled);
			}
			bookRepo.save(book);
			
			if (isRedisAvailable()) {
				clearCacheWithPrefix(DATA_TYPE_LIST);
				clearCacheWithPrefix(DATA_TYPE_ONE);
			}
			
			return "Change success.";
		} catch (Exception e) {
			throw new RuntimeException(e.getMessage());
		}
	}

	@Override
	public PaginationResult<BookDTO> getTop5Books() {
		try {
			PaginationResult<BookDTO> results = new PaginationResult<>();
			if (isRedisAvailable()) {
				String key = getKeyFromList("books", "top5", 1, "id", "asc");
				results = readList(key, BookDTO.class);
				
				if (results == null) {
					results = new PaginationResult<>();
					Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.ASC, "id"));
					List<BookDTO> listBooks = bookRepo.findTop5ByStatus(BookStatus.Availabled, pageable).stream()
							.map(item -> mapper.map(item, BookDTO.class))
							.collect(Collectors.toList());
					
					results.setData(listBooks);
					results.setTotalItems((long) 5);
					results.setTotalPages((int) 1);
					
					saveList(results, key);
					
				}
			} else {
				Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.ASC, "id"));
				List<BookDTO> listBooks = bookRepo.findTop5ByStatus(BookStatus.Availabled, pageable).stream()
						.map(item -> mapper.map(item, BookDTO.class))
						.collect(Collectors.toList());
				
				results.setData(listBooks);
				results.setTotalItems((long) 5);
				results.setTotalPages((int) 1);
			}
			
			return results;
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public BookDTO findById(Long id) {
		try {
			BookDTO bookDTO = new BookDTO();
			if (isRedisAvailable()) {
				String key = getKeyFromOne(DATA_TYPE_ONE, "id", id);
				bookDTO = readOne(key, BookDTO.class);
				if (bookDTO == null) {
					bookDTO = new BookDTO();
					BookEntity book = bookRepo.findById(id).orElseThrow(() -> new NotFoundException("Not found book id " + id));
					bookDTO = mapper.map(book, BookDTO.class);
					saveOne(key, bookDTO);
				}
			} else {
				BookEntity book = bookRepo.findById(id).orElseThrow(() -> new NotFoundException("Not found book id " + id));
				bookDTO = mapper.map(book, BookDTO.class);
			}
			
			return bookDTO;
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public PaginationResult<BookDTO> getTop5BooksByType(String type) {
		try {
			PaginationResult<BookDTO> results = new PaginationResult<>();
			
			if (isRedisAvailable()) {
				String key = getKeyFromList(DATA_TYPE_LIST, "top5_type", 1, "id", "asc");
				results = readList(key, BookDTO.class);
				if (results == null) {
					results = new PaginationResult<>();
					Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.ASC, "id"));
					List<BookDTO> listBooks = bookRepo.findTop5ByTypeAndStatusOrderByType(type, BookStatus.Availabled, pageable).stream()
							.map(item -> mapper.map(item, BookDTO.class)).collect(Collectors.toList());
					if (listBooks.size() == 0) {
						throw new NotFoundException("Not found book's type: " + type);
					}
					
					results.setData(listBooks);
					results.setTotalItems((long) 5);
					results.setTotalPages(1);
					
					saveList(results, key);
				}
			} else {
				Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.ASC, "id"));
				List<BookDTO> listBooks = bookRepo.findTop5ByTypeAndStatusOrderByType(type, BookStatus.Availabled, pageable).stream()
						.map(item -> mapper.map(item, BookDTO.class)).collect(Collectors.toList());
				if (listBooks.size() == 0) {
					throw new NotFoundException("Not found book's type: " + type);
				}
				
				results.setData(listBooks);
				results.setTotalItems((long) 5);
				results.setTotalPages(1);
			}
			return results;
		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}

	@Override
	public PaginationResult<BookDTO> findByNameContaining(String name) {
		try {
			PaginationResult<BookDTO> results = new PaginationResult<>();
			if (isRedisAvailable()) {
				String key = getKeyFromList(DATA_TYPE_LIST, name, 1, "name", "asc");
				results = readList(key, BookDTO.class);
				if (results == null) {
					List<BookDTO> listBooks = bookRepo.findByNameContainingAndStatus(name, BookStatus.Availabled).stream()
							.map(item -> mapper.map(item, BookDTO.class)).collect(Collectors.toList());
					if (listBooks.size() == 0) {
						throw new NotFoundException("Not found book's name: " + name);
					}
					
					results = new PaginationResult<>();
					results.setData(listBooks);
					results.setTotalItems((long) listBooks.size());
					results.setTotalPages(1);

					saveList(results, key);
				}
			} else {
				List<BookDTO> listBooks = bookRepo.findByNameContainingAndStatus(name, BookStatus.Availabled).stream()
						.map(item -> mapper.map(item, BookDTO.class)).collect(Collectors.toList());
				if (listBooks.size() == 0) {
					throw new NotFoundException("Not found book's name: " + name);
				}
				
				results = new PaginationResult<>();
				results.setData(listBooks);
				results.setTotalItems((long) listBooks.size());
				results.setTotalPages(1);
			}

			return results;
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public List<List<String>> getDistinctTypesAndBranchesOfCategory(String category) {
		try {
			List<List<String>> result = new ArrayList<>();
			if (isRedisAvailable()) {
				String keyType = "book:distinct:types:" + category;
				String keyBranch = "book:distinct:branches:" + category;
				List<String> types = readListData(keyType, String.class);
				List<String> branches = readListData(keyBranch, String.class);
				
				if (types != null) {
					result.add(types);
				} else {
					types = new ArrayList<>();
					types = bookRepo.findDistinctTypeByCategory(category);
					saveListData(types, keyType);
					result.add(types);
				}
				
				if (branches != null) {
					result.add(branches);
				} else {
					branches = new ArrayList<>();
					branches = bookRepo.findDistinctBranchByCategory(category);
					saveListData(branches, keyBranch);
					result.add(branches);
				}
			} else {
				List<String> types = bookRepo.findDistinctTypeByCategory(category);
				List<String> branches = bookRepo.findDistinctBranchByCategory(category);
				result.add(types);
				result.add(branches);
			}
			return result;
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}
	
	@Override
	public List<List<String>> getDistinctAllTypesAndBranches() {
		try {
			List<List<String>> result = new ArrayList<>();
			if (isRedisAvailable()) {
				String keyType = "book:distinct:types:all";
				String keyBranch = "book:distinct:branches:all";
				List<String> types = readListData(keyType, String.class);
				List<String> branches = readListData(keyBranch, String.class);
				
				if (types != null) {
					result.add(types);
				} else {
					types = new ArrayList<>();
					types = bookRepo.findDistinctType();
					saveListData(types, keyType);
					result.add(types);
				}
				
				if (branches != null) {
					result.add(branches);
				} else {
					branches = new ArrayList<>();
					branches = bookRepo.findDistinctBranch();
					saveListData(branches, keyBranch);
					result.add(branches);
				}
			} else {
				List<String> types = bookRepo.findDistinctType();
				List<String> branches = bookRepo.findDistinctBranch();
				result.add(types);
				result.add(branches);
			}
			
			return result;
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}
	
	@Override
	public List<String> getDistinctAllCategories() {
		try {
			List<String> result = new ArrayList<>();
			if (isRedisAvailable()) {
				String key = "book:distinct:category:all";
				result = readListData(key, String.class);
				if (result == null) {
					result = new ArrayList<>();
					result = bookRepo.findDistinctCategory();
					saveListData(result, key);
				}
			} else {
				result = bookRepo.findDistinctCategory();
			}
			
			return result;
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public PaginationResult<BookDTO> getAllBook(int pageNo, int pageSize, String sortBy, String sortDirection) {
		try {
			if (pageNo < 1) {
	            throw new InvalidPageException("Invalid Page.");
	        }
			
			PaginationResult<BookDTO> results = new PaginationResult<>();
			
			if (isRedisAvailable()) {
				String key = getKeyFromList(DATA_TYPE_LIST, "all", pageNo, sortBy, sortDirection);
				results = readList(key, BookDTO.class);
				
				if (results == null) {
					results = new PaginationResult<>();
					Sort.Direction direction = sortDirection.equals("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
			        Sort sort = Sort.by(direction, sortBy);
			        Pageable pageable = PageRequest.of(pageNo - 1, pageSize, sort);

			        long totalItems;
			        
			        Page<BookEntity> listBooks = bookRepo.findAllValidBook(BookStatus.Availabled, pageable);

			        List<BookDTO> listBooksDTO = listBooks.getContent().stream()
			                .map(item -> mapper.map(item, BookDTO.class))
			                .collect(Collectors.toList());
					
					totalItems = listBooks.getTotalElements();
			        int totalPages = listBooks.getTotalPages();
			        
					results.setData(listBooksDTO);
					results.setTotalItems(totalItems);
					results.setTotalPages(totalPages);
					saveList(results, key);
				}
			} else {
				Sort.Direction direction = sortDirection.equals("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
		        Sort sort = Sort.by(direction, sortBy);
		        Pageable pageable = PageRequest.of(pageNo - 1, pageSize, sort);

		        long totalItems;
		        
		        Page<BookEntity> listBooks = bookRepo.findAllValidBook(BookStatus.Availabled, pageable);

		        List<BookDTO> listBooksDTO = listBooks.getContent().stream()
		                .map(item -> mapper.map(item, BookDTO.class))
		                .collect(Collectors.toList());
				
				totalItems = listBooks.getTotalElements();
		        int totalPages = listBooks.getTotalPages();
		        
				results.setData(listBooksDTO);
				results.setTotalItems(totalItems);
				results.setTotalPages(totalPages);
			}
			
			return results;
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public PaginationResult<BookDTO> getBooksByCategory(int pageNo, int pageSize, String category, String sortBy,
			String sortDirection) {
		try {
			if (pageNo < 1) {
	            throw new InvalidPageException("Invalid Page.");
	        }
			
			PaginationResult<BookDTO> results = new PaginationResult<>();
			
			if (isRedisAvailable()) {
				String key = getKeyFromList(DATA_TYPE_LIST, category, pageNo, sortBy, sortDirection);
				results = readList(key, BookDTO.class);
				
				if (results == null) {
					results = new PaginationResult<>();
					Sort.Direction direction = sortDirection.equals("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
			        Sort sort = Sort.by(direction, sortBy);
			        Pageable pageable = PageRequest.of(pageNo - 1, pageSize, sort);

			        long totalItems;
			        
			        Page<BookEntity> listBooks = bookRepo.findByCategoryAndStatus(category, BookStatus.Availabled, pageable);
			        
			        List<BookDTO> listBooksDTO = listBooks.getContent().stream()
			                .map(item -> mapper.map(item, BookDTO.class))
			                .collect(Collectors.toList());
					
					totalItems = listBooks.getTotalElements();
			        int totalPages = listBooks.getTotalPages();

					results.setData(listBooksDTO);
					results.setTotalItems(totalItems);
					results.setTotalPages(totalPages);
					
					saveList(results, key);
				}
			} else {
				Sort.Direction direction = sortDirection.equals("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
		        Sort sort = Sort.by(direction, sortBy);
		        Pageable pageable = PageRequest.of(pageNo - 1, pageSize, sort);

		        long totalItems;
		        
		        Page<BookEntity> listBooks = bookRepo.findByCategoryAndStatus(category, BookStatus.Availabled, pageable);
		        
		        List<BookDTO> listBooksDTO = listBooks.getContent().stream()
		                .map(item -> mapper.map(item, BookDTO.class))
		                .collect(Collectors.toList());
				
				totalItems = listBooks.getTotalElements();
		        int totalPages = listBooks.getTotalPages();

				results.setData(listBooksDTO);
				results.setTotalItems(totalItems);
				results.setTotalPages(totalPages);
			}
			
			return results;
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public PaginationResult<BookDTO> getBooksByCategoryAndTypesAndBranches(int pageNo, int pageSize, String category,
			List<String> types, List<String> branches, String sortBy, String sortDirection) {
		try {
			if (pageNo < 1) {
				throw new InvalidPageException("Invalid Page.");
			}
			
			PaginationResult<BookDTO> results = new PaginationResult<>();
			
			String listTypes = "";
			String listBranches = "";
			
			for (int i = 0; i < types.size(); i++) {
				listTypes += types.get(i);
			}
			
			for (int i = 0; i < branches.size(); i++) {
				listBranches += branches.get(i);
			}
			
			if (isRedisAvailable()) {
				String keyword = category + ":" + listTypes + ":" + listBranches;
				String key = getKeyFromList(DATA_TYPE_LIST, keyword, pageNo, sortBy, sortDirection);
				
				results = readList(key, BookDTO.class);
				
				if (results == null) {
					results = new PaginationResult<>();
					Sort.Direction direction = sortDirection.equals("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
					Sort sort = Sort.by(direction, sortBy);
					Pageable pageable = PageRequest.of(pageNo - 1, pageSize, sort);

					Page<BookEntity> listBooks;
					long totalItems;

					if (types.size() > 0 && branches.size() > 0) {
						listBooks = bookRepo.findByCategoryAndTypeInAndBranchInAndStatus(types, branches, BookStatus.Availabled,
								category, pageable);
					} else if (types.size() > 0 && branches.size() == 0) {
						listBooks = bookRepo.findByCategoryAndTypeInAndStatus(types, BookStatus.Availabled, category, pageable);
					} else if (types.size() == 0 && branches.size() > 0) {
						listBooks = bookRepo.findByCategoryAndBranchInAndStatus(branches, BookStatus.Availabled, category,
								pageable);
					} else {
						listBooks = bookRepo.findByCategoryAndStatus(category, BookStatus.Availabled, pageable);
					}

					List<BookDTO> listBooksDTO = listBooks.getContent().stream().map(item -> mapper.map(item, BookDTO.class))
							.collect(Collectors.toList());

					totalItems = listBooks.getTotalElements();
					int totalPages = listBooks.getTotalPages();

					results.setData(listBooksDTO);
					results.setTotalItems(totalItems);
					results.setTotalPages(totalPages);
					
					saveList(results, key);
					
				}
			} else {
				Sort.Direction direction = sortDirection.equals("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
				Sort sort = Sort.by(direction, sortBy);
				Pageable pageable = PageRequest.of(pageNo - 1, pageSize, sort);

				Page<BookEntity> listBooks;
				long totalItems;

				if (types.size() > 0 && branches.size() > 0) {
					listBooks = bookRepo.findByCategoryAndTypeInAndBranchInAndStatus(types, branches, BookStatus.Availabled,
							category, pageable);
				} else if (types.size() > 0 && branches.size() == 0) {
					listBooks = bookRepo.findByCategoryAndTypeInAndStatus(types, BookStatus.Availabled, category, pageable);
				} else if (types.size() == 0 && branches.size() > 0) {
					listBooks = bookRepo.findByCategoryAndBranchInAndStatus(branches, BookStatus.Availabled, category,
							pageable);
				} else {
					listBooks = bookRepo.findByCategoryAndStatus(category, BookStatus.Availabled, pageable);
				}

				List<BookDTO> listBooksDTO = listBooks.getContent().stream().map(item -> mapper.map(item, BookDTO.class))
						.collect(Collectors.toList());

				totalItems = listBooks.getTotalElements();
				int totalPages = listBooks.getTotalPages();

				results.setData(listBooksDTO);
				results.setTotalItems(totalItems);
				results.setTotalPages(totalPages);
			}
			
			return results;

		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}

	@Override
	public PaginationResult<BookDTO> getBooksByTypesAndBranches(int pageNo, int pageSize, List<String> types,
			List<String> branches, String sortBy, String sortDirection) {
		try {
			if (pageNo < 1) {
				throw new InvalidPageException("Invalid Page.");
			}
			
			String listTypes = "";
			String listBranches = "";
			
			for (int i = 0; i < types.size(); i++) {
				listTypes += types.get(i);
			}
			
			for (int i = 0; i < branches.size(); i++) {
				listBranches += branches.get(i);
			}
			
			PaginationResult<BookDTO> results = new PaginationResult<>();
			if (isRedisAvailable()) {
				String keyword = "all:" + listTypes + ":" + listBranches;
				String key = getKeyFromList(DATA_TYPE_LIST, keyword, pageNo, sortBy, sortDirection);
				
				results = readList(key, BookDTO.class);
				
				if (results == null) {
					results = new PaginationResult<>();
					Sort.Direction direction = sortDirection.equals("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
					Sort sort = Sort.by(direction, sortBy);
					Pageable pageable = PageRequest.of(pageNo - 1, pageSize, sort);

					Page<BookEntity> listBooks;
					long totalItems;

					if (!types.isEmpty() && !branches.isEmpty()) {
						listBooks = bookRepo.findByTypeInAndBranchInAndStatus(types, branches, BookStatus.Availabled, pageable);
					} else if (!types.isEmpty() && branches.isEmpty()) {
						listBooks = bookRepo.findByTypeInAndStatus(types, BookStatus.Availabled, pageable);
					} else if (types.isEmpty() && !branches.isEmpty()) {
						listBooks = bookRepo.findByBranchInAndStatus(branches, BookStatus.Availabled, pageable);
					} else {
						listBooks = bookRepo.findAllValidBook(BookStatus.Availabled, pageable);
					}

					List<BookDTO> listBooksDTO = listBooks.getContent().stream().map(item -> mapper.map(item, BookDTO.class))
							.collect(Collectors.toList());

					totalItems = listBooks.getTotalElements();
					int totalPages = listBooks.getTotalPages();

					results.setData(listBooksDTO);
					results.setTotalItems(totalItems);
					results.setTotalPages(totalPages);
					
					saveList(results, key);
				}
			} else {
				Sort.Direction direction = sortDirection.equals("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
				Sort sort = Sort.by(direction, sortBy);
				Pageable pageable = PageRequest.of(pageNo - 1, pageSize, sort);

				Page<BookEntity> listBooks;
				long totalItems;

				if (!types.isEmpty() && !branches.isEmpty()) {
					listBooks = bookRepo.findByTypeInAndBranchInAndStatus(types, branches, BookStatus.Availabled, pageable);
				} else if (!types.isEmpty() && branches.isEmpty()) {
					listBooks = bookRepo.findByTypeInAndStatus(types, BookStatus.Availabled, pageable);
				} else if (types.isEmpty() && !branches.isEmpty()) {
					listBooks = bookRepo.findByBranchInAndStatus(branches, BookStatus.Availabled, pageable);
				} else {
					listBooks = bookRepo.findAllValidBook(BookStatus.Availabled, pageable);
				}

				List<BookDTO> listBooksDTO = listBooks.getContent().stream().map(item -> mapper.map(item, BookDTO.class))
						.collect(Collectors.toList());

				totalItems = listBooks.getTotalElements();
				int totalPages = listBooks.getTotalPages();

				results.setData(listBooksDTO);
				results.setTotalItems(totalItems);
				results.setTotalPages(totalPages);
			}
			
			return results;
		} catch (InvalidPageException e) {
			throw e;
		} catch (Exception e) {
			throw new RuntimeException(e.getMessage());
		}
	}

	@Override
	public void importFromExcel(MultipartFile file) throws IOException {
		try {
			List<BookEntity> listBooks = excel.excelToProductList(file.getInputStream());
			bookRepo.saveAll(listBooks);
			
			if (isRedisAvailable()) {
				clearCacheWithPrefix(DATA_TYPE_LIST);
				clearCacheWithPrefix(DATA_TYPE_ONE);
			}
		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}

	@Override
	public ByteArrayInputStream getActualData() throws IOException {
		try {
			List<BookEntity> data = bookRepo.findAll();
			ByteArrayInputStream byteArrayInputStream = ExcelUtility.dataBookToExcel(data);
			return byteArrayInputStream;
		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}

	@Override
	public List<BookDTO> getRandomBooksByCategory(String category) {
		try {
			List<BookDTO> listBooks = bookRepo.findRandomBooksByCategory(category)
					.stream()
					.map(item -> mapper.map(item, BookDTO.class))
					.collect(Collectors.toList());
			
			return listBooks;
		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}
}
