package com.java.bookstore.entities;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotBlank(message = "Email is mandatory.")
	//@Column(unique = true)
	private String email;
	
	@Column(name = "user_name")
	private String userName;
	
	@Column(unique = true)
	@Pattern(regexp = "\\d{10}")
	private String phone;
	
	private Role role;
	
	@Builder.Default
	private boolean isAccountLocked = false;
	
	@OneToOne(mappedBy = "user")
	private AccountEntity account;
	
	@OneToOne(mappedBy = "user")
	private ShoppingCartEntity shoppingCart;
	
	@Builder.Default
	@OneToMany(mappedBy = "user")
	private List<OrderEntity> listOrders = new ArrayList<OrderEntity>();
	
	@Builder.Default
	private Set<String> listCouponsUsed = new HashSet<>();
}
