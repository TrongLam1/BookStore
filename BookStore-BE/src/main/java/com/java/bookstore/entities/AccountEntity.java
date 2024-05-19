package com.java.bookstore.entities;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "account")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class AccountEntity implements UserDetails {

	/**
	 * 
	 */
	private static final long serialVersionUID = 5499544388716492485L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@CreationTimestamp
	@Setter(value = AccessLevel.NONE)
	private Date createdDate;
	
	@LastModifiedDate
	@Setter(value = AccessLevel.NONE)
	private Date modifiedDate;
	
	@Column(unique = true)
	@Email(message = "Enter email")
	@NotBlank(message = "Email is mandatory.")
	private String email;
	
	@NotBlank(message = "Password is mandatory.")
	private String password;
	
	private Role role;
	
	private String refreshToken;
	
	private String otp;
	
	@Column(name = "otp_expiration_time")
	private LocalDateTime otpExpirationTime;
	
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "user_id")
	private UserEntity user;
	
	@Builder.Default
	private boolean isAccountLocked = false;
	
	public boolean isOtpValid() {
        if (otpExpirationTime == null) {
            return true;
        }
        return LocalDateTime.now().isBefore(otpExpirationTime);
    }

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority(role.name()));
	}

	@Override
	public String getUsername() {
		return email;
	}
	
	@Override
	public String getPassword() {
		return password;
	}

	@Override
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return !isAccountLocked;
	}
	
	public void setAccountLocked(boolean locked) {
        this.isAccountLocked = locked;
    }

	@Override
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return true;
	}
}
