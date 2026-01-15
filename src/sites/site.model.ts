import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Site {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  address: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  status: string;
}