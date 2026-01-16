import { Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Site } from 'src/sites/site.model';
import { Task } from 'src/tasks/task.model';
import { Worker } from 'src/workers/worker.model';

@ObjectType()
export class Team {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  specialty: string;

  @Field(() => [Worker], { nullable: 'items' })
  workers?: Worker[];

  @Field(() => [Site], { nullable: 'items' })
  sites?: Site[];
  
  @Field(() => [Task], { nullable: 'items' })
  tasks?: Task[];
}