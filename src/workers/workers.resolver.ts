import { Resolver, Query, InputType, Mutation, Args, Field, ResolveField, Parent, Context } from '@nestjs/graphql';
import { Worker } from './worker.model';
import { PrismaService } from '../prisma.service';
import { IsNotEmpty, IsUUID, IsOptional, IsString, IsNumber } from 'class-validator';
import { Team } from 'src/teams/team.model';
import { Inject, Injectable } from '@nestjs/common';

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
export class WorkersService {
    constructor(private prisma: PrismaService) { }

    get() {
        return this.prisma.worker.findMany();
    }

    update(input: UpdateWorkerInput) {
        return this.prisma.worker.update({
            where: { id: input.id },
            data: {
                phone: input.phone,
                teamId: input.teamId,
            },
            include: { team: true } // Crucial pour que GraphQL récupère les infos de l'équipe
        });
    }

    delete(input: deleteWorkerInput) {
        return this.prisma.worker.delete({
            where: { id: input.id },
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



@Resolver(() => Worker)
export class WorkersResolver {
    constructor(private workersService: WorkersService) { }

    // Pour voir tous les ouvriers du système (pratique pour une vue RH)
    @Query(() => [Worker], { name: 'workers' })
    async getWorkers() {
        return this.workersService.get();
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
        try {
            return this.workersService.update(input);
        } catch (e) {
            // Optionnel : logger ou lancer une erreur personnalisée
            throw new Error('Mise à jour impossible : ' + e.message);
        }
    }

    // Pour supprimer un ouvrier qui quitte l'entreprise
    @Mutation(() => Boolean)
    async deleteWorker(@Args('input') input: deleteWorkerInput) {
        try {
            await this.workersService.delete(input);
            return true;
        } catch (e) {
            // Optionnel : logger ou lancer une erreur personnalisée
            throw new Error('Suppression impossible : ' + e.message);
        }
    }

    // 3. Ajouter un ouvrier à une équipe spécifique
    @Mutation(() => Worker)
    addWorkerToTeam(
        @Args('input') input: AddWorkerInput,) {
        return this.workersService.addWorkerToTeam(input);
    }
}