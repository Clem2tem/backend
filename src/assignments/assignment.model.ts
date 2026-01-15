import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Site } from '../sites/site.model';
import { Team } from '../teams/team.model';

@ObjectType()
export class Assignment {
  @Field(() => ID)
  id: string;

  @Field()
  date: Date;

  @Field(() => Site)
  site: Site;

  @Field(() => Team)
  team: Team;
}