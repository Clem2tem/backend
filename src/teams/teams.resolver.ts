import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Team } from './team.model';
import { Worker } from '../workers/worker.model';
import { PrismaService } from '../prisma.service';

@Resolver(() => Team)
export class TeamsResolver {
  constructor(private prisma: PrismaService) {}

  // 1. Récupérer toutes les équipes avec leurs ouvriers
  @Query(() => [Team], { name: 'teams' })
  async getTeams() {
    return this.prisma.team.findMany({
      include: { workers: true, sites: true },
    });
  }

  // 2. Créer une nouvelle équipe
  @Mutation(() => Team)
  async createTeam(
    @Args('name') name: string,
    @Args('specialty') specialty: string,
  ) {
    return this.prisma.team.create({
      data: { name, specialty },
      include: { workers: true },
    });
  }

  // 3. Ajouter un ouvrier à une équipe spécifique
  @Mutation(() => Worker)
  async addWorkerToTeam(
    @Args('teamId') teamId: string,
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
    @Args('phone', { nullable: true }) phone?: string,
  ) {
    return this.prisma.worker.create({
      data: {
        firstName,
        lastName,
        phone,
        teamId,
      },
    });
  }
}