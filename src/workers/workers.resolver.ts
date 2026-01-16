import { Resolver, Query, InputType, Mutation, Args, Field, ResolveField, Parent, Context } from '@nestjs/graphql';
import { Worker } from './worker.model';
import { PrismaService } from '../prisma.service';
import { IsNotEmpty, IsUUID, IsOptional, IsString, IsNumber } from 'class-validator';
import { Team } from 'src/teams/team.model';

@InputType()
class UpdateWorkerInput {
    @Field()
    @IsUUID()
    id: string;

    @Field()
    @IsUUID()
    teamId: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    phone?: string;
}

@InputType()
class deleteWorkerInput {
    @Field()
    @IsUUID()
    id: string;
}


@Resolver(() => Worker)
export class WorkersResolver {
    constructor(private prisma: PrismaService) { }

    // Pour voir tous les ouvriers du système (pratique pour une vue RH)
    @Query(() => [Worker], { name: 'workers' })
    async getWorkers() {
        return this.prisma.worker.findMany();
    }

    @ResolveField(() => Team, { name: 'team' })
    async team(@Parent() worker: Worker, @Context() ctx) {
        return ctx.teamByIdLoader.load(worker.teamId);
    }

    // Pour modifier les coordonnées d'un ouvrier (ex: changement de téléphone)
    @Mutation(() => Worker)
    async updateWorker(
        @Args('input') input: UpdateWorkerInput,
    ) {
        return this.prisma.worker.update({
            where: { id: input.id },
            data: {
                phone: input.phone,
                teamId: input.teamId,
            },
            include: { team: true } // Crucial pour que GraphQL récupère les infos de l'équipe
        });
    }

    // Pour supprimer un ouvrier qui quitte l'entreprise
    @Mutation(() => Boolean)
    async deleteWorker(@Args('input') input: deleteWorkerInput) {
        await this.prisma.worker.delete({ where: { id: input.id } });
        return true;
    }
}