package com.java.bookstore.services.impl;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.java.bookstore.dtos.UserDTO;
import com.java.bookstore.entities.Role;
import com.java.bookstore.entities.UserEntity;
import com.java.bookstore.exceptions.InvalidPageException;
import com.java.bookstore.exceptions.NotFoundException;
import com.java.bookstore.repositories.UserRepository;
import com.java.bookstore.responses.PaginationResult;
import com.java.bookstore.services.IUserService;
import com.java.bookstore.utils.ExcelUtility;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserServiceImpl extends BaseRedisServiceImpl implements IUserService {

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private JwtServiceImpl jwtService;

	@Autowired
	private ModelMapper mapper;

	@Override
	public UserDTO getOneUser(String token) {
		try {
			String email = jwtService.extractUsername(token);
			UserEntity user = userRepo.findByEmail(email).orElseThrow(() -> new NotFoundException("Not found user."));
			userRepo.save(user);
			return mapper.map(user, UserDTO.class);
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public String updateInfoUser(String token, UserDTO user) {
		try {
			String email = jwtService.extractUsername(token);
			UserEntity old = userRepo.findByEmail(email).orElseThrow(() -> new NotFoundException("Not found user."));
			old.setUserName(user.getUserName());
			old.setPhone(user.getPhone());
			userRepo.save(old);

			return "Update success!";
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public PaginationResult<UserDTO> getAllUsers(int pageNo, int pageSize) {
		try {
			if (pageNo < 1) {
				throw new InvalidPageException("Invalid Page.");
			}

			Pageable pageable = PageRequest.of(pageNo - 1, pageSize, Sort.by(Sort.Direction.ASC, "id"));
			long totalItems;

			Page<UserEntity> listUsers = userRepo.findByRole(Role.USER, pageable);
			List<UserDTO> listUsersDTO = listUsers.getContent().stream().map(item -> mapper.map(item, UserDTO.class))
					.collect(Collectors.toList());

			totalItems = listUsers.getTotalElements();
			int totalPages = listUsers.getTotalPages();

			PaginationResult<UserDTO> results = new PaginationResult<>();
			results.setData(listUsersDTO);
			results.setTotalItems(totalItems);
			results.setTotalPages(totalPages);

			return results;
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public UserDTO getUserByEmail(String email) {
		try {
			UserEntity user = userRepo.findByEmail(email)
					.orElseThrow(() -> new NotFoundException("Not found email " + email));
			return mapper.map(user, UserDTO.class);
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public ByteArrayInputStream getActualData() throws IOException {
		try {
			List<UserEntity> data = userRepo.findAll();
			ByteArrayInputStream byteArrayInputStream = ExcelUtility.dataUserToExcel(data);
			return byteArrayInputStream;
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public PaginationResult<UserDTO> getUsersByRole(int pageNo, int pageSize, String roleUser) {
		try {
			Role role = roleUser.equals("ADMIN") ? Role.ADMIN : Role.USER;
			pageNo = pageNo < 1 ? 1 : pageNo;
			
			PaginationResult<UserDTO> results = new PaginationResult<>();
			
			if (isRedisAvailable()) {
				String key = getKeyFromList("User", roleUser, pageNo, "id", "ASC");
				results = readList(key, UserDTO.class);
				if (results == null) {
					results = new PaginationResult<>();
					Sort sort = Sort.by(Sort.Direction.ASC, "id");
					Pageable pageable = PageRequest.of(pageNo - 1, pageSize, sort);
					Page<UserEntity> listUsers = userRepo.findByRole(role, pageable);
					List<UserDTO> listUsersDTO = listUsers.getContent()
							.stream()
							.map(item -> mapper.map(item, UserDTO.class))
							.collect(Collectors.toList());
					
					long totalItems = listUsers.getTotalElements();
					int totalPages = listUsers.getTotalPages();
					
					results.setData(listUsersDTO);
					results.setTotalItems(totalItems);
					results.setTotalPages(totalPages);
				}
			} else {
				Sort sort = Sort.by(Sort.Direction.ASC, "id");
				Pageable pageable = PageRequest.of(pageNo - 1, pageSize, sort);
				Page<UserEntity> listUsers = userRepo.findByRole(role, pageable);
				List<UserDTO> listUsersDTO = listUsers.getContent()
						.stream()
						.map(item -> mapper.map(item, UserDTO.class))
						.collect(Collectors.toList());
				
				long totalItems = listUsers.getTotalElements();
				int totalPages = listUsers.getTotalPages();
				
				results.setData(listUsersDTO);
				results.setTotalItems(totalItems);
				results.setTotalPages(totalPages);
			}
			
			return results;
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}
}
