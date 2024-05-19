package com.java.bookstore.entities;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "book")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class BookEntity {

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
	private String name;
	
	private String category;
	
	private String type;
	
	private String branch;
	
	@Column(columnDefinition = "TEXT")
	private String description;
	
	@Min(value = 0)
	private int price;
	
	@Min(value = 0)
	private int sale;
	
	@Column(name = "sale_price")
	@Min(value = 0)
	private double salePrice;
	
	@Column(name = "inventory")
	@Min(value = 0)
	private int inventory_quantity;
	
	private String image_url;
	
	private String image_id;
	
	private BookStatus status;
	
	private double rating;
	
	@Builder.Default
	@OneToMany(mappedBy = "book")
	private List<CommentEntity> listComments = new ArrayList<>();
}
