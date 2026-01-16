import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaService } from './prisma.service';
import { SitesResolver } from './sites/sites.resolver';
import { TeamsResolver } from './teams/teams.resolver';
import { TasksResolver } from './tasks/tasks.resolver';
import { WorkersResolver } from './workers/workers.resolver';
import DataLoader from 'dataloader';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true, // Active l'interface de test
      context: async () => {
        const prisma = new PrismaService();
        return {
          workerLoader: new DataLoader(async (teamIds: readonly string[]) => {
            const workers = await prisma.worker.findMany({
              where: { teamId: { in: [...teamIds] } }
            });
            return teamIds.map(teamId =>
              workers.filter(w => w.teamId === teamId)
            );
          }),
          teamLoader: new DataLoader(async (siteIds: readonly string[]) => {
            const teams = await prisma.team.findMany({
              where: { sites: { some: { id: { in: [...siteIds] } } } },
              include: { sites: true }
            });
            return siteIds.map(siteId =>
              teams.filter(team =>
                team.sites.some(site => site.id === siteId)
              )
            );
          }),
          teamByIdLoader: new DataLoader(async (teamIds: readonly string[]) => {
            const teams = await prisma.team.findMany({
              where: { id: { in: [...teamIds] } }
            });
            return teamIds.map(teamId =>
              teams.find(team => team.id === teamId) || null
            );
          }),
        };
      },
    }),
  ],
  controllers: [],
  providers: [PrismaService, SitesResolver, TeamsResolver, TasksResolver, WorkersResolver],
})
export class AppModule { }