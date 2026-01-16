
import { ResolveField, Parent, Context, Resolver, Query, Mutation, Args, InputType, Field } from '@nestjs/graphql';
import { Team } from './team.model';
import { Worker } from '../workers/worker.model';
import { PrismaService } from '../prisma.service';
import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

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

@Resolver(() => Team)
export class TeamsResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [Team], { name: 'teams' })
  async getTeams() {
    return this.prisma.team.findMany();
  }

  @ResolveField(() => [Worker], { name: 'workers' })
  async workers(@Parent() team: Team, @Context() ctx) {
    return ctx.workerLoader.load(team.id);
  }

  // 2. Créer une nouvelle équipe
  @Mutation(() => Team)
  async createTeam(
    @Args('input') input: CreateTeamInput,
  ) {
    return this.prisma.team.create({
      data: {
        name: input.name,
        specialty: input.specialty,
      },
      include: { workers: true },
    });
  }

  // 3. Ajouter un ouvrier à une équipe spécifique
  @Mutation(() => Worker)
  async addWorkerToTeam(
    @Args('input') input: AddWorkerInput,
  ) {
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