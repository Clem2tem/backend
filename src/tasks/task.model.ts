import { Field, ID, ObjectType, Float, Int } from '@nestjs/graphql';
import { Site } from 'src/sites/site.model';
import { Team } from 'src/teams/team.model';

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

    @Field(() => [Task], { nullable: 'items' })
    dependencies?: Task[];

    @Field(() => [Task], { nullable: 'items' })
    dependents?: Task[];
}