import { Controller, Post, Body, BadRequestException, NotFoundException, InternalServerErrorException, Request, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { SignupDto } from 'src/modules/auth/dtos/signup.dto';
import { LoginDto } from '../dtos/login.dto';
import { UserService } from 'src/modules/users/services/user.service';
import { EmailService } from '../services/email.service';
import { resendOtpDto } from '../dtos/resendOtp.dto';
import { ForgotPasswordDto } from '../dtos/ForgotPasswordDto';
import { ResetPasswordDto } from '../dtos/ResetPasswordDto';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from 'src/database/user.schema';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private emailService: EmailService
  ) { }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    let user: any = await this.authService.validateUser(loginDto.email, loginDto.password, loginDto.role);
    if (loginDto.fcm_token) {
      user = await this.userService.updateUserData(user._id, { fcm_token: loginDto.fcm_token });
    }
    return this.authService.login(user);
  }

  // Signup endpoint
  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<any> {
    return this.authService.signup(signupDto);
  }

  // OTP verification endpoint
  @Post('verify-otp')
  async verifyOtp(@Body() body: { email: string; otp: string }): Promise<{}> {
    return this.authService.verifyOtp(body.email, body.otp);
  }

  @Post('resend-otp')
  async resendOtp(@Body() resendOtpDto: resendOtpDto): Promise<any> {
    const userExists = await this.userService.findByEmail(resendOtpDto.email);
    if (!userExists) {
      throw new NotFoundException({
        message: 'Bad Request!',
        errors: {
          email: ['User not found.'],
        },
      });
    }
    // const otp = Math.floor(10000 + Math.random() * 90000).toString();
    const otp = "12345";
    resendOtpDto.otp = otp;
    await this.userService.updateUserOtp(userExists.id, resendOtpDto);
    // await this.emailService.sendOtpEmail(resendOtpDto.email, otp);
    return { message: 'OTP resent to your email. Please verify it.' };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto): Promise<any> {
    const userExists = await this.userService.findByEmail(body.email);
    if (!userExists) {
      throw new NotFoundException({
        message: 'Bad Request!',
        errors: {
          email: ['User not found.'],
        },
      });
    }
    // const otp = Math.floor(10000 + Math.random() * 90000).toString();
    const otp = "12345";
    body.otp = otp;
    await this.userService.updateUserOtp(userExists.id, body);
    // await this.emailService.sendForgotOtpEmail(body.email, otp);
    return { message: 'Forgot Password OTP has been sent to your email. Please verify it.' };
  }

  @Post('reset-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.DRIVER)
  async resetPassword(@Body() body: ResetPasswordDto, @Request() req): Promise<any> {
    const user = req.user.user;
    const hashedPassword = await bcrypt.hash(body.password, 10);
    body.password = hashedPassword;
    const updatedUser = await this.userService.updateUserData(user._id, body);
    return { message: 'Account reset successfully!', data: updatedUser };
  }
}