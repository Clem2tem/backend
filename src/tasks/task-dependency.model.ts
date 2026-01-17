import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Task } from './task.model';

@ObjectType()
export class TaskDependency {
    @Field(() => ID)
    id: string;

    @Field()
    taskId: string;

    @Field()
    dependsOnId: string;

    @Field()
    type: string; // 'sequence' | 'parallel' | 'concurrent'

    @Field(() => Task, { nullable: true })
    task?: Task;

    @Field(() => Task, { nullable: true })
    dependsOn?: Task;
}
