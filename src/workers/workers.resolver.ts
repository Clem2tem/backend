import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Worker } from './worker.model';
import { PrismaService } from '../prisma.service';

@Resolver(() => Worker)
export class WorkersResolver {
    constructor(private prisma: PrismaService) { }

    // Pour voir tous les ouvriers du système (pratique pour une vue RH)
    @Query(() => [Worker], { name: 'workers' })
    async getWorkers() {
        return this.prisma.worker.findMany({
            include: { team: true },
        });
    }

    // Pour modifier les coordonnées d'un ouvrier (ex: changement de téléphone)
    @Mutation(() => Worker)
    async updateWorker(
        @Args('id') id: string,
        @Args('teamId') teamId: string,
        @Args('phone', { nullable: true }) phone?: string,
    ) {
        return this.prisma.worker.update({
            where: { id },
            data: {
                phone,
                teamId,
            },
            include: { team: true } // Crucial pour que GraphQL récupère les infos de l'équipe
        });
    }

    // Pour supprimer un ouvrier qui quitte l'entreprise
    @Mutation(() => Boolean)
    async deleteWorker(@Args('id') id: string) {
        await this.prisma.worker.delete({ where: { id } });
        return true;
    }
}