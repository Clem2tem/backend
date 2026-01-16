import { Resolver, Mutation, Args, Float, Int } from '@nestjs/graphql';
import { Task } from './task.model';
import { PrismaService } from '../prisma.service';

@Resolver(() => Task)
export class TasksResolver {
  constructor(private prisma: PrismaService) {}

  @Mutation(() => Task)
  async createTask(
    @Args('title') title: string,
    @Args('siteId') siteId: string,
    @Args('category') category: string,
    @Args('duration', { nullable: true }) duration: number,
    @Args('teamId', { nullable: true }) teamId?: string,
    @Args('startDate', { nullable: true }) startDate?: string,
  ) {
    return this.prisma.task.create({
      data: {
        title,
        siteId,
        category,
        duration: duration ?? null,
        teamId: teamId ?? null,
        startDate: startDate ? new Date(startDate) : undefined,
      },
    });
  }

  // Mutation cruciale pour ton flux : Relier deux tâches
  @Mutation(() => Task)
  async addDependency(
    @Args('taskId') taskId: string,
    @Args('dependsOnId') dependsOnId: string,
  ) {
    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        dependencies: { connect: { id: dependsOnId } },
      },
    });
  }
}