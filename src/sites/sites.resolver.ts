import { Resolver, Query, Mutation, Args, InputType, Field } from '@nestjs/graphql'; // Ajoute Mutation, Args, InputType, Field
import { Site } from './site.model';
import { PrismaService } from '../prisma.service';

// On définit l'objet que le frontend doit envoyer
@InputType()
class CreateSiteInput {
  @Field()
  name: string;

  @Field()
  address: string;

  @Field()
  status: string;

  @Field()
  startDate: string;

  @Field()
  endDate: string;
}

@Resolver(() => Site)
export class SitesResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [Site], { name: 'sites' })
  async getSites() {
    return this.prisma.site.findMany();
  }

  @Mutation(() => Site, { name: 'createSite' })
  async createSite(
    @Args('createSiteInput') input: CreateSiteInput // On l'appelle 'input' pour coller à ton frontend
  ) {
    return this.prisma.site.create({
      data: {
        name: input.name,
        address: input.address,
        status: input.status,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
      },
    });
  }
}