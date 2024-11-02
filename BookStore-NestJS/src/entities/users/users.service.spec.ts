import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { RoleService } from '../role/role.service';
import { MailService } from 'src/mail/mail.service';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as utils from 'src/helpers/utils';
import { USER } from 'src/role.environment';

describe('UsersService', () => {
  let userService: UsersService;
  let userRepository: Repository<User>;
  let roleService: RoleService;
  let mailService: MailService;

  const codeExpired = new Date();
  codeExpired.setMinutes(codeExpired.getMinutes() + 5);

  const userData = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    code: 123456,
    codeExpired: codeExpired,
    isActive: false,
    roles: ['USER']
  };

  const mockUser: User = {
    id: 3,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    phone: null,
    address: null,
    createdAt: new Date(),
    updateAt: new Date(),
    isActive: false,
    code: 123456,
    codeExpired: codeExpired,
    refreshToken: null,
    couponsUsed: [],
    shoppingCart: null,
    orders: [],
    comments: [],
    roles: []
  }

  const userData1 = {
    id: 2,
    username: 'testuser1',
    email: 'test1@example.com',
    password: 'hashedPassword',
    code: 123456,
    codeExpired: codeExpired,
    isActive: false,
    roles: ['USER']
  };

  const mockRole = USER;

  const mockRoleService = {
    findRoleByName: jest.fn()
  };

  const mockMailService = {
    mailActivationAccount: jest.fn()
  };

  jest.mock('src/helpers/utils', () => ({
    hashPasswordHelper: jest.fn(),
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
        {
          provide: RoleService,
          useValue: mockRoleService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        }
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    roleService = module.get(RoleService);
    mailService = module.get(MailService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe("Register API", () => {
    it('should successfully register a user and send activation email', async () => {
      (userRepository.findOneBy as jest.Mock).mockResolvedValue(null);
      (mockRoleService.findRoleByName as jest.Mock).mockResolvedValue(mockRole);
      jest.spyOn(utils, 'hashPasswordHelper').mockResolvedValue('hashedPassword');
      (userRepository.save as jest.Mock).mockResolvedValue(userData);

      const createUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: '123',
      };

      const user = await userService.register(createUserDto);

      expect(mockRoleService.findRoleByName).toHaveBeenCalledWith('USER');
      expect(utils.hashPasswordHelper).toHaveBeenCalledWith(createUserDto.password);
      expect(user).toEqual({ id: userData.id, email: userData.email, username: userData.username });
    });

    it('should throw BadRequestException if email already exists', async () => {
      (userRepository.findOneBy as jest.Mock).mockResolvedValueOnce(userData);

      const createUserDto = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
      };

      const user = userService.register(createUserDto);
      await expect(user).rejects.toThrow(
        new BadRequestException(`Email ${userData.email} đã được sử dụng.`),
      );

      expect(userRepository.findOneBy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Active account API', () => {
    it('should return "Active account successfully."', async () => {
      (userRepository.findOneBy as jest.Mock).mockResolvedValue(userData);
      const result = await userService.activeAccount(userData.email, userData.code);
      expect(result).toEqual("Active account successfully.");
    });

    it('should wrong active code and throw bad request', async () => {
      (userRepository.findOneBy as jest.Mock).mockResolvedValue(userData);
      const result = userService.activeAccount(userData.email, 111111);
      await expect(result).rejects.toThrow(
        new BadRequestException("Mã kích hoạt không đúng."),
      );
    });

    it('should active code is expired and throw bad request', async () => {
      const expired = new Date();
      expired.setMinutes(expired.getMinutes() - 5)
      const newUserData = { ...userData, codeExpired: expired };

      (userRepository.findOneBy as jest.Mock).mockResolvedValue(newUserData);
      const result = userService.activeAccount(userData.email, userData.code);
      await expect(result).rejects.toThrow(
        new BadRequestException("Mã kích hoạt đã hết hạn."),
      );
    });
  });

  describe('Reactive code API', () => {
    it('should return "Send code active."', async () => {
      (userRepository.findOneBy as jest.Mock).mockResolvedValue(userData);

      const result = await userService.reactiveCode(userData.email);
      expect(result).toEqual("Send code active.");
      expect(userRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should not found user and throw not found exception', async () => {
      (userRepository.findOneBy as jest.Mock).mockResolvedValue(null);
      const result = userService.reactiveCode(userData.email);
      await expect(result).rejects.toThrow(
        new NotFoundException("Không tìm thấy thông tin tài khoản."),
      );

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: userData.email });
    })
  });

  describe('Reset password API', () => {
    it('should return "Reset password successfully."', async () => {
      jest.spyOn(utils, 'hashPasswordHelper').mockResolvedValue('newHashedPassword');
      (userRepository.save as jest.Mock).mockResolvedValue(mockUser);

      const newPass = 'newHash';
      const result = await userService.resetPassword(mockUser, newPass);
      expect(result).toEqual("Reset password successfully.");
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(utils.hashPasswordHelper).toHaveBeenCalledWith(newPass);
    });
  });

  describe('Logout API', () => {
    it('should return user with refresh token is null', async () => {
      (userRepository.save as jest.Mock).mockResolvedValue({ ...mockUser, refreshToken: null });
      const user = await userService.logout(mockUser);
      expect(user.refreshToken).toEqual(null);
    });
  });

  describe('Find one by email API', () => {
    it('should return user by email', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(userData);
      const user = await userService.findOneByEmail(userData.email);
      expect(user).toEqual(userData);
    });
  });

  describe('Get profile API', () => {
    it('should return user by user id', async () => {
      (userRepository.find as jest.Mock).mockResolvedValue(userData);
      const req = { user: { userId: 1 } };
      const user = await userService.getProfile(req);
      expect(user).toEqual(userData);
      expect(userRepository.find).toHaveBeenCalledWith({
        where: { id: req.user.userId },
        select: ["id", "username", "email", "phone", "createdAt", "updateAt", "isActive"],
      });
    });
  });

  describe('Save refresh token API', () => {
    it('should save and return new refresh token', async () => {
      (userRepository.save as jest.Mock).mockResolvedValue({ ...mockUser, refreshToken: 'newToken' });
      const newRefreshToken = await userService.saveRefreshToken(mockUser, 'newToken');
      expect(newRefreshToken).not.toEqual(null);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('Find all users API', () => {
    it('should return users with paginate', async () => {
      const listUsers = [userData, userData1];
      (userRepository.findAndCount as jest.Mock).mockResolvedValue([listUsers, listUsers.length]);

      const current = 1;
      const pageSize = 10;
      const sort = "ASC";
      const data = await userService.findAllUsers(current, pageSize, sort);

      expect(userRepository.findAndCount).toHaveBeenCalledWith({
        order: { id: 'ASC' },
        take: pageSize,
        skip: (current - 1) * pageSize,
        select: expect.anything(), // Ensure the selectField is used properly
      });

      expect(data.result).toEqual(listUsers);
      expect(data.totalItems).toEqual(2);
      expect(data.totalPages).toEqual(1);
    });
  });

  describe('Find users by name contains API', () => {
    it('should return list users by name with paginate', async () => {
      const listUsers = [userData, userData1];
      (userRepository.findAndCount as jest.Mock).mockResolvedValue([listUsers, listUsers.length]);

      const current = 1;
      const pageSize = 10;
      const sort = "ASC";
      const name = "test";
      const data = await userService.findUsersByNameContains(current, pageSize, sort, name);

      expect(userRepository.findAndCount).toHaveBeenCalledWith({
        where: { username: Like('%' + name + '%') },
        order: { username: 'ASC' },
        take: pageSize,
        skip: (current - 1) * pageSize
      });

      expect(data.result).toEqual(listUsers);
      expect(data.totalItems).toEqual(2);
      expect(data.totalPages).toEqual(1);
    });
  });

  describe('Update user API', () => {
    it('should return user after update without password', async () => {
      const updateUserDTO = {
        username: 'update_test',
        password: null,
        phone: '1111111111',
      };
      const req = { user: { userId: 1 } };
      const updateUser = {
        ...userData,
        username: updateUserDTO.username,
        phone: updateUserDTO.phone
      };
      (userRepository.findOneBy as jest.Mock).mockResolvedValue(userData);
      (userRepository.save as jest.Mock).mockResolvedValue(updateUser);

      const user = await userService.updateUser(req, updateUserDTO);
      expect(user).toEqual(
        {
          id: updateUser.id, username: updateUser.username,
          phone: updateUser.phone, email: updateUser.email
        }
      );
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return user after update with password', async () => {
      const updateUserDTO = {
        username: 'update_test',
        password: 'newHash',
        phone: '1111111111',
      };
      const req = { user: { userId: 1 } };
      const updateUser = {
        ...userData,
        username: updateUserDTO.username,
        phone: updateUserDTO.phone,
        password: 'newHashedPassword'
      };

      (userRepository.findOneBy as jest.Mock).mockResolvedValue(userData);
      (userRepository.save as jest.Mock).mockResolvedValue(updateUser);
      jest.spyOn(utils, 'hashPasswordHelper').mockResolvedValue('newHashedPassword');

      const user = await userService.updateUser(req, updateUserDTO);
      expect(utils.hashPasswordHelper).toHaveBeenCalledWith(updateUserDTO.password);
    });

    it('should not found user and throw exception', async () => {
      const updateUserDTO = {
        username: 'update_test',
        password: 'newHash',
        phone: '1111111111',
      };
      const req = { user: { userId: 1 } };

      (userRepository.findOneBy as jest.Mock).mockResolvedValue(null);
      const user = userService.updateUser(req, updateUserDTO);
      await expect(user).rejects.toThrow(
        new NotFoundException("Not found user"),
      );
    });
  });
});
