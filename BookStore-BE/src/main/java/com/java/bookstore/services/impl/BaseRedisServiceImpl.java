package com.java.bookstore.services.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.java.bookstore.responses.PaginationResult;
import com.java.bookstore.services.IBaseRedisService;

@Service
public class BaseRedisServiceImpl implements IBaseRedisService {

	@Autowired
	private RedisTemplate<String, Object> redisTemplate;

	@Autowired
	private ObjectMapper redisObjectMapper;
	
	@Override
	public boolean isRedisAvailable() {
		try {
            String result = redisTemplate.getConnectionFactory().getConnection().ping();
            return "PONG".equals(result);
        } catch (Exception e) {
            return false;
        }
	}

	@Override
	public void clearCacheWithPrefix(String prefix) {
		List<String> keys = this.getKeysWithPrefix(prefix);
		redisTemplate.delete(keys);
	}

	@Override
	public String getKeyFromList(String dataType, String keyword, int pageNo, String sortBy, String sortDirection) {
		String key = String.format(dataType + ":" + keyword + ":" + pageNo + ":" + sortBy + ":" + sortDirection);
		return key;
	}

	@Override
	public String getKeyFromOne(String dataType, String keyword, Long id) {
		String key = String.format(dataType + ":" + keyword + ":" + id);
		return key;
	}

	@Override
	public <T> PaginationResult<T> readList(String key, Class<T> clazz) throws JsonMappingException, JsonProcessingException {
		String json = (String) redisTemplate.opsForValue().get(key);
		PaginationResult<T> data = json != null
				? redisObjectMapper.readValue(json, new TypeReference<PaginationResult<T>>() {
				})
				: null;

		return data;
	}

	@Override
	public <T> void saveList(PaginationResult<T> data, String key) throws JsonProcessingException {
		String json = redisObjectMapper.writeValueAsString(data);
		redisTemplate.opsForValue().set(key, json);
	}

	@Override
	public <T> T readOne(String key, Class<T> clazz) throws JsonMappingException, JsonProcessingException {
		String json = (String) redisTemplate.opsForValue().get(key);
		T data = json != null ? redisObjectMapper.readValue(json, clazz) : null;
		return data;
	}

	@Override
	public <T> void saveOne(String key, T data) throws JsonProcessingException {
		String json = redisObjectMapper.writeValueAsString(data);
		redisTemplate.opsForValue().set(key, json);
	}

	@Override
	public <T> List<T> readListData(String key, Class<T> clazz) throws JsonMappingException, JsonProcessingException {
		String json = (String) redisTemplate.opsForValue().get(key);
		List<T> data = json != null
				? redisObjectMapper.readValue(json, new TypeReference<List<T>>() {
				})
				: null;

		return data;
	}

	@Override
	public <T> void saveListData(List<T> data, String key) throws JsonProcessingException {
		String json = redisObjectMapper.writeValueAsString(data);
		redisTemplate.opsForValue().set(key, json);
	}
	
	public List<String> getKeysWithPrefix(String prefix) {
	    Set<String> keys = redisTemplate.keys(prefix + "*");
	    return new ArrayList<>(keys);
	}

	public <T> List<T> getValuesWithPrefix(String prefix, Class<T> clazz) throws IOException {
	    List<T> values = new ArrayList<>();
	    Set<String> keys = redisTemplate.keys(prefix + "*");
	    for (String key : keys) {
	        String json = (String) redisTemplate.opsForValue().get(key);
	        T value = redisObjectMapper.readValue(json, clazz);
	        values.add(value);
	    }
	    return values;
	}
}
