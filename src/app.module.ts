import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaService } from './prisma.service';
import { SitesResolver } from './sites/sites.resolver';
import { TeamsResolver } from './teams/teams.resolver';
import { AssignmentsResolver } from './assignments/assignments.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true, // Active l'interface de test
    }),
  ],
  controllers: [],
  providers: [PrismaService, SitesResolver, TeamsResolver, AssignmentsResolver],
})
export class AppModule {}