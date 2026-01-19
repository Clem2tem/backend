
import { ResolveField, Parent, Context, Resolver, Query, Mutation, Args, InputType, Field } from '@nestjs/graphql';
import { Team } from './team.model';
import { Worker } from '../workers/worker.model';
import { PrismaService } from '../prisma.service';
import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';

@InputType()
class CreateTeamInput {
  @Field()
  @IsNotEmpty({ message: 'Le nom est requis' })
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty({ message: 'La spécialité est requise' })
  @IsString()
  specialty: string;
}



@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) { }

  get() {
    return this.prisma.team.findMany();
  }

  create(input: CreateTeamInput) {
    return this.prisma.team.create({
      data: {
        name: input.name,
        specialty: input.specialty,
      },
      include: { workers: true },
    });
  }

  
}


@Resolver(() => Team)
export class TeamsResolver {
  constructor(private teamsService: TeamsService) { }

  @Query(() => [Team], { name: 'teams' })
  async getTeams() {
    return this.teamsService.get();
  }

  @ResolveField(() => [Worker], { name: 'workers' })
  async workers(@Parent() team: Team, @Context() ctx) {
    return ctx.workerLoader.load(team.id);
  }

  // 2. Créer une nouvelle équipe
  @Mutation(() => Team)
  async createTeam(
    @Args('input') input: CreateTeamInput,) {
    return this.teamsService.create(input);
  }

}