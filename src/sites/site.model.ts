import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Team } from '../teams/team.model';
import { Task } from '../tasks/task.model';

@ObjectType()
export class Site {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({nullable: true})
  address?: string;

  @Field()
  status: string;

  @Field()
  startDate: Date;

  @Field({nullable: true})
  endDate?: Date;

  @Field(() => [Team], { nullable: 'items' })
  assignedTeams?: Team[];

  @Field(() => [Task], { nullable: 'items' })
  tasks?: Task[];
}