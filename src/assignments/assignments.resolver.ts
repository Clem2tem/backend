import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Assignment } from './assignment.model';
import { PrismaService } from '../prisma.service';
import { GraphQLError } from 'graphql/error/GraphQLError';

@Resolver(() => Assignment)
export class AssignmentsResolver {
    constructor(private prisma: PrismaService) { }

    @Query(() => [Assignment])
    async assignments() {
        // On utilise "include" pour que GraphQL récupère aussi les infos du site et de l'équipe
        return this.prisma.assignment.findMany({
            include: { site: true, team: true },
        });
    }

    @Mutation(() => Assignment)
    async createAssignment(
        @Args('siteId') siteId: string,
        @Args('teamId') teamId: string,
        @Args('date') date: string,
    ) {
        try {
            return await this.prisma.assignment.create({
                data: {
                    siteId,
                    teamId,
                    date: new Date(date),
                },
                include: { site: true, team: true },
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new GraphQLError("Cette équipe est déjà occupée sur un autre chantier à cette date.", {
                    extensions: { code: 'CONFLICT' },
                });
            }
            throw error;
        }
    }
}