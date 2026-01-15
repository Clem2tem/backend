import { Field, ID, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class Team {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  specialty: string;

  @Field(() => Int)
  members: number;
}