import { Resolver, Query } from '@nestjs/graphql';
import { Team } from './team.model';
import { PrismaService } from '../prisma.service';

@Resolver(() => Team)
export class TeamsResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [Team], { name: 'teams' })
  async getTeams() {
    return this.prisma.team.findMany();
  }
}