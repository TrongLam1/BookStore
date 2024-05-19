package com.java.bookstore.services;

import java.io.IOException;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.java.bookstore.responses.PaginationResult;

public interface IBaseRedisService {
	
	boolean isRedisAvailable();

	String getKeyFromList(String dataType, String keyword, int pageNo, String sortBy, String sortDirection);

	String getKeyFromOne(String dataType, String keyword, Long id);
	
	List<String> getKeysWithPrefix(String prefix);
	
	<T> List<T> getValuesWithPrefix(String prefix, Class<T> clazz) throws IOException;

	void clearCacheWithPrefix(String prefix);

	<T> PaginationResult<T> readList(String key, Class<T> clazz) throws JsonMappingException, JsonProcessingException;

	<T> void saveList(PaginationResult<T> data, String key) throws JsonProcessingException;

	<T> T readOne(String key, Class<T> clazz) throws JsonMappingException, JsonProcessingException;

	<T> void saveOne(String key, T data) throws JsonProcessingException;
	
	<T> List<T> readListData(String key, Class<T> clazz) throws JsonMappingException, JsonProcessingException;

	<T> void saveListData(List<T> data, String key) throws JsonProcessingException;
}
