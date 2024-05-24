package com.java.bookstore.services;

import java.security.Principal;

import com.java.bookstore.requests.AuthenRequest;
import com.java.bookstore.requests.ChangePasswordRequest;
import com.java.bookstore.requests.ResetPasswordRequest;
import com.java.bookstore.requests.SignUpRequest;
import com.java.bookstore.responses.JwtAuthenticationResponse;

public interface IAuthenticationService {
	
	String signUp(SignUpRequest request);
	String createAccRoleAdmin(SignUpRequest request);
	String changePassword(ChangePasswordRequest request, Principal connectedUser);
	JwtAuthenticationResponse signIn(AuthenRequest request);
	JwtAuthenticationResponse refreshToken(String token);
	boolean verifyAccount(String email, String otp);
	String generateOtp(String email);
	String resetPassword(ResetPasswordRequest request);
	String logOut(String token);
	String lockedAccount(String email, boolean locked);
}
