import { Resolver, Query } from '@nestjs/graphql';
import { Site } from './site.model';
import { PrismaService } from '../prisma.service';

@Resolver(() => Site)
export class SitesResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [Site], { name: 'sites' }) // Le nom de la requête GraphQL sera "sites"
  async getSites() {
    return this.prisma.site.findMany();
  }
}