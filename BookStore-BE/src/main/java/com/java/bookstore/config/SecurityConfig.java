package com.java.bookstore.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.java.bookstore.entities.Role;
import com.java.bookstore.services.impl.AccountServiceImpl;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	private AccountServiceImpl accountService;

	@Autowired
	private JwtAuthenticationFilter jwtAuthenticationFilter;

	@Bean
	public SecurityFilterChain secutiryFilterChain(HttpSecurity http) throws Exception {
		http.cors(cors -> cors.configurationSource(corsConfigurationSource())).csrf(AbstractHttpConfigurer::disable)
				.authorizeHttpRequests(authorize -> {
					authorize
							.requestMatchers("/api/v1/user/**", "/api/v1/shopping-cart/**")
							.hasAnyAuthority(Role.USER.name(), Role.ADMIN.name()).requestMatchers("/api/v1/admin/**")
							.hasAuthority(Role.ADMIN.name())
							.requestMatchers("/api/v1/book/**", "/api/v1/authen/**", "/csrf/token",
									"/api/v1/payment/**", "/api/v1/socket/**", "/api/v1/actuator/**",
									"/api/v1/cookie/**")
							.permitAll().anyRequest().authenticated();
				}).sessionManagement(customizer -> customizer.sessionCreationPolicy(SessionCreationPolicy.ALWAYS))
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	public AuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
		authenticationProvider.setUserDetailsService(accountService.userDetailsService());
		authenticationProvider.setPasswordEncoder(passwordEncoder());
		return authenticationProvider;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000/"));
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
		configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type", "XSRF-TOKEN", "X-XSRF-TOKEN"));
		configuration.setAllowCredentials(true);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/api/v1/**", configuration);
		return source;
	}
}
