import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryProductsDto {
  @IsOptional()
  @IsString()
  q?: string;

 
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  minPriceCents?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxPriceCents?: number;

  @IsOptional()
  @IsIn(['relevance', 'priority', 'price_asc', 'price_desc', 'name_asc', 'name_desc'])
  sort?: 'relevance' | 'priority' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(48)
  pageSize?: number;
}
