import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/user';
import bcryptjs from 'bcryptjs';
import { sendVerificationEmail } from '@/helper/sendVerificationEmail';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Username is already taken',
        }),
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcryptjs.hash(password, 10);

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'User already exists with this email',
          }),
          { status: 400 }
        );
      } else {
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const expiryDate = new Date(Date.now() + 3600000);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: emailResponse.message,
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User registered successfully. Please verify your email',
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log('Error registering user', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error registering user',
      }),
      { status: 500 }
    );
  }
}
