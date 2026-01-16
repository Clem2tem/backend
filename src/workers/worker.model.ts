import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Team } from 'src/teams/team.model';

@ObjectType()
export class Worker {
  @Field(() => ID)
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  phone?: string;

  @Field(() => Team, { nullable: true })
  team?: Team;

  @Field()
  teamId: string;
}