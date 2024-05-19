package com.java.bookstore.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.java.bookstore.dtos.UserDTO;
import com.java.bookstore.responses.ResponseData;
import com.java.bookstore.responses.ResponseError;
import com.java.bookstore.services.impl.UserServiceImpl;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("api/v1/user")
@Slf4j
public class UserController {

	@Autowired
	private UserServiceImpl userService;

	@GetMapping("/profile")
	public ResponseData<?> getProfileUser(@RequestHeader("Authorization") String jwtToken) {
		try {
			log.info("Get profile.");
			String token = jwtToken.substring(7);
			return new ResponseData<>(HttpStatus.OK.value(), "Get profile success", userService.getOneUser(token));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), "Get profile fail.");
		}

	}

	@PostMapping("/update-info")
	public ResponseData<?> updateInfo(@RequestHeader("Authorization") String jwtToken, @RequestBody UserDTO user) {
		try {
			log.info("Update info.");
			String token = jwtToken.substring(7);
			return new ResponseData<>(HttpStatus.OK.value(), "Update success", userService.updateInfoUser(token, user));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), "Update info fail.");
		}
		
	}
}
