
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

@InputType()
class AddWorkerInput {
  @Field()
  @IsUUID()
  teamId: string;

  @Field()
  @IsNotEmpty({ message: 'Le prénom est requis' })
  @IsString()
  firstName: string;

  @Field()
  @IsNotEmpty({ message: 'Le nom est requis' })
  @IsString()
  lastName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;
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

  addWorkerToTeam(input: AddWorkerInput) {
    return this.prisma.worker.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        teamId: input.teamId,
      },
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

  // 3. Ajouter un ouvrier à une équipe spécifique
  @Mutation(() => Worker)
  addWorkerToTeam(
    @Args('input') input: AddWorkerInput,) {
    return this.teamsService.addWorkerToTeam(input);
  }
}