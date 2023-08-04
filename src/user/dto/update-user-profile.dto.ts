import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsString,
  arrayContains,
} from 'class-validator';
import { MusicApp } from '../entity/user';

export class UpdateUserProfileDto {
  @IsString()
  fullName: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(MusicApp, { each: true })
  musicApps: MusicApp[];
}
