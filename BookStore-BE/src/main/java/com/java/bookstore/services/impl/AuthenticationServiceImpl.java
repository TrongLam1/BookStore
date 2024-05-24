package com.java.bookstore.services.impl;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.java.bookstore.entities.AccountEntity;
import com.java.bookstore.entities.Role;
import com.java.bookstore.entities.UserEntity;
import com.java.bookstore.exceptions.InvalidTokenException;
import com.java.bookstore.exceptions.NotFoundException;
import com.java.bookstore.repositories.AccountRepository;
import com.java.bookstore.repositories.UserRepository;
import com.java.bookstore.requests.AuthenRequest;
import com.java.bookstore.requests.ChangePasswordRequest;
import com.java.bookstore.requests.ResetPasswordRequest;
import com.java.bookstore.requests.SignUpRequest;
import com.java.bookstore.responses.JwtAuthenticationResponse;
import com.java.bookstore.services.IAuthenticationService;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class AuthenticationServiceImpl implements IAuthenticationService {

	@Autowired
	private AccountRepository accountRepo;

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private JwtServiceImpl jwtService;

	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private MailSenderServiceImpl mailSender;

	@Override
	public String signUp(SignUpRequest request) {
		try {
			boolean isCheckedEmail = accountRepo.findByEmail(request.getEmail()).isPresent();
			
			if (!isCheckedEmail) {
				AccountEntity account = new AccountEntity();
				account.setEmail(request.getEmail());
				account.setPassword(passwordEncoder.encode(request.getPassword()));

				UserEntity user = new UserEntity();
				user.setEmail(request.getEmail());
				user.setRole(Role.USER);
				user.setUserName(request.getUsername());
				user.setListCouponsUsed(new HashSet<String>());

				account.setUser(user);
				account.setRole(Role.USER);

				accountRepo.save(account);
				userRepo.save(user);
				
				String otp = generateOtp(request.getEmail());
				
				mailSender.mailSenderVerifyAccount(account, otp);

				return "Đăng kí tài khoản thành công: " + request.getEmail();
			} else {
				throw new RuntimeException("Email đã được sử dụng.");
			}
		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}

	@Override
	public JwtAuthenticationResponse signIn(AuthenRequest request) {
		try {
			authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

			AccountEntity account = accountRepo.findByEmail(request.getEmail())
					.orElseThrow(() -> new NotFoundException("Không tìm thấy tài khoản."));
			
			if (!account.isVerified()) {
				throw new RuntimeException("Tài khoản chưa được xác thực.");
			}

			var jwtToken = jwtService.generateToken(account);
			var refreshToken = jwtService.generateRefreshToken(new HashMap<>(), account);

			JwtAuthenticationResponse jwtResponse = new JwtAuthenticationResponse();
			jwtResponse.setToken(jwtToken);
			jwtResponse.setRefreshToken(refreshToken);
			jwtResponse.setName(account.getEmail());
			jwtResponse.setExpiredTime(jwtService.isTokenExpiredTime(jwtToken));
			jwtResponse.setRole(account.getRole());
			account.setRefreshToken(refreshToken);

			accountRepo.save(account);

			return jwtResponse;
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}
	
	@Override
	public String changePassword(ChangePasswordRequest request, Principal connectedUser) {
		try {
			
			var user = (AccountEntity) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
			
			if (!passwordEncoder.matches(request.getOldPass(), user.getPassword())) {
				throw new IllegalStateException("Mật khẩu không đúng.");
			}
			
			user.setPassword(passwordEncoder.encode(request.getNewPass()));
			
			accountRepo.save(user);
			
			return "Success.";
		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}
	
	@Override
	public boolean verifyAccount(String email, String otp) {
		try {
			AccountEntity customer = accountRepo.findByEmail(email)
					.orElseThrow(() -> new NotFoundException("Thông tin khách hàng không tồn tại."));
			if (customer.getOtp().equals(otp) && customer.isOtpValid()) {
				customer.setVerified(true);
				customer.setOtp(null);
				customer.setOtpExpirationTime(null);
				accountRepo.save(customer);
				
				mailSender.mailSenderSignUp(customer);
				
				return true;
			}
			
			return false;
		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}

	@Override
	public String generateOtp(String email) {
		try {
			Random random = new Random();
			int randomNumber = random.nextInt(999999);
			String output = Integer.toString(randomNumber);
			while (output.length() < 6) {
				output = "0" + output;
			}

			AccountEntity user = accountRepo.findByEmail(email)
					.orElseThrow(() -> new NotFoundException("Không tìm thấy " + email));
			user.setOtp(output);
			user.setOtpExpirationTime(LocalDateTime.now().plusMinutes(5));
			accountRepo.save(user);

			return output;
		} catch (Exception e) {
			return "Error: " + e;
		}
	}
	
	@Override
	public String resetPassword(ResetPasswordRequest request) {
		AccountEntity customer = accountRepo.findByEmail(request.getEmail())
				.orElseThrow(() -> new NotFoundException("Thông tin khách hàng không tồn tại."));
		if (customer.getOtp().equals(request.getOtp()) && customer.isOtpValid()) {
			customer.setPassword(passwordEncoder.encode(request.getNewpass()));
			customer.setOtp(null);
			customer.setOtpExpirationTime(null);
			accountRepo.save(customer);
		}
		return "Success!";
	}

	@Override
	public JwtAuthenticationResponse refreshToken(String token) {
		try {
			AccountEntity account = accountRepo.findByRefreshToken(token)
					.orElseThrow(() -> new InvalidTokenException("Invalid refresh token."));
			
			var jwtToken = jwtService.generateToken(account);
			var refreshToken = jwtService.generateRefreshToken(new HashMap<>(), account);

			JwtAuthenticationResponse jwtResponse = new JwtAuthenticationResponse();
			jwtResponse.setToken(jwtToken);
			jwtResponse.setRefreshToken(refreshToken);
			jwtResponse.setName(account.getEmail());
			jwtResponse.setExpiredTime(jwtService.isTokenExpiredTime(jwtToken));
			account.setRefreshToken(refreshToken);

			accountRepo.save(account);

			return jwtResponse;
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public String createAccRoleAdmin(SignUpRequest request) {
		try {
			AccountEntity account = new AccountEntity();
			account.setEmail(request.getEmail());
			account.setPassword(passwordEncoder.encode(request.getPassword()));

			UserEntity user = new UserEntity();
			user.setEmail(request.getEmail());
			user.setRole(Role.ADMIN);

			account.setUser(user);
			account.setRole(Role.ADMIN);

			accountRepo.save(account);
			userRepo.save(user);
			
			return "Create new admin account success.";
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public String logOut(String token) {
		try {
			String email = jwtService.extractUsername(token);
			AccountEntity account = accountRepo.findByEmail(email)
					.orElseThrow(() -> new NotFoundException("Thông tin khách hàng không tồn tại."));
			account.setRefreshToken(null);
			
			return "Log out success.";
		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}

	@Override
	public String lockedAccount(String email, boolean locked) {
		try {
			AccountEntity account = accountRepo.findByEmail(email)
					.orElseThrow(() -> new NotFoundException("Thông tin khách hàng không tồn tại."));
			account.setAccountLocked(locked);
			
			UserEntity user = account.getUser();
			
			user.setAccountLocked(locked);
			
			accountRepo.save(account);
			
			userRepo.save(user);
			
			String mess = locked == true ? "Account " + email + " is locked" : "Acount " + email + " is unlocked.";
			
			return mess;
		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}
	
	@PostConstruct
	public void createAdminAccount() {
		boolean checkedAdmin = accountRepo.findFirstByRole(Role.ADMIN).isEmpty();

		if (checkedAdmin) {
			AccountEntity admin = new AccountEntity();
			admin.setEmail("admin@gmail.com");
			admin.setPassword(passwordEncoder.encode("12345678"));
			admin.setRole(Role.ADMIN);
			admin.setVerified(true);

			UserEntity admin1 = new UserEntity();
			admin1.setAccount(admin);
			admin1.setEmail("admin@gmail.com");
			admin1.setUserName("admin");

			admin.setUser(admin1);

			accountRepo.save(admin);
			userRepo.save(admin1);
		}
	}
}
