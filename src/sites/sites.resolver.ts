import { Resolver, Query, Mutation, Args, InputType, Field, Context, Parent, ResolveField } from '@nestjs/graphql';
import { Site } from './site.model';
import { PrismaService } from '../prisma.service';
import { Task } from 'src/tasks/task.model';
import { Team } from 'src/teams/team.model';

@InputType()
class CreateSiteInput {
  @Field()
  name: string;

  @Field({ nullable: true }) // Permet de ne pas mettre d'adresse à la création
  address?: string;

  @Field({ defaultValue: 'PLANNED' })
  status: string;

  @Field()
  startDate: string;

  @Field({ nullable: true })
  endDate?: string;
}


@Resolver(() => Site)
export class SitesResolver {
  constructor(private prisma: PrismaService) { }

  @Query(() => [Site], { name: 'sites' })
  async getSites() {
    return this.prisma.site.findMany(); // Sans include
  }

  @ResolveField(() => [Team], { name: 'assignedTeams' })
  async assignedTeams(@Parent() site: Site, @Context() ctx) {
    return ctx.teamLoader.load(site.id);
  }

  @ResolveField(() => [Task], { name: 'tasks' })
  async tasks(@Parent() site: Site, @Context() ctx) {
    return ctx.taskLoader.load(site.id);
  }

  @Mutation(() => Site, { name: 'createSite' })
  async createSite(
    @Args('createSiteInput') input: CreateSiteInput
  ) {
    return this.prisma.site.create({
      data: {
        name: input.name,
        address: input.address,
        status: input.status,
        startDate: new Date(input.startDate),
        endDate: input.endDate ? new Date(input.endDate) : null,
      },
      include: {
        assignedTeams: true,
        tasks: true,
      }
    });
  }
}