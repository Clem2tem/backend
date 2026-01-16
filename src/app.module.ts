import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaService } from './prisma.service';
import { SitesResolver } from './sites/sites.resolver';
import { TeamsResolver } from './teams/teams.resolver';
import { TasksResolver } from './tasks/tasks.resolver';
import { WorkersResolver } from './workers/workers.resolver';
import * as DataLoader from 'dataloader';

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
          // ...autres loaders si besoin
        };
      },
    }),
  ],
  controllers: [],
  providers: [PrismaService, SitesResolver, TeamsResolver, TasksResolver, WorkersResolver],
})
export class AppModule {}