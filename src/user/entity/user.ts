import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum MusicApp {
  APPLE_MUSIC = 'APPLE_MUSIC',
  SPOTIFY = 'SPOTIFY',
}

@Schema({ timestamps: true, collection: 'profile_data' })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, default: false })
  isEmailVerified: boolean;

  @Prop({ required: true, default: false })
  isUserEnabled: boolean;

  @Prop({ required: false, enum: MusicApp })
  primaryMusicApp: MusicApp;
}

export const UserSchema = SchemaFactory.createForClass(User);
