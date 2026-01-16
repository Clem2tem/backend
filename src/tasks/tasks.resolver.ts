
import { Resolver, Mutation, Args, InputType, Field, Float } from '@nestjs/graphql';
import { Task } from './task.model';
import { PrismaService } from '../prisma.service';
import { IsNotEmpty, IsUUID, IsOptional, IsString, IsNumber } from 'class-validator';

@InputType()
class CreateTaskInput {
  @Field()
  @IsNotEmpty({ message: 'Le titre est requis' })
  @IsString()
  title: string;

  @Field()
  @IsUUID()
  siteId: string;

  @Field()
  @IsNotEmpty({ message: 'La catégorie est requise' })
  @IsString()
  category: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  teamId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  startDate?: string;
}

@Resolver(() => Task)
export class TasksResolver {
  constructor(private prisma: PrismaService) {}

  @Mutation(() => Task)
  async createTask(
    @Args('input') input: CreateTaskInput,
  ) {
    return this.prisma.task.create({
      data: {
        title: input.title,
        siteId: input.siteId,
        category: input.category,
        duration: input.duration ?? null,
        teamId: input.teamId ?? null,
        startDate: input.startDate ? new Date(input.startDate) : undefined,
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