import { Field, ID, ObjectType, Float, Int } from '@nestjs/graphql';
import { Site } from 'src/sites/site.model';
import { Team } from 'src/teams/team.model';
import { TaskDependency } from './task-dependency.model';

@ObjectType()
export class Task {
    @Field(() => ID)
    id: string;

    @Field()
    title: string;

    @Field()
    category: string;

    @Field({ nullable: true })
    duration?: number;

    @Field({ nullable: true })
    startDate?: Date;

    @Field()
    siteId: string;

    @Field(() => Site)
    site: Site;

    @Field(() => Float, { nullable: true })
    posX?: number;

    @Field(() => Float, { nullable: true })
    posY?: number;

    @Field({ nullable: true })
    teamId?: string;

    @Field(() => Team, { nullable: true })
    team?: Team;

    @Field(() => [TaskDependency], { nullable: 'itemsAndList' })
    dependencies?: TaskDependency[];

    @Field(() => [TaskDependency], { nullable: 'itemsAndList' })
    dependents?: TaskDependency[];
}