package com.java.bookstore.controllers;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.HtmlUtils;

import com.java.bookstore.dtos.MailDTO;
import com.java.bookstore.requests.AuthenRequest;
import com.java.bookstore.requests.ChangePasswordRequest;
import com.java.bookstore.requests.ResetPasswordRequest;
import com.java.bookstore.requests.SignUpRequest;
import com.java.bookstore.responses.ResponseData;
import com.java.bookstore.responses.ResponseError;
import com.java.bookstore.services.impl.AuthenticationServiceImpl;
import com.java.bookstore.services.impl.MailSenderServiceImpl;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/authen")
@Slf4j
@RequiredArgsConstructor
public class AuthenticationController {

	private final AuthenticationServiceImpl authenticationService;

	private final MailSenderServiceImpl mailService;

	@PostMapping("/sign-up")
	public ResponseData<?> signUp(@Valid @RequestBody SignUpRequest request) {
		try {
			log.info("Sign up email: {}", request.getEmail());
			request.setEmail(HtmlUtils.htmlEscape(request.getEmail()));
			request.setPassword(HtmlUtils.htmlEscape(request.getPassword()));
			return new ResponseData<>(HttpStatus.CREATED.value(), "Đăng kí thành công.",
					authenticationService.signUp(request));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), "Đăng kí thất bại.");
		}
	}

	@PostMapping("/sign-in")
	public ResponseData<?> signIn(@Valid @RequestBody AuthenRequest request) {
		try {
			log.info("Sign in email: {}", request.getEmail());
			request.setEmail(HtmlUtils.htmlEscape(request.getEmail()));
			request.setPassword(HtmlUtils.htmlEscape(request.getPassword()));
			return new ResponseData<>(HttpStatus.OK.value(), "Đăng nhập thành công.", authenticationService.signIn(request));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/refresh-token/{token}")
	public ResponseData<?> refreshToken(@PathVariable("token") String token) {
		try {
			log.info("Refresh token");
			return new ResponseData<>(HttpStatus.OK.value(), "Refresh token success",
					authenticationService.refreshToken(token));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), "Refresh token failed.");
		}
	}

	@PostMapping("/mail-reset-password")
	public ResponseData<?> sendMail(@RequestParam("email") String email) {
		try {
			log.info("Send otp reset pass: {}", email);
			
			String escapeEmail = HtmlUtils.htmlEscape(email);
			String otp = authenticationService.generateOtp(escapeEmail);
			MailDTO mailDTO = new MailDTO();
			mailDTO.setSubject("Otp Reset Password");
			mailDTO.setMessage("Mã OTP reset mật khẩu: " + otp);
			mailService.mailSenderResetPassword(escapeEmail, mailDTO);
			return new ResponseData<>(HttpStatus.OK.value(), "Successfully to send the mail: " + escapeEmail);
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), "Send mail failed.");
		}
	}

	@PostMapping("/reset-pass")
	public ResponseData<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
		try {
			log.info("Reset password: {}", request.getEmail());
			return new ResponseData<>(HttpStatus.OK.value(), authenticationService.resetPassword(request));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), "Reset pass failed.");
		}
	}
	
	@GetMapping("/log-out")
	public ResponseData<?> logOut(@RequestHeader("Authorization") String token) {
		try {
			log.info("Log out");
			String jwtToken = token.substring(7);
			return new ResponseData<>(HttpStatus.OK.value(), authenticationService.logOut(jwtToken));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), "Reset pass failed.");
		}
	}
	
	@PostMapping("/change-pass")
	public ResponseData<?> changePassword(
			@Valid @RequestBody ChangePasswordRequest request,
			Principal connectedUser) {
		try {
			log.info("Change password.");
			return new ResponseData<>(HttpStatus.OK.value(), authenticationService.changePassword(request, connectedUser));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), "Change pass failed.");
		}
	}
}
