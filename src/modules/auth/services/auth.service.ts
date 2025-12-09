import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/users/services/user.service';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from 'src/database/user.schema';
import { SignupDto } from 'src/modules/auth/dtos/signup.dto';
import { EmailService } from './email.service';
import { v4 as uuidv4 } from 'uuid';  // Generate unique OTP

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
    @InjectConnection() private readonly connection: Connection
  ) { }

  async validateUser(email: string, pass: string, role: UserRole): Promise<UserDocument> {
    const user = await this.userService.findByEmail(email);

    // if (user && !user.is_verified) {
    //   throw new BadRequestException({
    //     message: "Bad Request!",
    //     errors: ["Please verify your account first!"],
    //   });
    // }

    if (user && user.role != role) {
      throw new BadRequestException({
        message: "Bad Request!",
        errors: ["This user is not belongs to this role!"],
      });
    }

    if (user && await bcrypt.compare(pass, user.password)) {
      // const { password, ...result } = user;
      return user;
    }
    throw new UnauthorizedException({
      message: "Unauthorized",
      errors: ["Invalid credentials"]
    });
  }

  async login(user: UserDocument) {
    return {
      data: {
        access_token: this.jwtService.sign({ user }, { secret: process.env.JWT_SECRET }),
        user: user
      }
    };
  }

  // Method for user signup
  async signup(signupDto: SignupDto): Promise<any> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const { email, password } = signupDto;

      const userExists = await this.userService.findByEmail(email);
      if (userExists) {
        throw new BadRequestException({
          message: 'Bad Request!',
          errors: {
            email: ['User with this email already exists.'],
          },
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      signupDto.password = hashedPassword;

      // const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otp = "12345";
      signupDto.otp = otp;

      await this.userService.createUser(signupDto, session);

      // await this.emailService.sendOtpEmail(email, otp);

      await session.commitTransaction();
      session.endSession();

      return { message: 'OTP sent to your email. Please verify it.' };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException({
        message: "Internal Server Error!",
        errors: error
      });
    }
  }

  // Method to verify OTP
  async verifyOtp(email: string, otp: string): Promise<{}> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException({
        message: 'Not Found!',
        errors: {
          user: ['User not found!'],
        }
      });
    }

    if (!user.otp) {
      throw new NotFoundException({
        message: 'Not Found!',
        errors: {
          otp: ['OTP not found or expired'],
        }
      });
    }

    if (user.otp !== otp) {
      throw new BadRequestException({
        message: 'Bad Request!',
        errors: {
          otp: ['Invalid OTP'],
        },
      });
    }
    await this.userService.storeOtp(email, '');
    const updatedUser = await this.userService.findByEmail(email);

    return {
      message: 'Account verified successfully!',
      data: { access_token: this.jwtService.sign({ user }, { secret: process.env.JWT_SECRET }), user: updatedUser },
    };
  }
}