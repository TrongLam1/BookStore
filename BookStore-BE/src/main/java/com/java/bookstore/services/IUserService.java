package com.java.bookstore.services;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import com.java.bookstore.dtos.UserDTO;
import com.java.bookstore.responses.PaginationResult;

public interface IUserService {

	UserDTO getOneUser(String token);
	UserDTO getUserByEmail(String email);
	String updateInfoUser(String token, UserDTO user);
	PaginationResult<UserDTO> getUsersByRole(int pageNo, int pageSize, String roleUser);
	PaginationResult<UserDTO> getAllUsers(int pageNo, int pageSize);
	ByteArrayInputStream getActualData() throws IOException;
}
