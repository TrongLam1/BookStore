import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Coupon } from './entities/coupon.entity';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>
  ) { }

  async createNewCoupon(createCouponDto: CreateCouponDto) {
    const { nameCoupon, valueCoupon, condition, quantity, expiredDate } = createCouponDto;

    const descriptionCoupon = `Áp dụng cho đơn hàng có giá trị từ ${condition} VNĐ.`;

    if (expiredDate < new Date()) throw new BadRequestException("Expired date is not valid.");

    return await this.couponRepository.save({
      nameCoupon, valueCoupon, condition, descriptionCoupon, quantity, expiredDate
    });
  };

  async updateCoupon(updateCouponDto: UpdateCouponDto) {
    const { id, valueCoupon, condition, quantity, expiredDate } = updateCouponDto;

    const coupon = await this.couponRepository.findOneBy({ id });

    if (expiredDate < new Date()) throw new BadRequestException("Expired date is not valid.");

    const descriptionCoupon = `Áp dụng cho đơn hàng có giá trị từ ${condition} VNĐ.`;

    return await this.couponRepository.save({
      ...coupon, condition, valueCoupon, descriptionCoupon, quantity, expiredDate
    })
  }

  async findAllCoupons(current: number, pageSize: number = 10) {
    if (!current || current == 0) current = 1;
    if (!pageSize || current == 0) pageSize = 10;

    const [listCoupons, totalItems] = await this.couponRepository.findAndCount({
      take: pageSize,
      skip: (current - 1) * pageSize,
    });

    const totalPages = Math.ceil(totalItems / pageSize);

    return { listCoupons, totalItems, totalPages };
  };

  async findAllCouponsValid(current: number, pageSize: number = 10) {
    if (!current || current == 0) current = 1;
    if (!pageSize || current == 0) pageSize = 10;

    const [listCoupons, totalItems] = await this.couponRepository.findAndCount({
      where: {
        isAvailable: true,
        expiredDate: MoreThanOrEqual(moment.utc().toDate())
      },
      take: pageSize,
      skip: (current - 1) * pageSize,
    });

    const totalPages = Math.ceil(totalItems / pageSize);

    return { listCoupons, totalItems, totalPages };
  }

  async removeCoupon(idCoupon: number) {
    const coupon = await this.couponRepository.findOneBy({ id: idCoupon });
    return await this.couponRepository.save({
      ...coupon, isAvailable: false
    })
  }

  async getOneCoupon(idCoupon: number) {
    return await this.couponRepository.findOneOrFail({
      where: { id: idCoupon },
      select: ['id', 'createdAt', 'nameCoupon', 'quantity', 'valueCoupon', 'descriptionCoupon', 'condition', 'expiredDate']
    })
  };

  async findCouponByName(name: string) {
    return await this.couponRepository.findOneOrFail({
      where: { nameCoupon: name },
      select: ['id', 'createdAt', 'nameCoupon', 'quantity', 'valueCoupon', 'descriptionCoupon', 'condition', 'expiredDate']
    })
  };

  async checkValidCouponApply(amountOrder: number, nameCoupon: string, couponsUser: string[]) {
    const coupon = await this.couponRepository.findOne({
      where: {
        nameCoupon: nameCoupon,
        isAvailable: true
      }
    });

    if (!coupon) throw new BadRequestException("Không tìm thấy coupon.");

    const now = new Date();
    if (coupon.expiredDate < now) throw new BadRequestException("Coupon đã hết hạn.");

    if (amountOrder < coupon.condition) throw new BadRequestException("Đơn hàng không đủ điều kiện.");

    if (coupon.quantity <= 0) throw new BadRequestException("Số lượng coupon đã hết.");

    if (couponsUser == null) return amountOrder - coupon.valueCoupon;

    if (couponsUser.includes(coupon.nameCoupon))
      throw new BadRequestException("Bạn đã sử dụng coupon này.");

    return amountOrder - coupon.valueCoupon;
  }
}
