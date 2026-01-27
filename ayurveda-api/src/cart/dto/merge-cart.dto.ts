/**
 * Merge Cart DTO - for merging guest cart into user cart after login
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MergeCartDto {
  @ApiProperty({ description: 'Session ID of the guest cart to merge' })
  @IsString()
  sessionId: string;
}
