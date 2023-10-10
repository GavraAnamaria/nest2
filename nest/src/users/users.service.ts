import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserRequestDto) {
    const foundUser = await this.findByEmail(createUserDto.email);

    if (foundUser) {
      throw new BadRequestException('User already exists');
    }
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    const hashedUser = { ...createUserDto, password: passwordHash };
    return await this.userRepo.save({
      ...hashedUser,
      role: '0client',
    });
  }

  findAll() {
    return this.userRepo.find();
  }

  findOne(id: string) {
    return this.userRepo.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userRepo.update(id, updateUserDto);

    return this.findOne(id);
  }

  async delete(id: string) {
    return this.userRepo.delete(id);
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({
      where: {
        email,
      },
    });
  }

  async confirm(email: string) {
    const user = await this.findByEmail(email);
    const role = '1' + user.role.substring(1);
    await this.userRepo.update(user.id, { role: role });
    return this.findOne(user.id);
  }

  async reset(userData: { email: string; password: string }) {
    const user = await this.findByEmail(userData.email);
    const passwordHash = await bcrypt.hash(userData.password, 10);
    await this.userRepo.update(user.id, { password: passwordHash });
    return this.findOne(user.id);
  }
}
