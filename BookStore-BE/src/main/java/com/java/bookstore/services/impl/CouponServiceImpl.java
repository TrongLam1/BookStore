package com.java.bookstore.services.impl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.java.bookstore.dtos.CouponDTO;
import com.java.bookstore.dtos.UserDTO;
import com.java.bookstore.entities.CouponEntity;
import com.java.bookstore.entities.UserEntity;
import com.java.bookstore.exceptions.InvalidCouponException;
import com.java.bookstore.exceptions.InvalidDateException;
import com.java.bookstore.exceptions.NotFoundException;
import com.java.bookstore.repositories.CouponRepository;
import com.java.bookstore.responses.PaginationResult;
import com.java.bookstore.services.ICouponService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class CouponServiceImpl implements ICouponService {

	@Autowired
	private CouponRepository couponRepo;
	
	@Autowired
	private UserServiceImpl userService;

	@Autowired
	private ModelMapper mapper;

	@Override
	public String save(CouponDTO coupon) {
		try {
			String expiredDate = coupon.getExpiredDate();
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
			LocalDate dateTime = LocalDate.parse(expiredDate, formatter);
			LocalDate currentDate = LocalDate.now();
			
			if (dateTime.isBefore(currentDate)) {
				throw new InvalidDateException("Ngày hết hạn không hợp lệ.");
			}
			
			CouponEntity newCoupon = new CouponEntity();
			
			boolean checkedName = couponRepo.findByName(coupon.getName()).isEmpty();
			
			if (!checkedName) {
				throw new RuntimeException("Tên coupon đã tồn tại.");
			}
			
			newCoupon = mapper.map(coupon, CouponEntity.class);
			newCoupon.setExpiredDate(dateTime);
			couponRepo.save(newCoupon);
			
			return "Success.";
		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}
	
	@Override
	public String update(CouponDTO coupon) {
		try {
			String expiredDate = coupon.getExpiredDate();
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
			LocalDate dateTime = LocalDate.parse(expiredDate, formatter);
			LocalDate currentDate = LocalDate.now();
			
			if (dateTime.isBefore(currentDate)) {
				throw new InvalidDateException("Ngày hết hạn không hợp lệ.");
			}
			
			CouponEntity oldCoupon = couponRepo.findById(coupon.getId()).get();
			
			CouponEntity checkName = couponRepo.findByName(coupon.getName()).get();
			
			if (checkName.getName().equals(coupon.getName()) && !checkName.getId().equals(coupon.getId())) {
				throw new RuntimeException("Dupplicate name.");
			} else {
				mapper.map(coupon, oldCoupon);
			}
			
			couponRepo.save(oldCoupon);
			
			return "Update success.";
		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}

	@Override
	public PaginationResult<CouponDTO> getAllCoupons(int pageNo, int pageSize) {
		try {
			pageNo = pageNo < 1 ? 1 : pageNo;
			PaginationResult<CouponDTO> results = new PaginationResult<>();
			Sort sort = Sort.by(Sort.Direction.DESC, "id");
			Pageable pageable = PageRequest.of(pageNo - 1, pageSize, sort);

			Page<CouponEntity> listCoupons = couponRepo.findAll(pageable);
			List<CouponDTO> listCouponsDTO = listCoupons.getContent().stream()
					.map(item -> mapper.map(item, CouponDTO.class)).collect(Collectors.toList());

			results.setData(listCouponsDTO);
			results.setTotalItems(listCoupons.getTotalElements());
			results.setTotalPages(listCoupons.getTotalPages());

			return results;
		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}

	@Override
	public Integer checkValidCoupon(String coupon,  String token, double totalPriceOrder) {
		try {
			CouponEntity couponEntity = couponRepo.findByName(coupon)
					.orElseThrow(() -> new NotFoundException("Not found coupon."));
			
			UserDTO userDTO = userService.getOneUser(token);
			UserEntity user = mapper.map(userDTO, UserEntity.class);
			
			Set<String> listCouponsUsed = user.getListCouponsUsed();
			boolean checkedUsed = listCouponsUsed.contains(coupon);
			System.out.println(couponEntity.getConditionCoupon());
			System.out.println("AA: " + totalPriceOrder);
			if (couponEntity.isValidCoupon()) {
				if (couponEntity.getQuantity() != 0) {
					if (checkedUsed) {
						throw new InvalidCouponException("Bạn đã sử dụng coupon này.");
					} else {
						if (couponEntity.getConditionCoupon() > totalPriceOrder) {
							throw new InvalidCouponException("Giá trị đơn hàng chưa đủ điều kiện để sử dụng coupon.");
						}
					}
				} else {
					throw new InvalidCouponException("Số lượng coupon đã hết.");
				}
			} else {
				throw new InvalidCouponException("Coupon đã hết hạn.");
			}
			
			return couponEntity.getValueCoupon();
		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}

	@Override
	public CouponDTO getOneCoupon(String name) {
		try {
			CouponEntity coupon = couponRepo.findByName(name)
					.orElseThrow(() -> new NotFoundException("Not found coupon."));
			return mapper.map(coupon, CouponDTO.class);
		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}

	@Override
	public String updateQuantityCoupon(String name) {
		try {
			CouponEntity coupon = couponRepo.findByName(name)
					.orElseThrow(() -> new NotFoundException("Not found coupon."));
			if (coupon.getQuantity() > 0) {
				coupon.setQuantity(coupon.getQuantity() - 1);
				couponRepo.save(coupon);
			}

			return "Update success";
		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}

	@Override
	public List<CouponDTO> findCouponsValid() {
		try {
			List<CouponEntity> listCoupons = couponRepo.findValidCoupons();
			List<CouponDTO> listCouponsDTO = listCoupons.stream()
					.map(item -> mapper.map(item, CouponDTO.class))
					.collect(Collectors.toList());
			return listCouponsDTO;
		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}
}
