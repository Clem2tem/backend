
import { Resolver, Mutation, Args, InputType, Field, Float } from '@nestjs/graphql';
import { Task } from './task.model';
import { PrismaService } from '../prisma.service';
import { IsNotEmpty, IsUUID, IsOptional, IsString, IsNumber } from 'class-validator';
import { Injectable } from '@nestjs/common';

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

@InputType()
class AddDependencyInput {
  @Field()
  @IsUUID()
  taskId: string;

  @Field()
  @IsUUID()
  dependsOnId: string;
}

@InputType()
class ChangePositionInput {
  @Field()
  @IsUUID()
  taskId: string;

  @Field(() => Float)
  @IsNumber()
  posX: number;

  @Field(() => Float)
  @IsNumber()
  posY: number;
}



@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(input: CreateTaskInput) {
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

  async addDependency(taskId: string, dependsOnId: string) {
    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        dependencies: { connect: { id: dependsOnId } },
      },
    });
  }

  async changePosition(ChangePositionInput: ChangePositionInput) {
    return this.prisma.task.update({
      where: { id: ChangePositionInput.taskId },
      data: {
        posX: ChangePositionInput.posX,
        posY: ChangePositionInput.posY,
      },
    });
  }

}

@Resolver(() => Task)
export class TasksResolver {
  constructor(private tasksService: TasksService) {}

  @Mutation()
  createTask(@Args('input') input: CreateTaskInput) {
    return this.tasksService.create(input);
  }

  // Mutation cruciale pour ton flux : Relier deux tâches
  @Mutation()
  addDependency(@Args('input') input: AddDependencyInput) {
    return this.tasksService.addDependency(input.taskId, input.dependsOnId);
  }

  @Mutation()
  updateTaskPosition(@Args('input') input: ChangePositionInput) {
    return this.tasksService.changePosition(input);
  }
}